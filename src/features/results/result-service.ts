import "server-only";

import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { matchesAnonymousSessionToken } from "@/lib/security/anonymous-session";
import { formatMoney } from "@/lib/market/prices";
import type { Market } from "@/lib/market/market-context";
import type {
  AccessLevel,
  ComprehensiveReport,
  PaywallOffer,
  ProtectedResultResponse,
} from "./contracts";
import type { PartialResultSummary } from "@/features/quiz-engine/contracts";

export async function getProtectedResult(input: {
  sessionId: string;
  sessionToken: string;
  locale: string;
  market: Market;
}): Promise<ProtectedResultResponse> {
  const supabase = createSupabaseSecretClient();

  // 1. Load session & quiz metadata
  const { data: session, error: sessionError } = await supabase
    .from("quiz_sessions")
    .select(
      `
      id,
      access_token_hash,
      status,
      quiz_version,
      scoring_version,
      quiz_versions(quiz_id, quizzes(id, slug, product_code))
    `,
    )
    .eq("id", input.sessionId)
    .single();

  if (sessionError || !session) {
    throw new Error(`Sessão não encontrada: ${sessionError?.message ?? "vazio"}`);
  }

  if (!matchesAnonymousSessionToken(input.sessionToken, session.access_token_hash)) {
    throw new Error("Token de acesso inválido.");
  }

  // 2. Load stored result
  const { data: resultRecord, error: resultError } = await supabase
    .from("results")
    .select("id, score")
    .eq("session_id", input.sessionId)
    .single();

  if (resultError || !resultRecord) {
    throw new Error("Resultado ainda não calculado para esta sessão.");
  }

  type SessionVersions = {
    quiz_versions?: {
      quiz_id?: string;
      quizzes?: {
        id?: string;
        slug?: string;
        product_code?: string;
      };
    };
  };
  const sessionRecord = session as unknown as SessionVersions;
  const quizId = sessionRecord.quiz_versions?.quiz_id ?? sessionRecord.quiz_versions?.quizzes?.id;
  const quizSlug = sessionRecord.quiz_versions?.quizzes?.slug ?? "brainrank";
  const productCode = sessionRecord.quiz_versions?.quizzes?.product_code ?? "BRAINRANK";
  const score = (resultRecord.score as Record<string, unknown>) ?? {};

  // 3. Format partial summary (safe for free tier)
  const summary: PartialResultSummary = {
    sessionId: input.sessionId,
    quizSlug,
    quizVersion: session.quiz_version,
    scoringVersion: session.scoring_version,
    rawScore: typeof score.rawCorrect === "number" ? score.rawCorrect : undefined,
    overallScore: typeof score.overallScore === "number" ? score.overallScore : undefined,
    strongestDimension:
      typeof score.strongestDimension === "string"
        ? score.strongestDimension
        : typeof score.primaryAnchor === "string"
          ? score.primaryAnchor
          : typeof score.dominantArchetype === "string"
            ? score.dominantArchetype
            : typeof score.primaryStyle === "string"
              ? score.primaryStyle
              : typeof score.dominantStyle === "string"
                ? score.dominantStyle
                : "PATTERN_RECOGNITION",
    dimensionScores:
      (score.dimensionScores as Record<string, number>) ??
      (score.archetypeScores as Record<string, number>) ??
      (score.styleScores as Record<string, number>) ??
      (score.styleDistribution as Record<string, number>) ??
      undefined,
  };

  // 4. Check for premium access grant in result_access_grants
  const { data: grants } = await supabase
    .from("result_access_grants")
    .select("id, grant_type")
    .eq("session_id", input.sessionId)
    .in("grant_type", ["PREMIUM_REPORT", "PREMIUM_BUNDLE"]);

  const hasPremiumGrant = Boolean(grants && grants.length > 0);
  const accessLevel: AccessLevel = hasPremiumGrant ? "PREMIUM_UNLOCKED" : "FREE_PARTIAL";

  // 5. If premium granted, return report with zero leakage prior to grant
  if (hasPremiumGrant) {
    const premiumReport = buildComprehensiveReport(quizSlug, score, input.locale);
    return {
      sessionId: input.sessionId,
      quizSlug,
      accessLevel,
      summary,
      premiumReport,
    };
  }

  // 6. Otherwise build paywall offer and omit premium payload completely
  const { data: priceRecord } = await supabase
    .from("product_prices")
    .select("amount, currency")
    .eq("quiz_id", quizId)
    .eq("market", input.market)
    .eq("active", true)
    .single();

  const amount = priceRecord?.amount ?? 1290;
  const currency = priceRecord?.currency ?? "BRL";
  const formattedPrice = formatMoney(amount, currency, input.locale);

  const paywall: PaywallOffer = {
    productCode,
    quizSlug,
    amount,
    currency,
    formattedPrice,
    headline: getPaywallHeadline(quizSlug, input.locale),
    features: getPaywallFeatures(quizSlug, input.locale),
  };

  return {
    sessionId: input.sessionId,
    quizSlug,
    accessLevel,
    summary,
    paywall,
  };
}

function getPaywallHeadline(quizSlug: string, locale: string): string {
  const titles: Record<string, Record<string, string>> = {
    brainrank: {
      pt: "Desbloqueie seu Relatório Cognitivo Completo",
      en: "Unlock your Full Cognitive Report",
      es: "Desbloquea tu Informe Cognitivo Completo",
      fr: "Débloquez votre Rapport Cognitif Complet",
    },
    "personality-map": {
      pt: "Desbloqueie seu Mapeamento de Personalidade Profundo",
      en: "Unlock your In-depth Personality Report",
      es: "Desbloquea tu Informe de Personalidad Detallado",
      fr: "Débloquez votre Rapport de Personnalité Approfondi",
    },
    careerfit: {
      pt: "Desbloqueie seu Guia de Âncoras Profissionais",
      en: "Unlock your Professional Anchors Guide",
      es: "Desbloquea tu Guía de Anclas Profesionales",
      fr: "Débloquez votre Guide des Ancres Professionnelles",
    },
    moneydna: {
      pt: "Desbloqueie seu Diagnóstico de Arquétipo Financeiro",
      en: "Unlock your Financial Archetype Breakdown",
      es: "Desbloquea tu Diagnóstico de Arquetipo Financiero",
      fr: "Débloquez votre Diagnostic d'Archétype Financier",
    },
    focusstyle: {
      pt: "Desbloqueie seu Manual de Estilo de Foco & Produtividade",
      en: "Unlock your Focus & Productivity Style Manual",
      es: "Desbloquea tu Manual de Estilo de Enfoque y Productividad",
      fr: "Débloquez votre Manuel de Style de Focus & Productivité",
    },
    decisiondna: {
      pt: "Desbloqueie sua Matriz Estratégica de Decisão",
      en: "Unlock your Strategic Decision-Making Matrix",
      es: "Desbloquea tu Matriz Estratégica de Decisión",
      fr: "Débloquez votre Matrice Stratégique de Décision",
    },
    coupledna: {
      pt: "Desbloqueie o Relatório Comparativo de Harmonia de Casal",
      en: "Unlock your Couple Harmony Comparative Report",
      es: "Desbloquea el Informe Comparativo de Armonía de Pareja",
      fr: "Débloquez le Rapport Comparatif d'Harmonie de Couple",
    },
  };

  const selected = titles[quizSlug] ?? titles.brainrank;
  return selected[locale] ?? selected.pt;
}

function getPaywallFeatures(quizSlug: string, locale: string): string[] {
  const genericFeatures: Record<string, string[]> = {
    pt: [
      "Análise aprofundada de todas as dimensões avaliadas",
      "Mapeamento de forças predominantes e pontos cegos operacionais",
      "Recomendações práticas e estratégias de desenvolvimento",
      "Guia de aplicação no dia a dia e tomadas de decisão",
      "Acesso vitalício e opção de exportação em PDF",
    ],
    en: [
      "In-depth analysis across all evaluated dimensions",
      "Mapping of core strengths and operational blind spots",
      "Actionable recommendations and self-growth strategies",
      "Practical daily application and decision frameworks",
      "Lifetime access with downloadable summary",
    ],
    es: [
      "Análisis en profundidad de todas las dimensiones evaluadas",
      "Mapa de fortalezas clave y áreas de fricción",
      "Recomendaciones prácticas y planes de acción",
      "Marcos de aplicación en el día a día",
      "Acceso de por vida y resumen descargable",
    ],
    fr: [
      "Analyse approfondie de toutes les dimensions évaluées",
      "Cartographie des forces clés et zones de friction",
      "Recommandations concrètes et axes d'amélioration",
      "Guide pratique d'application au quotidien",
      "Accès à vie et synthèse téléchargeable",
    ],
  };

  return genericFeatures[locale] ?? genericFeatures.pt;
}

export function buildComprehensiveReport(
  quizSlug: string,
  score: Record<string, unknown>,
  locale: string,
): ComprehensiveReport {
  const overall = typeof score.overallScore === "number" ? score.overallScore : 750;

  // Localized non-clinical disclaimers
  const disclaimers: Record<string, string> = {
    pt: "Este relatório destina-se exclusivamente ao autoconhecimento e reflexão pessoal, não constituindo avaliação psicológica, diagnóstica, clínica ou aconselhamento financeiro.",
    en: "This report is intended solely for personal reflection and self-discovery. It does not constitute clinical, diagnostic, psychological or financial advice.",
    es: "Este informe está destinado exclusivamente al autoconocimiento y la reflexión personal, sin constituir una evaluación clínica, psicológica o financiera.",
    fr: "Ce rapport est destiné exclusivement à l'autoréflexion et au développement personnel. Il ne constitue aucunement un avis clinique, psychologique ou financier.",
  };

  const disclaimer = disclaimers[locale] ?? disclaimers.pt;

  if (quizSlug === "brainrank") {
    const executiveSummaries: Record<string, string> = {
      pt: `Seu índice geral atingiu ${overall}/1000. Sua arquitetura de raciocínio destaca-se pela alta agilidade analítica e consistência dedutiva, mantendo excelente precisão mesmo em contextos de desafio e restrição de tempo.`,
      en: `Your overall index reached ${overall}/1000. Your reasoning architecture is characterized by strong analytical agility and deductive consistency.`,
      es: `Tu índice general alcanzó ${overall}/1000. Tu arquitectura de razonamiento destaca por una gran agilidad analítica y coherencia lógica.`,
      fr: `Votre indice global a atteint ${overall}/1000. Votre profil se caractérise par une forte agilité analytique et une rigueur déductive.`,
    };

    return {
      executiveSummary: executiveSummaries[locale] ?? executiveSummaries.pt,
      percentileRank: Math.min(Math.round((overall / 1000) * 100), 99),
      bandLabel: overall >= 800 ? "Superior" : overall >= 650 ? "Acima da Média" : "Média Sólida",
      sections: [
        {
          id: "cognitive-strengths",
          title: locale === "en" ? "Primary Cognitive Strengths" : "Pontos Fortes Cognitivos",
          summary:
            locale === "en"
              ? "Exceptional ability to dissect complex visual puzzles and logical sequences."
              : "Capacidade avançada de decodificar padrões abstratos e deduções rigorosas.",
          paragraphs: [
            locale === "en"
              ? "You demonstrate swift pattern abstraction, identifying transformation rules across multi-element sequences without getting distracted by surface noise."
              : "Você demonstra rápida abstração de padrões, identificando regras de transformação em sequências complexas sem se dispersar com ruídos visuais superficiais.",
          ],
          keyTakeaways: [
            locale === "en" ? "High deductive accuracy" : "Elevada precisão dedutiva",
            locale === "en" ? "Fast pattern identification" : "Rápido reconhecimento de padrões",
          ],
          actionItems: [
            locale === "en"
              ? "Apply your structural deduction to high-stakes strategic planning."
              : "Aplique sua dedução estrutural em tarefas de planejamento estratégico e resolução de problemas complexos.",
          ],
        },
      ],
      comparativeBenchmark: {
        cohort:
          locale === "en"
            ? "Qualitative Developmental Scale"
            : "Escala de Desenvolvimento Qualitativo",
        percentile: Math.min(Math.round((overall / 1000) * 100), 99),
        description: disclaimer,
      },
    };
  }

  if (quizSlug === "coupledna") {
    return {
      executiveSummary:
        locale === "en"
          ? "Your bilateral couple profile highlights complementary communication channels and shared fundamental life values."
          : "O perfil bilateral conjugal destaca canais complementares de comunicação e alinhamento de valores fundamentais de vida.",
      percentileRank: 90,
      bandLabel: locale === "en" ? "High Alignment" : "Alta Sinergia",
      sections: [
        {
          id: "bilateral-communication",
          title:
            locale === "en"
              ? "Communication & Conflict Navigation"
              : "Comunicação e Navegação de Conflitos",
          summary:
            locale === "en"
              ? "Open dialogues coupled with mutual respect during divergent viewpoints."
              : "Diálogos abertos associados a respeito mútuo em momentos de divergência de perspectivas.",
          paragraphs: [
            locale === "en"
              ? "Both partners demonstrate willingness to explore common ground while maintaining individual identity and personal boundaries."
              : "Ambos os parceiros demonstram disposição para construir consensos produtivos preservando sua autonomia e limites individuais.",
          ],
          keyTakeaways: [
            locale === "en" ? "Constructive active listening" : "Escuta ativa e construtiva",
          ],
          actionItems: [
            locale === "en"
              ? "Maintain scheduled weekly check-ins for transparent long-term planning."
              : "Reserve momentos periódicos de alinhamento transparente sobre metas e expectativas de longo prazo.",
          ],
        },
      ],
      comparativeBenchmark: {
        cohort:
          locale === "en" ? "Relational Growth Matrix" : "Matriz de Desenvolvimento Relacional",
        percentile: 90,
        description: disclaimer,
      },
    };
  }

  // Default report for personality-map, careerfit, moneydna, focusstyle, decisiondna
  return {
    executiveSummary:
      locale === "en"
        ? `Your comprehensive ${quizSlug.toUpperCase()} profile provides strategic insights into behavioral tendencies, core motivators, and situational decision patterns.`
        : `Seu relatório analítico de ${quizSlug.toUpperCase()} oferece insights estratégicos sobre suas tendências comportamentais, motivadores centrais e padrões situacionais de decisão.`,
    percentileRank: 85,
    bandLabel: locale === "en" ? "Distinct Profile" : "Perfil Estruturado",
    sections: [
      {
        id: "core-profile",
        title: locale === "en" ? "Core Patterns & Tendencies" : "Padrões Centrais e Tendências",
        summary:
          locale === "en"
            ? "Strong alignment between self-awareness and practical execution."
            : "Elevado alinhamento entre clareza de preferências e consistência de execução.",
        paragraphs: [
          locale === "en"
            ? "Your assessment reveals marked consistency across primary indicators, guiding optimal operating environments and relationship dynamics."
            : "Sua avaliação revela consistência nos indicadores primários, permitindo identificar os ambientes ideais de atuação e sinergia interpessoal.",
        ],
        keyTakeaways: [
          locale === "en" ? "High consistency in decisions" : "Consistência e foco de atuação",
        ],
        actionItems: [
          locale === "en"
            ? "Leverage your primary profile tendencies in collaborative projects."
            : "Aproveite suas tendências dominantes em iniciativas de alta complexidade e colaboração.",
        ],
      },
    ],
    comparativeBenchmark: {
      cohort:
        locale === "en"
          ? "Behavioral Taxonomy & Frameworks"
          : "Taxonomia Comportamental e Metodologias",
      percentile: 85,
      description: disclaimer,
    },
  };
}
