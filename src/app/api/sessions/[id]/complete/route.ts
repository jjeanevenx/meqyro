import { NextResponse, type NextRequest } from "next/server";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { completeQuizSession } from "@/features/quiz-engine/session-service";
import { createRequestId } from "@/lib/observability/request-id";
import { logEvent } from "@/lib/observability/logger";

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
    const result = await completeQuizSession({
      sessionId,
      token,
    });

    logEvent("info", "quiz_session_completed", {
      requestId,
      sessionId,
      quizSlug: result.quizSlug,
      overallScore: result.overallScore,
      strongestDimension: result.strongestDimension,
    });

    return NextResponse.json({ result }, { status: 200, headers: { "x-request-id": requestId } });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    const errName = error instanceof Error ? error.name : "";

    logEvent("warn", "quiz_session_complete_failed", {
      requestId,
      sessionId,
      error: errMessage,
    });

    const status =
      errName === "UnauthorizedSessionError"
        ? 403
        : errName === "IncompleteQuizSubmissionError"
          ? 422
          : 400;

    return NextResponse.json(
      { error: errMessage || "Failed to complete quiz" },
      { status, headers: { "x-request-id": requestId } },
    );
  }
}
