import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { StripeAdapter } from "@/features/commerce/adapters/stripe";
import { InfinitePayAdapter } from "@/features/commerce/adapters/infinitepay";
import { createHmac } from "node:crypto";

describe("Webhook Security & Verification (Unit Tests)", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_mock_stripe_key_123456789";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_mock_stripe_webhook_secret_98765";
    process.env.INFINITEPAY_API_KEY = "ip_mock_api_key_123456789";
    process.env.INFINITEPAY_WEBHOOK_SECRET = "ip_whsec_mock_secret_98765";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe("StripeAdapter.verifyWebhook", () => {
    const adapter = new StripeAdapter();

    it("fails closed when STRIPE_WEBHOOK_SECRET is not configured in production", async () => {
      delete process.env.STRIPE_WEBHOOK_SECRET;
      const prevNodeEnv = process.env.NODE_ENV;
      (process.env as Record<string, string | undefined>).NODE_ENV = "production";

      try {
        await expect(
          adapter.verifyWebhook({
            payload: JSON.stringify({ id: "evt_1" }),
            headers: { "stripe-signature": "t=123,v1=abc" },
          }),
        ).rejects.toThrow(/STRIPE_WEBHOOK_SECRET is not configured/);
      } finally {
        (process.env as Record<string, string | undefined>).NODE_ENV = prevNodeEnv;
      }
    });

    it("fails closed when stripe-signature header is missing", async () => {
      await expect(
        adapter.verifyWebhook({
          payload: JSON.stringify({ id: "evt_1" }),
          headers: {},
        }),
      ).rejects.toThrow(/Missing stripe-signature header/);
    });

    it("fails closed when signature header is malformed", async () => {
      await expect(
        adapter.verifyWebhook({
          payload: JSON.stringify({ id: "evt_1" }),
          headers: { "stripe-signature": "malformed_signature_without_t_and_v1" },
        }),
      ).rejects.toThrow(/Invalid Stripe webhook signature format/);
    });

    it("fails closed when timestamp is older than 300 seconds (replay attack protection)", async () => {
      const oldTimestamp = Math.floor(Date.now() / 1000) - 305; // 305 seconds ago
      const payloadString = JSON.stringify({ id: "evt_old_timestamp" });
      const secret = process.env.STRIPE_WEBHOOK_SECRET!;
      const signature = createHmac("sha256", secret)
        .update(`${oldTimestamp}.${payloadString}`, "utf8")
        .digest("hex");

      await expect(
        adapter.verifyWebhook({
          payload: payloadString,
          headers: {
            "stripe-signature": `t=${oldTimestamp},v1=${signature}`,
          },
        }),
      ).rejects.toThrow(/timestamp out of tolerance/);
    });

    it("fails closed when signature does not match computed HMAC (tampered payload)", async () => {
      const now = Math.floor(Date.now() / 1000);
      const originalPayload = JSON.stringify({ id: "evt_1", amount: 1290 });
      const tamperedPayload = JSON.stringify({ id: "evt_1", amount: 100 });
      const secret = process.env.STRIPE_WEBHOOK_SECRET!;

      // Signature computed on original, but tampered payload provided
      const validSig = createHmac("sha256", secret)
        .update(`${now}.${originalPayload}`, "utf8")
        .digest("hex");

      await expect(
        adapter.verifyWebhook({
          payload: tamperedPayload,
          headers: {
            "stripe-signature": `t=${now},v1=${validSig}`,
          },
        }),
      ).rejects.toThrow(/Stripe webhook signature mismatch/);
    });

    it("verifies authentic Stripe webhook and extracts stable event ID and order metadata", async () => {
      const now = Math.floor(Date.now() / 1000);
      const eventId = "evt_stripe_real_123456";
      const payloadObj = {
        id: eventId,
        type: "checkout.session.completed",
        data: {
          object: {
            client_reference_id: "order_uuid_abc_123",
            amount_total: 299,
            currency: "usd",
            metadata: {
              order_number: "MQ-US-20260926-A1B2C3",
            },
          },
        },
      };
      const payloadString = JSON.stringify(payloadObj);
      const secret = process.env.STRIPE_WEBHOOK_SECRET!;
      const signature = createHmac("sha256", secret)
        .update(`${now}.${payloadString}`, "utf8")
        .digest("hex");

      const verified = await adapter.verifyWebhook({
        payload: payloadString,
        headers: {
          "stripe-signature": `t=${now},v1=${signature}`,
        },
      });

      expect(verified.provider).toBe("stripe");
      expect(verified.providerEventId).toBe(eventId);
      expect(verified.orderId).toBe("order_uuid_abc_123");
      expect(verified.orderNumber).toBe("MQ-US-20260926-A1B2C3");
      expect(verified.status).toBe("CONFIRMED");
      expect(verified.amount).toBe(299);
      expect(verified.currency).toBe("USD");
    });

    it("supports chargeback disputes and refunds", async () => {
      const now = Math.floor(Date.now() / 1000);
      const eventId = "evt_chargeback_123";
      const payloadObj = {
        id: eventId,
        type: "charge.dispute.created",
        data: {
          object: {
            id: "dp_123",
            amount: 299,
            currency: "usd",
          },
        },
      };
      const payloadString = JSON.stringify(payloadObj);
      const secret = process.env.STRIPE_WEBHOOK_SECRET!;
      const signature = createHmac("sha256", secret)
        .update(`${now}.${payloadString}`, "utf8")
        .digest("hex");

      const verified = await adapter.verifyWebhook({
        payload: payloadString,
        headers: {
          "stripe-signature": `t=${now},v1=${signature}`,
        },
      });

      expect(verified.status).toBe("CHARGEBACK");
      expect(verified.providerEventId).toBe(eventId);
    });
  });

  describe("InfinitePayAdapter.verifyWebhook", () => {
    const adapter = new InfinitePayAdapter();

    it("fails closed when INFINITEPAY_WEBHOOK_SECRET is not configured in production", async () => {
      delete process.env.INFINITEPAY_WEBHOOK_SECRET;
      const prevNodeEnv = process.env.NODE_ENV;
      (process.env as Record<string, string | undefined>).NODE_ENV = "production";

      try {
        await expect(
          adapter.verifyWebhook({
            payload: JSON.stringify({ id: "evt_1" }),
            headers: { "x-infinitepay-signature": "some_sig" },
          }),
        ).rejects.toThrow(/INFINITEPAY_WEBHOOK_SECRET is not configured/);
      } finally {
        (process.env as Record<string, string | undefined>).NODE_ENV = prevNodeEnv;
      }
    });

    it("fails closed when infinitepay signature header is missing", async () => {
      await expect(
        adapter.verifyWebhook({
          payload: JSON.stringify({ id: "evt_1" }),
          headers: {},
        }),
      ).rejects.toThrow(/Missing InfinitePay webhook signature header/);
    });

    it("verifies authentic InfinitePay webhook signature and extracts stable event ID", async () => {
      const eventId = "ip_evt_stable_998877";
      const payloadObj = {
        event_id: eventId,
        event_type: "transaction.success",
        data: {
          order_id: "order_ip_uuid_789",
          order_number: "MQ-BR-20260926-XYZ987",
          amount: 1290,
          currency: "BRL",
        },
      };
      const payloadString = JSON.stringify(payloadObj);
      const secret = process.env.INFINITEPAY_WEBHOOK_SECRET!;
      const signature = createHmac("sha256", secret).update(payloadString, "utf8").digest("hex");

      const verified = await adapter.verifyWebhook({
        payload: payloadString,
        headers: {
          "x-infinitepay-signature": signature,
        },
      });

      expect(verified.provider).toBe("infinitepay");
      expect(verified.providerEventId).toBe(eventId);
      expect(verified.orderId).toBe("order_ip_uuid_789");
      expect(verified.orderNumber).toBe("MQ-BR-20260926-XYZ987");
      expect(verified.status).toBe("CONFIRMED");
      expect(verified.amount).toBe(1290);
      expect(verified.currency).toBe("BRL");
    });
  });
});
