import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowLeft, Share2, Copy, Sparkles, MessageCircle } from "lucide-react";
import { isLocale, locales } from "@/lib/i18n/config";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { resolveMarketContext } from "@/lib/market/market-context";
import { getProtectedResult } from "@/features/results/result-service";
import { ResultView } from "@/components/patterns/result-view";
import { ButtonLink } from "@/components/ui/button-link";
import { buildPageMetadata } from "@/features/seo/metadata-builder";

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
    title: `Resultado — ${slug.toUpperCase()} | Meqyro`,
    description: "Confira seu resultado detalhado e desbloqueie sua análise completa.",
    isPrivate: true,
  });
}

type ResultPageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams?: Promise<{ session?: string; token?: string; ref?: string }>;
};

export default async function QuizResultPage({ params, searchParams }: ResultPageProps) {
  const { locale, slug } = await params;
  const query = searchParams ? await searchParams : {};

  if (!isLocale(locale)) notFound();
  if (!isValidSlug(slug)) notFound();

  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get(anonymousSessionCookie)?.value;
  const sessionToken = query.token ?? tokenFromCookie;
  const sessionId = query.session;

  const marketCookie = cookieStore.get("meqyro_market")?.value;
  const market = resolveMarketContext({
    locale,
    market: marketCookie,
    source: marketCookie ? "user" : "locale-fallback",
  });

  if (!sessionId || !sessionToken) {
    return (
      <main className="min-h-screen bg-stone-50 py-16 px-4">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Nenhum resultado recente encontrado
          </h1>
          <p className="text-stone-600 text-sm">
            Para ver seus resultados e pontuações, inicie ou conclua o desafio.
          </p>
          <ButtonLink href={`/${locale}/quizzes/${slug}/play`} variant="primary">
            Iniciar {slug.replace(/-/g, " ").toUpperCase()}
          </ButtonLink>
          <div>
            <Link
              href={`/${locale}/quizzes/${slug}`}
              className="text-xs text-stone-500 hover:text-stone-900 inline-flex items-center gap-1"
            >
              <ArrowLeft size={14} /> Voltar à página do desafio
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
            Sessão expirada ou não encontrada
          </h1>
          <p className="text-stone-600 text-sm">
            {err instanceof Error ? err.message : "Não foi possível carregar seu resultado."}
          </p>
          <ButtonLink href={`/${locale}/quizzes/${slug}/play`} variant="primary">
            Fazer um novo teste
          </ButtonLink>
        </div>
      </main>
    );
  }

  const shareText = `Fiz o desafio ${slug.replace(/-/g, " ").toUpperCase()} no Meqyro! Descubra também seus pontos fortes:`;
  const shareUrl = `https://meqyro.com/${locale}/quizzes/${slug}?ref=${sessionId.slice(0, 8)}`;

  return (
    <main className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <Link
            href={`/${locale}/quizzes/${slug}`}
            className="text-xs text-stone-500 hover:text-stone-900 inline-flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={14} /> Sobre este teste
          </Link>
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            Meqyro Results
          </span>
        </div>

        <ResultView
          summary={resultData.summary}
          accessLevel={resultData.accessLevel}
          paywall={resultData.paywall}
          premiumReport={resultData.premiumReport}
          locale={locale}
        />

        {/* Social Share & Referral Bar */}
        <section className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-stone-900">Compartilhar meu resultado</h2>
              <p className="text-xs text-stone-500">Convide amigos para comparar raciocínio e perfil.</p>
            </div>
            <Share2 size={18} className="text-stone-400" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700 transition-colors"
            >
              <MessageCircle size={15} className="text-emerald-600" /> WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700 transition-colors"
            >
              <span className="font-bold text-stone-900">X</span> Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700 transition-colors"
            >
              <span className="font-bold text-blue-600">f</span> Facebook
            </a>
            <button
              type="button"
              onClick={undefined}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700 transition-colors"
            >
              <Copy size={14} /> Copiar link
            </button>
          </div>
        </section>

        {/* Post-Purchase Cross-Sell / Discovery Link */}
        <section className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
            <Sparkles size={14} /> Continue Descobrindo
          </div>
          <h2 className="text-base font-semibold text-stone-900">
            Descubra outras facetas da sua mente e personalidade
          </h2>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Experimente outros desafios objetivos de autoconhecimento sem necessidade de cadastro.
          </p>
          <div className="pt-2">
            <ButtonLink href={`/${locale}/discover`} variant="primary">
              Ver catálogo completo de testes
            </ButtonLink>
          </div>
        </section>
      </div>
    </main>
  );
}
