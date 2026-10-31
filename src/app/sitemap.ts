import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { commercialQuizSlugs } from "@/content/commercial-catalog";
import { getArticles, getArticleLanguages } from "@/content/articles/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://meqyro.com";

  const publicPaths = [
    "",
    "/discover",
    ...commercialQuizSlugs.map((slug) => `/quizzes/${slug}`),
    "/articles",
    "/contact",
    "/cookies",
    "/legal/privacy",
    "/legal/terms",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const path of publicPaths) {
    for (const locale of locales) {
      const url = `${baseUrl}/${locale}${path}`;
      const languageAlternates: Record<string, string> = {};
      for (const loc of locales) {
        languageAlternates[loc] = `${baseUrl}/${loc}${path}`;
      }
      languageAlternates["x-default"] = `${baseUrl}/en${path}`;

      entries.push({
        url,
        lastModified: new Date("2026-09-26T00:00:00.000Z"),
        changeFrequency: path === "" ? "daily" : path.startsWith("/quizzes") ? "weekly" : "monthly",
        priority: path === "" ? 1.0 : path.startsWith("/quizzes") ? 0.8 : 0.5,
        alternates: {
          languages: languageAlternates,
        },
      });
    }
  }

  for (const locale of locales) {
    for (const article of getArticles(locale)) {
      const path = `/articles/${article.slug}`;
      const availableLanguages = getArticleLanguages(article.slug);
      const defaultLanguage = availableLanguages.includes("en") ? "en" : availableLanguages[0];
      entries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(article.modifiedAt ?? article.publishedAt),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries([
            ...availableLanguages.map((language) => [language, `${baseUrl}/${language}${path}`]),
            ["x-default", `${baseUrl}/${defaultLanguage}${path}`],
          ]),
        },
      });
    }
  }

  return entries;
}
