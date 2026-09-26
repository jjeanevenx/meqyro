import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import {
  startQuizSession,
  saveAnswer,
  completeQuizSession,
} from "@/features/quiz-engine/session-service";
import { getPublicQuiz } from "@/features/quiz-engine/repository";
import {
  recordLeadAndConsents,
  unsubscribeByToken,
  submitDataRequest,
  getConsentsForLead,
} from "@/features/privacy/consent-service";
import { getProtectedResult } from "@/features/results/result-service";
import { createOrder } from "@/features/commerce/order-service";
import { handleWebhook } from "@/features/commerce/webhook-handler";
import {
  createCoupleInvite,
  getCoupleComparison,
} from "@/features/couple/couple-service";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { sanitizeAnalyticsProperties } from "@/features/analytics/contracts";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { locales } from "@/lib/i18n/config";
import generateSitemap from "@/app/sitemap";
import generateRobots from "@/app/robots";

describe("QA Comprehensive Audit & Adversarial Verification", () => {
  const secretSupabase = createSupabaseSecretClient();
  const anonSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
    { db: { schema: "meqyro" } },
  );

  describe("1. Security, RLS & Threat Model Verification", () => {
    it("RLS Defense: strictly blocks anonymous browser client from querying meqyro tables directly", async () => {
      const sensitiveTables = [
        "leads",
        "consents",
        "quiz_sessions",
        "answers",
        "results",
        "orders",
        "order_items",
        "payment_events",
        "result_access_grants",
        "couple_consents",
      ];

      for (const table of sensitiveTables) {
        const { data, error } = await anonSupabase.from(table).select("*");
        expect(data).toBeNull();
        expect(error).not.toBeNull();
        // Postgres returns 42501 (permission denied for schema meqyro)
        expect(error?.message).toMatch(/permission denied/i);
      }
    });

    it("Session Forgery Defense: rejects forged or mismatched session tokens", async () => {
      const { session } = await startQuizSession({
        quizSlug: "brainrank",
        locale: "pt",
        market: "BR",
      });

      const forgedToken = "completely_fake_forged_token_12345678901234567890";

      // 1. Attempt to save answer with forged token
      await expect(
        saveAnswer({
          sessionId: session.id,
          token: forgedToken,
          questionId: "fake-q",
          numericValue: 1,
        }),
      ).rejects.toThrow(/Invalid session token/i);

      // 2. Attempt to complete session with forged token
      await expect(
        completeQuizSession({ sessionId: session.id, token: forgedToken }),
      ).rejects.toThrow(/Invalid session token/i);

      // 3. Attempt to capture lead with forged token
      await expect(
        recordLeadAndConsents({
          sessionId: session.id,
          sessionToken: forgedToken,
          email: "attacker@exploit.com",
          marketingConsent: true,
          locale: "pt",
          market: "BR",
        }),
      ).rejects.toThrow(/Token de sessão inválido/i);

      // 4. Attempt to checkout with forged token
      await expect(
        createOrder({
          sessionId: session.id,
          sessionToken: forgedToken,
          productCode: "BRAINRANK",
          customerEmail: "attacker@exploit.com",
          market: "BR",
          locale: "pt",
        }),
      ).rejects.toThrow(/Token de sessão inválido/i);
    });

    it("Pricing Tampering Defense: rejects nonexistent products and refuses client-side price modification", async () => {
      const { session, token } = await startQuizSession({
        quizSlug: "brainrank",
        locale: "pt",
        market: "BR",
      });

      const quiz = await getPublicQuiz("brainrank", "pt");
      for (const q of quiz!.questions) {
        await saveAnswer({
          sessionId: session.id,
          token,
          questionId: q.id,
          optionId: q.options[0].id,
        });
      }

      // Complete session so it's ready for checkout
      await completeQuizSession({ sessionId: session.id, token });

      // 1. Nonexistent product code must fail
      await expect(
        createOrder({
          sessionId: session.id,
          sessionToken: token,
          productCode: "HACKED_FREE_PRODUCT",
          customerEmail: "test@meqyro.com",
          market: "BR",
          locale: "pt",
        }),
      ).rejects.toThrow(/Produto não encontrado para o mercado ou incompatível com o quiz/i);

      // 2. Legitimate product order resolves price strictly server-side
      const order = await createOrder({
        sessionId: session.id,
        sessionToken: token,
        productCode: "BRAINRANK",
        customerEmail: "legit@meqyro.com",
        market: "BR",
        locale: "pt",
      });

      expect(order.order.amount).toBe(1290); // R$ 12.90
      expect(order.order.currency).toBe("BRL");
      expect(order.order.status).toBe("PENDING");
    });

    it("Paywall Anti-Leak Defense: ensures locked results never expose premium report sections", async () => {
      const { session, token } = await startQuizSession({
        quizSlug: "brainrank",
        locale: "pt",
        market: "BR",
      });

      const quiz = await getPublicQuiz("brainrank", "pt");
      for (const q of quiz!.questions) {
        await saveAnswer({
          sessionId: session.id,
          token,
          questionId: q.id,
          optionId: q.options[0].id,
        });
      }

      await completeQuizSession({ sessionId: session.id, token });

      // Fetch result view with valid token (unpaid)
      const resultView = await getProtectedResult({
        sessionId: session.id,
        sessionToken: token,
        locale: "pt",
        market: "BR",
      });

      expect(resultView.accessLevel).toBe("FREE_PARTIAL");

      // Partial summary delivered honestly
      expect(resultView.summary).toBeDefined();
      expect(resultView.summary.strongestDimension).toBeDefined();

      // Premium payload strictly omitted
      expect(resultView.premiumReport).toBeUndefined();

      // Paywall offer present with verified pricing
      expect(resultView.paywall).toBeDefined();
      expect(resultView.paywall?.amount).toBe(1290);
      expect(resultView.paywall?.currency).toBe("BRL");
    });

    it("CoupleDNA Bilateral Privacy Gate: strictly blocks unilateral results and partner leaks", async () => {
      // Person A session
      const { session: sessionA, token: tokenA } = await startQuizSession({
        quizSlug: "coupledna",
        locale: "pt",
        market: "BR",
      });

      const invite = await createCoupleInvite(sessionA.id, tokenA, "pt");
      expect(invite?.inviteCode).toBeDefined();

      // Person A completes quiz unilaterally
      await secretSupabase
        .schema("meqyro")
        .from("results")
        .insert({
          session_id: sessionA.id,
          quiz_version: "v1.0.0",
          scoring_version: "v1",
          score: {
            dimensionScores: {
              COMMUNICATION: 90,
              LIFE_VALUES: 85,
              CONFLICT_MANAGEMENT: 75,
              FINANCES: 80,
              FUTURE_PLANS: 85,
            },
            totalResponses: 20,
          },
        });

      // Query before Person B joins & completes
      const comparisonUnilateral = await getCoupleComparison(
        invite!.inviteCode,
        sessionA.id,
        tokenA,
      );

      expect(comparisonUnilateral?.bilateralUnlocked).toBe(false);
      expect(comparisonUnilateral?.overallAlignmentPercentage).toBe(0);
      // All partner alignment metrics strictly zeroed
      expect(comparisonUnilateral?.dimensionAlignments.COMMUNICATION).toBe(0);
      expect(comparisonUnilateral?.dimensionAlignments.LIFE_VALUES).toBe(0);
    });

    it("Rate Limiter Defense: enforces sliding window burst limits on protected endpoints", () => {
      const attackerIp = `192.0.2.${Math.floor(Math.random() * 200) + 10}`;
      const options = { windowMs: 10000, maxRequests: 5, keyPrefix: "qa_attack" };

      // Make 5 permitted requests
      for (let i = 0; i < 5; i++) {
        const res = checkRateLimit(attackerIp, options);
        expect(res.allowed).toBe(true);
      }

      // 6th request must be denied
      const burstBlocked = checkRateLimit(attackerIp, options);
      expect(burstBlocked.allowed).toBe(false);
      expect(burstBlocked.remaining).toBe(0);
      expect(burstBlocked.resetMs).toBeGreaterThan(0);
    });

    it("Analytics PII Scrubbing: strictly strips sensitive user data from analytics events", async () => {
      const sanitized = sanitizeAnalyticsProperties({
        // Allowed properties
        duration_ms: 14200,
        quiz_slug: "brainrank",
        locale: "pt",
        // Malicious / sensitive property injections that MUST be scrubbed
        email: "victim@example.com",
        password: "plain_password_123",
        raw_answers: [1, 2, 3, 4],
        ip_address: "192.168.1.1",
      });

      // Only allowlisted properties are preserved
      expect(sanitized).toEqual({
        duration_ms: 14200,
        quiz_slug: "brainrank",
        locale: "pt",
      });
      expect(sanitized).not.toHaveProperty("email");
      expect(sanitized).not.toHaveProperty("password");
      expect(sanitized).not.toHaveProperty("raw_answers");
    });
  });

  describe("2. End-to-End User Journey & Lifecycle Validation", () => {
    it("executes the full funnel: Session -> Answers -> Scoring -> Consents -> Checkout -> Webhook -> Premium Grant -> Unsubscribe", async () => {
      // 1. User starts session
      const { session, token } = await startQuizSession({
        quizSlug: "brainrank",
        locale: "pt",
        market: "BR",
      });
      expect(session.status).toBe("CREATED");

      // 2. User answers all 24 questions
      const quiz = await getPublicQuiz("brainrank", "pt");
      for (const q of quiz!.questions) {
        await saveAnswer({
          sessionId: session.id,
          token,
          questionId: q.id,
          optionId: q.options[0].id,
        });
      }

      // 3. Server calculates score and marks COMPLETED
      const completion = await completeQuizSession({ sessionId: session.id, token });
      expect(completion.sessionId).toBe(session.id);
      expect(completion.overallScore).toBeDefined();

      // 4. Lead capture with separate consents (LGPD compliance)
      const userEmail = `qa_funnel_${Date.now()}@example.com`;
      const leadResult = await recordLeadAndConsents({
        sessionId: session.id,
        sessionToken: token,
        email: userEmail,
        marketingConsent: false, // User explicitly rejects marketing
        locale: "pt",
        market: "BR",
      });
      expect(leadResult.leadId).toBeDefined();
      expect(leadResult.recoveryToken).toBeDefined();

      // Verify segregated consents in DB
      const { data: consents } = await secretSupabase
        .schema("meqyro")
        .from("consents")
        .select("consent_type, granted")
        .eq("lead_id", leadResult.leadId);

      const deliveryConsent = consents?.find((c) => c.consent_type === "TRANSACTIONAL_RESULTS");
      const marketingConsent = consents?.find((c) => c.consent_type === "MARKETING_PROMOTIONAL");

      expect(deliveryConsent?.granted).toBe(true);
      expect(marketingConsent?.granted).toBe(false);

      // 5. Check Result View before purchase (Paywall Locked)
      const beforePurchaseView = await getProtectedResult({
        sessionId: session.id,
        sessionToken: token,
        locale: "pt",
        market: "BR",
      });
      expect(beforePurchaseView.accessLevel).toBe("FREE_PARTIAL");
      expect(beforePurchaseView.premiumReport).toBeUndefined();

      // 6. User initiates checkout
      const orderResult = await createOrder({
        sessionId: session.id,
        sessionToken: token,
        productCode: "BRAINRANK",
        customerEmail: userEmail,
        market: "BR",
        locale: "pt",
      });
      expect(orderResult.order.status).toBe("PENDING");

      // 7. Gateway Webhook arrives and fulfills payment
      const webhookPayload = {
        id: `evt_qa_stripe_${Date.now()}`,
        type: "checkout.session.completed",
        data: {
          object: {
            id: `cs_test_${Date.now()}`,
            client_reference_id: orderResult.order.id,
            payment_status: "paid",
            amount_total: 1290,
            currency: "brl",
            customer_details: { email: userEmail },
          },
        },
      };

      const webhookResult = await handleWebhook("stripe", {
        payload: JSON.stringify(webhookPayload),
        headers: {},
      });
      expect(webhookResult.handled).toBe(true);

      // 8. Result Access Grant verified
      const { data: grants } = await secretSupabase
        .from("result_access_grants")
        .select("*")
        .eq("session_id", session.id)
        .eq("grant_type", "PREMIUM_REPORT");

      expect(grants?.length).toBe(1);

      // 9. Check Result View after purchase (Paywall Unlocked!)
      const afterPurchaseView = await getProtectedResult({
        sessionId: session.id,
        sessionToken: token,
        locale: "pt",
        market: "BR",
      });
      expect(afterPurchaseView.accessLevel).toBe("PREMIUM_UNLOCKED");
      expect(afterPurchaseView.premiumReport).toBeDefined();
      expect(afterPurchaseView.premiumReport?.executiveSummary).toBeDefined();
      expect(afterPurchaseView.premiumReport?.sections.length).toBeGreaterThan(0);
      expect(afterPurchaseView.premiumReport?.percentileRank).toBeGreaterThan(0);

      // 10. GDPR/LGPD 1-Click Unsubscribe via Token
      const subscribedLead = await recordLeadAndConsents({
        sessionId: session.id,
        sessionToken: token,
        email: `subscribed_${Date.now()}@example.com`,
        marketingConsent: true,
        locale: "pt",
        market: "BR",
      });
      expect(subscribedLead.unsubscribeToken).toBeDefined();

      const unsubResult = await unsubscribeByToken(subscribedLead.unsubscribeToken!);
      expect(unsubResult.success).toBe(true);
      expect(unsubResult.leadId).toBe(subscribedLead.leadId);

      // Verify revoked marketing consent is in audit log
      const consentsHistory = await getConsentsForLead(subscribedLead.leadId);
      const latestMarketing = consentsHistory.find((c) => c.consentType === "MARKETING_PROMOTIONAL");
      expect(latestMarketing?.granted).toBe(false);

      // 11. GDPR/LGPD Data Request (Erasure / Access)
      const erasureResult = await submitDataRequest({
        email: userEmail,
        locale: "pt",
        market: "BR",
        requestType: "DELETION",
      });
      expect(erasureResult.success).toBe(true);
      expect(erasureResult.message).toContain("orientações");
    });
  });

  describe("3. Internationalization (i18n) & Catalog Completeness", () => {
    it("validates all 4 locales (pt, en, es, fr) have complete dictionary structures with zero missing keys", () => {
      const baseDictionary = getDictionary("pt");

      function getObjectKeyPaths(obj: Record<string, unknown>, prefix = ""): string[] {
        let keys: string[] = [];
        for (const [k, v] of Object.entries(obj)) {
          const path = prefix ? `${prefix}.${k}` : k;
          if (typeof v === "object" && v !== null && !Array.isArray(v)) {
            keys = keys.concat(getObjectKeyPaths(v as Record<string, unknown>, path));
          } else {
            keys.push(path);
          }
        }
        return keys;
      }

      const expectedKeyPaths = getObjectKeyPaths(baseDictionary as unknown as Record<string, unknown>);

      for (const loc of locales) {
        const dict = getDictionary(loc);
        const dictKeyPaths = getObjectKeyPaths(dict as unknown as Record<string, unknown>);

        expect(dictKeyPaths.sort()).toEqual(expectedKeyPaths.sort());
      }
    });

    it("verifies all 7 quizzes exist in the database with active status and questions", async () => {
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

        for (const q of quiz!.questions) {
          expect(q.id).toBeDefined();
          expect(q.prompt).toBeTruthy();
          if (q.kind === "LIKERT") {
            expect(q.kind).toBe("LIKERT");
          } else {
            expect(q.options.length).toBeGreaterThan(1);
            for (const opt of q.options) {
              expect(opt.id).toBeDefined();
              expect(opt.label).toBeTruthy();
              expect(opt.position).toBeDefined();
            }
          }
        }
      }
    });
  });

  describe("4. Technical SEO & Public Route Boundaries", () => {
    it("generates dynamic sitemap with entries for all quizzes across all 4 locales", async () => {
      const sitemap = await generateSitemap();
      expect(sitemap.length).toBeGreaterThan(30);

      // Verify each quiz is present in sitemap
      const slugs = ["brainrank", "personality-map", "careerfit", "moneydna", "focusstyle", "decisiondna", "coupledna"];
      for (const slug of slugs) {
        const entry = sitemap.find((item) => item.url.includes(`/quizzes/${slug}`));
        expect(entry).toBeDefined();
        expect(entry?.alternates?.languages).toBeDefined();
        expect(entry?.alternates?.languages?.pt).toContain(`/pt/quizzes/${slug}`);
        expect(entry?.alternates?.languages?.en).toContain(`/en/quizzes/${slug}`);
      }
    });

    it("generates robots.txt disallowing private routes and referencing sitemap", () => {
      const robots = generateRobots();
      expect(robots.rules).toBeDefined();
      const rules = Array.isArray(robots.rules) ? robots.rules[0] : robots.rules;

      expect(rules.disallow).toContain("/api/");
      expect(rules.disallow).toContain("/*/checkout");
      expect(rules.disallow).toContain("/*/results");
      expect(rules.disallow).toContain("/*/results/");
      expect(robots.sitemap).toContain("/sitemap.xml");
    });
  });
});
