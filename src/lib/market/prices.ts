import type { Market } from "./market-context";

const brainRankPrices: Record<Market, number> = { BR: 1290, US: 299, EU: 299, GB: 249 };

export function brainRankPrice(market: Market): number {
  return brainRankPrices[market];
}

export function formatMoney(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount / 100);
}
