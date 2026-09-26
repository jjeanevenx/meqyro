import "server-only";

import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { getPaymentProvider } from "./order-service";
import { fulfillOrder } from "./fulfillment-service";
import type { PaymentProviderName } from "./contracts";
import { logEvent } from "@/lib/observability/logger";

export async function reconcileUnfulfilledPaidOrders(): Promise<{ repairedCount: number }> {
  const supabase = createSupabaseSecretClient();

  // Find orders where status is PAID but fulfillment hasn't finalized
  const { data: paidOrders, error } = await supabase
    .from("orders")
    .select("id, status, order_number")
    .eq("status", "PAID");

  if (error || !paidOrders || paidOrders.length === 0) {
    return { repairedCount: 0 };
  }

  let repairedCount = 0;
  for (const order of paidOrders) {
    try {
      await fulfillOrder(order.id, "reconciliation_repair");
      repairedCount += 1;
      logEvent("info", "order_reconciliation_repaired", {
        orderId: order.id,
        orderNumber: order.order_number,
      });
    } catch (err: unknown) {
      logEvent("error", "order_reconciliation_failed", {
        orderId: order.id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return { repairedCount };
}

export async function reconcilePendingOrders(): Promise<{ confirmedCount: number }> {
  const supabase = createSupabaseSecretClient();

  // Find PENDING orders with payment attempts
  const { data: pendingOrders } = await supabase
    .from("orders")
    .select("id, order_number, payment_provider, payment_attempts(id, provider_attempt_id, status)")
    .eq("status", "PENDING")
    .limit(20);

  if (!pendingOrders || pendingOrders.length === 0) {
    return { confirmedCount: 0 };
  }

  let confirmedCount = 0;

  for (const order of pendingOrders) {
    const attempts = order.payment_attempts as Array<{
      provider_attempt_id?: string;
      status: string;
    }>;
    const latestAttempt = attempts?.[attempts.length - 1];

    if (!latestAttempt?.provider_attempt_id) continue;

    const provider = getPaymentProvider(order.payment_provider as PaymentProviderName);

    try {
      const statusCheck = await provider.getPaymentStatus({
        orderId: order.id,
        providerAttemptId: latestAttempt.provider_attempt_id,
      });

      if (statusCheck.status === "CONFIRMED") {
        await fulfillOrder(order.id, "reconciliation_poll");
        confirmedCount += 1;
      }
    } catch (err: unknown) {
      logEvent("warn", "reconciliation_check_error", {
        orderId: order.id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return { confirmedCount };
}
