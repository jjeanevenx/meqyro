import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Stripe from "stripe";
import { StripeAdapter } from "@/features/commerce/adapters/stripe";

describe("payment provider verification", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_mock_stripe_key_123456789";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_mock_stripe_webhook_secret_98765";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
  });

  describe("StripeAdapter", () => {
    const adapter = new StripeAdapter();

    function signed(payload: string) {
      return Stripe.webhooks.generateTestHeaderString({
        payload,
        secret: process.env.STRIPE_WEBHOOK_SECRET!,
      });
    }

    it("fails closed without the webhook secret", async () => {
      delete process.env.STRIPE_WEBHOOK_SECRET;
      await expect(
        adapter.verifyWebhook({ payload: "{}", headers: {}, signature: "invalid" }),
      ).rejects.toThrow(/STRIPE_WEBHOOK_SECRET/);
    });

    it("rejects a missing or invalid signature", async () => {
      await expect(adapter.verifyWebhook({ payload: "{}", headers: {} })).rejects.toThrow(
        /stripe-signature/,
      );
      await expect(
        adapter.verifyWebhook({ payload: "{}", headers: {}, signature: "invalid" }),
      ).rejects.toThrow();
    });

    it("confirms only a provider-paid Checkout Session", async () => {
      const payload = JSON.stringify({
        id: "evt_stripe_paid_1",
        object: "event",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_1",
            object: "checkout.session",
            client_reference_id: "9f53ad9c-3460-4bb4-aa64-b11fa807c404",
            payment_status: "paid",
            payment_intent: "pi_test_1",
            amount_total: 299,
            currency: "usd",
            metadata: {
              order_id: "9f53ad9c-3460-4bb4-aa64-b11fa807c404",
              order_number: "MQ-US-20260928-A1B2C3",
              product_code: "BRAINRANK",
            },
          },
        },
      });

      const verified = await adapter.verifyWebhook({
        payload,
        headers: {},
        signature: signed(payload),
      });
      expect(verified).toMatchObject({
        providerEventId: "evt_stripe_paid_1",
        status: "CONFIRMED",
        providerPaymentId: "pi_test_1",
        amount: 299,
        currency: "USD",
        productCode: "BRAINRANK",
      });
    });

    it("does not fulfill an unpaid completed session", async () => {
      const payload = JSON.stringify({
        id: "evt_stripe_pending_1",
        object: "event",
        type: "checkout.session.completed",
        data: { object: { object: "checkout.session", payment_status: "unpaid" } },
      });
      const verified = await adapter.verifyWebhook({
        payload,
        headers: {},
        signature: signed(payload),
      });
      expect(verified.status).toBe("IGNORED");
    });
  });
});
