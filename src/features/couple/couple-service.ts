import "server-only";

import { randomBytes } from "node:crypto";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { matchesAnonymousSessionToken } from "@/lib/security/anonymous-session";
import { logEvent } from "@/lib/observability/logger";
import {
  coupleDnaScoringV1,
  type BilateralCoupleComparison,
  type IndividualCoupleScore,
} from "@/features/scoring/coupledna";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://meqyro.com";

function generateInviteCode(): string {
  return `CP-${randomBytes(4).toString("hex").toUpperCase()}`;
}

export async function createCoupleInvite(
  initiatorSessionId: string,
  initiatorToken: string,
  locale = "pt",
): Promise<{ inviteCode: string; inviteUrl: string; inviteId: string } | null> {
  const supabase = createSupabaseSecretClient();

  const { data: session, error: sessionErr } = await supabase
    .schema("meqyro")
    .from("quiz_sessions")
    .select("id, access_token_hash")
    .eq("id", initiatorSessionId)
    .single();

  if (sessionErr || !session || !matchesAnonymousSessionToken(initiatorToken, session.access_token_hash)) {
    return null;
  }

  const inviteCode = generateInviteCode();
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

  const { data: invite, error: inviteErr } = await supabase
    .schema("meqyro")
    .from("couple_invites")
    .insert({
      invite_code: inviteCode,
      initiator_session_id: initiatorSessionId,
      status: "PENDING",
      expires_at: expiresAt,
    })
    .select("id")
    .single();

  if (inviteErr || !invite) {
    logEvent("error", "couple_invite_create_failed", { message: inviteErr?.message });
    return null;
  }

  // Register initiator bilateral consent
  await supabase
    .schema("meqyro")
    .from("couple_consents")
    .insert({
      invite_id: invite.id,
      session_id: initiatorSessionId,
      can_share_comparison: true,
    });

  const inviteUrl = `${SITE_URL}/${locale}/quizzes/coupledna/play?invite=${inviteCode}`;

  logEvent("info", "couple_invite_created", {
    inviteCode,
    initiatorSessionId,
  });

  return {
    inviteCode,
    inviteUrl,
    inviteId: invite.id,
  };
}

export async function acceptCoupleInvite(
  inviteCode: string,
  partnerSessionId: string,
  partnerToken: string,
): Promise<{ success: boolean; inviteId: string } | null> {
  const supabase = createSupabaseSecretClient();

  const { data: session, error: sessionErr } = await supabase
    .schema("meqyro")
    .from("quiz_sessions")
    .select("id, access_token_hash")
    .eq("id", partnerSessionId)
    .single();

  if (sessionErr || !session || !matchesAnonymousSessionToken(partnerToken, session.access_token_hash)) {
    return null;
  }

  const { data: invite, error: inviteErr } = await supabase
    .schema("meqyro")
    .from("couple_invites")
    .select("id, initiator_session_id, status, expires_at")
    .eq("invite_code", inviteCode.trim().toUpperCase())
    .single();

  if (inviteErr || !invite) {
    return null;
  }

  if (new Date(invite.expires_at) < new Date()) {
    return null;
  }

  // Partner cannot be the initiator
  if (invite.initiator_session_id === partnerSessionId) {
    return { success: true, inviteId: invite.id };
  }

  // Update invite with partner session
  await supabase
    .schema("meqyro")
    .from("couple_invites")
    .update({
      partner_session_id: partnerSessionId,
      status: "ACCEPTED",
      updated_at: new Date().toISOString(),
    })
    .eq("id", invite.id);

  // Register partner bilateral consent
  await supabase
    .schema("meqyro")
    .from("couple_consents")
    .upsert(
      {
        invite_id: invite.id,
        session_id: partnerSessionId,
        can_share_comparison: true,
      },
      { onConflict: "invite_id,session_id" },
    );

  logEvent("info", "couple_invite_accepted", {
    inviteCode,
    partnerSessionId,
  });

  return { success: true, inviteId: invite.id };
}

export async function getCoupleComparison(
  inviteCode: string,
  requestingSessionId: string,
  requestingToken: string,
): Promise<BilateralCoupleComparison | null> {
  const supabase = createSupabaseSecretClient();

  const { data: session, error: sessionErr } = await supabase
    .schema("meqyro")
    .from("quiz_sessions")
    .select("id, access_token_hash")
    .eq("id", requestingSessionId)
    .single();

  if (sessionErr || !session || !matchesAnonymousSessionToken(requestingToken, session.access_token_hash)) {
    return null;
  }

  const { data: invite, error: inviteErr } = await supabase
    .schema("meqyro")
    .from("couple_invites")
    .select("id, initiator_session_id, partner_session_id, status")
    .eq("invite_code", inviteCode.trim().toUpperCase())
    .single();

  if (inviteErr || !invite) {
    return null;
  }

  // Validate requester is a participant
  if (
    requestingSessionId !== invite.initiator_session_id &&
    requestingSessionId !== invite.partner_session_id
  ) {
    return null;
  }

  if (!invite.partner_session_id) {
    // Partner has not joined yet
    return coupleDnaScoringV1.compareBilateral(
      { dimensionScores: { COMMUNICATION: 0, LIFE_VALUES: 0, CONFLICT_MANAGEMENT: 0, FINANCES: 0, FUTURE_PLANS: 0 }, totalResponses: 0 },
      { dimensionScores: { COMMUNICATION: 0, LIFE_VALUES: 0, CONFLICT_MANAGEMENT: 0, FINANCES: 0, FUTURE_PLANS: 0 }, totalResponses: 0 },
      false,
    );
  }

  // Check bilateral consents: both participants must have explicitly consented
  const { data: consents } = await supabase
    .schema("meqyro")
    .from("couple_consents")
    .select("session_id, can_share_comparison")
    .eq("invite_id", invite.id)
    .eq("can_share_comparison", true);

  const hasInitiatorConsent = consents?.some((c) => c.session_id === invite.initiator_session_id);
  const hasPartnerConsent = consents?.some((c) => c.session_id === invite.partner_session_id);

  if (!hasInitiatorConsent || !hasPartnerConsent) {
    return coupleDnaScoringV1.compareBilateral(
      { dimensionScores: { COMMUNICATION: 0, LIFE_VALUES: 0, CONFLICT_MANAGEMENT: 0, FINANCES: 0, FUTURE_PLANS: 0 }, totalResponses: 0 },
      { dimensionScores: { COMMUNICATION: 0, LIFE_VALUES: 0, CONFLICT_MANAGEMENT: 0, FINANCES: 0, FUTURE_PLANS: 0 }, totalResponses: 0 },
      false,
    );
  }

  // Fetch results for both sessions
  const { data: results } = await supabase
    .schema("meqyro")
    .from("results")
    .select("session_id, score")
    .in("session_id", [invite.initiator_session_id, invite.partner_session_id]);

  const resultA = results?.find((r) => r.session_id === invite.initiator_session_id);
  const resultB = results?.find((r) => r.session_id === invite.partner_session_id);

  if (!resultA || !resultB) {
    // One or both haven't completed the quiz yet
    return coupleDnaScoringV1.compareBilateral(
      { dimensionScores: { COMMUNICATION: 0, LIFE_VALUES: 0, CONFLICT_MANAGEMENT: 0, FINANCES: 0, FUTURE_PLANS: 0 }, totalResponses: 0 },
      { dimensionScores: { COMMUNICATION: 0, LIFE_VALUES: 0, CONFLICT_MANAGEMENT: 0, FINANCES: 0, FUTURE_PLANS: 0 }, totalResponses: 0 },
      false,
    );
  }

  const scoreA = resultA.score as unknown as IndividualCoupleScore;
  const scoreB = resultB.score as unknown as IndividualCoupleScore;

  return coupleDnaScoringV1.compareBilateral(scoreA, scoreB, true);
}
