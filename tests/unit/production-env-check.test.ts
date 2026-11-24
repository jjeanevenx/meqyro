import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const script = fileURLToPath(new URL("../../scripts/check-deployment-env.mjs", import.meta.url));
const production: Record<string, string> = {
  VERCEL_ENV: "production",
  NEXT_PUBLIC_SITE_URL: "https://meqyro.com",
  NEXT_PUBLIC_SUPABASE_URL: "https://fixture.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_fixture",
  SUPABASE_SECRET_KEY: "sb_secret_fixture",
  TOKEN_SECURITY_SECRET: "fixture-security-secret",
  ADMIN_API_SECRET: "fixture-admin-secret",
  CRON_SECRET: "fixture-cron-secret",
  REPORT_DELIVERY_SECRET: "fixture-report-secret-32-characters",
  STRIPE_SECRET_KEY: "sk_live_fixture_only",
  STRIPE_WEBHOOK_SECRET: "whsec_fixture_only",
  SMTP_HOST: "smtp.example.com",
  SMTP_PORT: "465",
  SMTP_USER: "sender@example.com",
  SMTP_PASSWORD: "fixture-mail-password",
  EMAIL_FROM: "Meqyro <sender@example.com>",
};
const run = (env: Record<string, string | undefined>) =>
  spawnSync(process.execPath, [script], { env: { ...env, NODE_ENV: "test" }, encoding: "utf8" });

describe("Production deployment configuration", () => {
  it("fails before building and lists every missing setting without printing secrets", () => {
    const result = run({ VERCEL_ENV: "production", STRIPE_SECRET_KEY: "sk_test_private_fixture" });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("NEXT_PUBLIC_SUPABASE_URL");
    expect(result.stderr).toContain("REPORT_DELIVERY_SECRET");
    expect(result.stderr).toContain("STRIPE_SECRET_KEY");
    expect(result.stderr).not.toContain("sk_test_private_fixture");
  });
  it("accepts a complete production configuration", () => {
    const result = run(production);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("configuration passed");
    expect(result.stdout).not.toContain(production.STRIPE_SECRET_KEY);
  });
  it.each([
    { STRIPE_SECRET_KEY: "sk_test_fixture" },
    { NEXT_PUBLIC_SITE_URL: "http://localhost:3000" },
    { NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_secret_never_public" },
    { SMTP_PORT: "587" },
  ])("rejects invalid production settings %j", (override) => {
    expect(run({ ...production, ...override }).status).toBe(1);
  });
  it("keeps local and preview builds usable with their isolated test environments", () => {
    expect(run({ VERCEL_ENV: "preview", STRIPE_SECRET_KEY: "sk_test_fixture" }).status).toBe(0);
    expect(run({}).status).toBe(0);
  });
});
