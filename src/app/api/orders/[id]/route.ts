import { NextRequest, NextResponse } from "next/server";
import { getOrderById, getPaymentProvider } from "@/features/commerce/order-service";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { fulfillOrder } from "@/features/commerce/fulfillment-service";
import { sendPurchaseConfirmationForOrder } from "@/features/commerce/webhook-handler";
import { assertTransition, orderTransitions, type OrderState } from "@/lib/domain/states";
import { logEvent } from "@/lib/observability/logger";
import { cancelInviteSlot } from "@/features/couple/couple-invite-service";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;
    const lookupToken = req.nextUrl.searchParams.get("token") ?? undefined;
    const sessionCookie = req.cookies.get(anonymousSessionCookie)?.value;

    const order = await getOrderById(id, {
      lookupToken,
      sessionToken: sessionCookie,
    });

    if (!order) {
      return NextResponse.json(
        { error: "Pedido não encontrado ou acesso não autorizado." },
        { status: 404 },
      );
    }

    return NextResponse.json({ order });
  } catch (err: unknown) {
    logEvent("error", "order_lookup_failed", {
      error: err instanceof Error ? err.message : "Unknown",
    });
    return NextResponse.json({ error: "Erro ao buscar pedido." }, { status: 400 });
  }
}

export async function POST(req: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;
    const body = (await req.json().catch(() => ({}))) as {
      action?: string;
      transactionNsu?: string;
    };
    const lookupToken = req.nextUrl.searchParams.get("token") ?? undefined;
    const sessionCookie = req.cookies.get(anonymousSessionCookie)?.value;
    const authOptions = { lookupToken, sessionToken: sessionCookie };
    const order = await getOrderById(id, authOptions);

    if (!order) {
      return NextResponse.json(
        { error: "Pedido não encontrado ou acesso não autorizado." },
        { status: 404 },
      );
    }

    const supabase = createSupabaseSecretClient();

    if (body.action === "cancel") {
      if (["CREATED", "PROCESSING", "PENDING"].includes(order.status)) {
        assertTransition("order", order.status as OrderState, "CANCELLED", orderTransitions);
        const { data: cancelledOrder } = await supabase
          .from("orders")
          .update({ status: "CANCELLED", updated_at: new Date().toISOString() })
          .eq("id", id)
          .in("status", ["CREATED", "PROCESSING", "PENDING"])
          .select("couple_invite_slot_id")
          .maybeSingle();
        if (cancelledOrder?.couple_invite_slot_id) {
          await cancelInviteSlot(cancelledOrder.couple_invite_slot_id as string);
        }
      }
      return NextResponse.json({ order: await getOrderById(id, authOptions) });
    }

    if (order.status === "FULFILLED") {
      await fulfillOrder(order.id, "fulfilled_status_recovery");
      await sendPurchaseConfirmationForOrder(order.id).catch(() => {});
      return NextResponse.json({ order: await getOrderById(id, authOptions) });
    }

    if (order.paymentProvider !== "stripe") {
      return NextResponse.json(
        { error: "Este pedido usa um provedor de pagamento descontinuado." },
        { status: 410 },
      );
    }

    const { data: attempt } = await supabase
      .from("payment_attempts")
      .select("provider_attempt_id")
      .eq("order_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!attempt?.provider_attempt_id) {
      return NextResponse.json({ order, paymentStatus: "PENDING" });
    }

    const provider = getPaymentProvider("stripe");
    const transactionNsu =
      typeof body.transactionNsu === "string" && body.transactionNsu.length <= 200
        ? body.transactionNsu
        : undefined;
    const providerStatus = await provider.getPaymentStatus({
      orderId: order.id,
      orderNumber: order.orderNumber,
      providerAttemptId: attempt.provider_attempt_id,
      providerPaymentId: transactionNsu,
      expectedAmount: order.amount,
      expectedCurrency: order.currency,
      expectedProductCode: order.productCode,
    });

    if (providerStatus.status === "CONFIRMED") {
      await fulfillOrder(order.id, "status_reconciliation", providerStatus.transactionId);
      await sendPurchaseConfirmationForOrder(order.id).catch(() => {});
    } else if (providerStatus.status === "EXPIRED") {
      if (["CREATED", "PROCESSING", "PENDING"].includes(order.status)) {
        assertTransition("order", order.status as OrderState, "EXPIRED", orderTransitions);
        const { data: expiredOrder } = await supabase
          .from("orders")
          .update({ status: "EXPIRED", updated_at: new Date().toISOString() })
          .eq("id", id)
          .in("status", ["CREATED", "PROCESSING", "PENDING"])
          .select("couple_invite_slot_id")
          .maybeSingle();
        if (expiredOrder?.couple_invite_slot_id) {
          await cancelInviteSlot(expiredOrder.couple_invite_slot_id as string);
        }
      }
    }

    return NextResponse.json({
      order: await getOrderById(id, authOptions),
      paymentStatus: providerStatus.status,
    });
  } catch (err: unknown) {
    logEvent("error", "order_reconciliation_failed", {
      error: err instanceof Error ? err.message : "Unknown",
    });
    return NextResponse.json({ error: "Erro ao reconciliar pedido." }, { status: 400 });
  }
}
