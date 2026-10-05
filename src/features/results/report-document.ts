import type { ComprehensiveReport } from "./contracts";

export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!,
  );
}

export function reportText(report: ComprehensiveReport): string {
  return [
    report.executiveSummary,
    ...report.sections.flatMap((s) => [
      s.title,
      s.summary,
      ...s.paragraphs,
      ...s.actionItems.map((a) => `• ${a}`),
    ]),
    report.comparativeBenchmark.description,
  ].join("\n\n");
}

/** Standalone UTF-8 document: can be kept offline or printed to PDF. No scripts or remote assets. */
export function reportHtml(report: ComprehensiveReport, slug: string, locale: string): string {
  const e = escapeHtml;
  const certificate = {
    pt: {
      title: "Certificado digital de conclusão",
      text: `Este documento registra a conclusão do quiz ${slug} no Meqyro. É uma declaração de participação para uso pessoal, sem habilitação profissional ou validade clínica.`,
    },
    en: {
      title: "Digital completion certificate",
      text: `This document records completion of the ${slug} assessment on Meqyro. It is a personal participation record, not a professional qualification or clinical certification.`,
    },
    es: {
      title: "Certificado digital de finalización",
      text: `Este documento registra la finalización del test ${slug} en Meqyro. Es una declaración de participación personal, sin habilitación profesional ni validez clínica.`,
    },
    fr: {
      title: "Certificat numérique de participation",
      text: `Ce document atteste la réalisation du test ${slug} sur Meqyro. Il s’agit d’une déclaration de participation personnelle, sans qualification professionnelle ni valeur clinique.`,
    },
  }[locale === "en" || locale === "es" || locale === "fr" ? locale : "pt"];
  return `<!doctype html><html lang="${e(locale)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Meqyro — ${e(slug)}</title><style>body{font:17px/1.7 system-ui,sans-serif;color:#24332d;background:#fafaf6;max-width:760px;margin:40px auto;padding:24px}h1,h2{line-height:1.25}header{border-bottom:2px solid #315748}section{padding:20px 0;border-bottom:1px solid #ddd}small{color:#53635b}@media print{body{margin:0;background:white}section{break-inside:avoid}}</style></head><body><header><small>MEQYRO · ${e(slug)}</small><h1>${e(report.bandLabel)}</h1></header><p>${e(report.executiveSummary)}</p>${report.sections.map((s) => `<section><h2>${e(s.title)}</h2><p>${e(s.summary)}</p>${s.paragraphs.map((p) => `<p>${e(p)}</p>`).join("")}<ul>${s.actionItems.map((a) => `<li>${e(a)}</li>`).join("")}</ul></section>`).join("")}<section><h2>${e(certificate.title)}</h2><p>${e(certificate.text)}</p></section><footer><p><small>${e(report.comparativeBenchmark.description)}</small></p></footer></body></html>`;
}
