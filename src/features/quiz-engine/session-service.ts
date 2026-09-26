import "server-only";

import { createSupabaseSecretClient } from "@/lib/supabase/server";
import {
  createAnonymousSessionToken,
  hashAnonymousSessionToken,
  matchesAnonymousSessionToken,
  anonymousSessionTtlSeconds,
} from "@/lib/security/anonymous-session";
import type {
  ActiveSession,
  PartialResultSummary,
  ScoringAnswer,
} from "./contracts";
import { brainRankScoringV1, type BrainRankItem } from "@/features/scoring/brainrank";
import { personalityMapScoringV1, type PersonalityItem } from "@/features/scoring/personality-map";
import { careerFitScoringV1, type CareerFitItem } from "@/features/scoring/careerfit";
import { moneyDnaScoringV1, type MoneyDnaItem } from "@/features/scoring/moneydna";
import { focusStyleScoringV1, type FocusStyleItem } from "@/features/scoring/focusstyle";
import { decisionDnaScoringV1, type DecisionDnaItem, type DecisionStyleType } from "@/features/scoring/decisiondna";
import { coupleDnaScoringV1, type CoupleDnaItem } from "@/features/scoring/coupledna";
import { recordFunnelEvent } from "@/features/analytics/analytics-service";
import { recordReferralClick } from "@/features/referrals/referral-service";

export class SessionNotFoundError extends Error {
  constructor(message = "Session not found or expired") {
    super(message);
    this.name = "SessionNotFoundError";
  }
}

export class UnauthorizedSessionError extends Error {
  constructor(message = "Invalid session token") {
    super(message);
    this.name = "UnauthorizedSessionError";
  }
}

export class IncompleteQuizSubmissionError extends Error {
  constructor(message = "Not all questions have been answered") {
    super(message);
    this.name = "IncompleteQuizSubmissionError";
  }
}

export async function startQuizSession(input: {
  quizSlug: string;
  locale: string;
  market: string;
  referralCode?: string;
}): Promise<{ session: ActiveSession; token: string }> {
  const supabase = createSupabaseSecretClient();

  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("id, slug, product_code, quiz_versions!inner(id, version, scoring_version, status)")
    .eq("slug", input.quizSlug)
    .single();

  if (quizError || !quiz) {
    throw new SessionNotFoundError(`Quiz ${input.quizSlug} not found: ${quizError?.message ?? "empty data"} (code: ${quizError?.code})`);
  }

  type VersionRecord = {
    id: string;
    version: string;
    scoring_version: string;
    status: string;
  };

  const rawVersions = quiz.quiz_versions as unknown as VersionRecord | VersionRecord[];
  const versions = Array.isArray(rawVersions) ? rawVersions : [rawVersions];
  const activeVersion =
    versions.find((v) => v.status === "APPROVED" || v.status === "PUBLISHED") ??
    versions[0];

  if (!activeVersion) {
    throw new SessionNotFoundError(`No active version for ${input.quizSlug}`);
  }

  const token = createAnonymousSessionToken();
  const tokenHash = hashAnonymousSessionToken(token);
  const expiresAt = new Date(Date.now() + anonymousSessionTtlSeconds * 1000).toISOString();

  const { data: session, error: sessionError } = await supabase
    .from("quiz_sessions")
    .insert({
      quiz_version_id: activeVersion.id,
      quiz_version: activeVersion.version,
      scoring_version: activeVersion.scoring_version,
      locale: input.locale,
      market: input.market,
      status: "CREATED",
      access_token_hash: tokenHash,
      current_position: 1,
      expires_at: expiresAt,
      referral_code: input.referralCode ?? null,
    })
    .select("id, quiz_version_id, quiz_version, scoring_version, locale, market, status, current_position, expires_at")
    .single();

  if (sessionError || !session) {
    throw new Error(`Failed to create quiz session: ${sessionError?.message}`);
  }

  if (input.referralCode) {
    await recordReferralClick(input.referralCode).catch(() => {});
  }

  await recordFunnelEvent({
    eventName: "quiz_started",
    sessionId: session.id,
    quizSlug: input.quizSlug,
    locale: session.locale as "pt" | "en" | "es" | "fr",
    market: session.market as "BR" | "US" | "EU" | "GB",
    properties: {
      referral_code: input.referralCode,
    },
  }).catch(() => {});

  return {
    session: {
      id: session.id,
      quizVersionId: session.quiz_version_id,
      quizSlug: input.quizSlug,
      quizVersion: session.quiz_version,
      scoringVersion: session.scoring_version,
      locale: session.locale,
      market: session.market,
      status: session.status,
      currentPosition: session.current_position,
      expiresAt: session.expires_at,
      answers: {},
    },
    token,
  };
}

export async function getActiveSession(
  sessionId: string,
  token: string,
): Promise<ActiveSession | null> {
  const supabase = createSupabaseSecretClient();

  const { data: session, error } = await supabase
    .from("quiz_sessions")
    .select(`
      id,
      quiz_version_id,
      quiz_version,
      scoring_version,
      locale,
      market,
      status,
      access_token_hash,
      current_position,
      expires_at,
      quizzes:quiz_versions(quizzes(slug))
    `)
    .eq("id", sessionId)
    .single();

  if (error || !session) return null;

  if (!matchesAnonymousSessionToken(token, session.access_token_hash)) {
    throw new UnauthorizedSessionError();
  }

  if (new Date(session.expires_at) < new Date()) {
    return null;
  }

  const { data: answersData } = await supabase
    .from("answers")
    .select("question_id, option_id, numeric_value, duration_ms")
    .eq("session_id", sessionId);

  const answersMap: Record<string, { optionId?: string; numericValue?: number; durationMs?: number }> = {};
  for (const ans of answersData ?? []) {
    answersMap[ans.question_id] = {
      ...(ans.option_id ? { optionId: ans.option_id } : {}),
      ...(ans.numeric_value !== null ? { numericValue: ans.numeric_value } : {}),
      ...(ans.duration_ms !== null ? { durationMs: ans.duration_ms } : {}),
    };
  }

  const sessionRecord = session as unknown as { quizzes?: { quizzes?: { slug?: string } } };
  const quizSlug = sessionRecord?.quizzes?.quizzes?.slug ?? "brainrank";

  return {
    id: session.id,
    quizVersionId: session.quiz_version_id,
    quizSlug,
    quizVersion: session.quiz_version,
    scoringVersion: session.scoring_version,
    locale: session.locale,
    market: session.market,
    status: session.status,
    currentPosition: session.current_position,
    expiresAt: session.expires_at,
    answers: answersMap,
  };
}

export async function saveAnswer(input: {
  sessionId: string;
  token: string;
  questionId: string;
  optionId?: string;
  numericValue?: number;
  durationMs?: number;
  nextPosition?: number;
}): Promise<{ success: boolean; currentPosition: number }> {
  const supabase = createSupabaseSecretClient();

  const { data: session, error: sessionError } = await supabase
    .from("quiz_sessions")
    .select("id, status, access_token_hash, expires_at, current_position")
    .eq("id", input.sessionId)
    .single();

  if (sessionError || !session) {
    throw new SessionNotFoundError();
  }

  if (!matchesAnonymousSessionToken(input.token, session.access_token_hash)) {
    throw new UnauthorizedSessionError();
  }

  if (session.status === "COMPLETED" || session.status === "EXPIRED") {
    throw new Error("Cannot modify answers for completed or expired session");
  }

  if (new Date(session.expires_at) < new Date()) {
    throw new Error("Session has expired");
  }

  // Upsert answer
  const answerPayload: {
    session_id: string;
    question_id: string;
    option_id?: string | null;
    numeric_value?: number | null;
    duration_ms?: number | null;
    answered_at: string;
    updated_at: string;
  } = {
    session_id: input.sessionId,
    question_id: input.questionId,
    option_id: input.optionId ?? null,
    numeric_value: input.numericValue ?? null,
    duration_ms: input.durationMs ?? null,
    answered_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { error: upsertError } = await supabase
    .from("answers")
    .upsert(answerPayload, { onConflict: "session_id,question_id" });

  if (upsertError) {
    throw new Error(`Failed to save answer: ${upsertError.message}`);
  }

  const updatedPosition = input.nextPosition ?? session.current_position;

  await supabase
    .from("quiz_sessions")
    .update({
      status: "IN_PROGRESS",
      current_position: updatedPosition,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.sessionId);

  return { success: true, currentPosition: updatedPosition };
}

export async function completeQuizSession(input: {
  sessionId: string;
  token: string;
}): Promise<PartialResultSummary> {
  const supabase = createSupabaseSecretClient();

  const { data: session, error: sessionError } = await supabase
    .from("quiz_sessions")
    .select(`
      id,
      quiz_version_id,
      quiz_version,
      scoring_version,
      locale,
      market,
      status,
      access_token_hash,
      quizzes:quiz_versions(quizzes(slug))
    `)
    .eq("id", input.sessionId)
    .single();

  if (sessionError || !session) {
    throw new SessionNotFoundError();
  }

  if (!matchesAnonymousSessionToken(input.token, session.access_token_hash)) {
    throw new UnauthorizedSessionError();
  }

  const sessionRecord = session as unknown as { quizzes?: { quizzes?: { slug?: string } } };
  const quizSlug = sessionRecord?.quizzes?.quizzes?.slug ?? "brainrank";

  // If already completed, return existing result from DB
  if (session.status === "COMPLETED") {
    const { data: existingResult } = await supabase
      .from("results")
      .select("score")
      .eq("session_id", input.sessionId)
      .single();

    if (existingResult && existingResult.score) {
      return formatPartialResult(
        input.sessionId,
        quizSlug,
        session.quiz_version,
        session.scoring_version,
        existingResult.score as Record<string, unknown>,
        session.locale,
      );
    }
  }

  // Fetch all questions for this quiz version
  const { data: questions, error: qError } = await supabase
    .from("questions")
    .select("id, stable_key, position, scoring_key, options(id, stable_key, scoring_value)")
    .eq("quiz_version_id", session.quiz_version_id)
    .order("position", { ascending: true });

  if (qError || !questions || questions.length === 0) {
    throw new Error("Failed to load questions for scoring");
  }

  // Fetch all submitted answers
  const { data: answers, error: aError } = await supabase
    .from("answers")
    .select("question_id, option_id, numeric_value, duration_ms")
    .eq("session_id", input.sessionId);

  if (aError || !answers) {
    throw new Error("Failed to load answers for scoring");
  }

  if (answers.length < questions.length) {
    throw new IncompleteQuizSubmissionError(
      `Answered ${answers.length} of ${questions.length} questions required`,
    );
  }

  const scoringAnswers: ScoringAnswer[] = answers.map((a) => ({
    questionId: a.question_id,
    optionId: a.option_id ?? undefined,
    value: a.numeric_value ?? undefined,
    durationMs: a.duration_ms ?? undefined,
  }));

  type OptionData = {
    id: string;
    stable_key: string;
    scoring_value?: { isCorrect?: boolean } | null;
  };

  type QuestionData = {
    id: string;
    stable_key: string;
    position: number;
    scoring_key?: Record<string, string> | null;
    options?: OptionData[];
  };

  const rawQuestions = questions as unknown as QuestionData[];

  let calculatedScore: Record<string, unknown>;

  if (quizSlug === "brainrank") {
    const brainRankItems: BrainRankItem[] = rawQuestions.map((q) => {
      const options = Array.isArray(q.options) ? q.options : [];
      const correctOpt = options.find((opt) => opt.scoring_value?.isCorrect === true);
      const scoringKey = q.scoring_key ?? {};

      return {
        id: q.id,
        dimension: (scoringKey.dimension as BrainRankItem["dimension"]) ?? "PATTERN_RECOGNITION",
        difficulty: (scoringKey.difficulty as BrainRankItem["difficulty"]) ?? "MEDIUM",
        correctOptionId: correctOpt?.id ?? options[0]?.id ?? "",
      };
    });

    calculatedScore = brainRankScoringV1.score(brainRankItems, scoringAnswers) as unknown as Record<string, unknown>;
  } else if (quizSlug === "personality-map") {
    const personalityItems: PersonalityItem[] = rawQuestions.map((q) => {
      const scoringKey = q.scoring_key ?? {};
      return {
        id: q.id,
        dimension: (scoringKey.dimension as PersonalityItem["dimension"]) ?? "OPENNESS",
        direction: (scoringKey.direction as PersonalityItem["direction"]) ?? "DIRECT",
      };
    });

    calculatedScore = personalityMapScoringV1.score(personalityItems, scoringAnswers) as unknown as Record<string, unknown>;
  } else if (quizSlug === "careerfit") {
    const careerItems: CareerFitItem[] = rawQuestions.map((q) => ({
      id: q.id,
      stableKey: q.stable_key,
      dimension: (q.scoring_key?.dimension as CareerFitItem["dimension"]) ?? "TECHNICAL",
    }));
    const answersMap: Record<string, number> = {};
    for (const a of scoringAnswers) {
      if (a.value !== undefined) answersMap[a.questionId] = a.value;
    }
    calculatedScore = careerFitScoringV1.score(careerItems, answersMap) as unknown as Record<string, unknown>;
  } else if (quizSlug === "moneydna") {
    const moneyItems: MoneyDnaItem[] = rawQuestions.map((q) => ({
      id: q.id,
      stableKey: q.stable_key,
      archetype: (q.scoring_key?.archetype as MoneyDnaItem["archetype"]) ?? "BUILDER",
    }));
    const answersMap: Record<string, number> = {};
    for (const a of scoringAnswers) {
      if (a.value !== undefined) answersMap[a.questionId] = a.value;
    }
    calculatedScore = moneyDnaScoringV1.score(moneyItems, answersMap) as unknown as Record<string, unknown>;
  } else if (quizSlug === "focusstyle") {
    const focusItems: FocusStyleItem[] = rawQuestions.map((q) => ({
      id: q.id,
      stableKey: q.stable_key,
      style: (q.scoring_key?.style as FocusStyleItem["style"]) ?? "IMMERSIVE_HYPERFOCUS",
    }));
    const answersMap: Record<string, number> = {};
    for (const a of scoringAnswers) {
      if (a.value !== undefined) answersMap[a.questionId] = a.value;
    }
    calculatedScore = focusStyleScoringV1.score(focusItems, answersMap) as unknown as Record<string, unknown>;
  } else if (quizSlug === "decisiondna") {
    const decisionItems: DecisionDnaItem[] = rawQuestions.map((q) => {
      const optionStyleMap: Record<string, DecisionStyleType> = {};
      for (const opt of q.options ?? []) {
        if (opt.scoring_value && typeof opt.scoring_value === "object" && "style" in opt.scoring_value) {
          optionStyleMap[opt.id] = (opt.scoring_value as { style: DecisionStyleType }).style;
        }
      }
      return {
        id: q.id,
        stableKey: q.stable_key,
        optionStyleMap,
      };
    });
    const answersMap: Record<string, string> = {};
    for (const a of scoringAnswers) {
      if (a.optionId) answersMap[a.questionId] = a.optionId;
    }
    calculatedScore = decisionDnaScoringV1.score(decisionItems, answersMap) as unknown as Record<string, unknown>;
  } else if (quizSlug === "coupledna") {
    const coupleItems: CoupleDnaItem[] = rawQuestions.map((q) => ({
      id: q.id,
      stableKey: q.stable_key,
      dimension: (q.scoring_key?.dimension as CoupleDnaItem["dimension"]) ?? "COMMUNICATION",
    }));
    const answersMap: Record<string, number> = {};
    for (const a of scoringAnswers) {
      if (a.value !== undefined) answersMap[a.questionId] = a.value;
    }
    calculatedScore = coupleDnaScoringV1.scoreIndividual(coupleItems, answersMap) as unknown as Record<string, unknown>;
  } else {
    throw new Error(`Unsupported quiz for scoring: ${quizSlug}`);
  }

  // Snapshot input
  const inputSnapshot = {
    answers: scoringAnswers,
    completedAt: new Date().toISOString(),
  };

  // Insert result
  const { error: resultError } = await supabase
    .from("results")
    .insert({
      session_id: input.sessionId,
      quiz_version: session.quiz_version,
      scoring_version: session.scoring_version,
      score: calculatedScore,
      input_snapshot: inputSnapshot,
    });

  if (resultError) {
    throw new Error(`Failed to store result: ${resultError.message}`);
  }

  // Mark session as COMPLETED
  await supabase
    .from("quiz_sessions")
    .update({
      status: "COMPLETED",
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.sessionId);

  await recordFunnelEvent({
    eventName: "quiz_completed",
    sessionId: input.sessionId,
    quizSlug,
    locale: session.locale as "pt" | "en" | "es" | "fr",
    market: session.market as "BR" | "US" | "EU" | "GB",
    properties: {
      total_questions: questions.length,
    },
  }).catch(() => {});

  return formatPartialResult(
    input.sessionId,
    quizSlug,
    session.quiz_version,
    session.scoring_version,
    calculatedScore,
    session.locale,
  );
}

function formatPartialResult(
  sessionId: string,
  quizSlug: string,
  quizVersion: string,
  scoringVersion: string,
  score: Record<string, unknown>,
  locale: string,
): PartialResultSummary {
  if (quizSlug === "brainrank") {
    const dimensionLabels: Record<string, Record<string, string>> = {
      PATTERN_RECOGNITION: {
        pt: "Reconhecimento de Padrões",
        en: "Pattern Recognition",
        es: "Reconocimiento de Patrones",
        fr: "Reconnaissance de Motifs",
      },
      LOGICAL_REASONING: {
        pt: "Raciocínio Lógico",
        en: "Logical Reasoning",
        es: "Razonamiento Lógico",
        fr: "Raisonnement Logique",
      },
      NUMERICAL_REASONING: {
        pt: "Raciocínio Numérico",
        en: "Numerical Reasoning",
        es: "Razonamiento Numérico",
        fr: "Raisonnement Numérique",
      },
      ATTENTION: {
        pt: "Atenção e Foco",
        en: "Attention & Focus",
        es: "Atención y Enfoque",
        fr: "Attention et Concentration",
      },
      PROBLEM_SOLVING: {
        pt: "Resolução de Problemas",
        en: "Problem Solving",
        es: "Resolución de Problemas",
        fr: "Résolution de Problèmes",
      },
      SPEED: {
        pt: "Velocidade de Processamento",
        en: "Processing Speed",
        es: "Velocidad de Procesamiento",
        fr: "Vitesse de Traitement",
      },
    };

    const dimensionDescriptions: Record<string, Record<string, string>> = {
      PATTERN_RECOGNITION: {
        pt: "Você identifica relações visuais e lógicas com grande consistência, especialmente quando as regras se transformam entre etapas.",
        en: "You consistently identify visual and logical relationships, especially when rules evolve across steps.",
        es: "Identificas relaciones visuales y lógicas con gran consistencia, especialmente cuando las reglas se transforman entre etapas.",
        fr: "Vous identifiez des relations visuelles et logiques avec cohérence, en particulier lorsque les règles évoluent entre les étapes.",
      },
      LOGICAL_REASONING: {
        pt: "Sua capacidade de dedução lógica e silogística permite separar fatos seguros de suposições intuitivas enganosas.",
        en: "Your deductive reasoning allows you to distinguish certain facts from deceptive intuitive assumptions.",
        es: "Tu capacidad de deducción lógica te permite separar hechos ciertos de suposiciones intuitivas engañosas.",
        fr: "Votre capacité de déduction logique vous permet de séparer les faits certains des suppositions trompeuses.",
      },
      NUMERICAL_REASONING: {
        pt: "Você manipula proporções, progressões e relações quantitativas com rapidez e precisão analítica.",
        en: "You navigate proportions, progressions, and quantitative relationships with analytical speed and precision.",
        es: "Manejas proporciones, progresiones y relaciones cuantitativas con rapidez y precisión analítica.",
        fr: "Vous manipulez proportions, progressions et relations quantitatives avec rapidité et précision.",
      },
      ATTENTION: {
        pt: "Seu foco em detalhes minuciosos e detecção de anomalias permite filtrar ruídos irrelevantes com facilidade.",
        en: "Your focus on subtle details and anomaly detection filters out irrelevant noise with ease.",
        es: "Tu enfoque en detalles minuciosos y detección de anomalías filtra ruidos irrelevantes con facilidad.",
        fr: "Votre attention aux detalhes et à la détection d'anomalies filtre le bruit avec aisance.",
      },
      PROBLEM_SOLVING: {
        pt: "Você decompõe problemas complexos e aparentemente impossíveis em etapas estratégicas viáveis e elegantes.",
        en: "You break down seemingly impossible problems into viable, elegant strategic steps.",
        es: "Descompones problemas complejos y aparentemente imposibles en etapas estratégicas viables y elegantes.",
        fr: "Vous décomposez des problèmes complexes en étapes stratégiques viables et élégantes.",
      },
      SPEED: {
        pt: "Seu processamento mental opera em alto ritmo, com agilidade para responder a estímulos sob pressão de tempo.",
        en: "Your mental processing operates at high pace, maintaining agility under time pressure.",
        es: "Tu procesamiento mental opera a un ritmo alto, con agilidad para responder a estímulos bajo presión.",
        fr: "Votre traitement mental fonctionne à un rythme élevé, avec agilité sous pression.",
      },
    };

    const strongest = typeof score.strongestDimension === "string" ? score.strongestDimension : "PATTERN_RECOGNITION";
    const localizedLabel = dimensionLabels[strongest]?.[locale] ?? dimensionLabels[strongest]?.pt ?? strongest;
    const localizedDesc = dimensionDescriptions[strongest]?.[locale] ?? dimensionDescriptions[strongest]?.pt ?? "";
    const rawScore = typeof score.rawCorrect === "number" ? score.rawCorrect : undefined;
    const overallScore = typeof score.overallScore === "number" ? score.overallScore : undefined;
    const dimensionScores = (score.dimensionScores as Record<string, number>) ?? undefined;

    return {
      sessionId,
      quizSlug,
      quizVersion,
      scoringVersion,
      rawScore,
      overallScore,
      strongestDimension: strongest,
      strongestDimensionLabel: localizedLabel,
      strongestDimensionDescription: localizedDesc,
      dimensionScores,
    };
  }

  if (quizSlug === "careerfit") {
    const careerLabels: Record<string, Record<string, string>> = {
      TECHNICAL: { pt: "Técnico / Especialista", en: "Technical Specialist", es: "Técnico Especialista", fr: "Expert Technique" },
      MANAGERIAL: { pt: "Gestão e Liderança", en: "General Management", es: "Gestión y Liderazgo", fr: "Management et Leadership" },
      CREATIVE: { pt: "Criatividade e Inovação", en: "Creativity & Innovation", es: "Creatividad e Innovación", fr: "Créativité et Innovation" },
      AUTONOMOUS: { pt: "Autonomia e Empreendedorismo", en: "Autonomy & Venture", es: "Autonomía y Emprendimiento", fr: "Autonomie et Entrepreneuriat" },
      SECURITY: { pt: "Segurança e Estabilidade", en: "Security & Stability", es: "Seguridad y Estabilidad", fr: "Sécurité et Stabilité" },
      CAUSE: { pt: "Causa e Propósito Social", en: "Cause & Social Purpose", es: "Causa y Propósito", fr: "Cause et Utilité Sociale" },
    };
    const primary = (score.primaryAnchor as string) ?? "TECHNICAL";
    const dimScores = (score.dimensionScores as Record<string, number>) ?? {};
    return {
      sessionId,
      quizSlug,
      quizVersion,
      scoringVersion,
      strongestDimension: primary,
      strongestDimensionLabel: careerLabels[primary]?.[locale] ?? careerLabels[primary]?.pt ?? primary,
      dimensionScores: dimScores,
    };
  }

  if (quizSlug === "moneydna") {
    const moneyLabels: Record<string, Record<string, string>> = {
      BUILDER: { pt: "O Construtor Patrimonial", en: "The Asset Builder", es: "El Constructor Patrimonial", fr: "Le Bâtisseur de Patrimoine" },
      GUARDIAN: { pt: "O Guardião Prudente", en: "The Prudent Guardian", es: "El Guardián Prudente", fr: "Le Gardien Prudent" },
      STRATEGIST: { pt: "O Estrategista Analítico", en: "The Analytical Strategist", es: "El Estratega Analítico", fr: "Le Stratège Analytique" },
      ADVENTURER: { pt: "O Aventureiro Arrojado", en: "The Bold Adventurer", es: "El Aventurero Audaz", fr: "L'Aventurier Audacieux" },
      BALANCER: { pt: "O Equilibrador Consciente", en: "The Mindful Balancer", es: "El Equilibrador Consciente", fr: "L'Équilibreur Conscient" },
    };
    const dominant = (score.dominantArchetype as string) ?? "BUILDER";
    const archScores = (score.archetypeScores as Record<string, number>) ?? {};
    return {
      sessionId,
      quizSlug,
      quizVersion,
      scoringVersion,
      strongestDimension: dominant,
      strongestDimensionLabel: moneyLabels[dominant]?.[locale] ?? moneyLabels[dominant]?.pt ?? dominant,
      dimensionScores: archScores,
    };
  }

  if (quizSlug === "focusstyle") {
    const focusLabels: Record<string, Record<string, string>> = {
      IMMERSIVE_HYPERFOCUS: { pt: "Hiperfoco Imersivo", en: "Deep Immersive Flow", es: "Hiperenfoque Inmersivo", fr: "Flow Immersif Profond" },
      MODULAR_SERIAL: { pt: "Foco Modular Estruturado", en: "Structured Modular Focus", es: "Enfoque Modular Estructurado", fr: "Focus Modulaire Structuré" },
      COLLABORATIVE: { pt: "Foco Cocriativo Colaborativo", en: "Collaborative Focus", es: "Enfoque Colaborativo", fr: "Focus Collaboratif" },
      REACTIVE_SPRINT: { pt: "Foco em Sprint Reativo", en: "Reactive Sprint Focus", es: "Enfoque de Sprint Reactivo", fr: "Focus Sprint Réactif" },
    };
    const primary = (score.primaryStyle as string) ?? "IMMERSIVE_HYPERFOCUS";
    const styleScores = (score.styleScores as Record<string, number>) ?? {};
    return {
      sessionId,
      quizSlug,
      quizVersion,
      scoringVersion,
      strongestDimension: primary,
      strongestDimensionLabel: focusLabels[primary]?.[locale] ?? focusLabels[primary]?.pt ?? primary,
      dimensionScores: styleScores,
    };
  }

  if (quizSlug === "decisiondna") {
    const decisionLabels: Record<string, Record<string, string>> = {
      ANALYTICAL: { pt: "Decisor Analítico", en: "Analytical Decision Maker", es: "Decisor Analítico", fr: "Décideur Analytique" },
      INTUITIVE: { pt: "Decisor Intuitivo", en: "Intuitive Decision Maker", es: "Decisor Intuitivo", fr: "Décideur Intuitif" },
      PRAGMATIC: { pt: "Decisor Pragmático", en: "Pragmatic Decision Maker", es: "Decisor Pragmático", fr: "Décideur Pragmatique" },
      COLLABORATIVE: { pt: "Decisor Colaborativo", en: "Collaborative Decision Maker", es: "Decisor Colaborativo", fr: "Décideur Collaboratif" },
    };
    const dominant = (score.dominantStyle as string) ?? "ANALYTICAL";
    const distribution = (score.styleDistribution as Record<string, number>) ?? {};
    return {
      sessionId,
      quizSlug,
      quizVersion,
      scoringVersion,
      strongestDimension: dominant,
      strongestDimensionLabel: decisionLabels[dominant]?.[locale] ?? decisionLabels[dominant]?.pt ?? dominant,
      dimensionScores: distribution,
    };
  }

  if (quizSlug === "coupledna") {
    const coupleLabels: Record<string, Record<string, string>> = {
      COMMUNICATION: { pt: "Comunicação e Escuta", en: "Communication & Listening", es: "Comunicación y Escucha", fr: "Communication et Écoute" },
      LIFE_VALUES: { pt: "Valores e Filosofia de Vida", en: "Life Values & Principles", es: "Valores y Filosofía de Vida", fr: "Valeurs et Philosophie de Vie" },
      CONFLICT_MANAGEMENT: { pt: "Gestão Consciente de Conflitos", en: "Mindful Conflict Resolution", es: "Gestión Consciente de Conflictos", fr: "Résolution Consciente des Conflits" },
      FINANCES: { pt: "Harmonia Financeira", en: "Financial Harmony", es: "Armonía Financiera", fr: "Harmonie Financière" },
      FUTURE_PLANS: { pt: "Planos e Visão de Futuro", en: "Future Vision & Plans", es: "Visión y Planes de Futuro", fr: "Vision et Projets d'Avenir" },
    };
    const dimScores = (score.dimensionScores as Record<string, number>) ?? {};
    const highestDim = Object.entries(dimScores).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "COMMUNICATION";
    return {
      sessionId,
      quizSlug,
      quizVersion,
      scoringVersion,
      strongestDimension: highestDim,
      strongestDimensionLabel: coupleLabels[highestDim]?.[locale] ?? coupleLabels[highestDim]?.pt ?? highestDim,
      dimensionScores: dimScores,
    };
  }

  // Personality Map fallback
  const personalityLabels: Record<string, Record<string, string>> = {
    OPENNESS: { pt: "Abertura a Experiências", en: "Openness", es: "Apertura", fr: "Ouverture" },
    CONSCIENTIOUSNESS: { pt: "Conscienciosidade", en: "Conscientiousness", es: "Responsabilidad", fr: "Conscienciosité" },
    EXTRAVERSION: { pt: "Extroversão", en: "Extraversion", es: "Extraversión", fr: "Extraversion" },
    AGREEABLENESS: { pt: "Amabilidade", en: "Agreeableness", es: "Amabilidad", fr: "Agréabilité" },
    EMOTIONAL_STABILITY: { pt: "Estabilidade Emocional", en: "Emotional Stability", es: "Estabilidad Emocional", fr: "Stabilité Émotionnelle" },
  };

  const dimScores = (score.dimensionScores as Record<string, number>) ?? {};
  const highestDim = Object.entries(dimScores).sort(
    ([, a], [, b]) => b - a,
  )[0]?.[0] ?? "OPENNESS";
  const qualityWarning = typeof score.uniformResponseWarning === "boolean" ? score.uniformResponseWarning : undefined;

  return {
    sessionId,
    quizSlug,
    quizVersion,
    scoringVersion,
    strongestDimension: highestDim,
    strongestDimensionLabel: personalityLabels[highestDim]?.[locale] ?? personalityLabels[highestDim]?.en ?? highestDim,
    dimensionScores: dimScores,
    qualityWarning,
  };
}
