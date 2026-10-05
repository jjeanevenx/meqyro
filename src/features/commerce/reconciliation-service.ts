import "server-only";
import { deliverCompletedReports } from "@/features/email/completed-report-delivery";

import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { getPaymentProvider } from "./order-service";
import { fulfillOrder } from "./fulfillment-service";
import { logEvent } from "@/lib/observability/logger";
import { sendPurchaseConfirmationForOrder } from "./webhook-handler";

export interface ReconciliationReport {
  success: boolean;
  repairedPaidCount: number;
  checkedPendingCount: number;
  confirmedCount: number;
  expiredOrdersCount: number;
  expiredSessionsCount: number;
  cleanedTokensCount: number;
  durationMs: number;
  locked?: boolean;
  error?: string;
}

/**
 * Attempts to acquire a distributed operational lock in Postgres.
 * Fails if already locked within the timeout window (10 minutes).
 */
export async function acquireOperationalLock(
  jobName: string,
  lockedBy: string,
  timeoutMinutes = 10,
): Promise<boolean> {
  const supabase = createSupabaseSecretClient();
  const now = new Date();
  const cutoff = new Date(now.getTime() - timeoutMinutes * 60 * 1000).toISOString();

  // Clean stale locks
  await supabase.from("operational_locks").delete().eq("job_name", jobName).lt("locked_at", cutoff);

  // Attempt insert
  const { error } = await supabase.from("operational_locks").insert({
    job_name: jobName,
    locked_at: now.toISOString(),
    locked_by: lockedBy,
  });

  return !error;
}

export async function releaseOperationalLock(jobName: string): Promise<void> {
  const supabase = createSupabaseSecretClient();
  await supabase.from("operational_locks").delete().eq("job_name", jobName);
}

/**
 * Auto-repairs orders in PAID status that have not yet finalized fulfillment.
 */
export async function reconcileUnfulfilledPaidOrders(): Promise<{ repairedCount: number }> {
  const supabase = createSupabaseSecretClient();

  const { data: paidOrders, error } = await supabase
    .from("orders")
    .select("id, status, order_number")
    .eq("status", "PAID")
    .limit(50);

  if (error || !paidOrders || paidOrders.length === 0) {
    return { repairedCount: 0 };
  }

  let repairedCount = 0;
  for (const order of paidOrders) {
    try {
      await fulfillOrder(order.id, "reconciliation_repair");
      repairedCount += 1;
      logEvent("info", "order_reconciliation_repaired", {
        orderId: order.id,
        orderNumber: order.order_number,
      });
    } catch (err: unknown) {
      logEvent("error", "order_reconciliation_failed", {
        orderId: order.id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return { repairedCount };
}

/**
 * Checks pending orders against gateway endpoints.
 */
export async function reconcilePendingOrders(): Promise<{
  checkedCount: number;
  confirmedCount: number;
  expiredCount: number;
}> {
  const supabase = createSupabaseSecretClient();
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

  const { data: pendingOrders } = await supabase
    .from("orders")
    .select(
      "id, order_number, payment_provider, provider_payment_id, created_at, payment_attempts(id, provider_attempt_id, status, created_at)",
    )
    .eq("status", "PENDING")
    .eq("payment_provider", "stripe")
    .lt("created_at", fifteenMinutesAgo)
    .limit(20);

  if (!pendingOrders || pendingOrders.length === 0) {
    return { checkedCount: 0, confirmedCount: 0, expiredCount: 0 };
  }

  let confirmedCount = 0;
  let expiredCount = 0;

  for (const order of pendingOrders) {
    const attempts = order.payment_attempts as Array<{
      provider_attempt_id?: string;
      status: string;
    }>;
    const latestAttempt = attempts?.[attempts.length - 1];

    if (!latestAttempt?.provider_attempt_id || !order.payment_provider) continue;

    const provider = getPaymentProvider("stripe");

    try {
      const statusCheck = await provider.getPaymentStatus({
        orderId: order.id,
        providerAttemptId: latestAttempt.provider_attempt_id,
        orderNumber: order.order_number,
        providerPaymentId: order.provider_payment_id ?? undefined,
      });

      if (statusCheck.status === "CONFIRMED") {
        await fulfillOrder(order.id, "reconciliation_poll", statusCheck.transactionId);
        confirmedCount += 1;
      } else if (statusCheck.status === "EXPIRED") {
        await supabase
          .from("orders")
          .update({ status: "EXPIRED", updated_at: new Date().toISOString() })
          .eq("id", order.id);
        expiredCount += 1;
      }
    } catch (err: unknown) {
      logEvent("warn", "reconciliation_check_error", {
        orderId: order.id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return { checkedCount: pendingOrders.length, confirmedCount, expiredCount };
}

/**
 * Transitions abandoned sessions past expires_at to EXPIRED.
 */
export async function expireStaleSessions(): Promise<{ expiredCount: number }> {
  const supabase = createSupabaseSecretClient();
  const now = new Date().toISOString();

  const { data: expiredSessions, error } = await supabase
    .from("quiz_sessions")
    .update({ status: "EXPIRED", updated_at: now })
    .in("status", ["CREATED", "IN_PROGRESS"])
    .lt("expires_at", now)
    .select("id");

  if (error || !expiredSessions) {
    return { expiredCount: 0 };
  }

  return { expiredCount: expiredSessions.length };
}

/**
 * Cleans expired recovery and data request tokens.
 */
export async function cleanupExpiredTokens(): Promise<{ cleanedCount: number }> {
  const supabase = createSupabaseSecretClient();
  const now = new Date().toISOString();

  // Reject expired pending data requests
  const { data: expiredRequests } = await supabase
    .from("data_requests")
    .update({ status: "REJECTED" })
    .eq("status", "PENDING")
    .lt("expires_at", now)
    .select("id");

  // Revoke expired recovery tokens
  const { data: expiredTokens } = await supabase
    .from("recovery_tokens")
    .update({ revoked_at: now })
    .is("revoked_at", null)
    .lt("expires_at", now)
    .select("id");

  const cleanedCount = (expiredRequests?.length ?? 0) + (expiredTokens?.length ?? 0);
  return { cleanedCount };
}

/**
 * Full master reconciliation workflow with concurrency locking.
 */
export async function runFullReconciliationSuite(
  lockedBy = "cron_scheduler",
): Promise<ReconciliationReport> {
  const startTime = Date.now();
  const lockAcquired = await acquireOperationalLock("master_reconciliation", lockedBy);

  if (!lockAcquired) {
    logEvent("warn", "reconciliation_lock_busy", { lockedBy });
    return {
      success: false,
      locked: true,
      repairedPaidCount: 0,
      checkedPendingCount: 0,
      confirmedCount: 0,
      expiredOrdersCount: 0,
      expiredSessionsCount: 0,
      cleanedTokensCount: 0,
      durationMs: Date.now() - startTime,
      error: "Another reconciliation job is currently running.",
    };
  }

  try {
    const unfulfilled = await reconcileUnfulfilledPaidOrders();
    const pending = await reconcilePendingOrders();
    const sessions = await expireStaleSessions();
    const tokens = await cleanupExpiredTokens();
    const db = createSupabaseSecretClient();
    const { data: undelivered, error: deliveryQueryError } = await db
      .from("orders")
      .select("id")
      .eq("status", "FULFILLED")
      .is("confirmation_email_sent_at", null)
      .or(
        `report_delivery_last_attempt_at.is.null,report_delivery_last_attempt_at.lt.${new Date(Date.now() - 5 * 60_000).toISOString()}`,
      )
      .order("report_delivery_last_attempt_at", { ascending: true, nullsFirst: true })
      .limit(5);
    if (deliveryQueryError) throw deliveryQueryError;
    for (const order of undelivered ?? []) {
      await sendPurchaseConfirmationForOrder(order.id).catch((error: unknown) => {
        logEvent("error", "paid_report_retry_failed", {
          orderId: order.id,
          error: error instanceof Error ? error.message : "Unknown",
        });
      });
    }
    await deliverCompletedReports();

    const durationMs = Date.now() - startTime;

    logEvent("info", "reconciliation_suite_completed", {
      repairedPaidCount: unfulfilled.repairedCount,
      checkedPendingCount: pending.checkedCount,
      confirmedCount: pending.confirmedCount,
      expiredOrdersCount: pending.expiredCount,
      expiredSessionsCount: sessions.expiredCount,
      cleanedTokensCount: tokens.cleanedCount,
      durationMs,
    });

    return {
      success: true,
      repairedPaidCount: unfulfilled.repairedCount,
      checkedPendingCount: pending.checkedCount,
      confirmedCount: pending.confirmedCount,
      expiredOrdersCount: pending.expiredCount,
      expiredSessionsCount: sessions.expiredCount,
      cleanedTokensCount: tokens.cleanedCount,
      durationMs,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logEvent("error", "reconciliation_suite_error", { error: errorMsg });

    return {
      success: false,
      repairedPaidCount: 0,
      checkedPendingCount: 0,
      confirmedCount: 0,
      expiredOrdersCount: 0,
      expiredSessionsCount: 0,
      cleanedTokensCount: 0,
      durationMs: Date.now() - startTime,
      error: errorMsg,
    };
  } finally {
    await releaseOperationalLock("master_reconciliation");
  }
}
