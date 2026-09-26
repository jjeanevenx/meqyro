import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { validateAdminAuth } from "@/lib/security/admin-auth";

describe("Admin Authentication Gate (Unit Tests)", () => {
  const originalEnv = { ...process.env };
  const VALID_SECRET = "super-secret-admin-token-32-chars-long";

  beforeEach(() => {
    process.env.ADMIN_API_SECRET = VALID_SECRET;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("fails closed when ADMIN_API_SECRET is not configured or too short", () => {
    delete process.env.ADMIN_API_SECRET;
    const req = new Request("https://meqyro.com/api/admin/metrics", {
      headers: { "x-admin-token": VALID_SECRET },
    });
    const res = validateAdminAuth(req);
    expect(res.authorized).toBe(false);
    expect(res.reason).toBe("SECRET_NOT_CONFIGURED");

    process.env.ADMIN_API_SECRET = "short";
    const resShort = validateAdminAuth(req);
    expect(resShort.authorized).toBe(false);
  });

  it("fails closed when no authorization token is provided", () => {
    const req = new Request("https://meqyro.com/api/admin/metrics");
    const res = validateAdminAuth(req);
    expect(res.authorized).toBe(false);
    expect(res.reason).toBe("MISSING_CREDENTIALS");
  });

  it("fails closed when invalid or mismatched token is provided", () => {
    const reqWrong = new Request("https://meqyro.com/api/admin/metrics", {
      headers: { "x-admin-token": "wrong-secret-token-attempt-12345" },
    });
    const resWrong = validateAdminAuth(reqWrong);
    expect(resWrong.authorized).toBe(false);
    expect(resWrong.reason).toBe("INVALID_CREDENTIALS");

    const reqWrongLength = new Request("https://meqyro.com/api/admin/metrics", {
      headers: { "x-admin-token": "short" },
    });
    const resWrongLength = validateAdminAuth(reqWrongLength);
    expect(resWrongLength.authorized).toBe(false);
    expect(resWrongLength.reason).toBe("INVALID_CREDENTIALS");
  });

  it("authorizes when valid token is passed in x-admin-token header", () => {
    const req = new Request("https://meqyro.com/api/admin/metrics", {
      headers: { "x-admin-token": VALID_SECRET },
    });
    const res = validateAdminAuth(req);
    expect(res.authorized).toBe(true);
  });

  it("authorizes when valid token is passed in Bearer Authorization header", () => {
    const req = new Request("https://meqyro.com/api/admin/metrics", {
      headers: { authorization: `Bearer ${VALID_SECRET}` },
    });
    const res = validateAdminAuth(req);
    expect(res.authorized).toBe(true);
  });

  it("authorizes when valid token is passed in query string", () => {
    const req = new Request(`https://meqyro.com/api/admin/metrics?token=${VALID_SECRET}`);
    const res = validateAdminAuth(req);
    expect(res.authorized).toBe(true);
  });
});
