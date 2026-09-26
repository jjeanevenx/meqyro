import { describe, it, expect } from "vitest";
import { recordFunnelEvent } from "@/features/analytics/analytics-service";
import {
  createReferralLink,
  recordReferralClick,
  recordReferralConversion,
} from "@/features/referrals/referral-service";
import { startQuizSession } from "@/features/quiz-engine/session-service";
import { fulfillOrder } from "@/features/commerce/fulfillment-service";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { isSupabaseAvailable } from "./db-check";

const isOnline = await isSupabaseAvailable();

describe.skipIf(!isOnline)("Growth, SEO & Commerce DB Integration Tests", () => {
  it("records valid funnel event in postgres", async () => {
    const recorded = await recordFunnelEvent({
      eventName: "landing_viewed",
      quizSlug: "brainrank",
      locale: "pt",
      market: "BR",
      properties: {
        utm_source: "direct",
      },
    });

    expect(recorded).not.toBeNull();
    expect(recorded?.id).toBeDefined();
  });

  it("creates unique referral link for active session and increments click/conversion", async () => {
    const { session, token } = await startQuizSession({
      quizSlug: "brainrank",
      locale: "pt",
      market: "BR",
    });

    const shareData = await createReferralLink({
      sessionId: session.id,
      sessionToken: token,
      quizSlug: "brainrank",
      locale: "pt",
    });

    expect(shareData).not.toBeNull();
    expect(shareData?.referralCode).toMatch(/^MQ[A-F0-9]{8}$/);
    expect(shareData?.shareUrl).toContain(`?ref=${shareData?.referralCode}`);

    expect(shareData?.shareText).not.toContain(token);
    expect(shareData?.shareText).not.toContain(session.id);

    const clickSuccess = await recordReferralClick(shareData!.referralCode);
    expect(clickSuccess).toBe(true);

    const conversionSuccess = await recordReferralConversion(shareData!.referralCode);
    expect(conversionSuccess).toBe(true);
  });

  it("expands bundle product to provision multiple premium grants", async () => {
    const supabase = createSupabaseSecretClient();

    const { session } = await startQuizSession({
      quizSlug: "brainrank",
      locale: "pt",
      market: "BR",
    });

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        session_id: session.id,
        order_number: `MQ-TEST-BUNDLE-${Date.now()}`,
        status: "PAID",
        amount: 2990,
        currency: "BRL",
        market: "BR",
        payment_provider: "infinitepay",
        customer_email: "bundle-tester@meqyro.com",
      })
      .select("id")
      .single();

    expect(orderErr).toBeNull();

    await supabase.from("order_items").insert({
      order_id: order!.id,
      product_code: "PREMIUM_BUNDLE",
      amount: 2990,
    });

    const fulfillResult = await fulfillOrder(order!.id, "test_bundle_evt");
    expect(fulfillResult.success).toBe(true);

    const { data: grants } = await supabase
      .from("result_access_grants")
      .select("product_code")
      .eq("session_id", session.id);

    const grantedCodes = grants?.map((g) => g.product_code);
    expect(grantedCodes).toContain("BRAINRANK");
    expect(grantedCodes).toContain("PERSONALITY_MAP");
  });
});
