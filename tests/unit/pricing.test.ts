import { describe, expect, it } from "vitest";
import { brainRankPrice, formatMoney } from "@/lib/market/prices";

describe("pricing", () => {
  it("stores minor units", () => {
    expect(brainRankPrice("BR")).toBe(1290);
    expect(brainRankPrice("US")).toBe(299);
  });
  it("formats editorial prices", () => {
    expect(formatMoney(1290, "BRL", "pt-BR")).toContain("12,90");
  });
});
