export const currencies = ["BRL", "USD", "EUR", "GBP"] as const;
export type Currency = (typeof currencies)[number];

export type Money = Readonly<{
  amount: number;
  currency: Currency;
}>;

export function money(amount: number, currency: Currency): Money {
  if (!Number.isSafeInteger(amount) || amount < 0) {
    throw new Error("Money amount must be a non-negative integer in minor units.");
  }
  return Object.freeze({ amount, currency });
}
