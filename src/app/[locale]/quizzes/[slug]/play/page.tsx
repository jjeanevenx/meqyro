import Link from "next/link";
import { attemptChoiceCopy } from "@/lib/i18n/dictionaries";
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
import { getActiveSession, getActiveSessionByToken } from "@/features/quiz-engine/session-service";
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
  searchParams?: Promise<{
    session?: string;
    recover?: string;
    invite?: string;
    ref?: string;
    new?: string;
    resume?: string;
  }>;
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
    source: marketCookie ? "user" : country ? "edge" : "default",
  });

  let initialSession: ActiveSession | null = null;

  // 2. Resume active attempt from cookie (handles reload/F5, back, reopen)
  if (!query.invite) {
    const sessionCookie = cookieStore.get(anonymousSessionCookie)?.value;
    if (sessionCookie) {
      try {
        const active = query.session
          ? await getActiveSession(query.session, sessionCookie)
          : await getActiveSessionByToken(sessionCookie, slug);
        if (active?.quizSlug === slug) {
          initialSession = active;
        }
      } catch {
        initialSession = null;
      }
    }
  }

  if (initialSession && query.new !== "1" && query.resume !== "1") {
    const copy = attemptChoiceCopy[locale];
    const resumeQuery = new URLSearchParams({ resume: "1", session: initialSession.id });
    const newQuery = new URLSearchParams({ new: "1" });
    if (query.ref) newQuery.set("ref", query.ref);
    return (
      <main className="quiz-landing-container">
        <section className="quiz-landing-card" aria-labelledby="attempt-title">
          <h1 id="attempt-title">{copy.title}</h1>
          <p>{copy.body}</p>
          <p>
            {copy.versions
              .replace("{old}", initialSession.quizVersion)
              .replace("{current}", quiz.version)}
          </p>
          <div className="quiz-landing-action">
            <Link
              className="button button--primary"
              href={`/${locale}/quizzes/${slug}/play?${resumeQuery}`}
            >
              {copy.resume}
            </Link>
            <Link
              className="button button--secondary"
              href={`/${locale}/quizzes/${slug}/play?${newQuery}`}
            >
              {copy.start}
            </Link>
          </div>
          <p>{copy.note}</p>
        </section>
      </main>
    );
  }

  if (query.new === "1") initialSession = null;
  const runnerQuiz: PublicQuiz | null = initialSession
    ? await getPublicQuiz(slug, locale, initialSession.id)
    : quiz;
  if (!runnerQuiz) notFound();

  return (
    <QuizRunner
      quiz={runnerQuiz}
      initialSession={initialSession}
      forceNew={query.new === "1" && !query.invite}
      locale={locale}
      market={market.market}
      initialInviteCode={query.invite}
      initialReferralCode={query.ref}
    />
  );
}
