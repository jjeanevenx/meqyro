import { describe, expect, it } from "vitest";
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
import { careerFitScoringV1, type CareerFitDimension } from "@/features/scoring/careerfit";
import { moneyDnaScoringV1, type MoneyArchetype } from "@/features/scoring/moneydna";
import { focusStyleScoringV1, type FocusStyleType } from "@/features/scoring/focusstyle";
import { decisionDnaScoringV1, type DecisionDnaItem, type DecisionStyleType } from "@/features/scoring/decisiondna";
import { coupleDnaScoringV1, type CoupleDimension } from "@/features/scoring/coupledna";

describe("Deterministic Scoring Suite — All 7 Quizzes", () => {
  // =========================================================================
  // 1. BRAINRANK — Section 19: 0, 1, 50%, almost max, max, threshold ±1
  // =========================================================================
  describe("1. BrainRank boundary & threshold scoring", () => {
    const items: BrainRankItem[] = brainRankDimensions.flatMap((dim, dimIdx) => [
      { id: `br_${dimIdx}_1`, dimension: dim, difficulty: "EASY", correctOptionId: "opt_correct" },
      { id: `br_${dimIdx}_2`, dimension: dim, difficulty: "EASY", correctOptionId: "opt_correct" },
      { id: `br_${dimIdx}_3`, dimension: dim, difficulty: "MEDIUM", correctOptionId: "opt_correct" },
      { id: `br_${dimIdx}_4`, dimension: dim, difficulty: "HARD", correctOptionId: "opt_correct" },
    ]);

    it("scores 0 correct answers -> 0 raw, 0 overall", () => {
      const answers = items.map((item) => ({
        questionId: item.id,
        optionId: "opt_wrong",
        durationMs: 3000,
      }));
      const res = brainRankScoringV1.score(items, answers);
      expect(res.rawCorrect).toBe(0);
      expect(res.overallScore).toBe(0);
      for (const d of brainRankDimensions) {
        expect(res.dimensionScores[d]).toBe(0);
      }
    });

    it("scores exactly 1 correct answer -> 1 raw, 42 overall (Math.round(1000*1/24))", () => {
      const answers = items.map((item, idx) => ({
        questionId: item.id,
        optionId: idx === 0 ? "opt_correct" : "opt_wrong",
        durationMs: 3000,
      }));
      const res = brainRankScoringV1.score(items, answers);
      expect(res.rawCorrect).toBe(1);
      expect(res.overallScore).toBe(Math.round((1000 * 1) / 24)); // 42
      expect(res.dimensionScores.PATTERN_RECOGNITION).toBe(25);
    });

    it("scores 50% correct answers (12 of 24) -> 500 overall", () => {
      const answers = items.map((item, idx) => ({
        questionId: item.id,
        optionId: idx < 12 ? "opt_correct" : "opt_wrong",
        durationMs: 3000,
      }));
      const res = brainRankScoringV1.score(items, answers);
      expect(res.rawCorrect).toBe(12);
      expect(res.overallScore).toBe(500);
    });

    it("scores almost maximum (23 of 24) -> 958 overall", () => {
      const answers = items.map((item, idx) => ({
        questionId: item.id,
        optionId: idx < 23 ? "opt_correct" : "opt_wrong",
        durationMs: 3000,
      }));
      const res = brainRankScoringV1.score(items, answers);
      expect(res.rawCorrect).toBe(23);
      expect(res.overallScore).toBe(Math.round((1000 * 23) / 24)); // 958
    });

    it("scores maximum (24 of 24) -> 1000 overall", () => {
      const answers = items.map((item) => ({
        questionId: item.id,
        optionId: "opt_correct",
        durationMs: 3000,
      }));
      const res = brainRankScoringV1.score(items, answers);
      expect(res.rawCorrect).toBe(24);
      expect(res.overallScore).toBe(1000);
      for (const d of brainRankDimensions) {
        expect(res.dimensionScores[d]).toBe(100);
      }
    });

    it("tie-break prefers HARD_CORRECT when dimension scores are tied", () => {
      // Tie between PATTERN_RECOGNITION (dim 0) and LOGICAL_REASONING (dim 1)
      // Dim 0: answers 1 EASY correct (difficulty EASY) -> 1 correct
      // Dim 1: answers 1 HARD correct (difficulty HARD) -> 1 correct
      const answers = items.map((item) => {
        if (item.id === "br_0_1") return { questionId: item.id, optionId: "opt_correct", durationMs: 4000 };
        if (item.id === "br_1_4") return { questionId: item.id, optionId: "opt_correct", durationMs: 4000 };
        return { questionId: item.id, optionId: "opt_wrong", durationMs: 4000 };
      });
      const res = brainRankScoringV1.score(items, answers);
      expect(res.dimensionScores.PATTERN_RECOGNITION).toBe(25);
      expect(res.dimensionScores.LOGICAL_REASONING).toBe(25);
      expect(res.strongestDimension).toBe("LOGICAL_REASONING");
      expect(res.tieBreak).toBe("HARD_CORRECT");
    });
  });

  // =========================================================================
  // 2. PERSONALITY MAP — Section 20: Extremes per dimension & reverse scoring
  // =========================================================================
  describe("2. Personality Map (Big Five) extremes", () => {
    const items: PersonalityItem[] = personalityDimensions.flatMap((dim, dimIdx) =>
      Array.from({ length: 8 }, (_, i) => ({
        id: `pm_${dimIdx}_${i}`,
        dimension: dim,
        direction: (i < 4 ? "DIRECT" : "REVERSE") as "DIRECT" | "REVERSE",
      })),
    );

    for (const targetDim of personalityDimensions) {
      it(`maximizes dimension ${targetDim} to 100 while keeping others at 0`, () => {
        const answers = items.map((item) => {
          if (item.dimension === targetDim) {
            // Maximize: DIRECT = 5, REVERSE = 1 (oriented = 6-1 = 5) -> mean = 5 -> score = 100
            return {
              questionId: item.id,
              value: item.direction === "DIRECT" ? 5 : 1,
            };
          }
          // Minimize other dims: DIRECT = 1, REVERSE = 5 (oriented = 6-5 = 1) -> mean = 1 -> score = 0
          return {
            questionId: item.id,
            value: item.direction === "DIRECT" ? 1 : 5,
          };
        });

        const res = personalityMapScoringV1.score(items, answers);
        expect(res.dimensionScores[targetDim]).toBe(100);
        for (const otherDim of personalityDimensions) {
          if (otherDim !== targetDim) {
            expect(res.dimensionScores[otherDim]).toBe(0);
          }
        }
      });
    }
  });

  // =========================================================================
  // 3. CAREERFIT — Section 21: Maximizing individual dimensions
  // =========================================================================
  describe("3. CareerFit RIASEC/Anchors extremes", () => {
    const dimensions: CareerFitDimension[] = [
      "TECHNICAL",
      "MANAGERIAL",
      "CREATIVE",
      "AUTONOMOUS",
      "SECURITY",
      "CAUSE",
    ];

    const items = dimensions.flatMap((dim) =>
      Array.from({ length: 4 }, (_, i) => ({
        id: `cf_${dim}_${i}`,
        stableKey: `CF_${dim}_${i}`,
        dimension: dim,
      })),
    );

    for (const targetDim of dimensions) {
      it(`determines ${targetDim} as primaryAnchor when maximized`, () => {
        const answers: Record<string, number> = {};
        for (const item of items) {
          answers[item.id] = item.dimension === targetDim ? 5 : 1;
        }

        const res = careerFitScoringV1.score(items, answers);
        expect(res.primaryAnchor).toBe(targetDim);
        expect(res.dimensionScores[targetDim]).toBe(100);
        for (const other of dimensions) {
          if (other !== targetDim) {
            expect(res.dimensionScores[other]).toBe(0);
          }
        }
      });
    }
  });

  // =========================================================================
  // 4. MONEYDNA — Section 22: Dominant archetypes
  // =========================================================================
  describe("4. MoneyDNA Archetypes extremes", () => {
    const archetypes: MoneyArchetype[] = [
      "BUILDER",
      "GUARDIAN",
      "STRATEGIST",
      "ADVENTURER",
      "BALANCER",
    ];

    const items = archetypes.flatMap((arch) =>
      Array.from({ length: 4 }, (_, i) => ({
        id: `md_${arch}_${i}`,
        stableKey: `MD_${arch}_${i}`,
        archetype: arch,
      })),
    );

    for (const targetArch of archetypes) {
      it(`identifies ${targetArch} as dominant archetype when maximized`, () => {
        const answers: Record<string, number> = {};
        for (const item of items) {
          answers[item.id] = item.archetype === targetArch ? 5 : 1;
        }

        const res = moneyDnaScoringV1.score(items, answers);
        expect(res.dominantArchetype).toBe(targetArch);
        expect(res.archetypeScores[targetArch]).toBe(100);
      });
    }
  });

  // =========================================================================
  // 5. COUPLEDNA — Section 23: Bilateral consent & alignment
  // =========================================================================
  describe("5. CoupleDNA Bilateral Alignment", () => {
    const dimensions: CoupleDimension[] = [
      "COMMUNICATION",
      "LIFE_VALUES",
      "CONFLICT_MANAGEMENT",
      "FINANCES",
      "FUTURE_PLANS",
    ];

    it("returns locked state (all 0) when consent is NOT given", () => {
      const scoreA = {
        dimensionScores: { COMMUNICATION: 80, LIFE_VALUES: 80, CONFLICT_MANAGEMENT: 80, FINANCES: 80, FUTURE_PLANS: 80 },
        totalResponses: 20,
      };
      const scoreB = {
        dimensionScores: { COMMUNICATION: 80, LIFE_VALUES: 80, CONFLICT_MANAGEMENT: 80, FINANCES: 80, FUTURE_PLANS: 80 },
        totalResponses: 20,
      };

      const res = coupleDnaScoringV1.compareBilateral(scoreA, scoreB, false);
      expect(res.bilateralUnlocked).toBe(false);
      expect(res.overallAlignmentPercentage).toBe(0);
    });

    it("calculates 100% alignment when both partners give identical scores with consent", () => {
      const scoreA = {
        dimensionScores: { COMMUNICATION: 75, LIFE_VALUES: 50, CONFLICT_MANAGEMENT: 90, FINANCES: 60, FUTURE_PLANS: 100 },
        totalResponses: 20,
      };
      const scoreB = { ...scoreA };

      const res = coupleDnaScoringV1.compareBilateral(scoreA, scoreB, true);
      expect(res.bilateralUnlocked).toBe(true);
      expect(res.overallAlignmentPercentage).toBe(100);
      for (const d of dimensions) {
        expect(res.dimensionAlignments[d]).toBe(100);
      }
    });

    it("correctly identifies strongest alignment and growth dialogue area", () => {
      const scoreA = {
        dimensionScores: { COMMUNICATION: 100, LIFE_VALUES: 80, CONFLICT_MANAGEMENT: 70, FINANCES: 20, FUTURE_PLANS: 90 },
        totalResponses: 20,
      };
      const scoreB = {
        dimensionScores: { COMMUNICATION: 100, LIFE_VALUES: 80, CONFLICT_MANAGEMENT: 70, FINANCES: 100, FUTURE_PLANS: 90 },
        totalResponses: 20,
      };

      const res = coupleDnaScoringV1.compareBilateral(scoreA, scoreB, true);
      expect(res.strongestAlignment).toBe("COMMUNICATION");
      expect(res.growthDialogueArea).toBe("FINANCES");
      expect(res.dimensionAlignments.FINANCES).toBe(20); // 100 - |20 - 100| = 20
    });
  });

  // =========================================================================
  // 6. DECISIONDNA — Section 24: Decision styles patterns
  // =========================================================================
  describe("6. DecisionDNA scenarios", () => {
    const styles: DecisionStyleType[] = ["ANALYTICAL", "INTUITIVE", "PRAGMATIC", "COLLABORATIVE"];

    const items: DecisionDnaItem[] = [
      {
        id: "scen_1",
        stableKey: "DD_01",
        optionStyleMap: { opt_1_a: "ANALYTICAL", opt_1_b: "INTUITIVE", opt_1_c: "PRAGMATIC", opt_1_d: "COLLABORATIVE" },
      },
      {
        id: "scen_2",
        stableKey: "DD_02",
        optionStyleMap: { opt_2_a: "ANALYTICAL", opt_2_b: "INTUITIVE", opt_2_c: "PRAGMATIC", opt_2_d: "COLLABORATIVE" },
      },
      {
        id: "scen_3",
        stableKey: "DD_03",
        optionStyleMap: { opt_3_a: "ANALYTICAL", opt_3_b: "INTUITIVE", opt_3_c: "PRAGMATIC", opt_3_d: "COLLABORATIVE" },
      },
      {
        id: "scen_4",
        stableKey: "DD_04",
        optionStyleMap: { opt_4_a: "ANALYTICAL", opt_4_b: "INTUITIVE", opt_4_c: "PRAGMATIC", opt_4_d: "COLLABORATIVE" },
      },
    ];

    for (const targetStyle of styles) {
      it(`identifies ${targetStyle} as dominantStyle when selected across scenarios`, () => {
        const answers: Record<string, string> = {
          scen_1: `opt_1_${targetStyle === "ANALYTICAL" ? "a" : targetStyle === "INTUITIVE" ? "b" : targetStyle === "PRAGMATIC" ? "c" : "d"}`,
          scen_2: `opt_2_${targetStyle === "ANALYTICAL" ? "a" : targetStyle === "INTUITIVE" ? "b" : targetStyle === "PRAGMATIC" ? "c" : "d"}`,
          scen_3: `opt_3_${targetStyle === "ANALYTICAL" ? "a" : targetStyle === "INTUITIVE" ? "b" : targetStyle === "PRAGMATIC" ? "c" : "d"}`,
          scen_4: `opt_4_${targetStyle === "ANALYTICAL" ? "a" : targetStyle === "INTUITIVE" ? "b" : targetStyle === "PRAGMATIC" ? "c" : "d"}`,
        };

        const res = decisionDnaScoringV1.score(items, answers);
        expect(res.dominantStyle).toBe(targetStyle);
        expect(res.styleDistribution[targetStyle]).toBe(100);
      });
    }
  });

  // =========================================================================
  // 7. FOCUSSTYLE — Section 25: Focus patterns
  // =========================================================================
  describe("7. FocusStyle productivity patterns", () => {
    const styles: FocusStyleType[] = [
      "IMMERSIVE_HYPERFOCUS",
      "MODULAR_SERIAL",
      "COLLABORATIVE",
      "REACTIVE_SPRINT",
    ];

    const items = styles.flatMap((style) =>
      Array.from({ length: 5 }, (_, i) => ({
        id: `fs_${style}_${i}`,
        stableKey: `FS_${style}_${i}`,
        style,
      })),
    );

    for (const targetStyle of styles) {
      it(`identifies ${targetStyle} as primaryStyle when maximized`, () => {
        const answers: Record<string, number> = {};
        for (const item of items) {
          answers[item.id] = item.style === targetStyle ? 5 : 1;
        }

        const res = focusStyleScoringV1.score(items, answers);
        expect(res.primaryStyle).toBe(targetStyle);
        expect(res.styleScores[targetStyle]).toBe(100);
      });
    }
  });
});
