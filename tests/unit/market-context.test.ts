import { describe, expect, it } from "vitest";
import { resolveMarketContext } from "@/lib/market/market-context";

describe("resolveMarketContext", () => {
  it("routes Brazil to BRL and InfinitePay", () => {
    expect(resolveMarketContext({ locale: "pt", country: "BR" })).toMatchObject({
      market: "BR",
      currency: "BRL",
      paymentProvider: "infinitepay",
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
});
