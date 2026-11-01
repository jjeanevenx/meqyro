import { describe, expect, it } from "vitest";
import { brainRankPool } from "@/content/quizzes/brainrank";
import { moneyDnaPool } from "@/content/quizzes/moneydna-v2";
import { coupleDnaPool } from "@/content/quizzes/coupledna-v2";
import type { ScenarioDefinition } from "@/content/quizzes/behavioral-scenario";
import {
  selectQuestionsForAttempt,
  type CandidateQuestion,
} from "@/features/quiz-engine/selection-engine";
import { getAssessmentSelectionConfig } from "@/features/quiz-engine/selection-config";
import { scoreBehavioralV2, compareBehavioralCouple } from "@/features/scoring/behavioral-v2";
import { buildHumanReport } from "@/features/results/human-report";
import { locales } from "@/lib/i18n/config";
import { questionBankExpansionSql } from "../../scripts/question-bank-expansion";

const pools = { brainrank: brainRankPool, moneydna: moneyDnaPool, coupledna: coupleDnaPool };
function candidates(slug: keyof typeof pools): CandidateQuestion[] {
  return pools[slug].map((q) => ({
    id: q.stableKey,
    stableKey: q.stableKey,
    active: true,
    kind: slug === "brainrank" ? "SINGLE_CHOICE" : "SCENARIO",
    scoringKey: { dimension: q.dimension, difficulty: q.difficulty },
    translations: locales.map((locale) => ({ locale, prompt: q.prompt[locale] })),
    options: q.options.map((o, i) => ({
      id: `${q.stableKey}:${o.stableKey}`,
      stableKey: o.stableKey,
      position: i + 1,
      translations: locales.map((locale) => ({ locale, label: o.label[locale] })),
    })),
  }));
}
function behavioralFixture(source: readonly ScenarioDefinition[], pole: number) {
  const items = source.map((q) => ({
    id: q.stableKey,
    stableKey: q.stableKey,
    options: q.options.map((o) => ({
      id: o.stableKey,
      stableKey: o.stableKey,
      signals: o.signals,
    })),
  }));
  const answers = source.map((q) => ({
    questionId: q.stableKey,
    optionId: (q.options.find((o) => o.signals[q.dimension] === pole) ?? q.options[0]).stableKey,
  }));
  return { items, answers };
}

describe("Commercial reports and question exposure", () => {
  it.each(["brainrank", "moneydna", "coupledna"] as const)(
    "%s: keeps average pair overlap near 25 percent across independent attempts",
    (slug) => {
      const bank = candidates(slug);
      const config = { ...getAssessmentSelectionConfig(slug), maxQuestionExposure: 0.25 };
      expect(bank).toHaveLength(config.totalQuestions * 4);
      if (slug !== "brainrank") {
        for (const dimension of Object.keys(config.dimensions)) {
          const questions = pools[slug].filter((q) => q.dimension === dimension);
          expect(questions.filter((q) => q.difficulty === "EASY")).toHaveLength(4);
          expect(questions.filter((q) => q.difficulty === "MEDIUM")).toHaveLength(4);
          expect(questions.filter((q) => q.difficulty === "HARD")).toHaveLength(8);
        }
      }
      expect(new Set(bank.map((q) => q.stableKey)).size).toBe(bank.length);
      for (const locale of locales) {
        const prompts = pools[slug].map(
          (q) =>
            `${q.prompt[locale]}${"clue" in q ? (q.clue?.[locale] ?? "") : ""}${"stimulus" in q ? JSON.stringify(q.stimulus) : ""}`,
        );
        expect(new Set(prompts).size).toBe(prompts.length);
      }
      let shared = 0;
      for (let i = 0; i < 600; i++) {
        const a = selectQuestionsForAttempt(bank, config, `person-a-${i}`);
        const b = selectQuestionsForAttempt(bank, config, `person-b-${i}`);
        expect(a).toHaveLength(config.totalQuestions);
        expect(new Set(a.map((q) => q.questionId)).size).toBe(config.totalQuestions);
        const ids = new Set(a.map((q) => q.questionId));
        shared += b.filter((q) => ids.has(q.questionId)).length;
        for (const [dimension, quota] of Object.entries(config.dimensions)) {
          expect(a.filter((q) => q.dimension === dimension)).toHaveLength(quota.total);
        }
      }
      const overlap = shared / (600 * config.totalQuestions);
      expect(overlap).toBeGreaterThan(0.23);
      expect(overlap).toBeLessThan(0.27);
      expect(() => selectQuestionsForAttempt(bank.slice(1), config, "small-pool")).toThrow(
        /exposure budget/,
      );
    },
  );

  it.each(["moneydna", "coupledna"] as const)(
    "%s: scores and reports actual selections from the expanded bank",
    (slug) => {
      const source = slug === "moneydna" ? moneyDnaPool : coupleDnaPool;
      const selected = selectQuestionsForAttempt(
        candidates(slug),
        getAssessmentSelectionConfig(slug),
        "expanded",
      );
      const questions = selected.map((q) => source.find((s) => s.stableKey === q.stableKey)!);
      expect(questions.some((q) => q.position > 20)).toBe(true);
      const fixture = behavioralFixture(questions, 0);
      const score = scoreBehavioralV2(slug, fixture.items, fixture.answers);
      expect(score.evidence).toHaveLength(20);
      for (const locale of locales) {
        const report = buildHumanReport(slug, score, locale);
        for (const q of questions)
          expect(JSON.stringify(report)).toContain(
            q.options.find(
              (o) =>
                o.stableKey ===
                score.evidence.find((e) => e.questionKey === q.stableKey)?.optionKey,
            )!.label[locale],
          );
      }
      if (slug === "coupledna") {
        expect(compareBehavioralCouple(score, score).overallAlignmentPercentage).toBe(100);
        const opposite = behavioralFixture(questions, 3);
        expect(
          compareBehavioralCouple(score, scoreBehavioralV2(slug, opposite.items, opposite.answers))
            .overallAlignmentPercentage,
        ).toBe(0);
        const different = behavioralFixture(coupleDnaPool.slice(0, 20), 0);
        expect(() =>
          compareBehavioralCouple(
            score,
            scoreBehavioralV2(slug, different.items, different.answers),
          ),
        ).toThrow(/same selected/);
      }
    },
  );

  it.each(locales)("changes interpretation, exercise and summary with results in %s", (locale) => {
    for (const [slug, dimension] of [
      ["brainrank", "ATTENTION"],
      ["moneydna", "GUARDIAN"],
      ["coupledna", "COMMUNICATION"],
    ]) {
      const reports = [0, 50, 100].map((value) =>
        buildHumanReport(slug, { dimensionScores: { [dimension]: value } }, locale),
      );
      expect(new Set(reports.map((r) => r.sections[0].keyTakeaways[0])).size).toBe(3);
      expect(new Set(reports.map((r) => r.sections[0].actionItems[0])).size).toBe(3);
      expect(new Set(reports.map((r) => r.executiveSummary)).size).toBe(3);
    }
    const low = behavioralFixture(coupleDnaPool.slice(0, 20), 0),
      high = behavioralFixture(coupleDnaPool.slice(0, 20), 3);
    const reports = [low, high].map((f) =>
      buildHumanReport("coupledna", scoreBehavioralV2("coupledna", f.items, f.answers), locale),
    );
    expect(reports[0].sections[0].paragraphs[0]).not.toBe(reports[1].sections[0].paragraphs[0]);
    expect(reports[0].sections[0].actionItems).not.toEqual(reports[1].sections[0].actionItems);
  });

  it("generates an additive migration with every new item, without rewriting historical questions or results", () => {
    const sql = questionBankExpansionSql();
    expect(sql.match(/insert into meqyro.questions /g)).toHaveLength(156);
    expect(sql).not.toMatch(/\bupdate\b|\bdelete\b|meqyro\.results/i);
    expect(sql).toContain("MD2_80");
    expect(sql).toContain("CD2_80");
  });
});
