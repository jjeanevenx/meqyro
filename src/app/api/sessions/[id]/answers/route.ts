import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { saveAnswer } from "@/features/quiz-engine/session-service";
import { createRequestId } from "@/lib/observability/request-id";
import { logEvent } from "@/lib/observability/logger";

const saveAnswerSchema = z.object({
  questionId: z.string().min(1),
  optionId: z.string().optional(),
  numericValue: z.number().int().min(1).max(5).optional(),
  durationMs: z.number().int().nonnegative().optional(),
  nextPosition: z.number().int().positive().optional(),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = request.headers.get("x-request-id") ?? createRequestId();
  const { id: sessionId } = await params;
  const token = request.cookies.get(anonymousSessionCookie)?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: missing session token" },
      { status: 401, headers: { "x-request-id": requestId } },
    );
  }

  try {
    const body = await request.json();
    const parsed = saveAnswerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid answer payload", details: parsed.error.format() },
        { status: 400, headers: { "x-request-id": requestId } },
      );
    }

    const result = await saveAnswer({
      sessionId,
      token,
      ...parsed.data,
    });

    return NextResponse.json(
      { success: result.success, currentPosition: result.currentPosition },
      { status: 200, headers: { "x-request-id": requestId } },
    );
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    const isUnauthorized = error instanceof Error && error.name === "UnauthorizedSessionError";

    logEvent("warn", "quiz_answer_save_failed", {
      requestId,
      sessionId,
      error: errMessage,
    });

    const status = isUnauthorized ? 403 : 400;
    return NextResponse.json(
      { error: errMessage || "Failed to save answer" },
      { status, headers: { "x-request-id": requestId } },
    );
  }
}
