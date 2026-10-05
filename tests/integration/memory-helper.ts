import { NextRequest } from "next/server";
import { POST } from "@/app/api/sessions/[id]/memory/route";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import type { PublicQuestion } from "@/features/quiz-engine/contracts";

export async function acknowledgeMemory(
  question: PublicQuestion,
  sessionId: string,
  token: string,
) {
  if (!question.memoryCue) return;
  const request = new NextRequest(`http://localhost/api/sessions/${sessionId}/memory`, {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie: `${anonymousSessionCookie}=${token}` },
    body: JSON.stringify({ cueId: question.memoryCue.id }),
  });
  const response = await POST(request, { params: Promise.resolve({ id: sessionId }) });
  if (response.status !== 200)
    throw new Error(`Memory acknowledgement failed: ${await response.text()}`);
}
