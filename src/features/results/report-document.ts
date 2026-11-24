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
  const labels = {
    pt: {
      summary: "Síntese do resultado",
      evidence: "Evidências e pontos de atenção",
      actions: "Plano de ação",
      limits: "Como interpretar este relatório",
    },
    en: {
      summary: "Result summary",
      evidence: "Evidence and key observations",
      actions: "Action plan",
      limits: "How to interpret this report",
    },
    es: {
      summary: "Síntesis del resultado",
      evidence: "Evidencias y puntos de atención",
      actions: "Plan de acción",
      limits: "Cómo interpretar este informe",
    },
    fr: {
      summary: "Synthèse du résultat",
      evidence: "Éléments observés et points d’attention",
      actions: "Plan d’action",
      limits: "Comment interpréter ce rapport",
    },
  }[locale === "en" || locale === "es" || locale === "fr" ? locale : "pt"];
  const product =
    (
      { brainrank: "BrainRank", moneydna: "MoneyDNA", coupledna: "CoupleDNA" } as Record<
        string,
        string
      >
    )[slug] ?? slug;
  return `<!doctype html><html lang="${e(locale)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Meqyro — ${e(product)}</title><style>body{font:17px/1.7 system-ui,sans-serif;color:#24332d;background:#fafaf6;max-width:760px;margin:40px auto;padding:24px}h1,h2{line-height:1.25}header{border-bottom:2px solid #315748}section{padding:20px 0;border-bottom:1px solid #ddd}small{color:#53635b}@media print{body{margin:0;background:white}section{break-inside:avoid}}</style></head><body><header><small>MEQYRO · ${e(product)}</small><h1>${e(report.bandLabel)}</h1></header><h2>${e(labels.summary)}</h2><p>${e(report.executiveSummary)}</p>${report.sections.map((s) => `<section><h2>${e(s.title)}</h2><p>${e(s.summary)}</p>${s.paragraphs.map((p) => `<p>${e(p)}</p>`).join("")}${s.keyTakeaways.length ? `<h3>${e(labels.evidence)}</h3><ul>${s.keyTakeaways.map((item) => `<li>${e(item)}</li>`).join("")}</ul>` : ""}${s.actionItems.length ? `<h3>${e(labels.actions)}</h3><ul>${s.actionItems.map((a) => `<li>${e(a)}</li>`).join("")}</ul>` : ""}</section>`).join("")}<footer><h2>${e(labels.limits)}</h2><p><small>${e(report.comparativeBenchmark.description)}</small></p></footer></body></html>`;
}
