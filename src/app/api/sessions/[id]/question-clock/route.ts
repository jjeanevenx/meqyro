import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { questionClock } from "@/features/quiz-engine/session-service";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { createRequestId } from "@/lib/observability/request-id";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = createRequestId();
  const headers = { "Cache-Control": "no-store", "x-request-id": requestId };
  const token = request.cookies.get(anonymousSessionCookie)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
  try {
    const parsed = z.object({ questionId: z.string().uuid() }).safeParse(await request.json());
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid question" }, { status: 400, headers });
    const { id } = await params;
    const clock = await questionClock({ sessionId: id, token, questionId: parsed.data.questionId });
    return NextResponse.json(clock, { headers });
  } catch {
    return NextResponse.json({ error: "Unable to synchronize question" }, { status: 400, headers });
  }
}
