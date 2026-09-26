import { describe, expect, it } from "vitest";
import { brainRankQuestions } from "@/content/quizzes/brainrank";
import { personalityMapQuestions } from "@/content/quizzes/personality-map";
import { brainRankDimensions, type BrainRankDimension } from "@/features/scoring/brainrank";
import {
  personalityDimensions,
  type PersonalityDimension,
} from "@/features/scoring/personality-map";

describe("Content definitions integrity", () => {
  it("BrainRank contains exactly 24 valid items, 4 per dimension", () => {
    expect(brainRankQuestions).toHaveLength(24);

    const byDimension: Record<BrainRankDimension, number> = Object.fromEntries(
      brainRankDimensions.map((d) => [d, 0]),
    ) as Record<BrainRankDimension, number>;

    for (const [index, q] of brainRankQuestions.entries()) {
      expect(q.position).toBe(index + 1);
      expect(q.options).toHaveLength(4);
      expect(q.options.filter((o) => o.isCorrect)).toHaveLength(1);
      byDimension[q.dimension] += 1;
    }

    for (const dim of brainRankDimensions) {
      expect(byDimension[dim]).toBe(4);
    }
  });

  it("Personality Map contains exactly 40 valid items, 8 per dimension (4 direct, 4 reverse)", () => {
    expect(personalityMapQuestions).toHaveLength(40);

    const byDimension: Record<PersonalityDimension, { direct: number; reverse: number }> =
      Object.fromEntries(
        personalityDimensions.map((d) => [d, { direct: 0, reverse: 0 }]),
      ) as Record<PersonalityDimension, { direct: number; reverse: number }>;

    for (const [index, q] of personalityMapQuestions.entries()) {
      expect(q.position).toBe(index + 1);
      if (q.direction === "DIRECT") {
        byDimension[q.dimension].direct += 1;
      } else {
        byDimension[q.dimension].reverse += 1;
      }
    }

    for (const dim of personalityDimensions) {
      expect(byDimension[dim].direct).toBe(4);
      expect(byDimension[dim].reverse).toBe(4);
    }
  });

  it("generates valid SQL seed file", async () => {
    const { generateSeedSql } = await import("../../scripts/build-seed-sql");
    const sql = generateSeedSql();
    expect(sql).toContain("BR_PAT_01");
    expect(sql).toContain("PM_OPN_01");
    expect(sql).toContain("CF_TECH_01");
    expect(sql).toContain("MD_BLD_01");
    expect(sql).toContain("FS_HYPER_01");
    expect(sql).toContain("DD_SCEN_01");
    expect(sql).toContain("CD_COMM_01");
    const fs = await import("node:fs");
    const path = await import("node:path");
    fs.writeFileSync(path.resolve(import.meta.dirname, "../../supabase/seed.sql"), sql, "utf8");
  });
});
