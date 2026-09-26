import { describe, it, expect } from "vitest";
import { startQuizSession, saveAnswer, completeQuizSession } from "@/features/quiz-engine/session-service";
import { getProtectedResult } from "@/features/results/result-service";
import { createSupabaseSecretClient } from "@/lib/supabase/server";

describe("Protected Result & Paywall Service", () => {
  it("enforces free partial view and blocks premium content until grant is acquired", async () => {
    // 1. Start BrainRank session
    const { session, token } = await startQuizSession({
      quizSlug: "brainrank",
      locale: "pt",
      market: "BR",
    });

    const supabase = createSupabaseSecretClient();
    const { data: questions } = await supabase
      .from("questions")
      .select("id, options(id)")
      .eq("quiz_version_id", session.quizVersionId);

    // Answer all questions
    for (let i = 0; i < (questions?.length ?? 0); i++) {
      const q = questions![i]!;
      const optId = (q.options as Array<{ id: string }>)[0]?.id;
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

    // 4. Query protected result as a verified premium user
    const premiumResult = await getProtectedResult({
      sessionId: session.id,
      sessionToken: token,
      locale: "pt",
      market: "BR",
    });

    expect(premiumResult.accessLevel).toBe("PREMIUM_UNLOCKED");
    expect(premiumResult.premiumReport).toBeDefined();
    expect(premiumResult.premiumReport?.executiveSummary).toBeDefined();
    expect(premiumResult.premiumReport?.percentileRank).toBeGreaterThan(0);
    expect(premiumResult.premiumReport?.sections.length).toBeGreaterThan(0);
    expect(premiumResult.premiumReport?.comparativeBenchmark).toBeDefined();
  }, 15000);
});
