import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import type {
  PaymentProvider,
  PaymentProviderName,
  CheckoutInput,
  CheckoutResult,
  PaymentLookup,
  PaymentStatus,
  RawWebhookInput,
  VerifiedPaymentEvent,
} from "../contracts";

const MAX_TIMESTAMP_TOLERANCE_SECONDS = 300; // 5 minutes

export class StripeAdapter implements PaymentProvider {
  public readonly name: PaymentProviderName = "stripe";

  private get apiKey(): string | undefined {
    return process.env.STRIPE_SECRET_KEY;
  }

  private get webhookSecret(): string | undefined {
    return process.env.STRIPE_WEBHOOK_SECRET;
  }

  async createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
    if (!this.apiKey) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("Stripe secret key is not configured in production environment.");
      }

      // Test/development simulated checkout session only
      const mockAttemptId = `cs_test_${input.orderNumber}`;
      const mockCheckoutUrl = `${input.successUrl}${
        input.successUrl.includes("?") ? "&" : "?"
      }session_id=${mockAttemptId}&order=${input.orderNumber}`;

      return {
        provider: "stripe",
        providerAttemptId: mockAttemptId,
        checkoutUrl: mockCheckoutUrl,
        rawResponse: { simulated: true },
      };
    }

    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("success_url", input.successUrl);
    params.append("cancel_url", input.cancelUrl);
    params.append("customer_email", input.customerEmail);
    params.append("client_reference_id", input.orderId);
    params.append("metadata[order_number]", input.orderNumber);
    params.append("metadata[order_id]", input.orderId);
    params.append("metadata[product_code]", input.productCode);
    params.append("line_items[0][price_data][currency]", input.currency.toLowerCase());
    params.append("line_items[0][price_data][unit_amount]", String(input.amount));
    params.append("line_items[0][price_data][product_data][name]", `Meqyro - ${input.productCode}`);
    params.append("line_items[0][quantity]", "1");

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Stripe Checkout Session error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return {
      provider: "stripe",
      providerAttemptId: data.id,
      checkoutUrl: data.url,
      rawResponse: data,
    };
  }

  async getPaymentStatus(input: PaymentLookup): Promise<PaymentStatus> {
    if (!this.apiKey) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("Stripe secret key is not configured in production environment.");
      }

      return {
        status: "PENDING",
      };
    }

    const response = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${input.providerAttemptId}`,
      {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      },
    );

    if (!response.ok) {
      return { status: "FAILED" };
    }

    const data = await response.json();
    if (data.payment_status === "paid") {
      return {
        status: "CONFIRMED",
        paidAt: new Date().toISOString(),
        transactionId: data.payment_intent,
      };
    }

    if (data.status === "expired") {
      return { status: "EXPIRED" };
    }

    return { status: "PENDING" };
  }

  async verifyWebhook(input: RawWebhookInput): Promise<VerifiedPaymentEvent> {
    const rawBody =
      typeof input.payload === "string" ? input.payload : JSON.stringify(input.payload);

    // 1. Fail-closed check for secret
    if (!this.webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not configured on server.");
    }

    // 2. Fail-closed check for signature
    const headerSig =
      (input.headers?.["stripe-signature"] as string | undefined) ??
      (input.headers?.["Stripe-Signature"] as string | undefined);
    const signature = input.signature ?? headerSig;

    if (!signature) {
      throw new Error("Missing stripe-signature header.");
    }

    // 3. Format validation
    const parts = signature.split(",");
    const timestampPart = parts.find((p) => p.startsWith("t="))?.replace("t=", "");
    const sigPart = parts.find((p) => p.startsWith("v1="))?.replace("v1=", "");

    if (!timestampPart || !sigPart) {
      throw new Error(
        "Invalid Stripe webhook signature format. Expected t=<timestamp>,v1=<signature>",
      );
    }

    // 4. Timestamp tolerance check
    const timestampSec = parseInt(timestampPart, 10);
    if (isNaN(timestampSec)) {
      throw new Error("Invalid Stripe webhook timestamp format.");
    }

    const nowSec = Math.floor(Date.now() / 1000);
    const diffSec = nowSec - timestampSec;

    // Tolerance window: reject if older than 300s or more than 60s in future
    if (diffSec > MAX_TIMESTAMP_TOLERANCE_SECONDS || diffSec < -60) {
      throw new Error(
        `Stripe webhook timestamp out of tolerance: ${diffSec}s difference (max ${MAX_TIMESTAMP_TOLERANCE_SECONDS}s allowed).`,
      );
    }

    // 5. Constant-time cryptographic HMAC verification
    const signedPayload = `${timestampPart}.${rawBody}`;
    const expectedHmac = createHmac("sha256", this.webhookSecret)
      .update(signedPayload, "utf8")
      .digest("hex");

    const actualBuf = Buffer.from(sigPart, "hex");
    const expectedBuf = Buffer.from(expectedHmac, "hex");

    if (actualBuf.length !== expectedBuf.length || !timingSafeEqual(actualBuf, expectedBuf)) {
      throw new Error("Stripe webhook signature mismatch.");
    }

    // 6. Payload parsing and event extraction
    let event: Record<string, unknown>;
    try {
      event = typeof input.payload === "string" ? JSON.parse(input.payload) : input.payload;
    } catch {
      throw new Error("Malformed JSON payload in Stripe webhook.");
    }

    const eventId = typeof event.id === "string" && event.id.length > 0 ? event.id : null;
    if (!eventId) {
      throw new Error("Stripe webhook missing required stable provider event ID.");
    }

    const eventType = typeof event.type === "string" ? event.type : "unknown";
    const dataObj = (event.data as Record<string, unknown> | undefined)?.object as
      Record<string, unknown> | undefined;
    const sessionObj = dataObj ?? {};
    const metadata = (sessionObj.metadata as Record<string, string> | undefined) ?? {};

    if (eventType === "checkout.session.completed") {
      const orderId =
        typeof sessionObj.client_reference_id === "string"
          ? sessionObj.client_reference_id
          : metadata.order_id;
      const orderNumber = metadata.order_number;

      return {
        provider: "stripe",
        providerEventId: eventId,
        eventType,
        orderId,
        orderNumber,
        status: "CONFIRMED",
        amount: typeof sessionObj.amount_total === "number" ? sessionObj.amount_total : undefined,
        currency:
          typeof sessionObj.currency === "string" ? sessionObj.currency.toUpperCase() : undefined,
      };
    }

    if (eventType === "charge.refunded") {
      return {
        provider: "stripe",
        providerEventId: eventId,
        eventType,
        orderId: metadata.order_id,
        orderNumber: metadata.order_number,
        status: "REFUNDED",
      };
    }

    if (eventType === "charge.dispute.created") {
      return {
        provider: "stripe",
        providerEventId: eventId,
        eventType,
        orderId: metadata.order_id,
        orderNumber: metadata.order_number,
        status: "CHARGEBACK",
      };
    }

    return {
      provider: "stripe",
      providerEventId: eventId,
      eventType,
      status: "IGNORED",
    };
  }
}
