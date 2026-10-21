import { describe, expect, it } from "vitest";
import { resolveQuestionTiming } from "@/features/quiz-engine/question-timing";
import { countdownState } from "@/lib/quiz-countdown";
import {
  buildBrainRankTimingAudit,
  type TimingObservation,
} from "@/features/scoring/brainrank-timing";
import {
  brainRankScoringV1,
  brainRankDimensions,
  type BrainRankItem,
} from "@/features/scoring/brainrank";
import { timingReportSection } from "@/features/results/timing-report";

describe("BrainRank timing rules and scoring", () => {
  it.each([
    ["EASY", 30],
    ["MEDIUM", 45],
    ["HARD", 60],
    ["VERY_HARD", 90],
    ["very hard", 90],
    ["unknown", 45],
  ])("maps %s to %i seconds", (difficulty, seconds) => {
    expect(resolveQuestionTiming(difficulty, null).timeLimitSeconds).toBe(seconds);
  });
  it("honors valid overrides and trusted accessibility multipliers", () => {
    expect(resolveQuestionTiming("HARD", 80).timeLimitSeconds).toBe(80);
    expect(resolveQuestionTiming("EASY", null, undefined, 2).timeLimitSeconds).toBe(60);
    for (const invalid of [0, -1, NaN, Infinity, "60", 99999])
      expect(resolveQuestionTiming("HARD", invalid).timeLimitSeconds).toBe(60);
  });
  it("formats boundaries and announces low/critical/expired states", () => {
    expect(countdownState(90000, 90).text).toBe("01:30");
    expect(countdownState(6000, 30).state).toBe("low");
    expect(countdownState(3000, 30).state).toBe("critical");
    expect(countdownState(-1, 30)).toEqual({ text: "00:00", percent: 0, state: "expired" });
    expect(countdownState(1, 30).text).toBe("00:01");
  });
  it("treats timeouts as wrong without changing historical scoring", () => {
    const items: BrainRankItem[] = Array.from({ length: 24 }, (_, i) => ({
      id: String(i),
      dimension: brainRankDimensions[Math.floor(i / 4)],
      difficulty: "MEDIUM",
      correctOptionId: `correct-${i}`,
    }));
    const answers = items.map((q) => ({
      questionId: q.id,
      optionId: q.correctOptionId,
      durationMs: 3000,
    }));
    expect(brainRankScoringV1.score(items, answers).overallScore).toBe(1000);
    expect(
      brainRankScoringV1.score(
        items,
        answers.map((a) => ({ ...a, answerStatus: "TIMEOUT" as const })),
      ).overallScore,
    ).toBe(0);
    expect(
      brainRankScoringV1.score(
        items,
        answers.map((a) => ({ questionId: a.questionId, answerStatus: "TIMEOUT" as const })),
      ).overallScore,
    ).toBe(0);
  });
  const base: TimingObservation = {
    questionId: "q",
    difficulty: "EASY",
    timeLimitSeconds: 30,
    questionStartedAt: "2026-10-19T00:00:00Z",
    questionExpiresAt: "2026-10-19T00:00:30Z",
    responseTimeMs: 6000,
    answerStatus: "ANSWERED",
    optionId: "a",
    isCorrect: true,
    memoryRecall: false,
    rulesVersion: "brainrank-deadline-1.0",
  };
  it("separates accuracy, speed, expiry and recall in auditable results", () => {
    const audit = buildBrainRankTimingAudit([
      base,
      {
        ...base,
        questionId: "m",
        responseTimeMs: 30000,
        answerStatus: "TIMEOUT",
        optionId: null,
        memoryRecall: true,
      },
    ]);
    expect(audit.averageResponseTimeMs).toBe(18000);
    expect(audit.timeouts).toBe(1);
    expect(audit.completedInTimePercent).toBe(50);
    expect(audit.accuracyPercent).toBe(50);
    expect(audit.memory).toEqual({ total: 1, correct: 0, averageResponseTimeMs: 30000 });
    expect(audit.items[1].awardedPoints).toBe(0);
    expect(audit.items[0].remainingTimeMs).toBe(24000);
    for (const locale of ["pt", "en", "es", "fr"]) {
      const section = timingReportSection(audit, locale);
      expect(section?.summary).toContain("18.0 s");
      expect(section?.summary).toContain("50%");
    }
    expect(timingReportSection(undefined, "pt")).toBeNull();
  });
});
