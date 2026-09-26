import "server-only";

import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { getPaymentProvider } from "./order-service";
import { fulfillOrder, refundOrder } from "./fulfillment-service";
import type { PaymentProviderName, RawWebhookInput } from "./contracts";
import { logEvent } from "@/lib/observability/logger";

export async function handleWebhook(
  providerName: PaymentProviderName,
  input: RawWebhookInput,
): Promise<{ handled: boolean; duplicate?: boolean; orderId?: string }> {
  const supabase = createSupabaseSecretClient();
  const provider = getPaymentProvider(providerName);

  // 1. Verify webhook signature and extract event payload
  const verifiedEvent = await provider.verifyWebhook(input);

  if (verifiedEvent.status === "IGNORED") {
    return { handled: true };
  }

  // 2. Find order by orderId or orderNumber
  let orderId = verifiedEvent.orderId;
  if (!orderId && verifiedEvent.orderNumber) {
    const { data: order } = await supabase
      .from("orders")
      .select("id")
      .eq("order_number", verifiedEvent.orderNumber)
      .single();
    if (order) {
      orderId = order.id;
    }
  }

  // 3. Ingest event into payment_events with unique constraint on (provider, provider_event_id)
  const { error: insertError } = await supabase.from("payment_events").insert({
    provider: providerName,
    provider_event_id: verifiedEvent.providerEventId,
    event_type: verifiedEvent.eventType,
    order_id: orderId ?? null,
    status: "RECEIVED",
    payload: typeof input.payload === "string" ? JSON.parse(input.payload) : input.payload,
  });

  if (insertError) {
    // PostgREST / Postgres unique constraint violation code (23505)
    if (insertError.code === "23505" || insertError.message.includes("unique")) {
      logEvent("info", "webhook_duplicate_ignored", {
        provider: providerName,
        providerEventId: verifiedEvent.providerEventId,
      });
      return { handled: true, duplicate: true, orderId };
    }
    throw new Error(`Failed to log payment event: ${insertError.message}`);
  }

  if (!orderId) {
    logEvent("warn", "webhook_unmatched_order", {
      provider: providerName,
      providerEventId: verifiedEvent.providerEventId,
      orderNumber: verifiedEvent.orderNumber,
    });
    return { handled: true };
  }

  // 4. Process event
  if (verifiedEvent.status === "CONFIRMED") {
    await fulfillOrder(orderId, verifiedEvent.providerEventId);
    await supabase
      .from("payment_events")
      .update({ status: "PROCESSED" })
      .eq("provider", providerName)
      .eq("provider_event_id", verifiedEvent.providerEventId);
  } else if (verifiedEvent.status === "REFUNDED") {
    await refundOrder(orderId, "Gateway refund webhook", verifiedEvent.providerEventId);
    await supabase
      .from("payment_events")
      .update({ status: "PROCESSED" })
      .eq("provider", providerName)
      .eq("provider_event_id", verifiedEvent.providerEventId);
  }

  return { handled: true, orderId };
}
