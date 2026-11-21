import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { redeemInviteSlot } from "@/features/couple/couple-invite-service";
import { createRequestId } from "@/lib/observability/request-id";
import { logEvent } from "@/lib/observability/logger";

const acceptInviteSchema = z.object({
  guestSessionId: z.uuid(),
  inviteCode: z.string().min(4).max(32),
  consent: z.literal(true),
});

type RouteProps = {
  params: Promise<{ slotId: string }>;
};

export async function POST(request: NextRequest, { params }: RouteProps) {
  const requestId = request.headers.get("x-request-id") ?? createRequestId();
  const headers = { "x-request-id": requestId, "Cache-Control": "private, no-store" };

  try {
    const { slotId } = await params;
    const parsed = acceptInviteSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success || !z.uuid().safeParse(slotId).success) {
      return NextResponse.json(
        { error: "Dados de resgate de convite inválidos." },
        { status: 400, headers },
      );
    }

    const guestToken =
      request.headers.get("x-session-token") ?? request.cookies.get(anonymousSessionCookie)?.value;

    if (!guestToken) {
      return NextResponse.json(
        { error: "Autenticação da sessão do convidado é obrigatória." },
        { status: 401, headers },
      );
    }

    await redeemInviteSlot({
      inviteCode: parsed.data.inviteCode,
      guestSessionId: parsed.data.guestSessionId,
      guestToken,
    });

    return NextResponse.json({ success: true, slotId }, { headers });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown";
    logEvent("warn", "couple_invite_accept_failed", { requestId, error: message });

    if (message === "ALREADY_REDEEMED") {
      return NextResponse.json(
        { error: "Este convite já foi utilizado por outro participante." },
        { status: 409, headers },
      );
    }

    if (message.includes("Invalid guest session token") || message.includes("Host cannot redeem")) {
      return NextResponse.json(
        { error: "Não autorizado a resgatar este convite." },
        { status: 403, headers },
      );
    }

    return NextResponse.json(
      { error: "Convite indisponível ou expirado." },
      { status: 400, headers },
    );
  }
}
