import { z } from "zod";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Validates and normalizes the public site URL.
 * Never produces trailing slashes or "undefined".
 */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (isProduction ? "https://meqyro.com" : "http://localhost:3000");

  const clean = raw.trim().replace(/\/+$/, "");

  if (isProduction && !clean.startsWith("https://")) {
    throw new Error(`NEXT_PUBLIC_SITE_URL must be HTTPS in production: ${clean}`);
  }

  return clean;
}

/**
 * Returns the dedicated security secret for tokens, IP hashes, and HMACs.
 * In production, this MUST be configured and fail-closed if missing.
 */
export function getTokenSecuritySecret(): string {
  const secret =
    process.env.TOKEN_SECURITY_SECRET ||
    process.env.SECURITY_SECRET ||
    process.env.SUPABASE_SECRET_KEY;

  if (isProduction && (!secret || secret.length < 16)) {
    throw new Error(
      "TOKEN_SECURITY_SECRET is required in production and must be at least 16 characters long.",
    );
  }

  return secret || "meqyro-dev-token-security-secret-key-32chars";
}

/**
 * Returns the administrative API secret.
 * Fail-closed: returns undefined or throws in production if not set.
 */
export function getAdminApiSecret(): string | undefined {
  const secret = process.env.ADMIN_API_SECRET;

  if (isProduction && (!secret || secret.length < 16)) {
    throw new Error(
      "ADMIN_API_SECRET is required in production and must be at least 16 characters long.",
    );
  }

  return secret;
}

/**
 * Returns the operational/cron secret.
 * Fail-closed: returns undefined or throws in production if not set.
 */
export function getCronSecret(): string | undefined {
  const secret = process.env.CRON_SECRET || process.env.OPS_SECRET;

  if (isProduction && (!secret || secret.length < 16)) {
    throw new Error(
      "CRON_SECRET is required in production and must be at least 16 characters long.",
    );
  }

  return secret;
}

/**
 * Client-safe environment schema.
 */
export const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(20),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

/**
 * Server-only environment schema.
 */
export const serverEnvSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().min(20),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_BRAND_ICON_FILE_ID: z.string().startsWith("file_").optional(),
  RESEND_API_KEY: z.string().optional(),
  ADMIN_API_SECRET: z.string().min(16).optional(),
  CRON_SECRET: z.string().min(16).optional(),
  TOKEN_SECURITY_SECRET: z.string().min(16).optional(),
});
