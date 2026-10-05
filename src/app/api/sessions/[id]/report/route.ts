import type { NextRequest } from "next/server";
import { getProtectedResult } from "@/features/results/result-service";
import { reportHtml } from "@/features/results/report-document";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { isLocale } from "@/lib/i18n/config";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
  const token =
    request.cookies.get(anonymousSessionCookie)?.value ?? request.headers.get("x-session-token");
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401, headers });
  try {
    const { id } = await params;
    const language = request.nextUrl.searchParams.get("locale");
    const locale = isLocale(language ?? "") ? language! : "pt";
    const result = await getProtectedResult({
      sessionId: id,
      sessionToken: token,
      locale,
      market: "BR",
    });
    if (result.accessLevel !== "PREMIUM_UNLOCKED" || !result.premiumReport) {
      return Response.json({ error: "Payment required" }, { status: 403, headers });
    }
    return new Response(reportHtml(result.premiumReport, result.quizSlug, locale), {
      headers: {
        ...headers,
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="meqyro-${result.quizSlug}-resultado.html"`,
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      },
    });
  } catch {
    return Response.json({ error: "Report unavailable" }, { status: 403, headers });
  }
}
