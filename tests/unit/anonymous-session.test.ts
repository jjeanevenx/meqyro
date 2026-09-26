import { describe, expect, it } from "vitest";
import {
  createAnonymousSessionToken,
  hashAnonymousSessionToken,
  matchesAnonymousSessionToken,
} from "@/lib/security/anonymous-session";

describe("anonymous session credentials", () => {
  it("creates 256-bit opaque tokens and persists only a deterministic hash", () => {
    const token = createAnonymousSessionToken();
    const hash = hashAnonymousSessionToken(token);
    expect(Buffer.from(token, "base64url")).toHaveLength(32);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(matchesAnonymousSessionToken(token, hash)).toBe(true);
    expect(matchesAnonymousSessionToken(createAnonymousSessionToken(), hash)).toBe(false);
  });
});
