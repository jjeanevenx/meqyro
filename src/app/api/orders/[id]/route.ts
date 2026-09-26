import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/features/commerce/order-service";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";

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
