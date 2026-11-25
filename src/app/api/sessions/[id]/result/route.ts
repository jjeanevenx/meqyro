import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProtectedResult } from "@/features/results/result-service";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { isLocale } from "@/lib/i18n/config";
import type { Market } from "@/lib/market/market-context";

export const dynamic = "force-dynamic";

const privateHeaders = {
  "Cache-Control": "private, no-store",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};

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
      return NextResponse.json(
        { error: "Token de sessão não fornecido." },
        { status: 401, headers: privateHeaders },
      );
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

    return NextResponse.json({ result }, { headers: privateHeaders });
  } catch (err: unknown) {
    const raw = err instanceof Error ? err.message : "";
    if (raw.includes("Token de acesso inválido")) {
      return NextResponse.json(
        { error: "Acesso não autorizado ao resultado." },
        { status: 403, headers: privateHeaders },
      );
    }
    if (raw.includes("Sessão não encontrada") || raw.includes("Resultado ainda não calculado")) {
      return NextResponse.json(
        { error: "Resultado não encontrado." },
        { status: 404, headers: privateHeaders },
      );
    }
    return NextResponse.json(
      { error: "Erro ao carregar resultado." },
      { status: 400, headers: privateHeaders },
    );
  }
}
