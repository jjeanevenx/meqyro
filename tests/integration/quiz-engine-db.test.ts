import { acknowledgeMemory } from "./memory-helper";
import { describe, expect, it } from "vitest";
import { getPublicQuiz } from "@/features/quiz-engine/repository";
import {
  startQuizSession,
  saveAnswer,
  completeQuizSession,
  getActiveSession,
  getSessionQuestions,
  UnauthorizedSessionError,
} from "@/features/quiz-engine/session-service";
import { isSupabaseAvailable } from "./db-check";
import { createSupabaseSecretClient } from "@/lib/supabase/server";

const isOnline = await isSupabaseAvailable();

describe.skipIf(!isOnline)(
  "Quiz Engine — Anonymous Session & Answer Persistence Lifecycle (DB)",
  () => {
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
      const quiz = await getPublicQuiz("brainrank", "pt", session.id);
      const firstQ = quiz!.questions[0];
      const firstOpt = firstQ.options[0];

      await acknowledgeMemory(firstQ, session.id, token);
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
    });

    it("rejects an option belonging to another question without storing an answer", async () => {
      const { session, token } = await startQuizSession({
        quizSlug: "moneydna",
        locale: "pt",
        market: "BR",
      });
      const questions = await getSessionQuestions(session.id, "pt");
      const choices = questions.filter((question) => question.options.length > 0);
      expect(choices.length).toBeGreaterThan(1);
      await expect(
        saveAnswer({
          sessionId: session.id,
          token,
          questionId: choices[0].id,
          optionId: choices[1].options[0].id,
        }),
      ).rejects.toThrow("Option does not belong to this question");
      expect((await getActiveSession(session.id, token))?.answers).toEqual({});
    });

    it("rejects a foreign question even for a legacy session without assigned rows", async () => {
      const current = await startQuizSession({ quizSlug: "moneydna", locale: "pt", market: "BR" });
      const foreign = await startQuizSession({ quizSlug: "coupledna", locale: "pt", market: "BR" });
      const question = (await getSessionQuestions(foreign.session.id, "pt"))[0];
      const answer = {
        sessionId: current.session.id,
        token: current.token,
        questionId: question.id,
        numericValue: 3,
      };
      await expect(saveAnswer(answer)).rejects.toThrow("Question does not belong to this attempt");
      const { error } = await createSupabaseSecretClient()
        .from("quiz_session_questions")
        .delete()
        .eq("session_id", current.session.id);
      expect(error).toBeNull();
      await expect(saveAnswer(answer)).rejects.toThrow("Question does not belong to this attempt");
      expect((await getActiveSession(current.session.id, current.token))?.answers).toEqual({});
    });

    it("completes full BrainRank session on server and computes score", async () => {
      const { session, token } = await startQuizSession({
        quizSlug: "brainrank",
        locale: "pt",
        market: "BR",
      });

      const quiz = await getPublicQuiz("brainrank", "pt", session.id);
      expect(quiz?.questions).toHaveLength(24);

      for (let i = 0; i < quiz!.questions.length; i++) {
        const q = quiz!.questions[i];
        await acknowledgeMemory(q, session.id, token);
        const opt = q.options[0];
        await saveAnswer({
          sessionId: session.id,
          token,
          questionId: q.id,
          optionId: opt.id,
          durationMs: 2500,
          nextPosition: i + 2,
        });
      }

      const completion = await completeQuizSession({
        sessionId: session.id,
        token,
      });

      expect(completion.sessionId).toBe(session.id);
      expect(completion.strongestDimension).toBeDefined();
      expect(completion.overallScore).toBeDefined();
    });
  },
);
