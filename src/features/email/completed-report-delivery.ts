import "server-only";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { sendPurchaseConfirmationForOrder } from "@/features/commerce/webhook-handler";
import { logEvent } from "@/lib/observability/logger";

/** Durable bounded queue includes package quizzes completed after purchase. */
export async function deliverCompletedReports(
  limit = 5,
  completedSessionId?: string,
): Promise<void> {
  const db = createSupabaseSecretClient();
  const { data, error } = await db.rpc("pending_report_deliveries", {
    p_limit: limit,
    p_session_id: completedSessionId ?? null,
  });
  if (error) throw error;
  for (const row of (data ?? []) as { session_id: string; order_id: string }[]) {
    await sendPurchaseConfirmationForOrder(row.order_id, row.session_id).catch((error: unknown) => {
      logEvent("warn", "completed_report_retry_failed", {
        orderId: row.order_id,
        sessionId: row.session_id,
        error: error instanceof Error ? error.message : "Unknown",
      });
    });
  }
}
