import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { recordLeadAndConsents } from "@/features/privacy/consent-service";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { isLocale } from "@/lib/i18n/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, email, marketingConsent, locale, market } = body;

    if (!sessionId || !email) {
      return NextResponse.json({ error: "Sessão e e-mail são obrigatórios." }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionToken = body.sessionToken ?? cookieStore.get(anonymousSessionCookie)?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Token de sessão não encontrado." }, { status: 401 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const userAgent = req.headers.get("user-agent") ?? undefined;

    const safeLocale = isLocale(locale) ? locale : "pt";
    const safeMarket = market ?? "BR";

    const result = await recordLeadAndConsents({
      sessionId,
      sessionToken,
      email,
      marketingConsent: Boolean(marketingConsent),
      locale: safeLocale,
      market: safeMarket,
      ip,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      lead: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao processar captura de lead.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
