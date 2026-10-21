import "server-only";

export type TimingObservation = {
  questionId: string;
  difficulty: string;
  timeLimitSeconds: number;
  questionStartedAt?: string | null;
  questionExpiresAt?: string | null;
  responseTimeMs: number;
  answerStatus: string;
  optionId: string | null;
  isCorrect: boolean;
  memoryRecall: boolean;
  rulesVersion: string;
};

export function buildBrainRankTimingAudit(observations: readonly TimingObservation[]) {
  const items = observations.map((item) => ({
    ...item,
    isCorrect: item.answerStatus !== "TIMEOUT" && item.isCorrect,
    remainingTimeMs: Math.max(0, item.timeLimitSeconds * 1000 - item.responseTimeMs),
    normalizedTime:
      item.timeLimitSeconds > 0 ? item.responseTimeMs / (item.timeLimitSeconds * 1000) : null,
    // Core items retain one raw point per correct answer; recall is scored separately.
    awardedPoints: item.isCorrect && item.answerStatus !== "TIMEOUT" ? 1 : 0,
  }));
  const timed = items.filter((item) => item.timeLimitSeconds > 0 && item.questionStartedAt);
  const mean = (group: typeof timed) =>
    group.length
      ? Math.round(group.reduce((sum, item) => sum + item.responseTimeMs, 0) / group.length)
      : 0;
  const timeouts = timed.filter((item) => item.answerStatus === "TIMEOUT").length;
  return {
    version: "brainrank-deadline-1.0",
    items,
    measuredQuestions: timed.length,
    averageResponseTimeMs: mean(timed),
    timeouts,
    completedInTimePercent: timed.length
      ? Math.round((100 * (timed.length - timeouts)) / timed.length)
      : 0,
    accuracyPercent: timed.length
      ? Math.round((100 * timed.filter((item) => item.isCorrect).length) / timed.length)
      : 0,
    averageByDifficultyMs: Object.fromEntries(
      [...new Set(timed.map((item) => item.difficulty))].map((difficulty) => [
        difficulty,
        mean(timed.filter((item) => item.difficulty === difficulty)),
      ]),
    ),
    memory: {
      total: timed.filter((item) => item.memoryRecall).length,
      correct: timed.filter((item) => item.memoryRecall && item.isCorrect).length,
      averageResponseTimeMs: mean(timed.filter((item) => item.memoryRecall)),
    },
  };
}
