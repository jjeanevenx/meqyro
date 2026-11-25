import "server-only";

type ScoringOption = {
  id: string;
  scoring_value?: { isCorrect?: boolean } | null;
};

export function requireBrainRankAnswerKey(options: readonly ScoringOption[]): string {
  const correct = options.filter((option) => option.scoring_value?.isCorrect === true);
  if (correct.length !== 1 || !correct[0].id) {
    throw new Error("Invalid BrainRank answer key");
  }
  return correct[0].id;
}
