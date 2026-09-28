import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { LocaleMarketSelector } from "@/components/patterns/locale-market-selector";

export function SiteHeader({
  locale,
  languageLabel,
  discoverLabel,
  howLabel,
  current,
}: {
  locale: Locale;
  languageLabel: string;
  discoverLabel: string;
  howLabel?: string;
  current?: "home" | "discover";
}) {
  return (
    <header className="site-header">
      <Link className="brand" href={`/${locale}`} aria-label="Meqyro home">
        MEQ<span>Y</span>RO
      </Link>
      <nav aria-label="Primary">
        <Link
          href={`/${locale}/discover`}
          aria-current={current === "discover" ? "page" : undefined}
        >
          {discoverLabel}
        </Link>
        {howLabel ? <Link href={`/${locale}#how-it-works`}>{howLabel}</Link> : null}
      </nav>
      <LocaleMarketSelector locale={locale} languageLabel={languageLabel} />
    </header>
  );
}
