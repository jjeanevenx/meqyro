import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "@/lib/i18n/config";
import { ASSESSMENT_SELECTION_CONFIGS } from "@/features/quiz-engine/selection-config";
import { validateAndRecoverSession } from "@/features/quiz-engine/session-service";
import {
  anonymousSessionCookie,
  anonymousSessionCookieOptions,
} from "@/lib/security/anonymous-session";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const locale = query.get("locale") ?? "pt";
  const slug = query.get("slug") ?? "";
  if (!isLocale(locale) || !Object.hasOwn(ASSESSMENT_SELECTION_CONFIGS, slug)) {
    return NextResponse.json({ error: "Invalid recovery request" }, { status: 400 });
  }
  const playPath = `/${locale}/quizzes/${slug}/play`;
  let destination = playPath;
  let token: string | undefined;
  try {
    const recovered = await validateAndRecoverSession({
      sessionId: query.get("session") ?? "",
      recoveryToken: query.get("recover") ?? "",
      quizSlug: slug,
    });
    token = recovered.token;
    if (recovered.status === "COMPLETED") {
      destination = `/${locale}/quizzes/${slug}/result?session=${encodeURIComponent(recovered.sessionId)}`;
    }
  } catch {
    // Invalid links cannot authenticate a session or disclose its state.
  }
  const response = NextResponse.redirect(new URL(destination, request.url), 303);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  if (token) response.cookies.set(anonymousSessionCookie, token, anonymousSessionCookieOptions());
  return response;
}
