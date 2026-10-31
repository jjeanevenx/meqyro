import "server-only";

import { experiences } from "@/content/experiences";

type ResultDeliveryTemplateInput = {
  locale: string;
  quizSlug: string;
  recoveryUrl: string;
  unsubscribeUrl: string | null;
};

const copy = {
  pt: {
    preheader: "Seu resultado está salvo. Volte às suas descobertas quando quiser.",
    eyebrow: "UMA NOVA DESCOBERTA SOBRE VOCÊ",
    title: "Seu resultado está salvo.",
    intro:
      "Cada descoberta é um passo para se conhecer melhor. Acesse seu resultado e continue explorando o que faz de você, você.",
    label: "SEU TESTE",
    action: "Ver meu resultado",
    note: "Guarde este e-mail para acessar seu resultado quando quiser.",
    fallback: "O botão não abriu?",
    link: "Acesse por este link",
    security: "Este link é pessoal. Para proteger seu resultado, não o compartilhe.",
    tagline: "Conheça seus padrões. Descubra suas possibilidades.",
    reason: "Você recebeu este e-mail porque salvou seu resultado no Meqyro.",
    unsubscribe: "Deixar de receber comunicados",
  },
  en: {
    preheader: "Your result is saved. Revisit your discoveries whenever you like.",
    eyebrow: "A NEW DISCOVERY ABOUT YOU",
    title: "Your result is saved.",
    intro:
      "Every discovery is a step toward knowing yourself better. View your result and keep exploring what makes you, you.",
    label: "YOUR QUIZ",
    action: "View my result",
    note: "Keep this email to revisit your result whenever you like.",
    fallback: "Button not working?",
    link: "Use this link",
    security: "This link is personal. To protect your result, do not share it.",
    tagline: "Know your patterns. Discover your possibilities.",
    reason: "You received this email because you saved your result on Meqyro.",
    unsubscribe: "Unsubscribe from updates",
  },
  es: {
    preheader: "Tu resultado está guardado. Vuelve a tus descubrimientos cuando quieras.",
    eyebrow: "UN NUEVO DESCUBRIMIENTO SOBRE TI",
    title: "Tu resultado está guardado.",
    intro:
      "Cada descubrimiento es un paso para conocerte mejor. Consulta tu resultado y sigue explorando lo que te hace ser tú.",
    label: "TU TEST",
    action: "Ver mi resultado",
    note: "Guarda este correo para volver a tu resultado cuando quieras.",
    fallback: "¿El botón no funciona?",
    link: "Accede desde este enlace",
    security: "Este enlace es personal. Para proteger tu resultado, no lo compartas.",
    tagline: "Conoce tus patrones. Descubre tus posibilidades.",
    reason: "Recibiste este correo porque guardaste tu resultado en Meqyro.",
    unsubscribe: "Dejar de recibir comunicaciones",
  },
  fr: {
    preheader: "Votre résultat est enregistré. Retrouvez vos découvertes quand vous le souhaitez.",
    eyebrow: "UNE NOUVELLE DÉCOUVERTE SUR VOUS",
    title: "Votre résultat est enregistré.",
    intro:
      "Chaque découverte est un pas vers une meilleure connaissance de soi. Consultez votre résultat et explorez ce qui fait de vous qui vous êtes.",
    label: "VOTRE QUIZ",
    action: "Voir mon résultat",
    note: "Conservez cet e-mail pour retrouver votre résultat quand vous le souhaitez.",
    fallback: "Le bouton ne fonctionne pas ?",
    link: "Utilisez ce lien",
    security: "Ce lien est personnel. Pour protéger votre résultat, ne le partagez pas.",
    tagline: "Comprenez vos schémas. Découvrez vos possibilités.",
    reason: "Vous recevez cet e-mail car vous avez enregistré votre résultat sur Meqyro.",
    unsubscribe: "Se désabonner des communications",
  },
} as const;

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export function renderResultDeliveryEmail(input: ResultDeliveryTemplateInput): {
  text: string;
  html: string;
} {
  const locale = Object.hasOwn(copy, input.locale) ? (input.locale as keyof typeof copy) : "pt";
  const content = copy[locale];
  const quizName =
    experiences.find((experience) => experience.slug === input.quizSlug)?.brand ?? "Meqyro";
  const recoveryUrl = escapeHtml(input.recoveryUrl);
  const text = [
    "MEQYRO",
    content.title,
    content.intro,
    `${content.label}: ${quizName}`,
    `${content.action}: ${input.recoveryUrl}`,
    content.note,
    content.security,
    content.tagline,
    content.reason,
    ...(input.unsubscribeUrl ? [`${content.unsubscribe}: ${input.unsubscribeUrl}`] : []),
  ].join("\n\n");

  // Tables and inline styles keep the layout usable in Gmail and Outlook,
  // including when images, external fonts, or embedded styles are blocked.
  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${content.title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f8fc;color:#071431;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
  <div style="display:none;font-size:1px;line-height:1px;color:#f5f8fc;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${content.preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f8fc">
    <tr><td align="center" style="padding:32px 16px;">
      <!--[if mso]><table role="presentation" width="560" align="center"><tr><td><![endif]-->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
        <tr><td style="padding:0 8px 24px;font-size:22px;line-height:30px;font-weight:800;letter-spacing:4px;color:#071431;">MEQ<span style="color:#123fc4;">YRO</span></td></tr>
        <tr><td bgcolor="#ffffff" style="padding:0;border:1px solid #d8deeb;border-radius:18px;overflow:hidden;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td height="4" bgcolor="#123fc4" style="height:4px;font-size:0;line-height:0;border-radius:18px 18px 0 0;">&nbsp;</td></tr>
            <tr><td style="padding:32px 24px;">
              <p style="margin:0 0 16px;font-size:11px;line-height:18px;font-weight:700;letter-spacing:1.5px;color:#123fc4;">${content.eyebrow}</p>
              <h1 style="margin:0 0 16px;font-size:30px;line-height:38px;letter-spacing:-0.8px;color:#071431;">${content.title}</h1>
              <p style="margin:0 0 28px;font-size:16px;line-height:26px;color:#52607a;">${content.intro}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td bgcolor="#f5f8fc" style="padding:18px 20px;border:1px solid #d8deeb;border-radius:10px;">
                  <p style="margin:0 0 6px;font-size:11px;line-height:16px;font-weight:700;letter-spacing:1.5px;color:#52607a;">${content.label}</p>
                  <p style="margin:0;font-size:20px;line-height:28px;font-weight:700;color:#071431;">${escapeHtml(quizName)}</p>
                </td></tr>
                <tr><td style="padding-top:24px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr><td align="center" bgcolor="#082da7" style="border-radius:10px;mso-padding-alt:18px 24px;">
                      <a href="${recoveryUrl}" style="display:block;padding:18px 24px;border:1px solid #082da7;border-radius:10px;font-size:16px;line-height:22px;font-weight:700;text-align:center;text-decoration:none;color:#ffffff;">${content.action}</a>
                    </td></tr>
                  </table>
                </td></tr>
              </table>
              <p style="margin:16px 0 28px;font-size:13px;line-height:21px;text-align:center;color:#52607a;">${content.note}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top:1px solid #d8deeb;padding-top:22px;">
                  <p style="margin:0 0 10px;font-size:12px;line-height:20px;color:#52607a;">${content.fallback} <a href="${recoveryUrl}" style="color:#123fc4;text-decoration:underline;">${content.link}</a>.</p>
                  <p style="margin:0;font-size:12px;line-height:20px;color:#52607a;">${content.security}</p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding:24px 12px 0;">
          <p style="margin:0 0 12px;font-size:13px;line-height:21px;font-weight:700;color:#071431;">${content.tagline}</p>
          <p style="margin:0;font-size:11px;line-height:18px;color:#52607a;">${content.reason}</p>
          ${input.unsubscribeUrl ? `<p style="margin:12px 0 0;font-size:12px;line-height:20px;"><a href="${escapeHtml(input.unsubscribeUrl)}" style="color:#52607a;text-decoration:underline;">${content.unsubscribe}</a></p>` : ""}
        </td></tr>
      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td></tr>
  </table>
</body>
</html>`;

  return { text, html };
}
