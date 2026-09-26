import {
  indexUniqueAnswers,
  InvalidQuizSubmissionError,
  type ScoringContract,
} from "@/features/quiz-engine/contracts";

export const brainRankDimensions = [
  "PATTERN_RECOGNITION",
  "LOGICAL_REASONING",
  "NUMERICAL_REASONING",
  "ATTENTION",
  "PROBLEM_SOLVING",
  "SPEED",
] as const;

export type BrainRankDimension = (typeof brainRankDimensions)[number];
export type BrainRankDifficulty = "EASY" | "MEDIUM" | "HARD";

export type BrainRankItem = Readonly<{
  id: string;
  dimension: BrainRankDimension;
  difficulty: BrainRankDifficulty;
  correctOptionId: string;
}>;

export type BrainRankResult = Readonly<{
  quizVersion: "1.0";
  scoringVersion: "1.0";
  rawCorrect: number;
  overallScore: number;
  dimensionScores: Readonly<Record<BrainRankDimension, number>>;
  strongestDimension: BrainRankDimension;
  tieBreak: "HARD_CORRECT" | "MEDIAN_DURATION" | "BLUEPRINT_ORDER";
}>;

function median(values: readonly number[]) {
  if (values.length === 0) return Number.POSITIVE_INFINITY;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

function scoreBrainRank(
  items: readonly BrainRankItem[],
  submittedAnswers: Parameters<typeof indexUniqueAnswers>[0],
): BrainRankResult {
  if (items.length !== 24) {
    throw new InvalidQuizSubmissionError("BrainRank v1.0 requires exactly 24 items");
  }

  const answers = indexUniqueAnswers(submittedAnswers);
  if (answers.size !== items.length) {
    throw new InvalidQuizSubmissionError("BrainRank v1.0 requires 24 unique answers");
  }

  const itemIds = new Set(items.map((item) => item.id));
  for (const answer of answers.values()) {
    if (!itemIds.has(answer.questionId) || !answer.optionId) {
      throw new InvalidQuizSubmissionError(`Unrecognized answer for ${answer.questionId}`);
    }
  }

  const correctByDimension = Object.fromEntries(
    brainRankDimensions.map((dimension) => [dimension, 0]),
  ) as Record<BrainRankDimension, number>;
  const hardCorrectByDimension = { ...correctByDimension };
  const durationsByDimension = Object.fromEntries(
    brainRankDimensions.map((dimension) => [dimension, [] as number[]]),
  ) as Record<BrainRankDimension, number[]>;

  let rawCorrect = 0;
  for (const item of items) {
    const answer = answers.get(item.id);
    if (!answer || answer.optionId !== item.correctOptionId) continue;
    rawCorrect += 1;
    correctByDimension[item.dimension] += 1;
    if (item.difficulty === "HARD") hardCorrectByDimension[item.dimension] += 1;
    if (answer.durationMs !== undefined && answer.durationMs >= 2_000) {
      durationsByDimension[item.dimension].push(answer.durationMs);
    }
  }

  const dimensionScores = Object.fromEntries(
    brainRankDimensions.map((dimension) => [
      dimension,
      Math.round((100 * correctByDimension[dimension]) / 4),
    ]),
  ) as Record<BrainRankDimension, number>;
  const highestScore = Math.max(...Object.values(dimensionScores));
  let candidates = brainRankDimensions.filter(
    (dimension) => dimensionScores[dimension] === highestScore,
  );
  let tieBreak: BrainRankResult["tieBreak"] = "BLUEPRINT_ORDER";

  if (candidates.length > 1) {
    const mostHardCorrect = Math.max(...candidates.map((d) => hardCorrectByDimension[d]));
    const narrowed = candidates.filter((d) => hardCorrectByDimension[d] === mostHardCorrect);
    if (narrowed.length < candidates.length) tieBreak = "HARD_CORRECT";
    candidates = narrowed;
  }
  if (candidates.length > 1) {
    const fastestMedian = Math.min(...candidates.map((d) => median(durationsByDimension[d])));
    const narrowed = candidates.filter((d) => median(durationsByDimension[d]) === fastestMedian);
    if (narrowed.length < candidates.length && Number.isFinite(fastestMedian)) {
      tieBreak = "MEDIAN_DURATION";
    }
    candidates = narrowed;
  }

  return {
    quizVersion: "1.0",
    scoringVersion: "1.0",
    rawCorrect,
    overallScore: Math.round((1_000 * rawCorrect) / 24),
    dimensionScores,
    strongestDimension: candidates[0],
    tieBreak,
  };
}

export const brainRankScoringV1: ScoringContract<BrainRankItem, BrainRankResult> = {
  quizSlug: "brainrank",
  quizVersion: "1.0",
  scoringVersion: "1.0",
  score: scoreBrainRank,
};
