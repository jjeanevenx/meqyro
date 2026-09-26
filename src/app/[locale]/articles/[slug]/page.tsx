import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Sparkles, CheckCircle2 } from "lucide-react";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { ARTICLES } from "@/content/articles/data";
import { buildPageMetadata } from "@/features/seo/metadata-builder";
import { ButtonLink } from "@/components/ui/button-link";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    ARTICLES.map((article) => ({
      locale,
      slug: article.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};

  return buildPageMetadata({
    locale,
    path: `/articles/${slug}`,
    title: `${article.title[locale as Locale]} | Meqyro`,
    description: article.excerpt[locale as Locale],
  });
}

type ArticleDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title[locale as Locale],
    description: article.excerpt[locale as Locale],
    datePublished: article.publishedAt,
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: "Meqyro",
      url: "https://meqyro.com",
    },
  };

  return (
    <main className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <Link
            href={`/${locale}/articles`}
            className="text-xs text-stone-500 hover:text-stone-900 inline-flex items-center gap-1 mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Voltar aos artigos
          </Link>
          <div className="flex items-center gap-3 text-xs text-stone-500 mb-2">
            <span className="inline-flex items-center gap-1">
              <Clock size={13} /> {article.readingTimeMinutes} min de leitura
            </span>
            <span>•</span>
            <span className="uppercase tracking-wider font-semibold text-[11px] text-stone-600">
              {article.relatedQuizSlug.replace(/-/g, " ")}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 leading-tight">
            {article.title[locale as Locale]}
          </h1>
          <p className="text-base text-stone-600 mt-3 leading-relaxed">
            {article.subtitle[locale as Locale]}
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8 text-stone-800 leading-relaxed text-sm">
          <p className="text-base text-stone-700 font-serif italic border-l-2 border-stone-300 pl-4 py-1">
            {article.excerpt[locale as Locale]}
          </p>

          {article.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="text-lg font-serif font-bold text-stone-900">
                {section.heading[locale as Locale]}
              </h2>
              {section.paragraphs[locale as Locale].map((para, pIdx) => (
                <p key={pIdx} className="text-stone-700 leading-relaxed">
                  {para}
                </p>
              ))}
            </section>
          ))}

          {/* Key Takeaways */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-600" />
              Pontos Principais para Lembrar
            </h3>
            <ul className="space-y-2 text-xs text-stone-700">
              {article.keyTakeaways[locale as Locale].map((point, kIdx) => (
                <li key={kIdx} className="flex items-start gap-2">
                  <span className="text-stone-400 font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Call to Action for Related Quiz */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-6 text-center space-y-4 shadow-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
            <Sparkles size={14} /> Experimente na Prática
          </div>
          <h2 className="text-lg font-serif font-bold text-stone-900">
            Descubra seu perfil no desafio oficial {article.relatedQuizSlug.replace(/-/g, " ").toUpperCase()}
          </h2>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Avaliação rápida, confidencial e com resultado gratuito instantâneo.
          </p>
          <div className="pt-2">
            <ButtonLink
              href={`/${locale}/quizzes/${article.relatedQuizSlug}`}
              variant="primary"
            >
              Começar teste agora
            </ButtonLink>
          </div>
        </div>
      </div>
    </main>
  );
}
