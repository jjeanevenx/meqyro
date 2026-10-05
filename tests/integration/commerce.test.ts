import { afterAll, beforeAll, describe, it, expect } from "vitest";
import { startQuizSession } from "@/features/quiz-engine/session-service";
import {
  createOrder,
  getOrderById,
  setPaymentProviderFactoryForTests,
} from "@/features/commerce/order-service";
import { fulfillOrder, refundOrder } from "@/features/commerce/fulfillment-service";
import { handleWebhook } from "@/features/commerce/webhook-handler";
import { reconcileUnfulfilledPaidOrders } from "@/features/commerce/reconciliation-service";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { isSupabaseAvailable } from "./db-check";
import { ControlledPaymentProvider } from "./controlled-payment-provider";

const isOnline = await isSupabaseAvailable();

beforeAll(() => {
  setPaymentProviderFactoryForTests((name) => new ControlledPaymentProvider(name));
});

afterAll(() => {
  setPaymentProviderFactoryForTests(null);
});

describe.skipIf(!isOnline)("Commerce & Fulfillment Lifecycle — Integration Tests", () => {
  it("preserves confirmed payment when it arrives while checkout creation is still processing", async () => {
    setPaymentProviderFactoryForTests((name) => {
      const provider = new ControlledPaymentProvider(name);
      const createCheckout = provider.createCheckout.bind(provider);
      provider.createCheckout = async (input) => {
        await fulfillOrder(input.orderId, "early-confirmation", `early-payment-${input.orderId}`);
        return createCheckout(input);
      };
      return provider;
    });
    try {
      const { session, token } = await startQuizSession({
        quizSlug: "brainrank",
        locale: "pt",
        market: "BR",
      });
      const { order } = await createOrder({
        sessionId: session.id,
        sessionToken: token,
        productCode: "BRAINRANK",
        customerEmail: "early-confirmation@example.com",
        market: "BR",
        locale: "pt",
      });
      expect((await getOrderById(order.id, { allowInternal: true }))?.status).toBe("FULFILLED");
      const db = createSupabaseSecretClient();
      const { data: grants, error } = await db
        .from("result_access_grants")
        .select("id")
        .eq("order_id", order.id);
      expect(error).toBeNull();
      expect(grants).toHaveLength(1);
      expect(await fulfillOrder(order.id, "early-confirmation-replay")).toEqual({
        success: true,
        alreadyFulfilled: true,
      });
    } finally {
      setPaymentProviderFactoryForTests((name) => new ControlledPaymentProvider(name));
    }
  });
  it("creates order with approved server price and state machine transition", async () => {
    const { session, token } = await startQuizSession({
      quizSlug: "brainrank",
      locale: "pt",
      market: "BR",
    });

    const result = await createOrder({
      sessionId: session.id,
      sessionToken: token,
      productCode: "BRAINRANK",
      customerEmail: "buyer@example.com",
      market: "BR",
      locale: "pt",
    });

    expect(result.order).toBeDefined();
    expect(result.order.orderNumber).toMatch(/^MQ-BR-\d{8}-[A-F0-9]{6}$/);
    expect(result.order.amount).toBe(1290); // R$ 12,90
    expect(result.order.currency).toBe("BRL");
    expect(result.order.status).toBe("PENDING");
    expect(result.checkoutUrl).toBeDefined();

    const stored = await getOrderById(result.order.id, { allowInternal: true });
    expect(stored?.status).toBe("PENDING");
  });

  it("fulfills order idempotently and provisions premium grant", async () => {
    const { session, token } = await startQuizSession({
      quizSlug: "brainrank",
      locale: "pt",
      market: "BR",
    });

    const { order } = await createOrder({
      sessionId: session.id,
      sessionToken: token,
      productCode: "BRAINRANK",
      customerEmail: "buyer-fulfill@example.com",
      market: "BR",
      locale: "pt",
    });

    // 1. Initial fulfillment
    const fulfillment1 = await fulfillOrder(order.id, "evt_test_1");
    expect(fulfillment1.success).toBe(true);
    expect(fulfillment1.alreadyFulfilled).toBe(false);

    // Verify grant created in result_access_grants
    const supabase = createSupabaseSecretClient();
    const { data: grants } = await supabase
      .from("result_access_grants")
      .select("grant_type, product_code")
      .eq("session_id", session.id)
      .eq("grant_type", "PREMIUM_REPORT");

    expect(grants).toHaveLength(1);
    expect(grants?.[0]?.product_code).toBe("BRAINRANK");

    // Verify order status is FULFILLED
    const updatedOrder = await getOrderById(order.id, { allowInternal: true });
    expect(updatedOrder?.status).toBe("FULFILLED");

    // 2. Second fulfillment (Idempotency guarantee)
    const fulfillment2 = await fulfillOrder(order.id, "evt_test_duplicate");
    expect(fulfillment2.success).toBe(true);
    expect(fulfillment2.alreadyFulfilled).toBe(true);

    // Verify grants count did NOT duplicate
    const { data: grantsAfter } = await supabase
      .from("result_access_grants")
      .select("id")
      .eq("session_id", session.id)
      .eq("grant_type", "PREMIUM_REPORT");

    expect(grantsAfter).toHaveLength(1);
  });

  it("handles webhook and ignores duplicate event payloads", async () => {
    const { session, token } = await startQuizSession({
      quizSlug: "brainrank",
      locale: "pt",
      market: "US",
    });

    const { order } = await createOrder({
      sessionId: session.id,
      sessionToken: token,
      productCode: "BRAINRANK",
      customerEmail: "stripe-buyer@example.com",
      market: "US",
      locale: "en",
    });

    const eventId = `evt_stripe_${Date.now()}`;
    const webhookPayload = {
      id: eventId,
      type: "checkout.session.completed",
      data: {
        object: {
          client_reference_id: order.id,
          amount_total: 299,
          currency: "usd",
          metadata: {
            order_number: order.orderNumber,
          },
        },
      },
    };

    const headers = {};

    // First delivery
    const res1 = await handleWebhook("stripe", {
      payload: webhookPayload,
      headers,
    });
    expect(res1.handled).toBe(true);
    expect(res1.duplicate).toBeUndefined();

    // Verify order is FULFILLED
    const fulfilledOrder = await getOrderById(order.id, { allowInternal: true });
    expect(fulfilledOrder?.status).toBe("FULFILLED");

    // Duplicate webhook delivery (e.g. Stripe network retry)
    const res2 = await handleWebhook("stripe", {
      payload: webhookPayload,
      headers,
    });
    expect(res2.handled).toBe(true);
    expect(res2.duplicate).toBe(true);
  });

  it("reconciles unfulfilled paid orders and handles refunds", async () => {
    const { session, token } = await startQuizSession({
      quizSlug: "brainrank",
      locale: "pt",
      market: "BR",
    });

    const { order } = await createOrder({
      sessionId: session.id,
      sessionToken: token,
      productCode: "BRAINRANK",
      customerEmail: "reconcile@example.com",
      market: "BR",
      locale: "pt",
    });

    // Simulate order marked as PAID but fulfillment crashed before granting
    const supabase = createSupabaseSecretClient();
    await supabase.from("orders").update({ status: "PAID" }).eq("id", order.id);

    // Run reconciler
    const reconcileResult = await reconcileUnfulfilledPaidOrders();
    expect(reconcileResult.repairedCount).toBeGreaterThanOrEqual(1);

    // Verify order is now FULFILLED and grant exists
    const repairedOrder = await getOrderById(order.id, { allowInternal: true });
    expect(repairedOrder?.status).toBe("FULFILLED");

    const { data: grants } = await supabase
      .from("result_access_grants")
      .select("id")
      .eq("session_id", session.id)
      .eq("grant_type", "PREMIUM_REPORT");

    expect(grants?.length).toBe(1);

    // Now test Refund: revokes grant and transitions order to REFUNDED
    const refundResult = await refundOrder(
      order.id,
      "Customer requested cancellation within 7 days",
    );
    expect(refundResult.success).toBe(true);

    const refundedOrder = await getOrderById(order.id, { allowInternal: true });
    expect(refundedOrder?.status).toBe("REFUNDED");

    // Grant should now be revoked
    const { data: grantsPostRefund } = await supabase
      .from("result_access_grants")
      .select("id")
      .eq("session_id", session.id)
      .eq("grant_type", "PREMIUM_REPORT");

    expect(grantsPostRefund).toHaveLength(0);
  });

  it("creates and fulfills bundle order with automatic multi-product grant expansion", async () => {
    const { session, token } = await startQuizSession({
      quizSlug: "brainrank",
      locale: "pt",
      market: "BR",
    });

    // 1. Create BUNDLE_DISCOVER order (R$ 19,90)
    const { order } = await createOrder({
      sessionId: session.id,
      sessionToken: token,
      productCode: "BUNDLE_DISCOVER",
      customerEmail: "bundle-buyer@example.com",
      market: "BR",
      locale: "pt",
    });

    expect(order.amount).toBe(1990); // R$ 19,90
    expect(order.currency).toBe("BRL");

    // 2. Fulfill BUNDLE_DISCOVER order
    const fulfillment = await fulfillOrder(order.id, "evt_bundle_test");
    expect(fulfillment.success).toBe(true);

    // Verify all 3 quizzes granted in result_access_grants
    const supabase = createSupabaseSecretClient();
    const { data: grants } = await supabase
      .from("result_access_grants")
      .select("product_code, grant_type")
      .eq("session_id", session.id)
      .eq("grant_type", "PREMIUM_REPORT");

    const grantedCodes = grants?.map((g) => g.product_code).sort();
    expect(grantedCodes).toEqual(["BRAINRANK", "DECISIONDNA", "PERSONALITY_MAP"]);
  });
});
