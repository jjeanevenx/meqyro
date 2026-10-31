import { describe, expect, it } from "vitest";
import { buildExampleReport } from "@/features/results/example-report";
import { locales } from "@/lib/i18n/config";

for (const slug of ["moneydna", "coupledna"] as const) {
  describe(`${slug} public fictional report`, () => {
    for (const locale of locales) {
      it(`renders all five dimensions with real evidence and actions in ${locale}`, () => {
        const report = buildExampleReport(slug, locale);
        expect(report.sections).toHaveLength(5);
        expect(report.sections.every((section) => section.actionItems.length > 0)).toBe(true);
        expect(report.sections.flatMap((section) => section.keyTakeaways)).toHaveLength(20);
        expect(report.percentileRank).toBeUndefined();
        expect(buildExampleReport(slug, locale)).toEqual(report);
      });
    }
  });
}
