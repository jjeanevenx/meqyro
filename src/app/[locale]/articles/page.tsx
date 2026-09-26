import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { ARTICLES } from "@/content/articles/data";
import { buildPageMetadata } from "@/features/seo/metadata-builder";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const titles: Record<Locale, string> = {
    pt: "Artigos e Guias de Autoconhecimento | Meqyro",
    en: "Articles & Cognitive Guides | Meqyro",
    es: "Artículos y Guías de Autoconocimiento | Meqyro",
    fr: "Articles et Guides Cognitifs | Meqyro",
  };

  const descriptions: Record<Locale, string> = {
    pt: "Artigos científicos e acessíveis sobre raciocínio lógico, modelo Big Five e tomada de decisão.",
    en: "Accessible, scientifically grounded articles on reasoning, the Big Five, and decision psychology.",
    es: "Artículos fundamentados sobre razonamiento, personalidad y psicología de la decisión.",
    fr: "Articles rigoureux et accessibles sur le raisonnement, la personnalité et la décision.",
  };

  return buildPageMetadata({
    locale,
    path: "/articles",
    title: titles[locale as Locale],
    description: descriptions[locale as Locale],
  });
}

type ArticlesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ArticlesIndexPage({ params }: ArticlesPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const labels: Record<
    Locale,
    { title: string; subtitle: string; readMore: string; minRead: string }
  > = {
    pt: {
      title: "Artigos e Fundamentos",
      subtitle:
        "Conhecimento rigoroso e prático sobre como nossa mente pensa, decide e se conecta.",
      readMore: "Ler artigo completo",
      minRead: "min de leitura",
    },
    en: {
      title: "Articles & Perspectives",
      subtitle: "Grounded, actionable insights on how human minds think, decide, and connect.",
      readMore: "Read full article",
      minRead: "min read",
    },
    es: {
      title: "Artículos y Fundamentos",
      subtitle:
        "Conocimiento riguroso y práctico sobre cómo pensamos, decidimos y nos relacionamos.",
      readMore: "Leer artículo completo",
      minRead: "min de lectura",
    },
    fr: {
      title: "Articles et Fondements",
      subtitle: "Repères rigoureux et pratiques sur notre manière de penser, décider et interagir.",
      readMore: "Lire l'article complet",
      minRead: "min de lecture",
    },
  };

  const copy = labels[locale as Locale];

  return (
    <main className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200/70 text-stone-700 text-xs font-semibold uppercase tracking-wider">
            Meqyro Insights
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            {copy.title}
          </h1>
          <p className="text-sm text-stone-600 max-w-lg mx-auto">{copy.subtitle}</p>
        </header>

        <div className="space-y-6">
          {ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex items-center gap-3 text-xs text-stone-500">
                <span className="inline-flex items-center gap-1">
                  <Clock size={13} /> {article.readingTimeMinutes} {copy.minRead}
                </span>
                <span>•</span>
                <span className="uppercase font-medium tracking-wider text-[11px] text-stone-600">
                  {article.relatedQuizSlug.replace(/-/g, " ")}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900 leading-snug">
                  <Link
                    href={`/${locale}/articles/${article.slug}`}
                    className="hover:text-stone-700 transition-colors"
                  >
                    {article.title[locale as Locale]}
                  </Link>
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  {article.excerpt[locale as Locale]}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                <Link
                  href={`/${locale}/articles/${article.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 hover:text-stone-700 transition-colors"
                >
                  {copy.readMore} <ArrowRight size={14} />
                </Link>
                <Link
                  href={`/${locale}/quizzes/${article.relatedQuizSlug}`}
                  className="text-[11px] text-stone-500 hover:text-stone-800 transition-colors"
                >
                  Fazer teste relacionado →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
