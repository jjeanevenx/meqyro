import { describe, expect, it } from "vitest";
import { reviewedBrainRankPool as brainRankPool } from "@/content/quizzes/brainrank-reviewed";
import { buildHumanReport } from "@/features/results/human-report";
import { reportPdf } from "@/features/results/report-pdf";
import { reportText } from "@/features/results/report-document";
import { pdfText } from "../pdf-text";
import { moneyDnaScenarios } from "@/content/quizzes/moneydna-v2";
import { coupleDnaScenarios } from "@/content/quizzes/coupledna-v2";
import { scoreBehavioralV2, compareBehavioralCouple } from "@/features/scoring/behavioral-v2";
import { buildParticipantCoupleReport } from "@/features/results/behavioral-couple-report";

const locales = ["pt", "en", "es", "fr"] as const;
const numericAnswers: Record<string, number> = {
  BR_PAT_01: 5 * 6,
  BR_PAT_05: 3 + 4 * 4,
  BR_PAT_06: 5 ** 2,
  BR_PAT_07: 27 + 11,
  BR_PAT_08: 40 * 2,
  BR_PAT_09: 6 ** 3,
  BR_PAT_10: 32 + 5 ** 2,
  BR_LOG_08: 25 + 20 - 40,
  BR_NUM_01: 5 * 6 + 5 + 6 + 2,
  BR_NUM_03: 3 ** 2 + 4 ** 2,
  BR_NUM_05: (12 / 4) * 7,
  BR_NUM_06: 240 / 4,
  BR_NUM_07: 360 / (180 / 60 + 180 / 90),
  BR_NUM_08: 200 * 1.2 * 0.8,
  BR_NUM_09: ((70 + 14) / 2) * ((70 - 14) / 2),
  BR_NUM_10: 1 / (1 / 3 + 1 / 6),
  BR_ATT_02: [..."RACIOCINAR COM RIGOR REQUER RECONHECER REGRAS"].filter((c) => c === "R").length,
  BR_ATT_05: [..."TLTF TETLT"].filter((c) => c === "T").length,
  BR_ATT_08: [13, 22, 37, 48, 55, 64, 71, 86, 99].filter((n) => n % 2 === 0).length,
  BR_PRB_03: 2 + 1 + 5,
  BR_PRB_04: [1, 2, 3].find((weighings) => 3 ** weighings >= 9)!,
  BR_PRB_05: 100 - 150 / 3,
  BR_PRB_06: 600 - 420,
  BR_PRB_07: Math.ceil(100 / 18),
  BR_PRB_08: (72 + 20 * 2) / (5 + 2),
  BR_PRB_09: (5 * 4) / 2,
  BR_PRB_10: (24 / 3) * 2,
  BR_SPD_02: 15 * 4 - 12 * 3 + 7,
  BR_SPD_05: 15 * 6,
  BR_SPD_06: 47 * 2,
  BR_SPD_07: 250 - 87,
  BR_SPD_09: 18 * 12 - 16,
};
const normalize = (text: string) => text.replace(/\s+/gu, " ").trim();

describe("Final question and report consistency audit", () => {
  it.each(locales)(
    "recalculates numerical answers independently of the stored key in %s",
    (locale) => {
      for (const [key, answer] of Object.entries(numericAnswers)) {
        const question = brainRankPool.find((q) => q.stableKey === key)!;
        const valid = question.options.filter((option) => {
          const match = option.label[locale].match(/\d+(?:[.,]\d+)?/);
          return match && Number(match[0].replace(",", ".")) === answer;
        });
        expect(valid, key).toHaveLength(1);
        expect(valid[0].isCorrect, key).toBe(true);
      }
      const harmonic = brainRankPool.find((q) => q.stableKey === "BR_NUM_04")!;
      expect(harmonic.options.find((o) => o.isCorrect)?.label[locale]).toBe(`1/${2 + 3 * (5 - 2)}`);
      const fractions = brainRankPool.find((q) => q.stableKey === "BR_SPD_08")!;
      const greater = fractions.options.filter((o) => {
        const [a, b] = o.label[locale].split("/").map(Number);
        return a / b > 0.5;
      });
      expect(greater).toHaveLength(1);
      expect(greater[0].isCorrect).toBe(true);
    },
  );

  it.each(locales)(
    "retains every paragraph, accent and action in PDFs for all seven products in %s",
    async (locale) => {
      const cases: [string, string, string[]][] = [
        ["brainrank", "dimensionScores", ["ATTENTION", "SPEED"]],
        ["personality-map", "dimensionScores", ["OPENNESS", "EMOTIONAL_STABILITY"]],
        ["careerfit", "dimensionScores", ["TECHNICAL", "CREATIVE"]],
        ["moneydna", "archetypeScores", ["BUILDER", "GUARDIAN"]],
        ["focusstyle", "styleScores", ["MODULAR_SERIAL", "COLLABORATIVE"]],
        ["decisiondna", "styleDistribution", ["ANALYTICAL", "INTUITIVE"]],
        ["coupledna", "dimensionScores", ["COMMUNICATION", "FINANCES"]],
      ];
      for (const [slug, field, dimensions] of cases) {
        for (const value of [0, 50, 100]) {
          const report = buildHumanReport(
            slug,
            { [field]: Object.fromEntries(dimensions.map((d) => [d, value])) },
            locale,
          );
          expect(report.sections).toHaveLength(dimensions.length);
          report.sections.forEach((s) => expect(s.summary).toContain(`${value}/100`));
          const text = await pdfText(await reportPdf(report, slug));
          expect(text).not.toMatch(/undefined|NaN|\ufffd/);
          expect(text).toContain(normalize(reportText(report)));
        }
      }
    },
  );

  it.each(locales)(
    "includes the uniform-response caution only when the scorer flags it in %s",
    (locale) => {
      const score = { dimensionScores: { OPENNESS: 50 } };
      const ordinary = buildHumanReport("personality-map", score, locale);
      const flagged = buildHumanReport(
        "personality-map",
        { ...score, uniformResponseWarning: true },
        locale,
      );
      expect(flagged.executiveSummary.length).toBeGreaterThan(
        ordinary.executiveSummary.length + 100,
      );
      expect(flagged.sections).toEqual(ordinary.sections);
    },
  );

  it.each(locales)(
    "keeps behavioral evidence and bilateral results identical in PDF in %s",
    async (locale) => {
      for (const [slug, source] of [
        ["moneydna", moneyDnaScenarios],
        ["coupledna", coupleDnaScenarios],
      ] as const) {
        const items = source.map((q) => ({
          id: q.stableKey,
          stableKey: q.stableKey,
          options: q.options.map((o) => ({
            id: o.stableKey,
            stableKey: o.stableKey,
            signals: o.signals,
          })),
        }));
        const score = scoreBehavioralV2(
          slug,
          items,
          source.map((q) => ({ questionId: q.stableKey, optionId: q.options[0].stableKey })),
        );
        const report =
          slug === "coupledna"
            ? buildParticipantCoupleReport(compareBehavioralCouple(score, score), score, locale)
            : buildHumanReport(slug, score, locale);
        const text = await pdfText(await reportPdf(report, slug));
        expect(text).toContain(normalize(reportText(report)));
        expect(text).not.toMatch(/undefined|NaN|\ufffd/);
        expect(score.evidence).toHaveLength(20);
        expect(report.percentileRank).toBeUndefined();
      }
    },
  );
});
