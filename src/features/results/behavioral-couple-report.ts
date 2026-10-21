import "server-only";
import { buildCoupleReport } from "./couple-report";
import { buildHumanReport } from "./human-report";
import type { BilateralCoupleComparison } from "@/features/scoring/coupledna";

/** Add only the requesting participant's evidence; never expose the other participant's choices. */
export function buildParticipantCoupleReport(
  comparison: BilateralCoupleComparison,
  ownScore: Record<string, unknown>,
  locale: string,
) {
  const report = buildCoupleReport(comparison, locale);
  if (ownScore.algorithmVersion !== "behavioral-v2") return report;
  const individual = buildHumanReport("coupledna", ownScore, locale);
  return {
    ...report,
    executiveSummary: `${report.executiveSummary} ${individual.executiveSummary}`,
    sections: [...report.sections, ...individual.sections],
  };
}
