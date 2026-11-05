import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ResultView } from "@/components/patterns/result-view";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { locales } from "@/lib/i18n/config";

vi.stubGlobal("React", React);
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/components/patterns/couple-result-panel", () => ({ CoupleResultPanel: () => null }));

for (const locale of locales) {
  describe(`product-specific result explanation in ${locale}`, () => {
    const dict = getDictionary(locale);
    for (const accessLevel of ["FREE_PARTIAL", "PREMIUM_UNLOCKED"] as const) {
      it(`keeps relationship explanations out of MoneyDNA (${accessLevel})`, () => {
        const html = renderToStaticMarkup(
          React.createElement(ResultView, {
            summary: {
              sessionId: "fictional-session",
              quizSlug: "moneydna",
              quizVersion: "v2.0.0",
              scoringVersion: "behavioral-v2",
              strongestDimension: "GUARDIAN",
              dimensionScores: { GUARDIAN: 56, BUILDER: 20 },
            },
            accessLevel,
            locale,
          }),
        );
        expect(html).toContain(dict.resultView.behavioralCaveat);
        expect(html).not.toContain("CoupleDNA");
        expect(html).not.toContain(dict.resultView.behavioralCoupleCaveat);
      });
    }
    it("preserves the relationship explanation in CoupleDNA", () => {
      const html = renderToStaticMarkup(
        React.createElement(ResultView, {
          summary: {
            sessionId: "fictional-session",
            quizSlug: "coupledna",
            quizVersion: "v2.0.0",
            scoringVersion: "behavioral-v2",
            dimensionScores: { COMMUNICATION: 50 },
          },
          accessLevel: "FREE_PARTIAL",
          locale,
        }),
      );
      expect(html).toContain(dict.resultView.behavioralCoupleCaveat);
      expect(html).not.toContain(dict.resultView.behavioralCaveat);
    });
  });
}
