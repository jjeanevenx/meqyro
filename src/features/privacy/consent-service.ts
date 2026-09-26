import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { matchesAnonymousSessionToken } from "@/lib/security/anonymous-session";
import {
  CURRENT_POLICY_VERSION,
  type LeadCaptureInput,
  type LeadCaptureResult,
  type DataRequestInput,
  type DataRequestResult,
  type ConsentAuditEntry,
} from "./contracts";
import { sendResultDeliveryEmail, sendDataRequestEmail } from "@/features/email/email-service";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function maskEmail(email: string): string {
  const normalized = normalizeEmail(email);
  const parts = normalized.split("@");
  if (parts.length !== 2) return "***@***";
  const [local, domain] = parts;
  if (!local || !domain) return "***@***";
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

export function hashIp(ip: string | undefined): string | null {
  if (!ip) return null;
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 16) ?? "meqyro-salt";
  return createHash("sha256").update(`${ip}:${salt}`, "utf8").digest("hex");
}

export function generateSecureToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export async function recordLeadAndConsents(input: LeadCaptureInput): Promise<LeadCaptureResult> {
  const supabase = createSupabaseSecretClient();
  const normalized = normalizeEmail(input.email);

  if (!normalized || !normalized.includes("@")) {
    throw new Error("Endereço de e-mail inválido.");
  }

  // 1. Verify session exists and token matches
  const { data: session, error: sessionError } = await supabase
    .from("quiz_sessions")
    .select(`
      id,
      access_token_hash,
      status,
      quiz_versions(quiz_id, quizzes(slug, product_code))
    `)
    .eq("id", input.sessionId)
    .single();

  if (sessionError || !session) {
    throw new Error(`Sessão do quiz não encontrada: ${sessionError?.message ?? "vazio"}`);
  }

  if (!matchesAnonymousSessionToken(input.sessionToken, session.access_token_hash)) {
    throw new Error("Token de sessão inválido.");
  }

  // 2. Find or create lead
  let leadId: string;
  const { data: existingLead } = await supabase
    .from("leads")
    .select("id")
    .eq("email_normalized", normalized)
    .single();

  if (existingLead) {
    leadId = existingLead.id;
    await supabase
      .from("leads")
      .update({
        session_id: input.sessionId,
        locale: input.locale,
        market: input.market,
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId);
  } else {
    const { data: newLead, error: createError } = await supabase
      .from("leads")
      .insert({
        session_id: input.sessionId,
        email: input.email.trim(),
        email_normalized: normalized,
        locale: input.locale,
        market: input.market,
      })
      .select("id")
      .single();

    if (createError || !newLead) {
      throw new Error(`Erro ao registrar lead: ${createError?.message}`);
    }
    leadId = newLead.id;
  }

  // 3. Record consents (append-only audit log)
  const hashedIp = hashIp(input.ip);
  const now = new Date().toISOString();

  // 3.1. Mandatory transactional consent for result delivery
  await supabase.from("consents").insert({
    lead_id: leadId,
    consent_type: "TRANSACTIONAL_RESULTS",
    granted: true,
    policy_version: CURRENT_POLICY_VERSION,
    ip_hash: hashedIp,
    user_agent: input.userAgent ?? null,
    source: "lead_capture",
    created_at: now,
  });

  // 3.2. Explicit promotional consent (granted as requested by user)
  await supabase.from("consents").insert({
    lead_id: leadId,
    consent_type: "MARKETING_PROMOTIONAL",
    granted: input.marketingConsent,
    policy_version: CURRENT_POLICY_VERSION,
    ip_hash: hashedIp,
    user_agent: input.userAgent ?? null,
    source: "lead_capture",
    created_at: now,
  });

  // 4. Generate recovery token (valid for 30 days)
  const recoveryRawToken = generateSecureToken();
  const recoveryHash = hashToken(recoveryRawToken);
  const recoveryExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await supabase.from("recovery_tokens").insert({
    session_id: input.sessionId,
    token_hash: recoveryHash,
    expires_at: recoveryExpires,
  });

  // 5. Generate unsubscribe token if marketing consent was granted
  let unsubscribeRawToken: string | undefined;
  if (input.marketingConsent) {
    unsubscribeRawToken = generateSecureToken();
    const unsubHash = hashToken(unsubscribeRawToken);
    await supabase.from("unsubscribe_tokens").insert({
      lead_id: leadId,
      token_hash: unsubHash,
    });
  }

  // 6. Ensure FREE_PARTIAL result access grant exists
  type SessionVersions = {
    quiz_versions?: {
      quiz_id?: string;
      quizzes?: {
        slug?: string;
        product_code?: string;
      };
    };
  };
  const sessionRecord = session as unknown as SessionVersions;
  const productCode = sessionRecord.quiz_versions?.quizzes?.product_code ?? "BRAINRANK";
  const quizSlug = sessionRecord.quiz_versions?.quizzes?.slug ?? "brainrank";

  const { data: existingGrant } = await supabase
    .from("result_access_grants")
    .select("id")
    .eq("session_id", input.sessionId)
    .eq("grant_type", "FREE_PARTIAL")
    .single();

  if (!existingGrant) {
    await supabase.from("result_access_grants").insert({
      session_id: input.sessionId,
      lead_id: leadId,
      product_code: productCode,
      grant_type: "FREE_PARTIAL",
    });
  }

  // 7. Dispatch result delivery email in the background (or synchronously in dev)
  try {
    await sendResultDeliveryEmail({
      recipientEmail: normalized,
      locale: input.locale,
      quizSlug,
      sessionId: input.sessionId,
      recoveryToken: recoveryRawToken,
      unsubscribeToken: unsubscribeRawToken,
    });
  } catch (err) {
    // Log error but do not fail lead submission
    console.error("Failed to send result delivery email:", err);
  }

  return {
    leadId,
    sessionId: input.sessionId,
    maskedEmail: maskEmail(input.email),
    recoveryToken: recoveryRawToken,
    unsubscribeToken: unsubscribeRawToken,
  };
}

export async function unsubscribeByToken(token: string): Promise<{ success: boolean; leadId?: string }> {
  const supabase = createSupabaseSecretClient();
  const inputHash = hashToken(token);

  // Find token
  const { data: tokenRecord, error } = await supabase
    .from("unsubscribe_tokens")
    .select("id, lead_id, used_at, token_hash")
    .eq("token_hash", inputHash)
    .single();

  if (error || !tokenRecord) {
    return { success: false };
  }

  // Verify constant-time match
  const actual = Buffer.from(inputHash, "hex");
  const expected = Buffer.from(tokenRecord.token_hash, "hex");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return { success: false };
  }

  // Mark token used
  await supabase
    .from("unsubscribe_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("id", tokenRecord.id);

  // Append revoked consent record for MARKETING_PROMOTIONAL
  await supabase.from("consents").insert({
    lead_id: tokenRecord.lead_id,
    consent_type: "MARKETING_PROMOTIONAL",
    granted: false,
    policy_version: CURRENT_POLICY_VERSION,
    source: "unsubscribe_link",
  });

  return { success: true, leadId: tokenRecord.lead_id };
}

export async function submitDataRequest(input: DataRequestInput): Promise<DataRequestResult> {
  const supabase = createSupabaseSecretClient();
  const normalized = normalizeEmail(input.email);

  if (!normalized || !normalized.includes("@")) {
    return {
      success: true,
      message: "Se houver dados associados ao e-mail informado, enviaremos as orientações.",
    };
  }

  // Check if lead exists (do NOT disclose to caller)
  const { data: lead } = await supabase
    .from("leads")
    .select("id")
    .eq("email_normalized", normalized)
    .single();

  const verificationRawToken = generateSecureToken();
  const verificationHash = hashToken(verificationRawToken);

  await supabase.from("data_requests").insert({
    lead_id: lead?.id ?? null,
    email: input.email.trim(),
    email_normalized: normalized,
    request_type: input.requestType,
    status: "PENDING",
    details: input.details ?? null,
    verification_token_hash: verificationHash,
  });

  // If lead exists, dispatch verification email
  if (lead) {
    try {
      await sendDataRequestEmail({
        recipientEmail: normalized,
        locale: input.locale,
        requestType: input.requestType,
        verificationToken: verificationRawToken,
      });
    } catch (err) {
      console.error("Failed to send data request verification email:", err);
    }
  }

  // Always return identical success message to prevent user enumeration
  const messages: Record<string, string> = {
    pt: "Se houver dados associados a este e-mail, enviamos as orientações de confirmação para sua caixa de entrada.",
    en: "If there are records associated with this email, confirmation instructions have been sent to your inbox.",
    es: "Si hay registros asociados a este correo, le enviamos las instrucciones de confirmación a su bandeja de entrada.",
    fr: "S'il existe des dossiers associés à cette adresse e-mail, nous vous avons envoyé les instructions de confirmation.",
  };

  return {
    success: true,
    message: messages[input.locale] ?? messages.pt ?? "",
  };
}

export async function getConsentsForLead(leadId: string): Promise<ConsentAuditEntry[]> {
  const supabase = createSupabaseSecretClient();

  const { data, error } = await supabase
    .from("consents")
    .select("consent_type, granted, policy_version, created_at")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((d) => ({
    consentType: d.consent_type as "TRANSACTIONAL_RESULTS" | "MARKETING_PROMOTIONAL",
    granted: d.granted,
    policyVersion: d.policy_version,
    createdAt: d.created_at,
  }));
}
