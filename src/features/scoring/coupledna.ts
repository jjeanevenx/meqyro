export type CoupleDimension =
  | "COMMUNICATION"
  | "LIFE_VALUES"
  | "CONFLICT_MANAGEMENT"
  | "FINANCES"
  | "FUTURE_PLANS";

export interface CoupleDnaItem {
  id: string;
  stableKey: string;
  dimension: CoupleDimension;
}

export interface IndividualCoupleScore {
  dimensionScores: Record<CoupleDimension, number>; // 0 to 100
  totalResponses: number;
}

export interface BilateralCoupleComparison {
  bilateralUnlocked: boolean;
  overallAlignmentPercentage: number;
  dimensionAlignments: Record<CoupleDimension, number>; // 0 to 100
  strongestAlignment: CoupleDimension;
  growthDialogueArea: CoupleDimension;
}

export const coupleDnaScoringV1 = {
  version: "v1",
  scoreIndividual(
    items: CoupleDnaItem[],
    answers: Record<string, number>, // 1 to 5
  ): IndividualCoupleScore {
    const rawScores: Record<CoupleDimension, { sum: number; count: number }> = {
      COMMUNICATION: { sum: 0, count: 0 },
      LIFE_VALUES: { sum: 0, count: 0 },
      CONFLICT_MANAGEMENT: { sum: 0, count: 0 },
      FINANCES: { sum: 0, count: 0 },
      FUTURE_PLANS: { sum: 0, count: 0 },
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

    const dimensionScores: Record<CoupleDimension, number> = {
      COMMUNICATION: 0,
      LIFE_VALUES: 0,
      CONFLICT_MANAGEMENT: 0,
      FINANCES: 0,
      FUTURE_PLANS: 0,
    };

    for (const dim of Object.keys(rawScores) as CoupleDimension[]) {
      const { sum, count } = rawScores[dim];
      dimensionScores[dim] = count > 0 ? Math.round(((sum / count - 1) / 4) * 100) : 50;
    }

    return {
      dimensionScores,
      totalResponses,
    };
  },

  compareBilateral(
    scoreA: IndividualCoupleScore,
    scoreB: IndividualCoupleScore,
    consentsGiven: boolean,
  ): BilateralCoupleComparison {
    if (!consentsGiven) {
      return {
        bilateralUnlocked: false,
        overallAlignmentPercentage: 0,
        dimensionAlignments: {
          COMMUNICATION: 0,
          LIFE_VALUES: 0,
          CONFLICT_MANAGEMENT: 0,
          FINANCES: 0,
          FUTURE_PLANS: 0,
        },
        strongestAlignment: "COMMUNICATION",
        growthDialogueArea: "COMMUNICATION",
      };
    }

    const alignments: Record<CoupleDimension, number> = {
      COMMUNICATION: 0,
      LIFE_VALUES: 0,
      CONFLICT_MANAGEMENT: 0,
      FINANCES: 0,
      FUTURE_PLANS: 0,
    };

    const sortedDimensions: { dim: CoupleDimension; alignment: number }[] = [];
    let sumAlignment = 0;

    const dims = Object.keys(alignments) as CoupleDimension[];
    for (const dim of dims) {
      const valA = scoreA.dimensionScores[dim] ?? 50;
      const valB = scoreB.dimensionScores[dim] ?? 50;
      // Alignment = 100 - absolute difference
      const diff = Math.abs(valA - valB);
      const align = Math.max(0, 100 - diff);
      alignments[dim] = align;
      sumAlignment += align;
      sortedDimensions.push({ dim, alignment: align });
    }

    sortedDimensions.sort((a, b) => b.alignment - a.alignment);

    return {
      bilateralUnlocked: true,
      overallAlignmentPercentage: Math.round(sumAlignment / dims.length),
      dimensionAlignments: alignments,
      strongestAlignment: sortedDimensions[0]?.dim ?? "COMMUNICATION",
      growthDialogueArea: sortedDimensions[sortedDimensions.length - 1]?.dim ?? "FINANCES",
    };
  },
};
