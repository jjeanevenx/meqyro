import type { Locale } from "@/lib/i18n/config";

export const markets = ["BR", "US", "EU", "GB"] as const;
export type Market = (typeof markets)[number];
export type PaymentProvider = "infinitepay" | "stripe";
export type MarketSource = "user" | "edge" | "locale-fallback";

export type MarketContext = {
  locale: Locale;
  country: string;
  market: Market;
  currency: "BRL" | "USD" | "EUR" | "GBP";
  paymentProvider: PaymentProvider;
  source: MarketSource;
};

const marketDefinitions: Record<Market, Omit<MarketContext, "locale" | "country" | "source">> = {
  BR: { market: "BR", currency: "BRL", paymentProvider: "infinitepay" },
  US: { market: "US", currency: "USD", paymentProvider: "stripe" },
  EU: { market: "EU", currency: "EUR", paymentProvider: "stripe" },
  GB: { market: "GB", currency: "GBP", paymentProvider: "stripe" },
};

const euCountries = new Set(["AT", "BE", "DE", "ES", "FR", "IE", "IT", "NL", "PT"]);

export function isMarket(value: string | undefined): value is Market {
  return markets.includes(value as Market);
}

export function marketForCountry(country: string): Market {
  const normalized = country.toUpperCase();
  if (normalized === "BR") return "BR";
  if (normalized === "GB") return "GB";
  if (euCountries.has(normalized)) return "EU";
  return "US";
}

export function resolveMarketContext(input: {
  locale: Locale;
  country?: string;
  market?: string;
  source?: MarketSource;
}): MarketContext {
  // Se o usuário definiu explicitamente um market via cookie, usar esse
  if (input.market && isMarket(input.market)) {
    const country = input.country?.toUpperCase() ?? input.market;
    return {
      locale: input.locale,
      country,
      source: "user",
      ...marketDefinitions[input.market],
    };
  }

  // Se há um país fornecido (via geolocation/edge), mapear para mercado
  if (input.country) {
    const country = input.country.toUpperCase();
    const market = marketForCountry(country);
    return {
      locale: input.locale,
      country,
      source: input.source ?? "edge",
      ...marketDefinitions[market],
    };
  }

  // Sem informação de país: padrão para US (mercado principal)
  // NÃO usar locale como fallback para country - locale controla apenas idioma
  const market = "US";
  return {
    locale: input.locale,
    country: "US",
    source: "locale-fallback",
    ...marketDefinitions[market],
  };
}
