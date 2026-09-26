import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProtectedResult } from "@/features/results/result-service";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { isLocale } from "@/lib/i18n/config";
import type { Market } from "@/lib/market/market-context";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get(anonymousSessionCookie)?.value;
    const tokenFromHeader = req.headers.get("x-session-token");
    const tokenFromQuery = req.nextUrl.searchParams.get("token");

    const sessionToken = tokenFromCookie ?? tokenFromHeader ?? tokenFromQuery;

    if (!sessionToken) {
      return NextResponse.json({ error: "Token de sessão não fornecido." }, { status: 401 });
    }

    const localeParam = req.nextUrl.searchParams.get("locale") ?? "pt";
    const marketParam = (req.nextUrl.searchParams.get("market") ?? "BR") as Market;

    const safeLocale = isLocale(localeParam) ? localeParam : "pt";

    const result = await getProtectedResult({
      sessionId: id,
      sessionToken,
      locale: safeLocale,
      market: marketParam,
    });

    return NextResponse.json({ result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao carregar resultado.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
