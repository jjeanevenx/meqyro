import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import {
  anonymousSessionCookie,
  matchesAnonymousSessionToken,
} from "@/lib/security/anonymous-session";
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

    const db = createSupabaseSecretClient();
    const { data: session, error: sessionError } = await db
      .from("quiz_sessions")
      .select("id, market, access_token_hash, quiz_versions!inner(quizzes!inner(slug))")
      .eq("id", sessionId!)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Sessão não encontrada." }, { status: 404, headers });
    }

    const record = session as unknown as {
      market?: string;
      access_token_hash: string;
      quiz_versions: { quizzes: { slug: string } };
    };

    if (
      record.quiz_versions.quizzes.slug !== "coupledna" ||
      !matchesAnonymousSessionToken(sessionToken, record.access_token_hash)
    ) {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403, headers });
    }

    const market = isMarket(record.market) ? record.market : "BR";

    try {
      const price = await calculateInvitePrice(sessionId!, market);
      return NextResponse.json(
        {
          ...price,
          formattedPrice: formatMoney(price.amount, price.currency, locale),
          limitReached: false,
          maxInvites: MAX_COUPLEDNA_INVITES,
        },
        { headers },
      );
    } catch (priceErr: unknown) {
      if (priceErr instanceof Error && priceErr.message === "INVITE_LIMIT_REACHED") {
        return NextResponse.json(
          {
            amount: 0,
            currency:
              market === "BR" ? "BRL" : market === "EU" ? "EUR" : market === "GB" ? "GBP" : "USD",
            formattedPrice: "—",
            slotNumber: MAX_COUPLEDNA_INVITES,
            isDiscounted: true,
            limitReached: true,
            maxInvites: MAX_COUPLEDNA_INVITES,
          },
          { headers },
        );
      }
      throw priceErr;
    }
  } catch (error: unknown) {
    logEvent("error", "couple_invite_price_failed", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown",
    });
    return NextResponse.json(
      { error: "Erro ao calcular preço do convite." },
      { status: 500, headers },
    );
  }
}
