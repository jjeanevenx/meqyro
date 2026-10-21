import "server-only";

import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { logEvent } from "@/lib/observability/logger";
import { recordReferralConversion } from "@/features/referrals/referral-service";
import { recordFunnelEvent } from "@/features/analytics/analytics-service";
import { expandProductCodes } from "@/lib/market/prices";
import { assertTransition, orderTransitions, type OrderState } from "@/lib/domain/states";
import { activateInviteSlot } from "@/features/couple/couple-invite-service";

export async function fulfillOrder(
  orderId: string,
  providerEventId?: string,
  providerPaymentId?: string,
): Promise<{ success: boolean; alreadyFulfilled: boolean }> {
  const supabase = createSupabaseSecretClient();

  // 1. Fetch order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      "id, session_id, lead_id, status, customer_email, order_number, amount, currency, referral_code, couple_invite_slot_id",
    )
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    throw new Error(`Pedido não encontrado: ${orderId}`);
  }

  // 2. Resolve every product covered by this purchase before entering the DB transaction.
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("product_code")
    .eq("order_id", orderId);

  if (itemsError || !items?.length) {
    throw new Error("Order items unavailable; fulfillment must be retried");
  }
  const rawProductCodes = items.map((i) => i.product_code);

  // Expand bundle if present
  const expandedProductCodes = expandProductCodes(rawProductCodes);

  // 3. Mark the order paid and grant access in one Postgres transaction.
  if (order.status !== "FULFILLED")
    assertTransition("order", order.status as OrderState, "FULFILLED", orderTransitions);
  const now = new Date().toISOString();
  const { data: completionRows, error: completionError } = await supabase.rpc("complete_payment", {
    p_order_id: orderId,
    p_provider_payment_id: providerPaymentId ?? null,
    p_product_codes: expandedProductCodes,
    p_paid_at: now,
  });

  if (completionError) {
    throw new Error(`Atomic payment fulfillment failed: ${completionError.message}`);
  }

  const completion = Array.isArray(completionRows) ? completionRows[0] : completionRows;
  const alreadyFulfilled = Boolean(
    completion &&
    typeof completion === "object" &&
    "already_fulfilled" in completion &&
    completion.already_fulfilled,
  );

  if (alreadyFulfilled) {
    return { success: true, alreadyFulfilled: true };
  }

  // 4. Attribution: If referral code exists, record conversion
  if (order.referral_code) {
    await recordReferralConversion(order.referral_code).catch(() => {});
  }

  // 5. Funnel analytics tracking
  await recordFunnelEvent({
    eventName: "checkout_completed",
    sessionId: order.session_id,
    properties: {
      amount: order.amount,
      currency: order.currency,
      referral_code: order.referral_code ?? undefined,
    },
  }).catch(() => {});

  logEvent("info", "order_fulfillment_completed", {
    orderId,
    orderNumber: order.order_number,
    currency: order.currency,
    providerEventId,
  });

  // Activate invite slot if this order is linked to one (D-003, D-006)
  const slotId = order.couple_invite_slot_id as string | null;
  if (slotId) {
    try {
      await activateInviteSlot({ slotId, orderId });
      logEvent("info", "invite_slot_activation_triggered", { orderId, slotId });
    } catch (err) {
      logEvent("error", "invite_slot_activation_failed", {
        orderId,
        slotId,
        error: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
  }

  return { success: true, alreadyFulfilled };
}

export async function refundOrder(
  orderId: string,
  reason: string,
  providerRefundId?: string,
): Promise<{ success: boolean }> {
  const supabase = createSupabaseSecretClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("id, session_id, status, amount")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    throw new Error(`Pedido não encontrado: ${orderId}`);
  }

  if (order.status === "REFUNDED") {
    return { success: true };
  }
  assertTransition("order", order.status as OrderState, "REFUNDED", orderTransitions);

  // Lock the order, revoke grants and record the refund in one transaction.
  const { error: refundError } = await supabase.rpc("refund_payment", {
    p_order_id: orderId,
    p_reason: reason,
    p_provider_refund_id: providerRefundId ?? null,
  });
  if (refundError) throw new Error(`Atomic payment refund failed: ${refundError.message}`);

  logEvent("warn", "order_refund_processed", {
    orderId,
    reason,
    providerRefundId,
  });

  return { success: true };
}
