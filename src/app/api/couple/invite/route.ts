import { NextResponse } from "next/server";
import { createCoupleInvite } from "@/features/couple/couple-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, sessionToken, locale } = body ?? {};

    if (!sessionId || !sessionToken) {
      return NextResponse.json(
        { error: "Sessão e token de autenticação são obrigatórios." },
        { status: 400 },
      );
    }

    const invite = await createCoupleInvite(sessionId, sessionToken, locale ?? "pt");
    if (!invite) {
      return NextResponse.json(
        { error: "Falha ao gerar convite ou sessão inválida." },
        { status: 401 },
      );
    }

    return NextResponse.json(invite);
  } catch {
    return NextResponse.json(
      { error: "Erro ao processar solicitação de convite." },
      { status: 500 },
    );
  }
}
