import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/features/commerce/order-service";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao buscar pedido";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
