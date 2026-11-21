import { beforeEach, describe, expect, it, vi } from "vitest";
import { activateInviteSlot } from "@/features/couple/couple-invite-service";

const state = vi.hoisted(() => ({ queue: [] as unknown[], calls: [] as unknown[][] }));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseSecretClient: () => ({
    from: (table: string) => {
      const result = state.queue.shift();
      const chain = {
        select: () => chain,
        eq: () => chain,
        in: () => chain,
        update: (value: unknown) => {
          state.calls.push([table, "update", value]);
          return chain;
        },
        insert: (value: unknown) => {
          state.calls.push([table, "insert", value]);
          return chain;
        },
        upsert: (value: unknown, options: unknown) => {
          state.calls.push([table, "upsert", value, options]);
          return chain;
        },
        single: async () => result,
        maybeSingle: async () => result,
        then: (resolve: (value: unknown) => unknown) => Promise.resolve(result).then(resolve),
      };
      return chain;
    },
  }),
}));

const expires = "2026-12-01T00:00:00.000Z";
const slot = {
  id: "slot",
  host_session_id: "host",
  order_id: "order",
  status: "ACTIVE",
  invite_code: "CP-PERSISTED",
  expires_at: expires,
  activation_completed_at: null,
};
const order = { status: "FULFILLED", session_id: "host", couple_invite_slot_id: "slot" };
const ok = { error: null };
function dependencies(consentError = false) {
  state.queue.push(
    ok,
    ok,
    { data: { id: "invite" }, error: null },
    { error: consentError ? { message: "offline" } : null },
  );
  if (!consentError) state.queue.push({ data: { id: "slot" }, error: null });
}

beforeEach(() => {
  state.queue = [];
  state.calls = [];
});

describe("Idempotent paid invite activation", () => {
  it("repairs an active slot using its original code/expiry and never overwrites withdrawn consent", async () => {
    state.queue.push({ data: slot }, { data: order });
    dependencies();
    await expect(activateInviteSlot({ slotId: "slot", orderId: "order" })).resolves.toEqual({
      inviteCode: "CP-PERSISTED",
    });
    expect(state.calls).toContainEqual([
      "couple_consents",
      "upsert",
      expect.objectContaining({ invite_id: "invite" }),
      { onConflict: "invite_id,session_id", ignoreDuplicates: true },
    ]);
    expect(state.calls.filter((call) => call[0] === "couple_invite_slots")).toEqual([
      ["couple_invite_slots", "update", { activation_completed_at: expect.any(String) }],
    ]);
    expect(state.queue).toHaveLength(0);
  });

  it("propagates a consent failure and only marks activation complete after a successful retry", async () => {
    state.queue.push({ data: slot }, { data: order });
    dependencies(true);
    await expect(activateInviteSlot({ slotId: "slot", orderId: "order" })).rejects.toThrow(
      "Unable to persist initial invite consent",
    );
    expect(state.calls.filter((call) => call[0] === "couple_invite_slots")).toHaveLength(0);
    state.queue.push({ data: slot }, { data: order });
    dependencies();
    await activateInviteSlot({ slotId: "slot", orderId: "order" });
    expect(state.calls.filter((call) => call[0] === "couple_invite_slots")).toHaveLength(1);
  });

  it("uses the winner's persisted code after a concurrent activation affects zero rows", async () => {
    state.queue.push(
      { data: { ...slot, status: "PENDING_PAYMENT", invite_code: null } },
      { data: order },
      { data: null, error: null },
      { data: null, error: null },
      { data: slot, error: null },
    );
    dependencies();
    await expect(activateInviteSlot({ slotId: "slot", orderId: "order" })).resolves.toEqual({
      inviteCode: "CP-PERSISTED",
    });
    expect(state.queue).toHaveLength(0);
  });

  it.each(["EXPIRED", "CANCELLED", "REVOKED"])("does not reopen a %s slot", async (status) => {
    state.queue.push({ data: { ...slot, status } }, { data: order });
    await activateInviteSlot({ slotId: "slot", orderId: "order" });
    expect(state.calls).toEqual([]);
  });

  it.each(["PENDING", "REFUNDED"])("does not create grants for a %s order", async (status) => {
    state.queue.push({ data: slot }, { data: { ...order, status } });
    await expect(activateInviteSlot({ slotId: "slot", orderId: "order" })).rejects.toThrow(
      "matching fulfilled order",
    );
    expect(state.calls).toEqual([]);
  });

  it("does not repeat a completed activation", async () => {
    state.queue.push(
      { data: { ...slot, activation_completed_at: "2026-11-18T00:00:00Z" } },
      { data: order },
    );
    await activateInviteSlot({ slotId: "slot", orderId: "order" });
    expect(state.calls).toEqual([]);
  });
});
