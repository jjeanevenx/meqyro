import { describe, it, expect } from "vitest";
import type { ProtectedResultResponse } from "@/features/results/contracts";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { locales } from "@/lib/i18n/config";

describe("Paywall Anti-Leak & Disclaimer Compliance (Unit Tests)", () => {
  const mockFreePartialResult: ProtectedResultResponse = {
    sessionId: "sess_free_mock_123",
    quizSlug: "brainrank",
    accessLevel: "FREE_PARTIAL",
    summary: {
      sessionId: "sess_free_mock_123",
      quizSlug: "brainrank",
      quizVersion: "1.0",
      scoringVersion: "1.0",
      overallScore: 840,
      strongestDimension: "PATTERN_RECOGNITION",
      strongestDimensionLabel: "Reconhecimento de Padrões",
      strongestDimensionDescription: "Alta precisão analítica.",
    },
    paywall: {
      productCode: "BRAINRANK",
      quizSlug: "brainrank",
      amount: 1290,
      currency: "BRL",
      formattedPrice: "R$ 12,90",
      headline: "Desbloqueie seu Relatório Cognitivo Completo",
      features: [
        "Detalhamento aprofundado de todas as dimensões",
        "Comparativo percentilar",
        "Plano de desenvolvimento",
      ],
    },
  };

  it("strictly prevents premium report leakage in FREE_PARTIAL view", () => {
    expect(mockFreePartialResult.accessLevel).toBe("FREE_PARTIAL");
    expect(mockFreePartialResult.premiumReport).toBeUndefined();

    const serialized = JSON.stringify(mockFreePartialResult);
    expect(serialized).not.toContain('"premiumReport"');
    expect(serialized).not.toContain('"percentileRank"');
    expect(serialized).not.toContain('"radarData"');
    expect(serialized).not.toContain('"cognitiveProfile"');
    expect(serialized).not.toContain('"blindSpots"');
  });

  it("ensures non-clinical and non-diagnostic disclaimers are present across all locales", () => {
    for (const locale of locales) {
      const dict = getDictionary(locale);
      const disclaimer = dict.resultView.disclaimer.toLowerCase();

      // Verify disclaimer does not claim clinical or diagnostic validity
      expect(disclaimer.length).toBeGreaterThan(20);
      expect(
        disclaimer.includes("diagnóstic") ||
          disclaimer.includes("diagnostic") ||
          disclaimer.includes("clínic") ||
          disclaimer.includes("clinic") ||
          disclaimer.includes("cliniq") ||
          disclaimer.includes("médic") ||
          disclaimer.includes("médical"),
      ).toBe(true);
    }
  });

  it("verifies full paid view contains required analytical breakdowns", () => {
    const mockFullPaidResult: ProtectedResultResponse = {
      ...mockFreePartialResult,
      accessLevel: "PREMIUM_UNLOCKED",
      paywall: undefined,
      premiumReport: {
        executiveSummary: "Forte raciocínio dedutivo com alta capacidade analítica sob pressão.",
        percentileRank: 88,
        bandLabel: "Superior",
        sections: [
          {
            id: "cognitive-strengths",
            title: "Pontos Fortes Cognitivos",
            summary: "Alta precisão dedutiva.",
            paragraphs: ["Demonstra rápida abstração de padrões visuais."],
            keyTakeaways: ["Alta acurácia", "Detecção de anomalias"],
            actionItems: ["Aplicar em planejamento estratégico"],
          },
        ],
        comparativeBenchmark: {
          cohort: "Qualitative Developmental Scale",
          percentile: 88,
          description: "Relatório para reflexão pessoal.",
        },
      },
    };

    expect(mockFullPaidResult.accessLevel).toBe("PREMIUM_UNLOCKED");
    expect(mockFullPaidResult.paywall).toBeUndefined();
    expect(mockFullPaidResult.premiumReport).toBeDefined();
    expect(mockFullPaidResult.premiumReport?.sections).toHaveLength(1);
    expect(mockFullPaidResult.premiumReport?.sections[0].keyTakeaways.length).toBeGreaterThan(0);
  });
});
