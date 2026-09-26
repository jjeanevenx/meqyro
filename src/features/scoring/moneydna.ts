export type MoneyArchetype =
  | "BUILDER"
  | "GUARDIAN"
  | "STRATEGIST"
  | "ADVENTURER"
  | "BALANCER";

export interface MoneyDnaItem {
  id: string;
  stableKey: string;
  archetype: MoneyArchetype;
}

export interface MoneyDnaScore {
  dominantArchetype: MoneyArchetype;
  secondaryArchetype: MoneyArchetype;
  archetypeScores: Record<MoneyArchetype, number>; // 0 to 100
  totalResponses: number;
}

export const moneyDnaScoringV1 = {
  version: "v1",
  score(
    items: MoneyDnaItem[],
    answers: Record<string, number>, // 1 to 5
  ): MoneyDnaScore {
    const rawScores: Record<MoneyArchetype, { sum: number; count: number }> = {
      BUILDER: { sum: 0, count: 0 },
      GUARDIAN: { sum: 0, count: 0 },
      STRATEGIST: { sum: 0, count: 0 },
      ADVENTURER: { sum: 0, count: 0 },
      BALANCER: { sum: 0, count: 0 },
    };

    let totalResponses = 0;

    for (const item of items) {
      const val = answers[item.id] ?? answers[item.stableKey];
      if (typeof val === "number" && val >= 1 && val <= 5) {
        rawScores[item.archetype].sum += val;
        rawScores[item.archetype].count += 1;
        totalResponses += 1;
      }
    }

    const archetypeScores: Record<MoneyArchetype, number> = {
      BUILDER: 0,
      GUARDIAN: 0,
      STRATEGIST: 0,
      ADVENTURER: 0,
      BALANCER: 0,
    };

    const sorted: { arch: MoneyArchetype; score: number }[] = [];

    for (const arch of Object.keys(rawScores) as MoneyArchetype[]) {
      const { sum, count } = rawScores[arch];
      const normalized = count > 0 ? Math.round(((sum / count - 1) / 4) * 100) : 50;
      archetypeScores[arch] = normalized;
      sorted.push({ arch, score: normalized });
    }

    sorted.sort((a, b) => b.score - a.score);

    return {
      dominantArchetype: sorted[0]?.arch ?? "BUILDER",
      secondaryArchetype: sorted[1]?.arch ?? "STRATEGIST",
      archetypeScores,
      totalResponses,
    };
  },
};
