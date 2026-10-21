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
      ...s.keyTakeaways.map((item) => `• ${item}`),
      ...s.actionItems.map((a) => `• ${a}`),
    ]),
    report.comparativeBenchmark.description,
  ].join("\n\n");
}

/** Standalone UTF-8 document: can be kept offline or printed to PDF. No scripts or remote assets. */
export function reportHtml(report: ComprehensiveReport, slug: string, locale: string): string {
  const e = escapeHtml;
  return `<!doctype html><html lang="${e(locale)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Meqyro — ${e(slug)}</title><style>body{font:17px/1.7 system-ui,sans-serif;color:#24332d;background:#fafaf6;max-width:760px;margin:40px auto;padding:24px}h1,h2{line-height:1.25}header{border-bottom:2px solid #315748}section{padding:20px 0;border-bottom:1px solid #ddd}small{color:#53635b}@media print{body{margin:0;background:white}section{break-inside:avoid}}</style></head><body><header><small>MEQYRO · ${e(slug)}</small><h1>${e(report.bandLabel)}</h1></header><p>${e(report.executiveSummary)}</p>${report.sections.map((s) => `<section><h2>${e(s.title)}</h2><p>${e(s.summary)}</p>${s.paragraphs.map((p) => `<p>${e(p)}</p>`).join("")}<ul>${s.keyTakeaways.map((item) => `<li>${e(item)}</li>`).join("")}</ul><ul>${s.actionItems.map((a) => `<li>${e(a)}</li>`).join("")}</ul></section>`).join("")}<footer><p><small>${e(report.comparativeBenchmark.description)}</small></p></footer></body></html>`;
}
