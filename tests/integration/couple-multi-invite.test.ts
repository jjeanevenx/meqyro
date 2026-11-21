import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import * as inviteService from "@/features/couple/couple-invite-service";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { reconcileIncompleteInviteActivations } from "@/features/commerce/reconciliation-service";
import { startCompletedCommerceSession } from "./commerce-fixtures";
import { ControlledPaymentProvider } from "./controlled-payment-provider";
import { isSupabaseAvailable } from "./db-check";
import { createOrder, setPaymentProviderFactoryForTests } from "@/features/commerce/order-service";
import { fulfillOrder } from "@/features/commerce/fulfillment-service";
import {
  createInviteSlot,
  getSlotComparison,
  listHostInviteSlots,
  listHostInviteSlotsWithState,
  redeemInviteSlot,
  validateInviteForRedemption,
} from "@/features/couple/couple-invite-service";
import { getCoupleComparison } from "@/features/couple/couple-service";
import { getProtectedResult } from "@/features/results/result-service";
import { startQuizSession } from "@/features/quiz-engine/session-service";

const isOnline = await isSupabaseAvailable();

beforeAll(() => {
  setPaymentProviderFactoryForTests((name) => new ControlledPaymentProvider(name));
});
afterAll(() => {
  setPaymentProviderFactoryForTests(null);
});

describe.skipIf(!isOnline)(
  "CoupleDNA Multi-Invite Lifecycle, Progressive Pricing & Strict Isolation Matrix",
  () => {
    it("recovers a committed payment and repairs dependencies without renewing consent or expiration", async () => {
      const { session: host, token } = await startCompletedCommerceSession({
        quizSlug: "coupledna",
        locale: "pt",
        market: "BR",
      });
      const slot = await createInviteSlot({
        hostSessionId: host.id,
        hostToken: token,
        market: "BR",
      });
      const { order } = await createOrder({
        sessionId: host.id,
        sessionToken: token,
        productCode: "COUPLEDNA_INVITE",
        customerEmail: "recovery-fixture@example.com",
        market: "BR",
        locale: "pt",
        coupleInviteSlotId: slot.id,
      });
      const activation = vi
        .spyOn(inviteService, "activateInviteSlot")
        .mockRejectedValueOnce(new Error("Injected activation outage"));
      try {
        await expect(fulfillOrder(order.id, "evt_recovery")).rejects.toThrow(
          "Injected activation outage",
        );
      } finally {
        activation.mockRestore();
      }
      const db = createSupabaseSecretClient();
      const { data: committed, error: committedError } = await db
        .from("orders")
        .select("status")
        .eq("id", order.id)
        .single();
      expect(committedError).toBeNull();
      expect(committed?.status).toBe("FULFILLED");
      await expect(fulfillOrder(order.id, "evt_recovery")).resolves.toEqual({
        success: true,
        alreadyFulfilled: true,
      });
      const { data: active, error: activeError } = await db
        .from("couple_invite_slots")
        .select("invite_code,expires_at,activation_completed_at")
        .eq("id", slot.id)
        .single();
      expect(activeError).toBeNull();
      expect(active?.activation_completed_at).toBeTruthy();
      const { data: invite, error: inviteError } = await db
        .from("couple_invites")
        .select("id")
        .eq("invite_code", active!.invite_code)
        .single();
      expect(inviteError).toBeNull();
      const { error: consentError } = await db
        .from("couple_consents")
        .update({ can_share_comparison: false })
        .eq("invite_id", invite!.id)
        .eq("session_id", host.id);
      expect(consentError).toBeNull();
      const { error: interruptedError } = await db
        .from("couple_invite_slots")
        .update({ activation_completed_at: null })
        .eq("id", slot.id);
      expect(interruptedError).toBeNull();
      const reconciliation = await reconcileIncompleteInviteActivations();
      expect(reconciliation.repairedCount).toBeGreaterThanOrEqual(1);
      const { data: repaired, error: repairError } = await db
        .from("couple_invite_slots")
        .select("invite_code,expires_at,activation_completed_at")
        .eq("id", slot.id)
        .single();
      expect(repairError).toBeNull();
      expect(repaired?.activation_completed_at).toBeTruthy();
      expect(repaired?.invite_code).toBe(active?.invite_code);
      expect(repaired?.expires_at).toBe(active?.expires_at);
      await fulfillOrder(order.id, "evt_recovery_duplicate");
      const { data: consent, error: lookupError } = await db
        .from("couple_consents")
        .select("can_share_comparison")
        .eq("invite_id", invite!.id)
        .eq("session_id", host.id)
        .single();
      expect(lookupError).toBeNull();
      expect(consent?.can_share_comparison).toBe(false);
      const { count, error: grantsError } = await db
        .from("result_access_grants")
        .select("id", { count: "exact", head: true })
        .eq("order_id", order.id);
      expect(grantsError).toBeNull();
      expect(count).toBe(2);
    });

    it("enforces progressive pricing (P then P/3), link generation only after payment, single-use redemption, and strict guest isolation", async () => {
      // 1. Host 1 completes CoupleDNA
      const { session: host1, token: host1Token } = await startCompletedCommerceSession({
        quizSlug: "coupledna",
        locale: "pt",
        market: "BR",
      });

      // 2. Host 1 creates Slot 1 -> base price P (1490 BRL), PENDING_PAYMENT, no inviteCode yet
      const slot1 = await createInviteSlot({
        hostSessionId: host1.id,
        hostToken: host1Token,
        market: "BR",
        hostNameForGuest: "Parceiro Principal",
      });
      expect(slot1.slotNumber).toBe(1);
      expect(slot1.priceAmount).toBe(1490);
      expect(slot1.priceCurrency).toBe("BRL");
      expect(slot1.status).toBe("PENDING_PAYMENT");
      expect(slot1.inviteCode).toBeNull();

      // Create order for Slot 1 (still PENDING before webhook)
      const { order: order1 } = await createOrder({
        sessionId: host1.id,
        sessionToken: host1Token,
        productCode: "COUPLEDNA_INVITE",
        customerEmail: "host1-multi@example.com",
        market: "BR",
        locale: "pt",
        coupleInviteSlotId: slot1.id,
      });
      expect(order1.amount).toBe(1490);

      // Before payment is confirmed, no invite link or code is exposed
      const slotsBeforePayment = await listHostInviteSlotsWithState({
        hostSessionId: host1.id,
        hostToken: host1Token,
        locale: "pt",
      });
      expect(slotsBeforePayment).toHaveLength(1);
      expect(slotsBeforePayment[0].inviteCode).toBeNull();
      expect(slotsBeforePayment[0].inviteUrl).toBeNull();
      expect(slotsBeforePayment[0].comparisonState).toBe("PENDING_PAYMENT");

      // 3. Payment 1 confirmed via webhook/fulfillOrder -> Slot 1 becomes ACTIVE with inviteCode
      await fulfillOrder(order1.id, "evt_slot_1");
      const slotsAfterPayment1 = await listHostInviteSlotsWithState({
        hostSessionId: host1.id,
        hostToken: host1Token,
        locale: "pt",
      });
      expect(slotsAfterPayment1[0].status).toBe("ACTIVE");
      expect(slotsAfterPayment1[0].inviteCode).toMatch(/^CP-[A-F0-9]{8}$/);
      expect(slotsAfterPayment1[0].inviteUrl).toContain(slotsAfterPayment1[0].inviteCode!);
      const code1 = slotsAfterPayment1[0].inviteCode!;

      // Host 1's own individual premium report is also unlocked by the 1st invite purchase (D-003)
      const hostProtectedAfterSlot1 = await getProtectedResult({
        sessionId: host1.id,
        sessionToken: host1Token,
        locale: "pt",
        market: "BR",
      });
      expect(hostProtectedAfterSlot1.accessLevel).toBe("PREMIUM_UNLOCKED");

      // 4. Host 1 buys Slot 2 and Slot 3 at 1/3 of base price (floor(1490/3) = 496 BRL)
      const slot2 = await createInviteSlot({
        hostSessionId: host1.id,
        hostToken: host1Token,
        market: "BR",
        hostNameForGuest: "Convidado Dois",
      });
      expect(slot2.slotNumber).toBe(2);
      expect(slot2.priceAmount).toBe(496);
      expect(slot2.inviteCode).toBeNull();

      const { order: order2 } = await createOrder({
        sessionId: host1.id,
        sessionToken: host1Token,
        productCode: "COUPLEDNA_INVITE",
        customerEmail: "host1-multi@example.com",
        market: "BR",
        locale: "pt",
        coupleInviteSlotId: slot2.id,
      });
      expect(order2.amount).toBe(496);
      await fulfillOrder(order2.id, "evt_slot_2");

      const slot3 = await createInviteSlot({
        hostSessionId: host1.id,
        hostToken: host1Token,
        market: "BR",
        hostNameForGuest: "Convidado Três",
      });
      expect(slot3.slotNumber).toBe(3);
      expect(slot3.priceAmount).toBe(496);

      const { order: order3 } = await createOrder({
        sessionId: host1.id,
        sessionToken: host1Token,
        productCode: "COUPLEDNA_INVITE",
        customerEmail: "host1-multi@example.com",
        market: "BR",
        locale: "pt",
        coupleInviteSlotId: slot3.id,
      });
      await fulfillOrder(order3.id, "evt_slot_3");

      const allActiveSlots = await listHostInviteSlotsWithState({
        hostSessionId: host1.id,
        hostToken: host1Token,
        locale: "pt",
      });
      expect(allActiveSlots).toHaveLength(3);
      const code2 = allActiveSlots[1].inviteCode!;
      const code3 = allActiveSlots[2].inviteCode!;
      expect(new Set([code1, code2, code3]).size).toBe(3);

      // 5. Guest 1, Guest 2, and Guest 3 redeem their respective invites and complete CoupleDNA
      expect((await validateInviteForRedemption(code1)).isValid).toBe(true);
      const { session: guest1, token: guest1Token } = await startCompletedCommerceSession({
        quizSlug: "coupledna",
        locale: "pt",
        market: "BR",
        inviteCode: code1,
        comparisonConsent: true,
      });

      // Slot 1 is now COMPLETED and cannot be redeemed by another person
      const recheckCode1 = await validateInviteForRedemption(code1);
      expect(recheckCode1.isValid).toBe(false);
      expect(recheckCode1.reason).toBe("ALREADY_REDEEMED");

      await expect(
        startQuizSession({
          quizSlug: "coupledna",
          locale: "pt",
          market: "BR",
          inviteCode: code1,
          comparisonConsent: true,
        }),
      ).rejects.toThrow("Invite unavailable or expired");

      const { session: guest2, token: guest2Token } = await startCompletedCommerceSession({
        quizSlug: "coupledna",
        locale: "pt",
        market: "BR",
        inviteCode: code2,
        comparisonConsent: true,
      });

      const { session: guest3, token: guest3Token } = await startCompletedCommerceSession({
        quizSlug: "coupledna",
        locale: "pt",
        market: "BR",
        inviteCode: code3,
        comparisonConsent: true,
      });

      // Extra person trying to redeem code1 via redeemInviteSlot directly is rejected
      await expect(
        redeemInviteSlot({
          inviteCode: code1,
          guestSessionId: guest2.id,
          guestToken: guest2Token,
        }),
      ).rejects.toThrow("ALREADY_REDEEMED");

      // 6. Host 1 can view READY comparisons with all 3 guests
      const hostComp1 = await getSlotComparison({
        slotId: slot1.id,
        sessionId: host1.id,
        sessionToken: host1Token,
        locale: "pt",
      });
      const hostComp2 = await getSlotComparison({
        slotId: slot2.id,
        sessionId: host1.id,
        sessionToken: host1Token,
        locale: "pt",
      });
      const hostComp3 = await getSlotComparison({
        slotId: slot3.id,
        sessionId: host1.id,
        sessionToken: host1Token,
        locale: "pt",
      });

      expect(hostComp1.state).toBe("READY");
      expect(hostComp1.guestLabel).toBe("Parceiro Principal");
      expect(hostComp1.comparison?.bilateralUnlocked).toBe(true);
      expect(hostComp1.report?.sections.length).toBeGreaterThan(0);

      expect(hostComp2.state).toBe("READY");
      expect(hostComp2.guestLabel).toBe("Convidado Dois");
      expect(hostComp2.comparison?.bilateralUnlocked).toBe(true);

      expect(hostComp3.state).toBe("READY");
      expect(hostComp3.guestLabel).toBe("Convidado Três");
      expect(hostComp3.comparison?.bilateralUnlocked).toBe(true);

      // 7. Guest 1 can view their own result and Comparison 1 (Host 1 + Guest 1),
      //    and does NOT see Host 1's private guestLabel
      const guest1Result = await getProtectedResult({
        sessionId: guest1.id,
        sessionToken: guest1Token,
        locale: "pt",
        market: "BR",
      });
      expect(guest1Result.accessLevel).toBe("PREMIUM_UNLOCKED");
      expect(guest1Result.premiumReport?.sections.length).toBeGreaterThan(0);

      const guest1Comp1 = await getSlotComparison({
        slotId: slot1.id,
        sessionId: guest1.id,
        sessionToken: guest1Token,
        locale: "pt",
      });
      expect(guest1Comp1.state).toBe("READY");
      expect(guest1Comp1.guestLabel).toBeNull();
      expect(guest1Comp1.inviteCode).toBeNull();
      expect(guest1Comp1.comparison?.bilateralUnlocked).toBe(true);

      // 8. Guest Isolation: Guest 1 CANNOT access Guest 2's or Guest 3's slots, comparisons, or results
      await expect(
        getSlotComparison({
          slotId: slot2.id,
          sessionId: guest1.id,
          sessionToken: guest1Token,
          locale: "pt",
        }),
      ).rejects.toThrow("UNAUTHORIZED_SLOT_ACCESS");

      await expect(
        getSlotComparison({
          slotId: slot3.id,
          sessionId: guest1.id,
          sessionToken: guest1Token,
          locale: "pt",
        }),
      ).rejects.toThrow("UNAUTHORIZED_SLOT_ACCESS");

      expect(await getCoupleComparison(code2, guest1.id, guest1Token)).toBeNull();
      expect(await getCoupleComparison(code3, guest1.id, guest1Token)).toBeNull();

      await expect(
        getProtectedResult({
          sessionId: guest2.id,
          sessionToken: guest1Token,
          locale: "pt",
          market: "BR",
        }),
      ).rejects.toThrow();

      await expect(
        listHostInviteSlots({
          hostSessionId: host1.id,
          hostToken: guest1Token,
        }),
      ).rejects.toThrow();

      // Guest 2 & Guest 3 also cannot access each other's slots
      await expect(
        getSlotComparison({
          slotId: slot3.id,
          sessionId: guest2.id,
          sessionToken: guest2Token,
          locale: "pt",
        }),
      ).rejects.toThrow("UNAUTHORIZED_SLOT_ACCESS");

      await expect(
        getSlotComparison({
          slotId: slot1.id,
          sessionId: guest3.id,
          sessionToken: guest3Token,
          locale: "pt",
        }),
      ).rejects.toThrow("UNAUTHORIZED_SLOT_ACCESS");

      // 9. Independent Host 2 cannot access Host 1's slots or comparisons
      const { session: host2, token: host2Token } = await startCompletedCommerceSession({
        quizSlug: "coupledna",
        locale: "pt",
        market: "BR",
      });

      await expect(
        listHostInviteSlots({
          hostSessionId: host1.id,
          hostToken: host2Token,
        }),
      ).rejects.toThrow();

      await expect(
        getSlotComparison({
          slotId: slot1.id,
          sessionId: host2.id,
          sessionToken: host2Token,
          locale: "pt",
        }),
      ).rejects.toThrow("UNAUTHORIZED_SLOT_ACCESS");
    });
  },
);
