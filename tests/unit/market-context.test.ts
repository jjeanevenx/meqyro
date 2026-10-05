import { describe, expect, it } from "vitest";
import { resolveMarketContext } from "@/lib/market/market-context";

describe("resolveMarketContext", () => {
  it("routes Brazil to BRL and Stripe", () => {
    expect(resolveMarketContext({ locale: "pt", country: "BR" })).toMatchObject({
      market: "BR",
      currency: "BRL",
      paymentProvider: "stripe",
    });
  });
  it("keeps language independent from an explicit market", () => {
    expect(
      resolveMarketContext({ locale: "fr", country: "FR", market: "US", source: "user" }),
    ).toMatchObject({ locale: "fr", market: "US", currency: "USD", source: "user" });
  });
  it("maps a supported EU country to the EU market", () => {
    expect(resolveMarketContext({ locale: "es", country: "ES" }).market).toBe("EU");
  });
  it("uses BRL for Portuguese when edge geolocation is unavailable", () => {
    expect(resolveMarketContext({ locale: "pt" })).toMatchObject({
      market: "BR",
      currency: "BRL",
      source: "locale-fallback",
    });
  });
  it("keeps the Portuguese storefront in BRL despite foreign geolocation", () => {
    expect(resolveMarketContext({ locale: "pt", country: "US" })).toMatchObject({
      market: "BR",
      currency: "BRL",
      source: "locale-fallback",
    });
    expect(resolveMarketContext({ locale: "fr" }).market).toBe("EU");
  });
  it("ignores a stale US market preference on Portuguese pages", () => {
    expect(resolveMarketContext({ locale: "pt", market: "US" })).toMatchObject({
      market: "BR",
      currency: "BRL",
    });
  });
});
