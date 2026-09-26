export const questionKinds = ["SINGLE_CHOICE", "VISUAL_CHOICE", "LIKERT", "SCENARIO"] as const;

export type QuestionKind = (typeof questionKinds)[number];

export type ScoringAnswer = Readonly<{
  questionId: string;
  optionId?: string;
  value?: number;
  durationMs?: number;
}>;

export type ScoringContract<TItem, TResult> = Readonly<{
  quizSlug: string;
  quizVersion: string;
  scoringVersion: string;
  score: (items: readonly TItem[], answers: readonly ScoringAnswer[]) => TResult;
}>;

export class InvalidQuizSubmissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidQuizSubmissionError";
  }
}

export function indexUniqueAnswers(answers: readonly ScoringAnswer[]) {
  const indexed = new Map<string, ScoringAnswer>();

  for (const answer of answers) {
    if (indexed.has(answer.questionId)) {
      throw new InvalidQuizSubmissionError(`Duplicate answer for ${answer.questionId}`);
    }
    indexed.set(answer.questionId, answer);
  }

  return indexed;
}

export type PublicOption = Readonly<{
  id: string;
  stableKey: string;
  position: number;
  label: string;
  imageAlt?: string | null;
}>;

export type PublicQuestion = Readonly<{
  id: string;
  stableKey: string;
  position: number;
  kind: QuestionKind;
  prompt: string;
  accessibilityText?: string | null;
  clue?: string | null;
  options: readonly PublicOption[];
}>;

export type PublicQuiz = Readonly<{
  id: string;
  slug: string;
  productCode: string;
  version: string;
  scoringVersion: string;
  totalQuestions: number;
  questions: readonly PublicQuestion[];
}>;

export type ActiveSession = Readonly<{
  id: string;
  quizVersionId: string;
  quizSlug: string;
  quizVersion: string;
  scoringVersion: string;
  locale: string;
  market: string;
  status: "CREATED" | "IN_PROGRESS" | "COMPLETED" | "EXPIRED";
  currentPosition: number;
  expiresAt: string;
  answers: Readonly<
    Record<string, { optionId?: string; numericValue?: number; durationMs?: number }>
  >;
}>;

export type PartialResultSummary = Readonly<{
  sessionId: string;
  quizSlug: string;
  quizVersion: string;
  scoringVersion: string;
  rawScore?: number;
  overallScore?: number;
  strongestDimension?: string;
  strongestDimensionLabel?: string;
  strongestDimensionDescription?: string;
  dimensionScores?: Readonly<Record<string, number>>;
  qualityWarning?: boolean;
}>;
