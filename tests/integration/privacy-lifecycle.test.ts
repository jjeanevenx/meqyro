import { describe, it, expect } from "vitest";
import { startQuizSession } from "@/features/quiz-engine/session-service";
import {
  recordLeadAndConsents,
  unsubscribeByToken,
  submitDataRequest,
  getConsentsForLead,
} from "@/features/privacy/consent-service";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { isSupabaseAvailable } from "./db-check";

const isOnline = await isSupabaseAvailable();

describe.skipIf(!isOnline)("Privacy & Consent Lifecycle — Integration Tests", () => {
  it("records lead, separate transactional and promotional consents, and handles unsubscribe", async () => {
    // 1. Create anonymous session
    const { session, token } = await startQuizSession({
      quizSlug: "brainrank",
      locale: "pt",
      market: "BR",
    });

    const testEmail = `lead-${Date.now()}@example.com`;

    // 2. Record lead with marketing consent = true
    const leadResult = await recordLeadAndConsents({
      sessionId: session.id,
      sessionToken: token,
      email: testEmail,
      marketingConsent: true,
      locale: "pt",
      market: "BR",
      ip: "127.0.0.1",
      userAgent: "Vitest-Runner",
    });

    expect(leadResult.leadId).toBeDefined();
    expect(leadResult.sessionId).toBe(session.id);
    expect(leadResult.recoveryToken).toBeDefined();
    expect(leadResult.unsubscribeToken).toBeDefined();

    // 3. Inspect audit trail of consents
    const consents = await getConsentsForLead(leadResult.leadId);
    expect(consents.length).toBe(2);

    const transactional = consents.find((c) => c.consentType === "TRANSACTIONAL_RESULTS");
    const marketing = consents.find((c) => c.consentType === "MARKETING_PROMOTIONAL");

    expect(transactional?.granted).toBe(true);
    expect(marketing?.granted).toBe(true);
    expect(marketing?.policyVersion).toBe("2026-09-v1");

    // 4. Verify FREE_PARTIAL result access grant exists
    const supabase = createSupabaseSecretClient();
    const { data: grants } = await supabase
      .from("result_access_grants")
      .select("grant_type, product_code")
      .eq("session_id", session.id);

    expect(grants).toBeDefined();
    expect(grants?.some((g) => g.grant_type === "FREE_PARTIAL")).toBe(true);

    // 5. Test 1-click unsubscribe using unsubscribeToken
    if (leadResult.unsubscribeToken) {
      const unsubResult = await unsubscribeByToken(leadResult.unsubscribeToken);
      expect(unsubResult.success).toBe(true);
      expect(unsubResult.leadId).toBe(leadResult.leadId);

      // Verify that promotional consent was revoked in the audit log
      const updatedConsents = await getConsentsForLead(leadResult.leadId);
      expect(updatedConsents.length).toBe(3); // Append-only record
      expect(updatedConsents[0]?.consentType).toBe("MARKETING_PROMOTIONAL");
      expect(updatedConsents[0]?.granted).toBe(false);
    }
  });

  it("submits data request with anti-enumeration protection", async () => {
    const response = await submitDataRequest({
      email: "user-gdpr@example.com",
      requestType: "EXPORT",
      locale: "pt",
      market: "BR",
    });

    expect(response.success).toBe(true);
    expect(response.message).toContain("Se houver dados associados");

    // Verify record in data_requests table
    const supabase = createSupabaseSecretClient();
    const { data: requests } = await supabase
      .from("data_requests")
      .select("request_type, status, email_normalized")
      .eq("email_normalized", "user-gdpr@example.com");

    expect(requests).toBeDefined();
    expect(requests?.length).toBeGreaterThan(0);
    expect(requests?.[0]?.request_type).toBe("EXPORT");
    expect(requests?.[0]?.status).toBe("PENDING");
  });
});
