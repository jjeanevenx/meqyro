import "server-only";

import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { logEvent } from "@/lib/observability/logger";
import { assertTransition, orderTransitions, type OrderState } from "@/lib/domain/states";
import { recordReferralConversion } from "@/features/referrals/referral-service";
import { recordFunnelEvent } from "@/features/analytics/analytics-service";

export async function fulfillOrder(
  orderId: string,
  providerEventId?: string,
): Promise<{ success: boolean; alreadyFulfilled: boolean }> {
  const supabase = createSupabaseSecretClient();

  // 1. Fetch order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, session_id, lead_id, status, customer_email, order_number, amount, currency, referral_code")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    throw new Error(`Pedido não encontrado: ${orderId}`);
  }

  // Idempotency: if already fulfilled, do nothing
  if (order.status === "FULFILLED") {
    return { success: true, alreadyFulfilled: true };
  }

  // 2. Fetch order items
  const { data: items } = await supabase
    .from("order_items")
    .select("product_code")
    .eq("order_id", orderId);

  const rawProductCodes = items?.map((i) => i.product_code) ?? ["BRAINRANK"];

  // Expand bundle if present
  const expandedProductCodes: string[] = [];
  for (const code of rawProductCodes) {
    if (code === "PREMIUM_BUNDLE" || code === "bundle-all-reports") {
      expandedProductCodes.push("BRAINRANK", "PERSONALITY_MAP");
    } else {
      expandedProductCodes.push(code);
    }
  }

  // 3. Grant premium access in result_access_grants
  for (const productCode of expandedProductCodes) {
    // Check if grant already exists
    const { data: existingGrant } = await supabase
      .from("result_access_grants")
      .select("id")
      .eq("session_id", order.session_id)
      .eq("product_code", productCode)
      .eq("grant_type", "PREMIUM_REPORT")
      .single();

    if (!existingGrant) {
      await supabase.from("result_access_grants").insert({
        session_id: order.session_id,
        lead_id: order.lead_id,
        product_code: productCode,
        grant_type: "PREMIUM_REPORT",
      });
    }
  }

  // 4. State transition: current -> PAID -> FULFILLED
  const now = new Date().toISOString();
  if (order.status !== "PAID") {
    assertTransition("order", order.status as OrderState, "PAID", orderTransitions);
  }

  // Update order as FULFILLED (and PAID if not yet set)
  await supabase
    .from("orders")
    .update({
      status: "FULFILLED",
      paid_at: now,
      fulfilled_at: now,
      updated_at: now,
    })
    .eq("id", orderId);

  // 5. Attribution: If referral code exists, record conversion
  if (order.referral_code) {
    await recordReferralConversion(order.referral_code).catch(() => {});
  }

  // 6. Funnel analytics tracking
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
    amount: order.amount,
    currency: order.currency,
    providerEventId,
  });

  return { success: true, alreadyFulfilled: false };
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

  // Revoke premium access grants
  await supabase
    .from("result_access_grants")
    .delete()
    .eq("session_id", order.session_id)
    .eq("grant_type", "PREMIUM_REPORT");

  // Record refund
  await supabase.from("refunds").insert({
    order_id: orderId,
    amount: order.amount,
    reason,
    provider_refund_id: providerRefundId ?? null,
    status: "PROCESSED",
  });

  // Transition order status to REFUNDED
  await supabase
    .from("orders")
    .update({
      status: "REFUNDED",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  logEvent("warn", "order_refund_processed", {
    orderId,
    reason,
    providerRefundId,
  });

  return { success: true };
}
