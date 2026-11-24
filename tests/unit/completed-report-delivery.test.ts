import { beforeEach, describe, expect, it, vi } from "vitest";
import { deliverCompletedReports } from "@/features/email/completed-report-delivery";

const state = vi.hoisted(() => ({ rpc: vi.fn(), send: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseSecretClient: () => ({ rpc: state.rpc }),
}));
vi.mock("@/features/commerce/webhook-handler", () => ({
  sendPurchaseConfirmationForOrder: state.send,
}));

beforeEach(() => {
  vi.resetAllMocks();
  state.rpc.mockResolvedValue({
    data: [
      { order_id: "first", session_id: "a" },
      { order_id: "second", session_id: "b" },
    ],
    error: null,
  });
  state.send.mockResolvedValue(undefined);
});

describe("Completed report reconciliation", () => {
  it("counts a failed attempt and continues dispatching the batch", async () => {
    state.send.mockRejectedValueOnce(new Error("offline"));
    await expect(deliverCompletedReports()).resolves.toEqual({ failedCount: 1 });
    expect(state.send).toHaveBeenCalledTimes(2);
    expect(state.send).toHaveBeenLastCalledWith("second", "b");
  });

  it("stops dispatching when lease ownership is lost", async () => {
    const guard = vi.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error("lost"));
    await expect(deliverCompletedReports(5, undefined, guard)).rejects.toThrow("lost");
    expect(state.send).toHaveBeenCalledTimes(1);
  });
});
