import "server-only";
import { buildHumanReport as buildComprehensiveReport } from "./human-report";
import { findPaidEntitlement } from "@/features/commerce/entitlement-service";
import { getCoupleState } from "@/features/couple/couple-service";
import { buildCoupleReport } from "./couple-report";

import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { matchesAnonymousSessionToken } from "@/lib/security/anonymous-session";
import { formatMoney } from "@/lib/market/prices";
import { isMarket, resolveMarketContext, type Market } from "@/lib/market/market-context";
import { isLocale } from "@/lib/i18n/config";
import type { AccessLevel, PaywallOffer, ProtectedResultResponse } from "./contracts";
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
      market,
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
    market?: string;
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
  if (!isMarket(sessionRecord.market)) {
    throw new Error("Mercado da sessão inválido.");
  }
  const offerMarket = resolveMarketContext({
    locale: isLocale(input.locale) ? input.locale : "en",
    market: sessionRecord.market,
  }).market;
  const score = (resultRecord.score as Record<string, unknown>) ?? {};
  const dimensionScores =
    (score.dimensionScores as Record<string, number>) ??
    (score.archetypeScores as Record<string, number>) ??
    (score.styleScores as Record<string, number>) ??
    (score.styleDistribution as Record<string, number>) ??
    undefined;
  const strongestScoredDimension = dimensionScores
    ? Object.entries(dimensionScores).sort((a, b) => b[1] - a[1])[0]?.[0]
    : undefined;

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
                : strongestScoredDimension,
    dimensionScores,
  };

  // 4. Check for premium access grant in result_access_grants
  const entitlement = await findPaidEntitlement(input.sessionId, productCode);
  const hasPremiumGrant = Boolean(entitlement);
  const coupleState = quizSlug === "coupledna" ? await getCoupleState(input.sessionId) : undefined;
  const couple = coupleState
    ? {
        state: coupleState.state,
        inviteCode: coupleState.inviteCode,
        consentGiven: coupleState.consentGiven,
      }
    : undefined;
  const accessLevel: AccessLevel = hasPremiumGrant ? "PREMIUM_UNLOCKED" : "FREE_PARTIAL";

  // 5. If premium granted, return report with zero leakage prior to grant
  if (hasPremiumGrant) {
    const { data: covered } = await supabase
      .from("result_access_grants")
      .select("product_code")
      .eq("order_id", entitlement!.orderId);
    const { data: included } = await supabase
      .from("quizzes")
      .select("slug")
      .in(
        "product_code",
        (covered ?? []).map((row) => row.product_code),
      );
    const premiumReport = coupleState
      ? coupleState.state === "READY"
        ? buildCoupleReport(coupleState.comparison, input.locale)
        : undefined
      : buildComprehensiveReport(quizSlug, score, input.locale);
    return {
      sessionId: input.sessionId,
      quizSlug,
      accessLevel,
      summary,
      premiumReport,
      couple,
      includedQuizzes: included?.map((row) => row.slug),
    };
  }

  // 6. Otherwise build paywall offer and omit premium payload completely
  const { data: priceRecord } = await supabase
    .from("product_prices")
    .select("amount, currency")
    .eq("quiz_id", quizId)
    .eq("market", offerMarket)
    .eq("active", true)
    .single();

  if (!priceRecord) throw new Error(`Preço não configurado para o mercado ${offerMarket}.`);
  const amount = priceRecord.amount;
  const currency = priceRecord.currency;
  const formattedPrice = formatMoney(amount, currency, input.locale);

  const paywall: PaywallOffer = {
    productCode,
    quizSlug,
    amount,
    currency,
    formattedPrice,
    headline: getPaywallHeadline(quizSlug, input.locale),
    features: getPaywallFeatures(quizSlug, input.locale),
    market: offerMarket,
  };

  return {
    sessionId: input.sessionId,
    quizSlug,
    accessLevel,
    summary,
    paywall,
    couple,
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
      "Forças predominantes e potenciais pontos cegos",
      "Recomendações personalizadas",
      "Plano de ação prático",
      "Síntese para download",
      "Resultado completo por e-mail",
    ],
    en: [
      "In-depth analysis of every evaluated dimension",
      "Strengths and potential blind spots",
      "Personalized recommendations",
      "Practical action plan",
      "Downloadable summary",
      "Full result by email",
    ],
    es: [
      "Análisis en profundidad de cada dimensión evaluada",
      "Fortalezas clave y puntos ciegos potenciales",
      "Recomendaciones personalizadas",
      "Plan de acción práctico",
      "Resumen descargable",
      "Resultado completo por correo",
    ],
    fr: [
      "Analyse approfondie de chaque dimension évaluée",
      "Points forts et angles morts potentiels",
      "Recommandations personnalisées",
      "Plan d'action pratique",
      "Synthèse téléchargeable",
      "Résultat complet par e-mail",
    ],
  };

  return genericFeatures[locale] ?? genericFeatures.pt;
}

export { buildHumanReport as buildComprehensiveReport } from "./human-report";
