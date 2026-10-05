import { describe, expect, it } from "vitest";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { experiences, featuredExperience } from "@/content/experiences";
import { getFallbackPublicQuiz } from "@/features/quiz-engine/repository";
import { brainRankScoringV1 } from "@/features/scoring/brainrank";
import { buildComprehensiveReport } from "@/features/results/result-service";
import { StripeAdapter } from "@/features/commerce/adapters/stripe";
import { formatMoney } from "@/lib/market/prices";

describe("Complete End-to-End Funnel Simulation (Reference: BrainRank)", () => {
  it("executes the entire funnel from Home to Premium Result without error", async () => {
    const locale = "pt";
    const dict = getDictionary(locale);

    // 1. Home
    expect(dict.hero.title).toBeDefined();
    expect(dict.hero.cta).toBe("Começar a descobrir");
    expect(featuredExperience.slug).toBe("brainrank");

    // 2. Discover
    const brainRankCard = experiences.find((e) => e.slug === "brainrank");
    expect(brainRankCard).toBeDefined();
    expect(brainRankCard?.items[locale]).toBe("24 desafios");

    // 3. Details
    expect(brainRankCard?.duration).toBe("7–10 min");

    // 4. Start (fetch public quiz)
    const quiz = getFallbackPublicQuiz("brainrank", locale);
    expect(quiz).not.toBeNull();
    expect(quiz?.questions.length).toBe(24);

    // 5. Questions & Answers
    const answers = quiz!.questions.map((q, idx) => ({
      questionId: q.id,
      optionId: q.options[idx % q.options.length].id,
      durationMs: 3000,
    }));
    expect(answers.length).toBe(24);

    // 6. Complete & Free Result
    const items = quiz!.questions
      .filter((q) => !q.memoryRecall)
      .map((q) => ({
        id: q.id,
        dimension: "PATTERN_RECOGNITION" as const,
        difficulty: "MEDIUM" as const,
        correctOptionId: q.options[0].id,
      }));
    const scoreResult = brainRankScoringV1.score(
      items,
      answers.filter((answer) => items.some((item) => item.id === answer.questionId)),
    );
    expect(scoreResult.overallScore).toBeGreaterThanOrEqual(0);
    expect(scoreResult.strongestDimension).toBeDefined();

    // 7. Lead capture simulation
    const candidateEmail = "user.tester@example.com";
    expect(candidateEmail).toContain("@");
    const marketingConsent = false;
    expect(typeof marketingConsent).toBe("boolean");

    // 8. Premium Offer & Pricing
    const brlPrice = 1290; // R$ 12,90
    const formattedBrl = formatMoney(brlPrice, "BRL", locale);
    expect(formattedBrl.replace(/\u00a0/g, " ")).toBe("R$ 12,90");

    const usdPrice = 290; // $2.90
    const formattedUsd = formatMoney(usdPrice, "USD", "en");
    expect(formattedUsd).toBe("$2.90");

    // 9. Providers fail closed: development must never simulate a paid checkout.
    const previousStripeKey = process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_SECRET_KEY;
    const stripe = new StripeAdapter();
    await expect(
      stripe.createCheckout({
        orderId: "ord_test_stripe_123",
        orderNumber: "MQ-US-20260926-TEST1",
        amount: usdPrice,
        currency: "USD",
        customerEmail: candidateEmail,
        productCode: "BRAINRANK",
        locale: "en",
        successUrl: "http://localhost:3000/en/checkout/success",
        cancelUrl: "http://localhost:3000/en/checkout/failed",
        idempotencyKey: "checkout:ord_test_stripe_123",
      }),
    ).rejects.toThrow(/STRIPE_SECRET_KEY/);

    if (previousStripeKey) process.env.STRIPE_SECRET_KEY = previousStripeKey;

    // 10. Premium Report Delivery
    const premiumReport = buildComprehensiveReport(
      "brainrank",
      scoreResult as unknown as Record<string, unknown>,
      locale,
    );
    expect(premiumReport.executiveSummary).toBeDefined();
    expect(premiumReport.percentileRank).toBeUndefined();
    expect(premiumReport.bandLabel).toBeDefined();
    expect(premiumReport.sections.length).toBeGreaterThan(0);
    expect(premiumReport.comparativeBenchmark.description).toContain(
      "nem substitui avaliação profissional",
    );
  });
});
