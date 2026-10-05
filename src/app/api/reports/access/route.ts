import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { generateSecureToken, hashToken } from "@/features/privacy/consent-service";
import { sendReportAccessEmail } from "@/features/email/email-service";
import { getSiteUrl } from "@/lib/config/env";

const requestSchema = z.object({
  email: z.string().email().max(320),
  locale: z.enum(["pt", "en", "es", "fr"]).default("pt"),
});

export async function POST(request: NextRequest) {
  const limit = checkRateLimit(getClientIp(request), {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
    keyPrefix: "report-access",
  });
  if (!limit.allowed) {
    return NextResponse.json({ accepted: true }, { status: 202 });
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const supabase = createSupabaseSecretClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("session_id")
    .eq("customer_email", email)
    .eq("status", "FULFILLED")
    .order("paid_at", { ascending: false })
    .limit(20);

  const sessionIds = [...new Set((orders ?? []).map((order) => order.session_id))];
  if (sessionIds.length > 0) {
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const reportUrls: string[] = [];
    for (const sessionId of sessionIds) {
      const token = generateSecureToken();
      const { error } = await supabase.from("recovery_tokens").insert({
        session_id: sessionId,
        token_hash: hashToken(token),
        expires_at: expiresAt,
        usage_count: 0,
        max_uses: 10,
      });
      if (!error) reportUrls.push(`${getSiteUrl()}/${parsed.data.locale}/results/${token}`);
    }

    if (reportUrls.length > 0) {
      await sendReportAccessEmail({
        recipientEmail: email,
        locale: parsed.data.locale,
        reportUrls,
      });
    }
  }

  // Anti-enumeration: the response is identical whether or not an order exists.
  return NextResponse.json({ accepted: true }, { status: 202 });
}
