import "server-only";
import { randomUUID } from "node:crypto";
import { deliverCompletedReports } from "@/features/email/completed-report-delivery";

import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { getPaymentProvider } from "./order-service";
import { fulfillOrder } from "./fulfillment-service";
import { logEvent } from "@/lib/observability/logger";
import { sendPurchaseConfirmationForOrder } from "./webhook-handler";
import { assertTransition, orderTransitions } from "@/lib/domain/states";
import { activateInviteSlot } from "@/features/couple/couple-invite-service";

export interface ReconciliationReport {
  success: boolean;
  repairedPaidCount: number;
  repairedInviteCount: number;
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
  const { error: cleanupError } = await supabase
    .from("operational_locks")
    .delete()
    .eq("job_name", jobName)
    .lt("locked_at", cutoff);
  if (cleanupError) throw new Error("Unable to remove stale operational locks.");

  // Attempt insert
  const { error } = await supabase.from("operational_locks").insert({
    job_name: jobName,
    locked_at: now.toISOString(),
    locked_by: lockedBy,
  });

  if (error && error.code !== "23505") throw new Error("Unable to acquire operational lock.");
  return !error;
}

export async function renewOperationalLock(
  jobName: string,
  lockedBy: string,
  timeoutMinutes = 10,
): Promise<boolean> {
  const now = new Date();
  const cutoff = new Date(now.getTime() - timeoutMinutes * 60_000).toISOString();
  const { data, error } = await createSupabaseSecretClient()
    .from("operational_locks")
    .update({ locked_at: now.toISOString() })
    .eq("job_name", jobName)
    .eq("locked_by", lockedBy)
    .gte("locked_at", cutoff)
    .select("job_name");
  if (error) throw new Error("Unable to renew operational lock.");
  return (data?.length ?? 0) === 1;
}

export async function releaseOperationalLock(jobName: string, lockedBy: string): Promise<void> {
  const supabase = createSupabaseSecretClient();
  const { error } = await supabase
    .from("operational_locks")
    .delete()
    .eq("job_name", jobName)
    .eq("locked_by", lockedBy);
  if (error) throw new Error("Unable to release operational lock.");
}

/**
 * Auto-repairs orders in PAID status that have not yet finalized fulfillment.
 */
export async function reconcileUnfulfilledPaidOrders(
  assertLease?: () => Promise<void>,
): Promise<{ repairedCount: number }> {
  const supabase = createSupabaseSecretClient();

  const { data: paidOrders, error } = await supabase
    .from("orders")
    .select("id, status, order_number")
    .eq("status", "PAID")
    .limit(50);

  if (error) throw new Error("Unable to load paid orders.");
  if (!paidOrders || paidOrders.length === 0) {
    return { repairedCount: 0 };
  }

  let repairedCount = 0;
  for (const order of paidOrders) {
    await assertLease?.();
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

/** Recover invite dependencies even when the payment transaction already committed. */
export async function reconcileIncompleteInviteActivations(assertLease?: () => Promise<void>): Promise<{
  repairedCount: number;
  failedCount: number;
}> {
  const db = createSupabaseSecretClient();
  const { data: slots, error } = await db
    .from("couple_invite_slots")
    .select("id, order_id, orders!couple_invite_slots_order_id_fkey!inner(status)")
    .eq("orders.status", "FULFILLED")
    .is("activation_completed_at", null)
    .in("status", ["PENDING_PAYMENT", "ACTIVE", "REDEEMED", "QUIZ_STARTED", "COMPLETED"])
    .order("updated_at", { ascending: true })
    .order("id", { ascending: true })
    .limit(50);
  if (error) throw new Error("Unable to load incomplete paid invitations.");

  let repairedCount = 0;
  let failedCount = 0;
  for (const slot of slots ?? []) {
    await assertLease?.();
    if (!slot.order_id) continue;
    try {
      await activateInviteSlot({ slotId: slot.id as string, orderId: slot.order_id as string });
      repairedCount += 1;
    } catch (error) {
      failedCount += 1;
      logEvent("error", "invite_activation_recovery_failed", {
        slotId: slot.id,
        orderId: slot.order_id,
        error: error instanceof Error ? error.message : "Unknown",
      });
      // Move a persistent failure behind other incomplete slots in the next batch.
      const { error: retryError } = await db
        .from("couple_invite_slots")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", slot.id)
        .is("activation_completed_at", null);
      if (retryError) throw new Error("Unable to schedule invite activation recovery.");
    }
  }
  return { repairedCount, failedCount };
}

/**
 * Checks pending orders against gateway endpoints.
 */
export async function reconcilePendingOrders(assertLease?: () => Promise<void>): Promise<{
  checkedCount: number;
  confirmedCount: number;
  expiredCount: number;
}> {
  const supabase = createSupabaseSecretClient();
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

  const { data: pendingOrders, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, amount, currency, product_code, payment_provider, provider_payment_id, created_at, payment_attempts(id, provider_attempt_id, status, created_at)",
    )
    .eq("status", "PENDING")
    .eq("payment_provider", "stripe")
    .lt("created_at", fifteenMinutesAgo)
    .limit(20);

  if (error) throw new Error("Unable to load pending orders.");
  if (!pendingOrders || pendingOrders.length === 0) {
    return { checkedCount: 0, confirmedCount: 0, expiredCount: 0 };
  }

  let confirmedCount = 0;
  let expiredCount = 0;

  for (const order of pendingOrders) {
    await assertLease?.();
    const attempts = order.payment_attempts as Array<{
      provider_attempt_id?: string;
      status: string;
      created_at: string;
      id: string;
    }>;
    const latestAttempt = [...(attempts ?? [])].sort(
      (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at) || b.id.localeCompare(a.id),
    )[0];

    if (!latestAttempt?.provider_attempt_id || !order.payment_provider) continue;

    const provider = getPaymentProvider("stripe");

    try {
      const statusCheck = await provider.getPaymentStatus({
        orderId: order.id,
        providerAttemptId: latestAttempt.provider_attempt_id,
        orderNumber: order.order_number,
        providerPaymentId: order.provider_payment_id ?? undefined,
        expectedAmount: order.amount,
        expectedCurrency: order.currency,
        expectedProductCode: order.product_code,
      });

      if (statusCheck.status === "CONFIRMED") {
        await fulfillOrder(order.id, "reconciliation_poll", statusCheck.transactionId);
        confirmedCount += 1;
      } else if (statusCheck.status === "EXPIRED") {
        assertTransition("order", "PENDING", "EXPIRED", orderTransitions);
        await supabase
          .from("orders")
          .update({ status: "EXPIRED", updated_at: new Date().toISOString() })
          .eq("id", order.id)
          .eq("status", "PENDING");
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

  if (error) throw new Error("Unable to expire stale sessions.");
  if (!expiredSessions) {
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

  const { error: rateCleanupError } = await supabase
    .from("rate_limits")
    .delete()
    .lt("expires_at", now);
  if (rateCleanupError) throw new Error("Unable to clean expired rate limits");

  // Reject expired pending data requests
  const { data: expiredRequests, error: requestError } = await supabase
    .from("data_requests")
    .update({ status: "REJECTED" })
    .eq("status", "PENDING")
    .lt("expires_at", now)
    .select("id");

  if (requestError) throw new Error("Unable to reject expired data requests.");

  // Revoke expired recovery tokens
  const { data: expiredTokens, error: tokenError } = await supabase
    .from("recovery_tokens")
    .update({ revoked_at: now })
    .is("revoked_at", null)
    .lt("expires_at", now)
    .select("id");

  if (tokenError) throw new Error("Unable to revoke expired recovery tokens.");

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
  const lockOwner = `${lockedBy}:${randomUUID()}`;
  const lockAcquired = await acquireOperationalLock("master_reconciliation", lockOwner);

  if (!lockAcquired) {
    logEvent("warn", "reconciliation_lock_busy", { lockedBy });
    return {
      success: false,
      locked: true,
      repairedPaidCount: 0,
      repairedInviteCount: 0,
      checkedPendingCount: 0,
      confirmedCount: 0,
      expiredOrdersCount: 0,
      expiredSessionsCount: 0,
      cleanedTokensCount: 0,
      durationMs: Date.now() - startTime,
      error: "Another reconciliation job is currently running.",
    };
  }

  let leaseLost = false;
  let heartbeat: Promise<void> = Promise.resolve();
  let renewing = false;
  const renew = () => {
    if (renewing || leaseLost) return heartbeat;
    renewing = true;
    heartbeat = renewOperationalLock("master_reconciliation", lockOwner)
      .then((owned) => {
        if (!owned) leaseLost = true;
      })
      .catch(() => {
        leaseLost = true;
      })
      .finally(() => {
        renewing = false;
      });
    return heartbeat;
  };
  const timer = setInterval(() => void renew(), 60_000);
  const assertLease = async () => {
    await renew();
    if (leaseLost) throw new Error("Reconciliation operational lock lost.");
  };

  try {
    await assertLease();
    const unfulfilled = await reconcileUnfulfilledPaidOrders(assertLease);
    await assertLease();
    const pending = await reconcilePendingOrders(assertLease);
    await assertLease();
    const invites = await reconcileIncompleteInviteActivations(assertLease);
    await assertLease();
    const sessions = await expireStaleSessions();
    await assertLease();
    const tokens = await cleanupExpiredTokens();
    await assertLease();
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
      await assertLease();
      await sendPurchaseConfirmationForOrder(order.id).catch((error: unknown) => {
        logEvent("error", "paid_report_retry_failed", {
          orderId: order.id,
          error: error instanceof Error ? error.message : "Unknown",
        });
      });
    }
    await assertLease();
    await deliverCompletedReports(5, undefined, assertLease);
    await assertLease();

    const durationMs = Date.now() - startTime;

    logEvent("info", "reconciliation_suite_completed", {
      repairedPaidCount: unfulfilled.repairedCount,
      repairedInviteCount: invites.repairedCount,
      checkedPendingCount: pending.checkedCount,
      confirmedCount: pending.confirmedCount,
      expiredOrdersCount: pending.expiredCount,
      expiredSessionsCount: sessions.expiredCount,
      cleanedTokensCount: tokens.cleanedCount,
      durationMs,
    });

    return {
      success: invites.failedCount === 0,
      repairedPaidCount: unfulfilled.repairedCount,
      repairedInviteCount: invites.repairedCount,
      checkedPendingCount: pending.checkedCount,
      confirmedCount: pending.confirmedCount,
      expiredOrdersCount: pending.expiredCount,
      expiredSessionsCount: sessions.expiredCount,
      cleanedTokensCount: tokens.cleanedCount,
      durationMs,
      ...(invites.failedCount > 0
        ? { error: "Some paid invitations could not be recovered." }
        : {}),
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logEvent("error", "reconciliation_suite_error", { error: errorMsg });

    return {
      success: false,
      repairedPaidCount: 0,
      repairedInviteCount: 0,
      checkedPendingCount: 0,
      confirmedCount: 0,
      expiredOrdersCount: 0,
      expiredSessionsCount: 0,
      cleanedTokensCount: 0,
      durationMs: Date.now() - startTime,
      error: errorMsg,
    };
  } finally {
    clearInterval(timer);
    await heartbeat;
    await releaseOperationalLock("master_reconciliation", lockOwner);
  }
}
