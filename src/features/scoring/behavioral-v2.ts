import "server-only";

import {
  InvalidQuizSubmissionError,
  indexUniqueAnswers,
  type ScoringAnswer,
} from "@/features/quiz-engine/contracts";
import { moneyDnaScenarios } from "@/content/quizzes/moneydna-v2";
import { coupleDnaScenarios } from "@/content/quizzes/coupledna-v2";
import type { BilateralCoupleComparison, CoupleDimension } from "./coupledna";

export const behavioralVersion = "v2.0.0";
export const behavioralScoringVersion = "behavioral-v2";
export type BehavioralItem = Readonly<{
  id: string;
  stableKey: string;
  options: readonly Readonly<{ id: string; stableKey: string; signals: unknown }>[];
}>;
export type BehavioralEvidence = Readonly<{ questionKey: string; optionKey: string }>;
export type BehavioralScore = {
  instrumentVersion: typeof behavioralVersion;
  algorithmVersion: typeof behavioralScoringVersion;
  dimensionScores: Record<string, number>;
  observations: Record<string, number>;
  contextDependentDimensions: string[];
  evidence: BehavioralEvidence[];
  totalResponses: number;
  dominantArchetype?: string;
  secondaryArchetype?: string;
  archetypeScores?: Record<string, number>;
  tiedDimensions: string[];
};

/** Equal-weight descriptive indices. No correctness, response-time weighting or population norms. */
export function scoreBehavioralV2(
  slug: "moneydna" | "coupledna",
  items: readonly BehavioralItem[],
  answers: readonly ScoringAnswer[],
): BehavioralScore {
  const definition = slug === "moneydna" ? moneyDnaScenarios : coupleDnaScenarios;
  const canonical = new Map(definition.map((q) => [q.stableKey, q]));
  const indexed = indexUniqueAnswers(answers);
  if (
    items.length !== 20 ||
    indexed.size !== 20 ||
    new Set(items.map((q) => q.id)).size !== 20 ||
    new Set(items.map((q) => q.stableKey)).size !== 20
  ) {
    throw new InvalidQuizSubmissionError("Expected exactly 20 unique behavioral items and answers");
  }
  const dimensions = [...new Set(definition.map((q) => q.dimension))];
  const totals = Object.fromEntries(dimensions.map((d) => [d, 0]));
  const capacities = { ...totals };
  const observations = { ...totals };
  const values: Record<string, number[]> = Object.fromEntries(dimensions.map((d) => [d, []]));
  const evidence: BehavioralEvidence[] = [];
  for (const item of items) {
    const source = canonical.get(item.stableKey);
    const answer = indexed.get(item.id);
    if (
      !source ||
      !answer?.optionId ||
      answer.value !== undefined ||
      answer.answerStatus === "TIMEOUT" ||
      item.options.length !== 4 ||
      new Set(item.options.map((o) => o.id)).size !== 4 ||
      new Set(item.options.map((o) => o.stableKey)).size !== 4
    ) {
      throw new InvalidQuizSubmissionError("Invalid behavioral item or answer");
    }
    // Refuse altered weights under an existing algorithm version; old instruments remain immutable.
    for (const option of item.options) {
      const expected = source.options.find((o) => o.stableKey === option.stableKey)?.signals;
      const actual = option.signals;
      if (
        !expected ||
        !actual ||
        typeof actual !== "object" ||
        Array.isArray(actual) ||
        Object.keys(actual).length !== Object.keys(expected).length ||
        !Object.entries(expected).every(
          ([key, value]) => (actual as Record<string, unknown>)[key] === value,
        )
      ) {
        throw new InvalidQuizSubmissionError("Behavioral weights do not match the pinned version");
      }
    }
    const selected = item.options.find((o) => o.id === answer.optionId);
    const selectedDefinition = source.options.find((o) => o.stableKey === selected?.stableKey);
    if (!selectedDefinition)
      throw new InvalidQuizSubmissionError("Option does not belong to question");
    for (const dimension of dimensions) {
      const available = source.options.map((o) => o.signals[dimension] ?? 0);
      const max = Math.max(...available),
        min = Math.min(...available);
      if (max === min) continue;
      const value = selectedDefinition.signals[dimension] ?? 0;
      totals[dimension] += value - min;
      capacities[dimension] += max - min;
      observations[dimension]++;
      values[dimension].push((value - min) / (max - min));
    }
    evidence.push({ questionKey: source.stableKey, optionKey: selectedDefinition.stableKey });
  }
  if (dimensions.some((d) => observations[d] < 4)) {
    throw new InvalidQuizSubmissionError("Insufficient dimension coverage");
  }
  const dimensionScores = Object.fromEntries(
    dimensions.map((d) => [d, Math.round((100 * totals[d]) / capacities[d])]),
  );
  const ranked = [...dimensions].sort((a, b) => dimensionScores[b] - dimensionScores[a]);
  const tiedDimensions = ranked.filter((d) => dimensionScores[d] === dimensionScores[ranked[0]]);
  return {
    instrumentVersion: behavioralVersion,
    algorithmVersion: behavioralScoringVersion,
    dimensionScores,
    observations,
    // Variation is contextual evidence, never a lie or invalidity flag.
    contextDependentDimensions: dimensions.filter(
      (d) => values[d].some((v) => v === 0) && values[d].some((v) => v === 1),
    ),
    evidence: evidence.sort((a, b) => a.questionKey.localeCompare(b.questionKey)),
    totalResponses: 20,
    tiedDimensions,
    ...(slug === "moneydna"
      ? {
          dominantArchetype: ranked[0],
          secondaryArchetype: ranked[1],
          archetypeScores: dimensionScores,
        }
      : {}),
  };
}

/** Choice agreement, not similarity of means: opposite choices must not cancel each other out. */
export function compareBehavioralCouple(
  a: BehavioralScore,
  b: BehavioralScore,
): BilateralCoupleComparison {
  if (
    a.algorithmVersion !== behavioralScoringVersion ||
    b.algorithmVersion !== behavioralScoringVersion ||
    a.evidence.length !== 20 ||
    b.evidence.length !== 20
  ) {
    throw new InvalidQuizSubmissionError("Couple instruments must match");
  }
  const alignments = {} as Record<CoupleDimension, number>;
  for (const dimension of [
    ...new Set(coupleDnaScenarios.map((q) => q.dimension)),
  ] as CoupleDimension[]) {
    const questions = coupleDnaScenarios.filter((q) => q.dimension === dimension);
    let matches = 0;
    for (const q of questions) {
      const left = a.evidence.find((e) => e.questionKey === q.stableKey)?.optionKey;
      const right = b.evidence.find((e) => e.questionKey === q.stableKey)?.optionKey;
      if (
        !q.options.some((o) => o.stableKey === left) ||
        !q.options.some((o) => o.stableKey === right)
      ) {
        throw new InvalidQuizSubmissionError("Invalid couple evidence");
      }
      if (left === right) matches++;
    }
    alignments[dimension] = Math.round((100 * matches) / questions.length);
  }
  const ranked = (Object.keys(alignments) as CoupleDimension[]).sort(
    (a, b) => alignments[b] - alignments[a],
  );
  return {
    bilateralUnlocked: true,
    instrumentVersion: behavioralVersion,
    overallAlignmentPercentage: Math.round(
      Object.values(alignments).reduce((sum, n) => sum + n, 0) / ranked.length,
    ),
    dimensionAlignments: alignments,
    strongestAlignment: ranked[0],
    growthDialogueArea: ranked[ranked.length - 1],
  };
}
