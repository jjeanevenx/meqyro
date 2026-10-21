import "server-only";
import { moneyDnaScenarios } from "@/content/quizzes/moneydna-v2";
import { coupleDnaScenarios } from "@/content/quizzes/coupledna-v2";
import type { Locale } from "@/lib/i18n/config";
import { getDimensionLabel } from "@/lib/i18n/dimension-labels";
import type { BehavioralScore } from "@/features/scoring/behavioral-v2";
import type { ComprehensiveReport } from "./contracts";
import { getDimensionGuidance } from "./dimension-guidance-locales";

const copy = {
  pt: {
    title: "Suas decisões em contexto",
    evidence: "Escolhas que sustentam esta leitura",
    varied:
      "Você variou sua estratégia entre situações; isso pode refletir prioridades diferentes em cada contexto.",
    limit:
      "Índices descritivos desta tentativa, sem normas populacionais ou validação clínica. Uma preferência não é uma qualidade superior nem uma característica permanente.",
    individual:
      "Esta leitura descreve somente suas escolhas. Não revela sentimentos ou opiniões da outra pessoa nem mede compatibilidade.",
    money:
      "As prioridades financeiras competem entre si; o índice considera quantas vezes cada prioridade estava disponível. Não mede riqueza ou conhecimento e não recomenda investimentos.",
    selected: "Você escolheu",
    observed: "situações observadas",
    balanced:
      "Nenhuma prioridade deve ser tratada como um perfil exclusivo. Considere também as outras estratégias que você escolheu.",
    poles:
      "Neste tema, o índice vai de refletir e definir limites individualmente (0) a elaborar explicitamente em conjunto (100). Ambos podem ser úteis; o momento e os limites importam.",
    tryMoney:
      "Nesta semana, registre uma decisão deste tema: o que você preservou e o que adiou? Experimente uma alternativa com um limite de gasto previamente definido e compare o efeito no seu objetivo.",
    tryCouple:
      "Escolha uma das situações abaixo. Conte o que sua escolha buscaria preservar e pergunte como a outra pessoa preferiria agir, sem presumir a resposta. Combinem um pequeno experimento e revisitem em uma semana.",
  },
  en: {
    title: "Your decisions in context",
    evidence: "Choices behind this reading",
    varied:
      "Your strategy varied across situations; different contexts may bring different priorities.",
    limit:
      "Descriptive indices for this attempt, without population norms or clinical validation. A preference is neither superior nor a permanent trait.",
    individual:
      "This reading describes only your choices. It does not reveal your partner’s feelings or views or measure compatibility.",
    money:
      "Financial priorities compete; the index accounts for how often each was available. It measures neither wealth nor knowledge and makes no investment recommendations.",
    selected: "You chose",
    observed: "observed situations",
    balanced:
      "No priority should be treated as an exclusive profile. Consider the other strategies you chose too.",
    poles:
      "For this topic, the index ranges from individual reflection and boundary-setting (0) to explicit joint discussion (100). Either can help; timing and boundaries matter.",
    tryMoney:
      "Record a decision on this topic this week: what did you preserve and postpone? Try an alternative within a spending limit set beforehand and compare its effect on your goal.",
    tryCouple:
      "Choose a situation below. Explain what your choice would preserve and ask how your partner would prefer to act, without assuming the answer. Agree on a small experiment and review it in a week.",
  },
  es: {
    title: "Tus decisiones en contexto",
    evidence: "Elecciones que sustentan esta lectura",
    varied:
      "Tu estrategia varió entre situaciones; cada contexto puede activar prioridades diferentes.",
    limit:
      "Índices descriptivos de este intento, sin normas poblacionales ni validación clínica. Una preferencia no es superior ni un rasgo permanente.",
    individual:
      "Esta lectura describe solo tus elecciones. No revela los sentimientos u opiniones de tu pareja ni mide compatibilidad.",
    money:
      "Las prioridades financieras compiten; el índice considera cuántas veces cada una estaba disponible. No mide riqueza ni conocimientos ni recomienda inversiones.",
    selected: "Elegiste",
    observed: "situaciones observadas",
    balanced:
      "Ninguna prioridad debe tratarse como un perfil exclusivo. Considera también las otras estrategias que elegiste.",
    poles:
      "En este tema, el índice va de reflexión y límites individuales (0) a elaboración conjunta explícita (100). Ambos enfoques pueden ayudar; importan el momento y los límites.",
    tryMoney:
      "Registra una decisión de este tema esta semana: ¿qué conservaste y aplazaste? Prueba una alternativa con un límite de gasto previo y compara su efecto en tu meta.",
    tryCouple:
      "Elige una situación de abajo. Explica qué preservaría tu elección y pregunta cómo preferiría actuar tu pareja, sin suponer la respuesta. Acuerden un pequeño experimento y revísenlo en una semana.",
  },
  fr: {
    title: "Vos décisions en contexte",
    evidence: "Les choix qui fondent cette lecture",
    varied:
      "Votre stratégie varie selon les situations ; chaque contexte peut mobiliser des priorités différentes.",
    limit:
      "Indices descriptifs de cette tentative, sans normes de population ni validation clinique. Une préférence n’est ni supérieure ni un trait permanent.",
    individual:
      "Cette lecture décrit uniquement vos choix. Elle ne révèle pas les sentiments ou avis de l’autre et ne mesure pas la compatibilité.",
    money:
      "Les priorités financières se concurrencent ; l’indice tient compte de leur disponibilité. Il ne mesure ni richesse ni connaissances et ne recommande aucun investissement.",
    selected: "Vous avez choisi",
    observed: "situations observées",
    balanced:
      "Aucune priorité ne doit être considérée comme un profil exclusif. Considérez aussi vos autres stratégies.",
    poles:
      "Pour ce thème, l’indice va de la réflexion et des limites individuelles (0) à l’élaboration explicitement commune (100). Les deux peuvent aider ; le moment et les limites comptent.",
    tryMoney:
      "Notez une décision sur ce thème cette semaine : qu’avez-vous préservé et reporté ? Essayez une alternative avec une limite de dépense fixée à l’avance et comparez l’effet sur votre objectif.",
    tryCouple:
      "Choisissez une situation ci-dessous. Expliquez ce que votre choix préserverait et demandez ce que l’autre préférerait faire, sans présumer sa réponse. Convenez d’un petit essai à revoir dans une semaine.",
  },
};

export function buildBehavioralReport(
  slug: string,
  score: BehavioralScore,
  locale: Locale,
): ComprehensiveReport {
  const t = copy[locale],
    money = slug === "moneydna";
  const source = money ? moneyDnaScenarios : coupleDnaScenarios;
  const experienceMeaning = {
    pt: "Estas escolhas priorizaram experiências presentes. Não estimam sua tolerância a riscos financeiros ou a investimentos.",
    en: "These choices prioritised present experiences. They do not estimate your tolerance for financial or investment risk.",
    es: "Estas elecciones priorizaron experiencias presentes. No estiman tu tolerancia al riesgo financiero ni de inversión.",
    fr: "Ces choix privilégient les expériences présentes. Ils n’estiment pas votre tolérance au risque financier ou d’investissement.",
  }[locale];
  const evidence = score.evidence.flatMap((e) => {
    const question = source.find((q) => q.stableKey === e.questionKey);
    const option = question?.options.find((o) => o.stableKey === e.optionKey);
    return question && option ? [{ question, option }] : [];
  });
  return {
    bandLabel: t.title,
    executiveSummary: `${t.title}. ${money ? t.money : t.individual} ${t.balanced}`,
    comparativeBenchmark: { cohort: "v2.0.0 · behavioral-v2", description: t.limit },
    sections: Object.entries(score.dimensionScores).map(([dimension, value]) => {
      const guidance = money ? getDimensionGuidance(dimension, locale) : undefined;
      return {
        id: `behavioral-${dimension.toLowerCase()}`,
        title: getDimensionLabel(dimension, locale),
        summary: `${value}/100 · ${score.observations[dimension]} ${t.observed}`,
        paragraphs: [
          money ? t.money : t.poles,
          ...(guidance
            ? [dimension === "ADVENTURER" ? experienceMeaning : guidance.meaning, guidance.watch]
            : []),
          t.limit,
          ...(score.contextDependentDimensions.includes(dimension) ? [t.varied] : []),
        ],
        keyTakeaways: evidence
          .filter(({ question, option }) =>
            money ? (option.signals[dimension] ?? 0) > 0 : question.dimension === dimension,
          )
          .map(
            ({ question, option }) =>
              `${question.prompt[locale]} ${t.selected}: ${option.label[locale]}`,
          ),
        actionItems: money
          ? [guidance ? guidance.try : t.tryMoney]
          : [getDimensionGuidance(dimension, locale)?.try ?? t.tryCouple, t.tryCouple],
      };
    }),
  };
}
