import { beforeEach, describe, expect, it, vi } from "vitest";
import { StripeAdapter } from "@/features/commerce/adapters/stripe";
import { handleWebhook } from "@/features/commerce/webhook-handler";
import { refundOrder } from "@/features/commerce/fulfillment-service";
import type { VerifiedPaymentEvent } from "@/features/commerce/contracts";

const state = vi.hoisted(() => ({
  retrieve: vi.fn(),
  event: {} as VerifiedPaymentEvent,
  status: "FULFILLED",
  rpc: vi.fn(),
  duplicate: true,
}));
vi.mock("stripe", () => ({
  default: class {
    checkout = { sessions: { retrieve: state.retrieve } };
  },
}));
vi.mock("@/features/commerce/order-service", () => ({
  getPaymentProvider: () => ({ verifyWebhook: async () => state.event }),
}));
vi.mock("@/features/email/email-service", () => ({ sendRefundEmail: vi.fn() }));
vi.mock("@/features/email/paid-report-delivery", () => ({ deliverPaidReport: vi.fn() }));
vi.mock("@/features/analytics/analytics-service", () => ({ recordFunnelEvent: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseSecretClient: () => ({
    rpc: state.rpc,
    from: () => {
      const chain = {
        select: () => chain,
        eq: () => chain,
        in: () => chain,
        update: () => chain,
        insert: async () => ({ error: state.duplicate ? { code: "23505" } : null }),
        single: async () => ({
          data: {
            id: "order",
            status: state.status,
            payment_provider: "stripe",
            amount: 299,
            currency: "USD",
            product_code: "BRAINRANK",
            customer_email: null,
          },
        }),
        then: (resolve: (value: unknown) => unknown) =>
          Promise.resolve({ error: null }).then(resolve),
      };
      return chain;
    },
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  process.env.STRIPE_SECRET_KEY = "sk_test_local";
  state.status = "FULFILLED";
  state.duplicate = true;
  state.event = {
    provider: "stripe",
    providerEventId: "evt_refund",
    eventType: "charge.refunded",
    status: "REFUNDED",
    orderId: "order",
  };
  state.rpc.mockResolvedValue({ error: null });
});

describe("Commercial payment safety", () => {
  const lookup = {
    orderId: "order",
    orderNumber: "MQ-1",
    providerAttemptId: "cs_1",
    expectedAmount: 299,
    expectedCurrency: "USD",
    expectedProductCode: "BRAINRANK",
  };
  const paid = {
    payment_status: "paid",
    client_reference_id: "order",
    amount_total: 299,
    currency: "usd",
    payment_intent: "pi_1",
    metadata: { order_id: "order", order_number: "MQ-1", product_code: "BRAINRANK" },
  };

  it("reconciles a matching provider-paid session", async () => {
    state.retrieve.mockResolvedValue(paid);
    await expect(new StripeAdapter().getPaymentStatus(lookup)).resolves.toEqual({
      status: "CONFIRMED",
      transactionId: "pi_1",
    });
  });
  it.each([
    { amount_total: 1 },
    { currency: "brl" },
    { client_reference_id: "another-order" },
    { metadata: { ...paid.metadata, product_code: "MONEYDNA" } },
    { metadata: { ...paid.metadata, order_id: "another-order" } },
  ])("rejects reconciliation mismatch %j", async (override) => {
    state.retrieve.mockResolvedValue({ ...paid, ...override });
    await expect(new StripeAdapter().getPaymentStatus(lookup)).rejects.toThrow("does not match");
  });
  it("does not unlock an unpaid completed checkout", async () => {
    state.retrieve.mockResolvedValue({ ...paid, payment_status: "unpaid", status: "complete" });
    await expect(new StripeAdapter().getPaymentStatus(lookup)).resolves.toEqual({
      status: "PENDING",
    });
  });
  it.each(["REFUNDED", "CHARGEBACK"] as const)(
    "retries an interrupted duplicate %s event",
    async (status) => {
      state.event.status = status;
      await expect(handleWebhook("stripe", { payload: "{}", headers: {} })).resolves.toMatchObject({
        handled: true,
        duplicate: true,
      });
      expect(state.rpc).toHaveBeenCalledWith(
        "refund_payment",
        expect.objectContaining({ p_order_id: "order", p_provider_refund_id: "evt_refund" }),
      );
    },
  );
  it("propagates a refund transaction failure so Stripe can retry", async () => {
    state.rpc.mockResolvedValue({ error: { message: "temporary database outage" } });
    await expect(refundOrder("order", "refund", "evt_refund")).rejects.toThrow(
      "Atomic payment refund failed",
    );
  });
  it("does not apply a second refund to an already refunded order", async () => {
    state.status = "REFUNDED";
    await expect(refundOrder("order", "refund", "evt_refund")).resolves.toEqual({ success: true });
    expect(state.rpc).not.toHaveBeenCalled();
  });
});
