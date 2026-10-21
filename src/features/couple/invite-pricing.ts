import "server-only";

import { createSupabaseSecretClient } from "@/lib/supabase/server";

export const MAX_COUPLEDNA_INVITES = 10;

export type InvitePriceResult = {
  amount: number;
  currency: string;
  slotNumber: number;
  isDiscounted: boolean;
};

/**
 * Calculate the price for the next invite slot for a given host session.
 *
 * Rules (D-005):
 * - 1st invite = P (full price from product_prices for coupledna_invite)
 * - Additional invites = Math.floor(P / 3)
 *
 * Legacy purchase (D-002):
 * - A fulfilled COUPLEDNA PREMIUM_REPORT grant counts as the first invite,
 *   so subsequent invites from that host cost P/3.
 *
 * Limit (D-004): MAX_COUPLEDNA_INVITES = 10
 */
export async function calculateInvitePrice(
  hostSessionId: string,
  market: string,
): Promise<InvitePriceResult> {
  const db = createSupabaseSecretClient();

  // Count confirmed and pending slots for this host
  const { data: slots, error: slotsError } = await db
    .from("couple_invite_slots")
    .select("status")
    .eq("host_session_id", hostSessionId)
    .in("status", ["ACTIVE", "REDEEMED", "QUIZ_STARTED", "COMPLETED", "PENDING_PAYMENT"]);

  if (slotsError) {
    throw new Error(`Failed to count invite slots: ${slotsError.message}`);
  }

  const confirmedCount = (slots ?? []).filter((s) =>
    ["ACTIVE", "REDEEMED", "QUIZ_STARTED", "COMPLETED"].includes(s.status),
  ).length;
  const pendingCount = (slots ?? []).filter((s) => s.status === "PENDING_PAYMENT").length;
  const totalActive = confirmedCount + pendingCount;

  if (totalActive >= MAX_COUPLEDNA_INVITES) {
    throw new Error("INVITE_LIMIT_REACHED");
  }

  // Check for legacy COUPLEDNA purchase (D-002)
  const { data: legacyGrants, error: legacyError } = await db
    .from("result_access_grants")
    .select("id, orders!inner(status)")
    .eq("session_id", hostSessionId)
    .eq("product_code", "COUPLEDNA")
    .eq("grant_type", "PREMIUM_REPORT")
    .eq("orders.status", "FULFILLED")
    .limit(1);

  if (legacyError) {
    throw new Error(`Failed to check legacy purchase: ${legacyError.message}`);
  }

  const hasLegacyPurchase = (legacyGrants ?? []).length > 0;

  // Fetch the base price P from product_prices for the COUPLEDNA_INVITE catalog entry
  const { data: quizRecord, error: quizError } = await db
    .from("quizzes")
    .select("id")
    .eq("product_code", "COUPLEDNA_INVITE")
    .single();

  if (quizError || !quizRecord) {
    throw new Error("Product 'COUPLEDNA_INVITE' not found in catalog.");
  }

  const { data: priceRecord, error: priceError } = await db
    .from("product_prices")
    .select("amount, currency")
    .eq("quiz_id", quizRecord.id)
    .eq("market", market)
    .eq("active", true)
    .single();

  if (priceError || !priceRecord) {
    throw new Error(`No active price found for market '${market}' and product 'coupledna_invite'.`);
  }

  const basePrice = priceRecord.amount;
  const currency = priceRecord.currency;

  // Determine if this slot is discounted
  // Discounted if: there is already a confirmed slot OR a legacy purchase
  const isDiscounted = confirmedCount > 0 || hasLegacyPurchase;
  const amount = isDiscounted ? Math.floor(basePrice / 3) : basePrice;
  const slotNumber = totalActive + 1;

  return { amount, currency, slotNumber, isDiscounted };
}
