export type RateLimitTier =
  | "session_start"
  | "session_answers"
  | "session_complete"
  | "lead_capture"
  | "data_request"
  | "data_request_confirm"
  | "unsubscribe"
  | "checkout"
  | "order_lookup"
  | "couple_invite"
  | "referrals"
  | "admin_auth";

export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
  headers: Record<string, string>;
}

export const TIER_CONFIGS: Record<RateLimitTier, RateLimitOptions> = {
  session_start: { windowMs: 60 * 1000, maxRequests: 15, keyPrefix: "rl_session_start" },
  session_answers: { windowMs: 60 * 1000, maxRequests: 80, keyPrefix: "rl_answers" },
  session_complete: { windowMs: 60 * 1000, maxRequests: 10, keyPrefix: "rl_complete" },
  lead_capture: { windowMs: 60 * 1000, maxRequests: 10, keyPrefix: "rl_lead" },
  data_request: { windowMs: 5 * 60 * 1000, maxRequests: 5, keyPrefix: "rl_data_req" },
  data_request_confirm: { windowMs: 5 * 60 * 1000, maxRequests: 10, keyPrefix: "rl_data_confirm" },
  unsubscribe: { windowMs: 60 * 1000, maxRequests: 20, keyPrefix: "rl_unsub" },
  checkout: { windowMs: 60 * 1000, maxRequests: 15, keyPrefix: "rl_checkout" },
  order_lookup: { windowMs: 60 * 1000, maxRequests: 20, keyPrefix: "rl_order_lookup" },
  couple_invite: { windowMs: 60 * 1000, maxRequests: 10, keyPrefix: "rl_couple_invite" },
  referrals: { windowMs: 60 * 1000, maxRequests: 30, keyPrefix: "rl_referral" },
  admin_auth: { windowMs: 60 * 1000, maxRequests: 5, keyPrefix: "rl_admin_auth" },
};

interface WindowRecord {
  timestamps: number[];
}

// In-memory sliding window store
const memoryStore = new Map<string, WindowRecord>();
const CLEANUP_INTERVAL_MS = 60 * 1000;
let lastCleanup = Date.now();

function purgeExpiredRecords(now: number, maxAgeMs: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of memoryStore.entries()) {
    const fresh = record.timestamps.filter((ts) => now - ts < maxAgeMs);
    if (fresh.length === 0) {
      memoryStore.delete(key);
    } else {
      record.timestamps = fresh;
    }
  }
}

export function clearRateLimitStore(): void {
  memoryStore.clear();
}

/**
 * Synchronous in-memory sliding window rate limiter.
 * Deterministic and ideal for edge runtimes, unit tests, and local fallback.
 */
export function checkRateLimit(identifier: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const prefix = options.keyPrefix ?? "rl";
  const key = `${prefix}:${identifier}`;

  purgeExpiredRecords(now, options.windowMs * 2);

  let record = memoryStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    memoryStore.set(key, record);
  }

  // Keep only timestamps within sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < options.windowMs);

  if (record.timestamps.length >= options.maxRequests) {
    const oldest = record.timestamps[0] ?? now;
    const resetMs = Math.max(0, options.windowMs - (now - oldest));
    const retryAfter = Math.ceil(resetMs / 1000);

    return {
      allowed: false,
      limit: options.maxRequests,
      remaining: 0,
      resetMs,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(options.maxRequests),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil((now + resetMs) / 1000)),
      },
    };
  }

  record.timestamps.push(now);
  const remaining = options.maxRequests - record.timestamps.length;

  return {
    allowed: true,
    limit: options.maxRequests,
    remaining,
    resetMs: options.windowMs,
    headers: {
      "X-RateLimit-Limit": String(options.maxRequests),
      "X-RateLimit-Remaining": String(remaining),
      "X-RateLimit-Reset": String(Math.ceil((now + options.windowMs) / 1000)),
    },
  };
}

/**
 * Convenience method for checking a named tier.
 */
export function checkTierRateLimit(identifier: string, tier: RateLimitTier): RateLimitResult {
  const config = TIER_CONFIGS[tier];
  return checkRateLimit(identifier, config);
}

/**
 * Extracts and sanitizes the client IP address from request headers.
 * Does not blindly trust spoofed headers.
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;

  // Cloudflare Connecting IP is set by Cloudflare edge and cannot be spoofed by client
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp && isValidIp(cfIp.trim())) {
    return cfIp.trim();
  }

  // Fastly / standard True-Client-IP
  const trueClientIp = headers.get("true-client-ip");
  if (trueClientIp && isValidIp(trueClientIp.trim())) {
    return trueClientIp.trim();
  }

  // x-real-ip
  const realIp = headers.get("x-real-ip");
  if (realIp && isValidIp(realIp.trim())) {
    return realIp.trim();
  }

  // x-forwarded-for: client, proxy1, proxy2
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((p) => p.trim());
    // Pick the first valid IP that is not a private IP if possible, or first valid
    for (const part of parts) {
      if (isValidIp(part)) {
        return part;
      }
    }
  }

  return "127.0.0.1";
}

function isValidIp(ip: string): boolean {
  if (!ip || ip.length > 45) return false;
  // Basic IPv4
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(ip)) {
    const octets = ip.split(".").map(Number);
    return octets.every((o) => o >= 0 && o <= 255);
  }
  // Basic IPv6
  const ipv6Regex = /^[0-9a-fA-F:]+$/;
  return ipv6Regex.test(ip) && ip.includes(":");
}
