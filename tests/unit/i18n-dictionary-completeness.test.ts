import { describe, it, expect } from "vitest";
import { dictionaries, getDictionary } from "@/lib/i18n/dictionaries";
import { locales } from "@/lib/i18n/config";

describe("i18n Dictionary Completeness & Consistency (Unit Tests)", () => {
  const requiredQuizzes = [
    "brainrank",
    "personality-map",
    "careerfit",
    "moneydna",
    "focusstyle",
    "decisiondna",
    "coupledna",
  ];

  it("defines complete dictionary configurations for all 4 supported locales", () => {
    expect(locales).toEqual(["pt", "en", "es", "fr"]);
    for (const locale of locales) {
      const dict = getDictionary(locale);
      expect(dict).toBeDefined();
      expect(dict.nav).toBeDefined();
      expect(dict.hero).toBeDefined();
      expect(dict.common).toBeDefined();
      expect(dict.quizRunner).toBeDefined();
      expect(dict.leadCapture).toBeDefined();
      expect(dict.resultView).toBeDefined();
      expect(dict.checkout).toBeDefined();
      expect(dict.privacy).toBeDefined();
      expect(dict.quizzes).toBeDefined();
      expect(dict.brainrank).toBeDefined();
      expect(dict.dimensions).toHaveLength(6);
    }
  });

  it("ensures all 7 quizzes exist with localized metadata in every locale", () => {
    for (const locale of locales) {
      const dict = dictionaries[locale];
      for (const slug of requiredQuizzes) {
        const quizMeta = dict.quizzes[slug];
        expect(quizMeta, `Quiz '${slug}' missing in locale '${locale}'`).toBeDefined();
        expect(quizMeta.name.trim().length).toBeGreaterThan(0);
        expect(quizMeta.category.trim().length).toBeGreaterThan(0);
        expect(quizMeta.tagline.trim().length).toBeGreaterThan(0);
        expect(quizMeta.duration.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("verifies structural consistency and non-empty strings between pt reference and all locales", () => {
    for (const locale of locales) {
      const target = dictionaries[locale];

      // Common actions
      expect(target.common.back.length).toBeGreaterThan(0);
      expect(target.common.continue.length).toBeGreaterThan(0);
      expect(target.common.start.length).toBeGreaterThan(0);
      expect(target.common.finish.length).toBeGreaterThan(0);

      // Quiz runner
      expect(target.quizRunner.questionProgress).toContain("{current}");
      expect(target.quizRunner.questionProgress).toContain("{total}");
      expect(target.quizRunner.finishQuiz.length).toBeGreaterThan(0);
      expect(target.quizRunner.sessionExpired.length).toBeGreaterThan(0);

      // Lead capture & consent
      expect(target.leadCapture.title.length).toBeGreaterThan(0);
      expect(target.leadCapture.emailPlaceholder).toContain("@");
      expect(target.leadCapture.transactionalConsent.length).toBeGreaterThan(0);
      expect(target.leadCapture.promotionalConsent.length).toBeGreaterThan(0);

      // Result view & paywall
      expect(target.resultView.freeTitle.length).toBeGreaterThan(0);
      expect(target.resultView.unlockPremium.length).toBeGreaterThan(0);
      expect(target.resultView.disclaimer.length).toBeGreaterThan(0);

      // Checkout
      expect(target.checkout.title.length).toBeGreaterThan(0);
      expect(target.checkout.summary.length).toBeGreaterThan(0);
      expect(target.checkout.payNow.length).toBeGreaterThan(0);
      expect(target.checkout.successTitle.length).toBeGreaterThan(0);
      expect(target.checkout.pendingTitle.length).toBeGreaterThan(0);
      expect(target.checkout.failedTitle.length).toBeGreaterThan(0);

      // Privacy rights
      expect(target.privacy.dataRequestTitle.length).toBeGreaterThan(0);
      expect(target.privacy.exportOption.length).toBeGreaterThan(0);
      expect(target.privacy.deleteOption.length).toBeGreaterThan(0);
      expect(target.privacy.rectifyOption.length).toBeGreaterThan(0);
      expect(target.privacy.unsubscribeTitle.length).toBeGreaterThan(0);
    }
  });
});
