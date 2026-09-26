import type { Metadata } from "next";
import { type Locale, locales } from "@/lib/i18n/config";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://meqyro.com";

export interface BuildMetadataInput {
  locale: Locale;
  path: string; // e.g. "/quizzes/brainrank" or ""
  title: string;
  description: string;
  isPrivate?: boolean;
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  isPrivate = false,
}: BuildMetadataInput): Metadata {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}/${locale}${cleanPath === "/" ? "" : cleanPath}`;

  const languageAlternates: Record<string, string> = {};
  for (const loc of locales) {
    languageAlternates[loc] = `${SITE_URL}/${loc}${cleanPath === "/" ? "" : cleanPath}`;
  }
  // x-default points to the international standard (en)
  languageAlternates["x-default"] = `${SITE_URL}/en${cleanPath === "/" ? "" : cleanPath}`;

  if (isPrivate) {
    return {
      title,
      description,
      robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
        },
      },
    };
  }

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Meqyro",
      locale: locale === "pt" ? "pt_BR" : locale === "en" ? "en_US" : locale === "es" ? "es_ES" : "fr_FR",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og-default.png`,
          width: 1200,
          height: 630,
          alt: "Meqyro — Avaliações e Insights Editoriais",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-default.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
      },
    },
  };
}
