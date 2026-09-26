import type { Market } from "./market-context";

const brainRankPrices: Record<Market, number> = { BR: 1290, US: 299, EU: 299, GB: 249 };

export function brainRankPrice(market: Market): number {
  return brainRankPrices[market];
}

export const BUNDLE_PRICES: Record<string, Record<Market, number>> = {
  BUNDLE_DISCOVER: { BR: 1990, US: 499, EU: 499, GB: 399 },
  BUNDLE_LIFE: { BR: 1990, US: 499, EU: 499, GB: 399 },
  BUNDLE_ALL_ACCESS: { BR: 3990, US: 999, EU: 999, GB: 799 },
};

export const BUNDLE_ITEMS: Record<string, string[]> = {
  BUNDLE_DISCOVER: ["BRAINRANK", "PERSONALITY_MAP", "DECISIONDNA"],
  BUNDLE_LIFE: ["CAREERFIT", "MONEYDNA", "FOCUSSTYLE"],
  BUNDLE_ALL_ACCESS: [
    "BRAINRANK",
    "PERSONALITY_MAP",
    "DECISIONDNA",
    "CAREERFIT",
    "MONEYDNA",
    "FOCUSSTYLE",
    "COUPLEDNA",
  ],
};

export function normalizeBundleCode(code: string): string {
  const upper = code
    .toUpperCase()
    .replace(/^PROD_/, "")
    .replace(/-/g, "_");
  if (upper === "BUNDLE_ALL_REPORTS" || upper === "PREMIUM_BUNDLE" || upper === "BUNDLE_ALL") {
    return "BUNDLE_ALL_ACCESS";
  }
  return upper;
}

export function isBundleProduct(code: string): boolean {
  const norm = normalizeBundleCode(code);
  return norm in BUNDLE_PRICES;
}

export function getBundlePrice(productCode: string, market: Market): number | null {
  const norm = normalizeBundleCode(productCode);
  return BUNDLE_PRICES[norm]?.[market] ?? null;
}

export function expandProductCodes(productCodes: string[]): string[] {
  const result: string[] = [];
  for (const rawCode of productCodes) {
    const norm = normalizeBundleCode(rawCode);
    if (norm in BUNDLE_ITEMS) {
      result.push(...BUNDLE_ITEMS[norm]);
    } else {
      result.push(rawCode.toUpperCase().replace(/^PROD_/, ""));
    }
  }
  return Array.from(new Set(result));
}

export function formatMoney(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount / 100);
}
