import {
  indexUniqueAnswers,
  InvalidQuizSubmissionError,
  type ScoringContract,
} from "@/features/quiz-engine/contracts";

export const personalityDimensions = [
  "OPENNESS",
  "CONSCIENTIOUSNESS",
  "EXTRAVERSION",
  "AGREEABLENESS",
  "EMOTIONAL_STABILITY",
] as const;

export type PersonalityDimension = (typeof personalityDimensions)[number];
export type PersonalityItem = Readonly<{
  id: string;
  dimension: PersonalityDimension;
  direction: "DIRECT" | "REVERSE";
}>;

export type PersonalityResult = Readonly<{
  quizVersion: "1.0";
  scoringVersion: "1.0";
  dimensionScores: Readonly<Record<PersonalityDimension, number>>;
  uniformResponseWarning: boolean;
}>;

function scorePersonalityMap(
  items: readonly PersonalityItem[],
  submittedAnswers: Parameters<typeof indexUniqueAnswers>[0],
): PersonalityResult {
  if (items.length !== 40) {
    throw new InvalidQuizSubmissionError("Personality Map v1.0 requires exactly 40 items");
  }
  const answers = indexUniqueAnswers(submittedAnswers);
  if (answers.size !== items.length) {
    throw new InvalidQuizSubmissionError("Personality Map v1.0 requires 40 unique answers");
  }

  const orientedByDimension = Object.fromEntries(
    personalityDimensions.map((dimension) => [dimension, [] as number[]]),
  ) as Record<PersonalityDimension, number[]>;
  const responseCounts = new Map<number, number>();

  for (const item of items) {
    const value = answers.get(item.id)?.value;
    if (!Number.isInteger(value) || value === undefined || value < 1 || value > 5) {
      throw new InvalidQuizSubmissionError(`Invalid Likert answer for ${item.id}`);
    }
    orientedByDimension[item.dimension].push(item.direction === "REVERSE" ? 6 - value : value);
    responseCounts.set(value, (responseCounts.get(value) ?? 0) + 1);
  }

  const dimensionScores = Object.fromEntries(
    personalityDimensions.map((dimension) => {
      const values = orientedByDimension[dimension];
      if (values.length !== 8) {
        throw new InvalidQuizSubmissionError(`Expected 8 items for ${dimension}`);
      }
      const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
      return [dimension, Math.round(25 * (mean - 1))];
    }),
  ) as Record<PersonalityDimension, number>;

  return {
    quizVersion: "1.0",
    scoringVersion: "1.0",
    dimensionScores,
    uniformResponseWarning: Math.max(...responseCounts.values()) >= 36,
  };
}

export const personalityMapScoringV1: ScoringContract<PersonalityItem, PersonalityResult> = {
  quizSlug: "personality-map",
  quizVersion: "1.0",
  scoringVersion: "1.0",
  score: scorePersonalityMap,
};
