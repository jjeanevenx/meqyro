import "server-only";
import type { ComprehensiveReport } from "./contracts";

const labels = {
  pt: [
    "Tempo e precisão",
    "Tempo médio",
    "No prazo",
    "Expiradas",
    "Precisão",
    "Média por dificuldade",
    "Recuperação de informações",
    "Estas métricas descrevem esta tentativa. Rapidez isolada não comprova memória ou atenção; não são diagnóstico nem avaliação psicométrica validada.",
    "Pratique com precisão antes de buscar maior velocidade.",
    "EASY: fácil; MEDIUM: média; HARD: difícil; VERY_HARD: muito difícil; UNKNOWN: não informada.",
  ],
  en: [
    "Time and accuracy",
    "Average time",
    "Within deadline",
    "Timed out",
    "Accuracy",
    "Average by difficulty",
    "Information recall",
    "These metrics describe this attempt. Speed alone does not establish memory or attention; this is not a diagnosis or validated psychometric assessment.",
    "Practice accuracy before aiming for greater speed.",
    "EASY: easy; MEDIUM: medium; HARD: hard; VERY_HARD: very hard; UNKNOWN: unspecified.",
  ],
  es: [
    "Tiempo y precisión",
    "Tiempo medio",
    "Dentro del plazo",
    "Expiradas",
    "Precisión",
    "Media por dificultad",
    "Recuperación de información",
    "Estas métricas describen este intento. La rapidez por sí sola no demuestra memoria o atención; no son un diagnóstico ni una evaluación psicométrica validada.",
    "Practica la precisión antes de buscar mayor velocidad.",
    "EASY: fácil; MEDIUM: media; HARD: difícil; VERY_HARD: muy difícil; UNKNOWN: sin especificar.",
  ],
  fr: [
    "Temps et précision",
    "Temps moyen",
    "Dans le délai",
    "Expirées",
    "Précision",
    "Moyenne par difficulté",
    "Rappel des informations",
    "Ces mesures décrivent cette tentative. La rapidité seule ne démontre pas la mémoire ou l’attention ; il ne s’agit pas d’un diagnostic ni d’une évaluation psychométrique validée.",
    "Travaillez la précision avant de rechercher la vitesse.",
    "EASY : facile ; MEDIUM : moyenne ; HARD : difficile ; VERY_HARD : très difficile ; UNKNOWN : non précisée.",
  ],
};

export function timingReportSection(
  value: unknown,
  locale: string,
): ComprehensiveReport["sections"][number] | null {
  if (!value || typeof value !== "object") return null;
  const t = value as Record<string, unknown>;
  if (typeof t.measuredQuestions !== "number" || !t.measuredQuestions) return null;
  const c = labels[locale === "en" || locale === "es" || locale === "fr" ? locale : "pt"];
  const seconds = (ms: unknown) =>
    typeof ms === "number" && Number.isFinite(ms) ? `${(ms / 1000).toFixed(1)} s` : "—";
  const difficultyNames: Record<string, Record<string, string>> = {
    pt: {
      EASY: "Fáceis",
      MEDIUM: "Médias",
      HARD: "Difíceis",
      VERY_HARD: "Muito difíceis",
      UNKNOWN: "Sem classificação",
    },
    en: {
      EASY: "Easy",
      MEDIUM: "Medium",
      HARD: "Hard",
      VERY_HARD: "Very hard",
      UNKNOWN: "Unclassified",
    },
    es: {
      EASY: "Fáciles",
      MEDIUM: "Medias",
      HARD: "Difíciles",
      VERY_HARD: "Muy difíciles",
      UNKNOWN: "Sin clasificación",
    },
    fr: {
      EASY: "Faciles",
      MEDIUM: "Moyennes",
      HARD: "Difficiles",
      VERY_HARD: "Très difficiles",
      UNKNOWN: "Sans classement",
    },
  };
  const names = difficultyNames[locale] ?? difficultyNames.pt;
  const byDifficulty =
    t.averageByDifficultyMs && typeof t.averageByDifficultyMs === "object"
      ? Object.entries(t.averageByDifficultyMs)
          .map(([key, ms]) => `${names[key] ?? names.UNKNOWN}: ${seconds(ms)}`)
          .join("; ")
      : "—";
  const memory = t.memory as
    { total?: number; correct?: number; averageResponseTimeMs?: number } | undefined;
  return {
    id: "brainrank-timing",
    title: c[0],
    summary: `${c[1]}: ${seconds(t.averageResponseTimeMs)}. ${c[2]}: ${t.completedInTimePercent}%. ${c[3]}: ${t.timeouts}.`,
    paragraphs: [
      `${c[4]}: ${t.accuracyPercent}%. ${c[5]}: ${byDifficulty}.`,
      ...(memory?.total
        ? [
            `${c[6]}: ${memory.correct}/${memory.total}; ${c[1]}: ${seconds(memory.averageResponseTimeMs)}.`,
          ]
        : []),
      c[7],
    ],
    keyTakeaways: [],
    actionItems: [c[8]],
  };
}
