import type { Locale } from "@/lib/i18n/config";
import type { Market } from "@/lib/market/market-context";

export const FUNNEL_EVENTS = [
  "landing_viewed",
  "quiz_started",
  "question_answered",
  "quiz_completed",
  "lead_captured",
  "checkout_initiated",
  "checkout_completed",
  "checkout_failed",
  "share_link_created",
  "share_link_clicked",
] as const;

export type FunnelEventName = (typeof FUNNEL_EVENTS)[number];

export const ALLOWED_ANALYTICS_PROPERTY_KEYS = new Set([
  "quiz_slug",
  "locale",
  "market",
  "step",
  "position",
  "total_questions",
  "duration_ms",
  "payment_provider",
  "amount",
  "currency",
  "has_promotional_consent",
  "experiment_key",
  "variant_id",
  "referral_code",
  "utm_source",
  "utm_medium",
  "utm_campaign",
]);

export interface AnalyticsEventInput {
  eventName: FunnelEventName;
  sessionId?: string | null;
  quizSlug?: string | null;
  locale?: Locale | null;
  market?: Market | null;
  properties?: Record<string, unknown>;
}

export function sanitizeAnalyticsProperties(
  props?: Record<string, unknown>,
): Record<string, unknown> {
  if (!props || typeof props !== "object") {
    return {};
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    const normalizedKey = key.toLowerCase().trim();
    if (!ALLOWED_ANALYTICS_PROPERTY_KEYS.has(normalizedKey)) {
      continue;
    }
    // Only permit primitive values to prevent complex nested leaks (e.g. nested answer trees or PII objects)
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      // String length clamp
      sanitized[normalizedKey] =
        typeof value === "string" ? value.slice(0, 128) : value;
    }
  }

  return sanitized;
}
