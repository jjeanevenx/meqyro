import { NextResponse } from "next/server";
import { createCoupleInvite } from "@/features/couple/couple-service";
import { cookies } from "next/headers";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { z } from "zod";
import { createRequestId } from "@/lib/observability/request-id";
import { logEvent } from "@/lib/observability/logger";

const inviteSchema = z.object({
  sessionId: z.uuid(),
  locale: z.enum(["pt", "en", "es", "fr"]).default("pt"),
  consent: z.literal(true),
});

export async function POST(request: Request) {
  const requestId = createRequestId();
  const headers = { "x-request-id": requestId, "Cache-Control": "private, no-store" };
  try {
    const parsed = inviteSchema.safeParse(await request.json());
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid invitation request" }, { status: 400, headers });
    const { sessionId, locale, consent } = parsed.data;
    const sessionToken = (await cookies()).get(anonymousSessionCookie)?.value;

    if (!sessionId || !sessionToken) {
      return NextResponse.json(
        { error: "Sessão e token de autenticação são obrigatórios." },
        { status: 401, headers },
      );
    }

    const invite = await createCoupleInvite(
      sessionId,
      sessionToken,
      locale ?? "pt",
      consent === true,
    );
    if (!invite) {
      return NextResponse.json(
        { error: "Falha ao gerar convite ou sessão inválida." },
        { status: 403, headers },
      );
    }

    return NextResponse.json(invite, { headers });
  } catch (error: unknown) {
    logEvent("error", "couple_invite_request_failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown",
    });
    return NextResponse.json(
      { error: "Erro ao processar solicitação de convite." },
      { status: 500, headers },
    );
  }
}
