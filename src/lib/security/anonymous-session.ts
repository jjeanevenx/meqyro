import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const anonymousSessionCookie = "meqyro_session";
export const anonymousSessionTtlSeconds = 30 * 24 * 60 * 60;

export function createAnonymousSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashAnonymousSessionToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function matchesAnonymousSessionToken(token: string, expectedHash: string) {
  const actual = Buffer.from(hashAnonymousSessionToken(token), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function anonymousSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: anonymousSessionTtlSeconds,
    priority: "high" as const,
  };
}
