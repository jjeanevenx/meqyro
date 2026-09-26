"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import type { Market } from "@/lib/market/market-context";

const localeLabels: Record<Locale, string> = { pt: "PT", en: "EN", es: "ES", fr: "FR" };

export function LocaleMarketSelector({
  locale,
  market,
  languageLabel,
  marketLabel,
}: {
  locale: Locale;
  market: Market;
  languageLabel: string;
  marketLabel: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  function changeLocale(next: string) {
    const parts = pathname.split("/");
    parts[1] = next;
    document.cookie = `meqyro_locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    router.push(parts.join("/") || `/${next}`);
  }
  function changeMarket(next: string) {
    document.cookie = `meqyro_market=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    router.refresh();
  }
  return (
    <div className="selectors" aria-label={`${languageLabel}, ${marketLabel}`}>
      <label>
        <span className="sr-only">{languageLabel}</span>
        <select value={locale} onChange={(event) => changeLocale(event.target.value)}>
          {Object.entries(localeLabels).map(([value, label]) => (
            <option value={value} key={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <span aria-hidden="true">·</span>
      <label>
        <span className="sr-only">{marketLabel}</span>
        <select value={market} onChange={(event) => changeMarket(event.target.value)}>
          <option value="BR">BR</option>
          <option value="US">US</option>
          <option value="EU">EU</option>
          <option value="GB">GB</option>
        </select>
      </label>
    </div>
  );
}
