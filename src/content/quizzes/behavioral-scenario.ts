import type { Locale } from "@/lib/i18n/config";

export type LocalizedScenarioRow = readonly [string, string, string, string, string];
export type ScenarioDefinition = Readonly<{
  stableKey: string;
  position: number;
  dimension: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  prompt: Readonly<Record<Locale, string>>;
  options: readonly Readonly<{
    stableKey: string;
    label: Readonly<Record<Locale, string>>;
    signals: Readonly<Record<string, number>>;
  }>[];
}>;

/** Content authoring helper. Signals are private: public projections explicitly omit them. */
export function scenario(
  stableKey: string,
  position: number,
  dimension: string,
  rows: Readonly<Record<Locale, LocalizedScenarioRow>>,
  signals: readonly Readonly<Record<string, number>>[],
): ScenarioDefinition {
  return {
    stableKey,
    position,
    dimension,
    difficulty: position <= 5 ? "EASY" : position <= 10 ? "MEDIUM" : "HARD",
    prompt: { pt: rows.pt[0], en: rows.en[0], es: rows.es[0], fr: rows.fr[0] },
    options: [1, 2, 3, 4].map((index) => ({
      stableKey: `${stableKey}_${index}`,
      label: { pt: rows.pt[index], en: rows.en[index], es: rows.es[index], fr: rows.fr[index] },
      signals: signals[index - 1],
    })),
  };
}
