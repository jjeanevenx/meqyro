import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getPublicQuiz } from "@/features/quiz-engine/repository";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { resolveMarketContext } from "@/lib/market/market-context";
import { QuizRunner } from "@/components/patterns/quiz-runner";
import type { ActiveSession } from "@/features/quiz-engine/contracts";

type PlayPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function QuizPlayPage({ params }: PlayPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) notFound();
  if (slug !== "brainrank" && slug !== "personality-map") notFound();

  const quiz = await getPublicQuiz(slug, locale as Locale);
  if (!quiz) notFound();

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(anonymousSessionCookie)?.value;
  const marketCookie = cookieStore.get("meqyro_market")?.value;

  const market = resolveMarketContext({
    locale,
    market: marketCookie,
    source: marketCookie ? "user" : "locale-fallback",
  });

  let initialSession: ActiveSession | null = null;

  if (sessionToken) {
    try {
      // In cookie or store, we might find active session if user resumes
      // Let's attempt to look up if the session is for this quiz
      // If we don't have sessionId yet, client will initialize or we pass null
    } catch {
      initialSession = null;
    }
  }

  return (
    <QuizRunner
      quiz={quiz}
      initialSession={initialSession}
      locale={locale}
      market={market.market}
    />
  );
}
