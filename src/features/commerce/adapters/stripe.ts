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
      // Test/development simulated checkout session
      const mockAttemptId = `cs_test_${input.orderNumber}_${Date.now()}`;
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
      return {
        status: "CONFIRMED",
        paidAt: new Date().toISOString(),
        transactionId: `txn_mock_${input.orderId}`,
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

    if (this.webhookSecret && input.signature) {
      const signatureHeader = input.signature;
      const parts = signatureHeader.split(",");
      const timestampPart = parts.find((p) => p.startsWith("t="))?.replace("t=", "");
      const sigPart = parts.find((p) => p.startsWith("v1="))?.replace("v1=", "");

      if (!timestampPart || !sigPart) {
        throw new Error("Invalid Stripe webhook signature format");
      }

      const signedPayload = `${timestampPart}.${rawBody}`;
      const expectedHmac = createHmac("sha256", this.webhookSecret)
        .update(signedPayload, "utf8")
        .digest("hex");

      const actualBuf = Buffer.from(sigPart, "hex");
      const expectedBuf = Buffer.from(expectedHmac, "hex");

      if (actualBuf.length !== expectedBuf.length || !timingSafeEqual(actualBuf, expectedBuf)) {
        throw new Error("Stripe webhook signature mismatch");
      }
    }

    const event = typeof input.payload === "string" ? JSON.parse(input.payload) : input.payload;
    const eventType = event.type ?? "unknown";
    const eventId = event.id ?? `evt_${Date.now()}`;
    const sessionObj = event.data?.object ?? {};

    if (eventType === "checkout.session.completed") {
      return {
        provider: "stripe",
        providerEventId: eventId,
        eventType,
        orderId: sessionObj.client_reference_id,
        orderNumber: sessionObj.metadata?.order_number,
        status: "CONFIRMED",
        amount: sessionObj.amount_total,
        currency: sessionObj.currency?.toUpperCase(),
      };
    }

    if (eventType === "charge.refunded") {
      return {
        provider: "stripe",
        providerEventId: eventId,
        eventType,
        orderId: sessionObj.metadata?.order_id,
        orderNumber: sessionObj.metadata?.order_number,
        status: "REFUNDED",
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
