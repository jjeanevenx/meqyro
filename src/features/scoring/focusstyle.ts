export type FocusStyleType =
  | "IMMERSIVE_HYPERFOCUS"
  | "MODULAR_SERIAL"
  | "COLLABORATIVE"
  | "REACTIVE_SPRINT";

export interface FocusStyleItem {
  id: string;
  stableKey: string;
  style: FocusStyleType;
}

export interface FocusStyleScore {
  primaryStyle: FocusStyleType;
  secondaryStyle: FocusStyleType;
  styleScores: Record<FocusStyleType, number>; // 0 to 100
  totalResponses: number;
}

export const focusStyleScoringV1 = {
  version: "v1",
  score(
    items: FocusStyleItem[],
    answers: Record<string, number>, // 1 to 5
  ): FocusStyleScore {
    const rawScores: Record<FocusStyleType, { sum: number; count: number }> = {
      IMMERSIVE_HYPERFOCUS: { sum: 0, count: 0 },
      MODULAR_SERIAL: { sum: 0, count: 0 },
      COLLABORATIVE: { sum: 0, count: 0 },
      REACTIVE_SPRINT: { sum: 0, count: 0 },
    };

    let totalResponses = 0;

    for (const item of items) {
      const val = answers[item.id] ?? answers[item.stableKey];
      if (typeof val === "number" && val >= 1 && val <= 5) {
        rawScores[item.style].sum += val;
        rawScores[item.style].count += 1;
        totalResponses += 1;
      }
    }

    const styleScores: Record<FocusStyleType, number> = {
      IMMERSIVE_HYPERFOCUS: 0,
      MODULAR_SERIAL: 0,
      COLLABORATIVE: 0,
      REACTIVE_SPRINT: 0,
    };

    const sorted: { style: FocusStyleType; score: number }[] = [];

    for (const style of Object.keys(rawScores) as FocusStyleType[]) {
      const { sum, count } = rawScores[style];
      const normalized = count > 0 ? Math.round(((sum / count - 1) / 4) * 100) : 50;
      styleScores[style] = normalized;
      sorted.push({ style, score: normalized });
    }

    sorted.sort((a, b) => b.score - a.score);

    return {
      primaryStyle: sorted[0]?.style ?? "IMMERSIVE_HYPERFOCUS",
      secondaryStyle: sorted[1]?.style ?? "MODULAR_SERIAL",
      styleScores,
      totalResponses,
    };
  },
};
