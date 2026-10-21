import { describe, expect, it } from "vitest";
import { moneyDnaScenarios } from "@/content/quizzes/moneydna-v2";
import { coupleDnaScenarios } from "@/content/quizzes/coupledna-v2";
import { scoreBehavioralV2, compareBehavioralCouple } from "@/features/scoring/behavioral-v2";
import { buildHumanReport } from "@/features/results/human-report";
import { buildParticipantCoupleReport } from "@/features/results/behavioral-couple-report";
import { getFallbackPublicQuiz } from "@/features/quiz-engine/repository";
import {
  selectQuestionsForAttempt,
  isCandidateEligible,
} from "@/features/quiz-engine/selection-engine";
import { getAssessmentSelectionConfig } from "@/features/quiz-engine/selection-config";
import { publishedVersion } from "@/features/quiz-engine/instrument-version";
import { behavioralSeedSql } from "../../scripts/behavioral-seed";
import { reportText, reportHtml } from "@/features/results/report-document";
import type { ScenarioDefinition } from "@/content/quizzes/behavioral-scenario";
import type { ScoringAnswer } from "@/features/quiz-engine/contracts";

function fixture(
  source: readonly ScenarioDefinition[],
  pick: (q: ScenarioDefinition) => number = () => 0,
) {
  const items = source.map((q) => ({
    id: q.stableKey,
    stableKey: q.stableKey,
    options: q.options.map((o) => ({
      id: o.stableKey,
      stableKey: o.stableKey,
      signals: o.signals,
    })),
  }));
  const answers: ScoringAnswer[] = source.map((q) => ({
    questionId: q.stableKey,
    optionId: q.options[pick(q)].stableKey,
  }));
  return { items, answers };
}

describe("Behavioral instruments v2", () => {
  for (const [slug, source] of [
    ["moneydna", moneyDnaScenarios],
    ["coupledna", coupleDnaScenarios],
  ] as const) {
    it(`${slug}: 20 distinct scenarios, four locales, four plausible actions and complete coverage`, () => {
      expect(source).toHaveLength(20);
      expect(new Set(source.map((q) => q.stableKey)).size).toBe(20);
      expect(source.map((q) => q.position)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
      for (const dimension of Object.keys(getAssessmentSelectionConfig(slug).dimensions)) {
        expect(source.filter((q) => q.dimension === dimension)).toHaveLength(4);
      }
      for (const q of source) {
        expect(q.options).toHaveLength(4);
        for (const locale of ["pt", "en", "es", "fr"] as const) {
          expect(q.prompt[locale].length).toBeGreaterThan(50);
          expect(new Set(q.options.map((o) => o.label[locale])).size).toBe(4);
          for (const o of q.options) expect(o.label[locale].length).toBeGreaterThan(12);
        }
      }
    });
    it(`${slug}: stable selection with quotas and increasing complexity`, () => {
      const candidates = source.map((q) => ({
        id: q.stableKey,
        stableKey: q.stableKey,
        kind: "SCENARIO",
        active: true,
        translations: Object.entries(q.prompt).map(([locale, prompt]) => ({ locale, prompt })),
        options: q.options.map((o, index) => ({
          id: o.stableKey,
          stableKey: o.stableKey,
          position: index + 1,
          translations: Object.entries(o.label).map(([locale, label]) => ({ locale, label })),
        })),
        scoringKey: { dimension: q.dimension, difficulty: q.difficulty },
      }));
      const config = {
        ...getAssessmentSelectionConfig(slug),
        orderingStrategy: "SCENARIO_RAMP" as const,
      };
      expect(
        isCandidateEligible({
          ...candidates[0],
          translations: candidates[0].translations.filter((t) => t.locale !== "fr"),
        }),
      ).toBe(false);
      expect(
        isCandidateEligible({
          ...candidates[0],
          options: candidates[0].options.map((o, i) =>
            i ? o : { ...o, translations: o.translations.filter((t) => t.locale !== "es") },
          ),
        }),
      ).toBe(false);
      for (const seed of ["participant-a", "participant-b", "recovery"]) {
        const selected = selectQuestionsForAttempt(candidates, config, seed);
        expect(selected).toEqual(selectQuestionsForAttempt(candidates, config, seed));
        expect(selected).toHaveLength(20);
        expect(selected.slice(0, 5).every((q) => q.difficulty === "EASY")).toBe(true);
        expect(selected.slice(5, 10).every((q) => q.difficulty === "MEDIUM")).toBe(true);
        expect(selected.slice(10).every((q) => q.difficulty === "HARD")).toBe(true);
      }
    });
    it(`${slug}: sanitizes fallback content and produces localized evidence-backed premium reports`, () => {
      const { items, answers } = fixture(source);
      const score = scoreBehavioralV2(slug, items, answers);
      expect(scoreBehavioralV2(slug, [...items].reverse(), [...answers].reverse())).toEqual(score);
      for (const locale of ["pt", "en", "es", "fr"] as const) {
        const fallback = getFallbackPublicQuiz(slug, locale)!;
        expect(fallback.scoringVersion).toBe("behavioral-v2");
        expect(fallback.questions.every((q) => q.kind === "SCENARIO")).toBe(true);
        expect(JSON.stringify(fallback)).not.toMatch(/signals|scoring_value|isCorrect/);
        const report = buildHumanReport(slug, score as unknown as Record<string, unknown>, locale);
        expect(report.sections).toHaveLength(5);
        expect(JSON.stringify(report)).toContain(source[0].options[0].label[locale]);
        expect(reportText(report)).toContain(source[0].options[0].label[locale]);
        // HTML escapes apostrophes and quotes; the plain scenario title remains inspectable.
        expect(reportHtml(report, slug, locale)).toContain(source[0].prompt[locale].split(". ")[0]);
        expect(report.sections.every((section) => section.actionItems.length > 0)).toBe(true);
      }
    });
    it(`${slug}: rejects missing, duplicate, foreign, numeric, timed-out answers and altered weights`, () => {
      const { items, answers } = fixture(source);
      expect(() => scoreBehavioralV2(slug, items, answers.slice(1))).toThrow();
      expect(() => scoreBehavioralV2(slug, items, [...answers.slice(1), answers[1]])).toThrow();
      expect(() =>
        scoreBehavioralV2(slug, items, [
          { ...answers[0], optionId: items[1].options[0].id },
          ...answers.slice(1),
        ]),
      ).toThrow();
      expect(() =>
        scoreBehavioralV2(slug, items, [
          { questionId: items[0].id, value: 3 },
          ...answers.slice(1),
        ]),
      ).toThrow();
      expect(() =>
        scoreBehavioralV2(slug, items, [
          { ...answers[0], answerStatus: "TIMEOUT" },
          ...answers.slice(1),
        ]),
      ).toThrow();
      const altered = items.map((q, i) =>
        i ? q : { ...q, options: q.options.map((o) => ({ ...o, signals: { FAKE: 1 } })) },
      );
      expect(() => scoreBehavioralV2(slug, altered, answers)).toThrow();
    });
  }
  it("MoneyDNA: all available guardian choices produce the exposure-normalized golden result", () => {
    const { items, answers } = fixture(moneyDnaScenarios, (q) => {
      const index = q.options.findIndex((o) => o.signals.GUARDIAN === 1);
      return index >= 0 ? index : 0;
    });
    const score = scoreBehavioralV2("moneydna", items, answers);
    expect(score.dimensionScores.GUARDIAN).toBe(100);
    expect(score.dominantArchetype).toBe("GUARDIAN");
    expect(score.observations.GUARDIAN).toBe(16);
  });
  it("CoupleDNA: golden pole scores and context changes are descriptive, not correctness", () => {
    for (const pole of [0, 3]) {
      const { items, answers } = fixture(coupleDnaScenarios, (q) =>
        q.options.findIndex((o) => o.signals[q.dimension] === pole),
      );
      const score = scoreBehavioralV2("coupledna", items, answers);
      expect(Object.values(score.dimensionScores)).toEqual(Array(5).fill(pole === 0 ? 0 : 100));
      expect(score.tiedDimensions).toHaveLength(5);
    }
  });
  it("bilateral v2 compares choices, never cancelling opposite choices into equal averages", () => {
    const f = fixture(coupleDnaScenarios, (q) =>
      q.options.findIndex((o) => o.signals[q.dimension] === (q.position <= 10 ? 0 : 3)),
    );
    const g = fixture(coupleDnaScenarios, (q) =>
      q.options.findIndex((o) => o.signals[q.dimension] === (q.position <= 10 ? 3 : 0)),
    );
    const a = scoreBehavioralV2("coupledna", f.items, f.answers),
      b = scoreBehavioralV2("coupledna", g.items, g.answers);
    expect(a.dimensionScores).toEqual(b.dimensionScores);
    expect(compareBehavioralCouple(a, a).overallAlignmentPercentage).toBe(100);
    expect(compareBehavioralCouple(a, b).overallAlignmentPercentage).toBe(0);
    const report = buildParticipantCoupleReport(
      compareBehavioralCouple(a, b),
      a as unknown as Record<string, unknown>,
      "pt",
    );
    expect(JSON.stringify(report)).toContain(
      coupleDnaScenarios[0].options.find((o) => o.signals.COMMUNICATION === 0)!.label.pt,
    );
    expect(report.sections).toHaveLength(11);
  });
  it("selects a published version deterministically and does not select drafts", () => {
    const versions = [
      { version: "v1.0.0", status: "PUBLISHED" },
      { version: "v2.0.0", status: "PUBLISHED" },
      { version: "v3.0.0", status: "DRAFT" },
    ];
    expect(publishedVersion(versions)?.version).toBe("v2.0.0");
    expect(publishedVersion([...versions].reverse())?.version).toBe("v2.0.0");
    expect(publishedVersion([{ version: "v1", status: "DRAFT" }])).toBeUndefined();
  });
  it("generates additive SQL without overwriting historical content or results", () => {
    const sql = behavioralSeedSql();
    expect(sql).toContain("'v2.0.0', 'behavioral-v2'");
    expect(sql).toContain("'SCENARIO'");
    expect(sql).not.toMatch(/update |delete |v1\.0\.0|insert into meqyro\.results/i);
    expect(sql.match(/insert into meqyro.questions /g)).toHaveLength(40);
    expect(sql.match(/insert into meqyro.option_translations /g)).toHaveLength(640);
  });
});
