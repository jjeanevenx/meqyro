import type { PublicQuestion } from "./contracts";

/** One-based execution positions. Informational steps do not increase the item count. */
export function memoryExecutionPlan(total: number, middleGap = 5) {
  if (!Number.isInteger(total) || total < 20 || !Number.isInteger(middleGap) || middleGap < 2) {
    throw new Error("Invalid delayed recall plan");
  }
  const middleRecall = Math.min(total - 5, Math.floor(total / 2) + 6);
  const middleCue = middleRecall - middleGap;
  if (middleCue <= 8) throw new Error("Insufficient intervening questions");
  return [
    { cuePosition: 1, recallPosition: 8, interveningQuestions: 7 },
    { cuePosition: middleCue, recallPosition: middleRecall, interveningQuestions: middleGap },
    { cuePosition: total - 4, recallPosition: total, interveningQuestions: 4 },
  ] as const;
}

/** Replace three selected items; preserve the configured attempt length. */
export function distributeMemoryItems<T>(
  ordinary: readonly T[],
  memory: readonly T[],
  mode: "spaced" | "legacy" = "spaced",
): T[] {
  if (memory.length !== 3) throw new Error("Exactly three memory exercises are required");
  if (ordinary.length < 20) throw new Error("Insufficient intervening questions");
  const result: T[] = [];
  let start = 0;
  (mode === "legacy"
    ? [Math.ceil(ordinary.length / 3), Math.ceil((2 * ordinary.length) / 3), ordinary.length]
    : memoryExecutionPlan(ordinary.length).map((step) => step.recallPosition)
  ).forEach((end, index) => {
    result.push(...ordinary.slice(start, end - 1), memory[index]);
    start = end;
  });
  return result;
}

export function attachMemoryCues(questions: readonly PublicQuestion[]): PublicQuestion[] {
  const result = questions.map((q, index) => ({
    ...q,
    memoryCue: undefined as PublicQuestion["memoryCue"],
    position: index + 1,
  }));
  if (!result.some((q) => q.memoryRecall)) return result;
  let blockStart = 0;
  const recalls = result.flatMap((q, index) => (q.memoryRecall ? [index + 1] : []));
  // Old attempts retain their original block boundaries; new persisted orders identify v2.
  const plan = memoryExecutionPlan(result.length);
  const isCurrentPlan =
    recalls.length === 3 && recalls.every((position, i) => position === plan[i].recallPosition);
  let cycle = 0;
  for (let index = 0; index < result.length; index += 1) {
    const memory = result[index].memoryRecall;
    if (memory) {
      const cueIndex = isCurrentPlan ? plan[cycle].cuePosition - 1 : blockStart;
      result[cueIndex] = {
        ...result[cueIndex],
        memoryCue: { id: memory.id, text: memory.cue },
      };
      // Cue is only rendered before the block; it must not appear on the recall card.
      blockStart = index + 1;
      cycle += 1;
    }
  }
  return result;
}
