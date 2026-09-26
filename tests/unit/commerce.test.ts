import { describe, it, expect } from "vitest";
import { startQuizSession } from "@/features/quiz-engine/session-service";
import { createOrder, getOrderById } from "@/features/commerce/order-service";
import { fulfillOrder, refundOrder } from "@/features/commerce/fulfillment-service";
import { handleWebhook } from "@/features/commerce/webhook-handler";
import { reconcileUnfulfilledPaidOrders } from "@/features/commerce/reconciliation-service";
import { createSupabaseSecretClient } from "@/lib/supabase/server";

describe("Commerce & Fulfillment Lifecycle — Integration Tests", () => {
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

    const stored = await getOrderById(result.order.id);
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
    const updatedOrder = await getOrderById(order.id);
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

    // First delivery
    const res1 = await handleWebhook("stripe", {
      payload: webhookPayload,
      headers: {},
    });
    expect(res1.handled).toBe(true);
    expect(res1.duplicate).toBeUndefined();

    // Verify order is FULFILLED
    const fulfilledOrder = await getOrderById(order.id);
    expect(fulfilledOrder?.status).toBe("FULFILLED");

    // Duplicate webhook delivery (e.g. Stripe network retry)
    const res2 = await handleWebhook("stripe", {
      payload: webhookPayload,
      headers: {},
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
    const repairedOrder = await getOrderById(order.id);
    expect(repairedOrder?.status).toBe("FULFILLED");

    const { data: grants } = await supabase
      .from("result_access_grants")
      .select("id")
      .eq("session_id", session.id)
      .eq("grant_type", "PREMIUM_REPORT");

    expect(grants?.length).toBe(1);

    // Now test Refund: revokes grant and transitions order to REFUNDED
    const refundResult = await refundOrder(order.id, "Customer requested cancellation within 7 days");
    expect(refundResult.success).toBe(true);

    const refundedOrder = await getOrderById(order.id);
    expect(refundedOrder?.status).toBe("REFUNDED");

    // Grant should now be revoked
    const { data: grantsPostRefund } = await supabase
      .from("result_access_grants")
      .select("id")
      .eq("session_id", session.id)
      .eq("grant_type", "PREMIUM_REPORT");

    expect(grantsPostRefund).toHaveLength(0);
  });
});
