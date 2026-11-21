import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { listHostInviteSlotsWithState } from "@/features/couple/couple-invite-service";
import { calculateInvitePrice, MAX_COUPLEDNA_INVITES } from "@/features/couple/invite-pricing";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/market/prices";
import { isMarket } from "@/lib/market/market-context";
import { createRequestId } from "@/lib/observability/request-id";
import { logEvent } from "@/lib/observability/logger";

export async function GET(request: Request) {
  const requestId = createRequestId();
  const headers = { "x-request-id": requestId, "Cache-Control": "private, no-store" };

  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const locale = searchParams.get("locale") ?? "pt";

    const cookieStore = await cookies();
    const sessionToken =
      request.headers.get("x-session-token") ?? cookieStore.get(anonymousSessionCookie)?.value;

    if (!z.uuid().safeParse(sessionId).success || !sessionToken) {
      return NextResponse.json(
        { error: "Sessão e token de autenticação são obrigatórios." },
        { status: 401, headers },
      );
    }

    const slots = await listHostInviteSlotsWithState({
      hostSessionId: sessionId!,
      hostToken: sessionToken,
      locale,
    });

    const db = createSupabaseSecretClient();
    const { data: sessionRecord } = await db
      .from("quiz_sessions")
      .select("market")
      .eq("id", sessionId!)
      .single();
    const market = isMarket(sessionRecord?.market) ? sessionRecord.market : "BR";

    let nextPrice: {
      amount: number;
      currency: string;
      formattedPrice: string;
      slotNumber: number;
      isDiscounted: boolean;
      limitReached: boolean;
      maxInvites: number;
    };

    try {
      const price = await calculateInvitePrice(sessionId!, market);
      nextPrice = {
        ...price,
        formattedPrice: formatMoney(price.amount, price.currency, locale),
        limitReached: false,
        maxInvites: MAX_COUPLEDNA_INVITES,
      };
    } catch (priceErr: unknown) {
      if (priceErr instanceof Error && priceErr.message === "INVITE_LIMIT_REACHED") {
        nextPrice = {
          amount: 0,
          currency:
            market === "BR" ? "BRL" : market === "EU" ? "EUR" : market === "GB" ? "GBP" : "USD",
          formattedPrice: "—",
          slotNumber: MAX_COUPLEDNA_INVITES,
          isDiscounted: true,
          limitReached: true,
          maxInvites: MAX_COUPLEDNA_INVITES,
        };
      } else {
        throw priceErr;
      }
    }

    return NextResponse.json({ slots, nextPrice }, { headers });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown";
    logEvent("error", "couple_invites_list_failed", { requestId, error: message });

    if (
      message.includes("Invalid host session token") ||
      message.includes("Host session not found") ||
      message.includes("not for the CoupleDNA quiz")
    ) {
      return NextResponse.json(
        { error: "Não autorizado a consultar convites desta sessão." },
        { status: 403, headers },
      );
    }

    return NextResponse.json({ error: "Erro ao listar convites." }, { status: 500, headers });
  }
}
