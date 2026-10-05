import "server-only";

import { timingSafeEqual } from "node:crypto";
import { assertTransition, sessionTransitions, type SessionState } from "@/lib/domain/states";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import {
  createAnonymousSessionToken,
  hashAnonymousSessionToken,
  matchesAnonymousSessionToken,
  anonymousSessionTtlSeconds,
} from "@/lib/security/anonymous-session";
import { hashToken } from "@/features/privacy/consent-service";
import type { ActiveSession, PartialResultSummary, ScoringAnswer } from "./contracts";
import { brainRankScoringV1, type BrainRankItem } from "@/features/scoring/brainrank";
import { personalityMapScoringV1, type PersonalityItem } from "@/features/scoring/personality-map";
import { careerFitScoringV1, type CareerFitItem } from "@/features/scoring/careerfit";
import { moneyDnaScoringV1, type MoneyDnaItem } from "@/features/scoring/moneydna";
import { focusStyleScoringV1, type FocusStyleItem } from "@/features/scoring/focusstyle";
import {
  decisionDnaScoringV1,
  type DecisionDnaItem,
  type DecisionStyleType,
} from "@/features/scoring/decisiondna";
import { coupleDnaScoringV1, type CoupleDnaItem } from "@/features/scoring/coupledna";
import { recordFunnelEvent } from "@/features/analytics/analytics-service";
import { recordReferralClick } from "@/features/referrals/referral-service";
import type { Locale } from "@/lib/i18n/config";
import type { PublicQuestion, PublicOption, QuestionKind } from "./contracts";
import { isVisualScene, isVisualStimulus } from "./visual-question-schema";
import {
  selectQuestionsForAttempt,
  type CandidateQuestion,
  type SelectedQuestionItem,
} from "./selection-engine";
import { ASSESSMENT_SELECTION_CONFIGS } from "./selection-config";
import { attachMemoryCues, distributeMemoryItems } from "./delayed-memory";

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

export type StartQuizSessionInput = {
  quizSlug: string;
  locale: string;
  market: string;
  referralCode?: string;
  inviteCode?: string;
  comparisonConsent?: boolean;
  existingToken?: string;
  seed?: string;
};

export async function startQuizSession(
  input: StartQuizSessionInput,
): Promise<{ session: ActiveSession; token: string }> {
  const supabase = createSupabaseSecretClient();

  let buyerId: string | undefined;
  if (input.existingToken) {
    const { data: owner } = await supabase
      .from("quiz_sessions")
      .select("buyer_id")
      .eq("access_token_hash", hashAnonymousSessionToken(input.existingToken))
      .gt("expires_at", new Date().toISOString())
      .limit(1)
      .maybeSingle();
    buyerId = owner?.buyer_id;
  }
  let coupleInvite: { id: string; initiator_session_id: string } | null = null;
  if (input.inviteCode) {
    if (input.quizSlug !== "coupledna" || input.comparisonConsent !== true)
      throw new Error("Explicit comparison consent required");
    const { data: invite } = await supabase
      .from("couple_invites")
      .select("id,initiator_session_id,partner_session_id,status,expires_at")
      .eq("invite_code", input.inviteCode.trim().toUpperCase())
      .maybeSingle();
    if (
      !invite ||
      invite.status !== "PENDING" ||
      invite.partner_session_id ||
      new Date(invite.expires_at) <= new Date()
    )
      throw new Error("Invite unavailable or expired");
    coupleInvite = invite;
  }

  // If client provided an existing token, try to resume active attempt for this quiz
  if (input.existingToken && !input.inviteCode) {
    try {
      const existing = await getActiveSessionByToken(input.existingToken, input.quizSlug);
      if (existing) {
        return { session: existing, token: input.existingToken };
      }
    } catch {
      // Continue to fresh session if token is invalid
    }
  }

  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("id, slug, product_code, quiz_versions!inner(id, version, scoring_version, status)")
    .eq("slug", input.quizSlug)
    .single();

  if (quizError || !quiz) {
    throw new SessionNotFoundError(
      `Quiz ${input.quizSlug} not found: ${quizError?.message ?? "empty data"} (code: ${quizError?.code})`,
    );
  }

  type VersionRecord = {
    id: string;
    version: string;
    scoring_version: string;
    status: string;
  };

  const rawVersions = quiz.quiz_versions as unknown as VersionRecord | VersionRecord[];
  const versions = Array.isArray(rawVersions) ? rawVersions : [rawVersions];
  let activeVersion =
    versions.find((v) => v.status === "APPROVED" || v.status === "PUBLISHED") ?? versions[0];

  if (!activeVersion) {
    throw new SessionNotFoundError(`No active version for ${input.quizSlug}`);
  }
  if (coupleInvite) {
    const { data: original } = await supabase
      .from("quiz_sessions")
      .select("quiz_version_id,quiz_version,scoring_version,access_token_hash")
      .eq("id", coupleInvite.initiator_session_id)
      .single();
    if (
      !original ||
      (input.existingToken &&
        matchesAnonymousSessionToken(input.existingToken, original.access_token_hash))
    )
      throw new Error("Use a separate participant session");
    activeVersion = {
      id: original.quiz_version_id,
      version: original.quiz_version,
      scoring_version: original.scoring_version,
      status: "PUBLISHED",
    };
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
      ...(buyerId ? { buyer_id: buyerId } : {}),
    })
    .select(
      "id, quiz_version_id, quiz_version, scoring_version, locale, market, status, current_position, memory_exposures, expires_at",
    )
    .single();

  if (sessionError || !session) {
    throw new Error(`Failed to create quiz session: ${sessionError?.message}`);
  }

  // --- Dynamic Question Selection & Persistence ---
  let selectedSaved = false;

  if (coupleInvite) {
    // Bilateral CoupleDNA session: partner mirrors initiator's exact question set & positions
    const invite = coupleInvite;

    if (invite?.initiator_session_id) {
      const { data: initiatorQuestions } = await supabase
        .from("quiz_session_questions")
        .select("question_id, position")
        .eq("session_id", invite.initiator_session_id)
        .order("position", { ascending: true });

      if (initiatorQuestions && initiatorQuestions.length > 0) {
        const partnerRows = initiatorQuestions.map((iq) => ({
          session_id: session.id,
          question_id: iq.question_id,
          position: iq.position,
        }));
        await supabase.from("quiz_session_questions").insert(partnerRows);

        // Update invite and record partner consent
        const { data: claimed, error: claimError } = await supabase
          .from("couple_invites")
          .update({
            partner_session_id: session.id,
            status: "ACCEPTED",
            updated_at: new Date().toISOString(),
          })
          .eq("id", invite.id)
          .is("partner_session_id", null)
          .eq("status", "PENDING")
          .select("id")
          .maybeSingle();
        if (claimError || !claimed) throw new Error("Invite already accepted");

        await supabase.from("couple_consents").upsert(
          {
            invite_id: invite.id,
            session_id: session.id,
            can_share_comparison: true,
          },
          { onConflict: "invite_id,session_id" },
        );

        selectedSaved = true;
      }
    }
  }

  if (!selectedSaved) {
    const { data: candidates } = await supabase
      .from("questions")
      .select(
        "id, stable_key, position, kind, scoring_key, metadata, active, options(id, stable_key, position)",
      )
      .eq("quiz_version_id", activeVersion.id)
      .eq("active", true)
      .order("position", { ascending: true });

    if (candidates && candidates.length > 0) {
      const config = ASSESSMENT_SELECTION_CONFIGS[input.quizSlug];
      const candidateList: CandidateQuestion[] = candidates.map((c) => ({
        id: c.id,
        stableKey: c.stable_key,
        kind: c.kind,
        scoringKey: (c.scoring_key as Record<string, unknown>) ?? {},
        metadata: c.metadata as Record<string, unknown> | null,
        active: c.active,
        options: Array.isArray(c.options)
          ? c.options.map((opt) => ({
              id: opt.id,
              stableKey: opt.stable_key,
              position: opt.position,
            }))
          : [],
      }));

      const memoryCandidates = candidateList
        .filter((q) => q.scoringKey.dimension === "DELAYED_MEMORY")
        .sort((a, b) => a.stableKey.localeCompare(b.stableKey));
      const coreCandidates = candidateList.filter(
        (q) => q.scoringKey.dimension !== "DELAYED_MEMORY",
      );
      const coreSelected: SelectedQuestionItem[] = config
        ? selectQuestionsForAttempt(coreCandidates, config, input.seed ?? session.id)
        : coreCandidates.slice(0, 24).map((q, index) => ({
            questionId: q.id,
            stableKey: q.stableKey,
            position: index + 1,
            dimension: String(q.scoringKey.dimension ?? ""),
          }));
      const selected = memoryCandidates.length
        ? distributeMemoryItems(
            coreSelected,
            memoryCandidates.map((q) => ({
              questionId: q.id,
              stableKey: q.stableKey,
              position: 0,
              dimension: "DELAYED_MEMORY",
            })),
          )
        : coreSelected;

      const rowsToInsert = selected.map((q, idx) => ({
        session_id: session.id,
        question_id: q.questionId,
        position: idx + 1,
      }));

      const { error: insErr } = await supabase.from("quiz_session_questions").insert(rowsToInsert);
      if (insErr) {
        throw new Error(`Failed to insert session questions: ${insErr.message}`);
      }
    }
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
      memorySeen: session.memory_exposures ?? [],
      expiresAt: session.expires_at,
      answers: {},
    },
    token,
  };
}

export async function getSessionQuestions(
  sessionId: string,
  locale: Locale,
): Promise<PublicQuestion[]> {
  const supabase = createSupabaseSecretClient();

  const { data: sessionQuestions, error: sqError } = await supabase
    .from("quiz_session_questions")
    .select("question_id, position")
    .eq("session_id", sessionId)
    .order("position", { ascending: true });

  if (sqError || !sessionQuestions || sessionQuestions.length === 0) {
    return [];
  }

  const questionIds = sessionQuestions.map((sq) => sq.question_id);

  const { data: questionsData, error: qError } = await supabase
    .from("questions")
    .select(
      `
      id,
      stable_key,
      position,
      kind,
      metadata,
      question_translations(locale, prompt, accessibility_text),
      options(
        id,
        stable_key,
        position,
        metadata,
        option_translations(locale, label, image_alt)
      )
    `,
    )
    .in("id", questionIds);

  if (qError || !questionsData) {
    return [];
  }

  const questionsMap = new Map(questionsData.map((q) => [q.id, q]));

  const publicQuestions = sessionQuestions
    .map((sq) => {
      const q = questionsMap.get(sq.question_id);
      if (!q) return null;

      const transList = Array.isArray(q.question_translations) ? q.question_translations : [];
      const translation = transList.find((t) => t.locale === locale) ?? transList[0];

      const clue =
        q.metadata && typeof q.metadata === "object" && "clue" in q.metadata
          ? ((q.metadata.clue as Record<string, string>)[locale] ?? null)
          : null;

      const rawOptions = Array.isArray(q.options) ? q.options : [];
      const publicOptions: PublicOption[] = rawOptions
        .slice()
        .sort((a, b) => a.position - b.position)
        .map((opt) => {
          const optTransList = Array.isArray(opt.option_translations)
            ? opt.option_translations
            : [];
          const optTrans = optTransList.find((t) => t.locale === locale) ?? optTransList[0];

          return {
            id: opt.id,
            stableKey: opt.stable_key,
            position: opt.position,
            label: optTrans?.label ?? opt.stable_key,
            imageAlt: optTrans?.image_alt ?? null,
            visual: isVisualScene(opt.metadata?.visual) ? opt.metadata.visual : null,
          };
        });

      const publicQuestion: PublicQuestion = {
        id: q.id,
        stableKey: q.stable_key,
        position: sq.position,
        kind: q.kind as QuestionKind,
        prompt: translation?.prompt ?? q.stable_key,
        accessibilityText: translation?.accessibility_text ?? null,
        clue,
        ...(q.metadata &&
        typeof q.metadata === "object" &&
        q.metadata.memoryCue &&
        typeof q.metadata.memoryCue === "object"
          ? {
              memoryRecall: {
                id: q.stable_key,
                cue: String((q.metadata.memoryCue as Record<string, unknown>)[locale] ?? ""),
              },
            }
          : {}),
        visualType:
          typeof q.metadata?.visualType === "string"
            ? (q.metadata.visualType as PublicQuestion["visualType"])
            : null,
        stimulus: isVisualStimulus(q.metadata?.stimulus) ? q.metadata.stimulus : null,
        options: publicOptions,
      };
      return publicQuestion;
    })
    .filter((q): q is PublicQuestion => q !== null);
  return attachMemoryCues(publicQuestions);
}

export async function getActiveSessionByToken(
  token: string,
  quizSlug?: string,
): Promise<ActiveSession | null> {
  const supabase = createSupabaseSecretClient();
  const tokenHash = hashAnonymousSessionToken(token);

  const { data: sessions, error } = await supabase
    .from("quiz_sessions")
    .select(
      `
      id,
      quiz_version_id,
      quiz_version,
      scoring_version,
      locale,
      market,
      status,
      access_token_hash,
      current_position, memory_exposures,
      expires_at,
      memory_exposures,
      quizzes:quiz_versions(quizzes(slug))
    `,
    )
    .eq("access_token_hash", tokenHash)
    .neq("status", "COMPLETED")
    .neq("status", "EXPIRED")
    .gt("expires_at", new Date().toISOString())
    .order("started_at", { ascending: false })
    .limit(1);

  if (error || !sessions || sessions.length === 0) return null;

  const session = sessions[0]!;
  const sessionRecord = session as unknown as { quizzes?: { quizzes?: { slug?: string } } };
  const foundSlug = sessionRecord?.quizzes?.quizzes?.slug ?? "brainrank";

  if (quizSlug && foundSlug !== quizSlug) {
    return null;
  }

  const { data: answersData } = await supabase
    .from("answers")
    .select("question_id, option_id, numeric_value, duration_ms")
    .eq("session_id", session.id);

  const answersMap: Record<
    string,
    { optionId?: string; numericValue?: number; durationMs?: number }
  > = {};
  for (const ans of answersData ?? []) {
    answersMap[ans.question_id] = {
      ...(ans.option_id ? { optionId: ans.option_id } : {}),
      ...(ans.numeric_value !== null ? { numericValue: ans.numeric_value } : {}),
      ...(ans.duration_ms !== null ? { durationMs: ans.duration_ms } : {}),
    };
  }

  return {
    id: session.id,
    quizVersionId: session.quiz_version_id,
    quizSlug: foundSlug,
    quizVersion: session.quiz_version,
    scoringVersion: session.scoring_version,
    locale: session.locale,
    market: session.market,
    status: session.status,
    currentPosition: session.current_position,
    memorySeen: session.memory_exposures ?? [],
    expiresAt: session.expires_at,
    answers: answersMap,
  };
}

export async function getActiveSession(
  sessionId: string,
  token: string,
): Promise<ActiveSession | null> {
  const supabase = createSupabaseSecretClient();

  const { data: session, error } = await supabase
    .from("quiz_sessions")
    .select(
      `
      id,
      quiz_version_id,
      quiz_version,
      scoring_version,
      locale,
      market,
      status,
      access_token_hash,
      current_position, memory_exposures,
      expires_at,
      memory_exposures,
      quizzes:quiz_versions(quizzes(slug))
    `,
    )
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

  const answersMap: Record<
    string,
    { optionId?: string; numericValue?: number; durationMs?: number }
  > = {};
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
    memorySeen: session.memory_exposures ?? [],
    expiresAt: session.expires_at,
    answers: answersMap,
  };
}

export type RecoverSessionResult =
  | {
      status: "COMPLETED";
      sessionId: string;
      token: string;
      quizSlug: string;
      resultRedirectUrl: string;
    }
  | {
      status: "ACTIVE";
      session: ActiveSession;
      token: string;
    };

export async function validateAndRecoverSession(input: {
  sessionId: string;
  recoveryToken: string;
  quizSlug: string;
}): Promise<RecoverSessionResult> {
  const supabase = createSupabaseSecretClient();
  const tokenHash = hashToken(input.recoveryToken);

  // 1. Verify recovery_tokens record
  const { data: recoveryRecord, error: recoveryError } = await supabase
    .from("recovery_tokens")
    .select("id, session_id, token_hash, expires_at, used_at, usage_count, max_uses, revoked_at")
    .eq("session_id", input.sessionId)
    .single();

  if (recoveryError || !recoveryRecord) {
    throw new SessionNotFoundError("Link de recuperação inválido ou expirado.");
  }

  // Constant-time check
  const actual = Buffer.from(tokenHash, "hex");
  const expected = Buffer.from(recoveryRecord.token_hash, "hex");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    throw new SessionNotFoundError("Link de recuperação inválido ou expirado.");
  }

  // Expiration check
  if (new Date(recoveryRecord.expires_at) < new Date()) {
    throw new SessionNotFoundError("Link de recuperação inválido ou expirado.");
  }

  // Revocation check
  if (recoveryRecord.revoked_at) {
    throw new SessionNotFoundError("Link de recuperação inválido ou expirado.");
  }

  // Max uses check
  const maxUses = recoveryRecord.max_uses ?? 10;
  const currentUses = recoveryRecord.usage_count ?? 0;
  if (currentUses >= maxUses) {
    throw new SessionNotFoundError("Limite de utilizações deste link de recuperação excedido.");
  }

  // Increment usage count
  await supabase
    .from("recovery_tokens")
    .update({
      usage_count: currentUses + 1,
      used_at: new Date().toISOString(),
    })
    .eq("id", recoveryRecord.id);

  // 2. Fetch session and check quiz slug
  const { data: session, error: sessionError } = await supabase
    .from("quiz_sessions")
    .select(
      `
      id,
      quiz_version_id,
      quiz_version,
      scoring_version,
      locale,
      market,
      status,
      current_position, memory_exposures,
      expires_at,
      quiz_versions(quiz_id, quizzes(slug, product_code))
    `,
    )
    .eq("id", input.sessionId)
    .single();

  if (sessionError || !session) {
    throw new SessionNotFoundError("Sessão não encontrada.");
  }

  type SessionVersions = { quiz_versions?: { quizzes?: { slug?: string } } };
  const actualSlug =
    (session as unknown as SessionVersions)?.quiz_versions?.quizzes?.slug ?? "brainrank";

  if (actualSlug !== input.quizSlug) {
    throw new SessionNotFoundError("O quiz desta sessão não corresponde à URL informada.");
  }

  if (
    session.status === "EXPIRED" ||
    (session.status !== "COMPLETED" && new Date(session.expires_at) <= new Date())
  ) {
    throw new SessionNotFoundError("Sessão expirada.");
  }

  // A recovery token is not an anonymous access token. Issue a fresh credential
  // for the recovered attempt so answer and result authorization agree.
  const accessToken = createAnonymousSessionToken();
  const { error: accessError } = await supabase
    .from("quiz_sessions")
    .update({ access_token_hash: hashAnonymousSessionToken(accessToken) })
    .eq("id", session.id);
  if (accessError) throw new Error("Failed to authenticate recovered session");

  // 3. If session is already completed, point to results
  if (session.status === "COMPLETED") {
    return {
      status: "COMPLETED",
      sessionId: session.id,
      token: accessToken,
      quizSlug: actualSlug,
      resultRedirectUrl: `/${session.locale}/quizzes/${actualSlug}/result?session=${session.id}`,
    };
  }

  // 4. If session is active/in_progress, load answers
  const { data: answersData } = await supabase
    .from("answers")
    .select("question_id, option_id, numeric_value, duration_ms")
    .eq("session_id", session.id);

  const answersMap: Record<
    string,
    { optionId?: string; numericValue?: number; durationMs?: number }
  > = {};
  for (const ans of answersData ?? []) {
    answersMap[ans.question_id] = {
      ...(ans.option_id ? { optionId: ans.option_id } : {}),
      ...(ans.numeric_value !== null ? { numericValue: ans.numeric_value } : {}),
      ...(ans.duration_ms !== null ? { durationMs: ans.duration_ms } : {}),
    };
  }

  return {
    status: "ACTIVE",
    session: {
      id: session.id,
      quizVersionId: session.quiz_version_id,
      quizSlug: actualSlug,
      quizVersion: session.quiz_version,
      scoringVersion: session.scoring_version,
      locale: session.locale,
      market: session.market,
      status: session.status as "CREATED" | "IN_PROGRESS" | "COMPLETED" | "EXPIRED",
      currentPosition: session.current_position,
      memorySeen: session.memory_exposures ?? [],
      expiresAt: session.expires_at,
      answers: answersMap,
    },
    token: accessToken,
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

  // Validate that question belongs to this attempt
  const { data: sqRow } = await supabase
    .from("quiz_session_questions")
    .select("question_id")
    .eq("session_id", input.sessionId)
    .eq("question_id", input.questionId)
    .maybeSingle();

  if (!sqRow) {
    const { count } = await supabase
      .from("quiz_session_questions")
      .select("question_id", { count: "exact", head: true })
      .eq("session_id", input.sessionId);

    if (count && count > 0) {
      throw new Error("Question does not belong to this attempt");
    }
  }

  // Upsert answer
  if (session.status !== "IN_PROGRESS") {
    assertTransition("session", session.status as SessionState, "IN_PROGRESS", sessionTransitions);
  }
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
    .select(
      `
      id,
      quiz_version_id,
      quiz_version,
      scoring_version,
      locale,
      market,
      status,
      access_token_hash,
      memory_exposures,
      quizzes:quiz_versions(quizzes(slug))
    `,
    )
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

  // Fetch attempt questions from quiz_session_questions
  const { data: sessionQuestions } = await supabase
    .from("quiz_session_questions")
    .select("question_id, position")
    .eq("session_id", input.sessionId)
    .order("position", { ascending: true });

  let rawQuestions: QuestionData[];

  if (sessionQuestions && sessionQuestions.length > 0) {
    const questionIds = sessionQuestions.map((sq) => sq.question_id);
    const { data: questionsData, error: qError } = await supabase
      .from("questions")
      .select("id, stable_key, scoring_key, options(id, stable_key, scoring_value)")
      .in("id", questionIds);

    if (qError || !questionsData) {
      throw new Error("Failed to load questions for scoring");
    }

    const questionsMap = new Map(questionsData.map((q) => [q.id, q]));
    const mappedQuestions: QuestionData[] = [];
    for (const sq of sessionQuestions) {
      const q = questionsMap.get(sq.question_id);
      if (q) {
        mappedQuestions.push({
          id: q.id,
          stable_key: q.stable_key,
          position: sq.position,
          scoring_key: (q.scoring_key as Record<string, string> | null) ?? null,
          options: (q.options as OptionData[]) ?? [],
        });
      }
    }
    rawQuestions = mappedQuestions;
  } else {
    // Fallback for legacy attempts without quiz_session_questions rows
    const { data: dbQuestions, error: qError } = await supabase
      .from("questions")
      .select("id, stable_key, position, scoring_key, options(id, stable_key, scoring_value)")
      .eq("quiz_version_id", session.quiz_version_id)
      .order("position", { ascending: true });

    if (qError || !dbQuestions || dbQuestions.length === 0) {
      throw new Error("Failed to load questions for scoring");
    }
    rawQuestions = dbQuestions as unknown as QuestionData[];
  }

  const activeQuestionIds = rawQuestions.map((q) => q.id);

  // Fetch all submitted answers for active questions
  const { data: answers, error: aError } = await supabase
    .from("answers")
    .select("question_id, option_id, numeric_value, duration_ms")
    .eq("session_id", input.sessionId)
    .in("question_id", activeQuestionIds);

  if (aError || !answers) {
    throw new Error("Failed to load answers for scoring");
  }

  if (answers.length < rawQuestions.length) {
    throw new IncompleteQuizSubmissionError(
      `Answered ${answers.length} of ${rawQuestions.length} questions required`,
    );
  }

  const memoryQuestions = rawQuestions.filter((q) => q.scoring_key?.dimension === "DELAYED_MEMORY");
  rawQuestions = rawQuestions.filter((q) => q.scoring_key?.dimension !== "DELAYED_MEMORY");
  const coreQuestionIds = new Set(rawQuestions.map((q) => q.id));
  const scoringAnswers: ScoringAnswer[] = answers
    .filter((a) => coreQuestionIds.has(a.question_id))
    .map((a) => ({
      questionId: a.question_id,
      optionId: a.option_id ?? undefined,
      value: a.numeric_value ?? undefined,
      durationMs: a.duration_ms ?? undefined,
    }));

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

    calculatedScore = brainRankScoringV1.score(brainRankItems, scoringAnswers) as unknown as Record<
      string,
      unknown
    >;
  } else if (quizSlug === "personality-map") {
    const personalityItems: PersonalityItem[] = rawQuestions.map((q) => {
      const scoringKey = q.scoring_key ?? {};
      return {
        id: q.id,
        dimension: (scoringKey.dimension as PersonalityItem["dimension"]) ?? "OPENNESS",
        direction: (scoringKey.direction as PersonalityItem["direction"]) ?? "DIRECT",
      };
    });

    calculatedScore = personalityMapScoringV1.score(
      personalityItems,
      scoringAnswers,
    ) as unknown as Record<string, unknown>;
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
    calculatedScore = careerFitScoringV1.score(careerItems, answersMap) as unknown as Record<
      string,
      unknown
    >;
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
    calculatedScore = moneyDnaScoringV1.score(moneyItems, answersMap) as unknown as Record<
      string,
      unknown
    >;
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
    calculatedScore = focusStyleScoringV1.score(focusItems, answersMap) as unknown as Record<
      string,
      unknown
    >;
  } else if (quizSlug === "decisiondna") {
    const decisionItems: DecisionDnaItem[] = rawQuestions.map((q) => {
      const optionStyleMap: Record<string, DecisionStyleType> = {};
      for (const opt of q.options ?? []) {
        if (
          opt.scoring_value &&
          typeof opt.scoring_value === "object" &&
          "style" in opt.scoring_value
        ) {
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
    calculatedScore = decisionDnaScoringV1.score(decisionItems, answersMap) as unknown as Record<
      string,
      unknown
    >;
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
    calculatedScore = coupleDnaScoringV1.scoreIndividual(
      coupleItems,
      answersMap,
    ) as unknown as Record<string, unknown>;
  } else {
    throw new Error(`Unsupported quiz for scoring: ${quizSlug}`);
  }

  // Snapshot input
  if (memoryQuestions.length) {
    const seen = (session.memory_exposures as string[] | null) ?? [];
    if (memoryQuestions.some((q) => !seen.includes(q.stable_key))) {
      throw new IncompleteQuizSubmissionError("Memory stimuli must be viewed before completing");
    }
    calculatedScore.memoryRecall = {
      version: "1.0",
      total: memoryQuestions.length,
      correct: memoryQuestions.filter((q) => {
        const answer = answers.find((a) => a.question_id === q.id);
        return q.options?.some(
          (o) => o.id === answer?.option_id && o.scoring_value?.isCorrect === true,
        );
      }).length,
    };
  }
  const inputSnapshot = {
    answers: answers.map((a) => ({
      questionId: a.question_id,
      optionId: a.option_id,
      value: a.numeric_value,
      durationMs: a.duration_ms,
    })),
    completedAt: new Date().toISOString(),
  };

  // Insert result
  assertTransition("session", session.status as SessionState, "COMPLETED", sessionTransitions);
  const { error: resultError } = await supabase.from("results").insert({
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
      total_questions: rawQuestions.length,
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

    const strongest =
      typeof score.strongestDimension === "string"
        ? score.strongestDimension
        : "PATTERN_RECOGNITION";
    const localizedLabel =
      dimensionLabels[strongest]?.[locale] ?? dimensionLabels[strongest]?.pt ?? strongest;
    const localizedDesc =
      dimensionDescriptions[strongest]?.[locale] ?? dimensionDescriptions[strongest]?.pt ?? "";
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
      TECHNICAL: {
        pt: "Técnico / Especialista",
        en: "Technical Specialist",
        es: "Técnico Especialista",
        fr: "Expert Technique",
      },
      MANAGERIAL: {
        pt: "Gestão e Liderança",
        en: "General Management",
        es: "Gestión y Liderazgo",
        fr: "Management et Leadership",
      },
      CREATIVE: {
        pt: "Criatividade e Inovação",
        en: "Creativity & Innovation",
        es: "Creatividad e Innovación",
        fr: "Créativité et Innovation",
      },
      AUTONOMOUS: {
        pt: "Autonomia e Empreendedorismo",
        en: "Autonomy & Venture",
        es: "Autonomía y Emprendimiento",
        fr: "Autonomie et Entrepreneuriat",
      },
      SECURITY: {
        pt: "Segurança e Estabilidade",
        en: "Security & Stability",
        es: "Seguridad y Estabilidad",
        fr: "Sécurité et Stabilité",
      },
      CAUSE: {
        pt: "Causa e Propósito Social",
        en: "Cause & Social Purpose",
        es: "Causa y Propósito",
        fr: "Cause et Utilité Sociale",
      },
    };
    const primary = (score.primaryAnchor as string) ?? "TECHNICAL";
    const dimScores = (score.dimensionScores as Record<string, number>) ?? {};
    return {
      sessionId,
      quizSlug,
      quizVersion,
      scoringVersion,
      strongestDimension: primary,
      strongestDimensionLabel:
        careerLabels[primary]?.[locale] ?? careerLabels[primary]?.pt ?? primary,
      dimensionScores: dimScores,
    };
  }

  if (quizSlug === "moneydna") {
    const moneyLabels: Record<string, Record<string, string>> = {
      BUILDER: {
        pt: "O Construtor Patrimonial",
        en: "The Asset Builder",
        es: "El Constructor Patrimonial",
        fr: "Le Bâtisseur de Patrimoine",
      },
      GUARDIAN: {
        pt: "O Guardião Prudente",
        en: "The Prudent Guardian",
        es: "El Guardián Prudente",
        fr: "Le Gardien Prudent",
      },
      STRATEGIST: {
        pt: "O Estrategista Analítico",
        en: "The Analytical Strategist",
        es: "El Estratega Analítico",
        fr: "Le Stratège Analytique",
      },
      ADVENTURER: {
        pt: "O Aventureiro Arrojado",
        en: "The Bold Adventurer",
        es: "El Aventurero Audaz",
        fr: "L'Aventurier Audacieux",
      },
      BALANCER: {
        pt: "O Equilibrador Consciente",
        en: "The Mindful Balancer",
        es: "El Equilibrador Consciente",
        fr: "L'Équilibreur Conscient",
      },
    };
    const dominant = (score.dominantArchetype as string) ?? "BUILDER";
    const archScores = (score.archetypeScores as Record<string, number>) ?? {};
    return {
      sessionId,
      quizSlug,
      quizVersion,
      scoringVersion,
      strongestDimension: dominant,
      strongestDimensionLabel:
        moneyLabels[dominant]?.[locale] ?? moneyLabels[dominant]?.pt ?? dominant,
      dimensionScores: archScores,
    };
  }

  if (quizSlug === "focusstyle") {
    const focusLabels: Record<string, Record<string, string>> = {
      IMMERSIVE_HYPERFOCUS: {
        pt: "Hiperfoco Imersivo",
        en: "Deep Immersive Flow",
        es: "Hiperenfoque Inmersivo",
        fr: "Flow Immersif Profond",
      },
      MODULAR_SERIAL: {
        pt: "Foco Modular Estruturado",
        en: "Structured Modular Focus",
        es: "Enfoque Modular Estructurado",
        fr: "Focus Modulaire Structuré",
      },
      COLLABORATIVE: {
        pt: "Foco Cocriativo Colaborativo",
        en: "Collaborative Focus",
        es: "Enfoque Colaborativo",
        fr: "Focus Collaboratif",
      },
      REACTIVE_SPRINT: {
        pt: "Foco em Sprint Reativo",
        en: "Reactive Sprint Focus",
        es: "Enfoque de Sprint Reactivo",
        fr: "Focus Sprint Réactif",
      },
    };
    const primary = (score.primaryStyle as string) ?? "IMMERSIVE_HYPERFOCUS";
    const styleScores = (score.styleScores as Record<string, number>) ?? {};
    return {
      sessionId,
      quizSlug,
      quizVersion,
      scoringVersion,
      strongestDimension: primary,
      strongestDimensionLabel:
        focusLabels[primary]?.[locale] ?? focusLabels[primary]?.pt ?? primary,
      dimensionScores: styleScores,
    };
  }

  if (quizSlug === "decisiondna") {
    const decisionLabels: Record<string, Record<string, string>> = {
      ANALYTICAL: {
        pt: "Decisor Analítico",
        en: "Analytical Decision Maker",
        es: "Decisor Analítico",
        fr: "Décideur Analytique",
      },
      INTUITIVE: {
        pt: "Decisor Intuitivo",
        en: "Intuitive Decision Maker",
        es: "Decisor Intuitivo",
        fr: "Décideur Intuitif",
      },
      PRAGMATIC: {
        pt: "Decisor Pragmático",
        en: "Pragmatic Decision Maker",
        es: "Decisor Pragmático",
        fr: "Décideur Pragmatique",
      },
      COLLABORATIVE: {
        pt: "Decisor Colaborativo",
        en: "Collaborative Decision Maker",
        es: "Decisor Colaborativo",
        fr: "Décideur Collaboratif",
      },
    };
    const dominant = (score.dominantStyle as string) ?? "ANALYTICAL";
    const distribution = (score.styleDistribution as Record<string, number>) ?? {};
    return {
      sessionId,
      quizSlug,
      quizVersion,
      scoringVersion,
      strongestDimension: dominant,
      strongestDimensionLabel:
        decisionLabels[dominant]?.[locale] ?? decisionLabels[dominant]?.pt ?? dominant,
      dimensionScores: distribution,
    };
  }

  if (quizSlug === "coupledna") {
    const coupleLabels: Record<string, Record<string, string>> = {
      COMMUNICATION: {
        pt: "Comunicação e Escuta",
        en: "Communication & Listening",
        es: "Comunicación y Escucha",
        fr: "Communication et Écoute",
      },
      LIFE_VALUES: {
        pt: "Valores e Filosofia de Vida",
        en: "Life Values & Principles",
        es: "Valores y Filosofía de Vida",
        fr: "Valeurs et Philosophie de Vie",
      },
      CONFLICT_MANAGEMENT: {
        pt: "Gestão Consciente de Conflitos",
        en: "Mindful Conflict Resolution",
        es: "Gestión Consciente de Conflictos",
        fr: "Résolution Consciente des Conflits",
      },
      FINANCES: {
        pt: "Harmonia Financeira",
        en: "Financial Harmony",
        es: "Armonía Financiera",
        fr: "Harmonie Financière",
      },
      FUTURE_PLANS: {
        pt: "Planos e Visão de Futuro",
        en: "Future Vision & Plans",
        es: "Visión y Planes de Futuro",
        fr: "Vision et Projets d'Avenir",
      },
    };
    const dimScores = (score.dimensionScores as Record<string, number>) ?? {};
    const highestDim =
      Object.entries(dimScores).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "COMMUNICATION";
    return {
      sessionId,
      quizSlug,
      quizVersion,
      scoringVersion,
      strongestDimension: highestDim,
      strongestDimensionLabel:
        coupleLabels[highestDim]?.[locale] ?? coupleLabels[highestDim]?.pt ?? highestDim,
      dimensionScores: dimScores,
    };
  }

  // Personality Map fallback
  const personalityLabels: Record<string, Record<string, string>> = {
    OPENNESS: { pt: "Abertura a Experiências", en: "Openness", es: "Apertura", fr: "Ouverture" },
    CONSCIENTIOUSNESS: {
      pt: "Conscienciosidade",
      en: "Conscientiousness",
      es: "Responsabilidad",
      fr: "Conscienciosité",
    },
    EXTRAVERSION: { pt: "Extroversão", en: "Extraversion", es: "Extraversión", fr: "Extraversion" },
    AGREEABLENESS: { pt: "Amabilidade", en: "Agreeableness", es: "Amabilidad", fr: "Agréabilité" },
    EMOTIONAL_STABILITY: {
      pt: "Estabilidade Emocional",
      en: "Emotional Stability",
      es: "Estabilidad Emocional",
      fr: "Stabilité Émotionnelle",
    },
  };

  const dimScores = (score.dimensionScores as Record<string, number>) ?? {};
  const highestDim = Object.entries(dimScores).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "OPENNESS";
  const qualityWarning =
    typeof score.uniformResponseWarning === "boolean" ? score.uniformResponseWarning : undefined;

  return {
    sessionId,
    quizSlug,
    quizVersion,
    scoringVersion,
    strongestDimension: highestDim,
    strongestDimensionLabel:
      personalityLabels[highestDim]?.[locale] ?? personalityLabels[highestDim]?.en ?? highestDim,
    dimensionScores: dimScores,
    qualityWarning,
  };
}
