import { describe, expect, it } from "vitest";
import {
  brainRankDimensions,
  brainRankScoringV1,
  type BrainRankItem,
} from "@/features/scoring/brainrank";
import {
  personalityDimensions,
  personalityMapScoringV1,
  type PersonalityItem,
} from "@/features/scoring/personality-map";

const brainRankItems: BrainRankItem[] = brainRankDimensions.flatMap((dimension, dimensionIndex) =>
  Array.from({ length: 4 }, (_, itemIndex) => ({
    id: `brain-${dimensionIndex}-${itemIndex}`,
    dimension,
    difficulty: itemIndex === 3 ? "HARD" : itemIndex === 0 ? "EASY" : "MEDIUM",
    correctOptionId: `correct-${dimensionIndex}-${itemIndex}`,
  })),
);

const personalityItems: PersonalityItem[] = personalityDimensions.flatMap(
  (dimension, dimensionIndex) =>
    Array.from({ length: 8 }, (_, itemIndex) => ({
      id: `personality-${dimensionIndex}-${itemIndex}`,
      dimension,
      direction: itemIndex < 4 ? "DIRECT" : "REVERSE",
    })),
);

describe("BrainRank scoring v1.0 golden fixtures", () => {
  it("scores all-correct deterministically", () => {
    const result = brainRankScoringV1.score(
      brainRankItems,
      brainRankItems.map((item) => ({ questionId: item.id, optionId: item.correctOptionId })),
    );
    expect(result).toMatchObject({
      rawCorrect: 24,
      overallScore: 1000,
      strongestDimension: "PATTERN_RECOGNITION",
      tieBreak: "BLUEPRINT_ORDER",
    });
    expect(Object.values(result.dimensionScores)).toEqual([100, 100, 100, 100, 100, 100]);
  });

  it("scores balanced-half and rejects incomplete submissions", () => {
    const answers = brainRankItems.map((item, index) => ({
      questionId: item.id,
      optionId: index % 4 < 2 ? item.correctOptionId : "wrong",
    }));
    const result = brainRankScoringV1.score(brainRankItems, answers);
    expect(result.overallScore).toBe(500);
    expect(Object.values(result.dimensionScores)).toEqual([50, 50, 50, 50, 50, 50]);
    expect(() => brainRankScoringV1.score(brainRankItems, answers.slice(1))).toThrow(/24 unique/);
  });
});

describe("Personality Map scoring v1.0 golden fixtures", () => {
  it("scores neutral responses at 50 with a quality warning", () => {
    const result = personalityMapScoringV1.score(
      personalityItems,
      personalityItems.map((item) => ({ questionId: item.id, value: 3 })),
    );
    expect(Object.values(result.dimensionScores)).toEqual([50, 50, 50, 50, 50]);
    expect(result.uniformResponseWarning).toBe(true);
  });

  it("orients reverse items before producing the maximum score", () => {
    const result = personalityMapScoringV1.score(
      personalityItems,
      personalityItems.map((item) => ({
        questionId: item.id,
        value: item.direction === "DIRECT" ? 5 : 1,
      })),
    );
    expect(Object.values(result.dimensionScores)).toEqual([100, 100, 100, 100, 100]);
  });
});
