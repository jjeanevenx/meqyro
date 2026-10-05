import "server-only";

import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { getPaymentProvider } from "./order-service";
import { fulfillOrder, refundOrder } from "./fulfillment-service";
import type { PaymentProviderName, RawWebhookInput } from "./contracts";
import { logEvent } from "@/lib/observability/logger";
import { sendRefundEmail } from "@/features/email/email-service";
import { deliverPaidReport } from "@/features/email/paid-report-delivery";
import { createHmac } from "node:crypto";
import { getTokenSecuritySecret, getSiteUrl } from "@/lib/config/env";
import { hashToken } from "@/features/privacy/consent-service";

export interface WebhookHandlingResult {
  handled: boolean;
  duplicate?: boolean;
  orderId?: string;
  orderNumber?: string;
  error?: string;
}

function paymentAuditPayload(payload: string | Record<string, unknown>): Record<string, unknown> {
  let value: Record<string, unknown>;
  try {
    value = typeof payload === "string" ? JSON.parse(payload) : payload;
  } catch {
    return { malformed: true };
  }

  const object = (value.data as Record<string, unknown> | undefined)?.object as
    Record<string, unknown> | undefined;
  return {
    id: value.id,
    type: value.type ?? value.event,
    order_nsu: value.order_nsu,
    transaction_nsu: value.transaction_nsu,
    invoice_slug: value.invoice_slug ?? value.slug,
    amount: value.amount ?? object?.amount_total,
    currency: value.currency ?? object?.currency,
    payment_status: object?.payment_status,
  };
}

async function sendPurchaseConfirmationOnce(
  order: {
    id: string;
    customer_email: string | null;
    order_number: string;
    amount: number;
    currency: string;
    session_id: string;
    market: string;
    confirmation_email_sent_at?: string | null;
    quiz_sessions?: { locale?: string } | Array<{ locale?: string }> | null;
  },
  targetSessionId?: string,
): Promise<void> {
  if (!order.customer_email) return;
  const sessionId = targetSessionId ?? order.session_id;

  const supabase = createSupabaseSecretClient();
  const resultToken = createHmac("sha256", getTokenSecuritySecret())
    .update(
      targetSessionId
        ? `purchase-recovery:${order.id}:${sessionId}`
        : `purchase-recovery:${order.id}`,
      "utf8",
    )
    .digest("base64url");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await supabase.from("recovery_tokens").upsert(
    {
      session_id: sessionId,
      token_hash: hashToken(resultToken),
      expires_at: expiresAt,
      usage_count: 0,
      max_uses: 10,
    },
    { onConflict: "token_hash", ignoreDuplicates: true },
  );

  const sessionRelation = Array.isArray(order.quiz_sessions)
    ? order.quiz_sessions[0]
    : order.quiz_sessions;
  const { data: target } = targetSessionId
    ? await supabase.from("quiz_sessions").select("locale").eq("id", sessionId).single()
    : { data: null };
  const locale = target?.locale ?? sessionRelation?.locale ?? (order.market === "BR" ? "pt" : "en");
  await deliverPaidReport(
    order.id,
    locale,
    `${getSiteUrl()}/${locale}/results/${resultToken}`,
    sessionId,
  );
}

export async function sendPurchaseConfirmationForOrder(
  orderId: string,
  sessionId?: string,
): Promise<void> {
  const supabase = createSupabaseSecretClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, amount, currency, customer_email, session_id, market, confirmation_email_sent_at, quiz_sessions!orders_session_id_fkey(locale)",
    )
    .eq("id", orderId)
    .single();
  if (error || !order) throw new Error(`Order email lookup failed: ${error?.message}`);
  await sendPurchaseConfirmationOnce(order, sessionId);
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
      "id, order_number, product_code, amount, currency, status, payment_provider, customer_email, session_id, market, confirmation_email_sent_at, quiz_sessions!orders_session_id_fkey(locale)",
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
      payload: paymentAuditPayload(input.payload),
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
    if (typeof verifiedEvent.amount !== "number" || !verifiedEvent.currency) {
      throw new Error("Confirmed payment event is missing provider-verified amount or currency.");
    }

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
        payload: paymentAuditPayload(input.payload),
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
        payload: paymentAuditPayload(input.payload),
      });

      throw new Error(
        `Webhook payment currency (${verifiedEvent.currency}) diverges from recorded order currency (${order.currency}).`,
      );
    }

    if (verifiedEvent.productCode && verifiedEvent.productCode !== order.product_code) {
      throw new Error("Webhook product metadata diverges from the recorded order product.");
    }
  }

  // 5. Ingest event into payment_events with unique constraint on (provider, provider_event_id)
  const { error: insertError } = await supabase.from("payment_events").insert({
    provider: providerName,
    provider_event_id: verifiedEvent.providerEventId,
    event_type: verifiedEvent.eventType,
    order_id: order.id,
    status: "RECEIVED",
    payload: paymentAuditPayload(input.payload),
  });

  if (insertError) {
    // Postgres unique constraint violation code (23505)
    if (insertError.code === "23505" || insertError.message.includes("unique")) {
      logEvent("info", "webhook_duplicate_ignored", {
        provider: providerName,
        providerEventId: verifiedEvent.providerEventId,
        orderId: order.id,
      });
      if (verifiedEvent.status === "CONFIRMED" && order.status !== "FULFILLED") {
        await fulfillOrder(
          order.id,
          verifiedEvent.providerEventId,
          verifiedEvent.providerPaymentId,
        );
      }
      if (
        (order.status === "FULFILLED" || verifiedEvent.status === "CONFIRMED") &&
        !order.confirmation_email_sent_at
      ) {
        await sendPurchaseConfirmationOnce(order).catch((emailErr) => {
          logEvent("warn", "purchase_email_retry_failed", {
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
      return { handled: true, duplicate: true, orderId: order.id, orderNumber: order.order_number };
    }
    throw new Error(`Failed to log payment event: ${insertError.message}`);
  }

  // 6. Execute fulfillment / refund / dispute state transitions
  if (verifiedEvent.status === "CONFIRMED") {
    await fulfillOrder(order.id, verifiedEvent.providerEventId, verifiedEvent.providerPaymentId);

    // Dispatch post-purchase transactional email
    await sendPurchaseConfirmationOnce(order).catch((emailErr) => {
      logEvent("warn", "purchase_email_dispatch_failed", {
        orderId: order.id,
        error: emailErr instanceof Error ? emailErr.message : String(emailErr),
      });
    });

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
  } else if (verifiedEvent.status === "FAILED") {
    await supabase
      .from("orders")
      .update({ status: "FAILED", updated_at: new Date().toISOString() })
      .eq("id", order.id)
      .in("status", ["CREATED", "PROCESSING", "PENDING"]);
  }

  return { handled: true, orderId: order.id, orderNumber: order.order_number };
}
