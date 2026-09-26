import "server-only";

import { logEvent } from "@/lib/observability/logger";
import type {
  ResultDeliveryEmailInput,
  DataRequestEmailInput,
  EmailResult,
} from "./contracts";

function maskEmailForLog(email: string): string {
  const parts = email.trim().toLowerCase().split("@");
  if (parts.length !== 2) return "***@***";
  const [local, domain] = parts;
  if (!local || !domain) return "***@***";
  return `${local[0]}***@${domain}`;
}

export async function sendResultDeliveryEmail(
  input: ResultDeliveryEmailInput,
): Promise<EmailResult> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const recoveryUrl = `${baseUrl}/${input.locale}/quizzes/${input.quizSlug}/play?session=${input.sessionId}&recover=${input.recoveryToken}`;
  const unsubscribeUrl = input.unsubscribeToken
    ? `${baseUrl}/${input.locale}/unsubscribe?token=${input.unsubscribeToken}`
    : null;

  const subjects: Record<string, string> = {
    pt: "Seu resultado no Meqyro está salvo",
    en: "Your Meqyro quiz results are saved",
    es: "Tu resultado en Meqyro está guardado",
    fr: "Vos résultats Meqyro sont enregistrés",
  };

  const subject = subjects[input.locale] ?? subjects.pt;

  logEvent("info", "email_result_delivery_dispatch", {
    recipientMasked: maskEmailForLog(input.recipientEmail),
    locale: input.locale,
    quizSlug: input.quizSlug,
    hasUnsubscribe: Boolean(unsubscribeUrl),
  });

  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Meqyro <noreply@meqyro.com>",
          to: input.recipientEmail,
          subject,
          text: `Acesse seu resultado salvo pelo link: ${recoveryUrl}${
            unsubscribeUrl ? `\n\nCancelar recebimento de novidades: ${unsubscribeUrl}` : ""
          }`,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logEvent("warn", "resend_api_error", { status: response.status, errorText });
        return { success: false };
      }

      const data = await response.json();
      return { success: true, messageId: data.id };
    } catch (err: unknown) {
      logEvent("error", "resend_dispatch_failed", {
        message: err instanceof Error ? err.message : String(err),
      });
      return { success: false };
    }
  }

  // Development/Test simulated delivery
  return { success: true, messageId: `mock-${Date.now()}` };
}

export async function sendDataRequestEmail(
  input: DataRequestEmailInput,
): Promise<EmailResult> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const confirmUrl = `${baseUrl}/${input.locale}/privacy/data-request/confirm?token=${input.verificationToken}`;

  const subjects: Record<string, string> = {
    pt: "Confirmação de solicitação de privacidade — Meqyro",
    en: "Confirm your privacy request — Meqyro",
    es: "Confirmación de solicitud de privacidad — Meqyro",
    fr: "Confirmation de votre demande de confidentialité — Meqyro",
  };

  const subject = subjects[input.locale] ?? subjects.pt;

  logEvent("info", "email_privacy_request_dispatch", {
    recipientMasked: maskEmailForLog(input.recipientEmail),
    locale: input.locale,
    requestType: input.requestType,
  });

  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Meqyro Privacidade <privacy@meqyro.com>",
          to: input.recipientEmail,
          subject,
          text: `Recebemos uma solicitação de ${input.requestType}. Para confirmar e prosseguir com a requisição, acesse o link seguro: ${confirmUrl}`,
        }),
      });

      if (!response.ok) {
        return { success: false };
      }

      const data = await response.json();
      return { success: true, messageId: data.id };
    } catch {
      return { success: false };
    }
  }

  return { success: true, messageId: `mock-privacy-${Date.now()}` };
}
