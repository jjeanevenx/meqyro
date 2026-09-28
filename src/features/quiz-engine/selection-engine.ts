import type { QuizSelectionConfig } from "./selection-config";

export class InsufficientQuestionPoolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InsufficientQuestionPoolError";
  }
}

export type CandidateOption = Readonly<{
  id: string;
  stableKey: string;
  position: number;
  scoringValue?: Record<string, unknown> | null;
  translations?: ReadonlyArray<{ locale: string; label: string }>;
}>;

export type CandidateQuestion = Readonly<{
  id: string;
  stableKey: string;
  kind: string;
  scoringKey: Record<string, unknown>;
  metadata?: Record<string, unknown> | null;
  active: boolean;
  translations?: ReadonlyArray<{ locale: string; prompt: string }>;
  options?: readonly CandidateOption[];
}>;

export type SelectedQuestionItem = Readonly<{
  questionId: string;
  stableKey: string;
  position: number;
  dimension: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD" | "N/A";
}>;

/**
 * 32-bit FNV-1a hash for string seeds
 */
function hashStringSeed(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Mulberry32 deterministic PRNG
 */
export function createPrng(seed: string | number): () => number {
  let s = typeof seed === "number" ? seed >>> 0 : hashStringSeed(seed);
  return function next(): number {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates deterministic shuffle
 */
export function shuffleWithSeed<T>(array: readonly T[], prng: () => number): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Validates candidate eligibility
 */
export function isCandidateEligible(
  q: CandidateQuestion,
  requiredLocales: readonly string[] = ["pt", "en", "es", "fr"],
): boolean {
  if (!q.active) return false;
  if (!q.id || !q.stableKey) return false;

  // Check translations completeness if available
  if (q.translations && q.translations.length > 0) {
    const presentLocales = new Set(
      q.translations
        .filter((t) => typeof t.prompt === "string" && t.prompt.trim().length > 0)
        .map((t) => t.locale),
    );
    const hasAll = requiredLocales.every((loc) => presentLocales.has(loc));
    if (!hasAll) return false;
  }

  // Options validation for multiple choice / scenarios
  if (q.kind === "SINGLE_CHOICE" || q.kind === "VISUAL_CHOICE" || q.kind === "SCENARIO") {
    if (!q.options || q.options.length < 2) return false;
  }

  return true;
}

export function extractQuestionDimension(q: CandidateQuestion): string {
  const sk = q.scoringKey ?? {};
  return (
    (sk.dimension as string) ||
    (sk.archetype as string) ||
    (sk.style as string) ||
    (q.metadata?.dimension as string) ||
    "UNKNOWN"
  );
}

export function extractQuestionDifficulty(q: CandidateQuestion): "EASY" | "MEDIUM" | "HARD" | "N/A" {
  const diff = ((q.scoringKey?.difficulty as string) ?? "").toUpperCase();
  if (diff === "EASY" || diff === "MEDIUM" || diff === "HARD") {
    return diff;
  }
  return "N/A";
}

export function extractQuestionDirection(q: CandidateQuestion): "DIRECT" | "REVERSE" | "N/A" {
  const dir = ((q.scoringKey?.direction as string) ?? "").toUpperCase();
  if (dir === "DIRECT" || dir === "REVERSE") {
    return dir;
  }
  return "N/A";
}

/**
 * Core stratified selection engine
 */
export function selectQuestionsForAttempt(
  allCandidates: readonly CandidateQuestion[],
  config: QuizSelectionConfig,
  seed: string,
): SelectedQuestionItem[] {
  const prng = createPrng(seed);

  // 1. Filter eligible candidates
  const eligible = allCandidates.filter((q) => isCandidateEligible(q));

  if (eligible.length < config.totalQuestions) {
    throw new InsufficientQuestionPoolError(
      `Insufficient questions for quiz "${config.quizSlug}": required ${config.totalQuestions}, available ${eligible.length}.`,
    );
  }

  // 2. Index candidates by dimension
  const byDimension = new Map<string, CandidateQuestion[]>();
  for (const q of eligible) {
    const dim = extractQuestionDimension(q);
    const list = byDimension.get(dim) ?? [];
    list.push(q);
    byDimension.set(dim, list);
  }

  const selectedQuestions: CandidateQuestion[] = [];
  const selectedIds = new Set<string>();

  // 3. Stratified selection per configured dimension
  for (const [dimKey, quota] of Object.entries(config.dimensions)) {
    // If quiz is decisiondna scenarios, dimension key in config is 'SCENARIOS'
    const candidatesInDim =
      dimKey === "SCENARIOS"
        ? [...eligible]
        : (byDimension.get(dimKey) ?? []);

    if (candidatesInDim.length < quota.total) {
      throw new InsufficientQuestionPoolError(
        `Insufficient questions for quiz "${config.quizSlug}", dimension "${dimKey}": required ${quota.total}, available ${candidatesInDim.length}.`,
      );
    }

    // A. Sub-stratification by difficulty (e.g. BrainRank)
    if (quota.difficulties) {
      const byDiff: Record<string, CandidateQuestion[]> = {
        EASY: [],
        MEDIUM: [],
        HARD: [],
      };

      for (const q of candidatesInDim) {
        const diff = extractQuestionDifficulty(q);
        if (byDiff[diff]) {
          byDiff[diff].push(q);
        }
      }

      const diffOrder: Array<"EASY" | "MEDIUM" | "HARD"> = ["EASY", "MEDIUM", "HARD"];

      for (const diff of diffOrder) {
        const targetCount = quota.difficulties[diff] ?? 0;
        if (targetCount === 0) continue;

        const availableInDiff = shuffleWithSeed(
          byDiff[diff].filter((q) => !selectedIds.has(q.id)),
          prng,
        );

        let pickedCount = 0;
        for (const q of availableInDiff) {
          if (pickedCount < targetCount) {
            selectedQuestions.push(q);
            selectedIds.add(q.id);
            pickedCount++;
          } else {
            break;
          }
        }

        // Fallback: If not enough questions in this difficulty bucket, look in adjacent difficulty
        if (pickedCount < targetCount) {
          console.warn(
            `[question-selection-fallback] Quiz "${config.quizSlug}", dimension "${dimKey}": needed ${targetCount} of difficulty ${diff}, only found ${pickedCount}. Attempting adjacent difficulty fallback.`,
          );

          const adjacentDiffs: Array<"EASY" | "MEDIUM" | "HARD"> =
            diff === "EASY"
              ? ["MEDIUM", "HARD"]
              : diff === "MEDIUM"
                ? ["EASY", "HARD"]
                : ["MEDIUM", "EASY"];

          for (const fallbackDiff of adjacentDiffs) {
            if (pickedCount >= targetCount) break;

            const fallbackAvailable = shuffleWithSeed(
              byDiff[fallbackDiff].filter((q) => !selectedIds.has(q.id)),
              prng,
            );

            for (const fq of fallbackAvailable) {
              if (pickedCount < targetCount) {
                selectedQuestions.push(fq);
                selectedIds.add(fq.id);
                pickedCount++;
              } else {
                break;
              }
            }
          }

          if (pickedCount < targetCount) {
            throw new InsufficientQuestionPoolError(
              `Failed to meet quota for quiz "${config.quizSlug}", dimension "${dimKey}", difficulty ${diff}: selected ${pickedCount} of ${targetCount} even after fallback.`,
            );
          }
        }
      }
    }
    // B. Sub-stratification by direction (e.g. Personality Map: 4 direct, 4 reverse)
    else if (quota.directions) {
      const directCandidates = shuffleWithSeed(
        candidatesInDim.filter(
          (q) => extractQuestionDirection(q) === "DIRECT" && !selectedIds.has(q.id),
        ),
        prng,
      );
      const reverseCandidates = shuffleWithSeed(
        candidatesInDim.filter(
          (q) => extractQuestionDirection(q) === "REVERSE" && !selectedIds.has(q.id),
        ),
        prng,
      );

      const targetDirect = quota.directions.DIRECT ?? 0;
      const targetReverse = quota.directions.REVERSE ?? 0;

      let pickedDirect = 0;
      for (const q of directCandidates) {
        if (pickedDirect < targetDirect) {
          selectedQuestions.push(q);
          selectedIds.add(q.id);
          pickedDirect++;
        }
      }

      let pickedReverse = 0;
      for (const q of reverseCandidates) {
        if (pickedReverse < targetReverse) {
          selectedQuestions.push(q);
          selectedIds.add(q.id);
          pickedReverse++;
        }
      }

      if (pickedDirect < targetDirect || pickedReverse < targetReverse) {
        // Fallback: take remaining from same dimension
        const remaining = shuffleWithSeed(
          candidatesInDim.filter((q) => !selectedIds.has(q.id)),
          prng,
        );
        while (selectedQuestions.filter((q) => extractQuestionDimension(q) === dimKey).length < quota.total && remaining.length > 0) {
          const nextQ = remaining.pop();
          if (nextQ && !selectedIds.has(nextQ.id)) {
            selectedQuestions.push(nextQ);
            selectedIds.add(nextQ.id);
          }
        }
      }

      const totalInDim = selectedQuestions.filter((q) => extractQuestionDimension(q) === dimKey).length;
      if (totalInDim < quota.total) {
        throw new InsufficientQuestionPoolError(
          `Failed to meet quota for quiz "${config.quizSlug}", dimension "${dimKey}": got ${totalInDim}, required ${quota.total}.`,
        );
      }
    }
    // C. Flat dimension quota (CareerFit, MoneyDNA, FocusStyle, CoupleDNA)
    else {
      const availableInDim = shuffleWithSeed(
        candidatesInDim.filter((q) => !selectedIds.has(q.id)),
        prng,
      );

      let picked = 0;
      for (const q of availableInDim) {
        if (picked < quota.total) {
          selectedQuestions.push(q);
          selectedIds.add(q.id);
          picked++;
        } else {
          break;
        }
      }

      if (picked < quota.total) {
        throw new InsufficientQuestionPoolError(
          `Insufficient questions for quiz "${config.quizSlug}", dimension "${dimKey}": required ${quota.total}, selected ${picked}.`,
        );
      }
    }
  }

  // 4. UX-Aware Ordering
  const orderedQuestions = orderSelectedQuestions(
    selectedQuestions,
    config.orderingStrategy,
    prng,
  );

  // 5. Final validation: unique IDs and count
  if (orderedQuestions.length !== config.totalQuestions) {
    throw new Error(
      `Internal Selection Error: selected ${orderedQuestions.length} questions, expected ${config.totalQuestions}.`,
    );
  }

  const finalIdSet = new Set<string>();
  return orderedQuestions.map((q, idx) => {
    if (finalIdSet.has(q.id)) {
      throw new Error(`Internal Selection Error: duplicate question ${q.id} detected.`);
    }
    finalIdSet.add(q.id);

    return {
      questionId: q.id,
      stableKey: q.stableKey,
      position: idx + 1,
      dimension: extractQuestionDimension(q),
      difficulty: extractQuestionDifficulty(q),
    };
  });
}

/**
 * Orders selected questions based on methodology & UX rules
 */
export function orderSelectedQuestions(
  selected: readonly CandidateQuestion[],
  strategy: QuizSelectionConfig["orderingStrategy"],
  prng: () => number,
): CandidateQuestion[] {
  if (strategy === "SEQUENTIAL") {
    // Preserve stable position or stable_key ordering
    return [...selected].sort((a, b) => a.stableKey.localeCompare(b.stableKey));
  }

  if (strategy === "PROGRESSIVE_RAMP") {
    // Cognitive assessments (BrainRank):
    // Avoid clustering hard questions at the start.
    // Progression ramp:
    // Q1-Q6: Warm-up (mostly EASY, some MEDIUM)
    // Q7-Q18: Core (mostly MEDIUM, some EASY & HARD)
    // Q19-Q24: Challenge (HARD + remaining MEDIUM)
    const easy = shuffleWithSeed(
      selected.filter((q) => extractQuestionDifficulty(q) === "EASY"),
      prng,
    );
    const medium = shuffleWithSeed(
      selected.filter((q) => extractQuestionDifficulty(q) === "MEDIUM"),
      prng,
    );
    const hard = shuffleWithSeed(
      selected.filter((q) => extractQuestionDifficulty(q) === "HARD"),
      prng,
    );

    const warmUp: CandidateQuestion[] = [];
    const core: CandidateQuestion[] = [];
    const challenge: CandidateQuestion[] = [];

    // Warm-up: 4 Easy, 2 Medium
    while (easy.length > 2 && warmUp.length < 4) {
      const q = easy.shift();
      if (q) warmUp.push(q);
    }
    while (medium.length > 8 && warmUp.length < 6) {
      const q = medium.shift();
      if (q) warmUp.push(q);
    }

    // Challenge: 4 Hard, 2 Medium
    while (hard.length > 2 && challenge.length < 4) {
      const q = hard.pop();
      if (q) challenge.push(q);
    }
    while (medium.length > 6 && challenge.length < 6) {
      const q = medium.pop();
      if (q) challenge.push(q);
    }

    // Core: remaining
    core.push(...easy, ...medium, ...hard);

    // Interleave dimensions within blocks so consecutive items differ
    return [
      ...interleaveDimensions(warmUp),
      ...interleaveDimensions(core),
      ...interleaveDimensions(challenge),
    ];
  }

  if (strategy === "INTERLEAVED_DIMENSIONS") {
    // Behavioral & Likert tests (Personality Map, CareerFit, MoneyDNA, FocusStyle, CoupleDNA):
    // Round-robin across dimensions to prevent 8 items of the same dimension consecutively.
    return interleaveDimensions(selected);
  }

  return [...selected];
}

/**
 * Interleaves questions so adjacent questions do not belong to the same dimension
 */
function interleaveDimensions(questions: readonly CandidateQuestion[]): CandidateQuestion[] {
  const byDim = new Map<string, CandidateQuestion[]>();
  for (const q of questions) {
    const dim = extractQuestionDimension(q);
    const list = byDim.get(dim) ?? [];
    list.push(q);
    byDim.set(dim, list);
  }

  const result: CandidateQuestion[] = [];
  const dimKeys = Array.from(byDim.keys());
  let hasMore = true;

  while (hasMore) {
    hasMore = false;
    for (const key of dimKeys) {
      const list = byDim.get(key);
      if (list && list.length > 0) {
        result.push(list.shift()!);
        hasMore = true;
      }
    }
  }

  return result;
}
