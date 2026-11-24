import "server-only";
import { moneyDnaScenarios } from "@/content/quizzes/moneydna-v2";
import { coupleDnaScenarios } from "@/content/quizzes/coupledna-v2";
import { legacyExpandedScenarios } from "@/content/quizzes/behavioral-expanded-legacy";
import {
  reviewedMoneyScenarios,
  reviewedCoupleScenarios,
} from "@/content/quizzes/behavioral-reviewed";
import { InvalidQuizSubmissionError } from "@/features/quiz-engine/contracts";
import type { ScenarioDefinition } from "@/content/quizzes/behavioral-scenario";

export type BehavioralInstrumentVersion = "v2.0.0" | "v3.0.0";
export const reviewedBehavioralVersion = "v3.0.0";

export function behavioralDefinition(
  slug: "moneydna" | "coupledna",
  version: string,
): readonly ScenarioDefinition[] {
  if (version === reviewedBehavioralVersion) {
    return slug === "moneydna" ? reviewedMoneyScenarios : reviewedCoupleScenarios;
  }
  if (version !== "v2.0.0") throw new InvalidQuizSubmissionError("Unknown behavioral instrument");
  const prefix = slug === "moneydna" ? "MD2_" : "CD2_";
  return [
    ...(slug === "moneydna" ? moneyDnaScenarios : coupleDnaScenarios),
    ...legacyExpandedScenarios.filter((q) => q.stableKey.startsWith(prefix)),
  ];
}
