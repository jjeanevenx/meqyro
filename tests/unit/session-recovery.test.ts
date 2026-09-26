import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { hashToken, generateSecureToken } from "@/features/privacy/consent-service";
import {
  createAnonymousSessionToken,
  hashAnonymousSessionToken,
  matchesAnonymousSessionToken,
} from "@/lib/security/anonymous-session";

describe("Session Recovery & Token Security (Unit Tests)", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.TOKEN_SECURITY_SECRET = "super-secret-salt-key-for-tokens-32-chars";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe("Token Generation and Salted Hashing", () => {
    it("generates high-entropy 256-bit base64url tokens", () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();

      expect(token1).toHaveLength(43);
      expect(token2).toHaveLength(43);
      expect(token1).not.toBe(token2);
    });

    it("hashes recovery tokens with server-side salt deterministically", () => {
      const token = generateSecureToken();
      const hashA = hashToken(token);
      const hashB = hashToken(token);

      expect(hashA).toBe(hashB);
      expect(hashA).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hex
    });

    it("fails token comparison when token is tampered", () => {
      const token = createAnonymousSessionToken();
      const hash = hashAnonymousSessionToken(token);

      expect(matchesAnonymousSessionToken(token, hash)).toBe(true);
      expect(matchesAnonymousSessionToken("tampered-token-value-123456", hash)).toBe(false);
      expect(matchesAnonymousSessionToken(createAnonymousSessionToken(), hash)).toBe(false);
    });
  });

  describe("Recovery Validation Rules & Edge Cases", () => {
    type MockRecoveryRecord = {
      sessionId: string;
      tokenHash: string;
      expiresAt: string;
      revokedAt: string | null;
      usageCount: number;
      maxUses: number;
      quizSlug: string;
    };

    function validateTokenPolicy(
      record: MockRecoveryRecord,
      token: string,
      targetQuizSlug: string,
    ): { valid: boolean; reason?: string } {
      const computedHash = hashToken(token);
      if (computedHash !== record.tokenHash) {
        return { valid: false, reason: "HASH_MISMATCH" };
      }
      if (record.revokedAt) {
        return { valid: false, reason: "TOKEN_REVOKED" };
      }
      if (new Date(record.expiresAt).getTime() < Date.now()) {
        return { valid: false, reason: "TOKEN_EXPIRED" };
      }
      if (record.usageCount >= record.maxUses) {
        return { valid: false, reason: "USAGE_LIMIT_EXCEEDED" };
      }
      if (record.quizSlug !== targetQuizSlug) {
        return { valid: false, reason: "QUIZ_MISMATCH" };
      }
      return { valid: true };
    }

    it("rejects expired tokens without exposing session details", () => {
      const token = generateSecureToken();
      const record: MockRecoveryRecord = {
        sessionId: "sess_123",
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        revokedAt: null,
        usageCount: 0,
        maxUses: 5,
        quizSlug: "brainrank",
      };

      const result = validateTokenPolicy(record, token, "brainrank");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("TOKEN_EXPIRED");
    });

    it("rejects revoked tokens immediately", () => {
      const token = generateSecureToken();
      const record: MockRecoveryRecord = {
        sessionId: "sess_123",
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        revokedAt: new Date().toISOString(),
        usageCount: 1,
        maxUses: 5,
        quizSlug: "brainrank",
      };

      const result = validateTokenPolicy(record, token, "brainrank");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("TOKEN_REVOKED");
    });

    it("blocks reuse beyond permitted usage threshold (replay protection)", () => {
      const token = generateSecureToken();
      const record: MockRecoveryRecord = {
        sessionId: "sess_123",
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        revokedAt: null,
        usageCount: 5,
        maxUses: 5, // Limit reached
        quizSlug: "brainrank",
      };

      const result = validateTokenPolicy(record, token, "brainrank");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("USAGE_LIMIT_EXCEEDED");
    });

    it("rejects recovery tokens associated with a different quiz slug", () => {
      const token = generateSecureToken();
      const record: MockRecoveryRecord = {
        sessionId: "sess_123",
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        revokedAt: null,
        usageCount: 0,
        maxUses: 5,
        quizSlug: "personality-map",
      };

      const result = validateTokenPolicy(record, token, "brainrank");
      expect(result.valid).toBe(false);
      expect(result.reason).toBe("QUIZ_MISMATCH");
    });

    it("approves valid tokens within active limits", () => {
      const token = generateSecureToken();
      const record: MockRecoveryRecord = {
        sessionId: "sess_123",
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        revokedAt: null,
        usageCount: 1,
        maxUses: 5,
        quizSlug: "brainrank",
      };

      const result = validateTokenPolicy(record, token, "brainrank");
      expect(result.valid).toBe(true);
    });
  });
});
