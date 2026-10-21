import { beforeEach, describe, expect, it, vi } from "vitest";
import { findPaidEntitlement } from "@/features/commerce/entitlement-service";
const state = vi.hoisted(() => ({ queue: [] as unknown[], filters: [] as unknown[][] }));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseSecretClient: () => ({
    from: (table: string) => {
      const result = state.queue.shift();
      const chain = {
        select: () => chain,
        eq: (...args: unknown[]) => {
          state.filters.push([table, ...args]);
          return chain;
        },
        in: (...args: unknown[]) => {
          state.filters.push([table, ...args]);
          return chain;
        },
        gt: () => chain,
        order: () => chain,
        limit: () => chain,
        single: async () => result,
        then: (resolve: (value: unknown) => unknown) => Promise.resolve(result).then(resolve),
      };
      return chain;
    },
  }),
}));
describe("Paid session access recovery", () => {
  beforeEach(() => {
    state.queue.length = 0;
    state.filters.length = 0;
  });
  it.each(["BRAINRANK", "MONEYDNA", "COUPLEDNA"])(
    "recovers the direct %s grant without a buyer identity",
    async (product) => {
      state.queue.push(
        { data: { buyer_id: null } },
        { data: [{ id: "grant", order_id: "order", session_id: "attempt" }] },
      );
      await expect(findPaidEntitlement("attempt", product)).resolves.toEqual({
        id: "grant",
        orderId: "order",
        sourceSessionId: "attempt",
      });
      expect(state.filters).toContainEqual(["result_access_grants", "session_id", ["attempt"]]);
      expect(state.filters).toContainEqual(["result_access_grants", "product_code", product]);
      expect(state.filters).toContainEqual(["result_access_grants", "orders.status", "FULFILLED"]);
      expect(state.filters).not.toContainEqual(["quiz_sessions", "buyer_id", null]);
    },
  );
  it("does not grant pending or absent purchases", async () => {
    state.queue.push({ data: { buyer_id: null } }, { data: [] });
    await expect(findPaidEntitlement("attempt", "BRAINRANK")).resolves.toBeNull();
  });
  it("does not treat a temporary lookup failure as an unpaid purchase", async () => {
    state.queue.push({ data: null, error: { message: "Temporary database outage" } });
    await expect(findPaidEntitlement("attempt", "BRAINRANK")).rejects.toThrow(
      "Unable to verify paid access. Please try again.",
    );
    expect(state.filters).not.toContainEqual(["result_access_grants", "product_code", "BRAINRANK"]);
  });
  it("keeps the target attempt even if a buyer lookup omits it", async () => {
    state.queue.push({ data: { buyer_id: "buyer" } }, { data: [{ id: "other" }] }, { data: [] });
    await expect(findPaidEntitlement("attempt", "MONEYDNA")).resolves.toBeNull();
    expect(state.filters).toContainEqual([
      "result_access_grants",
      "session_id",
      ["attempt", "other"],
    ]);
  });
});
