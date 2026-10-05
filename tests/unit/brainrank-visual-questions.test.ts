import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { brainRankQuestions } from "@/content/quizzes/brainrank";
import { getFallbackPublicQuiz } from "@/features/quiz-engine/repository";
import { assertVisualQuestion } from "@/features/quiz-engine/visual-question-schema";
import { QuestionRenderer } from "@/components/patterns/question-renderers";

const visualCodes = ["BR_PAT_02", "BR_PAT_03", "BR_PAT_04", "BR_SPD_01"];

describe("BrainRank visual question system", () => {
  it("validates every visual stimulus and all visual options", () => {
    const visualQuestions = brainRankQuestions.filter(
      (question) => question.kind === "VISUAL_CHOICE",
    );
    expect(visualQuestions.map((question) => question.stableKey)).toEqual(visualCodes);
    for (const question of visualQuestions) {
      expect(() =>
        assertVisualQuestion({
          stableKey: question.stableKey,
          kind: question.kind ?? "SINGLE_CHOICE",
          stimulus: question.stimulus,
          options: question.options,
        }),
      ).not.toThrow();
      expect(question.options).toHaveLength(4);
      expect(question.options.filter((option) => option.isCorrect)).toHaveLength(1);
      expect(question.clue).toBeUndefined();
    }
  });

  it.each(["pt", "en", "es", "fr"] as const)("keeps identical visual geometry in %s", (locale) => {
    const quiz = getFallbackPublicQuiz("brainrank", locale);
    expect(quiz).not.toBeNull();
    const visualQuestions = quiz!.questions.filter((question) => question.kind === "VISUAL_CHOICE");
    expect(visualQuestions).toHaveLength(4);
    expect(visualQuestions.map((question) => question.stimulus)).toEqual(
      brainRankQuestions
        .filter((question) => question.kind === "VISUAL_CHOICE")
        .map((question) => question.stimulus),
    );
  });

  it("renders four radio options and selected state without exposing the key", () => {
    const question = getFallbackPublicQuiz("brainrank", "pt")!.questions[1];
    const html = renderToStaticMarkup(
      createElement(QuestionRenderer, {
        question,
        selectedOptionId: question.options[1].id,
        onSelectOption: vi.fn(),
        onSelectValue: vi.fn(),
      }),
    );
    expect(html.match(/role="radio"/g)).toHaveLength(4);
    expect(html).toContain("visual-stimulus");
    expect(html).toContain("visual-option--selected");
    expect(html).toContain('aria-checked="true"');
    expect(html).not.toContain("correct-answer");
    expect(html).not.toContain("data-correct");
  });
});
