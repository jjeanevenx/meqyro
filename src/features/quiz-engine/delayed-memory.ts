import type { PublicQuestion } from "./contracts";

/** Replace one item in each third of the quiz; preserve its original length. */
export function distributeMemoryItems<T>(ordinary: readonly T[], memory: readonly T[]): T[] {
  if (memory.length !== 3) throw new Error("Exactly three memory exercises are required");
  if (ordinary.length < 20) throw new Error("Insufficient intervening questions");
  const result: T[] = [];
  let start = 0;
  [Math.ceil(ordinary.length / 3), Math.ceil((2 * ordinary.length) / 3), ordinary.length].forEach(
    (end, index) => {
      result.push(...ordinary.slice(start, end - 1), memory[index]);
      start = end;
    },
  );
  return result;
}

export function attachMemoryCues(questions: readonly PublicQuestion[]): PublicQuestion[] {
  const result = questions.map((q, index) => ({ ...q, position: index + 1 }));
  let blockStart = 0;
  for (let index = 0; index < result.length; index += 1) {
    const memory = result[index].memoryRecall;
    if (memory) {
      result[blockStart] = {
        ...result[blockStart],
        memoryCue: { id: memory.id, text: memory.cue },
      };
      // Cue is only rendered before the block; it must not appear on the recall card.
      blockStart = index + 1;
    }
  }
  return result;
}
