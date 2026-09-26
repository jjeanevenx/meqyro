import { describe, expect, it } from "vitest";
import { localeFromAcceptLanguage } from "@/lib/i18n/config";

describe("localeFromAcceptLanguage", () => {
  it("uses the first supported language", () => {
    expect(localeFromAcceptLanguage("de-DE,de;q=0.9,fr-FR;q=0.8,en;q=0.7")).toBe("fr");
  });
  it("falls back to English", () => {
    expect(localeFromAcceptLanguage("ja-JP")).toBe("en");
  });
  it("supports regional Portuguese", () => {
    expect(localeFromAcceptLanguage("pt-BR,pt;q=0.9")).toBe("pt");
  });
});
