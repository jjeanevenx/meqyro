import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { anonymousSessionCookie } from "@/lib/security/anonymous-session";
import { getCoupleComparison } from "@/features/couple/couple-service";

type RouteProps = {
  params: Promise<{ code: string }>;
};

export async function GET(request: Request, { params }: RouteProps) {
  try {
    const { code } = await params;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    const cookieStore = await cookies();
    const sessionToken = searchParams.get("token") ?? cookieStore.get(anonymousSessionCookie)?.value;

    if (!sessionId || !sessionToken || !code) {
      return NextResponse.json(
        { error: "Parâmetros insuficientes para consultar comparação." },
        { status: 400 },
      );
    }

    const comparison = await getCoupleComparison(code, sessionId, sessionToken);
    if (!comparison) {
      return NextResponse.json(
        { error: "Convite não encontrado ou acesso não autorizado." },
        { status: 404 },
      );
    }

    return NextResponse.json(comparison);
  } catch {
    return NextResponse.json(
      { error: "Erro ao obter status da comparação bilateral." },
      { status: 500 },
    );
  }
}
