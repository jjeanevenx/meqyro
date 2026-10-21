import { questionClock } from "@/features/quiz-engine/session-service";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/sessions/[id]/memory/route";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import type { PublicQuestion } from "@/features/quiz-engine/contracts";

export async function acknowledgeMemory(
  question: PublicQuestion,
  sessionId: string,
  token: string,
) {
  if (!question.memoryCue) {
    await startClock();
    return;
  }
  const request = new NextRequest(`http://localhost/api/sessions/${sessionId}/memory`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie: `${anonymousSessionCookie}=${token}` },
    body: JSON.stringify({ cueId: question.memoryCue.id }),
  });
  const response = await POST(request, { params: Promise.resolve({ id: sessionId }) });
  if (response.status !== 200)
    throw new Error(`Memory acknowledgement failed: ${await response.text()}`);
  await startClock();
  async function startClock() {
    const { data } = await createSupabaseSecretClient()
      .from("quiz_session_questions")
      .select("time_limit_seconds")
      .eq("session_id", sessionId)
      .eq("question_id", question.id)
      .single();
    if (data?.time_limit_seconds)
      await questionClock({ sessionId, token, questionId: question.id });
  }
}
