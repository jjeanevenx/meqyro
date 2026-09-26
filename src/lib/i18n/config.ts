export const locales = ["pt", "en", "es", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localeFromAcceptLanguage(value: string | null): Locale {
  if (!value) return defaultLocale;
  const requested = value
    .split(",")
    .map((entry) => entry.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean);

  for (const language of requested) {
    const base = language?.split("-")[0];
    if (base && isLocale(base)) return base;
  }
  return defaultLocale;
}
