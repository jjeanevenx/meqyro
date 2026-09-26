export type CareerFitDimension =
  | "TECHNICAL"
  | "MANAGERIAL"
  | "CREATIVE"
  | "AUTONOMOUS"
  | "SECURITY"
  | "CAUSE";

export interface CareerFitItem {
  id: string;
  stableKey: string;
  dimension: CareerFitDimension;
  weight?: number;
}

export interface CareerFitScore {
  primaryAnchor: CareerFitDimension;
  secondaryAnchor: CareerFitDimension;
  dimensionScores: Record<CareerFitDimension, number>; // 0 to 100
  totalResponses: number;
}

export const careerFitScoringV1 = {
  version: "v1",
  score(
    items: CareerFitItem[],
    answers: Record<string, number>, // 1 to 5 Likert
  ): CareerFitScore {
    const rawScores: Record<CareerFitDimension, { sum: number; count: number }> = {
      TECHNICAL: { sum: 0, count: 0 },
      MANAGERIAL: { sum: 0, count: 0 },
      CREATIVE: { sum: 0, count: 0 },
      AUTONOMOUS: { sum: 0, count: 0 },
      SECURITY: { sum: 0, count: 0 },
      CAUSE: { sum: 0, count: 0 },
    };

    let totalResponses = 0;

    for (const item of items) {
      const val = answers[item.id] ?? answers[item.stableKey];
      if (typeof val === "number" && val >= 1 && val <= 5) {
        rawScores[item.dimension].sum += val;
        rawScores[item.dimension].count += 1;
        totalResponses += 1;
      }
    }

    const dimensionScores: Record<CareerFitDimension, number> = {
      TECHNICAL: 0,
      MANAGERIAL: 0,
      CREATIVE: 0,
      AUTONOMOUS: 0,
      SECURITY: 0,
      CAUSE: 0,
    };

    const sortedDimensions: { dim: CareerFitDimension; score: number }[] = [];

    for (const dim of Object.keys(rawScores) as CareerFitDimension[]) {
      const { sum, count } = rawScores[dim];
      // Normalize from 1..5 scale to 0..100
      const normalized = count > 0 ? Math.round(((sum / count - 1) / 4) * 100) : 50;
      dimensionScores[dim] = normalized;
      sortedDimensions.push({ dim, score: normalized });
    }

    sortedDimensions.sort((a, b) => b.score - a.score);

    return {
      primaryAnchor: sortedDimensions[0]?.dim ?? "TECHNICAL",
      secondaryAnchor: sortedDimensions[1]?.dim ?? "CREATIVE",
      dimensionScores,
      totalResponses,
    };
  },
};
