import { NextRequest, NextResponse } from "next/server";
import { handleWebhook } from "@/features/commerce/webhook-handler";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature =
      req.headers.get("x-infinitepay-signature") ??
      req.headers.get("x-signature") ??
      undefined;

    const headers: Record<string, string> = {};
    req.headers.forEach((val, key) => {
      headers[key] = val;
    });

    const result = await handleWebhook("infinitepay", {
      payload: rawBody,
      headers,
      signature,
    });

    return NextResponse.json({ received: true, ...result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
