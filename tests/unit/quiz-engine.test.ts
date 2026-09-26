import { describe, expect, it, beforeAll } from "vitest";
import { getPublicQuiz, getFallbackPublicQuiz } from "@/features/quiz-engine/repository";
import {
  startQuizSession,
  saveAnswer,
  completeQuizSession,
  getActiveSession,
  UnauthorizedSessionError,
} from "@/features/quiz-engine/session-service";

beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54321";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
  process.env.SUPABASE_SECRET_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";
});

describe("Quiz Engine — Public Content Sanitization", () => {
  it("fallback public quiz never leaks correct answers or scoring keys", () => {
    const quiz = getFallbackPublicQuiz("brainrank", "pt");
    expect(quiz).not.toBeNull();
    expect(quiz?.questions).toHaveLength(24);

    for (const q of quiz!.questions) {
      expect(q).not.toHaveProperty("scoringKey");
      expect(q).not.toHaveProperty("scoring_key");
      expect(q).not.toHaveProperty("correctOptionId");
      expect(q.options).toHaveLength(4);

      for (const opt of q.options) {
        expect(opt).not.toHaveProperty("isCorrect");
        expect(opt).not.toHaveProperty("scoring_value");
        expect(opt).not.toHaveProperty("scoringValue");
      }
    }
  });

  it("Personality Map public quiz exposes 40 statements without scoring keys", () => {
    const quiz = getFallbackPublicQuiz("personality-map", "en");
    expect(quiz).not.toBeNull();
    expect(quiz?.questions).toHaveLength(40);

    for (const q of quiz!.questions) {
      expect(q).not.toHaveProperty("scoringKey");
      expect(q).not.toHaveProperty("direction");
      expect(q.kind).toBe("LIKERT");
    }
  });

  it("loads BrainRank from repository and database safely", async () => {
    const quiz = await getPublicQuiz("brainrank", "pt");
    expect(quiz).not.toBeNull();
    expect(quiz?.slug).toBe("brainrank");
    expect(quiz?.totalQuestions).toBe(24);
    expect(quiz?.questions[0].prompt).toBeTruthy();
    expect(quiz?.questions[0].options.length).toBe(4);
  });
});

describe("Quiz Engine — Anonymous Session & Answer Persistence Lifecycle", () => {
  it("creates an anonymous session with opaque token and saves answers", async () => {
    const { session, token } = await startQuizSession({
      quizSlug: "brainrank",
      locale: "pt",
      market: "BR",
    });

    expect(session.id).toBeDefined();
    expect(session.status).toBe("CREATED");
    expect(token).toHaveLength(43); // 256-bit base64url

    // Retrieve active session
    const retrieved = await getActiveSession(session.id, token);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(session.id);
    expect(retrieved?.status).toBe("CREATED");

    // Invalid token must be rejected
    await expect(getActiveSession(session.id, "invalid-token-tampered")).rejects.toThrow(
      UnauthorizedSessionError,
    );

    // Fetch quiz to get question and option IDs
    const quiz = await getPublicQuiz("brainrank", "pt");
    const firstQ = quiz!.questions[0];
    const firstOpt = firstQ.options[0];

    // Save answer
    const saveResult = await saveAnswer({
      sessionId: session.id,
      token,
      questionId: firstQ.id,
      optionId: firstOpt.id,
      durationMs: 4200,
      nextPosition: 2,
    });

    expect(saveResult.success).toBe(true);
    expect(saveResult.currentPosition).toBe(2);

    // Verify answer is persisted upon reload
    const refreshed = await getActiveSession(session.id, token);
    expect(refreshed?.currentPosition).toBe(2);
    expect(refreshed?.status).toBe("IN_PROGRESS");
    expect(refreshed?.answers[firstQ.id]?.optionId).toBe(firstOpt.id);
  });

  it("completes full BrainRank session on server and computes score", async () => {
    const { session, token } = await startQuizSession({
      quizSlug: "brainrank",
      locale: "pt",
      market: "BR",
    });

    const quiz = await getPublicQuiz("brainrank", "pt");
    expect(quiz?.questions).toHaveLength(24);

    // Submit answers for all 24 questions
    for (const [index, q] of quiz!.questions.entries()) {
      await saveAnswer({
        sessionId: session.id,
        token,
        questionId: q.id,
        optionId: q.options[0].id,
        durationMs: 3000,
        nextPosition: index + 1,
      });
    }

    // Complete session
    const result = await completeQuizSession({
      sessionId: session.id,
      token,
    });

    expect(result.sessionId).toBe(session.id);
    expect(result.quizSlug).toBe("brainrank");
    expect(result.overallScore).toBeDefined();
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.strongestDimension).toBeDefined();
    expect(result.strongestDimensionLabel).toBeTruthy();

    // Verify session in DB is now COMPLETED
    const completedSession = await getActiveSession(session.id, token);
    expect(completedSession?.status).toBe("COMPLETED");

    // Immutability check: saving an answer after completion MUST be rejected
    await expect(
      saveAnswer({
        sessionId: session.id,
        token,
        questionId: quiz!.questions[0].id,
        optionId: quiz!.questions[0].options[1].id,
      }),
    ).rejects.toThrow();
  });

  it("completes Personality Map session with 40 Likert answers", async () => {
    const { session, token } = await startQuizSession({
      quizSlug: "personality-map",
      locale: "en",
      market: "US",
    });

    const quiz = await getPublicQuiz("personality-map", "en");
    expect(quiz?.questions).toHaveLength(40);

    for (const [index, q] of quiz!.questions.entries()) {
      await saveAnswer({
        sessionId: session.id,
        token,
        questionId: q.id,
        numericValue: 4, // "Agree"
        durationMs: 2500,
        nextPosition: index + 1,
      });
    }

    const result = await completeQuizSession({
      sessionId: session.id,
      token,
    });

    expect(result.sessionId).toBe(session.id);
    expect(result.quizSlug).toBe("personality-map");
    expect(result.dimensionScores).toBeDefined();
    expect(Object.keys(result.dimensionScores!)).toHaveLength(5);
    expect(result.qualityWarning).toBe(true); // 40 uniform answers triggers warning
  });
});
