import { beforeEach, describe, expect, it, vi } from "vitest";
import { fulfillOrder } from "@/features/commerce/fulfillment-service";
import {
  reconcileIncompleteInviteActivations,
  reconcileUnfulfilledPaidOrders,
} from "@/features/commerce/reconciliation-service";

const state = vi.hoisted(() => ({
  status: "PENDING",
  activate: vi.fn(),
  analytics: vi.fn(),
  referral: vi.fn(),
  rpc: vi.fn(),
  slots: [] as { id: string; order_id: string }[],
  scanError: false,
  filters: [] as unknown[][],
  retryUpdates: [] as unknown[],
}));
vi.mock("@/features/couple/couple-invite-service", () => ({ activateInviteSlot: state.activate }));
vi.mock("@/features/analytics/analytics-service", () => ({ recordFunnelEvent: state.analytics }));
vi.mock("@/features/referrals/referral-service", () => ({
  recordReferralConversion: state.referral,
}));
vi.mock("@/features/email/completed-report-delivery", () => ({ deliverCompletedReports: vi.fn() }));
vi.mock("@/features/commerce/order-service", () => ({ getPaymentProvider: vi.fn() }));
vi.mock("@/features/commerce/webhook-handler", () => ({
  sendPurchaseConfirmationForOrder: vi.fn(),
}));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseSecretClient: () => ({
    rpc: state.rpc,
    from: (table: string) => {
      let updating = false;
      const result = () =>
        table === "order_items"
          ? { data: [{ product_code: "COUPLEDNA_INVITE" }], error: null }
          : {
              data: state.slots,
              error: state.scanError && !updating ? { message: "offline" } : null,
            };
      const chain = {
        select: () => chain,
        eq: (...args: unknown[]) => {
          state.filters.push([table, "eq", ...args]);
          return chain;
        },
        in: (...args: unknown[]) => {
          state.filters.push([table, "in", ...args]);
          return chain;
        },
        is: (...args: unknown[]) => {
          state.filters.push([table, "is", ...args]);
          return chain;
        },
        order: () => chain,
        limit: () => chain,
        update: (value: unknown) => {
          updating = true;
          state.retryUpdates.push(value);
          return chain;
        },
        single: async () => ({
          data: {
            id: "order",
            session_id: "host",
            status: state.status,
            couple_invite_slot_id: "slot",
            referral_code: "ref",
            order_number: "MQ-1",
            currency: "BRL",
          },
          error: null,
        }),
        then: (resolve: (value: unknown) => unknown) => Promise.resolve(result()).then(resolve),
      };
      return chain;
    },
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  state.status = "PENDING";
  state.slots = [];
  state.scanError = false;
  state.filters = [];
  state.retryUpdates = [];
  state.activate.mockResolvedValue({ inviteCode: "CP-PAID" });
  state.analytics.mockResolvedValue(null);
  state.referral.mockResolvedValue(null);
  state.rpc.mockImplementation(async () => {
    const already = state.status === "FULFILLED";
    state.status = "FULFILLED";
    return { data: [{ already_fulfilled: already }], error: null };
  });
});

describe("Paid invitation recovery", () => {
  it("retries activation after payment committed without duplicating first-fulfillment effects", async () => {
    state.activate.mockRejectedValueOnce(new Error("temporary activation failure"));
    await expect(fulfillOrder("order")).rejects.toThrow("temporary activation failure");
    expect(state.status).toBe("FULFILLED");
    await expect(fulfillOrder("order")).resolves.toEqual({ success: true, alreadyFulfilled: true });
    await fulfillOrder("order");
    expect(state.activate).toHaveBeenCalledTimes(3);
    expect(state.activate).toHaveBeenLastCalledWith({ slotId: "slot", orderId: "order" });
    expect(state.referral).toHaveBeenCalledTimes(1);
    expect(state.analytics).toHaveBeenCalledTimes(1);
  });

  it("does not activate an invitation when payment fulfillment fails", async () => {
    state.rpc.mockResolvedValue({ data: null, error: { message: "offline" } });
    await expect(fulfillOrder("order")).rejects.toThrow("Atomic payment fulfillment failed");
    expect(state.activate).not.toHaveBeenCalled();
  });

  it("reconciles incomplete activations on fulfilled orders and schedules a failed slot for retry", async () => {
    state.slots = [
      { id: "broken", order_id: "paid-1" },
      { id: "recoverable", order_id: "paid-2" },
    ];
    state.activate.mockRejectedValueOnce(new Error("offline"));
    await expect(reconcileIncompleteInviteActivations()).resolves.toEqual({
      repairedCount: 1,
      failedCount: 1,
    });
    expect(state.activate).toHaveBeenNthCalledWith(2, { slotId: "recoverable", orderId: "paid-2" });
    expect(state.filters).toContainEqual([
      "couple_invite_slots",
      "eq",
      "orders.status",
      "FULFILLED",
    ]);
    expect(state.filters).toContainEqual([
      "couple_invite_slots",
      "is",
      "activation_completed_at",
      null,
    ]);
    expect(state.filters).toContainEqual([
      "couple_invite_slots",
      "in",
      "status",
      ["PENDING_PAYMENT", "ACTIVE", "REDEEMED", "QUIZ_STARTED", "COMPLETED"],
    ]);
    expect(state.retryUpdates).toHaveLength(1);
  });

  it("counts failed paid orders and continues processing the rest of the batch", async () => {
    state.status = "PAID";
    state.slots = [
      { id: "broken", order_id: "paid-1" },
      { id: "recoverable", order_id: "paid-2" },
    ];
    state.rpc.mockResolvedValueOnce({ data: null, error: { message: "offline" } });
    await expect(reconcileUnfulfilledPaidOrders()).resolves.toEqual({
      repairedCount: 1,
      failedCount: 1,
    });
    expect(state.rpc).toHaveBeenCalledTimes(2);
  });

  it("reports a failed recovery lookup instead of claiming an empty successful batch", async () => {
    state.scanError = true;
    await expect(reconcileIncompleteInviteActivations()).rejects.toThrow(
      "Unable to load incomplete paid invitations",
    );
    expect(state.activate).not.toHaveBeenCalled();
  });
});
