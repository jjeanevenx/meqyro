import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { getCoupleComparison } from "@/features/couple/couple-service";
import { z } from "zod";
import { createRequestId } from "@/lib/observability/request-id";
import { logEvent } from "@/lib/observability/logger";

type RouteProps = {
  params: Promise<{ code: string }>;
};

export async function GET(request: Request, { params }: RouteProps) {
  const requestId = createRequestId();
  const headers = { "x-request-id": requestId, "Cache-Control": "private, no-store" };
  try {
    const { code } = await params;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    const cookieStore = await cookies();
    const sessionToken =
      request.headers.get("x-session-token") ?? cookieStore.get(anonymousSessionCookie)?.value;

    if (!z.uuid().safeParse(sessionId).success || !sessionToken || !code) {
      return NextResponse.json(
        { error: "Parâmetros insuficientes para consultar comparação." },
        { status: 400, headers },
      );
    }

    const comparison = await getCoupleComparison(code, sessionId!, sessionToken);
    if (!comparison) {
      return NextResponse.json(
        { error: "Convite não encontrado ou acesso não autorizado." },
        { status: 404, headers },
      );
    }

    return NextResponse.json(comparison, { headers });
  } catch (error: unknown) {
    logEvent("error", "couple_status_request_failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown",
    });
    return NextResponse.json(
      { error: "Erro ao obter status da comparação bilateral." },
      { status: 500, headers },
    );
  }
}
