import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { createHash } from "node:crypto";
import {
  reviewedBanks,
  reviewedQuestionSeedSql,
  clarifyReviewedBrainRankDraftSql,
} from "../../scripts/reviewed-question-seed";
import { reviewedBrainRankPool } from "@/content/quizzes/brainrank-reviewed";
import { brainRankPool } from "@/content/quizzes/brainrank";
import { behavioralDefinition } from "@/features/scoring/behavioral-definition";
import { scoreBehavioralV2, compareBehavioralCouple } from "@/features/scoring/behavioral-v2";
import {
  selectQuestionsForAttempt,
  isCandidateEligible,
  type CandidateQuestion,
} from "@/features/quiz-engine/selection-engine";
import { getInstrumentSelectionConfig } from "@/features/quiz-engine/selection-config";
import { buildBehavioralReport } from "@/features/results/behavioral-report";
import { assertVisualQuestion } from "@/features/quiz-engine/visual-question-schema";
import { getFallbackPublicQuiz } from "@/features/quiz-engine/repository";

const locales = ["pt", "en", "es", "fr"] as const;
const normalize = (text: string) => text.normalize("NFC").trim();

describe("Reviewed production candidate — complete bank", () => {
  it("contains all seven blueprints and 239 reviewed items", () => {
    expect(reviewedBanks.map((b) => b.questions.length)).toEqual([108, 40, 24, 23, 4, 20, 20]);
    expect(reviewedBanks.reduce((n, b) => n + b.questions.length, 0)).toBe(239);
  });
  for (const bank of reviewedBanks) {
    it(`${bank.slug}: unique keys, complete translations and usable alternatives`, () => {
      expect(new Set(bank.questions.map((q) => q.stableKey)).size).toBe(bank.questions.length);
      expect(new Set(bank.questions.map((q) => q.position)).size).toBe(bank.questions.length);
      for (const q of bank.questions) {
        for (const locale of locales) {
          expect(normalize(q.prompt[locale]).length, `${q.stableKey}/${locale}`).toBeGreaterThan(
            10,
          );
          expect(q.prompt[locale]).not.toMatch(/\uFFFD|\?\?|Ã[àáâãèéêìíòóõùúçÃ]/);
          if (q.kind !== "LIKERT") {
            expect(q.options).toHaveLength(4);
            expect(new Set(q.options!.map((o) => normalize(o.label[locale]))).size).toBe(4);
            for (const o of q.options!)
              expect(normalize(o.label[locale]).length).toBeGreaterThan(0);
          }
        }
        if (q.options) {
          expect(new Set(q.options.map((o) => o.stableKey)).size).toBe(4);
          expect(q.options.map((o) => o.position)).toEqual([1, 2, 3, 4]);
        }
        if (bank.slug === "brainrank" || q.scoring.dimension === "DELAYED_MEMORY") {
          expect(q.options?.filter((o) => o.scoring.isCorrect === true)).toHaveLength(1);
        }
      }
    });
    it(`${bank.slug}: fallback uses the same reviewed version and translations`, () => {
      for (const locale of locales) {
        const fallback = getFallbackPublicQuiz(bank.slug, locale)!;
        expect(fallback.version).toBe(bank.version);
        expect(fallback.scoringVersion).toBe(bank.scoringVersion);
        for (const q of fallback.questions) {
          const definition = bank.questions.find((x) => x.stableKey === q.stableKey)!;
          expect(q.prompt).toBe(definition.prompt[locale]);
          expect(q).not.toHaveProperty("scoring");
          expect(JSON.stringify(q)).not.toMatch(/isCorrect|scoringKey|signals/);
        }
      }
    });
  }

  it("stages a byte-equivalent migration without updating historical rows", () => {
    const sql = reviewedQuestionSeedSql();
    // The first staging migration is already applied: never rewrite it as draft copy improves.
    expect(
      createHash("sha256")
        .update(fs.readFileSync("supabase/migrations/20261101010236_reviewed_question_banks.sql"))
        .digest("hex"),
    ).toBe("f062a38ba942ee657c78b4bf5f73fa09ded0555814d7250d5221889f94452692");
    const refinement = clarifyReviewedBrainRankDraftSql();
    expect(
      fs.readFileSync(
        "supabase/migrations/20261101010948_clarify_reviewed_brainrank_items.sql",
        "utf8",
      ),
    ).toBe(refinement);
    expect(refinement).toContain("and v.status='DRAFT'");
    expect(refinement).toContain("Cannot revise an assigned instrument");
    expect(sql).not.toMatch(/\bupdate\b|\bdelete\b/i);
    expect(sql.match(/'DRAFT'::meqyro.content_status/g)).toHaveLength(7);
  });

  it("uses one shape per choice and exactly one shape occurring twice", () => {
    const q = reviewedBrainRankPool.find((q) => q.stableKey === "BR_SPD_01")!;
    if (q.stimulus?.kind !== "group") throw new Error("Expected a shape-counting display");
    const shapes = q.stimulus.scene.elements.map((e) => e.shape);
    const valid = q.options.filter(
      (o) =>
        o.visual?.elements.length === 1 &&
        shapes.filter((s) => s === o.visual!.elements[0].shape).length === 2,
    );
    expect(q.options.every((o) => o.visual?.elements.length === 1)).toBe(true);
    expect(valid).toHaveLength(1);
    expect(valid[0].isCorrect).toBe(true);
  });

  it("calculates the letter-count answer from the actual quoted stimulus in all locales", () => {
    const q = reviewedBrainRankPool.find((q) => q.stableKey === "BR_ATT_02")!;
    for (const locale of locales) {
      const text = q.prompt[locale].match(/RACIOCINAR[^']+/)![0];
      const count = [...text].filter((c) => c === "R").length;
      expect(count).toBe(10);
      const matching = q.options.filter((o) => Number(o.label[locale]) === count);
      expect(matching).toHaveLength(1);
      expect(matching[0].isCorrect).toBe(true);
    }
    expect(
      brainRankPool.find((q) => q.stableKey === "BR_ATT_02")!.options.find((o) => o.isCorrect)!
        .label.pt,
    ).toBe("12");
  });

  it("keeps all visual choices valid after balancing answer positions", () => {
    for (const q of reviewedBrainRankPool.filter((q) => q.kind === "VISUAL_CHOICE")) {
      expect(() => assertVisualQuestion({ ...q, kind: q.kind!, options: q.options })).not.toThrow();
    }
    const positions = [1, 2, 3, 4].map(
      (position) =>
        reviewedBrainRankPool.filter(
          (q) => q.options.find((o) => o.isCorrect)?.position === position,
        ).length,
    );
    expect(positions).toEqual([24, 24, 24, 24]);
  });

  it("verifies numerical keys against independent calculations", () => {
    const answers: Record<string, number> = {
      BR_PAT_01: 5 * 6,
      BR_PAT_05: 15 + 4,
      BR_PAT_06: 5 ** 2,
      BR_PAT_07: 27 + 11,
      BR_PAT_08: 40 * 2,
      BR_PAT_09: 6 ** 3,
      BR_PAT_10: 32 + 5 ** 2,
      BR_NUM_01: 5 * 6 + 5 + 6 + 2,
      BR_NUM_03: 3 ** 2 + 4 ** 2,
      BR_NUM_05: (12 / 4) * 7,
      BR_NUM_06: 0.25 * 240,
      BR_NUM_07: 360 / (180 / 60 + 180 / 90),
      BR_NUM_08: 200 * 1.2 * 0.8,
      BR_NUM_09: ((70 + 14) / 2) * ((70 - 14) / 2),
      BR_NUM_10: 1 / (1 / 3 + 1 / 6),
      BR_LOG_08: 25 + 20 - 40,
      BR_ATT_05: [..."T L T F T E T L T"].filter((c) => c === "T").length,
      BR_ATT_08: [13, 22, 37, 48, 55, 64, 71, 86, 99].filter((n) => n % 2 === 0).length,
      BR_PRB_03: 2 + 1 + 5,
      BR_PRB_04: [0, 1, 2, 3].find((weighings) => 3 ** weighings >= 9)!,
      BR_PRB_05: 100 - 150 / 3,
      BR_PRB_06: 600 - 420,
      BR_PRB_07: Math.ceil(100 / 18),
      BR_PRB_08: (72 + 20 * 2) / 7,
      BR_PRB_09: (5 * 4) / 2,
      BR_PRB_10: (24 / 3) * 2,
      BR_SPD_02: 15 * 4 - 12 * 3 + 7,
      BR_SPD_05: 15 * 6,
      BR_SPD_06: 47 * 2,
      BR_SPD_07: 250 - 87,
      BR_SPD_09: 18 * 12 - 16,
      BR_EXT_PATTERN_RECOGNITION_01: 19 + 5,
      BR_EXT_PATTERN_RECOGNITION_02: 9 * 2,
      BR_EXT_PATTERN_RECOGNITION_03: 31 + 15,
      BR_EXT_PATTERN_RECOGNITION_04: 32 - 12,
      BR_EXT_PATTERN_RECOGNITION_05: 23 * 2 + 1,
      BR_EXT_PATTERN_RECOGNITION_06: 35 + 32,
      BR_EXT_NUMERICAL_REASONING_01: 0.15 * 200,
      BR_EXT_NUMERICAL_REASONING_02: (300 / 4) * 6,
      BR_EXT_NUMERICAL_REASONING_03: 80 * 1.25,
      BR_EXT_NUMERICAL_REASONING_04: 20 * 3 - 12 - 18,
      BR_EXT_NUMERICAL_REASONING_05: (72 * 5) / 8,
      BR_EXT_NUMERICAL_REASONING_06: 96 / (1.2 * 0.8),
      BR_EXT_ATTENTION_02: "ABBAABABBAAB".match(/AB/g)!.length,
      BR_EXT_ATTENTION_04: "3838338383".match(/38/g)!.length,
      BR_EXT_PROBLEM_SOLVING_01: Math.ceil(18 / 6),
      BR_EXT_PROBLEM_SOLVING_02: Math.max(20 + 15, 10),
      BR_EXT_PROBLEM_SOLVING_03: Math.ceil(27 / 8),
      BR_EXT_PROBLEM_SOLVING_05: 2 * 4 + 2,
      BR_EXT_PROBLEM_SOLVING_06: 6 * (3 + 2),
      BR_EXT_SPEED_01: 18 + 7 - 9,
      BR_EXT_SPEED_03: 9 * 4 - 12 / 3,
      BR_EXT_SPEED_05: 84 / 7,
      BR_EXT_SPEED_06: ((18 - 6) * (9 + 3)) / 8,
    };
    for (const [key, expected] of Object.entries(answers)) {
      const correct = reviewedBrainRankPool
        .find((q) => q.stableKey === key)!
        .options.find((o) => o.isCorrect)!;
      const numeric = Number(
        correct.label.pt
          .replace(/R\$\s*/, "")
          .replace(",", ".")
          .match(/\d+(?:\.\d+)?/)![0],
      );
      expect(numeric, key).toBeCloseTo(expected);
    }
  });
});

describe("Reviewed and historical behavioral instruments", () => {
  for (const slug of ["moneydna", "coupledna"] as const) {
    for (const version of ["v2.0.0", "v3.0.0"] as const) {
      it(`${slug}/${version}: 100 seeded selections finish scoring and retain translated evidence`, () => {
        const source = behavioralDefinition(slug, version);
        expect(source).toHaveLength(version === "v2.0.0" ? 80 : 20);
        const candidates: CandidateQuestion[] = source.map((q) => ({
          id: q.stableKey,
          stableKey: q.stableKey,
          kind: "SCENARIO",
          active: true,
          translations: Object.entries(q.prompt).map(([locale, prompt]) => ({ locale, prompt })),
          scoringKey: { dimension: q.dimension, difficulty: q.difficulty },
          options: q.options.map((o, i) => ({
            id: o.stableKey,
            stableKey: o.stableKey,
            position: i + 1,
            translations: Object.entries(o.label).map(([locale, label]) => ({ locale, label })),
          })),
        }));
        let sawExpanded = false;
        for (let seed = 0; seed < 100; seed++) {
          const selected = selectQuestionsForAttempt(
            candidates,
            getInstrumentSelectionConfig(slug, version, "behavioral-v2")!,
            `production-audit-${seed}`,
          );
          const assigned = selected.map((s) => source.find((q) => q.stableKey === s.stableKey)!);
          sawExpanded ||= assigned.some((q) => Number(q.stableKey.split("_")[1]) > 20);
          const items = assigned.map((q) => ({
            id: q.stableKey,
            stableKey: q.stableKey,
            options: q.options.map((o) => ({ ...o, id: o.stableKey })),
          }));
          const answers = assigned.map((q) => ({
            questionId: q.stableKey,
            optionId: q.options[seed % 4].stableKey,
          }));
          const score = scoreBehavioralV2(slug, items, answers, version);
          expect(score.instrumentVersion).toBe(version);
          expect(score.totalResponses).toBe(20);
          for (const value of Object.values(score.dimensionScores))
            expect(value).toBeGreaterThanOrEqual(0);
          for (const value of Object.values(score.dimensionScores))
            expect(value).toBeLessThanOrEqual(100);
          for (const locale of locales) {
            const report = buildBehavioralReport(slug, score, locale);
            const allEvidence = report.sections.flatMap((s) => s.keyTakeaways).join("\n");
            for (const q of assigned) expect(allEvidence).toContain(q.prompt[locale]);
          }
          if (slug === "coupledna") {
            expect(compareBehavioralCouple(score, score).overallAlignmentPercentage).toBe(100);
            const opposite = scoreBehavioralV2(
              slug,
              items,
              assigned.map((q) => ({
                questionId: q.stableKey,
                optionId: q.options[(seed + 1) % 4].stableKey,
              })),
              version,
            );
            expect(compareBehavioralCouple(score, opposite).overallAlignmentPercentage).toBe(0);
            expect(() =>
              compareBehavioralCouple(score, {
                ...opposite,
                evidence: [...opposite.evidence.slice(1), opposite.evidence[1]],
              }),
            ).toThrow();
          }
        }
        if (version === "v2.0.0") expect(sawExpanded).toBe(true);
        const incomplete = {
          ...candidates[0],
          translations: candidates[0].translations!.filter((t) => t.locale !== "fr"),
        };
        expect(isCandidateEligible(incomplete)).toBe(false);
      });
    }
  }
  it("does not accept another instrument's keys or altered private weights", () => {
    const source = behavioralDefinition("moneydna", "v3.0.0");
    const items = source.map((q) => ({
      id: q.stableKey,
      stableKey: q.stableKey,
      options: q.options.map((o) => ({ ...o, id: o.stableKey })),
    }));
    const answers = items.map((q) => ({ questionId: q.id, optionId: q.options[0].id }));
    expect(() => scoreBehavioralV2("moneydna", items, answers, "v2.0.0")).toThrow();
    items[0].options[0] = { ...items[0].options[0], signals: { BUILDER: 99 } };
    expect(() => scoreBehavioralV2("moneydna", items, answers, "v3.0.0")).toThrow();
  });
});
