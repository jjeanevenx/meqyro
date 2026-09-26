import { describe, it, expect } from "vitest";
import { careerFitScoringV1 } from "@/features/scoring/careerfit";
import { moneyDnaScoringV1 } from "@/features/scoring/moneydna";
import { focusStyleScoringV1 } from "@/features/scoring/focusstyle";
import { decisionDnaScoringV1, type DecisionDnaItem } from "@/features/scoring/decisiondna";
import { coupleDnaScoringV1 } from "@/features/scoring/coupledna";
import { getFallbackPublicQuiz } from "@/features/quiz-engine/repository";

describe("Phase 6 — Quizzes Catalog & Scoring Engines", () => {
  it("scores CareerFit accurately across 6 career anchors", () => {
    const items = [
      { id: "1", stableKey: "CF_TECH_01", dimension: "TECHNICAL" as const },
      { id: "2", stableKey: "CF_TECH_02", dimension: "TECHNICAL" as const },
      { id: "3", stableKey: "CF_MGT_01", dimension: "MANAGERIAL" as const },
      { id: "4", stableKey: "CF_CREAT_01", dimension: "CREATIVE" as const },
    ];

    const answers = {
      "1": 5,
      "2": 5,
      "3": 3,
      "4": 1,
    };

    const result = careerFitScoringV1.score(items, answers);
    expect(result.primaryAnchor).toBe("TECHNICAL");
    expect(result.dimensionScores.TECHNICAL).toBe(100);
    expect(result.dimensionScores.CREATIVE).toBe(0);
    expect(result.totalResponses).toBe(4);
  });

  it("scores MoneyDNA archetypes based on behavioral prompts", () => {
    const items = [
      { id: "1", stableKey: "MD_BLD_01", archetype: "BUILDER" as const },
      { id: "2", stableKey: "MD_GRD_01", archetype: "GUARDIAN" as const },
      { id: "3", stableKey: "MD_STRAT_01", archetype: "STRATEGIST" as const },
      { id: "4", stableKey: "MD_STRAT_02", archetype: "STRATEGIST" as const },
    ];

    const answers = {
      "1": 4,
      "2": 2,
      "3": 5,
      "4": 5,
    };

    const result = moneyDnaScoringV1.score(items, answers);
    expect(result.dominantArchetype).toBe("STRATEGIST");
    expect(result.secondaryArchetype).toBe("BUILDER");
    expect(result.archetypeScores.STRATEGIST).toBe(100);
    expect(result.totalResponses).toBe(4);
  });

  it("scores FocusStyle productive patterns", () => {
    const items = [
      { id: "1", stableKey: "FS_HYPER_01", style: "IMMERSIVE_HYPERFOCUS" as const },
      { id: "2", stableKey: "FS_MOD_01", style: "MODULAR_SERIAL" as const },
      { id: "3", stableKey: "FS_SPR_01", style: "REACTIVE_SPRINT" as const },
    ];

    const answers = {
      "1": 5,
      "2": 3,
      "3": 1,
    };

    const result = focusStyleScoringV1.score(items, answers);
    expect(result.primaryStyle).toBe("IMMERSIVE_HYPERFOCUS");
    expect(result.styleScores.IMMERSIVE_HYPERFOCUS).toBe(100);
    expect(result.totalResponses).toBe(3);
  });

  it("scores DecisionDNA practical scenarios with distribution", () => {
    const items: DecisionDnaItem[] = [
      {
        id: "1",
        stableKey: "DD_01",
        optionStyleMap: {
          opt_a: "ANALYTICAL" as const,
          opt_b: "INTUITIVE" as const,
        },
      },
      {
        id: "2",
        stableKey: "DD_02",
        optionStyleMap: {
          opt_c: "ANALYTICAL" as const,
          opt_d: "PRAGMATIC" as const,
        },
      },
    ];

    const answers = {
      "1": "opt_a",
      "2": "opt_c",
    };

    const result = decisionDnaScoringV1.score(items, answers);
    expect(result.dominantStyle).toBe("ANALYTICAL");
    expect(result.styleDistribution.ANALYTICAL).toBe(100);
    expect(result.totalDecisions).toBe(2);
  });

  it("scores CoupleDNA individual dimensions", () => {
    const items = [
      { id: "1", stableKey: "CD_COMM_01", dimension: "COMMUNICATION" as const },
      { id: "2", stableKey: "CD_VAL_01", dimension: "LIFE_VALUES" as const },
    ];

    const answers = {
      "1": 5,
      "2": 3,
    };

    const result = coupleDnaScoringV1.scoreIndividual(items, answers);
    expect(result.dimensionScores.COMMUNICATION).toBe(100);
    expect(result.dimensionScores.LIFE_VALUES).toBe(50);
  });

  it("loads all 7 quizzes from repository fallback across all 4 locales", () => {
    const slugs = [
      "brainrank",
      "personality-map",
      "careerfit",
      "moneydna",
      "focusstyle",
      "decisiondna",
      "coupledna",
    ];

    for (const slug of slugs) {
      const quiz = getFallbackPublicQuiz(slug, "pt");
      expect(quiz).not.toBeNull();
      expect(quiz?.slug).toBe(slug);
      expect(quiz?.questions.length).toBeGreaterThan(0);
    }
  });
});
