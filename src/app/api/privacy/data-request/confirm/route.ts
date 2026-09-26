import { NextRequest, NextResponse } from "next/server";
import { confirmDataRequest } from "@/features/privacy/consent-service";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rl = checkRateLimit(clientIp, {
      windowMs: 5 * 60 * 1000,
      maxRequests: 10,
      keyPrefix: "data_request_confirm",
    });

    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Muitas tentativas de confirmação. Aguarde alguns instantes." },
        { status: 429, headers: rl.headers },
      );
    }

    const body = await req.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token de confirmação é obrigatório." }, { status: 400 });
    }

    const result = await confirmDataRequest(token);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao confirmar solicitação.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
