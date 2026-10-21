import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { LocaleMarketSelector } from "@/components/patterns/locale-market-selector";
import { SiteNavigation } from "@/components/patterns/site-navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";

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
  const { nav } = getDictionary(locale);
  return (
    <header className="site-header">
      <Link className="brand" href={`/${locale}`} aria-label={nav.home}>
        MEQ<span>Y</span>RO
      </Link>
      <SiteNavigation
        locale={locale}
        discoverLabel={discoverLabel}
        howLabel={howLabel}
        current={current}
        menuLabel={nav.menu}
        primaryLabel={nav.primary}
      />
      <LocaleMarketSelector locale={locale} languageLabel={languageLabel} />
    </header>
  );
}
