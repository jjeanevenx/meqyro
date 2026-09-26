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
      // Test/development simulated checkout session
      const mockAttemptId = `inf_test_${input.orderNumber}_${Date.now()}`;
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

    const payload = {
      order_nsu: input.orderNumber,
      amount: input.amount,
      currency: "BRL",
      customer: {
        email: input.customerEmail,
      },
      payment_methods: ["pix", "credit_card"],
      redirect_url: input.successUrl,
      webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/infinitepay`,
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
      return {
        status: "CONFIRMED",
        paidAt: new Date().toISOString(),
        transactionId: `inf_txn_${input.orderId}`,
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

    if (this.webhookSecret && input.signature) {
      const expectedHmac = createHmac("sha256", this.webhookSecret)
        .update(rawBody, "utf8")
        .digest("hex");

      const actualBuf = Buffer.from(input.signature, "hex");
      const expectedBuf = Buffer.from(expectedHmac, "hex");

      if (actualBuf.length !== expectedBuf.length || !timingSafeEqual(actualBuf, expectedBuf)) {
        throw new Error("InfinitePay webhook signature mismatch");
      }
    }

    const event = typeof input.payload === "string" ? JSON.parse(input.payload) : input.payload;
    const eventType = event.event ?? event.type ?? "transaction.paid";
    const eventId = event.event_id ?? event.id ?? `inf_evt_${Date.now()}`;
    const transaction = event.data ?? event;

    const isPaid =
      eventType === "transaction.paid" ||
      transaction.status === "paid" ||
      transaction.status === "approved";

    if (isPaid) {
      return {
        provider: "infinitepay",
        providerEventId: String(eventId),
        eventType,
        orderNumber: transaction.order_nsu ?? transaction.metadata?.order_number,
        status: "CONFIRMED",
        amount: transaction.amount,
        currency: "BRL",
      };
    }

    if (eventType === "transaction.refunded" || transaction.status === "refunded") {
      return {
        provider: "infinitepay",
        providerEventId: String(eventId),
        eventType,
        orderNumber: transaction.order_nsu ?? transaction.metadata?.order_number,
        status: "REFUNDED",
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
