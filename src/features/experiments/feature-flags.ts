import type { Market } from "@/lib/market/market-context";
import type { Locale } from "@/lib/i18n/config";

export interface FlagEvaluationContext {
  market?: Market | string;
  locale?: Locale | string;
}

export type FeatureFlagKey =
  "enable_referrals" | "enable_bundle_checkout" | "enable_stripe_payments";

const DEFAULT_FLAGS: Record<FeatureFlagKey, boolean> = {
  enable_referrals: true,
  enable_bundle_checkout: true,
  enable_stripe_payments: true,
};

export function isFeatureEnabled(flag: FeatureFlagKey, context?: FlagEvaluationContext): boolean {
  void context;
  // Environmental override check (e.g. NEXT_PUBLIC_FLAG_ENABLE_REFERRALS)
  const envKey = `NEXT_PUBLIC_FLAG_${flag.toUpperCase()}`;
  if (process.env[envKey] === "false" || process.env[envKey] === "0") {
    return false;
  }
  if (process.env[envKey] === "true" || process.env[envKey] === "1") {
    return true;
  }

  return DEFAULT_FLAGS[flag] ?? false;
}
