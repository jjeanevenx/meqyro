import "server-only";
import type { ComprehensiveReport } from "@/features/results/contracts";
import type { BilateralCoupleComparison } from "@/features/scoring/coupledna";
import { getDimensionLabel } from "@/lib/i18n/dimension-labels";
import type { Locale } from "@/lib/i18n/config";

const words = {
  pt: {
    title: "Como vocês enxergam a relação",
    overall: "Proximidade entre as respostas",
    explanation:
      "Este índice compara as respostas dos dois participantes. Quanto maior, mais parecidas foram as percepções declaradas. Ele não mede a qualidade da relação, não prevê seu futuro e não é uma avaliação clínica.",
    similar:
      "As respostas de vocês ficaram próximas neste tema. Isso pode facilitar a conversa, mas vale conferir se os dois entendem as situações da mesma maneira.",
    different:
      "Vocês descreveram experiências diferentes neste tema. A diferença é um convite para entender o ponto de vista de cada um, sem procurar quem está certo.",
    action:
      "Cada pessoa conta uma situação recente sobre este tema. A outra resume o que ouviu antes de responder. Depois, combinem uma pequena mudança e retomem a conversa em uma semana.",
    source: "Comparação autorizada das duas tentativas",
    summary:
      "Abaixo, vocês encontram a proximidade das respostas em cada tema, o que esse resultado pode significar e uma forma prática de conversar sobre ele.",
  },
  en: {
    title: "How you each see the relationship",
    overall: "Similarity between your answers",
    explanation:
      "This index compares both participants' reported perceptions. Higher means more similar answers. It does not measure relationship quality, predict its future or provide a clinical assessment.",
    similar:
      "Your answers were close on this topic. This may help conversation, but check whether you both understand the situations in the same way.",
    different:
      "You described different experiences on this topic. Use the difference to understand each other's perspective, without deciding who is right.",
    action:
      "Each person describes a recent situation on this topic. The other summarises what they heard before responding. Agree on one small change and revisit it in a week.",
    source: "Consented comparison of both assessments",
    summary:
      "Each topic below includes the similarity of your answers, what that may mean, and a practical conversation exercise.",
  },
  es: {
    title: "Cómo ven su relación",
    overall: "Cercanía entre sus respuestas",
    explanation:
      "Este índice compara las percepciones declaradas por ambas personas. Un valor mayor significa respuestas más parecidas. No mide la calidad de la relación, no predice su futuro ni es una evaluación clínica.",
    similar:
      "Sus respuestas fueron cercanas en este tema. Puede facilitar el diálogo, pero comprueben si entienden las situaciones de la misma manera.",
    different:
      "Describieron experiencias diferentes en este tema. Aprovechen la diferencia para comprender la perspectiva de cada persona, sin buscar quién tiene razón.",
    action:
      "Cada persona describe una situación reciente sobre este tema. La otra resume lo escuchado antes de responder. Acuerden un pequeño cambio y conversen de nuevo en una semana.",
    source: "Comparación autorizada de ambos tests",
    summary:
      "Cada tema incluye la cercanía de sus respuestas, su posible significado y una propuesta práctica para conversar.",
  },
  fr: {
    title: "Vos regards sur la relation",
    overall: "Proximité entre vos réponses",
    explanation:
      "Cet indice compare les perceptions déclarées par les deux personnes. Un score élevé signifie des réponses plus similaires. Il ne mesure pas la qualité de la relation, ne prédit pas son avenir et ne constitue pas une évaluation clinique.",
    similar:
      "Vos réponses étaient proches sur ce thème. Cela peut faciliter le dialogue, mais vérifiez que vous comprenez les situations de la même façon.",
    different:
      "Vous avez décrit des expériences différentes sur ce thème. Utilisez cette différence pour comprendre chaque point de vue, sans chercher qui a raison.",
    action:
      "Chacun décrit une situation récente sur ce thème. L'autre résume ce qu'il a entendu avant de répondre. Convenez d'un petit changement et reparlez-en dans une semaine.",
    source: "Comparaison consentie des deux tests",
    summary:
      "Chaque thème présente la proximité de vos réponses, sa signification possible et un exercice concret de dialogue.",
  },
};

export function buildCoupleReport(
  comparison: BilateralCoupleComparison,
  language: string,
): ComprehensiveReport {
  const locale: Locale =
    language === "en" || language === "es" || language === "fr" ? language : "pt";
  const t = words[locale];
  return {
    bandLabel: t.title,
    executiveSummary: `${t.overall}: ${comparison.overallAlignmentPercentage}/100. ${t.summary}`,
    comparativeBenchmark: { cohort: t.source, description: t.explanation },
    sections: [
      {
        id: "bilateral-overall",
        title: t.overall,
        summary: `${comparison.overallAlignmentPercentage}/100`,
        paragraphs: [t.explanation],
        keyTakeaways: [],
        actionItems: [],
      },
      ...Object.entries(comparison.dimensionAlignments).map(([key, value]) => ({
        id: `bilateral-${key.toLowerCase()}`,
        title: getDimensionLabel(key, locale),
        summary: `${value}/100. ${value >= 70 ? t.similar : t.different}`,
        paragraphs: [t.explanation],
        keyTakeaways: [],
        actionItems: [t.action],
      })),
    ],
  };
}
