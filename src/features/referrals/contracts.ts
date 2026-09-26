import type { Locale } from "@/lib/i18n/config";

export interface ReferralRecord {
  id: string;
  code: string;
  creatorSessionId: string | null;
  quizSlug: string;
  locale: Locale;
  clicksCount: number;
  conversionsCount: number;
  createdAt: string;
}

export interface CreateReferralInput {
  sessionId: string;
  sessionToken: string;
  quizSlug: string;
  locale: Locale;
}

export interface SafeShareData {
  referralCode: string;
  shareUrl: string;
  shareTitle: string;
  shareText: string;
}
