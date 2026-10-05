import "server-only";
import { randomBytes } from "node:crypto";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { matchesAnonymousSessionToken } from "@/lib/security/anonymous-session";
import { findPaidEntitlement } from "@/features/commerce/entitlement-service";
import { coupleDnaScoringV1, type IndividualCoupleScore } from "@/features/scoring/coupledna";
import type { BilateralCoupleComparison } from "@/features/scoring/coupledna";
import type { ProtectedResultResponse } from "@/features/results/contracts";

type CoupleProgress = NonNullable<ProtectedResultResponse["couple"]>;
export type CoupleState = CoupleProgress &
  (
    | { state: "READY"; comparison: BilateralCoupleComparison }
    | { state: Exclude<CoupleProgress["state"], "READY"> }
  );
type CoupleInvite = { inviteId: string; inviteCode: string; inviteUrl: string };

async function authorize(sessionId: string, token: string) {
  const { data } = await createSupabaseSecretClient()
    .from("quiz_sessions")
    .select("id,access_token_hash,quiz_versions!inner(quizzes!inner(slug))")
    .eq("id", sessionId)
    .single();
  const record = data as unknown as {
    access_token_hash: string;
    quiz_versions: { quizzes: { slug: string } };
  } | null;
  return Boolean(
    record &&
    record.quiz_versions.quizzes.slug === "coupledna" &&
    matchesAnonymousSessionToken(token, record.access_token_hash),
  );
}

export async function createCoupleInvite(
  sessionId: string,
  token: string,
  locale = "pt",
  consent = false,
): Promise<CoupleInvite | null> {
  if (!consent || !(await authorize(sessionId, token))) return null;
  const db = createSupabaseSecretClient();
  const { data: existing } = await db
    .from("couple_invites")
    .select("id,invite_code,expires_at,partner_session_id")
    .or(`initiator_session_id.eq.${sessionId},partner_session_id.eq.${sessionId}`)
    .neq("status", "EXPIRED")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  let invite = existing;
  if (!invite || (!invite.partner_session_id && new Date(invite.expires_at) <= new Date())) {
    if (invite) {
      const { error: expireError } = await db
        .from("couple_invites")
        .update({ status: "EXPIRED" })
        .eq("id", invite.id)
        .is("partner_session_id", null);
      if (expireError) throw expireError;
    }
    const { data, error } = await db
      .from("couple_invites")
      .insert({
        invite_code: `CP-${randomBytes(4).toString("hex").toUpperCase()}`,
        initiator_session_id: sessionId,
        expires_at: new Date(Date.now() + 14 * 86400_000).toISOString(),
        status: "PENDING",
      })
      .select("id,invite_code,expires_at,partner_session_id")
      .single();
    if (error || !data) throw new Error("Unable to create invite");
    invite = data;
  }
  const { error } = await db.from("couple_consents").upsert(
    {
      invite_id: invite.id,
      session_id: sessionId,
      can_share_comparison: true,
      consented_at: new Date().toISOString(),
    },
    { onConflict: "invite_id,session_id" },
  );
  if (error) throw error;
  const language = ["pt", "en", "es", "fr"].includes(locale) ? locale : "pt";
  return {
    inviteId: invite.id,
    inviteCode: invite.invite_code,
    inviteUrl: `${process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://meqyro.com"}/${language}/quizzes/coupledna/play?invite=${invite.invite_code}`,
  };
}

export async function acceptCoupleInvite(
  code: string,
  sessionId: string,
  token: string,
  consent = false,
): Promise<{ success: boolean; inviteId: string } | null> {
  if (!consent || !(await authorize(sessionId, token))) return null;
  const db = createSupabaseSecretClient();
  const { data: invite } = await db
    .from("couple_invites")
    .select("id,initiator_session_id,partner_session_id,status,expires_at")
    .eq("invite_code", code.trim().toUpperCase())
    .maybeSingle();
  if (
    !invite ||
    invite.initiator_session_id === sessionId ||
    invite.status === "EXPIRED" ||
    (!invite.partner_session_id && new Date(invite.expires_at) <= new Date()) ||
    (invite.partner_session_id && invite.partner_session_id !== sessionId)
  )
    return null;
  if (!invite.partner_session_id) {
    const { data, error } = await db
      .from("couple_invites")
      .update({ partner_session_id: sessionId, status: "ACCEPTED" })
      .eq("id", invite.id)
      .is("partner_session_id", null)
      .select("id")
      .maybeSingle();
    if (error || !data) return null;
  }
  const { error } = await db.from("couple_consents").upsert(
    {
      invite_id: invite.id,
      session_id: sessionId,
      can_share_comparison: true,
      consented_at: new Date().toISOString(),
    },
    { onConflict: "invite_id,session_id" },
  );
  if (error) throw error;
  return { success: true, inviteId: invite.id };
}

/** Server-only; comparison requires consent, completed results AND payment. */
export async function getCoupleState(sessionId: string, code?: string): Promise<CoupleState> {
  const db = createSupabaseSecretClient();
  let query = db
    .from("couple_invites")
    .select("id,invite_code,initiator_session_id,partner_session_id,status,expires_at")
    .or(`initiator_session_id.eq.${sessionId},partner_session_id.eq.${sessionId}`);
  if (code) query = query.eq("invite_code", code.trim().toUpperCase());
  const { data: invite, error } = await query
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!invite) return { state: "NO_INVITE" as const, inviteCode: null, consentGiven: false };
  const { data: consents, error: consentError } = await db
    .from("couple_consents")
    .select("session_id,can_share_comparison")
    .eq("invite_id", invite.id);
  if (consentError) throw consentError;
  const consentGiven = Boolean(
    consents?.some((row) => row.session_id === sessionId && row.can_share_comparison),
  );
  const base = { inviteCode: invite.invite_code as string, consentGiven };
  if (
    invite.status === "EXPIRED" ||
    (!invite.partner_session_id && new Date(invite.expires_at) <= new Date())
  )
    return { ...base, state: "EXPIRED" as const };
  if (!invite.partner_session_id) return { ...base, state: "WAITING_PARTNER" as const };
  if (
    ![invite.initiator_session_id, invite.partner_session_id].every((id) =>
      consents?.some((row) => row.session_id === id && row.can_share_comparison),
    )
  )
    return { ...base, state: "CONSENT_REQUIRED" as const };
  const { data: results, error: resultError } = await db
    .from("results")
    .select("session_id,score,quiz_sessions!inner(status)")
    .in("session_id", [invite.initiator_session_id, invite.partner_session_id]);
  if (resultError) throw resultError;
  const a = results?.find((row) => row.session_id === invite.initiator_session_id);
  const b = results?.find((row) => row.session_id === invite.partner_session_id);
  if (
    !a ||
    !b ||
    (a.quiz_sessions as unknown as { status: string }).status !== "COMPLETED" ||
    (b.quiz_sessions as unknown as { status: string }).status !== "COMPLETED"
  )
    return { ...base, state: "WAITING_RESULTS" as const };
  if (!(await findPaidEntitlement(sessionId, "COUPLEDNA")))
    return { ...base, state: "PAYMENT_REQUIRED" as const };
  const comparison = coupleDnaScoringV1.compareBilateral(
    a.score as unknown as IndividualCoupleScore,
    b.score as unknown as IndividualCoupleScore,
    true,
  );
  return { ...base, state: "READY" as const, comparison };
}

export async function getCoupleComparison(
  code: string,
  sessionId: string,
  token: string,
): Promise<BilateralCoupleComparison | null> {
  if (!(await authorize(sessionId, token))) return null;
  const state = await getCoupleState(sessionId, code);
  if (!state.inviteCode) return null;
  return state.state === "READY"
    ? state.comparison
    : coupleDnaScoringV1.compareBilateral(
        { dimensionScores: {} as IndividualCoupleScore["dimensionScores"], totalResponses: 0 },
        { dimensionScores: {} as IndividualCoupleScore["dimensionScores"], totalResponses: 0 },
        false,
      );
}

export async function setCoupleConsent(
  sessionId: string,
  token: string,
  granted: boolean,
): Promise<boolean> {
  if (!(await authorize(sessionId, token))) return false;
  const state = await getCoupleState(sessionId);
  if (!state.inviteCode) return false;
  const db = createSupabaseSecretClient();
  const { data: invite } = await db
    .from("couple_invites")
    .select("id")
    .eq("invite_code", state.inviteCode)
    .single();
  if (!invite) return false;
  const { error } = await db.from("couple_consents").upsert(
    {
      invite_id: invite.id,
      session_id: sessionId,
      can_share_comparison: granted,
      consented_at: new Date().toISOString(),
    },
    { onConflict: "invite_id,session_id" },
  );
  if (error) throw error;
  return true;
}
