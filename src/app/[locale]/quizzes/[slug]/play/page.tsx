import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/features/seo/metadata-builder";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cookies, headers } from "next/headers";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getPublicQuiz } from "@/features/quiz-engine/repository";
import { resolveMarketContext } from "@/lib/market/market-context";
import { QuizRunner } from "@/components/patterns/quiz-runner";
import type { ActiveSession, PublicQuiz } from "@/features/quiz-engine/contracts";
import {
  getActiveSessionByToken,
  getSessionQuestions,
} from "@/features/quiz-engine/session-service";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";

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

export async function generateMetadata({ params }: PlayPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isValidSlug(slug)) return {};
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    path: `/quizzes/${slug}/play`,
    title: dict.quizzes[slug].name,
    description: dict.quizzes[slug].tagline,
    isPrivate: true,
  });
}

export default async function QuizPlayPage({ params, searchParams }: PlayPageProps) {
  const { locale, slug } = await params;
  const query = searchParams ? await searchParams : {};

  if (!isLocale(locale)) notFound();
  if (!isValidSlug(slug)) notFound();

  if (query.session && query.recover) {
    const recoveryQuery = new URLSearchParams({
      session: query.session,
      recover: query.recover,
      slug,
      locale,
    });
    redirect(`/api/sessions/recover?${recoveryQuery}`);
  }

  const quiz = await getPublicQuiz(slug, locale as Locale);
  if (!quiz) notFound();

  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const marketCookie = cookieStore.get("meqyro_market")?.value;
  const country =
    requestHeaders.get("x-vercel-ip-country") ?? requestHeaders.get("cf-ipcountry") ?? undefined;

  const market = resolveMarketContext({
    locale,
    country,
    market: marketCookie,
    source: marketCookie ? "user" : country ? "edge" : "locale-fallback",
  });

  let initialSession: ActiveSession | null = null;

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
