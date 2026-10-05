import { describe, expect, it } from "vitest";
import { buildHumanReport } from "@/features/results/human-report";
import { dimensionGuidance } from "@/features/results/dimension-guidance";
import { localizedDimensionGuidance } from "@/features/results/dimension-guidance-locales";
import { locales } from "@/lib/i18n/config";

describe("Paid report interpretation in each offered language", () => {
  it("explains every dimension and provides a distinct practical action in all four languages", () => {
    const keys = Object.keys(dimensionGuidance);
    for (const locale of locales) {
      const guidance = localizedDimensionGuidance[locale];
      expect(Object.keys(guidance).sort()).toEqual([...keys].sort());
      const report = buildHumanReport(
        "careerfit",
        {
          dimensionScores: Object.fromEntries(keys.map((key) => [key, 50])),
        },
        locale,
      );
      expect(report.sections).toHaveLength(keys.length);
      for (const section of report.sections) {
        expect(section.paragraphs).toHaveLength(3);
        expect(section.paragraphs[0].length).toBeGreaterThan(20);
        expect(section.actionItems[0].length).toBeGreaterThan(20);
      }
      expect(new Set(report.sections.map((section) => section.actionItems[0])).size).toBe(
        keys.length,
      );
    }
  });

  it("changes the interpretation of low, middle and high responses without treating a preference as superior", () => {
    for (const locale of locales) {
      const summaries = [0, 50, 100].map(
        (value) =>
          buildHumanReport(
            "personality-map",
            {
              dimensionScores: { OPENNESS: value },
            },
            locale,
          ).sections[0].summary,
      );
      expect(new Set(summaries.map((text) => text.split("/100. ")[1])).size).toBe(3);
      const report = buildHumanReport("brainrank", { dimensionScores: { SPEED: 100 } }, locale);
      expect(report.sections[0].paragraphs[0]).toBe(
        localizedDimensionGuidance[locale].SPEED.meaning,
      );
    }
  });

  it("delivers localised descriptions instead of falling back to Portuguese or generic advice", () => {
    for (const locale of ["en", "es", "fr"] as const) {
      const report = buildHumanReport(
        "careerfit",
        { dimensionScores: { TECHNICAL: 80, CREATIVE: 30 } },
        locale,
      );
      expect(report.sections[0].paragraphs[0]).toBe(
        localizedDimensionGuidance[locale].TECHNICAL.meaning,
      );
      expect(report.sections[0].paragraphs[0]).not.toBe(dimensionGuidance.TECHNICAL.meaning);
      expect(report.sections[0].actionItems).not.toEqual(report.sections[1].actionItems);
    }
  });
});
