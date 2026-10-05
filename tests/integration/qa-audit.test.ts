import { acknowledgeMemory } from "./memory-helper";
import { afterAll, beforeAll, describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import {
  startQuizSession,
  saveAnswer,
  completeQuizSession,
} from "@/features/quiz-engine/session-service";
import { getPublicQuiz } from "@/features/quiz-engine/repository";
import { recordLeadAndConsents, unsubscribeByToken } from "@/features/privacy/consent-service";
import { getProtectedResult } from "@/features/results/result-service";
import { createOrder, setPaymentProviderFactoryForTests } from "@/features/commerce/order-service";
import { handleWebhook } from "@/features/commerce/webhook-handler";
import { createCoupleInvite, getCoupleComparison } from "@/features/couple/couple-service";
import { isSupabaseAvailable } from "./db-check";
import { ControlledPaymentProvider } from "./controlled-payment-provider";

const isOnline = await isSupabaseAvailable();

beforeAll(() => {
  setPaymentProviderFactoryForTests((name) => new ControlledPaymentProvider(name));
});

afterAll(() => {
  setPaymentProviderFactoryForTests(null);
});

describe.skipIf(!isOnline)("QA Comprehensive Audit & Adversarial Verification", () => {
  const secretSupabase = createSupabaseSecretClient();
  const anonSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
    { db: { schema: "meqyro" } },
  );

  describe("1. Security, RLS & Threat Model Verification", () => {
    it("RLS Defense: strictly blocks anonymous browser client from querying meqyro tables directly", async () => {
      const protectedTables = [
        "quizzes",
        "quiz_sessions",
        "answers",
        "leads",
        "consents",
        "orders",
        "payment_events",
        "result_access_grants",
        "data_requests",
      ];

      for (const table of protectedTables) {
        const { data, error } = await anonSupabase.from(table).select("*").limit(1);
        expect(data).toBeNull();
        expect(error).not.toBeNull();
      }
    });

    it("Session Forgery Defense: rejects forged or mismatched session tokens", async () => {
      const { session } = await startQuizSession({
        quizSlug: "brainrank",
        locale: "pt",
        market: "BR",
      });

      const { data: questions } = await secretSupabase
        .from("questions")
        .select("id, options(id)")
        .eq("quiz_version_id", session.quizVersionId)
        .limit(1);

      const q = questions![0]!;
      const optId = (q.options as Array<{ id: string }>)[0]?.id;

      await expect(
        saveAnswer({
          sessionId: session.id,
          token: "forged_invalid_token_12345678901234567890",
          questionId: q.id,
          optionId: optId,
          durationMs: 1500,
          nextPosition: 2,
        }),
      ).rejects.toThrow();

      const otherSession = await startQuizSession({
        quizSlug: "brainrank",
        locale: "pt",
        market: "BR",
      });

      await expect(
        saveAnswer({
          sessionId: session.id,
          token: otherSession.token,
          questionId: q.id,
          optionId: optId,
          durationMs: 1500,
          nextPosition: 2,
        }),
      ).rejects.toThrow();
    });

    it("Pricing Tampering Defense: rejects nonexistent products and refuses client-side price modification", async () => {
      const { session, token } = await startQuizSession({
        quizSlug: "brainrank",
        locale: "pt",
        market: "BR",
      });

      await expect(
        createOrder({
          sessionId: session.id,
          sessionToken: token,
          productCode: "INVALID_FREE_HACK",
          customerEmail: "hacker@test.com",
          market: "BR",
          locale: "pt",
        }),
      ).rejects.toThrow(/Produto não encontrado/i);

      const legitimateOrder = await createOrder({
        sessionId: session.id,
        sessionToken: token,
        productCode: "BRAINRANK",
        customerEmail: "honest@test.com",
        market: "BR",
        locale: "pt",
      });

      expect(legitimateOrder.order.amount).toBe(1290);
      expect(legitimateOrder.order.currency).toBe("BRL");

      const fakeWebhookEvent = {
        id: `evt_spoof_${Date.now()}`,
        type: "checkout.session.completed",
        data: {
          object: {
            client_reference_id: legitimateOrder.order.id,
            amount_total: 100,
            currency: "usd",
            metadata: {
              order_number: legitimateOrder.order.orderNumber,
            },
          },
        },
      };

      await expect(
        handleWebhook("stripe", {
          payload: fakeWebhookEvent,
          headers: {},
        }),
      ).rejects.toThrow();

      const unchangedOrder = await secretSupabase
        .from("orders")
        .select("status")
        .eq("id", legitimateOrder.order.id)
        .single();

      expect(unchangedOrder.data?.status).toBe("PENDING");
    });

    it("Paywall Anti-Leak Defense: ensures locked results never expose premium report sections", async () => {
      const { session, token } = await startQuizSession({
        quizSlug: "brainrank",
        locale: "pt",
        market: "BR",
      });

      const quiz = await getPublicQuiz("brainrank", "pt", session.id);

      for (let i = 0; i < (quiz?.questions?.length ?? 0); i++) {
        const q = quiz!.questions[i]!;
        await acknowledgeMemory(q, session.id, token);
        const optId = q.options[0]?.id;
        await saveAnswer({
          sessionId: session.id,
          token,
          questionId: q.id,
          optionId: optId,
          durationMs: 1000,
          nextPosition: i + 2,
        });
      }

      await completeQuizSession({
        sessionId: session.id,
        token,
      });

      const freeResult = await getProtectedResult({
        sessionId: session.id,
        sessionToken: token,
        locale: "pt",
        market: "BR",
      });

      expect(freeResult.accessLevel).toBe("FREE_PARTIAL");
      expect(freeResult.summary).toBeDefined();
      expect(freeResult.summary.overallScore).toBeDefined();
      expect(freeResult.paywall).toBeDefined();
      expect(freeResult.premiumReport).toBeUndefined();

      const rawJson = JSON.stringify(freeResult);
      expect(rawJson).not.toContain("percentileRank");
      expect(rawJson).not.toContain("radarData");
      expect(rawJson).not.toContain("cognitiveProfile");
    });

    it("CoupleDNA Bilateral Privacy Gate: strictly blocks unilateral results and partner leaks", async () => {
      const { session: sessA, token: tokenA } = await startQuizSession({
        quizSlug: "coupledna",
        locale: "pt",
        market: "BR",
      });

      const invite = await createCoupleInvite(sessA.id, tokenA, "pt", true);
      expect(invite).not.toBeNull();

      const initialComparison = await getCoupleComparison(invite!.inviteCode, sessA.id, tokenA);
      expect(initialComparison?.bilateralUnlocked).toBe(false);
      expect(initialComparison?.overallAlignmentPercentage).toBe(0);

      const { session: sessB, token: tokenB } = await startQuizSession({
        quizSlug: "coupledna",
        locale: "pt",
        market: "BR",
      });

      const comparisonWithOnlyA = await getCoupleComparison(invite!.inviteCode, sessB.id, tokenB);
      expect(comparisonWithOnlyA).toBeNull();
    });
  });

  describe("2. End-to-End User Journey & Lifecycle Validation", () => {
    it("executes the full funnel: Session -> Answers -> Scoring -> Consents -> Checkout -> Webhook -> Premium Grant -> Unsubscribe", async () => {
      const { session, token } = await startQuizSession({
        quizSlug: "brainrank",
        locale: "pt",
        market: "BR",
      });
      expect(session.id).toBeDefined();

      const quiz = await getPublicQuiz("brainrank", "pt", session.id);

      for (let i = 0; i < (quiz?.questions?.length ?? 0); i++) {
        const q = quiz!.questions[i]!;
        await acknowledgeMemory(q, session.id, token);
        const optId = q.options[0]?.id;
        await saveAnswer({
          sessionId: session.id,
          token,
          questionId: q.id,
          optionId: optId,
          durationMs: 800,
          nextPosition: i + 2,
        });
      }

      const completed = await completeQuizSession({
        sessionId: session.id,
        token,
      });
      expect(completed.sessionId).toBe(session.id);
      expect(completed.strongestDimension).toBeDefined();

      const userEmail = `funnel-${Date.now()}@example.com`;
      const leadResult = await recordLeadAndConsents({
        sessionId: session.id,
        sessionToken: token,
        email: userEmail,
        marketingConsent: true,
        locale: "pt",
        market: "BR",
        ip: "189.120.40.10",
        userAgent: "Vitest-Funnel",
      });
      expect(leadResult.leadId).toBeDefined();

      const orderResult = await createOrder({
        sessionId: session.id,
        sessionToken: token,
        productCode: "BRAINRANK",
        customerEmail: userEmail,
        market: "BR",
        locale: "pt",
      });
      expect(orderResult.order.id).toBeDefined();

      const webhookEventId = `evt_order_${Date.now()}`;
      const webhookPayload = {
        id: webhookEventId,
        type: "checkout.session.completed",
        data: {
          object: {
            client_reference_id: orderResult.order.id,
            metadata: { order_number: orderResult.order.orderNumber },
            amount_total: 1290,
            currency: "brl",
          },
        },
      };
      await handleWebhook("stripe", {
        payload: webhookPayload,
        headers: {},
      });

      const updatedOrder = await secretSupabase
        .from("orders")
        .select("status")
        .eq("id", orderResult.order.id)
        .single();
      expect(updatedOrder.data?.status).toBe("FULFILLED");

      const paidResult = await getProtectedResult({
        sessionId: session.id,
        sessionToken: token,
        locale: "pt",
        market: "BR",
      });
      expect(paidResult.accessLevel).toBe("PREMIUM_UNLOCKED");
      expect(paidResult.premiumReport).toBeDefined();

      if (leadResult.unsubscribeToken) {
        const unsubResult = await unsubscribeByToken(leadResult.unsubscribeToken);
        expect(unsubResult.success).toBe(true);
      }
    });
  });

  describe("3. Internationalization (i18n) & Catalog Completeness", () => {
    it("verifies all 7 quizzes exist and are resolvable with questions", async () => {
      const requiredQuizzes = [
        "brainrank",
        "personality-map",
        "careerfit",
        "moneydna",
        "focusstyle",
        "decisiondna",
        "coupledna",
      ];

      for (const slug of requiredQuizzes) {
        const quiz = await getPublicQuiz(slug, "pt");
        expect(quiz).not.toBeNull();
        expect(quiz?.slug).toBe(slug);
        expect(quiz?.questions.length).toBeGreaterThan(0);
        expect(quiz?.questions[0]?.prompt).toBeTruthy();
      }
    });
  });
});
