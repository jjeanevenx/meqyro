import "server-only";
import { moneyDnaScenarios } from "@/content/quizzes/moneydna-v2";
import { coupleDnaScenarios } from "@/content/quizzes/coupledna-v2";
import { scoreBehavioralV2 } from "@/features/scoring/behavioral-v2";
import { buildBehavioralReport } from "@/features/results/behavioral-report";
import type { Locale } from "@/lib/i18n/config";

/** Public, deterministic fiction. Never reads sessions, results, grants or payments. */
export function buildExampleReport(slug: "moneydna" | "coupledna", locale: Locale) {
  const source = slug === "moneydna" ? moneyDnaScenarios : coupleDnaScenarios;
  const items = source.map((question) => ({
    id: question.stableKey,
    stableKey: question.stableKey,
    options: question.options.map((option) => ({ ...option, id: option.stableKey })),
  }));
  const answers = items.map((item, index) => ({
    questionId: item.id,
    optionId: item.options[index % item.options.length].id,
  }));
  return buildBehavioralReport(slug, scoreBehavioralV2(slug, items, answers), locale);
}
