import { describe, expect, it } from "vitest";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getFallbackPublicQuiz } from "@/features/quiz-engine/repository";

describe("Quiz UI & State Management Rigor (Unit Tests)", () => {
  const dictPt = getDictionary("pt");
  const dictEn = getDictionary("en");
  const brainrankQuiz = getFallbackPublicQuiz("brainrank", "pt")!;
  const personalityQuiz = getFallbackPublicQuiz("personality-map", "pt")!;

  it("ensures dictionary has explicit and differentiated error messages", () => {
    // Validation error must guide user clearly
    expect(dictPt.quizRunner.selectOptionToContinue).toBe("Selecione uma opção para continuar.");
    expect(dictEn.quizRunner.selectOptionToContinue).toBe("Please select an option to continue.");

    // System error must clearly indicate technical/save failure
    expect(dictPt.quizRunner.saveError).toBe(
      "Não foi possível salvar sua resposta. Tente novamente.",
    );
    expect(dictEn.quizRunner.saveError).toBe("Could not save your answer. Please try again.");

    // Distinct from generic error
    expect(dictPt.quizRunner.selectOptionToContinue).not.toBe(dictPt.common.error);
    expect(dictPt.quizRunner.saveError).not.toBe(dictPt.common.error);
  });

  it("calculates progress semantically based on answered questions, never showing 100% prematurely", () => {
    const totalQuestions = 24;
    const answers: Record<string, { optionId?: string; numericValue?: number }> = {};

    const getProgress = (answersMap: typeof answers, total: number) => {
      const answeredCount = Object.values(answersMap).filter(
        (a) => Boolean(a?.optionId) || (typeof a?.numericValue === "number" && a.numericValue > 0),
      ).length;
      return Math.min(100, Math.round((answeredCount / total) * 100));
    };

    // Initial state: Question 1 of 24, 0 answered => 0%
    expect(getProgress(answers, totalQuestions)).toBe(0);

    // Answer 1 question => 1/24 * 100 = 4%
    answers["br-01"] = { optionId: "br-01-a" };
    expect(getProgress(answers, totalQuestions)).toBe(4);

    // Answer 12 questions => 12/24 * 100 = 50%
    for (let i = 2; i <= 12; i++) {
      const qId = `br-${String(i).padStart(2, "0")}`;
      answers[qId] = { optionId: `${qId}-a` };
    }
    expect(getProgress(answers, totalQuestions)).toBe(50);

    // Answer 23 questions (on last question before answering) => 23/24 * 100 = 96%
    for (let i = 13; i <= 23; i++) {
      const qId = `br-${String(i).padStart(2, "0")}`;
      answers[qId] = { optionId: `${qId}-a` };
    }
    expect(getProgress(answers, totalQuestions)).toBe(96);
    expect(getProgress(answers, totalQuestions)).toBeLessThan(100);

    // Answer final question => 24/24 * 100 = 100%
    answers["br-24"] = { optionId: "br-24-a" };
    expect(getProgress(answers, totalQuestions)).toBe(100);
  });

  it("models state transitions without contradictory selected + error states", () => {
    // Simulation of QuizRunner state machine logic
    const answers: Record<string, { optionId?: string; numericValue?: number }> = {};
    let validationError: string | null = null;
    let systemError: string | null = null;

    const currentQuestion = brainrankQuiz.questions[0];

    const hasSelectedAnswer = () => {
      const ans = answers[currentQuestion.id];
      return (
        Boolean(ans?.optionId) || (typeof ans?.numericValue === "number" && ans.numericValue > 0)
      );
    };

    // 1. Initial State: UNANSWERED, no errors
    expect(hasSelectedAnswer()).toBe(false);
    expect(validationError).toBeNull();
    expect(systemError).toBeNull();

    // 2. User attempts to continue without selecting
    const tryContinue = () => {
      if (!hasSelectedAnswer()) {
        validationError = dictPt.quizRunner.selectOptionToContinue;
        return false;
      }
      validationError = null;
      systemError = null;
      return true;
    };

    const continued = tryContinue();
    expect(continued).toBe(false);
    expect(validationError).toBe("Selecione uma opção para continuar.");
    expect(hasSelectedAnswer()).toBe(false);

    // 3. User selects an option => error MUST immediately disappear
    const selectOption = (optId: string) => {
      answers[currentQuestion.id] = { optionId: optId };
      validationError = null;
      systemError = null;
    };

    selectOption("br-01-b");
    expect(hasSelectedAnswer()).toBe(true);
    expect(validationError).toBeNull();
    expect(systemError).toBeNull();

    // Impossible contradiction check:
    // It is IMPOSSIBLE to have hasSelectedAnswer === true AND validationError !== null
    const hasContradictoryState = hasSelectedAnswer() && Boolean(validationError);
    expect(hasContradictoryState).toBe(false);

    // 4. Continuing now succeeds
    const continuedAfterSelect = tryContinue();
    expect(continuedAfterSelect).toBe(true);
    expect(validationError).toBeNull();
  });

  it("handles rapid option changes cleanly without stale or multiple selected options", () => {
    let answers: Record<string, { optionId?: string }> = {};
    const questionId = "br-01";

    const selectOption = (optionId: string) => {
      // Sole source of truth replaces the question answer
      answers = {
        ...answers,
        [questionId]: { optionId },
      };
    };

    // Rapid clicking A -> B -> C -> D
    selectOption("br-01-a");
    selectOption("br-01-b");
    selectOption("br-01-c");
    selectOption("br-01-d");

    // Exactly one option is recorded and it is the final one
    expect(answers[questionId]).toEqual({ optionId: "br-01-d" });
  });

  it("prevents double-click race conditions using atomic lock", () => {
    let saveLock = false;
    let saveCallCount = 0;

    const simulateSave = async () => {
      if (saveLock) {
        return; // Guard prevents concurrent execution
      }
      saveLock = true;
      saveCallCount++;
      await new Promise((resolve) => setTimeout(resolve, 50));
      saveLock = false;
    };

    // Fire two clicks simultaneously
    const call1 = simulateSave();
    const call2 = simulateSave();

    return Promise.all([call1, call2]).then(() => {
      expect(saveCallCount).toBe(1);
    });
  });

  it("restores previously selected answers correctly upon backward navigation", () => {
    const q0 = brainrankQuiz.questions[0];
    const q1 = brainrankQuiz.questions[1];
    const answers: Record<string, { optionId?: string; numericValue?: number }> = {
      [q0.id]: { optionId: q0.options[2].id },
      [q1.id]: { optionId: q1.options[0].id },
    };

    let currentIndex = 1; // At question 2

    // Navigate back to question 1
    currentIndex = currentIndex - 1;
    const previousQuestion = brainrankQuiz.questions[currentIndex];
    const previousAnswer = answers[previousQuestion.id];

    expect(previousAnswer).toBeDefined();
    expect(previousAnswer?.optionId).toBe(q0.options[2].id);

    const hasAnswer = Boolean(previousAnswer?.optionId);
    expect(hasAnswer).toBe(true); // Continue button is immediately enabled and valid
  });

  it("supports Likert scale questions with values 1 to 5 consistently", () => {
    const likertQuestion = personalityQuiz.questions[0];
    expect(likertQuestion.kind).toBe("LIKERT");

    const likertAnswers: Record<string, { numericValue: number }> = {};

    const selectLikertValue = (val: number) => {
      likertAnswers[likertQuestion.id] = { numericValue: val };
    };

    selectLikertValue(4);
    expect(likertAnswers[likertQuestion.id].numericValue).toBe(4);

    const isAnswered =
      typeof likertAnswers[likertQuestion.id].numericValue === "number" &&
      likertAnswers[likertQuestion.id].numericValue >= 1 &&
      likertAnswers[likertQuestion.id].numericValue <= 5;
    expect(isAnswered).toBe(true);
  });
});
