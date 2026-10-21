import { randomBytes } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startCompletedCommerceSession } from "./commerce-fixtures";
import { ControlledPaymentProvider } from "./controlled-payment-provider";
import { isSupabaseAvailable } from "./db-check";
import {
  createOrder,
  getOrderById,
  setPaymentProviderFactoryForTests,
} from "@/features/commerce/order-service";
import { fulfillOrder } from "@/features/commerce/fulfillment-service";
import { findPaidEntitlement } from "@/features/commerce/entitlement-service";
import { getProtectedResult } from "@/features/results/result-service";
import { createCoupleInvite } from "@/features/couple/couple-service";
import { validateAndRecoverSession } from "@/features/quiz-engine/session-service";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { hashToken } from "@/features/privacy/consent-service";

beforeAll(async () => {
  expect(await isSupabaseAvailable()).toBe(true);
  setPaymentProviderFactoryForTests((name) => new ControlledPaymentProvider(name));
});
afterAll(() => setPaymentProviderFactoryForTests(null));

describe("Commercial report regression with a real database and controlled payments", () => {
  it.each(["brainrank", "moneydna", "coupledna"])(
    "%s: completion, pending payment, paid report, reload, recovery and authorization",
    async (slug) => {
      const { session, token } = await startCompletedCommerceSession({
        quizSlug: slug,
        locale: "pt",
        market: "BR",
      });
      if (slug === "coupledna") {
        const invite = await createCoupleInvite(session.id, token, "pt", true);
        expect(invite).not.toBeNull();
        await startCompletedCommerceSession({
          quizSlug: slug,
          locale: "pt",
          market: "BR",
          inviteCode: invite!.inviteCode,
          comparisonConsent: true,
        });
      }
      const input = {
        sessionId: session.id,
        sessionToken: token,
        locale: "pt",
        market: "BR" as const,
      };
      const free = await getProtectedResult(input);
      expect(free.accessLevel).toBe("FREE_PARTIAL");
      expect(free.premiumReport).toBeUndefined();
      const { order } = await createOrder({
        ...input,
        productCode: slug.toUpperCase(),
        customerEmail: "quiz-premium-qa@example.com",
      });
      expect((await getProtectedResult(input)).premiumReport).toBeUndefined();
      await expect(
        getProtectedResult({ ...input, sessionToken: "unrelated-participant" }),
      ).rejects.toThrow();
      await fulfillOrder(order.id, "controlled-regression");
      expect(await fulfillOrder(order.id, "controlled-regression-repeat")).toEqual({
        success: true,
        alreadyFulfilled: true,
      });
      const paid = await getProtectedResult(input);
      expect(paid.accessLevel).toBe("PREMIUM_UNLOCKED");
      expect(paid.premiumReport?.sections.length).toBeGreaterThan(0);
      expect((await getOrderById(order.id, { sessionToken: token }))?.quizSlug).toBe(slug);
      expect((await getProtectedResult(input)).premiumReport).toEqual(paid.premiumReport);
      expect(
        await findPaidEntitlement(session.id, slug === "brainrank" ? "MONEYDNA" : "BRAINRANK"),
      ).toBeNull();
      const db = createSupabaseSecretClient();
      const { data: grants, error: grantError } = await db
        .from("result_access_grants")
        .select("id")
        .eq("order_id", order.id);
      expect(grantError).toBeNull();
      expect(grants).toHaveLength(1);
      if (slug === "brainrank") {
        const { data: result } = await db
          .from("results")
          .select("score")
          .eq("session_id", session.id)
          .single();
        expect(result?.score).toMatchObject({
          quizVersion: "1.1",
          scoringVersion: "1.1",
          memoryRecall: { situationsPresented: 3, total: 3 },
        });
        expect(
          result?.score.memoryRecall.intervals.map(
            (step: { interveningQuestions: number }) => step.interveningQuestions,
          ),
        ).toEqual([7, 5, 4]);
      }
      const recoveryToken = randomBytes(32).toString("base64url");
      const { error } = await db.from("recovery_tokens").insert({
        session_id: session.id,
        token_hash: hashToken(recoveryToken),
        expires_at: new Date(Date.now() + 3600_000).toISOString(),
        max_uses: 2,
      });
      expect(error).toBeNull();
      const recovered = await validateAndRecoverSession({
        sessionId: session.id,
        recoveryToken,
        quizSlug: slug,
      });
      expect(recovered.status).toBe("COMPLETED");
      expect(
        (await getProtectedResult({ ...input, sessionToken: recovered.token })).premiumReport,
      ).toEqual(paid.premiumReport);
      await expect(getProtectedResult(input)).rejects.toThrow();
    },
  );
});
