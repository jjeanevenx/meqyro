import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, Share2, Sparkles, MessageCircle } from "lucide-react";
import { CopyLinkButton } from "@/components/patterns/copy-link-button";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { resolveMarketContext } from "@/lib/market/market-context";
import { getProtectedResult } from "@/features/results/result-service";
import { ResultView } from "@/components/patterns/result-view";
import { ButtonLink } from "@/components/ui/button-link";
import { buildPageMetadata } from "@/features/seo/metadata-builder";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSiteUrl } from "@/lib/config/env";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isValidSlug(slug)) return {};

  return buildPageMetadata({
    locale,
    path: `/quizzes/${slug}/result`,
    title: `${getDictionary(locale).common.viewResult} — ${getDictionary(locale).quizzes[slug].name}`,
    description: getDictionary(locale).quizzes[slug].tagline,
    isPrivate: true,
  });
}

type ResultPageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams?: Promise<{
    session?: string;
    token?: string;
    ref?: string;
    cta?: string;
    variant?: string;
  }>;
};

export default async function QuizResultPage({ params, searchParams }: ResultPageProps) {
  const { locale, slug } = await params;
  const query = searchParams ? await searchParams : {};

  if (!isLocale(locale)) notFound();
  if (!isValidSlug(slug)) notFound();

  const safeLocale: Locale = locale === "en" || locale === "es" || locale === "fr" ? locale : "pt";
  const dict = getDictionary(safeLocale);

  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const tokenFromCookie = cookieStore.get(anonymousSessionCookie)?.value;
  const sessionToken = query.token ?? tokenFromCookie;
  const sessionId = query.session;

  const marketCookie = cookieStore.get("meqyro_market")?.value;
  const country =
    requestHeaders.get("x-vercel-ip-country") ?? requestHeaders.get("cf-ipcountry") ?? undefined;
  const market = resolveMarketContext({
    locale,
    country,
    market: marketCookie,
    source: marketCookie ? "user" : country ? "edge" : "locale-fallback",
  });

  const quizInfo = dict.quizzes[slug] ?? dict.quizzes.brainrank;

  if (!sessionId || !sessionToken) {
    return (
      <main className="min-h-screen bg-stone-50 py-16 px-4">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            {dict.resultView.noResultFound}
          </h1>
          <p className="text-stone-600 text-sm">{dict.common.loading}</p>
          <ButtonLink href={`/${locale}/quizzes/${slug}/play`} variant="primary">
            {dict.resultView.startQuizCta}
          </ButtonLink>
          <div>
            <Link
              href={`/${locale}/quizzes/${slug}`}
              className="text-xs text-stone-500 hover:text-stone-900 inline-flex items-center gap-1"
            >
              <ArrowLeft size={14} /> {dict.common.back}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  let resultData;
  try {
    resultData = await getProtectedResult({
      sessionId,
      sessionToken,
      locale,
      market: market.market,
    });
  } catch (err) {
    return (
      <main className="min-h-screen bg-stone-50 py-16 px-4">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            {dict.resultView.noResultFound}
          </h1>
          <p className="text-stone-600 text-sm">
            {err instanceof Error ? err.message : dict.common.error}
          </p>
          <ButtonLink href={`/${locale}/quizzes/${slug}/play`} variant="primary">
            {dict.resultView.startQuizCta}
          </ButtonLink>
        </div>
      </main>
    );
  }

  const ctaVariant =
    query.cta === "complete_analysis" || query.variant === "complete_analysis"
      ? "complete_analysis"
      : "unlock_report";

  if (resultData.quizSlug !== slug) notFound();

  const siteUrl = getSiteUrl();
  const shareText = {
    pt: `Fiz o desafio ${quizInfo.name} no Meqyro! Descubra também seus pontos fortes:`,
    en: `I took the ${quizInfo.name} challenge on Meqyro! Discover your strengths too:`,
    es: `¡Hice el desafío ${quizInfo.name} en Meqyro! Descubre tus puntos fuertes:`,
    fr: `J'ai passé le test ${quizInfo.name} sur Meqyro ! Découvrez aussi vos points forts :`,
  }[safeLocale];

  const shareUrl = `${siteUrl}/${locale}/quizzes/${slug}?ref=${sessionId.slice(0, 8)}`;

  return (
    <main className="quiz-result-page">
      <div className="quiz-result-page__container">
        <div className="quiz-result-page__header">
          <Link
            href={`/${locale}/quizzes/${slug}`}
            className="text-xs text-stone-500 hover:text-stone-900 inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={14} /> {dict.common.back}
          </Link>
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            {dict.common.viewResult} · MEQYRO
          </span>
        </div>

        <ResultView
          summary={resultData.summary}
          accessLevel={resultData.accessLevel}
          paywall={resultData.paywall}
          premiumReport={resultData.premiumReport}
          couple={resultData.couple}
          includedQuizzes={resultData.includedQuizzes}
          locale={locale}
          ctaVariant={ctaVariant}
        />

        {/* Social Share & Referral Bar */}
        <section className="quiz-result-page__share">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-stone-900">{dict.resultView.shareTitle}</h2>
              <p className="text-xs text-stone-500">{quizInfo.tagline}</p>
            </div>
            <Share2 size={18} className="text-stone-400" />
          </div>

          <div className="result-share-grid">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="result-share-link"
            >
              <MessageCircle size={15} className="text-emerald-600" /> WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="result-share-link"
            >
              <span className="font-bold text-stone-900">X</span> Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="result-share-link"
            >
              <span className="font-bold text-blue-600">f</span> Facebook
            </a>
            <CopyLinkButton
              url={shareUrl}
              label={dict.common.copyLink}
              copiedLabel={dict.common.linkCopied}
              errorLabel={dict.common.error}
            />
          </div>
        </section>

        {/* Post-Purchase Cross-Sell / Discovery Link */}
        <section className="quiz-result-page__discover">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
            <Sparkles size={14} /> {dict.nav.discover}
          </div>
          <h2 className="text-base font-semibold text-stone-900">{dict.hero.body}</h2>
          <div className="pt-2">
            <ButtonLink href={`/${locale}/discover`} variant="primary">
              {dict.nav.catalog}
            </ButtonLink>
          </div>
        </section>
      </div>
    </main>
  );
}
