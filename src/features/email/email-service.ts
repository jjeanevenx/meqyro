import "server-only";

import { logEvent } from "@/lib/observability/logger";
import { getSiteUrl } from "@/lib/config/env";
import type {
  ResultDeliveryEmailInput,
  SessionRecoveryEmailInput,
  DataRequestEmailInput,
  PurchaseConfirmationEmailInput,
  RefundEmailInput,
  CoupleInviteEmailInput,
  CoupleUnlockedEmailInput,
  EmailResult,
} from "./contracts";

function maskEmailForLog(email: string): string {
  const parts = email.trim().toLowerCase().split("@");
  if (parts.length !== 2) return "***@***";
  const [local, domain] = parts;
  if (!local || !domain) return "***@***";
  return `${local[0]}***@${domain}`;
}

async function sendViaResend(options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<EmailResult> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const isProduction = process.env.NODE_ENV === "production";
  const from = process.env.EMAIL_FROM || "Meqyro <noreply@meqyro.com>";

  if (!resendApiKey) {
    if (isProduction) {
      logEvent("error", "resend_missing_api_key_in_production", {
        recipientMasked: maskEmailForLog(options.to),
      });
      return { success: false, error: "Email provider API key is not configured in production." };
    }

    // In dev / test only: return simulated message
    return { success: true, messageId: `mock-${Date.now()}` };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: options.to,
        subject: options.subject,
        text: options.text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logEvent("warn", "resend_api_error", { status: response.status, errorText });
      return { success: false, error: `Resend error: ${response.status}` };
    }

    const data = await response.json();
    return { success: true, messageId: data.id };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logEvent("error", "resend_dispatch_failed", { error: errorMsg });
    return { success: false, error: errorMsg };
  }
}

export async function sendResultDeliveryEmail(
  input: ResultDeliveryEmailInput,
): Promise<EmailResult> {
  const siteUrl = getSiteUrl();
  const recoveryUrl = `${siteUrl}/${input.locale}/quizzes/${input.quizSlug}/play?session=${input.sessionId}&recover=${input.recoveryToken}`;
  const unsubscribeUrl = input.unsubscribeToken
    ? `${siteUrl}/${input.locale}/unsubscribe?token=${input.unsubscribeToken}`
    : null;

  const subjects: Record<string, string> = {
    pt: "Seu resultado no Meqyro está salvo",
    en: "Your Meqyro quiz results are saved",
    es: "Tu resultado en Meqyro está guardado",
    fr: "Vos résultats Meqyro sont enregistrés",
  };

  const bodyTexts: Record<string, string> = {
    pt: `Olá,\n\nSeu resultado para o teste está salvo. Você pode acessar sua pontuação e continuar a qualquer momento pelo link seguro abaixo:\n\n${recoveryUrl}${
      unsubscribeUrl ? `\n\nCaso não queira mais receber comunicados: ${unsubscribeUrl}` : ""
    }`,
    en: `Hello,\n\nYour quiz results are securely saved. Access your scores and resume at any time using the link below:\n\n${recoveryUrl}${
      unsubscribeUrl ? `\n\nTo unsubscribe from marketing: ${unsubscribeUrl}` : ""
    }`,
    es: `Hola,\n\nTu resultado ha sido guardado. Puedes acceder a tus puntuaciones en cualquier momento mediante el siguiente enlace:\n\n${recoveryUrl}${
      unsubscribeUrl ? `\n\nPara cancelar la suscripción: ${unsubscribeUrl}` : ""
    }`,
    fr: `Bonjour,\n\nVos résultats sont enregistrés. Accédez à vos scores à tout moment via le lien ci-dessous :\n\n${recoveryUrl}${
      unsubscribeUrl ? `\n\nPour vous désabonner : ${unsubscribeUrl}` : ""
    }`,
  };

  const subject = subjects[input.locale] ?? subjects.pt;
  const text = bodyTexts[input.locale] ?? bodyTexts.pt;

  logEvent("info", "email_result_delivery_dispatch", {
    recipientMasked: maskEmailForLog(input.recipientEmail),
    locale: input.locale,
    quizSlug: input.quizSlug,
  });

  return sendViaResend({ to: input.recipientEmail, subject, text });
}

export async function sendSessionRecoveryEmail(
  input: SessionRecoveryEmailInput,
): Promise<EmailResult> {
  const siteUrl = getSiteUrl();
  const recoveryUrl = `${siteUrl}/${input.locale}/quizzes/${input.quizSlug}/play?session=${input.sessionId}&recover=${input.recoveryToken}`;

  const subjects: Record<string, string> = {
    pt: "Recuperação do seu quiz — Meqyro",
    en: "Resume your quiz — Meqyro",
    es: "Recupera tu test — Meqyro",
    fr: "Reprenez votre quiz — Meqyro",
  };

  const bodyTexts: Record<string, string> = {
    pt: `Olá,\n\nRecebemos uma solicitação para retomar seu progresso no quiz. Clique no link para continuar exatamente de onde parou:\n\n${recoveryUrl}\n\nEste link é válido por 30 dias.`,
    en: `Hello,\n\nWe received a request to resume your quiz progress. Click the link below to continue right where you left off:\n\n${recoveryUrl}\n\nThis link is valid for 30 days.`,
    es: `Hola,\n\nHemos recibido una solicitud para retomar tu cuestionario. Haz clic en el enlace para continuar donde lo dejaste:\n\n${recoveryUrl}\n\nEste enlace es válido por 30 días.`,
    fr: `Bonjour,\n\nNous avons reçu une demande pour reprendre votre quiz. Cliquez sur le lien pour continuer là où vous vous êtes arrêté :\n\n${recoveryUrl}\n\nCe lien est valable 30 jours.`,
  };

  return sendViaResend({
    to: input.recipientEmail,
    subject: subjects[input.locale] ?? subjects.pt,
    text: bodyTexts[input.locale] ?? bodyTexts.pt,
  });
}

export async function sendDataRequestEmail(input: DataRequestEmailInput): Promise<EmailResult> {
  const siteUrl = getSiteUrl();
  const confirmUrl = `${siteUrl}/${input.locale}/privacy/data-request/confirm?token=${input.verificationToken}`;

  const subjects: Record<string, string> = {
    pt: "Confirmação de solicitação de privacidade — Meqyro",
    en: "Confirm your privacy request — Meqyro",
    es: "Confirmación de solicitud de privacidad — Meqyro",
    fr: "Confirmation de votre demande de confidentialité — Meqyro",
  };

  const bodyTexts: Record<string, string> = {
    pt: `Olá,\n\nRecebemos uma solicitação de ${input.requestType} para os dados vinculados a este endereço de e-mail.\n\nPara confirmar a solicitação de forma segura, acesse o link abaixo em até 48 horas:\n\n${confirmUrl}\n\nSe você não solicitou, desconsidere esta mensagem.`,
    en: `Hello,\n\nWe received a ${input.requestType} privacy request for this email address.\n\nTo verify and confirm your request, please visit the link below within 48 hours:\n\n${confirmUrl}\n\nIf you did not request this, you can safely ignore this email.`,
    es: `Hola,\n\nHemos recibido una solicitud de ${input.requestType} para los datos asociados a este correo.\n\nPara confirmar de forma segura, acceda al siguiente enlace en las próximas 48 horas:\n\n${confirmUrl}`,
    fr: `Bonjour,\n\nNous avons reçu une demande de ${input.requestType} concernant les données associées à cette adresse e-mail.\n\nPour confirmer cette demande, veuillez cliquer sur le lien suivant sous 48 heures :\n\n${confirmUrl}`,
  };

  return sendViaResend({
    to: input.recipientEmail,
    subject: subjects[input.locale] ?? subjects.pt,
    text: bodyTexts[input.locale] ?? bodyTexts.pt,
  });
}

export async function sendPurchaseConfirmationEmail(
  input: PurchaseConfirmationEmailInput,
): Promise<EmailResult> {
  const siteUrl = getSiteUrl();
  const accessUrl = `${siteUrl}/${input.locale}/checkout/success?session=${input.sessionId}&order=${input.orderNumber}`;

  const subjects: Record<string, string> = {
    pt: `Confirmação de compra do seu relatório Meqyro (#${input.orderNumber})`,
    en: `Order confirmation for your Meqyro report (#${input.orderNumber})`,
    es: `Confirmación de compra de su informe Meqyro (#${input.orderNumber})`,
    fr: `Confirmation de commande de votre rapport Meqyro (#${input.orderNumber})`,
  };

  const bodyTexts: Record<string, string> = {
    pt: `Olá,\n\nSeu pagamento no valor de ${(input.amount / 100).toFixed(2)} ${input.currency} foi confirmado com sucesso!\n\nSeu relatório analítico premium já está disponível. Acesse pelo link abaixo:\n\n${accessUrl}\n\nNúmero do pedido: ${input.orderNumber}`,
    en: `Hello,\n\nYour payment of ${(input.amount / 100).toFixed(2)} ${input.currency} has been confirmed!\n\nYour premium comprehensive report is unlocked and ready to view:\n\n${accessUrl}\n\nOrder number: ${input.orderNumber}`,
    es: `Hola,\n\n¡Su pago de ${(input.amount / 100).toFixed(2)} ${input.currency} ha sido confirmado con éxito!\n\nSu informe premium ya está disponible:\n\n${accessUrl}\n\nNúmero de pedido: ${input.orderNumber}`,
    fr: `Bonjour,\n\nVotre paiement de ${(input.amount / 100).toFixed(2)} ${input.currency} a été confirmé avec succès !\n\nVotre rapport premium est disponible :\n\n${accessUrl}\n\nNuméro de commande : ${input.orderNumber}`,
  };

  return sendViaResend({
    to: input.recipientEmail,
    subject: subjects[input.locale] ?? subjects.pt,
    text: bodyTexts[input.locale] ?? bodyTexts.pt,
  });
}

export async function sendRefundEmail(input: RefundEmailInput): Promise<EmailResult> {
  const subjects: Record<string, string> = {
    pt: `Confirmação de reembolso Meqyro (#${input.orderNumber})`,
    en: `Refund confirmation for Meqyro order (#${input.orderNumber})`,
    es: `Confirmación de reembolso Meqyro (#${input.orderNumber})`,
    fr: `Confirmation de remboursement Meqyro (#${input.orderNumber})`,
  };

  const bodyTexts: Record<string, string> = {
    pt: `Olá,\n\nInformamos que o reembolso no valor de ${(input.amount / 100).toFixed(2)} ${input.currency} referente ao pedido #${input.orderNumber} foi processado pelo gateway de pagamento.\n\nO crédito será lançado na sua fatura ou conta de acordo com os prazos da sua instituição financeira.`,
    en: `Hello,\n\nYour refund of ${(input.amount / 100).toFixed(2)} ${input.currency} for order #${input.orderNumber} has been processed.\n\nThe credit should reflect on your statement according to your financial institution's processing timeline.`,
    es: `Hola,\n\nLe informamos que el reembolso de ${(input.amount / 100).toFixed(2)} ${input.currency} para el pedido #${input.orderNumber} ha sido procesado.`,
    fr: `Bonjour,\n\nNous vous informons que le remboursement de ${(input.amount / 100).toFixed(2)} ${input.currency} pour la commande #${input.orderNumber} a été traité.`,
  };

  return sendViaResend({
    to: input.recipientEmail,
    subject: subjects[input.locale] ?? subjects.pt,
    text: bodyTexts[input.locale] ?? bodyTexts.pt,
  });
}

export async function sendCoupleInviteEmail(input: CoupleInviteEmailInput): Promise<EmailResult> {
  const siteUrl = getSiteUrl();
  const inviteUrl = `${siteUrl}/${input.locale}/quizzes/coupledna/play?invite=${input.inviteCode}`;

  const subjects: Record<string, string> = {
    pt: "Convite especial para o CoupleDNA — Meqyro",
    en: "Special invitation to CoupleDNA — Meqyro",
    es: "Invitación especial para CoupleDNA — Meqyro",
    fr: "Invitation spéciale pour CoupleDNA — Meqyro",
  };

  const bodyTexts: Record<string, string> = {
    pt: `Olá,\n\nVocê recebeu um convite para participar da experiência CoupleDNA no Meqyro!\n\nSeu parceiro(a) já iniciou o teste. Para responder suas perguntas e desbloquear a comparação bilateral, acesse o link abaixo:\n\n${inviteUrl}\n\nCódigo do convite: ${input.inviteCode}`,
    en: `Hello,\n\nYou have been invited to participate in the CoupleDNA experience on Meqyro!\n\nTo answer your questions and unlock your bilateral compatibility comparison, visit:\n\n${inviteUrl}\n\nInvite code: ${input.inviteCode}`,
    es: `Hola,\n\n¡Has recibido una invitación para participar en CoupleDNA en Meqyro!\n\nAccede al siguiente enlace para responder tus preguntas y ver la compatibilidad:\n\n${inviteUrl}\n\nCódigo de invitación: ${input.inviteCode}`,
    fr: `Bonjour,\n\nVous avez été invité(e) à participer à l'expérience CoupleDNA sur Meqyro !\n\nPour répondre à vos questions et débloquer la comparaison bilatérale, visitez :\n\n${inviteUrl}\n\nCode d'invitation : ${input.inviteCode}`,
  };

  return sendViaResend({
    to: input.recipientEmail,
    subject: subjects[input.locale] ?? subjects.pt,
    text: bodyTexts[input.locale] ?? bodyTexts.pt,
  });
}

export async function sendCoupleUnlockedEmail(
  input: CoupleUnlockedEmailInput,
): Promise<EmailResult> {
  const subjects: Record<string, string> = {
    pt: "Sua comparação CoupleDNA está pronta!",
    en: "Your CoupleDNA comparison is ready!",
    es: "¡Tu comparación CoupleDNA está lista!",
    fr: "Votre comparaison CoupleDNA est prête !",
  };

  const bodyTexts: Record<string, string> = {
    pt: `Olá,\n\nAmbos os participantes concluíram suas perguntas e autorizaram a visualização compartilhada. Seu relatório comparativo CoupleDNA foi liberado com sucesso:\n\n${input.comparisonUrl}`,
    en: `Hello,\n\nBoth partners have completed their questions and granted consent. Your CoupleDNA bilateral comparison report is now unlocked:\n\n${input.comparisonUrl}`,
    es: `Hola,\n\nAmbos participantes han completado sus preguntas y otorgado el consentimiento. Su informe comparativo ya está disponible:\n\n${input.comparisonUrl}`,
    fr: `Bonjour,\n\nLes deux partenaires ont complété leurs questions et accordé leur consentement. Votre rapport comparatif est désormais disponible :\n\n${input.comparisonUrl}`,
  };

  return sendViaResend({
    to: input.recipientEmail,
    subject: subjects[input.locale] ?? subjects.pt,
    text: bodyTexts[input.locale] ?? bodyTexts.pt,
  });
}
