import { describe, expect, it } from "vitest";
import { experiences } from "@/content/experiences";
import { brainRankQuestions } from "@/content/quizzes/brainrank";
import { personalityMapQuestions } from "@/content/quizzes/personality-map";
import { careerFitQuestions } from "@/content/quizzes/careerfit";
import { moneyDnaQuestions } from "@/content/quizzes/moneydna";
import { focusStyleQuestions } from "@/content/quizzes/focusstyle";
import { decisionDnaScenarios } from "@/content/quizzes/decisiondna";
import { coupleDnaQuestions } from "@/content/quizzes/coupledna";
import { locales, type Locale } from "@/lib/i18n/config";

/**
 * Map of quiz slug to its actual content array and expected question count.
 */
const quizContentMap: Record<
  string,
  { content: readonly { stableKey: string; prompt: Record<Locale, string> }[]; expectedCount: number }
> = {
  brainrank: { content: brainRankQuestions as never[], expectedCount: 24 },
  "personality-map": { content: personalityMapQuestions as never[], expectedCount: 40 },
  careerfit: { content: careerFitQuestions as never[], expectedCount: 24 },
  moneydna: { content: moneyDnaQuestions as never[], expectedCount: 20 },
  coupledna: { content: coupleDnaQuestions as never[], expectedCount: 20 },
  decisiondna: { content: decisionDnaScenarios as never[], expectedCount: 4 },
  focusstyle: { content: focusStyleQuestions as never[], expectedCount: 20 },
};

describe("Content integrity — experiences.ts must match actual quiz content", () => {
  it("all 7 experiences exist in catalog", () => {
    expect(experiences).toHaveLength(7);
    const slugs = experiences.map((e) => e.slug);
    expect(slugs).toContain("brainrank");
    expect(slugs).toContain("personality-map");
    expect(slugs).toContain("careerfit");
    expect(slugs).toContain("moneydna");
    expect(slugs).toContain("coupledna");
    expect(slugs).toContain("decisiondna");
    expect(slugs).toContain("focusstyle");
  });

  it("no duplicate experience slugs", () => {
    const slugs = experiences.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  for (const exp of experiences) {
    it(`${exp.brand}: displayed item count matches actual content count`, () => {
      const quizData = quizContentMap[exp.slug];
      expect(quizData).toBeDefined();
      expect(quizData.content).toHaveLength(quizData.expectedCount);

      // Parse the displayed item count from the "items" field (e.g., "24 desafios" -> 24)
      for (const locale of locales) {
        const displayedText = exp.items[locale];
        const displayedCount = parseInt(displayedText, 10);
        expect(displayedCount).toBe(quizData.expectedCount);
      }
    });
  }
});

describe("Content integrity — stableKeys must be unique", () => {
  for (const [slug, { content }] of Object.entries(quizContentMap)) {
    it(`${slug}: no duplicate stableKeys`, () => {
      const keys = content.map((q: { stableKey: string }) => q.stableKey);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(keys.length);
    });
  }
});

describe("Content integrity — all questions have PT/EN/ES/FR translations", () => {
  for (const [slug, { content }] of Object.entries(quizContentMap)) {
    it(`${slug}: every question has prompt in all 4 locales`, () => {
      for (const q of content) {
        const typed = q as { stableKey: string; prompt: Record<string, string> };
        for (const locale of locales) {
          expect(
            typeof typed.prompt[locale] === "string" && typed.prompt[locale].length > 0,
            `Missing ${locale} prompt for ${typed.stableKey}`,
          ).toBe(true);
        }
      }
    });
  }
});

describe("Content integrity — no encoding corruption in content strings", () => {
  const corruptionPatterns = [/\?\?/, /\uFFFD/, /Ã[àáâãèéêìíòóõùúçÃ]/];

  for (const [slug, { content }] of Object.entries(quizContentMap)) {
    it(`${slug}: no corrupted characters in prompts`, () => {
      for (const q of content) {
        const typed = q as { stableKey: string; prompt: Record<string, string> };
        for (const locale of locales) {
          const text = typed.prompt[locale];
          for (const pattern of corruptionPatterns) {
            expect(
              pattern.test(text),
              `Encoding corruption in ${typed.stableKey} [${locale}]: "${text}"`,
            ).toBe(false);
          }
        }
      }
    });
  }
});
