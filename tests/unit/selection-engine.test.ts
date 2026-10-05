import { describe, expect, it } from "vitest";
import {
  selectQuestionsForAttempt,
  InsufficientQuestionPoolError,
  type CandidateQuestion,
} from "@/features/quiz-engine/selection-engine";
import { getAssessmentSelectionConfig } from "@/features/quiz-engine/selection-config";

function generateMockCandidates(
  prefix: string,
  dimensions: string[],
  difficulties: Array<"EASY" | "MEDIUM" | "HARD">,
  perDiffCount = 4,
): CandidateQuestion[] {
  const result: CandidateQuestion[] = [];
  let count = 1;

  for (const dim of dimensions) {
    for (const diff of difficulties) {
      for (let i = 0; i < perDiffCount; i++) {
        result.push({
          id: `uuid-${prefix}-${count}`,
          stableKey: `${prefix}_${dim.slice(0, 3)}_${count}`,
          kind: "SINGLE_CHOICE",
          active: true,
          scoringKey: { dimension: dim, difficulty: diff },
          translations: [
            { locale: "pt", prompt: `Prompt ${count} pt` },
            { locale: "en", prompt: `Prompt ${count} en` },
            { locale: "es", prompt: `Prompt ${count} es` },
            { locale: "fr", prompt: `Prompt ${count} fr` },
          ],
          options: [
            { id: `opt-${count}-1`, stableKey: "A", position: 1 },
            { id: `opt-${count}-2`, stableKey: "B", position: 2 },
          ],
        });
        count++;
      }
    }
  }

  return result;
}

describe("Question Selection Engine", () => {
  const brainRankDims = [
    "PATTERN_RECOGNITION",
    "LOGICAL_REASONING",
    "NUMERICAL_REASONING",
    "ATTENTION",
    "PROBLEM_SOLVING",
    "SPEED",
  ];

  it("selects exactly 24 questions for BrainRank with strict dimension and difficulty quotas", () => {
    // 6 dimensions * 3 difficulties * 4 per diff = 72 candidates (more than 60)
    const candidates = generateMockCandidates("BR", brainRankDims, ["EASY", "MEDIUM", "HARD"], 4);
    const config = getAssessmentSelectionConfig("brainrank");

    const selected = selectQuestionsForAttempt(candidates, config, "test-attempt-seed-1");

    expect(selected).toHaveLength(24);

    // Verify uniqueness
    const ids = new Set(selected.map((s) => s.questionId));
    expect(ids.size).toBe(24);

    // Verify positions are 1..24
    expect(selected.map((s) => s.position)).toEqual(Array.from({ length: 24 }, (_, i) => i + 1));

    // Verify dimensions: exactly 4 per dimension
    const dimCounts: Record<string, number> = {};
    for (const item of selected) {
      dimCounts[item.dimension] = (dimCounts[item.dimension] || 0) + 1;
    }
    for (const dim of brainRankDims) {
      expect(dimCounts[dim]).toBe(4);
    }

    // Verify difficulties across the 24 questions: 6 easy, 12 medium, 6 hard
    const diffCounts: Record<string, number> = {};
    for (const item of selected) {
      const diff = item.difficulty ?? "UNKNOWN";
      diffCounts[diff] = (diffCounts[diff] || 0) + 1;
    }
    expect(diffCounts.EASY).toBe(6);
    expect(diffCounts.MEDIUM).toBe(12);
    expect(diffCounts.HARD).toBe(6);
  });

  it("is completely deterministic given the same seed", () => {
    const candidates = generateMockCandidates("BR", brainRankDims, ["EASY", "MEDIUM", "HARD"], 4);
    const config = getAssessmentSelectionConfig("brainrank");

    const run1 = selectQuestionsForAttempt(candidates, config, "TEST-SEED-FIXED-42");
    const run2 = selectQuestionsForAttempt(candidates, config, "TEST-SEED-FIXED-42");

    expect(run1.map((s) => s.questionId)).toEqual(run2.map((s) => s.questionId));
    expect(run1.map((s) => s.position)).toEqual(run2.map((s) => s.position));
  });

  it("produces different selections for different seeds", () => {
    const candidates = generateMockCandidates("BR", brainRankDims, ["EASY", "MEDIUM", "HARD"], 4);
    const config = getAssessmentSelectionConfig("brainrank");

    const runA = selectQuestionsForAttempt(candidates, config, "ATTEMPT-USER-ALICE");
    const runB = selectQuestionsForAttempt(candidates, config, "ATTEMPT-USER-BOB");

    const idsA = runA.map((s) => s.questionId).join(",");
    const idsB = runB.map((s) => s.questionId).join(",");

    expect(idsA).not.toEqual(idsB);
  });

  it("filters out inactive and broken questions", () => {
    const candidates = generateMockCandidates("BR", brainRankDims, ["EASY", "MEDIUM", "HARD"], 5);

    // Make one inactive
    candidates[0] = { ...candidates[0], active: false };
    // Make one missing translations
    candidates[1] = { ...candidates[1], translations: [{ locale: "pt", prompt: "Only pt" }] };
    // Make one missing options
    candidates[2] = { ...candidates[2], options: [] };

    const config = getAssessmentSelectionConfig("brainrank");
    const selected = selectQuestionsForAttempt(candidates, config, "seed-active-filter");

    const selectedIds = new Set(selected.map((s) => s.questionId));
    expect(selectedIds.has(candidates[0].id)).toBe(false);
    expect(selectedIds.has(candidates[1].id)).toBe(false);
    expect(selectedIds.has(candidates[2].id)).toBe(false);
    expect(selected).toHaveLength(24);
  });

  it("handles fallback gracefully when a difficulty bucket has fewer items than quota", () => {
    // Generate pool where PATTERN_RECOGNITION has only 1 HARD instead of required 1
    // and only 1 MEDIUM instead of required 2 (so fallback must pull from EASY)
    const candidates = generateMockCandidates("BR", brainRankDims, ["EASY", "MEDIUM", "HARD"], 3);
    const filteredCandidates = candidates.filter((q) => {
      const isPat = q.scoringKey.dimension === "PATTERN_RECOGNITION";
      const isMed = q.scoringKey.difficulty === "MEDIUM";
      // Remove one MEDIUM from PATTERN_RECOGNITION leaving only 1
      if (isPat && isMed && q.id.endsWith("-2")) return false;
      return true;
    });

    const config = getAssessmentSelectionConfig("brainrank");
    const selected = selectQuestionsForAttempt(filteredCandidates, config, "seed-fallback-test");

    expect(selected).toHaveLength(24);
    // Still 4 for PATTERN_RECOGNITION
    const patItems = selected.filter((s) => s.dimension === "PATTERN_RECOGNITION");
    expect(patItems).toHaveLength(4);
    // No duplicate IDs
    const uniqueIds = new Set(selected.map((s) => s.questionId));
    expect(uniqueIds.size).toBe(24);
  });

  it("fails with InsufficientQuestionPoolError if pool is smaller than required total", () => {
    const fewCandidates = generateMockCandidates("BR", brainRankDims, ["EASY"], 1); // only 6 items
    const config = getAssessmentSelectionConfig("brainrank");

    expect(() => selectQuestionsForAttempt(fewCandidates, config, "seed-too-small")).toThrow(
      InsufficientQuestionPoolError,
    );
  });

  it("interleaves dimensions in behavioral assessments (Personality Map)", () => {
    const bigFive = [
      "OPENNESS",
      "CONSCIENTIOUSNESS",
      "EXTRAVERSION",
      "AGREEABLENESS",
      "EMOTIONAL_STABILITY",
    ];

    const candidates: CandidateQuestion[] = [];
    let count = 1;
    for (const dim of bigFive) {
      for (const dir of ["DIRECT", "REVERSE"] as const) {
        for (let i = 0; i < 6; i++) {
          candidates.push({
            id: `pm-${count}`,
            stableKey: `PM_${dim.slice(0, 3)}_${count}`,
            kind: "LIKERT",
            active: true,
            scoringKey: { dimension: dim, direction: dir },
            translations: [
              { locale: "pt", prompt: `P ${count}` },
              { locale: "en", prompt: `P ${count}` },
              { locale: "es", prompt: `P ${count}` },
              { locale: "fr", prompt: `P ${count}` },
            ],
          });
          count++;
        }
      }
    }

    const config = getAssessmentSelectionConfig("personality-map");
    const selected = selectQuestionsForAttempt(candidates, config, "seed-big-five");

    expect(selected).toHaveLength(40);

    // Verify 8 per dimension
    const counts: Record<string, number> = {};
    for (const item of selected) {
      counts[item.dimension] = (counts[item.dimension] || 0) + 1;
    }
    for (const dim of bigFive) {
      expect(counts[dim]).toBe(8);
    }

    // Verify that dimensions are interleaved (no 4 identical dimensions consecutively)
    for (let i = 0; i < selected.length - 3; i++) {
      const d1 = selected[i].dimension;
      const d2 = selected[i + 1].dimension;
      const d3 = selected[i + 2].dimension;
      const d4 = selected[i + 3].dimension;
      expect(d1 === d2 && d2 === d3 && d3 === d4).toBe(false);
    }
  });

  describe("Section 39: BrainRank 100 Runs Verification", () => {
    it("executes BrainRank selection 100 times, validating integrity on every run", () => {
      const candidates = generateMockCandidates("BR", brainRankDims, ["EASY", "MEDIUM", "HARD"], 4);
      const config = getAssessmentSelectionConfig("brainrank");

      for (let run = 1; run <= 100; run++) {
        const seed = `stress-test-run-${run}`;
        const selected = selectQuestionsForAttempt(candidates, config, seed);

        // 1. Total questions = 24
        expect(selected).toHaveLength(24);

        // 2. No duplicates
        const unique = new Set(selected.map((s) => s.questionId));
        expect(unique.size).toBe(24);

        // 3. Dimensions correct (4 each across all 6 dimensions)
        const dims: Record<string, number> = {};
        for (const item of selected) {
          dims[item.dimension] = (dims[item.dimension] || 0) + 1;
        }
        for (const dim of brainRankDims) {
          expect(dims[dim]).toBe(4);
        }

        // 4. Difficulties correct (6 easy, 12 medium, 6 hard)
        const diffs: Record<string, number> = {};
        for (const item of selected) {
          const diff = item.difficulty!;
          diffs[diff] = (diffs[diff] || 0) + 1;
        }
        expect(diffs.EASY).toBe(6);
        expect(diffs.MEDIUM).toBe(12);
        expect(diffs.HARD).toBe(6);

        // 5. UX progression: no hard questions in the first 2 questions
        expect(selected[0].difficulty).not.toBe("HARD");
        expect(selected[1].difficulty).not.toBe("HARD");
      }
    });
  });

  describe("Section 40: Distribution Simulation across 1000 Attempts", () => {
    it("simulates 1000 attempts and verifies reasonable distribution across candidates", () => {
      // 6 dimensions * (3 easy, 4 medium, 3 hard) = 60 candidates
      const candidates: CandidateQuestion[] = [];

      for (const dim of brainRankDims) {
        // 3 easy
        for (let i = 0; i < 3; i++) {
          candidates.push({
            id: `q-${dim}-EASY-${i + 1}`,
            stableKey: `BR_${dim.slice(0, 3)}_E${i + 1}`,
            kind: "SINGLE_CHOICE",
            active: true,
            scoringKey: { dimension: dim, difficulty: "EASY" },
            options: [
              { id: `o1`, stableKey: "A", position: 1 },
              { id: `o2`, stableKey: "B", position: 2 },
            ],
          });
        }
        // 4 medium
        for (let i = 0; i < 4; i++) {
          candidates.push({
            id: `q-${dim}-MED-${i + 1}`,
            stableKey: `BR_${dim.slice(0, 3)}_M${i + 1}`,
            kind: "SINGLE_CHOICE",
            active: true,
            scoringKey: { dimension: dim, difficulty: "MEDIUM" },
            options: [
              { id: `o1`, stableKey: "A", position: 1 },
              { id: `o2`, stableKey: "B", position: 2 },
            ],
          });
        }
        // 3 hard
        for (let i = 0; i < 3; i++) {
          candidates.push({
            id: `q-${dim}-HARD-${i + 1}`,
            stableKey: `BR_${dim.slice(0, 3)}_H${i + 1}`,
            kind: "SINGLE_CHOICE",
            active: true,
            scoringKey: { dimension: dim, difficulty: "HARD" },
            options: [
              { id: `o1`, stableKey: "A", position: 1 },
              { id: `o2`, stableKey: "B", position: 2 },
            ],
          });
        }
      }

      expect(candidates).toHaveLength(60);

      const config = getAssessmentSelectionConfig("brainrank");
      const appearances: Record<string, number> = {};
      for (const q of candidates) {
        appearances[q.id] = 0;
      }

      const ATTEMPTS = 1000;
      for (let i = 1; i <= ATTEMPTS; i++) {
        const selected = selectQuestionsForAttempt(candidates, config, `sim-attempt-${i}`);
        for (const item of selected) {
          appearances[item.questionId] += 1;
        }
      }

      // Check that EVERY candidate question is selected a healthy amount of times
      for (const count of Object.values(appearances)) {
        // In theory:
        // Easy: 1 selected out of 3 -> expected ~333 times in 1000 runs
        // Medium: 2 selected out of 4 -> expected ~500 times in 1000 runs
        // Hard: 1 selected out of 3 -> expected ~333 times in 1000 runs
        // We verify that no question appeared 0 times (never selected) or 1000 times (always selected)
        expect(count).toBeGreaterThan(200);
        expect(count).toBeLessThan(700);
      }
    });
  });
});
