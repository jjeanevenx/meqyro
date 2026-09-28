import { describe, expect, it } from "vitest";
import { getFallbackPublicQuiz } from "@/features/quiz-engine/repository";
import { locales } from "@/lib/i18n/config";
import { brainRankScoringV1 } from "@/features/scoring/brainrank";
import { personalityMapScoringV1 } from "@/features/scoring/personality-map";
import { careerFitScoringV1 } from "@/features/scoring/careerfit";
import { moneyDnaScoringV1 } from "@/features/scoring/moneydna";
import { focusStyleScoringV1 } from "@/features/scoring/focusstyle";
import { decisionDnaScoringV1 } from "@/features/scoring/decisiondna";
import { coupleDnaScoringV1 } from "@/features/scoring/coupledna";
import { personalityMapQuestions } from "@/content/quizzes/personality-map";
import { buildComprehensiveReport } from "@/features/results/result-service";

const QUIZZES = [
  { slug: "brainrank", expectedTotal: 24 },
  { slug: "personality-map", expectedTotal: 40 },
  { slug: "careerfit", expectedTotal: 24 },
  { slug: "moneydna", expectedTotal: 20 },
  { slug: "focusstyle", expectedTotal: 20 },
  { slug: "decisiondna", expectedTotal: 4 },
  { slug: "coupledna", expectedTotal: 20 },
] as const;

describe("All 7 Quizzes — Complete in-memory end-to-end flow", () => {
  for (const { slug, expectedTotal } of QUIZZES) {
    describe(`Quiz: ${slug}`, () => {
      for (const locale of locales) {
        it(`loads successfully in ${locale.toUpperCase()} with ${expectedTotal} questions`, () => {
          const quiz = getFallbackPublicQuiz(slug, locale);
          expect(quiz).not.toBeNull();
          expect(quiz?.slug).toBe(slug);
          expect(quiz?.questions.length).toBe(expectedTotal);
          expect(quiz?.totalQuestions).toBe(expectedTotal);

          // Verify every question has localized prompt
          for (const q of quiz!.questions) {
            expect(typeof q.prompt).toBe("string");
            expect(q.prompt.length).toBeGreaterThan(0);
            if (q.kind === "SINGLE_CHOICE" || q.kind === "SCENARIO") {
              expect(q.options.length).toBeGreaterThan(1);
              for (const opt of q.options) {
                expect(typeof opt.label).toBe("string");
                expect(opt.label.length).toBeGreaterThan(0);
              }
            }
          }
        });
      }

      it(`simulates answer completion and calculates valid score in ${slug}`, () => {
        const quiz = getFallbackPublicQuiz(slug, "pt")!;

        if (slug === "brainrank") {
          const items = quiz.questions.map((q) => ({
            id: q.id,
            dimension: "PATTERN_RECOGNITION" as const,
            difficulty: "MEDIUM" as const,
            correctOptionId: q.options[0].id,
          }));
          const answers = items.map((item) => ({
            questionId: item.id,
            optionId: item.correctOptionId,
            durationMs: 3500,
          }));
          const result = brainRankScoringV1.score(items, answers);
          expect(result.rawCorrect).toBe(24);
          expect(result.overallScore).toBe(1000);

          const report = buildComprehensiveReport(slug, result as unknown as Record<string, unknown>, "pt");
          expect(report.executiveSummary).toBeDefined();
          expect(report.sections.length).toBeGreaterThan(0);
        } else if (slug === "personality-map") {
          const items = personalityMapQuestions.map((q) => ({
            id: q.stableKey,
            dimension: q.dimension,
            direction: q.direction,
          }));
          const answers = items.map((item) => ({
            questionId: item.id,
            value: item.direction === "DIRECT" ? 4 : 2,
          }));
          const result = personalityMapScoringV1.score(items, answers);
          expect(result.dimensionScores.OPENNESS).toBeGreaterThan(0);
          expect(result.dimensionScores.CONSCIENTIOUSNESS).toBeGreaterThan(0);
          expect(result.dimensionScores.EXTRAVERSION).toBeGreaterThan(0);
          expect(result.dimensionScores.AGREEABLENESS).toBeGreaterThan(0);
          expect(result.dimensionScores.EMOTIONAL_STABILITY).toBeGreaterThan(0);
        } else if (slug === "careerfit") {
          const items = quiz.questions.map((q) => ({
            id: q.id,
            stableKey: q.stableKey,
            dimension: "TECHNICAL" as const,
          }));
          const answers: Record<string, number> = {};
          items.forEach((item) => { answers[item.id] = 4; });
          const result = careerFitScoringV1.score(items, answers);
          expect(result.primaryAnchor).toBeDefined();
          expect(result.dimensionScores.TECHNICAL).toBe(75);
        } else if (slug === "moneydna") {
          const items = quiz.questions.map((q) => ({
            id: q.id,
            stableKey: q.stableKey,
            archetype: "BUILDER" as const,
          }));
          const answers: Record<string, number> = {};
          items.forEach((item) => { answers[item.id] = 5; });
          const result = moneyDnaScoringV1.score(items, answers);
          expect(result.dominantArchetype).toBe("BUILDER");
          expect(result.archetypeScores.BUILDER).toBe(100);
        } else if (slug === "focusstyle") {
          const items = quiz.questions.map((q) => ({
            id: q.id,
            stableKey: q.stableKey,
            style: "IMMERSIVE_HYPERFOCUS" as const,
          }));
          const answers: Record<string, number> = {};
          items.forEach((item) => { answers[item.id] = 5; });
          const result = focusStyleScoringV1.score(items, answers);
          expect(result.primaryStyle).toBe("IMMERSIVE_HYPERFOCUS");
          expect(result.styleScores.IMMERSIVE_HYPERFOCUS).toBe(100);
        } else if (slug === "decisiondna") {
          const items = quiz.questions.map((q) => ({
            id: q.id,
            stableKey: q.stableKey,
            optionStyleMap: {
              [q.options[0].id]: "ANALYTICAL" as const,
            },
          }));
          const answers: Record<string, string> = {};
          quiz.questions.forEach((q) => { answers[q.id] = q.options[0].id; });
          const result = decisionDnaScoringV1.score(items, answers);
          expect(result.dominantStyle).toBe("ANALYTICAL");
          expect(result.styleDistribution.ANALYTICAL).toBe(100);
        } else if (slug === "coupledna") {
          const items = quiz.questions.map((q) => ({
            id: q.id,
            stableKey: q.stableKey,
            dimension: "COMMUNICATION" as const,
          }));
          const answers: Record<string, number> = {};
          items.forEach((item) => { answers[item.id] = 4; });
          const individualScore = coupleDnaScoringV1.scoreIndividual(items, answers);
          expect(individualScore.dimensionScores.COMMUNICATION).toBe(75);

          const comparison = coupleDnaScoringV1.compareBilateral(individualScore, individualScore, true);
          expect(comparison.overallAlignmentPercentage).toBe(100);
        }
      });
    });
  }
});
