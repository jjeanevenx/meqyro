import type { Locale } from "@/lib/i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://meqyro.com";

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Meqyro",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    sameAs: [],
  };
}

export function generateQuizJsonLd({
  name,
  description,
  quizSlug,
  locale,
}: {
  name: string;
  description: string;
  quizSlug: string;
  locale: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name,
    description,
    url: `${SITE_URL}/${locale}/quizzes/${quizSlug}`,
    inLanguage: locale,
    provider: {
      "@type": "Organization",
      name: "Meqyro",
      url: SITE_URL,
    },
    educationalUse: "Self-Assessment",
    typicalAgeRange: "18+",
    isAccessibleForFree: true,
  };
}
