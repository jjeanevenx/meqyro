import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { isLocale, locales } from "@/lib/i18n/config";
import { getArticles } from "@/content/articles/data";
import { BLOG_LABELS } from "@/content/articles/labels";
import { buildPageMetadata } from "@/features/seo/metadata-builder";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type ArticlesPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: ArticlesPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = BLOG_LABELS[locale];
  return buildPageMetadata({
    locale,
    path: "/articles",
    title: copy.title,
    description: copy.description,
  });
}

export default async function ArticlesIndexPage({ params }: ArticlesPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = BLOG_LABELS[locale];
  return (
    <main className="blog">
      <header className="blog__header">
        <Link href={`/${locale}`} className="blog__brand">
          Meqyro Insights
        </Link>
        <h1>{copy.title}</h1>
        <p className="blog__subtitle">{copy.subtitle}</p>
      </header>
      <div className="blog__grid">
        {getArticles(locale).map((article) => (
          <article key={article.slug} className="blog__card">
            <p className="blog__meta">
              <Clock size={15} aria-hidden="true" />
              {article.readingTimeMinutes} {copy.minRead}
            </p>
            <h2>
              <Link href={`/${locale}/articles/${article.slug}`}>{article.title}</Link>
            </h2>
            <p>{article.excerpt}</p>
            <div className="blog__card-links">
              <Link href={`/${locale}/articles/${article.slug}`}>
                {copy.readMore}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href={`/${locale}/quizzes/${article.relatedQuizSlug}`}>{copy.test}</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
