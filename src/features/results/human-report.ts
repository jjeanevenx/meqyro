import "server-only";
import type { ComprehensiveReport } from "./contracts";
import { getDimensionLabel } from "@/lib/i18n/dimension-labels";
import type { Locale } from "@/lib/i18n/config";
import { getDimensionGuidance } from "@/features/results/dimension-guidance-locales";

const copy = {
  pt: {
    title: "O que suas respostas mostram",
    high: "Foi um dos seus indicadores mais presentes neste teste.",
    mid: "Este indicador apareceu de forma moderada nas suas respostas.",
    low: "Este indicador apareceu menos nas suas respostas neste teste.",
    performanceHigh: "Você acertou a maior parte dos itens desta dimensão.",
    performanceMid: "Você acertou parte dos itens desta dimensão, com espaço para praticar.",
    performanceLow: "Os itens desta dimensão foram mais difíceis para você nesta tentativa.",
    caveat:
      "Este resultado descreve esta tentativa. Sono, distrações e familiaridade com as perguntas podem influenciar as respostas. Não define sua capacidade nem substitui avaliação profissional.",
    profileCaveat:
      "Estes índices resumem suas preferências declaradas. Um valor maior não significa ser melhor: diferentes contextos pedem formas diferentes de agir. Não são percentis populacionais nem diagnósticos.",
    next: "Como experimentar na prática",
    memory: "Memória após outras perguntas",
    memoryCaveat:
      "É uma observação de apenas três exercícios, sem controle das condições. Não mede sua memória de forma clínica e não altera seu perfil de foco.",
    memoryAction:
      "Ao precisar lembrar algo, agrupe os detalhes e tente recuperá-los depois de uma pausa, sem consultar a anotação.",
    action:
      "Escolha uma situação desta semana relacionada a este indicador. Observe o que ajuda e o que atrapalha, experimente um pequeno ajuste e compare como se sentiu.",
    practice:
      "Pratique alguns itens desta área sem pressa. Confira os erros e explique para si mesmo o caminho da solução antes de tentar novamente.",
    summary:
      "Seu resultado mostra como você respondeu às perguntas deste teste. Abaixo, cada indicador é explicado separadamente, com sugestões que você pode experimentar no dia a dia.",
    score: "Nesta tentativa, seu índice foi",
    correct: "acertos",
    missing: "Não há indicadores suficientes para interpretar este resultado com segurança.",
  },
  en: {
    title: "What your answers show",
    high: "This was one of your more prominent indicators in this assessment.",
    mid: "This indicator appeared moderately in your answers.",
    low: "This indicator appeared less often in your answers.",
    performanceHigh: "You answered most items in this dimension correctly.",
    performanceMid: "You answered some items correctly, with room to practise.",
    performanceLow: "Items in this dimension were harder for you in this attempt.",
    caveat:
      "This result describes this attempt. Sleep, distractions and familiarity can affect answers. It does not define your ability or replace professional assessment.",
    profileCaveat:
      "These indices summarise your reported preferences. Higher does not mean better: different contexts call for different approaches. These are not population percentiles or diagnoses.",
    next: "Try this in everyday life",
    memory: "Recall after other questions",
    memoryCaveat:
      "This is an observation from only three exercises under uncontrolled conditions. It is not a clinical measure of memory and does not change your focus profile.",
    memoryAction:
      "Group important details and try recalling them after a break, without checking your notes.",
    action:
      "Choose a situation this week related to this indicator. Notice what helps and what gets in the way, try one small adjustment and compare how it felt.",
    practice:
      "Practise a few items in this area without rushing. Review mistakes and explain the solution to yourself before trying again.",
    summary:
      "Your result reflects your answers in this assessment. Each indicator below includes a plain explanation and a practical suggestion.",
    score: "In this attempt, your index was",
    correct: "correct answers",
    missing: "There are not enough indicators to interpret this result reliably.",
  },
  es: {
    title: "Qué muestran tus respuestas",
    high: "Fue uno de tus indicadores más presentes.",
    mid: "Este indicador apareció de forma moderada.",
    low: "Este indicador apareció menos en tus respuestas.",
    performanceHigh: "Acertaste la mayoría de los ejercicios de esta dimensión.",
    performanceMid: "Acertaste parte de los ejercicios; puedes seguir practicando.",
    performanceLow: "Esta dimensión fue más difícil en este intento.",
    caveat:
      "El resultado describe este intento. El sueño, las distracciones y la familiaridad influyen. No define tu capacidad ni sustituye una evaluación profesional.",
    profileCaveat:
      "Los índices resumen tus preferencias declaradas. Un valor mayor no significa ser mejor. No son percentiles poblacionales ni diagnósticos.",
    next: "Cómo probarlo en la práctica",
    memory: "Memoria después de otras preguntas",
    memoryCaveat:
      "Son solo tres ejercicios sin condiciones controladas. No es una medida clínica de memoria ni cambia tu perfil de foco.",
    memoryAction:
      "Agrupa los detalles importantes y recuérdalos tras una pausa sin consultar notas.",
    action:
      "Elige una situación de esta semana relacionada con este indicador. Observa qué ayuda, prueba un pequeño cambio y compara cómo te sentiste.",
    practice:
      "Practica sin prisa. Revisa los errores y explica el camino de la solución antes de volver a intentarlo.",
    summary:
      "Tu resultado refleja tus respuestas en este test. Cada indicador incluye una explicación clara y una sugerencia práctica.",
    score: "En este intento, tu índice fue",
    correct: "aciertos",
    missing: "No hay suficientes indicadores para interpretar este resultado.",
  },
  fr: {
    title: "Ce que montrent vos réponses",
    high: "Cet indicateur était parmi les plus présents.",
    mid: "Cet indicateur était modérément présent.",
    low: "Cet indicateur était moins présent dans vos réponses.",
    performanceHigh: "Vous avez réussi la plupart des exercices de cette dimension.",
    performanceMid:
      "Vous avez réussi une partie des exercices ; vous pouvez encore vous entraîner.",
    performanceLow: "Cette dimension était plus difficile lors de cette tentative.",
    caveat:
      "Le résultat décrit cette tentative. Le sommeil, les distractions et la familiarité peuvent influencer les réponses. Il ne définit pas vos capacités et ne remplace pas une évaluation professionnelle.",
    profileCaveat:
      "Ces indices résument vos préférences déclarées. Plus élevé ne signifie pas meilleur. Ce ne sont ni des percentiles de population ni des diagnostics.",
    next: "À essayer au quotidien",
    memory: "Mémoire après d’autres questions",
    memoryCaveat:
      "Il s’agit de trois exercices sans conditions contrôlées. Ce n’est pas une mesure clinique de mémoire et cela ne modifie pas votre profil de concentration.",
    memoryAction:
      "Regroupez les détails importants puis essayez de les rappeler après une pause sans consulter vos notes.",
    action:
      "Choisissez une situation de cette semaine liée à cet indicateur. Observez ce qui aide, essayez un petit changement et comparez votre ressenti.",
    practice:
      "Entraînez-vous sans vous presser. Examinez vos erreurs et expliquez la solution avant de réessayer.",
    summary:
      "Votre résultat reflète vos réponses à ce test. Chaque indicateur comporte une explication claire et une suggestion pratique.",
    score: "Lors de cette tentative, votre indice était",
    correct: "réponses correctes",
    missing: "Il n’y a pas assez d’indicateurs pour interpréter ce résultat.",
  },
};

export function buildHumanReport(
  slug: string,
  score: Record<string, unknown>,
  language: string,
): ComprehensiveReport {
  const locale: Locale =
    language === "en" || language === "es" || language === "fr" ? language : "pt";
  const t = copy[locale];
  const raw =
    score.dimensionScores ?? score.archetypeScores ?? score.styleScores ?? score.styleDistribution;
  const dimensions =
    raw && typeof raw === "object"
      ? Object.entries(raw).filter(
          (entry): entry is [string, number] =>
            typeof entry[1] === "number" && Number.isFinite(entry[1]),
        )
      : [];
  const cognitive = slug === "brainrank";
  const explanation = cognitive ? t.caveat : t.profileCaveat;
  const sections = dimensions.map(([key, value]) => {
    const guidance = getDimensionGuidance(key, locale);
    const interpretation = cognitive
      ? value >= 75
        ? t.performanceHigh
        : value >= 40
          ? t.performanceMid
          : t.performanceLow
      : value >= 70
        ? t.high
        : value >= 40
          ? t.mid
          : t.low;
    return {
      id: key.toLowerCase(),
      title: getDimensionLabel(key, locale),
      summary: `${Math.round(value)}/100. ${interpretation}`,
      paragraphs: guidance ? [guidance.meaning, guidance.watch, explanation] : [explanation],
      keyTakeaways: [interpretation],
      actionItems: [guidance ? guidance.try : cognitive ? t.practice : t.action],
    };
  });
  const memory = score.memoryRecall as { correct?: number; total?: number } | undefined;
  if (
    memory &&
    typeof memory.correct === "number" &&
    typeof memory.total === "number" &&
    memory.total > 0
  ) {
    sections.push({
      id: "delayed-memory",
      title: t.memory,
      summary: `${memory.correct}/${memory.total} ${t.correct}.`,
      paragraphs: [t.memoryCaveat],
      keyTakeaways: [],
      actionItems: [t.memoryAction],
    });
  }
  const overall =
    typeof score.overallScore === "number" ? `${t.score} ${score.overallScore}/1000. ` : "";
  return {
    executiveSummary: `${overall}${dimensions.length ? t.summary : t.missing}`,
    bandLabel: t.title,
    sections,
    comparativeBenchmark: { cohort: t.title, description: explanation },
  };
}
