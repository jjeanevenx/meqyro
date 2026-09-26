import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getPublicQuiz } from "@/features/quiz-engine/repository";
import { resolveMarketContext } from "@/lib/market/market-context";
import { QuizRunner } from "@/components/patterns/quiz-runner";
import type { ActiveSession } from "@/features/quiz-engine/contracts";

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

  const initialSession: ActiveSession | null = null;

  return (
    <QuizRunner
      quiz={quiz}
      initialSession={initialSession}
      locale={locale}
      market={market.market}
      initialInviteCode={query.invite}
      initialReferralCode={query.ref}
    />
  );
}
