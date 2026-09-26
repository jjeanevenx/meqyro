export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
}

interface WindowRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, WindowRecord>();

// Periodic cleanup of stale records every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
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

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions,
): { allowed: boolean; limit: number; remaining: number; resetMs: number } {
  const now = Date.now();
  const prefix = options.keyPrefix ?? "rl";
  const key = `${prefix}:${identifier}`;

  purgeExpiredRecords(now, options.windowMs * 2);

  let record = memoryStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    memoryStore.set(key, record);
  }

  // Keep only timestamps within the current sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < options.windowMs);

  if (record.timestamps.length >= options.maxRequests) {
    const oldest = record.timestamps[0] ?? now;
    const resetMs = Math.max(0, options.windowMs - (now - oldest));
    return {
      allowed: false,
      limit: options.maxRequests,
      remaining: 0,
      resetMs,
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    limit: options.maxRequests,
    remaining: options.maxRequests - record.timestamps.length,
    resetMs: options.windowMs,
  };
}

export function getClientIp(request: Request): string {
  const headers = request.headers;
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "127.0.0.1";
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "127.0.0.1";
}
