import "server-only";

import { timingSafeEqual } from "node:crypto";
import { getAdminApiSecret } from "@/lib/config/env";

export interface AdminAuthResult {
  authorized: boolean;
  reason?: "SECRET_NOT_CONFIGURED" | "MISSING_CREDENTIALS" | "INVALID_CREDENTIALS";
}

/**
 * Validates administrative authentication in a strict fail-closed manner.
 * Accepts header 'x-admin-token', 'Authorization: Bearer <token>', or cookie 'meqyro_admin_session'.
 */
export function validateAdminAuth(request: Request): AdminAuthResult {
  let adminSecret: string | undefined;
  try {
    adminSecret = getAdminApiSecret();
  } catch {
    return { authorized: false, reason: "SECRET_NOT_CONFIGURED" };
  }

  if (!adminSecret || adminSecret.trim().length === 0) {
    return { authorized: false, reason: "SECRET_NOT_CONFIGURED" };
  }

  // 1. Check x-admin-token header
  let candidateToken = request.headers.get("x-admin-token");

  // 2. Check Authorization Bearer header
  if (!candidateToken) {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      candidateToken = authHeader.slice(7).trim();
    }
  }

  // 3. Check cookie
  if (!candidateToken) {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const match = cookieHeader.match(/meqyro_admin_session=([^;]+)/);
      if (match) {
        candidateToken = decodeURIComponent(match[1]);
      }
    }
  }

  // 4. Check URL search param 'token'
  if (!candidateToken && request.url) {
    try {
      const url = new URL(request.url);
      const queryToken = url.searchParams.get("token");
      if (queryToken) {
        candidateToken = queryToken;
      }
    } catch {
      // Invalid URL string; proceed
    }
  }

  if (!candidateToken) {
    return { authorized: false, reason: "MISSING_CREDENTIALS" };
  }

  // 4. Constant-time comparison
  const candidateBuf = Buffer.from(candidateToken);
  const secretBuf = Buffer.from(adminSecret);

  if (candidateBuf.length !== secretBuf.length || !timingSafeEqual(candidateBuf, secretBuf)) {
    return { authorized: false, reason: "INVALID_CREDENTIALS" };
  }

  return { authorized: true };
}
