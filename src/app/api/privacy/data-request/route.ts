import { NextRequest, NextResponse } from "next/server";
import { submitDataRequest } from "@/features/privacy/consent-service";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import type { DataRequestType } from "@/features/privacy/contracts";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rl = checkRateLimit(clientIp, {
      windowMs: 60 * 1000,
      maxRequests: 10,
      keyPrefix: "data_request",
    });

    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Muitas solicitações enviadas. Aguarde um instante." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetMs / 1000)) } },
      );
    }

    const body = await req.json();
    const { email, requestType, details, locale, market } = body;

    if (!email || !requestType) {
      return NextResponse.json(
        { error: "E-mail e tipo de solicitação são obrigatórios." },
        { status: 400 },
      );
    }

    const validTypes: DataRequestType[] = ["EXPORT", "RECTIFICATION", "DELETION"];
    if (!validTypes.includes(requestType)) {
      return NextResponse.json({ error: "Tipo de solicitação inválido." }, { status: 400 });
    }

    const result = await submitDataRequest({
      email,
      requestType,
      details,
      locale: locale ?? "pt",
      market: market ?? "BR",
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao registrar solicitação.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
