// Shared by the Next.js mail service and the Supabase delivery function.
// Keep this renderer pure and free of runtime-specific imports.
type BrandedEmailInput = {
  locale: string;
  title: string;
  preheader?: string;
  contentHtml: string;
  footerHtml?: string;
};

export function escapeEmailHtml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (character) => entities[character]);
}

export function renderBrandedEmail(input: BrandedEmailInput): string {
  const locale = ["pt", "en", "es", "fr"].includes(input.locale) ? input.locale : "pt";
  // Tables and inline styles work without images, external fonts, or CSS support.
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeEmailHtml(input.title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f8fc;color:#071431;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
  <div style="display:none;font-size:1px;line-height:1px;color:#f5f8fc;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeEmailHtml(input.preheader ?? input.title)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f8fc">
    <tr><td align="center" style="padding:32px 16px;">
      <!--[if mso]><table role="presentation" width="560" align="center"><tr><td><![endif]-->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
        <tr><td style="padding:0 8px 24px;font-size:22px;line-height:30px;font-weight:800;letter-spacing:4px;color:#071431;">MEQ<span style="color:#123fc4;">YRO</span></td></tr>
        <tr><td bgcolor="#ffffff" style="padding:0;border:1px solid #d8deeb;border-radius:18px;overflow:hidden;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td height="4" bgcolor="#123fc4" style="height:4px;font-size:0;line-height:0;border-radius:18px 18px 0 0;">&nbsp;</td></tr>
            <tr><td style="padding:32px 24px;">
${input.contentHtml}
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding:24px 12px 0;">
${input.footerHtml ?? ""}
        </td></tr>
      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td></tr>
  </table>
</body>
</html>`;
}

const actions = {
  pt: "Acessar no Meqyro",
  en: "Open in Meqyro",
  es: "Acceder a Meqyro",
  fr: "Ouvrir dans Meqyro",
};

export function renderTransactionalEmail(input: {
  locale: string;
  subject: string;
  text: string;
}): string {
  const locale = Object.hasOwn(actions, input.locale)
    ? (input.locale as keyof typeof actions)
    : "pt";
  const paragraphs = input.text.split(/\n\n+/).filter(Boolean);
  const contentHtml =
    `<h1 style="margin:0 0 24px;font-size:28px;line-height:36px;color:#071431;">${escapeEmailHtml(input.subject)}</h1>` +
    paragraphs
      .map((paragraph) => {
        return paragraph
          .split("\n")
          .map((line) => {
            const link = line.match(/^(?:\d+\.\s*)?(https?:\/\/\S+)$/);
            if (link)
              return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;"><tr><td align="center" bgcolor="#082da7" style="border-radius:10px;mso-padding-alt:18px 24px;"><a href="${escapeEmailHtml(link[1])}" style="display:block;padding:18px 24px;border-radius:10px;font-size:16px;line-height:22px;font-weight:700;text-decoration:none;color:#ffffff;">${actions[locale]}</a></td></tr></table>`;
            return `<p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#52607a;">${escapeEmailHtml(line)}</p>`;
          })
          .join("");
      })
      .join("");
  return renderBrandedEmail({ locale, title: input.subject, contentHtml });
}
