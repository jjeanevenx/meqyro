import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createOrder } from "@/features/commerce/order-service";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import type { Market } from "@/lib/market/market-context";
import { z } from "zod";

const checkoutSchema = z.object({
  sessionId: z.string().uuid(),
  productCode: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[A-Z0-9_]+$/i),
  customerEmail: z.string().email().max(320),
  locale: z.enum(["pt", "en", "es", "fr"]).default("en"),
  market: z.enum(["BR", "US", "EU", "GB"]).optional(),
  referralCode: z.string().max(100).optional(),
  sessionToken: z.string().max(500).optional(),
});

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

    const parsed = checkoutSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados de checkout inválidos." }, { status: 400 });
    }
    const { sessionId, productCode, customerEmail, locale, market, referralCode } = parsed.data;

    const cookieStore = await cookies();
    const sessionToken = parsed.data.sessionToken ?? cookieStore.get(anonymousSessionCookie)?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Sessão anônima não autenticada." }, { status: 401 });
    }

    // The service resolves the authoritative market from the persisted session.
    // This value remains only for backwards-compatible input typing.
    const requestedMarket = (market ?? "US") as Market;

    const result = await createOrder({
      sessionId,
      sessionToken,
      productCode,
      customerEmail,
      market: requestedMarket,
      locale,
      referralCode: typeof referralCode === "string" ? referralCode : undefined,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao iniciar checkout.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
