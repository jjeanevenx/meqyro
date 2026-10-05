import type { PartialResultSummary } from "@/features/quiz-engine/contracts";

export type AccessLevel = "FREE_PARTIAL" | "PREMIUM_UNLOCKED";

export type PaywallOffer = {
  productCode: string;
  quizSlug: string;
  amount: number;
  currency: string;
  formattedPrice: string;
  headline: string;
  features: string[];
  market?: string;
};

export type PremiumSection = {
  id: string;
  title: string;
  summary: string;
  paragraphs: string[];
  keyTakeaways: string[];
  actionItems: string[];
};

export type ComprehensiveReport = {
  executiveSummary: string;
  percentileRank?: number;
  bandLabel: string;
  sections: PremiumSection[];
  comparativeBenchmark: {
    cohort: string;
    percentile?: number;
    description: string;
  };
};

export type ProtectedResultResponse = {
  sessionId: string;
  quizSlug: string;
  accessLevel: AccessLevel;
  summary: PartialResultSummary;
  paywall?: PaywallOffer;
  premiumReport?: ComprehensiveReport;
  couple?: {
    state:
      | "NO_INVITE"
      | "EXPIRED"
      | "WAITING_PARTNER"
      | "WAITING_RESULTS"
      | "CONSENT_REQUIRED"
      | "PAYMENT_REQUIRED"
      | "READY";
    inviteCode: string | null;
    consentGiven: boolean;
  };
  includedQuizzes?: string[];
};
