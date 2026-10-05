import { createClient } from "npm:@supabase/supabase-js@2.117.1";

// Server-to-server only. Authenticate before parsing; payment and recipient come from DB.
async function secureEqual(left: string, right: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([left, right].map((value) => crypto.subtle.digest("SHA-256", encoder.encode(value))));
  const first = new Uint8Array(a); const second = new Uint8Array(b);
  let difference = 0;
  for (let i = 0; i < first.length; i++) difference |= first[i] ^ second[i];
  return difference === 0;
}

Deno.serve(async (request: Request) => {
  if (request.method !== "POST") return new Response(null, { status: 405 });
  const secret = Deno.env.get("REPORT_DELIVERY_SECRET");
  if (!secret || secret.length < 32 || !await secureEqual(request.headers.get("x-report-delivery-secret") ?? "", secret)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (typeof body.orderId !== "string" || typeof body.html !== "string" || body.html.length > 200_000 || typeof body.text !== "string" || body.text.length > 100_000 || !/^meqyro-[a-z-]+-resultado\.html$/.test(body.filename)) return Response.json({ error: "Invalid report" }, { status: 400 });
    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { db: { schema: "meqyro" } });
    const { data: order, error } = await db.from("orders").select("status,customer_email,session_id,order_number,confirmation_email_sent_at,confirmation_email_message_id").eq("id", body.orderId).single();
    if (error || !order || order.status !== "FULFILLED" || !order.customer_email) return Response.json({ error: "Confirmed purchase required" }, { status: 403 });
    const sessionId = body.sessionId ?? order.session_id;
    if (typeof sessionId !== "string" || typeof body.productCode !== "string") return Response.json({ error: "Invalid target" }, { status: 400 });
    const { data: target } = await db.from("quiz_sessions").select("buyer_id,status,quiz_versions!inner(quizzes!inner(product_code))").eq("id", sessionId).single();
    const { data: source } = await db.from("quiz_sessions").select("buyer_id").eq("id", order.session_id).single();
    if (!target || !source || target.status !== "COMPLETED" || target.quiz_versions.quizzes.product_code !== body.productCode) return Response.json({ error: "Invalid result" }, { status: 403 });
    if (target.buyer_id !== source.buyer_id) return Response.json({ error: "Buyer mismatch" }, { status: 403 });
    const { data: previous } = await db.from("report_deliveries").select("sent_at,message_id").eq("order_id", body.orderId).eq("session_id", sessionId).maybeSingle();
    if (previous?.sent_at) return Response.json({ messageId: previous.message_id, duplicate: true });
    const cutoff = new Date(); cutoff.setUTCMonth(cutoff.getUTCMonth() - 24);
    const { data: grant } = await db.from("result_access_grants").select("id").eq("order_id", body.orderId).eq("product_code", body.productCode).gt("created_at", cutoff.toISOString()).limit(1);
    if (!grant?.length) return Response.json({ error: "Access not granted" }, { status: 403 });
    if (body.productCode === "COUPLEDNA") {
      const { data: pair } = await db.from("couple_invites").select("id,initiator_session_id,partner_session_id,status")
        .or(`initiator_session_id.eq.${sessionId},partner_session_id.eq.${sessionId}`).neq("status", "EXPIRED").order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (!pair?.partner_session_id) return Response.json({ error: "Partner required" }, { status: 403 });
      const { data: consents } = await db.from("couple_consents").select("session_id").eq("invite_id", pair.id).eq("can_share_comparison", true);
      if (![pair.initiator_session_id, pair.partner_session_id].every((id: string) => consents?.some((row: { session_id: string }) => row.session_id === id))) return Response.json({ error: "Consent required" }, { status: 403 });
      const { data: completed } = await db.from("quiz_sessions").select("id").in("id", [pair.initiator_session_id, pair.partner_session_id]).eq("status", "COMPLETED");
      if (completed?.length !== 2) return Response.json({ error: "Both results required" }, { status: 403 });
    }
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) return Response.json({ error: "Email not configured" }, { status: 503 });
    const subject = ({ pt: "Seu resultado Meqyro está pronto", en: "Your Meqyro result is ready", es: "Tu resultado Meqyro está listo", fr: "Votre résultat Meqyro est prêt" } as Record<string, string>)[body.locale] ?? "Seu resultado Meqyro está pronto";
    const bytes = new TextEncoder().encode(body.html);
    const attachment = btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""));
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `paid-report-${body.orderId}-${sessionId}` },
      body: JSON.stringify({ from: Deno.env.get("EMAIL_FROM") ?? "Meqyro <noreply@meqyro.com>", to: order.customer_email, subject,
        text: `${subject}\n\n#${order.order_number}\n\n${body.text}\n\n${body.accessUrl ?? ""}`,
        attachments: [{ filename: body.filename, content: attachment }],
      }), signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) return Response.json({ error: "Email provider failed" }, { status: 502 });
    const sent = await response.json();
    const sentAt = new Date().toISOString();
    const { error: saveError } = await db.from("report_deliveries").upsert({ order_id: body.orderId, session_id: sessionId, sent_at: sentAt, message_id: sent.id }, { onConflict: "order_id,session_id" });
    if (saveError) return Response.json({ error: "Unable to record delivery" }, { status: 500 });
    if (sessionId === order.session_id) await db.from("orders").update({ confirmation_email_sent_at: sentAt, confirmation_email_message_id: sent.id }).eq("id", body.orderId).is("confirmation_email_sent_at", null);
    return Response.json({ messageId: sent.id });
  } catch { return Response.json({ error: "Report delivery failed" }, { status: 500 }); }
});
