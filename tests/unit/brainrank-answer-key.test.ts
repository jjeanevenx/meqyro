import { describe, expect, it } from "vitest";
import { requireBrainRankAnswerKey } from "@/features/scoring/brainrank-answer-key";

const option = (id: string, isCorrect: boolean) => ({ id, scoring_value: { isCorrect } });

describe("BrainRank answer key integrity", () => {
  it("returns the unique correct option regardless of its position", () => {
    expect(requireBrainRankAnswerKey([option("wrong", false), option("right", true)])).toBe(
      "right",
    );
  });

  it("rejects missing options", () => {
    expect(() => requireBrainRankAnswerKey([])).toThrow("Invalid BrainRank answer key");
  });

  it("rejects options without a correct answer", () => {
    expect(() =>
      requireBrainRankAnswerKey([option("a", false), { id: "b", scoring_value: null }]),
    ).toThrow("Invalid BrainRank answer key");
  });

  it("rejects ambiguous answer keys", () => {
    expect(() => requireBrainRankAnswerKey([option("a", true), option("b", true)])).toThrow(
      "Invalid BrainRank answer key",
    );
  });

  it("rejects a correct option without an identifier", () => {
    expect(() => requireBrainRankAnswerKey([option("", true)])).toThrow(
      "Invalid BrainRank answer key",
    );
  });
});
