import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://meqyro.com";

  const publicPaths = [
    "",
    "/discover",
    "/quizzes/brainrank",
    "/quizzes/personality-map",
    "/quizzes/careerfit",
    "/quizzes/moneydna",
    "/quizzes/focusstyle",
    "/quizzes/decisiondna",
    "/quizzes/coupledna",
    "/articles",
    "/articles/how-logical-reasoning-works",
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

  return entries;
}
