import "server-only";

import { randomBytes } from "node:crypto";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { matchesAnonymousSessionToken } from "@/lib/security/anonymous-session";
import { logEvent } from "@/lib/observability/logger";
import type { CreateReferralInput, SafeShareData } from "./contracts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://meqyro.com";

function generateCode(): string {
  const rand = randomBytes(4).toString("hex").toUpperCase();
  return `MQ${rand}`;
}

export async function createReferralLink(
  input: CreateReferralInput,
): Promise<SafeShareData | null> {
  const supabase = createSupabaseSecretClient();

  // Validate session authenticity
  const { data: session, error: sessionError } = await supabase
    .schema("meqyro")
    .from("quiz_sessions")
    .select("id, access_token_hash, status")
    .eq("id", input.sessionId)
    .single();

  if (sessionError || !session) {
    return null;
  }

  if (!matchesAnonymousSessionToken(input.sessionToken, session.access_token_hash)) {
    return null;
  }

  // Check if a referral code already exists for this session
  const { data: existing } = await supabase
    .schema("meqyro")
    .from("referrals")
    .select("code")
    .eq("creator_session_id", input.sessionId)
    .maybeSingle();

  const code = existing?.code ?? generateCode();

  if (!existing) {
    const { error: insertError } = await supabase.schema("meqyro").from("referrals").insert({
      code,
      creator_session_id: input.sessionId,
      quiz_slug: input.quizSlug,
      locale: input.locale,
    });

    if (insertError) {
      logEvent("error", "referral_insert_failed", {
        code,
        message: insertError.message,
      });
      return null;
    }
  }

  const shareUrl = `${SITE_URL}/${input.locale}/quizzes/${input.quizSlug}?ref=${code}`;

  const shareTitles: Record<string, string> = {
    pt: "Descubra seu perfil na Meqyro",
    en: "Discover your profile on Meqyro",
    es: "Descubre tu perfil en Meqyro",
    fr: "Découvrez votre profil sur Meqyro",
  };

  const shareTexts: Record<string, string> = {
    pt: "Acabei de concluir minha avaliação na Meqyro. Faça você também e descubra seus pontos fortes!",
    en: "I just completed my assessment on Meqyro. Take it yourself to uncover your strengths!",
    es: "Acabo de completar mi evaluación en Meqyro. ¡Hazla tú también y descubre tus fortalezas!",
    fr: "Je viens de terminer mon évaluation sur Meqyro. Faites-la vous aussi et découvrez vos points forts !",
  };

  return {
    referralCode: code,
    shareUrl,
    shareTitle: shareTitles[input.locale] ?? shareTitles.en,
    shareText: shareTexts[input.locale] ?? shareTexts.en,
  };
}

export async function recordReferralClick(code: string): Promise<boolean> {
  const normalizedCode = code.trim().toUpperCase();
  const supabase = createSupabaseSecretClient();

  const { data: referral } = await supabase
    .schema("meqyro")
    .from("referrals")
    .select("id, clicks_count")
    .eq("code", normalizedCode)
    .maybeSingle();

  if (!referral) return false;

  await supabase
    .schema("meqyro")
    .from("referrals")
    .update({
      clicks_count: referral.clicks_count + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", referral.id);

  logEvent("info", "referral_click_tracked", { code: normalizedCode });
  return true;
}

export async function recordReferralConversion(code: string): Promise<boolean> {
  const normalizedCode = code.trim().toUpperCase();
  const supabase = createSupabaseSecretClient();

  const { data: referral } = await supabase
    .schema("meqyro")
    .from("referrals")
    .select("id, conversions_count")
    .eq("code", normalizedCode)
    .maybeSingle();

  if (!referral) return false;

  await supabase
    .schema("meqyro")
    .from("referrals")
    .update({
      conversions_count: referral.conversions_count + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", referral.id);

  logEvent("info", "referral_conversion_tracked", { code: normalizedCode });
  return true;
}
