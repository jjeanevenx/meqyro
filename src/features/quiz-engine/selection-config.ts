export type QuizOrderingStrategy =
  | "PROGRESSIVE_RAMP"
  | "INTERLEAVED_DIMENSIONS"
  | "SEQUENTIAL";

export type DimensionQuota = Readonly<{
  total: number;
  difficulties?: Readonly<{
    EASY?: number;
    MEDIUM?: number;
    HARD?: number;
  }>;
  directions?: Readonly<{
    DIRECT?: number;
    REVERSE?: number;
  }>;
}>;

export type QuizSelectionConfig = Readonly<{
  quizSlug: string;
  totalQuestions: number;
  dimensions: Readonly<Record<string, DimensionQuota>>;
  orderingStrategy: QuizOrderingStrategy;
  requiresDifficulty: boolean;
}>;

export const ASSESSMENT_SELECTION_CONFIGS: Readonly<Record<string, QuizSelectionConfig>> = {
  brainrank: {
    quizSlug: "brainrank",
    totalQuestions: 24,
    requiresDifficulty: true,
    orderingStrategy: "PROGRESSIVE_RAMP",
    dimensions: {
      PATTERN_RECOGNITION: { total: 4, difficulties: { EASY: 1, MEDIUM: 2, HARD: 1 } },
      LOGICAL_REASONING: { total: 4, difficulties: { EASY: 1, MEDIUM: 2, HARD: 1 } },
      NUMERICAL_REASONING: { total: 4, difficulties: { EASY: 1, MEDIUM: 2, HARD: 1 } },
      ATTENTION: { total: 4, difficulties: { EASY: 1, MEDIUM: 2, HARD: 1 } },
      PROBLEM_SOLVING: { total: 4, difficulties: { EASY: 1, MEDIUM: 2, HARD: 1 } },
      SPEED: { total: 4, difficulties: { EASY: 1, MEDIUM: 2, HARD: 1 } },
    },
  },

  "personality-map": {
    quizSlug: "personality-map",
    totalQuestions: 40,
    requiresDifficulty: false,
    orderingStrategy: "INTERLEAVED_DIMENSIONS",
    dimensions: {
      OPENNESS: { total: 8, directions: { DIRECT: 4, REVERSE: 4 } },
      CONSCIENTIOUSNESS: { total: 8, directions: { DIRECT: 4, REVERSE: 4 } },
      EXTRAVERSION: { total: 8, directions: { DIRECT: 4, REVERSE: 4 } },
      AGREEABLENESS: { total: 8, directions: { DIRECT: 4, REVERSE: 4 } },
      EMOTIONAL_STABILITY: { total: 8, directions: { DIRECT: 4, REVERSE: 4 } },
    },
  },

  careerfit: {
    quizSlug: "careerfit",
    totalQuestions: 24,
    requiresDifficulty: false,
    orderingStrategy: "INTERLEAVED_DIMENSIONS",
    dimensions: {
      TECHNICAL: { total: 4 },
      MANAGERIAL: { total: 4 },
      CREATIVE: { total: 4 },
      AUTONOMOUS: { total: 4 },
      SECURITY: { total: 4 },
      CAUSE: { total: 4 },
    },
  },

  moneydna: {
    quizSlug: "moneydna",
    totalQuestions: 20,
    requiresDifficulty: false,
    orderingStrategy: "INTERLEAVED_DIMENSIONS",
    dimensions: {
      BUILDER: { total: 4 },
      GUARDIAN: { total: 4 },
      STRATEGIST: { total: 4 },
      ADVENTURER: { total: 4 },
      BALANCER: { total: 4 },
    },
  },

  focusstyle: {
    quizSlug: "focusstyle",
    totalQuestions: 20,
    requiresDifficulty: false,
    orderingStrategy: "INTERLEAVED_DIMENSIONS",
    dimensions: {
      IMMERSIVE_HYPERFOCUS: { total: 5 },
      MODULAR_SERIAL: { total: 5 },
      COLLABORATIVE: { total: 5 },
      REACTIVE_SPRINT: { total: 5 },
    },
  },

  decisiondna: {
    quizSlug: "decisiondna",
    totalQuestions: 4,
    requiresDifficulty: false,
    orderingStrategy: "SEQUENTIAL",
    dimensions: {
      SCENARIOS: { total: 4 },
    },
  },

  coupledna: {
    quizSlug: "coupledna",
    totalQuestions: 20,
    requiresDifficulty: false,
    orderingStrategy: "INTERLEAVED_DIMENSIONS",
    dimensions: {
      COMMUNICATION: { total: 4 },
      LIFE_VALUES: { total: 4 },
      CONFLICT_MANAGEMENT: { total: 4 },
      FINANCES: { total: 4 },
      FUTURE_PLANS: { total: 4 },
    },
  },
};

export function getAssessmentSelectionConfig(quizSlug: string): QuizSelectionConfig {
  const config = ASSESSMENT_SELECTION_CONFIGS[quizSlug];
  if (!config) {
    throw new Error(`No assessment selection configuration found for quiz slug: "${quizSlug}"`);
  }
  return config;
}
