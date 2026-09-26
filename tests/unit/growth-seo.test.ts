import { describe, it, expect } from "vitest";
import { sanitizeAnalyticsProperties } from "@/features/analytics/contracts";
import { recordFunnelEvent } from "@/features/analytics/analytics-service";
import { buildPageMetadata } from "@/features/seo/metadata-builder";
import { generateQuizJsonLd, generateOrganizationJsonLd } from "@/features/seo/json-ld";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import {
  createReferralLink,
  recordReferralClick,
  recordReferralConversion,
} from "@/features/referrals/referral-service";
import {
  getExperimentBucket,
  resolveExperimentVariant,
} from "@/features/experiments/experiment-service";
import { isFeatureEnabled } from "@/features/experiments/feature-flags";
import { startQuizSession } from "@/features/quiz-engine/session-service";
import { fulfillOrder } from "@/features/commerce/fulfillment-service";
import { createSupabaseSecretClient } from "@/lib/supabase/server";

describe("Phase 5 — Growth, SEO, Analytics & Experiments", () => {
  describe("Funnel Analytics & Allowlist Sanitization", () => {
    it("sanitizes properties strictly and strips PII, passwords and raw answers", () => {
      const rawProps = {
        quiz_slug: "brainrank",
        locale: "pt",
        market: "BR",
        position: 5,
        email: "victim@example.com",
        password: "secretpassword123",
        answers: { q1: "A", q2: "B" },
        user_token: "tok_secret_999",
        amount: 1290,
        currency: "BRL",
        utm_source: "google",
      };

      const sanitized = sanitizeAnalyticsProperties(rawProps);

      // Allowed keys
      expect(sanitized.quiz_slug).toBe("brainrank");
      expect(sanitized.locale).toBe("pt");
      expect(sanitized.market).toBe("BR");
      expect(sanitized.position).toBe(5);
      expect(sanitized.amount).toBe(1290);
      expect(sanitized.currency).toBe("BRL");
      expect(sanitized.utm_source).toBe("google");

      // Strictly stripped sensitive/disallowed keys
      expect(sanitized).not.toHaveProperty("email");
      expect(sanitized).not.toHaveProperty("password");
      expect(sanitized).not.toHaveProperty("answers");
      expect(sanitized).not.toHaveProperty("user_token");
    });

    it("records valid funnel event in postgres", async () => {
      const recorded = await recordFunnelEvent({
        eventName: "landing_viewed",
        quizSlug: "brainrank",
        locale: "pt",
        market: "BR",
        properties: {
          utm_source: "direct",
        },
      });

      expect(recorded).not.toBeNull();
      expect(recorded?.id).toBeDefined();
    });
  });

  describe("SEO, Metadata & JSON-LD Validation", () => {
    it("builds localized metadata with canonical, 4 languages hreflang and x-default", () => {
      const meta = buildPageMetadata({
        locale: "pt",
        path: "/quizzes/brainrank",
        title: "BrainRank Test",
        description: "BrainRank description",
      });

      expect(meta.title).toBe("BrainRank Test");
      expect(meta.alternates?.canonical).toContain("/pt/quizzes/brainrank");

      const languages = meta.alternates?.languages as Record<string, string>;
      expect(languages.pt).toContain("/pt/quizzes/brainrank");
      expect(languages.en).toContain("/en/quizzes/brainrank");
      expect(languages.es).toContain("/es/quizzes/brainrank");
      expect(languages.fr).toContain("/fr/quizzes/brainrank");
      expect(languages["x-default"]).toContain("/en/quizzes/brainrank");
    });

    it("generates Schema.org compliant Quiz and Organization JSON-LD", () => {
      const quizLd = generateQuizJsonLd({
        name: "BrainRank",
        description: "Cognitive assessment",
        quizSlug: "brainrank",
        locale: "pt",
      });

      expect(quizLd["@type"]).toBe("Quiz");
      expect(quizLd.name).toBe("BrainRank");
      expect(quizLd.provider?.name).toBe("Meqyro");

      const orgLd = generateOrganizationJsonLd();
      expect(orgLd["@type"]).toBe("Organization");
      expect(orgLd.name).toBe("Meqyro");
    });

    it("generates dynamic sitemap with all public pages and alternate links", () => {
      const entries = sitemap();
      expect(entries.length).toBeGreaterThanOrEqual(20);

      const homeEntry = entries.find((e) => e.url.endsWith("/pt"));
      expect(homeEntry).toBeDefined();
      expect(homeEntry?.alternates?.languages).toHaveProperty("x-default");
    });

    it("generates defensive robots.txt blocking play, checkout and api routes", () => {
      const config = robots();
      const rules = Array.isArray(config.rules) ? config.rules[0] : config.rules;

      const disallowed = rules.disallow as string[];
      expect(disallowed).toContain("/*/quizzes/*/play");
      expect(disallowed).toContain("/*/checkout");
      expect(disallowed).toContain("/api/");
    });
  });

  describe("Safe Referrals & Sharing", () => {
    it("creates unique referral link for active session and increments click/conversion", async () => {
      const { session, token } = await startQuizSession({
        quizSlug: "brainrank",
        locale: "pt",
        market: "BR",
      });

      const shareData = await createReferralLink({
        sessionId: session.id,
        sessionToken: token,
        quizSlug: "brainrank",
        locale: "pt",
      });

      expect(shareData).not.toBeNull();
      expect(shareData?.referralCode).toMatch(/^MQ[A-F0-9]{8}$/);
      expect(shareData?.shareUrl).toContain(`?ref=${shareData?.referralCode}`);

      // Does not leak user answers, token or email
      expect(shareData?.shareText).not.toContain(token);
      expect(shareData?.shareText).not.toContain(session.id);

      // Click increment
      const clickSuccess = await recordReferralClick(shareData!.referralCode);
      expect(clickSuccess).toBe(true);

      // Conversion increment
      const conversionSuccess = await recordReferralConversion(shareData!.referralCode);
      expect(conversionSuccess).toBe(true);
    });
  });

  describe("Deterministic Experiments & Feature Flags", () => {
    it("assigns buckets deterministically without changing on multiple evaluations", () => {
      const experimentKey = "checkout_cta_v1";
      const subjectId = "session_user_abc_123";

      const bucket1 = getExperimentBucket(experimentKey, subjectId);
      const bucket2 = getExperimentBucket(experimentKey, subjectId);

      expect(bucket1).toBe(bucket2);
      expect(bucket1).toBeGreaterThanOrEqual(0);
      expect(bucket1).toBeLessThan(100);
    });

    it("resolves variant based on bucket distribution", () => {
      const experiment = {
        key: "pricing_test",
        active: true,
        variants: [
          { id: "control", weight: 50 },
          { id: "treatment", weight: 50 },
        ],
      };

      const resolved = resolveExperimentVariant(experiment, "test_subject_1");
      expect(["control", "treatment"]).toContain(resolved.variantId);
      expect(resolved.experimentKey).toBe("pricing_test");
    });

    it("evaluates feature flags with market context", () => {
      expect(isFeatureEnabled("enable_referrals")).toBe(true);
      expect(isFeatureEnabled("enable_infinitepay_brazil", { market: "BR" })).toBe(true);
      expect(isFeatureEnabled("enable_infinitepay_brazil", { market: "US" })).toBe(false);
    });
  });

  describe("Commerce Bundles & Cross-Sell Fulfillment", () => {
    it("expands bundle product to provision multiple premium grants", async () => {
      const supabase = createSupabaseSecretClient();

      const { session } = await startQuizSession({
        quizSlug: "brainrank",
        locale: "pt",
        market: "BR",
      });

      // Create bundle order
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          session_id: session.id,
          order_number: `MQ-TEST-BUNDLE-${Date.now()}`,
          status: "PAID",
          amount: 2990,
          currency: "BRL",
          market: "BR",
          payment_provider: "infinitepay",
          customer_email: "bundle-tester@meqyro.com",
        })
        .select("id")
        .single();

      expect(orderErr).toBeNull();

      // Insert bundle item
      await supabase.from("order_items").insert({
        order_id: order!.id,
        product_code: "PREMIUM_BUNDLE",
        amount: 2990,
      });

      // Fulfill bundle order
      const fulfillResult = await fulfillOrder(order!.id, "test_bundle_evt");
      expect(fulfillResult.success).toBe(true);

      // Verify both grants exist
      const { data: grants } = await supabase
        .from("result_access_grants")
        .select("product_code")
        .eq("session_id", session.id);

      const grantedCodes = grants?.map((g) => g.product_code);
      expect(grantedCodes).toContain("BRAINRANK");
      expect(grantedCodes).toContain("PERSONALITY_MAP");
    });
  });
});
