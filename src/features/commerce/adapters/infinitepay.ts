import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { getSiteUrl } from "@/lib/config/env";
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

export class InfinitePayAdapter implements PaymentProvider {
  public readonly name: PaymentProviderName = "infinitepay";

  private get apiKey(): string | undefined {
    return process.env.INFINITEPAY_API_KEY;
  }

  private get webhookSecret(): string | undefined {
    return process.env.INFINITEPAY_WEBHOOK_SECRET;
  }

  async createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
    if (!this.apiKey) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("InfinitePay API key is not configured in production environment.");
      }

      // Test/development simulated checkout session only
      const mockAttemptId = `inf_test_${input.orderNumber}`;
      const mockCheckoutUrl = `${input.successUrl}${
        input.successUrl.includes("?") ? "&" : "?"
      }order=${input.orderNumber}&provider=infinitepay`;

      return {
        provider: "infinitepay",
        providerAttemptId: mockAttemptId,
        checkoutUrl: mockCheckoutUrl,
        rawResponse: { simulated: true },
      };
    }

    const siteUrl = getSiteUrl();

    const payload = {
      order_nsu: input.orderNumber,
      amount: input.amount,
      currency: "BRL",
      customer: {
        email: input.customerEmail,
      },
      payment_methods: ["pix", "credit_card"],
      redirect_url: input.successUrl,
      webhook_url: `${siteUrl}/api/webhooks/infinitepay`,
      items: [
        {
          id: input.productCode,
          description: `Meqyro - ${input.productCode}`,
          amount: input.amount,
          quantity: 1,
        },
      ],
    };

    const response = await fetch("https://api.infinitepay.io/v2/transactions/checkout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`InfinitePay Checkout error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return {
      provider: "infinitepay",
      providerAttemptId: data.id ?? data.transaction_id ?? input.orderNumber,
      checkoutUrl: data.checkout_url ?? data.url,
      rawResponse: data,
    };
  }

  async getPaymentStatus(input: PaymentLookup): Promise<PaymentStatus> {
    if (!this.apiKey) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("InfinitePay API key is not configured in production environment.");
      }

      return {
        status: "PENDING",
      };
    }

    const response = await fetch(
      `https://api.infinitepay.io/v2/transactions/${input.providerAttemptId}`,
      {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      },
    );

    if (!response.ok) {
      return { status: "FAILED" };
    }

    const data = await response.json();
    if (data.status === "paid" || data.status === "approved") {
      return {
        status: "CONFIRMED",
        paidAt: data.paid_at ?? new Date().toISOString(),
        transactionId: data.nsu ?? data.transaction_id,
      };
    }

    if (data.status === "expired" || data.status === "canceled") {
      return { status: "EXPIRED" };
    }

    return { status: "PENDING" };
  }

  async verifyWebhook(input: RawWebhookInput): Promise<VerifiedPaymentEvent> {
    const rawBody =
      typeof input.payload === "string" ? input.payload : JSON.stringify(input.payload);

    // 1. Fail-closed secret check
    if (!this.webhookSecret) {
      throw new Error("INFINITEPAY_WEBHOOK_SECRET is not configured on server.");
    }

    // 2. Fail-closed signature check
    const headerSig =
      (input.headers?.["x-infinitepay-signature"] as string | undefined) ??
      (input.headers?.["X-InfinitePay-Signature"] as string | undefined);
    const signature = input.signature ?? headerSig;

    if (!signature) {
      throw new Error("Missing InfinitePay webhook signature header.");
    }

    // 3. Constant-time cryptographic HMAC verification
    const expectedHmac = createHmac("sha256", this.webhookSecret)
      .update(rawBody, "utf8")
      .digest("hex");

    const actualBuf = Buffer.from(signature.replace(/^sha256=/, ""), "hex");
    const expectedBuf = Buffer.from(expectedHmac, "hex");

    if (actualBuf.length !== expectedBuf.length || !timingSafeEqual(actualBuf, expectedBuf)) {
      throw new Error("InfinitePay webhook signature mismatch.");
    }

    // 4. Payload parsing
    let event: Record<string, unknown>;
    try {
      event = typeof input.payload === "string" ? JSON.parse(input.payload) : input.payload;
    } catch {
      throw new Error("Malformed JSON payload in InfinitePay webhook.");
    }

    const transaction =
      (event.data as Record<string, unknown> | undefined) ??
      (event.transaction as Record<string, unknown> | undefined) ??
      event;

    // Stable event ID from provider (reject Date.now() generation)
    const eventId = (event.event_id ??
      event.id ??
      transaction.transaction_id ??
      transaction.nsu ??
      transaction.id) as string | undefined;

    if (!eventId || typeof eventId !== "string" || eventId.trim().length === 0) {
      throw new Error("InfinitePay webhook missing required stable provider event ID.");
    }

    const eventType = (event.event ?? event.type ?? "transaction.paid") as string;
    const orderNumber = (transaction.order_nsu ?? event.order_nsu ?? transaction.order_number) as
      string | undefined;
    const orderId = (transaction.order_id ??
      (transaction.metadata as Record<string, string> | undefined)?.order_id) as string | undefined;

    const statusStr = String(transaction.status ?? "").toLowerCase();

    if (
      eventType === "transaction.paid" ||
      eventType === "payment.approved" ||
      statusStr === "paid" ||
      statusStr === "approved"
    ) {
      return {
        provider: "infinitepay",
        providerEventId: String(eventId),
        eventType,
        orderId,
        orderNumber,
        status: "CONFIRMED",
        amount: typeof transaction.amount === "number" ? transaction.amount : undefined,
        currency: "BRL",
      };
    }

    if (eventType === "transaction.refunded" || statusStr === "refunded") {
      return {
        provider: "infinitepay",
        providerEventId: String(eventId),
        eventType,
        orderId,
        orderNumber,
        status: "REFUNDED",
      };
    }

    if (eventType === "transaction.chargeback" || statusStr === "chargeback") {
      return {
        provider: "infinitepay",
        providerEventId: String(eventId),
        eventType,
        orderId,
        orderNumber,
        status: "CHARGEBACK",
      };
    }

    return {
      provider: "infinitepay",
      providerEventId: String(eventId),
      eventType,
      status: "IGNORED",
    };
  }
}
