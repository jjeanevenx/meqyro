import { describe, it, expect } from "vitest";
import {
  brainRankScoringV1,
  brainRankDimensions,
  type BrainRankItem,
} from "@/features/scoring/brainrank";
import {
  personalityMapScoringV1,
  personalityDimensions,
  type PersonalityItem,
} from "@/features/scoring/personality-map";
import { careerFitScoringV1 } from "@/features/scoring/careerfit";
import { moneyDnaScoringV1 } from "@/features/scoring/moneydna";
import { focusStyleScoringV1 } from "@/features/scoring/focusstyle";
import { decisionDnaScoringV1, type DecisionDnaItem } from "@/features/scoring/decisiondna";
import { coupleDnaScoringV1 } from "@/features/scoring/coupledna";

describe("Golden Scoring Tests for All 7 Quizzes", () => {
  describe("1. BrainRank Cognitive Scoring Engine", () => {
    // Generate 24 items: 4 items per dimension across 6 dimensions
    const items: BrainRankItem[] = brainRankDimensions.flatMap((dim, dimIdx) => [
      { id: `br_${dimIdx}_1`, dimension: dim, difficulty: "EASY", correctOptionId: "opt_correct" },
      { id: `br_${dimIdx}_2`, dimension: dim, difficulty: "EASY", correctOptionId: "opt_correct" },
      {
        id: `br_${dimIdx}_3`,
        dimension: dim,
        difficulty: "MEDIUM",
        correctOptionId: "opt_correct",
      },
      { id: `br_${dimIdx}_4`, dimension: dim, difficulty: "HARD", correctOptionId: "opt_correct" },
    ]);

    it("calculates perfect 1000 overall score when all 24 answers are correct", () => {
      const answers = items.map((item) => ({
        questionId: item.id,
        optionId: "opt_correct",
        durationMs: 3000,
      }));

      const result = brainRankScoringV1.score(items, answers);
      expect(result.rawCorrect).toBe(24);
      expect(result.overallScore).toBe(1000);
      for (const dim of brainRankDimensions) {
        expect(result.dimensionScores[dim]).toBe(100);
      }
    });

    it("calculates 0 score when all 24 answers are incorrect", () => {
      const answers = items.map((item) => ({
        questionId: item.id,
        optionId: "opt_wrong",
        durationMs: 4000,
      }));

      const result = brainRankScoringV1.score(items, answers);
      expect(result.rawCorrect).toBe(0);
      expect(result.overallScore).toBe(0);
      for (const dim of brainRankDimensions) {
        expect(result.dimensionScores[dim]).toBe(0);
      }
    });

    it("accurately identifies strongest cognitive dimension and handles tie breaking", () => {
      // Correct for only LOGICAL_REASONING (4/4 = 100%), rest wrong (0%)
      const answers = items.map((item) => ({
        questionId: item.id,
        optionId: item.dimension === "LOGICAL_REASONING" ? "opt_correct" : "opt_wrong",
        durationMs: 2500,
      }));

      const result = brainRankScoringV1.score(items, answers);
      expect(result.rawCorrect).toBe(4);
      expect(result.strongestDimension).toBe("LOGICAL_REASONING");
      expect(result.dimensionScores.LOGICAL_REASONING).toBe(100);
      expect(result.dimensionScores.SPEED).toBe(0);
    });
  });

  describe("2. Personality Map (Big Five) Scoring Engine", () => {
    // Generate 40 items: 8 items per dimension across 5 Big Five dimensions
    const items: PersonalityItem[] = personalityDimensions.flatMap((dim, dimIdx) =>
      Array.from({ length: 8 }, (_, i) => ({
        id: `pm_${dimIdx}_${i}`,
        dimension: dim,
        direction: (i % 2 === 0 ? "DIRECT" : "REVERSE") as "DIRECT" | "REVERSE",
      })),
    );

    it("computes normalized dimension scores across Big Five with reverse-coded items", () => {
      // Answer 5 for DIRECT (gives 5) and 1 for REVERSE (gives 6 - 1 = 5) -> maximum score (100)
      const answers = items.map((item) => ({
        questionId: item.id,
        value: item.direction === "DIRECT" ? 5 : 1,
      }));

      const result = personalityMapScoringV1.score(items, answers);
      for (const dim of personalityDimensions) {
        expect(result.dimensionScores[dim]).toBe(100);
      }
      expect(result.uniformResponseWarning).toBe(false);
    });

    it("triggers uniformResponseWarning when all Likert answers are identical", () => {
      const answers = items.map((item) => ({
        questionId: item.id,
        value: 3,
      }));

      const result = personalityMapScoringV1.score(items, answers);
      expect(result.uniformResponseWarning).toBe(true);
      for (const dim of personalityDimensions) {
        expect(result.dimensionScores[dim]).toBe(50); // Midpoint
      }
    });
  });

  describe("3. CareerFit Scoring Engine", () => {
    it("determines dominant career anchor with deterministic scoring", () => {
      const items = [
        { id: "cf_1", stableKey: "CF_TECH_01", dimension: "TECHNICAL" as const },
        { id: "cf_2", stableKey: "CF_TECH_02", dimension: "TECHNICAL" as const },
        { id: "cf_3", stableKey: "CF_MGT_01", dimension: "MANAGERIAL" as const },
        { id: "cf_4", stableKey: "CF_AUTO_01", dimension: "AUTONOMOUS" as const },
      ];

      const answers = {
        cf_1: 5,
        cf_2: 5,
        cf_3: 3,
        cf_4: 2,
      };

      const result = careerFitScoringV1.score(items, answers);
      expect(result.primaryAnchor).toBe("TECHNICAL");
      expect(result.dimensionScores.TECHNICAL).toBe(100);
      expect(result.dimensionScores.MANAGERIAL).toBe(50);
      expect(result.dimensionScores.AUTONOMOUS).toBe(25);
    });
  });

  describe("4. MoneyDNA Behavioral Archetypes Scoring Engine", () => {
    it("scores dominant and secondary financial archetypes", () => {
      const items = [
        { id: "md_1", stableKey: "MD_BLD_01", archetype: "BUILDER" as const },
        { id: "md_2", stableKey: "MD_BLD_02", archetype: "BUILDER" as const },
        { id: "md_3", stableKey: "MD_GRD_01", archetype: "GUARDIAN" as const },
        { id: "md_4", stableKey: "MD_STRAT_01", archetype: "STRATEGIST" as const },
      ];

      const answers = {
        md_1: 5,
        md_2: 4,
        md_3: 2,
        md_4: 1,
      };

      const result = moneyDnaScoringV1.score(items, answers);
      expect(result.dominantArchetype).toBe("BUILDER");
      expect(result.archetypeScores.BUILDER).toBe(88);
      expect(result.totalResponses).toBe(4);
    });
  });

  describe("5. FocusStyle Productivity Styles Scoring Engine", () => {
    it("scores natural focus patterns and execution modes", () => {
      const items = [
        { id: "fs_1", stableKey: "FS_HYPER_01", style: "IMMERSIVE_HYPERFOCUS" as const },
        { id: "fs_2", stableKey: "FS_MOD_01", style: "MODULAR_SERIAL" as const },
        { id: "fs_3", stableKey: "FS_SPR_01", style: "REACTIVE_SPRINT" as const },
      ];

      const answers = {
        fs_1: 5,
        fs_2: 3,
        fs_3: 1,
      };

      const result = focusStyleScoringV1.score(items, answers);
      expect(result.primaryStyle).toBe("IMMERSIVE_HYPERFOCUS");
      expect(result.styleScores.IMMERSIVE_HYPERFOCUS).toBe(100);
      expect(result.styleScores.MODULAR_SERIAL).toBe(50);
      expect(result.styleScores.REACTIVE_SPRINT).toBe(0);
    });
  });

  describe("6. DecisionDNA Practical Scenario Scoring Engine", () => {
    it("determines decision-making tendencies under scenario choices", () => {
      const items: DecisionDnaItem[] = [
        {
          id: "dd_1",
          stableKey: "SCENARIO_1",
          optionStyleMap: {
            opt_a: "ANALYTICAL",
            opt_b: "INTUITIVE",
          },
        },
        {
          id: "dd_2",
          stableKey: "SCENARIO_2",
          optionStyleMap: {
            opt_c: "ANALYTICAL",
            opt_d: "COLLABORATIVE",
          },
        },
      ];

      const answers = {
        dd_1: "opt_a",
        dd_2: "opt_c",
      };

      const result = decisionDnaScoringV1.score(items, answers);
      expect(result.dominantStyle).toBe("ANALYTICAL");
      expect(result.styleDistribution.ANALYTICAL).toBe(100);
      expect(result.totalDecisions).toBe(2);
    });
  });

  describe("7. CoupleDNA Bilateral Alignment Engine", () => {
    it("computes bilateral harmony and per-dimension alignment accurately", () => {
      const individualA = {
        dimensionScores: {
          COMMUNICATION: 85,
          LIFE_VALUES: 90,
          CONFLICT_MANAGEMENT: 75,
          FINANCES: 80,
          FUTURE_PLANS: 95,
        },
        totalResponses: 25,
      };

      const individualB = {
        dimensionScores: {
          COMMUNICATION: 80,
          LIFE_VALUES: 90,
          CONFLICT_MANAGEMENT: 75,
          FINANCES: 70,
          FUTURE_PLANS: 95,
        },
        totalResponses: 25,
      };

      const result = coupleDnaScoringV1.compareBilateral(individualA, individualB, true);

      // Alignment = 100 - abs(diff)
      // COMMUNICATION: 100 - 5 = 95
      // LIFE_VALUES: 100 - 0 = 100
      // CONFLICT_MANAGEMENT: 100 - 0 = 100
      // FINANCES: 100 - 10 = 90
      // FUTURE_PLANS: 100 - 0 = 100
      // Overall = (95 + 100 + 100 + 90 + 100) / 5 = 97
      expect(result.bilateralUnlocked).toBe(true);
      expect(result.dimensionAlignments.COMMUNICATION).toBe(95);
      expect(result.dimensionAlignments.LIFE_VALUES).toBe(100);
      expect(result.dimensionAlignments.FINANCES).toBe(90);
      expect(result.overallAlignmentPercentage).toBe(97);
    });
  });
});
