import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createOrder, setPaymentProviderFactoryForTests } from "@/features/commerce/order-service";
import { fulfillOrder } from "@/features/commerce/fulfillment-service";
import { ControlledPaymentProvider } from "./controlled-payment-provider";
import { startQuizSession } from "@/features/quiz-engine/session-service";
import {
  createCoupleInvite,
  acceptCoupleInvite,
  getCoupleComparison,
} from "@/features/couple/couple-service";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { isSupabaseAvailable } from "./db-check";

const isOnline = await isSupabaseAvailable();
beforeAll(() => setPaymentProviderFactoryForTests((name) => new ControlledPaymentProvider(name)));
afterAll(() => setPaymentProviderFactoryForTests(null));

describe.skipIf(!isOnline)("Phase 6 — CoupleDNA Bilateral Consent & Comparison Lifecycle", () => {
  it("enforces bilateral consent and blocks unilateral results leak", async () => {
    const supabase = createSupabaseSecretClient();

    // 1. Person A starts CoupleDNA session
    const { session: sessionA, token: tokenA } = await startQuizSession({
      quizSlug: "coupledna",
      locale: "pt",
      market: "BR",
    });

    // 2. Person A creates couple invite
    const inviteData = await createCoupleInvite(sessionA.id, tokenA, "pt", true);
    expect(inviteData).not.toBeNull();
    expect(inviteData?.inviteCode).toMatch(/^CP-[A-F0-9]{8}$/);

    // 3. Before partner accepts or completes, comparison is locked
    const comparisonBefore = await getCoupleComparison(inviteData!.inviteCode, sessionA.id, tokenA);
    expect(comparisonBefore).not.toBeNull();
    expect(comparisonBefore?.bilateralUnlocked).toBe(false);

    // 4. Person B starts CoupleDNA session
    const { session: sessionB, token: tokenB } = await startQuizSession({
      quizSlug: "coupledna",
      locale: "pt",
      market: "BR",
    });

    // 5. Person B accepts invite
    const acceptResult = await acceptCoupleInvite(
      inviteData!.inviteCode,
      sessionB.id,
      tokenB,
      true,
    );
    expect(acceptResult?.success).toBe(true);

    // 6. Complete results for both in results table
    await supabase.from("results").insert([
      {
        session_id: sessionA.id,
        quiz_version: "v1.0.0",
        scoring_version: "v1",
        score: {
          dimensionScores: {
            COMMUNICATION: 85,
            LIFE_VALUES: 90,
            CONFLICT_MANAGEMENT: 75,
            FINANCES: 80,
            FUTURE_PLANS: 95,
          },
          totalResponses: 20,
        },
        input_snapshot: {},
      },
      {
        session_id: sessionB.id,
        quiz_version: "v1.0.0",
        scoring_version: "v1",
        score: {
          dimensionScores: {
            COMMUNICATION: 80,
            LIFE_VALUES: 85,
            CONFLICT_MANAGEMENT: 70,
            FINANCES: 85,
            FUTURE_PLANS: 90,
          },
          totalResponses: 20,
        },
        input_snapshot: {},
      },
    ]);

    const finished = await supabase
      .from("quiz_sessions")
      .update({ status: "COMPLETED", completed_at: new Date().toISOString() })
      .in("id", [sessionA.id, sessionB.id]);
    expect(finished.error).toBeNull();
    expect(
      (await getCoupleComparison(inviteData!.inviteCode, sessionA.id, tokenA))?.bilateralUnlocked,
    ).toBe(false);
    const { order } = await createOrder({
      sessionId: sessionA.id,
      sessionToken: tokenA,
      productCode: "COUPLEDNA",
      customerEmail: "couple-local-test@example.com",
      market: "BR",
      locale: "pt",
    });
    await fulfillOrder(order.id, "controlled-couple-test");
    // 7. Completed assessments, bilateral consent and confirmed purchase unlock comparison.
    const comparisonUnlocked = await getCoupleComparison(
      inviteData!.inviteCode,
      sessionA.id,
      tokenA,
    );

    expect(comparisonUnlocked).not.toBeNull();
    expect(comparisonUnlocked?.bilateralUnlocked).toBe(true);
    expect(comparisonUnlocked?.overallAlignmentPercentage).toBeGreaterThan(80);
    expect(comparisonUnlocked?.dimensionAlignments.COMMUNICATION).toBe(95);
    expect(comparisonUnlocked?.dimensionAlignments.LIFE_VALUES).toBe(95);
    expect(comparisonUnlocked?.dimensionAlignments.FUTURE_PLANS).toBe(95);

    // 8. Third-party session cannot access the couple's comparison
    const { session: outsider, token: outsiderToken } = await startQuizSession({
      quizSlug: "coupledna",
      locale: "pt",
      market: "BR",
    });

    const unauthorizedAttempt = await getCoupleComparison(
      inviteData!.inviteCode,
      outsider.id,
      outsiderToken,
    );
    expect(unauthorizedAttempt).toBeNull();
  });
});
