import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://meqyro.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/pt",
          "/en",
          "/es",
          "/fr",
          "/pt/quizzes/",
          "/en/quizzes/",
          "/es/quizzes/",
          "/fr/quizzes/",
          "/pt/legal/",
          "/en/legal/",
          "/es/legal/",
          "/fr/legal/",
        ],
        disallow: [
          "/*/quizzes/*/play",
          "/*/quizzes/*/result",
          "/*/results",
          "/*/results/",
          "/*/checkout",
          "/*/checkout/",
          "/*/unsubscribe",
          "/*/privacy/data-request",
          "/*/privacy/data-request/confirm",
          "/*/admin",
          "/*/admin/",
          "/admin",
          "/*/couple/",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
