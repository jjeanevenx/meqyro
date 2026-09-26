import { NextRequest, NextResponse } from "next/server";
import { handleWebhook } from "@/features/commerce/webhook-handler";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature") ?? undefined;

    const headers: Record<string, string> = {};
    req.headers.forEach((val, key) => {
      headers[key] = val;
    });

    const result = await handleWebhook("stripe", {
      payload: rawBody,
      headers,
      signature,
    });

    return NextResponse.json({ received: true, ...result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook error";
    const isAuthFailure =
      message.includes("signature") ||
      message.includes("STRIPE_WEBHOOK_SECRET") ||
      message.includes("tolerance");

    return NextResponse.json({ error: message }, { status: isAuthFailure ? 401 : 400 });
  }
}
