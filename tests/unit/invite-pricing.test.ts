import { beforeEach, describe, expect, it, vi } from "vitest";
import { calculateInvitePrice, MAX_COUPLEDNA_INVITES } from "@/features/couple/invite-pricing";

type MockSlot = {
  id: string;
  status: string;
  slot_number: number;
  pending_expires_at: string | null;
};

const state = vi.hoisted(() => ({
  slots: [] as MockSlot[],
  legacyGrants: [] as Array<{ id: string }>,
  updatedCancelledIds: [] as string[],
  marketPrices: {
    BR: { amount: 1490, currency: "BRL" },
    US: { amount: 399, currency: "USD" },
    EU: { amount: 399, currency: "EUR" },
    GB: { amount: 349, currency: "GBP" },
  } as Record<string, { amount: number; currency: string }>,
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseSecretClient: () => ({
    from: (table: string) => {
      if (table === "couple_invite_slots") {
        let isUpdate = false;
        let inIds: string[] = [];
        const chain = {
          select: () => chain,
          update: () => {
            isUpdate = true;
            return chain;
          },
          in: (_col: string, vals: string[]) => {
            inIds = vals;
            return chain;
          },
          eq: () => chain,
          then: (resolve: (val: unknown) => unknown) => {
            if (isUpdate) {
              state.updatedCancelledIds.push(...inIds);
              return Promise.resolve({ data: null, error: null }).then(resolve);
            }
            return Promise.resolve({ data: state.slots, error: null }).then(resolve);
          },
        };
        return chain;
      }

      if (table === "result_access_grants") {
        const chain = {
          select: () => chain,
          eq: () => chain,
          limit: async () => ({ data: state.legacyGrants, error: null }),
        };
        return chain;
      }

      if (table === "quizzes") {
        const chain = {
          select: () => chain,
          eq: () => chain,
          single: async () => ({ data: { id: "quiz-coupledna-invite" }, error: null }),
        };
        return chain;
      }

      if (table === "product_prices") {
        let selectedMarket = "BR";
        const chain = {
          select: () => chain,
          eq: (col: string, val: string) => {
            if (col === "market") selectedMarket = val;
            return chain;
          },
          single: async () => ({
            data: state.marketPrices[selectedMarket] ?? null,
            error: state.marketPrices[selectedMarket] ? null : { message: "Not found" },
          }),
        };
        return chain;
      }

      throw new Error(`Unexpected table ${table}`);
    },
  }),
}));

describe("CoupleDNA Progressive Invite Pricing (D-002, D-004, D-005)", () => {
  beforeEach(() => {
    state.slots = [];
    state.legacyGrants = [];
    state.updatedCancelledIds = [];
  });

  it.each([
    ["BR", 1490, 496, "BRL"],
    ["US", 399, 133, "USD"],
    ["EU", 399, 133, "EUR"],
    ["GB", 349, 116, "GBP"],
  ])(
    "%s: charges base price P (%i) on 1st invite and floor(P/3) (%i) on subsequent invites",
    async (market, expectedBase, expectedDiscounted, expectedCurrency) => {
      state.slots = [];
      const first = await calculateInvitePrice("host-1", market);
      expect(first).toEqual({
        amount: expectedBase,
        currency: expectedCurrency,
        slotNumber: 1,
        isDiscounted: false,
      });

      state.slots = [{ id: "slot-1", status: "ACTIVE", slot_number: 1, pending_expires_at: null }];
      const second = await calculateInvitePrice("host-1", market);
      expect(second).toEqual({
        amount: expectedDiscounted,
        currency: expectedCurrency,
        slotNumber: 2,
        isDiscounted: true,
      });
    },
  );

  it("does not grant 1/3 discount if existing slot is only PENDING_PAYMENT (anti-race-condition)", async () => {
    state.slots = [
      {
        id: "slot-pending",
        status: "PENDING_PAYMENT",
        slot_number: 1,
        pending_expires_at: new Date(Date.now() + 600_000).toISOString(),
      },
    ];
    const concurrent = await calculateInvitePrice("host-1", "BR");
    expect(concurrent.isDiscounted).toBe(false);
    expect(concurrent.amount).toBe(1490);
    expect(concurrent.slotNumber).toBe(2);
  });

  it("grants 1/3 discount on 1st COUPLEDNA_INVITE slot when host has a legacy COUPLEDNA purchase", async () => {
    state.legacyGrants = [{ id: "legacy-grant-1" }];
    const result = await calculateInvitePrice("host-legacy", "BR");
    expect(result).toEqual({
      amount: 496,
      currency: "BRL",
      slotNumber: 1,
      isDiscounted: true,
    });
  });

  it("auto-cancels expired PENDING_PAYMENT slots and assigns non-colliding slotNumber", async () => {
    state.slots = [
      {
        id: "slot-stale",
        status: "PENDING_PAYMENT",
        slot_number: 1,
        pending_expires_at: new Date(Date.now() - 60_000).toISOString(),
      },
    ];
    const result = await calculateInvitePrice("host-1", "BR");
    expect(state.updatedCancelledIds).toContain("slot-stale");
    expect(result.slotNumber).toBe(2);
    expect(result.isDiscounted).toBe(false);
    expect(result.amount).toBe(1490);
  });

  it("enforces MAX_COUPLEDNA_INVITES = 10", async () => {
    state.slots = Array.from({ length: MAX_COUPLEDNA_INVITES }, (_, idx) => ({
      id: `slot-${idx + 1}`,
      status: "ACTIVE",
      slot_number: idx + 1,
      pending_expires_at: null,
    }));
    await expect(calculateInvitePrice("host-max", "BR")).rejects.toThrow("INVITE_LIMIT_REACHED");
  });
});
