import { NextRequest, NextResponse } from "next/server";
import { getOrderById, getPaymentProvider } from "@/features/commerce/order-service";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { fulfillOrder } from "@/features/commerce/fulfillment-service";
import { sendPurchaseConfirmationForOrder } from "@/features/commerce/webhook-handler";

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
    const message = err instanceof Error ? err.message : "Erro ao buscar pedido.";
    return NextResponse.json({ error: message }, { status: 400 });
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
        await supabase
          .from("orders")
          .update({ status: "CANCELLED", updated_at: new Date().toISOString() })
          .eq("id", id)
          .in("status", ["CREATED", "PROCESSING", "PENDING"]);
      }
      return NextResponse.json({ order: await getOrderById(id, authOptions) });
    }

    if (order.status === "FULFILLED") {
      return NextResponse.json({ order });
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
    });

    if (providerStatus.status === "CONFIRMED") {
      await fulfillOrder(order.id, "status_reconciliation", providerStatus.transactionId);
      await sendPurchaseConfirmationForOrder(order.id).catch(() => {});
    } else if (providerStatus.status === "EXPIRED") {
      await supabase
        .from("orders")
        .update({ status: "EXPIRED", updated_at: new Date().toISOString() })
        .eq("id", id)
        .in("status", ["CREATED", "PROCESSING", "PENDING"]);
    }

    return NextResponse.json({
      order: await getOrderById(id, authOptions),
      paymentStatus: providerStatus.status,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao reconciliar pedido.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
