import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { createInviteSlot } from "@/features/couple/couple-invite-service";
import { createOrder } from "@/features/commerce/order-service";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { isMarket, resolveMarketContext } from "@/lib/market/market-context";
import { getClientIp } from "@/lib/security/rate-limit";
import { checkServerRateLimit } from "@/lib/security/server-rate-limit";
import { createRequestId } from "@/lib/observability/request-id";
import { logEvent } from "@/lib/observability/logger";

const purchaseInviteSchema = z.object({
  sessionId: z.uuid(),
  customerEmail: z.email(),
  hostNameForGuest: z.string().trim().max(80).optional(),
  locale: z.enum(["pt", "en", "es", "fr"]).default("pt"),
  market: z.enum(["BR", "US", "EU", "GB"]).optional(),
});

export async function POST(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? createRequestId();
  const headers = { "x-request-id": requestId, "Cache-Control": "private, no-store" };

  try {
    const limit = await checkServerRateLimit(getClientIp(request), "checkout");
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Muitas tentativas de compra. Tente novamente em instantes." },
        { status: 429, headers: { ...headers, ...limit.headers } },
      );
    }

    const parsed = purchaseInviteSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados de compra do convite inválidos." },
        { status: 400, headers },
      );
    }

    const sessionToken =
      request.headers.get("x-session-token") ?? request.cookies.get(anonymousSessionCookie)?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Autenticação da sessão é obrigatória." },
        { status: 401, headers },
      );
    }

    const db = createSupabaseSecretClient();
    const { data: sessionRecord } = await db
      .from("quiz_sessions")
      .select("market, locale")
      .eq("id", parsed.data.sessionId)
      .single();

    const resolvedMarket = resolveMarketContext({
      locale: parsed.data.locale,
      market: isMarket(sessionRecord?.market) ? sessionRecord.market : parsed.data.market,
    }).market;

    const slot = await createInviteSlot({
      hostSessionId: parsed.data.sessionId,
      hostToken: sessionToken,
      market: resolvedMarket,
      hostNameForGuest: parsed.data.hostNameForGuest || undefined,
    });

    const checkout = await createOrder({
      sessionId: parsed.data.sessionId,
      sessionToken,
      productCode: "COUPLEDNA_INVITE",
      customerEmail: parsed.data.customerEmail,
      market: resolvedMarket,
      locale: parsed.data.locale,
      coupleInviteSlotId: slot.id,
    });

    return NextResponse.json(
      {
        slot: {
          ...slot,
          // Never expose an invite code before payment is confirmed
          inviteCode: null,
        },
        order: checkout.order,
        checkoutUrl: checkout.checkoutUrl,
        lookupToken: checkout.lookupToken,
        alreadyPaid: checkout.alreadyPaid,
      },
      { status: 201, headers },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown";
    logEvent("error", "couple_invite_purchase_failed", {
      requestId,
      error: message,
    });

    if (message === "INVITE_LIMIT_REACHED") {
      return NextResponse.json(
        { error: "Limite máximo de convites atingido para esta avaliação." },
        { status: 409, headers },
      );
    }

    if (
      message.includes("Invalid host session token") ||
      message.includes("Token de sessão inválido") ||
      message.includes("Host session not found")
    ) {
      return NextResponse.json(
        { error: "Sessão não autorizada para compra de convite." },
        { status: 403, headers },
      );
    }

    return NextResponse.json(
      { error: "Não foi possível iniciar a compra do convite." },
      { status: 400, headers },
    );
  }
}
