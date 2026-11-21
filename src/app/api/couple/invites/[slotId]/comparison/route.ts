import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { getSlotComparison } from "@/features/couple/couple-invite-service";
import { createRequestId } from "@/lib/observability/request-id";
import { logEvent } from "@/lib/observability/logger";

type RouteProps = {
  params: Promise<{ slotId: string }>;
};

export async function GET(request: NextRequest, { params }: RouteProps) {
  const requestId = request.headers.get("x-request-id") ?? createRequestId();
  const headers = { "x-request-id": requestId, "Cache-Control": "private, no-store" };

  try {
    const { slotId } = await params;
    const sessionId = request.nextUrl.searchParams.get("sessionId");
    const locale = request.nextUrl.searchParams.get("locale") ?? "pt";

    const sessionToken =
      request.headers.get("x-session-token") ?? request.cookies.get(anonymousSessionCookie)?.value;

    if (!z.uuid().safeParse(slotId).success || !z.uuid().safeParse(sessionId).success) {
      return NextResponse.json(
        { error: "Identificadores de convite e sessão são obrigatórios." },
        { status: 400, headers },
      );
    }

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Autenticação da sessão é obrigatória." },
        { status: 401, headers },
      );
    }

    const result = await getSlotComparison({
      slotId,
      sessionId: sessionId!,
      sessionToken,
      locale,
    });

    return NextResponse.json(result, { headers });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown";
    logEvent("warn", "couple_slot_comparison_failed", { requestId, error: message });

    if (message === "UNAUTHORIZED_SLOT_ACCESS") {
      return NextResponse.json(
        { error: "Acesso não autorizado a esta comparação." },
        { status: 403, headers },
      );
    }

    if (message === "SLOT_NOT_FOUND") {
      return NextResponse.json({ error: "Convite não encontrado." }, { status: 404, headers });
    }

    return NextResponse.json(
      { error: "Erro ao consultar comparação do convite." },
      { status: 500, headers },
    );
  }
}
