import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getPublicQuiz } from "@/features/quiz-engine/repository";
import { resolveMarketContext } from "@/lib/market/market-context";
import { QuizRunner } from "@/components/patterns/quiz-runner";
import type { ActiveSession, PublicQuiz } from "@/features/quiz-engine/contracts";
import {
  validateAndRecoverSession,
  getActiveSessionByToken,
  getSessionQuestions,
} from "@/features/quiz-engine/session-service";
import {
  anonymousSessionCookie,
  anonymousSessionTtlSeconds,
} from "@/lib/security/anonymous-session";

export const dynamic = "force-dynamic";

const VALID_SLUGS = [
  "brainrank",
  "personality-map",
  "careerfit",
  "moneydna",
  "focusstyle",
  "decisiondna",
  "coupledna",
] as const;

type QuizSlug = (typeof VALID_SLUGS)[number];

function isValidSlug(slug: string): slug is QuizSlug {
  return (VALID_SLUGS as readonly string[]).includes(slug);
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    VALID_SLUGS.map((slug) => ({
      locale,
      slug,
    })),
  );
}

type PlayPageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams?: Promise<{ session?: string; recover?: string; invite?: string; ref?: string }>;
};

export default async function QuizPlayPage({ params, searchParams }: PlayPageProps) {
  const { locale, slug } = await params;
  const query = searchParams ? await searchParams : {};

  if (!isLocale(locale)) notFound();
  if (!isValidSlug(slug)) notFound();

  const quiz = await getPublicQuiz(slug, locale as Locale);
  if (!quiz) notFound();

  const cookieStore = await cookies();
  const marketCookie = cookieStore.get("meqyro_market")?.value;

  const market = resolveMarketContext({
    locale,
    market: marketCookie,
    source: marketCookie ? "user" : "locale-fallback",
  });

  let initialSession: ActiveSession | null = null;

  // 1. Real session recovery flow from URL tokens
  if (query.session && query.recover) {
    try {
      const recovered = await validateAndRecoverSession({
        sessionId: query.session,
        recoveryToken: query.recover,
        quizSlug: slug,
      });

      if (recovered.status === "COMPLETED") {
        redirect(recovered.resultRedirectUrl);
      }

      initialSession = recovered.session;

      // Authenticate subsequent requests via HttpOnly cookie
      cookieStore.set(anonymousSessionCookie, recovered.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: anonymousSessionTtlSeconds,
      });
    } catch {
      // Fail-closed without disclosing session state; proceed as standard fresh session
      initialSession = null;
    }
  }

  // 2. Resume active attempt from cookie (handles reload/F5, back, reopen)
  if (!initialSession) {
    const sessionCookie = cookieStore.get(anonymousSessionCookie)?.value;
    if (sessionCookie) {
      try {
        const active = await getActiveSessionByToken(sessionCookie, slug);
        if (active) {
          initialSession = active;
        }
      } catch {
        initialSession = null;
      }
    }
  }

  // 3. Load questions strictly belonging to this attempt (or catalog fallback)
  let attemptQuestions = quiz.questions;
  if (initialSession) {
    const sessionQs = await getSessionQuestions(initialSession.id, locale as Locale);
    if (sessionQs.length > 0) {
      attemptQuestions = sessionQs;
    }
  }

  const runnerQuiz: PublicQuiz = {
    ...quiz,
    totalQuestions: attemptQuestions.length,
    questions: attemptQuestions,
  };

  return (
    <QuizRunner
      quiz={runnerQuiz}
      initialSession={initialSession}
      locale={locale}
      market={market.market}
      initialInviteCode={query.invite}
      initialReferralCode={query.ref}
    />
  );
}
