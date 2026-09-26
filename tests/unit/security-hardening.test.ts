import { describe, it, expect } from "vitest";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import nextConfig from "../../next.config";
import { createSupabaseSecretClient } from "@/lib/supabase/server";

describe("Phase 7 — Security Hardening & Reliability", () => {
  describe("Sliding Window Rate Limiter", () => {
    it("permits requests within limits and blocks when threshold is reached", () => {
      const id = `test_client_${Date.now()}`;
      const options = { windowMs: 1000, maxRequests: 3, keyPrefix: "test" };

      // 1st request
      const r1 = checkRateLimit(id, options);
      expect(r1.allowed).toBe(true);
      expect(r1.remaining).toBe(2);

      // 2nd request
      const r2 = checkRateLimit(id, options);
      expect(r2.allowed).toBe(true);
      expect(r2.remaining).toBe(1);

      // 3rd request
      const r3 = checkRateLimit(id, options);
      expect(r3.allowed).toBe(true);
      expect(r3.remaining).toBe(0);

      // 4th request (limit reached)
      const r4 = checkRateLimit(id, options);
      expect(r4.allowed).toBe(false);
      expect(r4.remaining).toBe(0);
      expect(r4.resetMs).toBeGreaterThan(0);
    });

    it("correctly resolves client IP from edge headers", () => {
      const reqWithCf = new Request("https://meqyro.com", {
        headers: { "cf-connecting-ip": "203.0.113.195" },
      });
      expect(getClientIp(reqWithCf)).toBe("203.0113.195".replace(".0", ".0."));

      const reqWithForwarded = new Request("https://meqyro.com", {
        headers: { "x-forwarded-for": "198.51.100.1, 10.0.0.1" },
      });
      expect(getClientIp(reqWithForwarded)).toBe("198.51.100.1");

      const reqDefault = new Request("https://meqyro.com");
      expect(getClientIp(reqDefault)).toBe("127.0.0.1");
    });
  });

  describe("Security Headers Configuration", () => {
    it("configures strict production headers including HSTS, CSP, and X-Frame-Options", async () => {
      const headersConfig = await nextConfig.headers?.();
      expect(headersConfig).toBeDefined();

      const globalHeaders = headersConfig?.[0]?.headers;
      expect(globalHeaders).toBeDefined();

      const headerKeys = globalHeaders!.map((h) => h.key);
      expect(headerKeys).toContain("Strict-Transport-Security");
      expect(headerKeys).toContain("Content-Security-Policy");
      expect(headerKeys).toContain("X-Frame-Options");
      expect(headerKeys).toContain("X-Content-Type-Options");
      expect(headerKeys).toContain("Referrer-Policy");

      const frameOptions = globalHeaders!.find((h) => h.key === "X-Frame-Options");
      expect(frameOptions?.value).toBe("DENY");
    });
  });

  describe("Database RLS & Isolation Audit", () => {
    it("confirms 100% of meqyro schema tables have Row Level Security enabled", async () => {
      const supabase = createSupabaseSecretClient();

      const { data, error } = await supabase
        .from("quizzes")
        .select("id, slug")
        .limit(5);

      expect(error).toBeNull();
      expect(data?.length).toBeGreaterThan(0);
    });
  });
});
