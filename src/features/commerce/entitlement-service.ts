import "server-only";
import { createSupabaseSecretClient } from "@/lib/supabase/server";

/** Internal lookup only; callers must authenticate the target session first. */
export type PaidEntitlement = { id: string; orderId: string; sourceSessionId: string };
export async function findPaidEntitlement(
  sessionId: string,
  productCode: string,
  includeCouple = true,
): Promise<PaidEntitlement | null> {
  const db = createSupabaseSecretClient();
  const { data: session, error } = await db
    .from("quiz_sessions")
    .select("buyer_id")
    .eq("id", sessionId)
    .single();
  if (error || !session) return null;
  const { data: related, error: relatedError } = await db
    .from("quiz_sessions")
    .select("id")
    .eq("buyer_id", session.buyer_id);
  if (relatedError) throw relatedError;
  const cutoff = new Date();
  cutoff.setUTCMonth(cutoff.getUTCMonth() - 24);
  const { data: grants, error: grantError } = await db
    .from("result_access_grants")
    .select("id,order_id,session_id,orders!inner(status)")
    .in(
      "session_id",
      (related ?? []).map((row) => row.id),
    )
    .eq("product_code", productCode)
    .in("grant_type", ["PREMIUM_REPORT", "PREMIUM_BUNDLE"])
    .eq("orders.status", "FULFILLED")
    .gt("created_at", cutoff.toISOString())
    .order("created_at", { ascending: false })
    .limit(1);
  if (grantError) throw grantError;
  if (grants?.[0])
    return {
      id: grants[0].id,
      orderId: grants[0].order_id as string,
      sourceSessionId: grants[0].session_id,
    };
  if (includeCouple && productCode === "COUPLEDNA") {
    const { data: invite } = await db
      .from("couple_invites")
      .select("initiator_session_id,partner_session_id")
      .or(`initiator_session_id.eq.${sessionId},partner_session_id.eq.${sessionId}`)
      .neq("status", "EXPIRED")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const other =
      invite?.initiator_session_id === sessionId
        ? invite.partner_session_id
        : invite?.initiator_session_id;
    if (other) return findPaidEntitlement(other, productCode, false);
  }
  return null;
}
