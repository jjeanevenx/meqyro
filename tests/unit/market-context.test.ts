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
  it.each(["pt", "en", "es", "fr"] as const)("defaults %s to US without geography", (locale) => {
    expect(resolveMarketContext({ locale })).toMatchObject({
      market: "US",
      currency: "USD",
      source: "default",
    });
  });
  it("respects foreign geolocation on Portuguese pages", () => {
    expect(resolveMarketContext({ locale: "pt", country: "US" })).toMatchObject({
      market: "US",
      currency: "USD",
      source: "edge",
    });
    expect(resolveMarketContext({ locale: "pt", country: "PT" }).market).toBe("EU");
  });
  it("honors an explicit US market preference on Portuguese pages", () => {
    expect(resolveMarketContext({ locale: "pt", market: "US" })).toMatchObject({
      market: "US",
      currency: "USD",
      source: "user",
    });
  });
});
