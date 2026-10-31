import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { generateMetadata } from "@/app/[locale]/articles/[slug]/page";
import { getArticles } from "@/content/articles/data";
import { commercialQuizSlugs } from "@/content/commercial-catalog";
import { locales } from "@/lib/i18n/config";

describe("Portuguese blog discovery", () => {
  it("offers seven distinct articles leading to assessments currently sold", () => {
    const articles = getArticles("pt");
    expect(articles).toHaveLength(7);
    expect(new Set(articles.map((article) => article.slug)).size).toBe(7);
    for (const article of articles) {
      expect(commercialQuizSlugs).toContain(article.relatedQuizSlug);
    }
  });

  it("includes every article in the sitemap with only real language variants", () => {
    const entries = sitemap();
    for (const locale of locales) {
      for (const article of getArticles(locale)) {
        const path = `/${locale}/articles/${article.slug}`;
        const entry = entries.find((item) => new URL(item.url).pathname === path);
        expect(entry, path).toBeDefined();
        expect(entry?.lastModified).toEqual(new Date(article.modifiedAt ?? article.publishedAt));
        for (const url of Object.values(entry?.alternates?.languages ?? {})) {
          if (!url) throw new Error(`Missing alternate URL for ${path}`);
          const [, language, , slug] = new URL(url).pathname.split("/");
          expect(locales).toContain(language);
          expect(
            getArticles(language as (typeof locales)[number]).some((item) => item.slug === slug),
          ).toBe(true);
        }
      }
    }
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length);
  });

  it("does not advertise untranslated pages in article metadata", async () => {
    const slug = "perfil-financeiro-comportamental";
    const metadata = await generateMetadata({ params: Promise.resolve({ locale: "pt", slug }) });
    const languages = metadata.alternates?.languages;
    expect(Object.keys(languages ?? {}).sort()).toEqual(["pt", "x-default"]);
    expect(languages?.pt).toBe(metadata.alternates?.canonical);
    expect(metadata.openGraph).toMatchObject({ type: "article" });
    expect(await generateMetadata({ params: Promise.resolve({ locale: "en", slug }) })).toEqual({});
  });
});
