import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSlotComparison, redeemInviteSlot } from "@/features/couple/couple-invite-service";
import { hashAnonymousSessionToken } from "@/lib/security/anonymous-session";

type Consent = { session_id: string; can_share_comparison: boolean };
const state = vi.hoisted(() => ({
  queue: [] as unknown[],
  tables: [] as string[],
  consents: [] as Consent[],
}));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseSecretClient: () => ({
    from: (table: string) => {
      state.tables.push(table);
      const result = state.queue.shift();
      const chain = {
        select: () => chain,
        eq: () => chain,
        is: () => chain,
        in: () => chain,
        update: () => chain,
        upsert: (value: Consent | Consent[], options: { ignoreDuplicates?: boolean }) => {
          for (const row of Array.isArray(value) ? value : [value]) {
            const existing = state.consents.find((c) => c.session_id === row.session_id);
            if (!existing) state.consents.push(row);
            else if (!options.ignoreDuplicates) Object.assign(existing, row);
          }
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

const token = "unit-test-guest-token";
const session = {
  id: "guest",
  access_token_hash: hashAnonymousSessionToken(token),
  quiz_versions: { quizzes: { slug: "coupledna" } },
};
const slot = {
  id: "slot",
  host_session_id: "host",
  guest_session_id: "guest",
  status: "COMPLETED",
  invite_code: "CP-UNITTEST",
};
const invite = { id: "invite", initiator_session_id: "host", partner_session_id: "guest" };
const redeem = () =>
  redeemInviteSlot({ inviteCode: slot.invite_code, guestSessionId: "guest", guestToken: token });
const comparison = () =>
  getSlotComparison({ slotId: slot.id, sessionId: "guest", sessionToken: token });

beforeEach(() => {
  state.queue = [];
  state.tables = [];
  state.consents = [];
});

describe("CoupleDNA consent safety", () => {
  it.each(["host", "guest"])("redemption replay preserves withdrawn %s consent", async (id) => {
    state.consents = [
      { session_id: "host", can_share_comparison: id !== "host" },
      { session_id: "guest", can_share_comparison: id !== "guest" },
    ];
    state.queue.push({ data: session }, { data: slot }, { data: invite }, { error: null });
    await redeem();
    expect(state.consents.find((row) => row.session_id === id)?.can_share_comparison).toBe(false);
    expect(state.queue).toHaveLength(0);
  });

  it("guest redemption does not supply the host's missing authorization", async () => {
    state.queue.push({ data: session }, { data: slot }, { data: invite }, { error: null });
    await redeem();
    expect(state.consents).toEqual([
      expect.objectContaining({ session_id: "guest", can_share_comparison: true }),
    ]);
  });

  it.each([
    { consents: [] },
    { consents: [{ session_id: "host", can_share_comparison: true }] },
    { consents: [{ session_id: "guest", can_share_comparison: true }], ownConsent: true },
  ])(
    "requires both persisted consents before reading pair results (%j)",
    async ({ consents, ownConsent }) => {
      state.queue.push(
        { data: session },
        { data: slot },
        { data: invite },
        { data: consents },
        { data: [] },
      );
      await expect(comparison()).resolves.toMatchObject({
        state: "CONSENT_REQUIRED",
        consentGiven: ownConsent ?? false,
      });
      expect(state.tables).not.toContain("results");
    },
  );

  it.each(["invite", "consents"])("propagates a failed %s lookup", async (lookup) => {
    state.queue.push(
      { data: session },
      { data: slot },
      lookup === "invite" ? { data: null, error: { message: "offline" } } : { data: invite },
      { data: null, error: { message: "offline" } },
      { data: [] },
    );
    await expect(comparison()).rejects.toThrow("Unable to verify comparison consent");
    expect(state.tables).not.toContain("results");
  });

  it("does not report successful redemption when consent persistence fails", async () => {
    state.queue.push(
      { data: session },
      { data: slot },
      { data: invite },
      { error: { message: "offline" } },
    );
    await expect(redeem()).rejects.toThrow("Unable to persist guest comparison consent");
  });

  it("rejects a guest that lost the concurrent redemption", async () => {
    state.queue.push(
      { data: session },
      { data: { ...slot, status: "ACTIVE", guest_session_id: null } },
      { data: null, error: null },
      { data: { ...invite, guest_session_id: "another-guest", status: "REDEEMED" } },
      { error: null },
    );
    await expect(redeem()).rejects.toThrow("ALREADY_REDEEMED");
    expect(state.tables).not.toContain("couple_consents");
  });

  it("initializes an accepted guest after successfully binding the invitation", async () => {
    state.queue.push(
      { data: session },
      { data: { ...slot, status: "ACTIVE", guest_session_id: null } },
      { data: { id: slot.id } },
      { data: { ...invite, partner_session_id: null } },
      { data: { id: invite.id } },
      { error: null },
    );
    await redeem();
    expect(state.consents).toEqual([
      expect.objectContaining({ session_id: "guest", can_share_comparison: true }),
    ]);
    expect(state.queue).toHaveLength(0);
  });

  it("does not write consent after an invitation binding fails", async () => {
    state.queue.push(
      { data: session },
      { data: slot },
      { data: { ...invite, partner_session_id: null } },
      { data: null, error: { message: "offline" } },
    );
    await expect(redeem()).rejects.toThrow("Unable to persist invite participant");
    expect(state.consents).toEqual([]);
  });
});
