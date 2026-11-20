const senderKeys = {
  pt: "EMAIL_FROM_PT",
  en: "EMAIL_FROM_EN",
  es: "EMAIL_FROM_ES",
  fr: "EMAIL_FROM_FR",
} as const;

// Shared by the Next.js server and the Deno delivery function.
export function resolveEmailSender(
  locale: unknown,
  readEnv: (name: string) => string | undefined,
): string {
  const key =
    typeof locale === "string" && Object.hasOwn(senderKeys, locale)
      ? senderKeys[locale as keyof typeof senderKeys]
      : undefined;
  return (
    (key ? readEnv(key)?.trim() : undefined) ||
    readEnv("EMAIL_FROM")?.trim() ||
    "Meqyro <noreply@meqyro.com>"
  );
}
