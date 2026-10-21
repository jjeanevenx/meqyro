import "server-only";
import { createSupabaseSecretClient } from "@/lib/supabase/server";

/** Internal lookup only; callers must authenticate the target session first. */
export type PaidEntitlement = { id: string; orderId: string; sourceSessionId: string };

/**
 * Find a paid entitlement for a given session and product code.
 *
 * For COUPLEDNA_INVITE, looks for INVITE_ACCESS grants instead of PREMIUM_REPORT/PREMIUM_BUNDLE.
 * An optional coupleInviteSlotId further narrows the query to a specific slot's order.
 *
 * For COUPLEDNA (legacy), also checks the couple_invites cross-session pattern.
 */
export async function findPaidEntitlement(
  sessionId: string,
  productCode: string,
  includeCouple = true,
  coupleInviteSlotId?: string,
): Promise<PaidEntitlement | null> {
  const db = createSupabaseSecretClient();
  const { data: session, error } = await db
    .from("quiz_sessions")
    .select("buyer_id")
    .eq("id", sessionId)
    .single();
  if (error) throw new Error("Unable to verify paid access. Please try again.");
  if (!session) return null;

  const { data: related, error: relatedError } = session.buyer_id
    ? await db.from("quiz_sessions").select("id").eq("buyer_id", session.buyer_id)
    : { data: [], error: null };
  if (relatedError) throw relatedError;

  const buyerSessions = [...new Set([sessionId, ...(related ?? []).map((row) => row.id)])];

  const cutoff = new Date();
  cutoff.setUTCMonth(cutoff.getUTCMonth() - 24);

  // COUPLEDNA_INVITE: look for INVITE_ACCESS grants
  if (productCode === "COUPLEDNA_INVITE") {
    type GrantRow = { id: string; order_id: string | null; session_id: string };
    const query = db
      .from("result_access_grants")
      .select("id, order_id, session_id, orders!inner(status, couple_invite_slot_id)")
      .in("session_id", buyerSessions)
      .eq("product_code", "COUPLEDNA_INVITE")
      .eq("grant_type", "INVITE_ACCESS")
      .eq("orders.status", "FULFILLED")
      .gt("created_at", cutoff.toISOString())
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: grants, error: grantError } = await query;
    if (grantError) throw grantError;

    if (!grants?.length) return null;

    // If a specific slot is requested, filter by the slot's order
    if (coupleInviteSlotId) {
      const slotGrant = (
        grants as unknown as Array<GrantRow & { orders: { couple_invite_slot_id: string | null } }>
      ).find((g) => g.orders.couple_invite_slot_id === coupleInviteSlotId);
      if (!slotGrant) return null;
      return {
        id: slotGrant.id,
        orderId: slotGrant.order_id as string,
        sourceSessionId: slotGrant.session_id,
      };
    }

    const first = grants[0] as unknown as GrantRow;
    return {
      id: first.id,
      orderId: first.order_id as string,
      sourceSessionId: first.session_id,
    };
  }

  // Default: PREMIUM_REPORT or PREMIUM_BUNDLE grants
  const { data: grants, error: grantError } = await db
    .from("result_access_grants")
    .select("id,order_id,session_id,orders!inner(status)")
    .in("session_id", buyerSessions)
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
