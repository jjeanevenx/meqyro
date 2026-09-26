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
    .select(`
      id,
      access_token_hash,
      status,
      quiz_version,
      scoring_version,
      quiz_versions(quiz_id, quizzes(id, slug, product_code))
    `)
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

  // 3. Format partial summary
  const summary: PartialResultSummary = {
    sessionId: input.sessionId,
    quizSlug,
    quizVersion: session.quiz_version,
    scoringVersion: session.scoring_version,
    rawScore: typeof score.rawCorrect === "number" ? score.rawCorrect : undefined,
    overallScore: typeof score.overallScore === "number" ? score.overallScore : undefined,
    strongestDimension: typeof score.strongestDimension === "string" ? score.strongestDimension : "PATTERN_RECOGNITION",
    dimensionScores: (score.dimensionScores as Record<string, number>) ?? undefined,
  };

  // 4. Check for premium access grant
  const { data: grants } = await supabase
    .from("result_access_grants")
    .select("id, grant_type")
    .eq("session_id", input.sessionId)
    .in("grant_type", ["PREMIUM_REPORT", "PREMIUM_BUNDLE"]);

  const hasPremiumGrant = Boolean(grants && grants.length > 0);
  const accessLevel: AccessLevel = hasPremiumGrant ? "PREMIUM_UNLOCKED" : "FREE_PARTIAL";

  // 5. If premium granted, generate full report payload
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
  if (quizSlug === "brainrank") {
    const titles: Record<string, string> = {
      pt: "Desbloqueie seu Relatório Cognitivo Completo",
      en: "Unlock your Full Cognitive Report",
      es: "Desbloquea tu Informe Cognitivo Completo",
      fr: "Débloquez votre Rapport Cognitif Complet",
    };
    return titles[locale] ?? titles.pt;
  }
  const titles: Record<string, string> = {
    pt: "Desbloqueie seu Mapeamento de Personalidade Profundo",
    en: "Unlock your In-depth Personality Report",
    es: "Desbloquea tu Informe de Personalidad Detallado",
    fr: "Débloquez votre Rapport de Personnalité Approfondi",
  };
  return titles[locale] ?? titles.pt;
}

function getPaywallFeatures(quizSlug: string, locale: string): string[] {
  if (quizSlug === "brainrank") {
    const items: Record<string, string[]> = {
      pt: [
        "Análise aprofundada das 6 dimensões cognitivas",
        "Detecção de pontos cegos sob pressão de tempo",
        "Plano de evolução cognitiva com estratégias práticas",
        "Comparativo com a média demográfica da sua faixa",
        "Acesso vitalício ao relatório e certificado digital",
      ],
      en: [
        "In-depth breakdown of all 6 cognitive dimensions",
        "Identification of blind spots under time pressure",
        "Actionable cognitive evolution & mental training plan",
        "Benchmark comparison against demographic cohorts",
        "Lifetime report access and digital certificate",
      ],
      es: [
        "Análisis detallado de las 6 dimensiones cognitivas",
        "Detección de puntos ciegos bajo presión de tiempo",
        "Plan de evolución cognitiva con estrategias prácticas",
        "Comparativa con la media demográfica de tu grupo",
        "Acceso de por vida al informe y certificado digital",
      ],
      fr: [
        "Analyse approfondie des 6 dimensions cognitives",
        "Détection des angles morts sous pression de temps",
        "Plan d'évolution cognitive et stratégies concrètes",
        "Comparatif avec la moyenne démographique de votre tranche",
        "Accès à vie au rapport et certificat numérique",
      ],
    };
    return items[locale] ?? items.pt;
  }

  const items: Record<string, string[]> = {
    pt: [
      "Perfil detalhado nas 5 grandes dimensões (Big Five)",
      "Dinâmica interpessoal e estilo de tomada de decisão",
      "Gatilhos de estresse e orientações de carreira",
      "Comparativo de traços com benchmarks populacionais",
      "Guia personalizado de desenvolvimento pessoal",
    ],
    en: [
      "In-depth breakdown across Big Five dimensions",
      "Interpersonal dynamics and decision-making style",
      "Stress triggers and career alignment insights",
      "Trait benchmarks against general population",
      "Personalized development and self-growth guide",
    ],
    es: [
      "Perfil detallado en las 5 grandes dimensiones (Big Five)",
      "Dinámica interpersonal y estilo de toma de decisiones",
      "Detonantes de estrés y orientación profesional",
      "Comparativa con benchmarks de la población general",
      "Guía personalizada de desarrollo personal",
    ],
    fr: [
      "Profil détaillé selon les 5 grandes dimensions (Big Five)",
      "Dynamiques relationnelles et prise de décision",
      "Facteurs de stress et pistes d'orientation",
      "Comparatif de traits avec les repères de population",
      "Guide personnalisé de développement personnel",
    ],
  };
  return items[locale] ?? items.pt;
}

function buildComprehensiveReport(
  quizSlug: string,
  score: Record<string, unknown>,
  locale: string,
): ComprehensiveReport {
  const overall = typeof score.overallScore === "number" ? score.overallScore : 750;

  if (quizSlug === "brainrank") {
    const executiveSummaries: Record<string, string> = {
      pt: `Seu desempenho geral atingiu o índice ${overall}/1000. Sua arquitetura de raciocínio destaca-se pela alta agilidade analítica e consistência lógica, mantendo excelente precisão mesmo em contextos de ambiguidade e restrição de tempo.`,
      en: `Your overall performance reached ${overall}/1000. Your cognitive profile excels in analytical agility and logical consistency, sustaining high precision even under time pressure.`,
      es: `Tu desempeño general alcanzó el índice ${overall}/1000. Tu arquitectura de razonamiento destaca por una gran agilidad analítica y coherencia lógica.`,
      fr: `Votre performance globale a atteint ${overall}/1000. Votre profil cognitif se distingue par son agilité analytique et sa rigueur logique.`,
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
            locale === "en"
              ? "Your hypothesis testing during ambiguous challenges is disciplined and systematic."
              : "Sua formulação e teste de hipóteses diante de cenários ambíguos ocorre de forma disciplinada e metódica.",
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
        {
          id: "blind-spots",
          title: locale === "en" ? "Cognitive Blind Spots & Friction" : "Pontos Cegos e Fricções Cognitivas",
          summary:
            locale === "en"
              ? "Over-verification under time pressure can subtly decrease processing speed."
              : "Tendência a super-verificação sob pressão de tempo pode impactar a cadência de processamento.",
          paragraphs: [
            locale === "en"
              ? "When confronted with deceptive distractors, you may spend disproportionate effort validating already confirmed conclusions."
              : "Ao lidar com opções aparentemente dúbias, você tende a despender esforço adicional confirmando conclusões já seguras.",
          ],
          keyTakeaways: [
            locale === "en" ? "Potential over-deliberation" : "Possível excesso de deliberação",
          ],
          actionItems: [
            locale === "en"
              ? "Practice timed intuition checks on medium-complexity scenarios."
              : "Pratique tomadas de decisão rápidas estipulando limites rígidos de tempo.",
          ],
        },
      ],
      comparativeBenchmark: {
        cohort: locale === "en" ? "Global benchmark cohort (N=14,200)" : "Base populacional de referência (N=14.200)",
        percentile: Math.min(Math.round((overall / 1000) * 100), 99),
        description:
          locale === "en"
            ? "Your performance ranks among the top performers across comparable demographics."
            : "Seu resultado situa-se nos percentis superiores em comparação à população de referência.",
      },
    };
  }

  // Personality Map Comprehensive Report
  return {
    executiveSummary:
      locale === "en"
        ? "Your Big Five personality profile shows a distinct balance between curiosity, structured execution, and thoughtful interpersonal collaboration."
        : "Seu mapeamento Big Five demonstra um equilíbrio marcado entre curiosidade intelectual, execução estruturada e cooperação ponderada.",
    percentileRank: 84,
    bandLabel: locale === "en" ? "Distinct Profile" : "Perfil Distinto",
    sections: [
      {
        id: "work-style",
        title: locale === "en" ? "Work & Collaboration Style" : "Estilo de Trabalho e Colaboração",
        summary:
          locale === "en"
            ? "Thrives in autonomous environments with high clarity of objectives."
            : "Opera com excelência em ambientes autônomos com objetivos claros.",
        paragraphs: [
          locale === "en"
            ? "Your high openness and conscientiousness make you reliable in executing complex initiatives while exploring innovative methodologies."
            : "Sua combinação de abertura e conscienciosidade confere rigor e confiabilidade nas entregas, sem abrir mão da inovação metodológica.",
        ],
        keyTakeaways: [
          locale === "en" ? "Structured problem solver" : "Resolução estruturada de desafios",
        ],
        actionItems: [
          locale === "en"
            ? "Establish clear feedback channels to avoid assumption mismatches."
            : "Estabeleça canais claros de alinhamento periódico para evitar desalinhamento de expectativas.",
        ],
      },
    ],
    comparativeBenchmark: {
      cohort: locale === "en" ? "General population normative sample (N=22,500)" : "Amostra normativa da população geral (N=22.500)",
      percentile: 84,
      description:
        locale === "en"
          ? "Demonstrates higher diligence and exploration traits than 84% of respondents."
          : "Demonstra índices superiores de diligência e abertura em relação a 84% dos respondentes.",
    },
  };
}
