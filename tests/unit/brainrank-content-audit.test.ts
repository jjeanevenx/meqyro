import { describe, expect, it } from "vitest";
import { brainRankPool } from "@/content/quizzes/brainrank";
import {
  memoryExecutionPlan,
  attachMemoryCues,
  distributeMemoryItems,
} from "@/features/quiz-engine/delayed-memory";
import { getFallbackPublicQuiz } from "@/features/quiz-engine/repository";
import { reportHtml } from "@/features/results/report-document";
import { buildHumanReport } from "@/features/results/human-report";
const locales = ["pt", "en", "es", "fr"] as const;
const question = (key: string) => brainRankPool.find((q) => q.stableKey === key)!;
describe("BrainRank content 1.1 audit", () => {
  it.each(locales)("has complete unique options across the entire pool in %s", (locale) => {
    expect(brainRankPool).toHaveLength(60);
    for (const q of brainRankPool) {
      expect(q.prompt[locale].trim(), q.stableKey).not.toBe("");
      expect(
        q.options.filter((o) => o.isCorrect),
        q.stableKey,
      ).toHaveLength(1);
      expect(new Set(q.options.map((o) => o.label[locale])).size, q.stableKey).toBe(4);
    }
  });
  it.each(locales)("has exactly one true answer in the corrected tasks in %s", (locale) => {
    const checks: [string, (label: string) => boolean][] = [
      ["BR_ATT_09", (label) => [...label].filter((c) => c === "#").length === 4],
      [
        "BR_ATT_10",
        (label) => {
          const [a, b] = label.split(" / ");
          return [...a].reverse().join("") === b;
        },
      ],
      ["BR_SPD_10", (label) => Number(label) % 63 === 0],
      ["BR_SPD_03", (label) => [...label].sort().join("") === [..."ROMA"].sort().join("")],
      [
        "BR_ATT_06",
        (label) =>
          label ===
          { pt: "ELEFANTÍASE", en: "ELEPHANTIASIS", es: "ELEFANTIASIS", fr: "ÉLÉPHANTIASIS" }[
            locale
          ],
      ],
      ["BR_NUM_01", (label) => Number(label) === 5 * 6 + 5 + 6 + 2],
    ];
    for (const [id, check] of checks) {
      const q = question(id);
      const valid = q.options.filter((o) => check(o.label[locale]));
      expect(valid, id).toHaveLength(1);
      expect(valid[0].isCorrect, id).toBe(true);
    }
  });
  it.each(locales)(
    "renders reports for all commercial products without certificates in %s",
    (locale) => {
      for (const slug of ["brainrank", "moneydna", "coupledna"]) {
        const html = reportHtml(
          buildHumanReport(slug, { dimensionScores: { ATTENTION: 50 } }, locale),
          slug,
          locale,
        );
        expect(html).not.toMatch(/certific/i);
      }
    },
  );
  it("keeps seven first intervening answers and four final intervening answers", () => {
    expect(memoryExecutionPlan(24)).toEqual([
      { cuePosition: 1, recallPosition: 8, interveningQuestions: 7 },
      { cuePosition: 13, recallPosition: 18, interveningQuestions: 5 },
      { cuePosition: 20, recallPosition: 24, interveningQuestions: 4 },
    ]);
    expect(memoryExecutionPlan(25)[2]).toEqual({
      cuePosition: 21,
      recallPosition: 25,
      interveningQuestions: 4,
    });
    expect(memoryExecutionPlan(24, 3)[1].interveningQuestions).toBe(3);
    expect(() => memoryExecutionPlan(24, 1)).toThrow();
  });
  it("retains persisted legacy attempt boundaries on resume", () => {
    const qs = getFallbackPublicQuiz("brainrank", "pt")!.questions;
    const core = qs.filter((q) => !q.memoryRecall);
    const padded = [...core, ...core.slice(0, 3)];
    const old = attachMemoryCues(
      distributeMemoryItems(
        padded,
        qs.filter((q) => q.memoryRecall),
        "legacy",
      ),
    );
    expect(old.flatMap((q, i) => (q.memoryCue ? [i + 1] : []))).toEqual([1, 9, 17]);
    expect(old.flatMap((q, i) => (q.memoryRecall ? [i + 1] : []))).toEqual([8, 16, 24]);
  });
});
