import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createOrder } from "@/features/commerce/order-service";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import type { Market } from "@/lib/market/market-context";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rl = checkRateLimit(clientIp, {
      windowMs: 60 * 1000,
      maxRequests: 20,
      keyPrefix: "checkout",
    });

    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Muitas tentativas de checkout. Aguarde um momento." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetMs / 1000)) } },
      );
    }

    const body = await req.json();
    const { sessionId, productCode, customerEmail, locale, market, referralCode } = body;

    if (!sessionId || !productCode || !customerEmail) {
      return NextResponse.json(
        { error: "Sessão, produto e e-mail são obrigatórios." },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const sessionToken = body.sessionToken ?? cookieStore.get(anonymousSessionCookie)?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Sessão anônima não autenticada." },
        { status: 401 },
      );
    }

    const safeMarket = (market ?? "BR") as Market;
    const safeLocale = locale ?? "pt";

    const result = await createOrder({
      sessionId,
      sessionToken,
      productCode,
      customerEmail,
      market: safeMarket,
      locale: safeLocale,
      referralCode: typeof referralCode === "string" ? referralCode : undefined,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao iniciar checkout.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
