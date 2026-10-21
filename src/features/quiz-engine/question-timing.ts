import "server-only";

export const timingRulesVersion = "brainrank-deadline-1.0";
export const defaultTimeLimits = { EASY: 30, MEDIUM: 45, HARD: 60, VERY_HARD: 90 } as const;
export type TimedDifficulty = keyof typeof defaultTimeLimits;

export function resolveQuestionTiming(
  difficulty: unknown,
  override: unknown,
  defaults: Readonly<Record<TimedDifficulty, number>> = defaultTimeLimits,
  multiplier = 1,
) {
  const key = typeof difficulty === "string" ? difficulty.toUpperCase().replace(/[ -]/g, "_") : "";
  const normalized = Object.hasOwn(defaults, key) ? (key as TimedDifficulty) : "UNKNOWN";
  const valid = (value: unknown): value is number =>
    typeof value === "number" && Number.isInteger(value) && value > 0 && value <= 3600;
  const base = valid(override)
    ? override
    : normalized !== "UNKNOWN" && valid(defaults[normalized])
      ? defaults[normalized]
      : 45;
  return {
    difficulty: normalized,
    timeLimitSeconds: Math.ceil(base * (multiplier >= 1 && multiplier <= 4 ? multiplier : 1)),
    timingRulesVersion,
  };
}
