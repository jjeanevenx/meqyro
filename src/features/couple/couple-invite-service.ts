import "server-only";

import { randomBytes } from "node:crypto";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { matchesAnonymousSessionToken } from "@/lib/security/anonymous-session";
import { logEvent } from "@/lib/observability/logger";
import { calculateInvitePrice } from "@/features/couple/invite-pricing";

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
}): Promise<{ inviteCode: string }> {
  const db = createSupabaseSecretClient();

  // Fetch the slot to get host_session_id
  const { data: slot, error: fetchError } = await db
    .from("couple_invite_slots")
    .select("id, host_session_id, status, invite_code")
    .eq("id", input.slotId)
    .single();

  if (fetchError || !slot) {
    throw new Error(`Invite slot not found: ${input.slotId}`);
  }

  const hostSessionId = slot.host_session_id as string;

  // Idempotency: slot already active
  if (slot.status === "ACTIVE" && slot.invite_code) {
    logEvent("info", "invite_slot_already_active", { slotId: input.slotId });
    await ensureGrants(db, hostSessionId, input.orderId);
    return { inviteCode: slot.invite_code as string };
  }

  // For slots in any further state (REDEEMED, COMPLETED, etc.) also return existing code
  if (
    ["REDEEMED", "QUIZ_STARTED", "COMPLETED"].includes(slot.status as string) &&
    slot.invite_code
  ) {
    return { inviteCode: slot.invite_code as string };
  }

  // Generate a unique invite code: CP-XXXXXXXX
  let inviteCode: string | null = null;
  for (let i = 0; i < 5; i++) {
    const candidate = `CP-${randomBytes(4).toString("hex").toUpperCase()}`;
    const { data: existing } = await db
      .from("couple_invite_slots")
      .select("id")
      .eq("invite_code", candidate)
      .maybeSingle();
    if (!existing) {
      inviteCode = candidate;
      break;
    }
  }

  if (!inviteCode) {
    throw new Error("Failed to generate a unique invite code after 5 attempts.");
  }

  const expiresAt = new Date(Date.now() + 14 * 86_400_000).toISOString();

  const { error: updateError } = await db
    .from("couple_invite_slots")
    .update({
      status: "ACTIVE",
      invite_code: inviteCode,
      activated_at: new Date().toISOString(),
      expires_at: expiresAt,
    })
    .eq("id", input.slotId)
    .eq("status", "PENDING_PAYMENT");

  if (updateError) {
    // Check if another concurrent activation already set it to ACTIVE
    const { data: recheck } = await db
      .from("couple_invite_slots")
      .select("status, invite_code")
      .eq("id", input.slotId)
      .single();

    if (recheck?.status === "ACTIVE" && recheck.invite_code) {
      await ensureGrants(db, hostSessionId, input.orderId);
      return { inviteCode: recheck.invite_code as string };
    }

    throw new Error(`Failed to activate invite slot: ${updateError.message}`);
  }

  await ensureGrants(db, hostSessionId, input.orderId);

  logEvent("info", "invite_slot_activated", {
    slotId: input.slotId,
    orderId: input.orderId,
    hostSessionId,
  });

  return { inviteCode };
}

/**
 * Create PREMIUM_REPORT and INVITE_ACCESS grants idempotently for the host.
 */
async function ensureGrants(
  db: ReturnType<typeof createSupabaseSecretClient>,
  hostSessionId: string,
  orderId: string,
): Promise<void> {
  // PREMIUM_REPORT grant — one per host (not per slot)
  const { error: premiumError } = await db.from("result_access_grants").upsert(
    {
      session_id: hostSessionId,
      order_id: orderId,
      product_code: "COUPLEDNA_INVITE",
      grant_type: "PREMIUM_REPORT",
    },
    { onConflict: "order_id,product_code,grant_type", ignoreDuplicates: true },
  );

  if (premiumError) {
    throw new Error(`Failed to create PREMIUM_REPORT grant: ${premiumError.message}`);
  }

  // INVITE_ACCESS grant — one per order/slot
  const { error: inviteError } = await db.from("result_access_grants").upsert(
    {
      session_id: hostSessionId,
      order_id: orderId,
      product_code: "COUPLEDNA_INVITE",
      grant_type: "INVITE_ACCESS",
    },
    { onConflict: "order_id,product_code,grant_type", ignoreDuplicates: true },
  );

  if (inviteError) {
    throw new Error(`Failed to create INVITE_ACCESS grant: ${inviteError.message}`);
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

  const { error: updateError } = await db
    .from("couple_invite_slots")
    .update({
      status: "REDEEMED",
      guest_session_id: input.guestSessionId,
      redeemed_at: new Date().toISOString(),
    })
    .eq("invite_code", normalizedCode)
    .eq("status", "ACTIVE");

  if (updateError) {
    throw new Error(`Failed to redeem invite slot: ${updateError.message}`);
  }

  logEvent("info", "invite_slot_redeemed", {
    inviteCode: "[REDACTED]",
    guestSessionId: input.guestSessionId,
  });
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
