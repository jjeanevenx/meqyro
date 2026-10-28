import { describe, expect, it } from "vitest";
import { brainRankMemoryPool } from "@/content/quizzes/brainrank-memory";
import { selectMemoryForAttempt } from "@/features/quiz-engine/selection-engine";
import { buildHumanReport } from "@/features/results/human-report";
import { timingReportSection } from "@/features/results/timing-report";

describe("BrainRank varied stories and readable reports", () => {
  it("draws three distinct stories, reproduces its seed and varies across attempts", () => {
    const pool = brainRankMemoryPool.map((item) => ({ ...item, stableKey: item.key }));
    const selected = Array.from({ length: 60 }, (_, i) =>
      selectMemoryForAttempt(pool, `attempt-${i}`),
    );
    for (const [i, stories] of selected.entries()) {
      expect(stories).toHaveLength(3);
      expect(new Set(stories.map((s) => s.key)).size).toBe(3);
      expect(stories).toEqual(selectMemoryForAttempt(pool, `attempt-${i}`));
    }
    expect(new Set(selected.map((s) => s.map((q) => q.key).join(","))).size).toBeGreaterThan(40);
    expect(new Set(selected.flat().map((q) => q.key)).size).toBe(pool.length);
    expect(selectMemoryForAttempt(pool.slice(0, 3), "legacy")).toEqual(pool.slice(0, 3));
    expect(() => selectMemoryForAttempt(pool.slice(0, 2), "short")).toThrow();
  });

  it.each(["pt", "en", "es", "fr"] as const)(
    "has clear, complete stories and answers in %s",
    (locale) => {
      expect(brainRankMemoryPool).toHaveLength(12);
      for (const item of brainRankMemoryPool) {
        expect(item.cue[locale].length).toBeGreaterThan(35);
        expect(item.prompt[locale].length).toBeGreaterThan(10);
        expect(item.options).toHaveLength(4);
        expect(new Set(item.options.map((o) => o[locale].toLocaleLowerCase(locale))).size).toBe(4);
        expect(item.cue[locale].toLocaleLowerCase(locale)).toContain(
          item.options[item.correct][locale].toLocaleLowerCase(locale),
        );
        expect(item.cue[locale]).not.toMatch(
          /memorize|memoriza|perguntaremos|preguntaremos|test de mémoire/i,
        );
      }
      const reports = [0, 1, 3].map((correct) =>
        buildHumanReport(
          "brainrank",
          {
            overallScore: 700,
            dimensionScores: { ATTENTION: 75 },
            memoryRecall: { total: 3, correct, situationsPresented: 3 },
          },
          locale,
        ),
      );
      const memory = reports.map((r) => r.sections.find((s) => s.id === "delayed-memory")!);
      expect(memory.map((s) => s.summary)).toEqual([
        `0/3 ${locale === "pt" ? "acertos" : locale === "en" ? "correct answers" : locale === "es" ? "aciertos" : "réponses correctes"}.`,
        `1/3 ${locale === "pt" ? "acertos" : locale === "en" ? "correct answers" : locale === "es" ? "aciertos" : "réponses correctes"}.`,
        `3/3 ${locale === "pt" ? "acertos" : locale === "en" ? "correct answers" : locale === "es" ? "aciertos" : "réponses correctes"}.`,
      ]);
      expect(new Set(memory.map((s) => s.paragraphs[0])).size).toBe(3);
      const timing = timingReportSection(
        {
          measuredQuestions: 24,
          averageResponseTimeMs: 5000,
          completedInTimePercent: 100,
          timeouts: 0,
          accuracyPercent: 75,
          averageByDifficultyMs: { EASY: 3000, MEDIUM: 4000, HARD: 8000, UNKNOWN: 5000 },
        },
        locale,
      );
      expect(JSON.stringify(timing)).not.toMatch(/EASY|MEDIUM|HARD|UNKNOWN|undefined|NaN/);
    },
  );
});
