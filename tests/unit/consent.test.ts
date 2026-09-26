import { describe, it, expect } from "vitest";
import {
  normalizeEmail,
  maskEmail,
  hashIp,
  hashToken,
  generateSecureToken,
} from "@/features/privacy/consent-service";

describe("Privacy & Consent Service — Unit Tests", () => {
  it("normalizes emails by trimming and lowercasing", () => {
    expect(normalizeEmail("  User.Test@Example.COM  ")).toBe("user.test@example.com");
    expect(normalizeEmail("ana@Meqyro.com")).toBe("ana@meqyro.com");
  });

  it("masks email for logging and user-safe displays", () => {
    expect(maskEmail("john.doe@example.com")).toBe("j***e@example.com");
    expect(maskEmail("ab@test.com")).toBe("a***@test.com");
    expect(maskEmail("invalid-email")).toBe("***@***");
  });

  it("hashes IP addresses with salt for audit proof without retaining raw IP", () => {
    const hash1 = hashIp("192.168.1.1");
    const hash2 = hashIp("192.168.1.1");
    const hash3 = hashIp("10.0.0.1");

    expect(hash1).toBeDefined();
    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
    expect(hashIp(undefined)).toBeNull();
  });

  it("generates cryptographic tokens and produces consistent SHA-256 hashes", () => {
    const token = generateSecureToken();
    expect(token.length).toBeGreaterThanOrEqual(32);

    const hashA = hashToken(token);
    const hashB = hashToken(token);
    expect(hashA).toBe(hashB);
    expect(hashA.length).toBe(64); // SHA-256 hex
  });
});
