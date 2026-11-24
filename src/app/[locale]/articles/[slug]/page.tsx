import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { isLocale, locales } from "@/lib/i18n/config";
import { getArticles, getArticleLanguages } from "@/content/articles/data";
import { BLOG_LABELS } from "@/content/articles/labels";
import { buildPageMetadata } from "@/features/seo/metadata-builder";
import { ButtonLink } from "@/components/ui/button-link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://meqyro.com";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getArticles(locale).map((article) => ({ locale, slug: article.slug })),
  );
}

type ArticleDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const article = getArticles(locale).find((item) => item.slug === slug);
  if (!article) return {};
  const path = `/articles/${slug}`;
  const metadata = buildPageMetadata({
    locale,
    path,
    title: article.title,
    description: article.excerpt,
  });
  const availableLanguages = getArticleLanguages(slug);
  const defaultLanguage = availableLanguages.includes("en") ? "en" : availableLanguages[0];
  return {
    ...metadata,
    alternates: {
      canonical: `${SITE_URL}/${locale}${path}`,
      languages: Object.fromEntries([
        ...availableLanguages.map((language) => [language, `${SITE_URL}/${language}${path}`]),
        ["x-default", `${SITE_URL}/${defaultLanguage}${path}`],
      ]),
    },
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.modifiedAt ?? article.publishedAt,
      authors: [`${SITE_URL}/${locale}/articles`],
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const articles = getArticles(locale);
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  const copy = BLOG_LABELS[locale];
  const url = `${SITE_URL}/${locale}/articles/${slug}`;
  const related = articles
    .filter((item) => item.slug !== slug)
    .sort(
      (a, b) =>
        Number(b.relatedQuizSlug === article.relatedQuizSlug) -
        Number(a.relatedQuizSlug === article.relatedQuizSlug),
    )
    .slice(0, 3);
  const modifiedAt = article.modifiedAt ?? article.publishedAt;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        headline: article.title,
        description: article.excerpt,
        datePublished: article.publishedAt,
        dateModified: modifiedAt,
        inLanguage: locale === "pt" ? "pt-BR" : locale,
        author: {
          "@type": "Organization",
          name: copy.author,
          url: `${SITE_URL}/${locale}/articles`,
        },
        publisher: { "@type": "Organization", name: "Meqyro", url: SITE_URL },
        isAccessibleForFree: true,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Meqyro", item: `${SITE_URL}/${locale}` },
          {
            "@type": "ListItem",
            position: 2,
            name: copy.title,
            item: `${SITE_URL}/${locale}/articles`,
          },
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
    ],
  };

  return (
    <main className="blog blog--detail">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Link href={`/${locale}/articles`} className="blog__back">
        <ArrowLeft size={16} aria-hidden="true" />
        {copy.back}
      </Link>
      <article>
        <header className="blog__header">
          <Link className="blog__brand" href={`/${locale}`}>
            Meqyro Insights
          </Link>
          <h1>{article.title}</h1>
          <p className="blog__subtitle">{article.subtitle}</p>
          <p className="blog__meta">
            <Clock size={15} aria-hidden="true" />
            {article.readingTimeMinutes} {copy.minRead}
            <span aria-hidden="true">·</span>
            {copy.author}
          </p>
          <p className="blog__meta">
            {copy.updated}{" "}
            <time dateTime={modifiedAt}>
              {new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(
                new Date(modifiedAt),
              )}
            </time>
          </p>
        </header>
        <nav className="blog__contents" aria-label={copy.contents}>
          <h2>{copy.contents}</h2>
          <ol>
            {article.sections.map((section, index) => (
              <li key={section.heading}>
                <a href={`#section-${index + 1}`}>{section.heading}</a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="blog__body">
          {article.sections.map((section, index) => (
            <section id={`section-${index + 1}`} key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
          <aside className="blog__takeaways" aria-label={copy.takeaways}>
            <h2>{copy.takeaways}</h2>
            <ul>
              {article.keyTakeaways.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </aside>
          {article.sources?.length ? (
            <section className="blog__sources">
              <h2>{copy.sources}</h2>
              <ul>
                {article.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url}>{source.label}</a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
        <section className="blog__cta">
          <h2>{article.cta?.title ?? copy.ctaTitle}</h2>
          <p>{article.cta?.description ?? copy.ctaDescription}</p>
          <ButtonLink href={`/${locale}/quizzes/${article.relatedQuizSlug}`}>
            {article.cta?.label ?? copy.test}
          </ButtonLink>
        </section>
      </article>
      <nav className="blog__related" aria-label={copy.related}>
        <h2>{copy.related}</h2>
        <ul>
          {related.map((item) => (
            <li key={item.slug}>
              <Link href={`/${locale}/articles/${item.slug}`}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
