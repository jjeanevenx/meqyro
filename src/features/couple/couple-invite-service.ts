import "server-only";

import { randomBytes } from "node:crypto";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { matchesAnonymousSessionToken } from "@/lib/security/anonymous-session";
import { logEvent } from "@/lib/observability/logger";
import { calculateInvitePrice } from "@/features/couple/invite-pricing";
import { compareBehavioralCouple, type BehavioralScore } from "@/features/scoring/behavioral-v2";
import {
  coupleDnaScoringV1,
  type BilateralCoupleComparison,
  type IndividualCoupleScore,
} from "@/features/scoring/coupledna";
import { buildParticipantCoupleReport } from "@/features/results/behavioral-couple-report";
import { findPaidEntitlement } from "@/features/commerce/entitlement-service";
import type { ComprehensiveReport } from "@/features/results/contracts";

export type CoupleInviteSlot = {
  id: string;
  hostSessionId: string;
  orderId: string | null;
  inviteCode: string | null;
  guestSessionId: string | null;
  hostNameForGuest: string | null;
  slotNumber: number;
  status: string;
  priceAmount: number;
  priceCurrency: string;
  stripeCheckoutSessionId: string | null;
  pendingExpiresAt: string | null;
  activatedAt: string | null;
  expiresAt: string | null;
  redeemedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function mapSlot(row: Record<string, unknown>): CoupleInviteSlot {
  return {
    id: row.id as string,
    hostSessionId: row.host_session_id as string,
    orderId: (row.order_id as string | null) ?? null,
    inviteCode: (row.invite_code as string | null) ?? null,
    guestSessionId: (row.guest_session_id as string | null) ?? null,
    hostNameForGuest: (row.host_name_for_guest as string | null) ?? null,
    slotNumber: row.slot_number as number,
    status: row.status as string,
    priceAmount: row.price_amount as number,
    priceCurrency: row.price_currency as string,
    stripeCheckoutSessionId: (row.stripe_checkout_session_id as string | null) ?? null,
    pendingExpiresAt: (row.pending_expires_at as string | null) ?? null,
    activatedAt: (row.activated_at as string | null) ?? null,
    expiresAt: (row.expires_at as string | null) ?? null,
    redeemedAt: (row.redeemed_at as string | null) ?? null,
    completedAt: (row.completed_at as string | null) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

async function verifyHostSession(
  db: ReturnType<typeof createSupabaseSecretClient>,
  hostSessionId: string,
  hostToken: string,
): Promise<void> {
  const { data: session, error } = await db
    .from("quiz_sessions")
    .select("id, access_token_hash, quiz_versions!inner(quizzes!inner(slug))")
    .eq("id", hostSessionId)
    .single();

  if (error || !session) {
    throw new Error("Host session not found.");
  }

  const record = session as unknown as {
    access_token_hash: string;
    quiz_versions: { quizzes: { slug: string } };
  };

  if (!matchesAnonymousSessionToken(hostToken, record.access_token_hash)) {
    throw new Error("Invalid host session token.");
  }

  if (record.quiz_versions.quizzes.slug !== "coupledna") {
    throw new Error("Host session is not for the CoupleDNA quiz.");
  }
}

/**
 * Create a new invite slot in PENDING_PAYMENT state.
 * Verifies host identity and calculates the correct price.
 * Retries once on slot_number uniqueness conflict (concurrent requests).
 */
export async function createInviteSlot(input: {
  hostSessionId: string;
  hostToken: string;
  market: string;
  hostNameForGuest?: string;
}): Promise<CoupleInviteSlot> {
  const db = createSupabaseSecretClient();

  await verifyHostSession(db, input.hostSessionId, input.hostToken);

  // Retry loop for concurrent slot_number conflict (D-004, P0-SEC-04)
  for (let attempt = 0; attempt < 3; attempt++) {
    const { amount, currency, slotNumber } = await calculateInvitePrice(
      input.hostSessionId,
      input.market,
    );

    const { data: slot, error: insertError } = await db
      .from("couple_invite_slots")
      .insert({
        host_session_id: input.hostSessionId,
        slot_number: slotNumber,
        status: "PENDING_PAYMENT",
        price_amount: amount,
        price_currency: currency,
        host_name_for_guest: input.hostNameForGuest ?? null,
      })
      .select()
      .single();

    if (!insertError && slot) {
      logEvent("info", "invite_slot_created", {
        slotId: slot.id,
        hostSessionId: input.hostSessionId,
        slotNumber,
        market: input.market,
      });
      return mapSlot(slot as unknown as Record<string, unknown>);
    }

    // Postgres unique violation on (host_session_id, slot_number) → retry
    if (insertError?.code === "23505") {
      continue;
    }

    throw new Error(`Failed to create invite slot: ${insertError?.message ?? "unknown error"}`);
  }

  throw new Error("Failed to create invite slot after retries (concurrent request conflict).");
}

/**
 * Attach a Stripe Checkout session and order to an invite slot after checkout creation.
 */
export async function attachCheckoutToSlot(input: {
  slotId: string;
  orderId: string;
  stripeCheckoutSessionId: string;
  pendingExpiresAt: Date;
}): Promise<void> {
  const db = createSupabaseSecretClient();

  const { error: slotError } = await db
    .from("couple_invite_slots")
    .update({
      order_id: input.orderId,
      stripe_checkout_session_id: input.stripeCheckoutSessionId,
      pending_expires_at: input.pendingExpiresAt.toISOString(),
    })
    .eq("id", input.slotId)
    .eq("status", "PENDING_PAYMENT");

  if (slotError) {
    throw new Error(`Failed to attach checkout to slot: ${slotError.message}`);
  }

  const { error: orderError } = await db
    .from("orders")
    .update({ couple_invite_slot_id: input.slotId })
    .eq("id", input.orderId);

  if (orderError) {
    throw new Error(`Failed to link slot to order: ${orderError.message}`);
  }
}

/**
 * Activate an invite slot after confirmed payment.
 * Generates the invite_code, creates PREMIUM_REPORT and INVITE_ACCESS grants.
 * Idempotent: safe to call multiple times.
 */
export async function activateInviteSlot(input: {
  slotId: string;
  orderId: string;
}): Promise<{ inviteCode: string | null }> {
  const db = createSupabaseSecretClient();

  // Fetch the slot to get host_session_id
  const { data: slot, error: fetchError } = await db
    .from("couple_invite_slots")
    .select(
      "id, host_session_id, order_id, status, invite_code, expires_at, activation_completed_at",
    )
    .eq("id", input.slotId)
    .single();

  if (fetchError || !slot) {
    throw new Error(`Invite slot not found: ${input.slotId}`);
  }

  const hostSessionId = slot.host_session_id as string;

  const { data: order, error: orderError } = await db
    .from("orders")
    .select("status, session_id, couple_invite_slot_id")
    .eq("id", input.orderId)
    .single();
  if (
    orderError ||
    !order ||
    order.status !== "FULFILLED" ||
    order.session_id !== hostSessionId ||
    order.couple_invite_slot_id !== input.slotId ||
    slot.order_id !== input.orderId
  ) {
    throw new Error("Invite activation requires its matching fulfilled order.");
  }

  const recoverableStates = ["PENDING_PAYMENT", "ACTIVE", "REDEEMED", "QUIZ_STARTED", "COMPLETED"];
  // Replaying payment must not reopen an expired, cancelled or revoked invitation.
  if (!recoverableStates.includes(slot.status as string)) {
    return { inviteCode: (slot.invite_code as string | null) ?? null };
  }
  if (slot.invite_code) {
    if (!slot.activation_completed_at) {
      await completeInviteActivation(
        db,
        input,
        hostSessionId,
        slot.invite_code as string,
        slot.expires_at as string | null,
      );
    }
    return { inviteCode: slot.invite_code as string };
  }
  if (slot.status !== "PENDING_PAYMENT") {
    throw new Error("Activated invitation is missing its code.");
  }

  // Generate a unique invite code: CP-XXXXXXXX
  let inviteCode: string | null = null;
  for (let i = 0; i < 5; i++) {
    const candidate = `CP-${randomBytes(4).toString("hex").toUpperCase()}`;
    const { data: existing, error: codeError } = await db
      .from("couple_invite_slots")
      .select("id")
      .eq("invite_code", candidate)
      .maybeSingle();
    if (codeError) throw new Error("Unable to verify invite code uniqueness.");
    if (!existing) {
      inviteCode = candidate;
      break;
    }
  }

  if (!inviteCode) {
    throw new Error("Failed to generate a unique invite code after 5 attempts.");
  }

  const expiresAt = new Date(Date.now() + 14 * 86_400_000).toISOString();

  const { data: activated, error: updateError } = await db
    .from("couple_invite_slots")
    .update({
      status: "ACTIVE",
      invite_code: inviteCode,
      activated_at: new Date().toISOString(),
      expires_at: expiresAt,
    })
    .eq("id", input.slotId)
    .eq("order_id", input.orderId)
    .eq("status", "PENDING_PAYMENT")
    .select("invite_code, expires_at")
    .maybeSingle();

  if (updateError || !activated) {
    // A conditional update can affect zero rows without returning an error.
    // Always use the persisted winner's code and expiry after a concurrent activation.
    const { data: recheck, error: recheckError } = await db
      .from("couple_invite_slots")
      .select("status, invite_code, expires_at")
      .eq("id", input.slotId)
      .eq("order_id", input.orderId)
      .single();

    if (
      !recheckError &&
      recheck?.invite_code &&
      recoverableStates.includes(recheck.status as string)
    ) {
      await completeInviteActivation(
        db,
        input,
        hostSessionId,
        recheck.invite_code as string,
        recheck.expires_at as string | null,
      );
      return { inviteCode: recheck.invite_code as string };
    }

    throw new Error("Unable to persist invite activation. Please retry.");
  }

  await completeInviteActivation(
    db,
    input,
    hostSessionId,
    activated.invite_code as string,
    activated.expires_at as string | null,
  );

  logEvent("info", "invite_slot_activated", {
    slotId: input.slotId,
    orderId: input.orderId,
    hostSessionId,
  });

  return { inviteCode: activated.invite_code as string };
}

async function completeInviteActivation(
  db: ReturnType<typeof createSupabaseSecretClient>,
  input: { slotId: string; orderId: string },
  hostSessionId: string,
  inviteCode: string,
  expiresAt: string | null,
): Promise<void> {
  if (!expiresAt) throw new Error("Invite activation is missing its persisted expiration.");
  await ensureGrants(db, hostSessionId, input.orderId);
  await ensureSlotInviteAndHostConsent(db, input.slotId, hostSessionId, inviteCode, expiresAt);
  const { data: completed, error } = await db
    .from("couple_invite_slots")
    .update({ activation_completed_at: new Date().toISOString() })
    .eq("id", input.slotId)
    .eq("order_id", input.orderId)
    .in("status", ["ACTIVE", "REDEEMED", "QUIZ_STARTED", "COMPLETED"])
    .select("id")
    .maybeSingle();
  if (error || !completed) throw new Error("Unable to complete invite activation. Please retry.");
}

/**
 * Synchronize couple_invites and host couple_consents for an activated slot
 * so bilateral session creation, consent, and comparison work seamlessly.
 */
async function ensureSlotInviteAndHostConsent(
  db: ReturnType<typeof createSupabaseSecretClient>,
  slotId: string,
  hostSessionId: string,
  inviteCode: string,
  expiresAt: string,
): Promise<void> {
  const { data: existingInvite, error: lookupError } = await db
    .from("couple_invites")
    .select("id")
    .eq("invite_code", inviteCode)
    .maybeSingle();
  if (lookupError) throw new Error("Unable to verify the activated invitation.");

  let inviteId = existingInvite?.id as string | undefined;
  if (!inviteId) {
    const { data: createdInvite, error: createError } = await db
      .from("couple_invites")
      .insert({
        invite_code: inviteCode,
        initiator_session_id: hostSessionId,
        expires_at: expiresAt,
        status: "PENDING",
      })
      .select("id")
      .maybeSingle();
    if (createError && createError.code !== "23505") {
      throw new Error("Unable to create the activated invitation.");
    }
    inviteId = createdInvite?.id as string | undefined;
    if (!inviteId && createError?.code === "23505") {
      const { data: concurrentInvite, error: concurrentError } = await db
        .from("couple_invites")
        .select("id")
        .eq("invite_code", inviteCode)
        .maybeSingle();
      if (concurrentError) throw new Error("Unable to verify the activated invitation.");
      inviteId = concurrentInvite?.id as string | undefined;
    }
  }

  if (!inviteId) throw new Error("Activated invitation was not persisted.");
  const { error: consentError } = await db.from("couple_consents").upsert(
    {
      invite_id: inviteId,
      invite_slot_id: slotId,
      session_id: hostSessionId,
      can_share_comparison: true,
      consented_at: new Date().toISOString(),
    },
    { onConflict: "invite_id,session_id", ignoreDuplicates: true },
  );
  if (consentError) throw new Error("Unable to persist initial invite consent.");
}

/**
 * Create PREMIUM_REPORT and INVITE_ACCESS grants idempotently for the host.
 */
async function ensureGrants(
  db: ReturnType<typeof createSupabaseSecretClient>,
  hostSessionId: string,
  orderId: string,
): Promise<void> {
  const grantTypes = ["PREMIUM_REPORT", "INVITE_ACCESS"] as const;
  for (const grantType of grantTypes) {
    const { error } = await db.from("result_access_grants").insert({
      session_id: hostSessionId,
      order_id: orderId,
      product_code: "COUPLEDNA_INVITE",
      grant_type: grantType,
    });
    if (error && error.code !== "23505") {
      throw new Error(`Failed to create ${grantType} grant: ${error.message}`);
    }
  }
}

/**
 * Cancel an invite slot that failed to complete payment.
 * Only acts on PENDING_PAYMENT slots. No-op otherwise.
 */
export async function cancelInviteSlot(slotId: string): Promise<void> {
  const db = createSupabaseSecretClient();

  const { error } = await db
    .from("couple_invite_slots")
    .update({ status: "CANCELLED" })
    .eq("id", slotId)
    .eq("status", "PENDING_PAYMENT");

  if (error) {
    throw new Error(`Failed to cancel invite slot: ${error.message}`);
  }
}

/**
 * Validate an invite code before a guest redeems it.
 */
export async function validateInviteForRedemption(inviteCode: string): Promise<{
  slotId: string;
  hostSessionId: string;
  isValid: boolean;
  reason?: string;
}> {
  const db = createSupabaseSecretClient();
  const normalizedCode = inviteCode.trim().toUpperCase();

  const { data: slot, error } = await db
    .from("couple_invite_slots")
    .select("id, host_session_id, status, expires_at, guest_session_id")
    .eq("invite_code", normalizedCode)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to look up invite code: ${error.message}`);
  }

  if (!slot) {
    return { slotId: "", hostSessionId: "", isValid: false, reason: "NOT_FOUND" };
  }

  const slotId = slot.id as string;
  const hostSessionId = slot.host_session_id as string;

  if (
    (slot.status as string) === "REDEEMED" ||
    (slot.status as string) === "QUIZ_STARTED" ||
    (slot.status as string) === "COMPLETED"
  ) {
    return { slotId, hostSessionId, isValid: false, reason: "ALREADY_REDEEMED" };
  }

  if ((slot.status as string) !== "ACTIVE") {
    return { slotId, hostSessionId, isValid: false, reason: "NOT_ACTIVE" };
  }

  if (slot.expires_at && new Date(slot.expires_at as string) <= new Date()) {
    return { slotId, hostSessionId, isValid: false, reason: "EXPIRED" };
  }

  return { slotId, hostSessionId, isValid: true };
}

/**
 * Redeem an invite slot: associate the guest session with the slot.
 * Idempotent if the same guest attempts to redeem again.
 */
export async function redeemInviteSlot(input: {
  inviteCode: string;
  guestSessionId: string;
  guestToken: string;
}): Promise<void> {
  const db = createSupabaseSecretClient();

  // Verify guest session token
  const { data: guestSession, error: guestError } = await db
    .from("quiz_sessions")
    .select("id, access_token_hash")
    .eq("id", input.guestSessionId)
    .single();

  if (guestError || !guestSession) {
    throw new Error("Guest session not found.");
  }

  if (!matchesAnonymousSessionToken(input.guestToken, guestSession.access_token_hash as string)) {
    throw new Error("Invalid guest session token.");
  }

  const normalizedCode = input.inviteCode.trim().toUpperCase();

  const { data: slot, error: slotError } = await db
    .from("couple_invite_slots")
    .select("id, host_session_id, guest_session_id, status, expires_at")
    .eq("invite_code", normalizedCode)
    .maybeSingle();

  if (slotError || !slot) {
    throw new Error("Invite code not found.");
  }

  const hostSessionId = slot.host_session_id as string;

  // Guest cannot be the host
  if (hostSessionId === input.guestSessionId) {
    throw new Error("Host cannot redeem their own invite.");
  }

  // Idempotency: same guest already redeemed
  if (
    (slot.status === "REDEEMED" || slot.status === "QUIZ_STARTED" || slot.status === "COMPLETED") &&
    slot.guest_session_id === input.guestSessionId
  ) {
    await syncGuestRedemptionRecords(
      db,
      slot.id as string,
      hostSessionId,
      input.guestSessionId,
      normalizedCode,
    );
    return;
  }

  // Already redeemed by a different guest
  if (
    (slot.status === "REDEEMED" || slot.status === "QUIZ_STARTED" || slot.status === "COMPLETED") &&
    slot.guest_session_id !== null &&
    slot.guest_session_id !== input.guestSessionId
  ) {
    throw new Error("ALREADY_REDEEMED");
  }

  if (slot.status !== "ACTIVE") {
    throw new Error(`Invite slot is not active (status: ${slot.status}).`);
  }

  if (slot.expires_at && new Date(slot.expires_at as string) <= new Date()) {
    throw new Error("Invite code has expired.");
  }

  const { data: redeemed, error: updateError } = await db
    .from("couple_invite_slots")
    .update({
      status: "REDEEMED",
      guest_session_id: input.guestSessionId,
      redeemed_at: new Date().toISOString(),
    })
    .eq("invite_code", normalizedCode)
    .eq("status", "ACTIVE")
    .select("id")
    .maybeSingle();

  if (updateError) {
    throw new Error(`Failed to redeem invite slot: ${updateError.message}`);
  }
  if (!redeemed) {
    const { data: winner, error: winnerError } = await db
      .from("couple_invite_slots")
      .select("guest_session_id,status")
      .eq("id", slot.id)
      .maybeSingle();
    if (winnerError || !winner) throw new Error("Unable to verify invite redemption.");
    if (winner.guest_session_id !== input.guestSessionId) throw new Error("ALREADY_REDEEMED");
    if (!["REDEEMED", "QUIZ_STARTED", "COMPLETED"].includes(winner.status as string)) {
      throw new Error("Invite slot is no longer redeemable.");
    }
  }

  await syncGuestRedemptionRecords(
    db,
    slot.id as string,
    hostSessionId,
    input.guestSessionId,
    normalizedCode,
  );

  logEvent("info", "invite_slot_redeemed", {
    inviteCode: "[REDACTED]",
    guestSessionId: input.guestSessionId,
  });
}

async function syncGuestRedemptionRecords(
  db: ReturnType<typeof createSupabaseSecretClient>,
  slotId: string,
  hostSessionId: string,
  guestSessionId: string,
  inviteCode: string,
): Promise<void> {
  // Activation owns the host's invitation and initial consent. Guest retries may
  // bind the partner, but must never renew the host's authorization or expiry.
  const { data: existingInvite, error: inviteError } = await db
    .from("couple_invites")
    .select("id, initiator_session_id, partner_session_id")
    .eq("invite_code", inviteCode)
    .maybeSingle();

  if (inviteError || !existingInvite || existingInvite.initiator_session_id !== hostSessionId) {
    throw new Error("Unable to verify the activated invitation.");
  }
  const inviteId = existingInvite.id as string;
  if (existingInvite.partner_session_id && existingInvite.partner_session_id !== guestSessionId) {
    throw new Error("ALREADY_REDEEMED");
  }
  if (!existingInvite.partner_session_id) {
    const { data: bound, error: bindError } = await db
      .from("couple_invites")
      .update({
        partner_session_id: guestSessionId,
        status: "ACCEPTED",
        updated_at: new Date().toISOString(),
      })
      .eq("id", inviteId)
      .is("partner_session_id", null)
      .select("id")
      .maybeSingle();
    if (bindError) throw new Error("Unable to persist invite participant.");
    if (!bound) {
      const { data: winner, error: winnerError } = await db
        .from("couple_invites")
        .select("partner_session_id")
        .eq("id", inviteId)
        .maybeSingle();
      if (winnerError || !winner) throw new Error("Unable to verify invite participant.");
      if (winner.partner_session_id !== guestSessionId) throw new Error("ALREADY_REDEEMED");
    }
  }

  // Initialize only the accepting guest. A replay cannot overwrite a later
  // withdrawal; renewing consent belongs to the explicit consent endpoint.
  const { error: consentError } = await db.from("couple_consents").upsert(
    {
      invite_id: inviteId,
      invite_slot_id: slotId,
      session_id: guestSessionId,
      can_share_comparison: true,
      consented_at: new Date().toISOString(),
    },
    { onConflict: "invite_id,session_id", ignoreDuplicates: true },
  );
  if (consentError) throw new Error("Unable to persist guest comparison consent.");
}

/**
 * List all invite slots for a host, ordered by slot_number.
 */
export async function listHostInviteSlots(input: {
  hostSessionId: string;
  hostToken: string;
}): Promise<CoupleInviteSlot[]> {
  const db = createSupabaseSecretClient();

  await verifyHostSession(db, input.hostSessionId, input.hostToken);

  const { data: slots, error } = await db
    .from("couple_invite_slots")
    .select("*")
    .eq("host_session_id", input.hostSessionId)
    .order("slot_number", { ascending: true });

  if (error) {
    throw new Error(`Failed to list invite slots: ${error.message}`);
  }

  return (slots ?? []).map((s) => mapSlot(s as unknown as Record<string, unknown>));
}

export type SlotComparisonState =
  | "PENDING_PAYMENT"
  | "WAITING_PARTNER"
  | "WAITING_RESULTS"
  | "CONSENT_REQUIRED"
  | "PAYMENT_REQUIRED"
  | "READY"
  | "EXPIRED"
  | "CANCELLED";

export type HostInviteSlotWithState = CoupleInviteSlot & {
  comparisonState: SlotComparisonState;
  inviteUrl: string | null;
};

export type SlotComparisonResult = {
  slotId: string;
  slotNumber: number;
  inviteCode: string | null;
  guestLabel: string | null;
  state: SlotComparisonState;
  consentGiven: boolean;
  comparison?: BilateralCoupleComparison;
  report?: ComprehensiveReport;
};

/**
 * List all invite slots for a host enriched with comparison readiness and inviteUrl.
 * Invite URLs are ONLY generated for paid/active slots (never for PENDING_PAYMENT or CANCELLED).
 */
export async function listHostInviteSlotsWithState(input: {
  hostSessionId: string;
  hostToken: string;
  locale?: string;
}): Promise<HostInviteSlotWithState[]> {
  const slots = await listHostInviteSlots({
    hostSessionId: input.hostSessionId,
    hostToken: input.hostToken,
  });
  const language = ["pt", "en", "es", "fr"].includes(input.locale ?? "") ? input.locale! : "pt";
  const siteBase = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://meqyro.com";

  const enriched: HostInviteSlotWithState[] = [];
  for (const slot of slots) {
    const canShareLink =
      Boolean(slot.inviteCode) &&
      ["ACTIVE", "REDEEMED", "QUIZ_STARTED", "COMPLETED"].includes(slot.status);
    const inviteUrl = canShareLink ? `${siteBase}/${language}/couple/${slot.inviteCode}` : null;

    let comparisonState: SlotComparisonState = "PENDING_PAYMENT";
    if (slot.status === "CANCELLED" || slot.status === "REVOKED") {
      comparisonState = "CANCELLED";
    } else if (slot.status === "PENDING_PAYMENT") {
      comparisonState = "PENDING_PAYMENT";
    } else {
      const comp = await getSlotComparison({
        slotId: slot.id,
        sessionId: input.hostSessionId,
        sessionToken: input.hostToken,
        locale: language,
      });
      comparisonState = comp.state;
    }

    enriched.push({
      ...slot,
      inviteCode: canShareLink ? slot.inviteCode : null,
      comparisonState,
      inviteUrl,
    });
  }

  return enriched;
}

/**
 * Retrieve the bilateral comparison and localized report for a specific invite slot.
 * Enforces strict server-side authorization:
 * - Only the host (slot.host_session_id) or the specific guest (slot.guest_session_id) may access.
 * - Any other guest or third-party session is rejected with UNAUTHORIZED_SLOT_ACCESS.
 * - Private host_name_for_guest and inviteCode are only returned to the host.
 */
export async function getSlotComparison(input: {
  slotId: string;
  sessionId: string;
  sessionToken: string;
  locale?: string;
}): Promise<SlotComparisonResult> {
  const db = createSupabaseSecretClient();

  // 1. Authenticate caller session
  const { data: callerSession, error: callerError } = await db
    .from("quiz_sessions")
    .select("id, access_token_hash, quiz_versions!inner(quizzes!inner(slug))")
    .eq("id", input.sessionId)
    .single();

  if (callerError || !callerSession) {
    throw new Error("UNAUTHORIZED_SLOT_ACCESS");
  }

  const callerRecord = callerSession as unknown as {
    access_token_hash: string;
    quiz_versions: { quizzes: { slug: string } };
  };

  if (
    callerRecord.quiz_versions.quizzes.slug !== "coupledna" ||
    !matchesAnonymousSessionToken(input.sessionToken, callerRecord.access_token_hash)
  ) {
    throw new Error("UNAUTHORIZED_SLOT_ACCESS");
  }

  // 2. Load slot
  const { data: rawSlot, error: slotError } = await db
    .from("couple_invite_slots")
    .select("*")
    .eq("id", input.slotId)
    .maybeSingle();

  if (slotError || !rawSlot) {
    throw new Error("SLOT_NOT_FOUND");
  }

  const slot = mapSlot(rawSlot as unknown as Record<string, unknown>);
  const isHost = input.sessionId === slot.hostSessionId;
  const isGuest = Boolean(slot.guestSessionId && input.sessionId === slot.guestSessionId);

  if (!isHost && !isGuest) {
    throw new Error("UNAUTHORIZED_SLOT_ACCESS");
  }

  const base = {
    slotId: slot.id,
    slotNumber: slot.slotNumber,
    inviteCode: isHost ? slot.inviteCode : null,
    guestLabel: isHost ? slot.hostNameForGuest : null,
  };

  if (slot.status === "CANCELLED" || slot.status === "REVOKED") {
    return { ...base, state: "CANCELLED", consentGiven: false };
  }

  if (slot.status === "PENDING_PAYMENT" || !slot.inviteCode) {
    return { ...base, inviteCode: null, state: "PENDING_PAYMENT", consentGiven: false };
  }

  if (
    slot.status === "EXPIRED" ||
    (!slot.guestSessionId && slot.expiresAt && new Date(slot.expiresAt) <= new Date())
  ) {
    return { ...base, state: "EXPIRED", consentGiven: false };
  }

  // 3. Check consents
  const { data: inviteRow, error: inviteError } = await db
    .from("couple_invites")
    .select("id")
    .eq("invite_code", slot.inviteCode)
    .maybeSingle();
  if (inviteError) throw new Error("Unable to verify comparison consent. Please retry.");

  const { data: consents, error: consentError } = inviteRow
    ? await db
        .from("couple_consents")
        .select("session_id, can_share_comparison")
        .eq("invite_id", inviteRow.id)
    : await db
        .from("couple_consents")
        .select("session_id, can_share_comparison")
        .eq("invite_slot_id", slot.id);
  if (consentError) throw new Error("Unable to verify comparison consent. Please retry.");

  // Missing authorization is not consent, including incomplete legacy records.
  const hostConsentRow = consents?.find((c) => c.session_id === slot.hostSessionId);
  const guestConsentRow = slot.guestSessionId
    ? consents?.find((c) => c.session_id === slot.guestSessionId)
    : undefined;

  const hostConsented = Boolean(hostConsentRow?.can_share_comparison);
  const guestConsented = Boolean(guestConsentRow?.can_share_comparison);
  const consentGiven = isHost ? hostConsented : guestConsented;

  if (!slot.guestSessionId) {
    return { ...base, state: "WAITING_PARTNER", consentGiven };
  }

  if (!hostConsented || !guestConsented) {
    return { ...base, state: "CONSENT_REQUIRED", consentGiven };
  }

  // 4. Check results for both host and guest
  const { data: results, error: resultError } = await db
    .from("results")
    .select("session_id, score, quiz_sessions!inner(status)")
    .in("session_id", [slot.hostSessionId, slot.guestSessionId]);

  if (resultError) {
    throw new Error(`Failed to load pair results: ${resultError.message}`);
  }

  const hostResult = results?.find((r) => r.session_id === slot.hostSessionId);
  const guestResult = results?.find((r) => r.session_id === slot.guestSessionId);

  if (
    !hostResult ||
    !guestResult ||
    (hostResult.quiz_sessions as unknown as { status: string }).status !== "COMPLETED" ||
    (guestResult.quiz_sessions as unknown as { status: string }).status !== "COMPLETED"
  ) {
    return { ...base, state: "WAITING_RESULTS", consentGiven };
  }

  // 5. Verify paid entitlement for this slot / host
  const slotEntitlement =
    (await findPaidEntitlement(slot.hostSessionId, "COUPLEDNA_INVITE", false, slot.id)) ??
    (await findPaidEntitlement(slot.hostSessionId, "COUPLEDNA", false));

  if (!slotEntitlement) {
    return { ...base, state: "PAYMENT_REQUIRED", consentGiven };
  }

  const scoreA = hostResult.score as Record<string, unknown>;
  const scoreB = guestResult.score as Record<string, unknown>;
  const comparison =
    scoreA.algorithmVersion === "behavioral-v2" || scoreB.algorithmVersion === "behavioral-v2"
      ? compareBehavioralCouple(
          scoreA as unknown as BehavioralScore,
          scoreB as unknown as BehavioralScore,
        )
      : coupleDnaScoringV1.compareBilateral(
          scoreA as unknown as IndividualCoupleScore,
          scoreB as unknown as IndividualCoupleScore,
          true,
        );

  const callerScore = isHost ? scoreA : scoreB;
  const language = ["pt", "en", "es", "fr"].includes(input.locale ?? "") ? input.locale! : "pt";
  const report = buildParticipantCoupleReport(comparison, callerScore, language);

  return {
    ...base,
    state: "READY",
    consentGiven,
    comparison,
    report,
  };
}

/**
 * Mark a slot as QUIZ_STARTED when the guest begins the quiz.
 * No-op if the slot is not in REDEEMED state.
 */
export async function markSlotQuizStarted(guestSessionId: string): Promise<void> {
  const db = createSupabaseSecretClient();

  const { error } = await db
    .from("couple_invite_slots")
    .update({ status: "QUIZ_STARTED" })
    .eq("guest_session_id", guestSessionId)
    .eq("status", "REDEEMED");

  if (error) {
    throw new Error(`Failed to mark slot as QUIZ_STARTED: ${error.message}`);
  }
}

/**
 * Mark a slot as COMPLETED when the guest finishes the quiz.
 * No-op if the slot is not in REDEEMED or QUIZ_STARTED state.
 */
export async function markSlotCompleted(guestSessionId: string): Promise<void> {
  const db = createSupabaseSecretClient();

  const { error } = await db
    .from("couple_invite_slots")
    .update({
      status: "COMPLETED",
      completed_at: new Date().toISOString(),
    })
    .eq("guest_session_id", guestSessionId)
    .in("status", ["REDEEMED", "QUIZ_STARTED"]);

  if (error) {
    throw new Error(`Failed to mark slot as COMPLETED: ${error.message}`);
  }
}
