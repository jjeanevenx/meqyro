import { describe, it, expect } from "vitest";
import {
  startQuizSession,
  saveAnswer,
  completeQuizSession,
  getSessionQuestions,
  getActiveSessionByToken,
} from "@/features/quiz-engine/session-service";
import { createCoupleInvite } from "@/features/couple/couple-service";
import { brainRankDimensions } from "@/features/scoring/brainrank";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { isSupabaseAvailable } from "./db-check";

const isOnline = await isSupabaseAvailable();

describe.skipIf(!isOnline)("Dynamic & Balanced Question Selection (Database Attempt Engine)", () => {
  const supabase = createSupabaseSecretClient();

  it("dynamically selects and balances BrainRank questions (4 per dimension, 1E/2M/1H), persisting to quiz_session_questions", async () => {
    const { session, token } = await startQuizSession({
      quizSlug: "brainrank",
      locale: "pt",
      market: "BR",
    });

    expect(session.id).toBeDefined();

    // 1. Verify rows persisted in meqyro.quiz_session_questions
    const { data: persistedRows, error: pError } = await supabase
      .from("quiz_session_questions")
      .select("question_id, position")
      .eq("session_id", session.id)
      .order("position", { ascending: true });

    expect(pError).toBeNull();
    expect(persistedRows).toHaveLength(24);

    // Verify sequential positions 1 to 24
    persistedRows!.forEach((row, index) => {
      expect(row.position).toBe(index + 1);
    });

    // Verify all selected question IDs are distinct (no duplicates)
    const uniqueIds = new Set(persistedRows!.map((r) => r.question_id));
    expect(uniqueIds.size).toBe(24);

    // 2. Fetch questions via session service
    const sessionQuestions = await getSessionQuestions(session.id, "pt");
    expect(sessionQuestions).toHaveLength(24);

    // 3. Inspect balance against database definitions
    const { data: dbDetails } = await supabase
      .from("questions")
      .select("id, scoring_key")
      .in("id", Array.from(uniqueIds));

    const dimensionCounts: Record<string, number> = {};
    const difficultyCounts: Record<string, number> = { EASY: 0, MEDIUM: 0, HARD: 0 };

    for (const q of dbDetails ?? []) {
      const sk = (q.scoring_key as Record<string, string>) ?? {};
      dimensionCounts[sk.dimension] = (dimensionCounts[sk.dimension] ?? 0) + 1;
      if (sk.difficulty) {
        difficultyCounts[sk.difficulty] = (difficultyCounts[sk.difficulty] ?? 0) + 1;
      }
    }

    for (const dim of brainRankDimensions) {
      expect(dimensionCounts[dim]).toBe(4);
    }

    // 6 Easy, 12 Medium, 6 Hard across all dimensions
    expect(difficultyCounts.EASY).toBe(6);
    expect(difficultyCounts.MEDIUM).toBe(12);
    expect(difficultyCounts.HARD).toBe(6);
  });

  it("reproducibility & resume: page reload (F5) or cookie resume returns the exact same attempt questions and order", async () => {
    // 1. Start initial attempt
    const { session, token } = await startQuizSession({
      quizSlug: "brainrank",
      locale: "pt",
      market: "BR",
    });

    const initialQuestions = await getSessionQuestions(session.id, "pt");
    expect(initialQuestions).toHaveLength(24);

    // Answer first 2 questions
    await saveAnswer({
      sessionId: session.id,
      token,
      questionId: initialQuestions[0]!.id,
      optionId: initialQuestions[0]!.options[0]?.id,
      durationMs: 2000,
      nextPosition: 2,
    });

    await saveAnswer({
      sessionId: session.id,
      token,
      questionId: initialQuestions[1]!.id,
      optionId: initialQuestions[1]!.options[0]?.id,
      durationMs: 1800,
      nextPosition: 3,
    });

    // 2. Simulate browser reload (F5): Server resolves session from cookie token
    const resumedSession = await getActiveSessionByToken(token, "brainrank");
    expect(resumedSession).not.toBeNull();
    expect(resumedSession?.id).toBe(session.id);
    expect(resumedSession?.currentPosition).toBe(3);
    expect(Object.keys(resumedSession?.answers ?? {})).toHaveLength(2);

    // 3. Load questions for resumed session
    const resumedQuestions = await getSessionQuestions(resumedSession!.id, "pt");
    expect(resumedQuestions).toHaveLength(24);

    // Verify 100% deterministic identity in question IDs and positions
    for (let i = 0; i < initialQuestions.length; i++) {
      expect(resumedQuestions[i]!.id).toBe(initialQuestions[i]!.id);
      expect(resumedQuestions[i]!.position).toBe(initialQuestions[i]!.position);
      expect(resumedQuestions[i]!.prompt).toBe(initialQuestions[i]!.prompt);
    }
  });

  it("security & anti-leak: getSessionQuestions never discloses scoring_key, isCorrect, or private weights", async () => {
    const { session } = await startQuizSession({
      quizSlug: "brainrank",
      locale: "pt",
      market: "BR",
    });

    const questions = await getSessionQuestions(session.id, "pt");

    for (const q of questions) {
      // Top-level leaks
      expect((q as Record<string, unknown>).scoring_key).toBeUndefined();
      expect((q as Record<string, unknown>).scoringKey).toBeUndefined();
      expect((q as Record<string, unknown>).correctOptionId).toBeUndefined();

      // Option-level leaks
      for (const opt of q.options) {
        expect((opt as Record<string, unknown>).isCorrect).toBeUndefined();
        expect((opt as Record<string, unknown>).scoring_value).toBeUndefined();
        expect((opt as Record<string, unknown>).scoringValue).toBeUndefined();
      }
    }
  });

  it("attempt boundary integrity: rejects answers to questions not selected for the attempt", async () => {
    const { session, token } = await startQuizSession({
      quizSlug: "brainrank",
      locale: "pt",
      market: "BR",
    });

    const attemptQuestions = await getSessionQuestions(session.id, "pt");
    const selectedIds = new Set(attemptQuestions.map((q) => q.id));

    // Find a question in DB for brainrank that was NOT selected for this attempt
    const { data: otherQuestions } = await supabase
      .from("questions")
      .select("id, options(id)")
      .eq("quiz_version_id", session.quizVersionId)
      .not("id", "in", `(${Array.from(selectedIds).join(",")})`)
      .limit(1);

    expect(otherQuestions).toBeDefined();
    expect(otherQuestions!.length).toBeGreaterThan(0);

    const alienQuestion = otherQuestions![0]!;
    const alienOptId = (alienQuestion.options as Array<{ id: string }>)[0]?.id;

    // Attempt to save answer for unselected question
    await expect(
      saveAnswer({
        sessionId: session.id,
        token,
        questionId: alienQuestion.id,
        optionId: alienOptId,
        durationMs: 1500,
        nextPosition: 2,
      }),
    ).rejects.toThrow("Question does not belong to this attempt");
  });

  it("CoupleDNA bilateral synchronization: Partner B inherits exact question selection and ordering from Partner A", async () => {
    // 1. Partner A starts CoupleDNA
    const { session: sessionA, token: tokenA } = await startQuizSession({
      quizSlug: "coupledna",
      locale: "pt",
      market: "BR",
    });

    const questionsA = await getSessionQuestions(sessionA.id, "pt");
    expect(questionsA).toHaveLength(20);

    // 2. Partner A creates couple invite
    const invite = await createCoupleInvite(sessionA.id, tokenA, "pt");
    expect(invite).not.toBeNull();
    expect(invite?.inviteCode).toBeDefined();

    // 3. Partner B joins via inviteCode
    const { session: sessionB } = await startQuizSession({
      quizSlug: "coupledna",
      locale: "pt",
      market: "BR",
      inviteCode: invite!.inviteCode,
    });

    expect(sessionB.id).not.toBe(sessionA.id);

    // 4. Load questions for Partner B
    const questionsB = await getSessionQuestions(sessionB.id, "pt");
    expect(questionsB).toHaveLength(20);

    // 5. Assert 100% bilateral match in questions and positions
    for (let i = 0; i < questionsA.length; i++) {
      expect(questionsB[i]!.id).toBe(questionsA[i]!.id);
      expect(questionsB[i]!.position).toBe(questionsA[i]!.position);
      expect(questionsB[i]!.prompt).toBe(questionsA[i]!.prompt);
    }
  });

  it("attempt scoring: finishes attempt and calculates score using only selected attempt questions", async () => {
    const { session, token } = await startQuizSession({
      quizSlug: "brainrank",
      locale: "pt",
      market: "BR",
    });

    const questions = await getSessionQuestions(session.id, "pt");
    expect(questions).toHaveLength(24);

    // Answer all 24 questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]!;
      await saveAnswer({
        sessionId: session.id,
        token,
        questionId: q.id,
        optionId: q.options[0]?.id,
        durationMs: 1200,
        nextPosition: i + 2,
      });
    }

    const result = await completeQuizSession({
      sessionId: session.id,
      token,
    });

    expect(result.sessionId).toBe(session.id);
    expect(result.quizSlug).toBe("brainrank");
    expect(result.overallScore).toBeDefined();
    expect(result.strongestDimension).toBeDefined();
    expect(result.dimensionScores).toBeDefined();
    expect(Object.keys(result.dimensionScores ?? {})).toHaveLength(6);
  });
});
