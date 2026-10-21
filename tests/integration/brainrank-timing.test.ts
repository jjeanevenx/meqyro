import { describe, expect, it } from "vitest";
import {
  startQuizSession,
  getSessionQuestions,
  questionClock,
  saveAnswer,
  getActiveSession,
  completeQuizSession,
} from "@/features/quiz-engine/session-service";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { acknowledgeMemory } from "./memory-helper";
import { isSupabaseAvailable } from "./db-check";

const online = await isSupabaseAvailable();
describe.runIf(online)("BrainRank deadlines — real database", () => {
  async function attempt() {
    const { session, token } = await startQuizSession({
      quizSlug: "brainrank",
      locale: "pt",
      market: "BR",
    });
    const questions = await getSessionQuestions(session.id, "pt");
    await acknowledgeMemory(questions[0], session.id, token);
    return { sessionId: session.id, token, questions, questionId: questions[0].id };
  }
  it("pins the plan, resumes the same deadline and prevents duplicate overwrites", async () => {
    const a = await attempt();
    const first = await questionClock(a);
    const resumed = await getActiveSession(a.sessionId, a.token);
    expect(resumed?.currentPosition).toBe(1);
    const again = await questionClock(a);
    expect(again.questionStartedAt).toBe(first.questionStartedAt);
    expect(again.questionExpiresAt).toBe(first.questionExpiresAt);
    const payload = {
      ...a,
      optionId: a.questions[0].options[0].id,
      durationMs: 999999,
      nextPosition: 24,
    };
    const results = await Promise.all([saveAnswer(payload), saveAnswer(payload)]);
    expect(results.every((r) => r.currentPosition === 2)).toBe(true);
    const db = createSupabaseSecretClient();
    const { data } = await db
      .from("answers")
      .select("option_id,duration_ms,answer_status")
      .eq("session_id", a.sessionId)
      .eq("question_id", a.questionId);
    expect(data).toHaveLength(1);
    expect(data?.[0].duration_ms).toBeLessThan(999999);
    expect(data?.[0].answer_status).toBe("ANSWERED");
    const second = await questionClock({ ...a, questionId: a.questions[1].id });
    expect(Date.parse(second.questionExpiresAt) - Date.parse(second.questionStartedAt)).toBe(
      second.timeLimitSeconds * 1000,
    );
  });
  it("rejects early expiry, accepts a delayed timeout without credit and continues", async () => {
    const a = await attempt();
    const clock = await questionClock(a);
    await expect(saveAnswer({ ...a, timeout: true })).rejects.toThrow();
    const db = createSupabaseSecretClient();
    const expiry = new Date("2000-01-01T00:00:00.000Z");
    const { error } = await db
      .from("quiz_session_questions")
      .update({
        question_started_at: new Date(
          expiry.getTime() - clock.timeLimitSeconds * 1000,
        ).toISOString(),
        question_expires_at: expiry.toISOString(),
      })
      .eq("session_id", a.sessionId)
      .eq("question_id", a.questionId);
    expect(error).toBeNull();
    const saved = await saveAnswer({ ...a, optionId: a.questions[0].options[0].id, durationMs: 1 });
    expect(saved.answerStatus).toBe("TIMEOUT");
    expect(saved.currentPosition).toBe(2);
    const { data } = await db
      .from("answers")
      .select("option_id,duration_ms,answer_status")
      .eq("session_id", a.sessionId)
      .single();
    expect(data).toMatchObject({
      option_id: null,
      duration_ms: clock.timeLimitSeconds * 1000,
      answer_status: "TIMEOUT",
    });
    const resumed = await getActiveSession(a.sessionId, a.token);
    expect(resumed?.answers[a.questionId].answerStatus).toBe("TIMEOUT");
  });
  it("requires a started question and blocks skipping the sequence", async () => {
    const a = await attempt();
    await expect(questionClock({ ...a, questionId: a.questions[2].id })).rejects.toThrow();
    await expect(
      saveAnswer({ ...a, questionId: a.questions[2].id, optionId: a.questions[2].options[0].id }),
    ).rejects.toThrow();
    await expect(saveAnswer({ ...a, optionId: a.questions[1].options[0].id })).rejects.toThrow();
  });
  it("completes 24 questions including three timed recalls and stores coherent premium metrics", async () => {
    const a = await attempt();
    for (const q of a.questions) {
      await acknowledgeMemory(q, a.sessionId, a.token);
      await saveAnswer({ ...a, questionId: q.id, optionId: q.options[0].id });
    }
    await completeQuizSession(a);
    const { data } = await createSupabaseSecretClient()
      .from("results")
      .select("score")
      .eq("session_id", a.sessionId)
      .single();
    expect(data?.score.timing.measuredQuestions).toBe(24);
    expect(data?.score.timing.memory.total).toBe(3);
    expect(data?.score.timing.completedInTimePercent).toBe(100);
    expect(data?.score.timing.items).toHaveLength(24);
  });
});
