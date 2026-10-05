import { acknowledgeMemory } from "./memory-helper";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createOrder, setPaymentProviderFactoryForTests } from "@/features/commerce/order-service";
import { fulfillOrder } from "@/features/commerce/fulfillment-service";
import { ControlledPaymentProvider } from "./controlled-payment-provider";
import {
  startQuizSession,
  saveAnswer,
  completeQuizSession,
} from "@/features/quiz-engine/session-service";
import { getPublicQuiz } from "@/features/quiz-engine/repository";
import { getProtectedResult } from "@/features/results/result-service";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { isSupabaseAvailable } from "./db-check";

const isOnline = await isSupabaseAvailable();
beforeAll(() => setPaymentProviderFactoryForTests((name) => new ControlledPaymentProvider(name)));
afterAll(() => setPaymentProviderFactoryForTests(null));

describe.skipIf(!isOnline)("Protected Result & Paywall Service — Integration Tests", () => {
  it("enforces free partial view and blocks premium content until grant is acquired", async () => {
    // 1. Start BrainRank session
    const { session, token } = await startQuizSession({
      quizSlug: "brainrank",
      locale: "pt",
      market: "BR",
    });

    const supabase = createSupabaseSecretClient();
    const quiz = await getPublicQuiz("brainrank", "pt", session.id);

    // Answer all questions
    for (let i = 0; i < (quiz?.questions?.length ?? 0); i++) {
      const q = quiz!.questions[i]!;
      await acknowledgeMemory(q, session.id, token);
      const optId = q.options[0]?.id;
      await saveAnswer({
        sessionId: session.id,
        token,
        questionId: q.id,
        optionId: optId,
        durationMs: 1200,
        nextPosition: i + 2,
      });
    }

    // Complete session
    await completeQuizSession({
      sessionId: session.id,
      token,
    });

    // 2. Query protected result as an unpaid user
    const freeResult = await getProtectedResult({
      sessionId: session.id,
      sessionToken: token,
      locale: "pt",
      market: "BR",
    });

    expect(freeResult.accessLevel).toBe("FREE_PARTIAL");
    expect(freeResult.summary).toBeDefined();
    expect(freeResult.summary.overallScore).toBeDefined();
    expect(freeResult.paywall).toBeDefined();
    expect(freeResult.paywall?.formattedPrice).toBe("R$\u00a012,90");
    // CRITICAL SECURITY ASSERTION: No premium report is returned
    expect(freeResult.premiumReport).toBeUndefined();

    // 3. Grant premium access to simulate post-checkout fulfillment
    await supabase.from("result_access_grants").insert({
      session_id: session.id,
      product_code: "BRAINRANK",
      grant_type: "PREMIUM_REPORT",
    });

    // A detached grant cannot stand in for confirmed payment.
    expect(
      (
        await getProtectedResult({
          sessionId: session.id,
          sessionToken: token,
          locale: "pt",
          market: "BR",
        })
      ).accessLevel,
    ).toBe("FREE_PARTIAL");
    const { order } = await createOrder({
      sessionId: session.id,
      sessionToken: token,
      productCode: "BRAINRANK",
      customerEmail: "protected-local-test@example.com",
      market: "BR",
      locale: "pt",
    });
    await fulfillOrder(order.id, "controlled-protected-test");
    // 4. Query protected result again as a paid user
    const paidResult = await getProtectedResult({
      sessionId: session.id,
      sessionToken: token,
      locale: "pt",
      market: "BR",
    });

    expect(paidResult.accessLevel).toBe("PREMIUM_UNLOCKED");
    expect(paidResult.paywall).toBeUndefined();
    expect(paidResult.premiumReport?.percentileRank).toBeUndefined();
    expect(paidResult.premiumReport?.sections.length).toBeGreaterThan(0);
    expect(paidResult.premiumReport?.executiveSummary).toBeDefined();
    expect(paidResult.premiumReport?.comparativeBenchmark).toBeDefined();
  });
});
