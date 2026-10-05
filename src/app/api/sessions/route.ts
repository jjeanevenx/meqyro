import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  anonymousSessionCookie,
  anonymousSessionCookieOptions,
} from "@/lib/security/anonymous-session";
import {
  startQuizSession,
  getActiveSession,
  getSessionQuestions,
} from "@/features/quiz-engine/session-service";
import { createRequestId } from "@/lib/observability/request-id";
import { logEvent } from "@/lib/observability/logger";
import type { Locale } from "@/lib/i18n/config";
import { isMarket, marketForCountry } from "@/lib/market/market-context";

const createSessionSchema = z.object({
  quizSlug: z.string().min(1),
  locale: z.enum(["pt", "en", "es", "fr"]).default("pt"),
  market: z.enum(["BR", "US", "EU", "GB"]).default("BR"),
  referralCode: z.string().optional(),
  inviteCode: z.string().optional(),
  comparisonConsent: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? createRequestId();

  try {
    const body = await request.json();
    const parsed = createSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid session request", details: parsed.error.format() },
        { status: 400, headers: { "x-request-id": requestId } },
      );
    }

    const cookieToken = request.cookies.get(anonymousSessionCookie)?.value;

    const marketCookie = request.cookies.get("meqyro_market")?.value;
    const country =
      request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry");
    const resolvedMarket = isMarket(marketCookie)
      ? marketCookie
      : country
        ? marketForCountry(country)
        : parsed.data.market;

    const { session, token } = await startQuizSession({
      ...parsed.data,
      market: resolvedMarket,
      existingToken: cookieToken,
    });

    const questions = await getSessionQuestions(session.id, parsed.data.locale as Locale);

    logEvent("info", "quiz_session_created", {
      requestId,
      sessionId: session.id,
      quizSlug: session.quizSlug,
      locale: session.locale,
      market: session.market,
      questionsCount: questions.length,
    });

    const response = NextResponse.json(
      { session, questions },
      { status: 201, headers: { "x-request-id": requestId } },
    );

    response.cookies.set(anonymousSessionCookie, token, anonymousSessionCookieOptions());
    return response;
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);

    logEvent("error", "quiz_session_create_failed", {
      requestId,
      error: errMessage,
    });

    return NextResponse.json(
      { error: "Failed to initialize session" },
      { status: 500, headers: { "x-request-id": requestId } },
    );
  }
}

export async function GET(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? createRequestId();
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get("sessionId");
  const cookieToken = request.cookies.get(anonymousSessionCookie)?.value;

  if (!sessionId || !cookieToken) {
    return NextResponse.json(
      { error: "Missing session ID or authorization" },
      { status: 401, headers: { "x-request-id": requestId } },
    );
  }

  try {
    const session = await getActiveSession(sessionId, cookieToken);

    if (!session) {
      return NextResponse.json(
        { error: "Session not found or expired" },
        { status: 404, headers: { "x-request-id": requestId } },
      );
    }

    const questions = await getSessionQuestions(session.id, (session.locale as Locale) ?? "pt");

    return NextResponse.json(
      { session, questions },
      { status: 200, headers: { "x-request-id": requestId } },
    );
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);

    logEvent("error", "quiz_session_retrieve_failed", {
      requestId,
      sessionId,
      error: errMessage,
    });

    return NextResponse.json(
      { error: "Unauthorized session access" },
      { status: 403, headers: { "x-request-id": requestId } },
    );
  }
}
