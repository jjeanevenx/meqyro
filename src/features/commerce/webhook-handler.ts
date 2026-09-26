import "server-only";

import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { getPaymentProvider } from "./order-service";
import { fulfillOrder, refundOrder } from "./fulfillment-service";
import type { PaymentProviderName, RawWebhookInput } from "./contracts";
import { logEvent } from "@/lib/observability/logger";
import { sendPurchaseConfirmationEmail, sendRefundEmail } from "@/features/email/email-service";

export interface WebhookHandlingResult {
  handled: boolean;
  duplicate?: boolean;
  orderId?: string;
  orderNumber?: string;
  error?: string;
}

export async function handleWebhook(
  providerName: PaymentProviderName,
  input: RawWebhookInput,
): Promise<WebhookHandlingResult> {
  const supabase = createSupabaseSecretClient();
  const provider = getPaymentProvider(providerName);

  // 1. Cryptographic signature and payload verification (fail-closed inside provider)
  const verifiedEvent = await provider.verifyWebhook(input);

  if (verifiedEvent.status === "IGNORED") {
    logEvent("info", "webhook_event_ignored", {
      provider: providerName,
      providerEventId: verifiedEvent.providerEventId,
      eventType: verifiedEvent.eventType,
    });
    return { handled: true };
  }

  // 2. Find order by orderId or orderNumber
  let orderQuery = supabase
    .from("orders")
    .select(
      "id, order_number, amount, currency, status, payment_provider, customer_email, session_id, market",
    );

  if (verifiedEvent.orderId) {
    orderQuery = orderQuery.eq("id", verifiedEvent.orderId);
  } else if (verifiedEvent.orderNumber) {
    orderQuery = orderQuery.eq("order_number", verifiedEvent.orderNumber);
  } else {
    logEvent("warn", "webhook_missing_order_identifiers", {
      provider: providerName,
      providerEventId: verifiedEvent.providerEventId,
    });
    return { handled: false, error: "Missing order identifier in webhook event" };
  }

  const { data: order, error: orderLookupError } = await orderQuery.single();

  if (orderLookupError || !order) {
    logEvent("warn", "webhook_unmatched_order", {
      provider: providerName,
      providerEventId: verifiedEvent.providerEventId,
      orderNumber: verifiedEvent.orderNumber,
      orderId: verifiedEvent.orderId,
    });

    // Record unmatched payment event for audit purposes
    await supabase.from("payment_events").insert({
      provider: providerName,
      provider_event_id: verifiedEvent.providerEventId,
      event_type: verifiedEvent.eventType,
      order_id: null,
      status: "UNMATCHED_ORDER",
      payload: typeof input.payload === "string" ? JSON.parse(input.payload) : input.payload,
    });

    return { handled: false, error: "Referenced order not found" };
  }

  // 3. Provider validation: an event from another provider cannot fulfill this order
  if (order.payment_provider && order.payment_provider !== providerName) {
    logEvent("error", "webhook_provider_mismatch", {
      orderId: order.id,
      expectedProvider: order.payment_provider,
      receivedProvider: providerName,
    });
    return { handled: false, error: "Provider mismatch for targeted order" };
  }

  // 4. Amount and currency verification for CONFIRMED events
  if (verifiedEvent.status === "CONFIRMED") {
    if (typeof verifiedEvent.amount === "number" && verifiedEvent.amount !== order.amount) {
      logEvent("error", "webhook_amount_mismatch", {
        orderId: order.id,
        expectedAmount: order.amount,
        receivedAmount: verifiedEvent.amount,
      });

      await supabase.from("payment_events").insert({
        provider: providerName,
        provider_event_id: verifiedEvent.providerEventId,
        event_type: verifiedEvent.eventType,
        order_id: order.id,
        status: "REJECTED_AMOUNT_MISMATCH",
        payload: typeof input.payload === "string" ? JSON.parse(input.payload) : input.payload,
      });

      throw new Error(
        `Webhook payment amount (${verifiedEvent.amount}) diverges from recorded order amount (${order.amount}).`,
      );
    }

    if (
      verifiedEvent.currency &&
      verifiedEvent.currency.toUpperCase() !== order.currency.toUpperCase()
    ) {
      logEvent("error", "webhook_currency_mismatch", {
        orderId: order.id,
        expectedCurrency: order.currency,
        receivedCurrency: verifiedEvent.currency,
      });

      await supabase.from("payment_events").insert({
        provider: providerName,
        provider_event_id: verifiedEvent.providerEventId,
        event_type: verifiedEvent.eventType,
        order_id: order.id,
        status: "REJECTED_CURRENCY_MISMATCH",
        payload: typeof input.payload === "string" ? JSON.parse(input.payload) : input.payload,
      });

      throw new Error(
        `Webhook payment currency (${verifiedEvent.currency}) diverges from recorded order currency (${order.currency}).`,
      );
    }
  }

  // 5. Ingest event into payment_events with unique constraint on (provider, provider_event_id)
  const { error: insertError } = await supabase.from("payment_events").insert({
    provider: providerName,
    provider_event_id: verifiedEvent.providerEventId,
    event_type: verifiedEvent.eventType,
    order_id: order.id,
    status: "RECEIVED",
    payload: typeof input.payload === "string" ? JSON.parse(input.payload) : input.payload,
  });

  if (insertError) {
    // Postgres unique constraint violation code (23505)
    if (insertError.code === "23505" || insertError.message.includes("unique")) {
      logEvent("info", "webhook_duplicate_ignored", {
        provider: providerName,
        providerEventId: verifiedEvent.providerEventId,
        orderId: order.id,
      });
      return { handled: true, duplicate: true, orderId: order.id, orderNumber: order.order_number };
    }
    throw new Error(`Failed to log payment event: ${insertError.message}`);
  }

  // 6. Execute fulfillment / refund / dispute state transitions
  if (verifiedEvent.status === "CONFIRMED") {
    await fulfillOrder(order.id, verifiedEvent.providerEventId);

    // Dispatch post-purchase transactional email
    if (order.customer_email) {
      await sendPurchaseConfirmationEmail({
        recipientEmail: order.customer_email,
        orderNumber: order.order_number,
        amount: order.amount,
        currency: order.currency,
        sessionId: order.session_id,
        locale: order.market === "BR" ? "pt" : "en",
      }).catch((emailErr) => {
        logEvent("warn", "purchase_email_dispatch_failed", {
          orderId: order.id,
          error: emailErr instanceof Error ? emailErr.message : String(emailErr),
        });
      });
    }

    await supabase
      .from("payment_events")
      .update({ status: "PROCESSED" })
      .eq("provider", providerName)
      .eq("provider_event_id", verifiedEvent.providerEventId);
  } else if (verifiedEvent.status === "REFUNDED") {
    await refundOrder(order.id, "Gateway refund webhook", verifiedEvent.providerEventId);

    if (order.customer_email) {
      await sendRefundEmail({
        recipientEmail: order.customer_email,
        orderNumber: order.order_number,
        amount: order.amount,
        currency: order.currency,
        locale: order.market === "BR" ? "pt" : "en",
      }).catch(() => {});
    }

    await supabase
      .from("payment_events")
      .update({ status: "PROCESSED" })
      .eq("provider", providerName)
      .eq("provider_event_id", verifiedEvent.providerEventId);
  } else if (verifiedEvent.status === "CHARGEBACK") {
    await refundOrder(order.id, "Gateway chargeback dispute", verifiedEvent.providerEventId);

    await supabase
      .from("payment_events")
      .update({ status: "PROCESSED" })
      .eq("provider", providerName)
      .eq("provider_event_id", verifiedEvent.providerEventId);
  }

  return { handled: true, orderId: order.id, orderNumber: order.order_number };
}
