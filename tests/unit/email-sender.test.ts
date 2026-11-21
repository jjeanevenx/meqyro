import { describe, expect, it } from "vitest";
import { resolveEmailSender } from "@/lib/email/sender";

describe("email sender fallback", () => {
  it.each([undefined, null, {}, "", "de", "pt-BR", "constructor", "__proto__"])(
    "uses the common sender for unsupported locale %s",
    (locale) => {
      const env: Record<string, string> = { EMAIL_FROM: "Meqyro <sender@example.com>" };
      expect(resolveEmailSender(locale, (name) => env[name])).toBe(env.EMAIL_FROM);
    },
  );

  it("uses the common sender when a localized value is blank", () => {
    const env: Record<string, string> = {
      EMAIL_FROM_PT: "  ",
      EMAIL_FROM: "Meqyro <sender@example.com>",
    };
    expect(resolveEmailSender("pt", (name) => env[name])).toBe(env.EMAIL_FROM);
  });

  it("preserves the existing default when no sender is configured", () => {
    expect(resolveEmailSender("en", () => undefined)).toBe("Meqyro <noreply@meqyro.com>");
  });
});
