import { describe, expect, it } from "vitest";
import { getFallbackPublicQuiz } from "@/features/quiz-engine/repository";

describe("Quiz Engine — Public Content Sanitization (In-Memory)", () => {
  it("fallback public quiz never leaks correct answers or scoring keys", () => {
    const quiz = getFallbackPublicQuiz("brainrank", "pt");
    expect(quiz).not.toBeNull();
    expect(quiz?.questions).toHaveLength(24);

    for (const q of quiz!.questions) {
      expect(q).not.toHaveProperty("scoringKey");
      expect(q).not.toHaveProperty("scoring_key");
      expect(q).not.toHaveProperty("correctOptionId");
      expect(q.options).toHaveLength(4);

      for (const opt of q.options) {
        expect(opt).not.toHaveProperty("isCorrect");
        expect(opt).not.toHaveProperty("scoring_value");
        expect(opt).not.toHaveProperty("scoringValue");
      }
    }
  });

  it("Personality Map public quiz exposes 40 statements without scoring keys", () => {
    const quiz = getFallbackPublicQuiz("personality-map", "en");
    expect(quiz).not.toBeNull();
    expect(quiz?.questions).toHaveLength(40);

    for (const q of quiz!.questions) {
      expect(q).not.toHaveProperty("scoringKey");
      expect(q).not.toHaveProperty("direction");
      expect(q.kind).toBe("LIKERT");
    }
  });
});
