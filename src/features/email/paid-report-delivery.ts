import "server-only";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { buildPaidSessionReport } from "@/features/results/paid-session-report";
import { findPaidEntitlement } from "@/features/commerce/entitlement-service";
import { reportHtml, reportText } from "@/features/results/report-document";

export async function deliverPaidReport(
  orderId: string,
  locale: string,
  accessUrl: string,
  targetSessionId?: string,
): Promise<{ messageId?: string }> {
  const db = createSupabaseSecretClient();
  const { data: order, error } = await db
    .from("orders")
    .select("status,session_id,confirmation_email_sent_at")
    .eq("id", orderId)
    .single();
  if (error || order?.status !== "FULFILLED")
    throw new Error("Confirmed payment required for report delivery");
  const sessionId = targetSessionId ?? order.session_id;
  const { data: delivery } = await db
    .from("report_deliveries")
    .select("sent_at")
    .eq("order_id", orderId)
    .eq("session_id", sessionId)
    .maybeSingle();
  if (delivery?.sent_at) return {};
  const { error: attemptError } = await db
    .from("orders")
    .update({ report_delivery_last_attempt_at: new Date().toISOString() })
    .eq("id", orderId);
  if (attemptError) throw new Error("Unable to record report delivery attempt");
  const { error: ledgerError } = await db
    .from("report_deliveries")
    .upsert(
      { order_id: orderId, session_id: sessionId, last_attempt_at: new Date().toISOString() },
      { onConflict: "order_id,session_id" },
    );
  if (ledgerError) throw ledgerError;
  const ready = await buildPaidSessionReport(sessionId, locale);
  if (!ready) return {};
  const { slug, report } = ready;
  const productCode = slug.toUpperCase().replace(/-/g, "_");
  const entitlement = await findPaidEntitlement(sessionId, productCode);
  if (!entitlement || entitlement.orderId !== orderId)
    throw new Error("Paid access required for target report");
  const secret = process.env.REPORT_DELIVERY_SECRET;
  if (!secret || secret.length < 32)
    throw new Error("REPORT_DELIVERY_SECRET must contain at least 32 characters");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Supabase URL not configured");
  const response = await fetch(`${url}/functions/v1/deliver-report`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-report-delivery-secret": secret },
    body: JSON.stringify({
      orderId,
      sessionId,
      productCode,
      locale,
      accessUrl,
      filename: `meqyro-${slug}-resultado.html`,
      html: reportHtml(report, slug, locale),
      text: reportText(report),
    }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Report function failed (${response.status})`);
  return response.json();
}
