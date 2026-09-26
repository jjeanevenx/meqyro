export type DecisionStyleType =
  | "ANALYTICAL"
  | "INTUITIVE"
  | "PRAGMATIC"
  | "COLLABORATIVE";

export interface DecisionDnaItem {
  id: string;
  stableKey: string;
  // Option mapping: each option stableKey maps to a style
  optionStyleMap?: Record<string, DecisionStyleType>;
}

export interface DecisionDnaScore {
  dominantStyle: DecisionStyleType;
  secondaryStyle: DecisionStyleType;
  styleDistribution: Record<DecisionStyleType, number>; // percentages summing to 100
  totalDecisions: number;
}

export const decisionDnaScoringV1 = {
  version: "v1",
  score(
    items: DecisionDnaItem[],
    answers: Record<string, string>, // option stable key chosen
  ): DecisionDnaScore {
    const counts: Record<DecisionStyleType, number> = {
      ANALYTICAL: 0,
      INTUITIVE: 0,
      PRAGMATIC: 0,
      COLLABORATIVE: 0,
    };

    let totalDecisions = 0;

    for (const item of items) {
      const chosenOption = answers[item.id] ?? answers[item.stableKey];
      if (chosenOption && item.optionStyleMap?.[chosenOption]) {
        const style = item.optionStyleMap[chosenOption];
        counts[style] += 1;
        totalDecisions += 1;
      }
    }

    const styleDistribution: Record<DecisionStyleType, number> = {
      ANALYTICAL: 0,
      INTUITIVE: 0,
      PRAGMATIC: 0,
      COLLABORATIVE: 0,
    };

    const sorted: { style: DecisionStyleType; count: number }[] = [];

    for (const style of Object.keys(counts) as DecisionStyleType[]) {
      const count = counts[style];
      const pct = totalDecisions > 0 ? Math.round((count / totalDecisions) * 100) : 25;
      styleDistribution[style] = pct;
      sorted.push({ style, count });
    }

    sorted.sort((a, b) => b.count - a.count);

    return {
      dominantStyle: sorted[0]?.style ?? "ANALYTICAL",
      secondaryStyle: sorted[1]?.style ?? "PRAGMATIC",
      styleDistribution,
      totalDecisions,
    };
  },
};
