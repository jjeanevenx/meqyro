import { NextRequest, NextResponse } from "next/server";
import { unsubscribeByToken } from "@/features/privacy/consent-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token de cancelamento inválido." }, { status: 400 });
    }

    const result = await unsubscribeByToken(token);

    if (!result.success) {
      return NextResponse.json(
        { error: "Token de cancelamento inválido ou expirado." },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Inscrição promocional cancelada com sucesso.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro ao processar descadastramento.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
