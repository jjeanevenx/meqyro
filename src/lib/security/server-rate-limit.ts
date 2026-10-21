import "server-only";

import { createHmac } from "node:crypto";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { getTokenSecuritySecret } from "@/lib/config/env";
import {
  checkTierRateLimit,
  TIER_CONFIGS,
  type RateLimitResult,
  type RateLimitTier,
} from "./rate-limit";

export async function checkServerRateLimit(
  identifier: string,
  tier: RateLimitTier,
): Promise<RateLimitResult> {
  if (process.env.NODE_ENV !== "production" && process.env.RATE_LIMIT_BACKEND !== "db") {
    return checkTierRateLimit(identifier, tier);
  }
  const config = TIER_CONFIGS[tier];
  const key = createHmac("sha256", getTokenSecuritySecret())
    .update(`${tier}:${identifier}`)
    .digest("hex");
  const { data, error } = await createSupabaseSecretClient().rpc("consume_rate_limit", {
    p_key: key,
    p_window_ms: config.windowMs,
  });
  if (error || !data?.[0]) throw new Error("Rate limit service unavailable");
  const row = data[0] as { count: number; expires_at: string };
  const resetMs = Math.max(0, new Date(row.expires_at).getTime() - Date.now());
  const allowed = row.count <= config.maxRequests;
  return {
    allowed,
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - row.count),
    resetMs,
    headers: {
      "X-RateLimit-Limit": String(config.maxRequests),
      "X-RateLimit-Remaining": String(Math.max(0, config.maxRequests - row.count)),
      "X-RateLimit-Reset": String(Math.ceil(new Date(row.expires_at).getTime() / 1000)),
      ...(!allowed ? { "Retry-After": String(Math.ceil(resetMs / 1000)) } : {}),
    },
  };
}
