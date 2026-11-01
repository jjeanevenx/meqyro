import type { ScenarioDefinition } from "./behavioral-scenario";

/** Immutable snapshot of the expansion applied to homologation on 2026-11-01. Historical use only. */
export const legacyExpandedScenarios: readonly ScenarioDefinition[] = [
  {
    stableKey: "CD2_21",
    position: 21,
    dimension: "COMMUNICATION",
    difficulty: "EASY",
    prompt: {
      en: "Your message was understood as a demand. What would your first step be?",
      es: "Un mensaje tuyo se entendió como exigencia. ¿Cuál sería tu primer paso?",
      fr: "Votre message a été compris comme un reproche. Quelle serait votre première démarche ?",
      pt: "Uma mensagem sua foi entendida como cobrança. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_21_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          COMMUNICATION: 1,
        },
      },
      {
        stableKey: "CD2_21_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          COMMUNICATION: 2,
        },
      },
      {
        stableKey: "CD2_21_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          COMMUNICATION: 3,
        },
      },
      {
        stableKey: "CD2_21_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          COMMUNICATION: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_22",
    position: 22,
    dimension: "COMMUNICATION",
    difficulty: "EASY",
    prompt: {
      en: "You want to discuss a hard day while your partner is busy. What would your first step be?",
      es: "Quieres hablar de un día difícil mientras tu pareja está ocupada. ¿Cuál sería tu primer paso?",
      fr: "Vous voulez parler d’une journée difficile alors que l’autre est occupé. Quelle serait votre première démarche ?",
      pt: "Você quer falar de um dia difícil enquanto a outra pessoa está ocupada. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_22_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          COMMUNICATION: 3,
        },
      },
      {
        stableKey: "CD2_22_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          COMMUNICATION: 0,
        },
      },
      {
        stableKey: "CD2_22_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          COMMUNICATION: 1,
        },
      },
      {
        stableKey: "CD2_22_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          COMMUNICATION: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_23",
    position: 23,
    dimension: "COMMUNICATION",
    difficulty: "EASY",
    prompt: {
      en: "A joke in public made you uncomfortable. What would your first step be?",
      es: "Una broma en público te hizo sentir mal. ¿Cuál sería tu primer paso?",
      fr: "Une plaisanterie en public vous a mis mal à l’aise. Quelle serait votre première démarche ?",
      pt: "Uma brincadeira feita em público deixou você desconfortável. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_23_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          COMMUNICATION: 1,
        },
      },
      {
        stableKey: "CD2_23_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          COMMUNICATION: 2,
        },
      },
      {
        stableKey: "CD2_23_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          COMMUNICATION: 3,
        },
      },
      {
        stableKey: "CD2_23_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          COMMUNICATION: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_24",
    position: 24,
    dimension: "COMMUNICATION",
    difficulty: "MEDIUM",
    prompt: {
      en: "You have different preferences about messages during work. What would your first step be?",
      es: "Tenéis preferencias distintas sobre mensajes durante el trabajo. ¿Cuál sería tu primer paso?",
      fr: "Vous avez des préférences différentes pour les messages au travail. Quelle serait votre première démarche ?",
      pt: "Vocês têm preferências diferentes sobre mensagens durante o trabalho. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_24_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          COMMUNICATION: 3,
        },
      },
      {
        stableKey: "CD2_24_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          COMMUNICATION: 0,
        },
      },
      {
        stableKey: "CD2_24_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          COMMUNICATION: 1,
        },
      },
      {
        stableKey: "CD2_24_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          COMMUNICATION: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_25",
    position: 25,
    dimension: "COMMUNICATION",
    difficulty: "MEDIUM",
    prompt: {
      en: "You miss hearing appreciation for something you did. What would your first step be?",
      es: "Echas de menos reconocimiento por algo que hiciste. ¿Cuál sería tu primer paso?",
      fr: "Vous aimeriez entendre de la reconnaissance pour quelque chose que vous avez fait. Quelle serait votre première démarche ?",
      pt: "Você sente falta de ouvir reconhecimento por algo que fez. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_25_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          COMMUNICATION: 1,
        },
      },
      {
        stableKey: "CD2_25_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          COMMUNICATION: 2,
        },
      },
      {
        stableKey: "CD2_25_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          COMMUNICATION: 3,
        },
      },
      {
        stableKey: "CD2_25_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          COMMUNICATION: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_26",
    position: 26,
    dimension: "COMMUNICATION",
    difficulty: "MEDIUM",
    prompt: {
      en: "Your partner asks your opinion while you still feel unsure. What would your first step be?",
      es: "Tu pareja pide tu opinión cuando aún tienes dudas. ¿Cuál sería tu primer paso?",
      fr: "L’autre vous demande votre avis alors que vous hésitez encore. Quelle serait votre première démarche ?",
      pt: "A outra pessoa pede sua opinião enquanto você ainda está confuso. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_26_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          COMMUNICATION: 3,
        },
      },
      {
        stableKey: "CD2_26_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          COMMUNICATION: 0,
        },
      },
      {
        stableKey: "CD2_26_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          COMMUNICATION: 1,
        },
      },
      {
        stableKey: "CD2_26_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          COMMUNICATION: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_27",
    position: 27,
    dimension: "COMMUNICATION",
    difficulty: "HARD",
    prompt: {
      en: "An important conversation was interrupted several times. What would your first step be?",
      es: "Una conversación importante se interrumpió varias veces. ¿Cuál sería tu primer paso?",
      fr: "Une conversation importante a été interrompue plusieurs fois. Quelle serait votre première démarche ?",
      pt: "Uma conversa importante foi interrompida várias vezes. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_27_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          COMMUNICATION: 1,
        },
      },
      {
        stableKey: "CD2_27_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          COMMUNICATION: 2,
        },
      },
      {
        stableKey: "CD2_27_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          COMMUNICATION: 3,
        },
      },
      {
        stableKey: "CD2_27_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          COMMUNICATION: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_28",
    position: 28,
    dimension: "COMMUNICATION",
    difficulty: "HARD",
    prompt: {
      en: "You disagree about sharing relationship details with friends. What would your first step be?",
      es: "No coincidís sobre compartir detalles de pareja con amigos. ¿Cuál sería tu primer paso?",
      fr: "Vous n’êtes pas d’accord sur les détails du couple à partager avec des amis. Quelle serait votre première démarche ?",
      pt: "Vocês discordam sobre compartilhar detalhes do casal com amigos. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_28_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          COMMUNICATION: 3,
        },
      },
      {
        stableKey: "CD2_28_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          COMMUNICATION: 0,
        },
      },
      {
        stableKey: "CD2_28_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          COMMUNICATION: 1,
        },
      },
      {
        stableKey: "CD2_28_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          COMMUNICATION: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_29",
    position: 29,
    dimension: "COMMUNICATION",
    difficulty: "HARD",
    prompt: {
      en: "You want to ask for more quality time during the week. What would your first step be?",
      es: "Quieres pedir más tiempo de calidad durante la semana. ¿Cuál sería tu primer paso?",
      fr: "Vous souhaitez demander plus de temps de qualité en semaine. Quelle serait votre première démarche ?",
      pt: "Você quer pedir mais tempo de qualidade durante a semana. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_29_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          COMMUNICATION: 1,
        },
      },
      {
        stableKey: "CD2_29_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          COMMUNICATION: 2,
        },
      },
      {
        stableKey: "CD2_29_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          COMMUNICATION: 3,
        },
      },
      {
        stableKey: "CD2_29_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          COMMUNICATION: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_30",
    position: 30,
    dimension: "COMMUNICATION",
    difficulty: "HARD",
    prompt: {
      en: "A routine change made your conversations much shorter. What would your first step be?",
      es: "Un cambio de rutina acortó mucho vuestras conversaciones. ¿Cuál sería tu primer paso?",
      fr: "Un changement de routine a beaucoup raccourci vos échanges. Quelle serait votre première démarche ?",
      pt: "Uma mudança de rotina fez suas conversas ficarem muito curtas. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_30_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          COMMUNICATION: 3,
        },
      },
      {
        stableKey: "CD2_30_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          COMMUNICATION: 0,
        },
      },
      {
        stableKey: "CD2_30_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          COMMUNICATION: 1,
        },
      },
      {
        stableKey: "CD2_30_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          COMMUNICATION: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_31",
    position: 31,
    dimension: "COMMUNICATION",
    difficulty: "HARD",
    prompt: {
      en: "You receive personal news and do not yet know how to share it. What would your first step be?",
      es: "Recibes una noticia personal y aún no sabes cómo compartirla. ¿Cuál sería tu primer paso?",
      fr: "Vous recevez une nouvelle personnelle sans savoir encore comment la partager. Quelle serait votre première démarche ?",
      pt: "Você recebe uma notícia pessoal e ainda não sabe como compartilhá-la. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_31_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          COMMUNICATION: 1,
        },
      },
      {
        stableKey: "CD2_31_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          COMMUNICATION: 2,
        },
      },
      {
        stableKey: "CD2_31_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          COMMUNICATION: 3,
        },
      },
      {
        stableKey: "CD2_31_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          COMMUNICATION: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_32",
    position: 32,
    dimension: "COMMUNICATION",
    difficulty: "HARD",
    prompt: {
      en: "Your partner interprets your silence as lack of interest. What would your first step be?",
      es: "Tu pareja interpreta tu silencio como desinterés. ¿Cuál sería tu primer paso?",
      fr: "L’autre interprète votre silence comme un manque d’intérêt. Quelle serait votre première démarche ?",
      pt: "A outra pessoa interpreta seu silêncio como desinteresse. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_32_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          COMMUNICATION: 3,
        },
      },
      {
        stableKey: "CD2_32_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          COMMUNICATION: 0,
        },
      },
      {
        stableKey: "CD2_32_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          COMMUNICATION: 1,
        },
      },
      {
        stableKey: "CD2_32_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          COMMUNICATION: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_33",
    position: 33,
    dimension: "LIFE_VALUES",
    difficulty: "EASY",
    prompt: {
      en: "A family tradition important to you means little to your partner. What would your first step be?",
      es: "Una tradición familiar importante para ti no tiene sentido para tu pareja. ¿Cuál sería tu primer paso?",
      fr: "Une tradition familiale importante pour vous n’a pas de sens pour l’autre. Quelle serait votre première démarche ?",
      pt: "Uma tradição familiar importante para você não faz sentido para a outra pessoa. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_33_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          LIFE_VALUES: 1,
        },
      },
      {
        stableKey: "CD2_33_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          LIFE_VALUES: 2,
        },
      },
      {
        stableKey: "CD2_33_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          LIFE_VALUES: 3,
        },
      },
      {
        stableKey: "CD2_33_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          LIFE_VALUES: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_34",
    position: 34,
    dimension: "LIFE_VALUES",
    difficulty: "EASY",
    prompt: {
      en: "You have different preferences about practising a religion. What would your first step be?",
      es: "Tenéis preferencias distintas sobre practicar una religión. ¿Cuál sería tu primer paso?",
      fr: "Vous avez des préférences différentes concernant la pratique religieuse. Quelle serait votre première démarche ?",
      pt: "Vocês têm preferências diferentes sobre praticar uma religião. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_34_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          LIFE_VALUES: 3,
        },
      },
      {
        stableKey: "CD2_34_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          LIFE_VALUES: 0,
        },
      },
      {
        stableKey: "CD2_34_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          LIFE_VALUES: 1,
        },
      },
      {
        stableKey: "CD2_34_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          LIFE_VALUES: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_35",
    position: 35,
    dimension: "LIFE_VALUES",
    difficulty: "EASY",
    prompt: {
      en: "You want to dedicate part of the weekend to a social cause. What would your first step be?",
      es: "Quieres dedicar parte del fin de semana a una causa social. ¿Cuál sería tu primer paso?",
      fr: "Vous souhaitez consacrer une partie du week-end à une cause sociale. Quelle serait votre première démarche ?",
      pt: "Você quer dedicar parte do fim de semana a uma causa social. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_35_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          LIFE_VALUES: 1,
        },
      },
      {
        stableKey: "CD2_35_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          LIFE_VALUES: 2,
        },
      },
      {
        stableKey: "CD2_35_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          LIFE_VALUES: 3,
        },
      },
      {
        stableKey: "CD2_35_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          LIFE_VALUES: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_36",
    position: 36,
    dimension: "LIFE_VALUES",
    difficulty: "MEDIUM",
    prompt: {
      en: "You differ on how often to visit family. What would your first step be?",
      es: "No coincidís sobre la frecuencia de visitas familiares. ¿Cuál sería tu primer paso?",
      fr: "Vous divergez sur la fréquence des visites familiales. Quelle serait votre première démarche ?",
      pt: "Vocês divergem sobre a frequência de visitas à família. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_36_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          LIFE_VALUES: 3,
        },
      },
      {
        stableKey: "CD2_36_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          LIFE_VALUES: 0,
        },
      },
      {
        stableKey: "CD2_36_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          LIFE_VALUES: 1,
        },
      },
      {
        stableKey: "CD2_36_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          LIFE_VALUES: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_37",
    position: 37,
    dimension: "LIFE_VALUES",
    difficulty: "MEDIUM",
    prompt: {
      en: "A sustainable purchase requires changing a shared habit. What would your first step be?",
      es: "Una elección de consumo sostenible exige cambiar un hábito de pareja. ¿Cuál sería tu primer paso?",
      fr: "Un choix de consommation durable demande de changer une habitude commune. Quelle serait votre première démarche ?",
      pt: "Uma escolha de consumo sustentável exige mudar um hábito do casal. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_37_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          LIFE_VALUES: 1,
        },
      },
      {
        stableKey: "CD2_37_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          LIFE_VALUES: 2,
        },
      },
      {
        stableKey: "CD2_37_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          LIFE_VALUES: 3,
        },
      },
      {
        stableKey: "CD2_37_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          LIFE_VALUES: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_38",
    position: 38,
    dimension: "LIFE_VALUES",
    difficulty: "MEDIUM",
    prompt: {
      en: "You want to preserve a friendship your partner does not know. What would your first step be?",
      es: "Quieres mantener una amistad que tu pareja no conoce. ¿Cuál sería tu primer paso?",
      fr: "Vous voulez préserver une amitié que l’autre ne connaît pas. Quelle serait votre première démarche ?",
      pt: "Você quer preservar uma amizade que a outra pessoa não conhece. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_38_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          LIFE_VALUES: 3,
        },
      },
      {
        stableKey: "CD2_38_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          LIFE_VALUES: 0,
        },
      },
      {
        stableKey: "CD2_38_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          LIFE_VALUES: 1,
        },
      },
      {
        stableKey: "CD2_38_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          LIFE_VALUES: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_39",
    position: 39,
    dimension: "LIFE_VALUES",
    difficulty: "HARD",
    prompt: {
      en: "You have different views on hosting guests at home. What would your first step be?",
      es: "Tenéis ideas distintas sobre recibir visitas en casa. ¿Cuál sería tu primer paso?",
      fr: "Vous avez des avis différents sur l’accueil d’invités à la maison. Quelle serait votre première démarche ?",
      pt: "Vocês têm visões diferentes sobre receber convidados em casa. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_39_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          LIFE_VALUES: 1,
        },
      },
      {
        stableKey: "CD2_39_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          LIFE_VALUES: 2,
        },
      },
      {
        stableKey: "CD2_39_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          LIFE_VALUES: 3,
        },
      },
      {
        stableKey: "CD2_39_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          LIFE_VALUES: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_40",
    position: 40,
    dimension: "LIFE_VALUES",
    difficulty: "HARD",
    prompt: {
      en: "A family commitment competes with your rest time. What would your first step be?",
      es: "Un compromiso familiar compite con tu descanso. ¿Cuál sería tu primer paso?",
      fr: "Un engagement familial concurrence votre temps de repos. Quelle serait votre première démarche ?",
      pt: "Um compromisso familiar compete com seu tempo de descanso. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_40_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          LIFE_VALUES: 3,
        },
      },
      {
        stableKey: "CD2_40_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          LIFE_VALUES: 0,
        },
      },
      {
        stableKey: "CD2_40_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          LIFE_VALUES: 1,
        },
      },
      {
        stableKey: "CD2_40_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          LIFE_VALUES: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_41",
    position: 41,
    dimension: "LIFE_VALUES",
    difficulty: "HARD",
    prompt: {
      en: "You want to keep a personal custom after moving in together. What would your first step be?",
      es: "Quieres mantener una costumbre personal al empezar a convivir. ¿Cuál sería tu primer paso?",
      fr: "Vous souhaitez garder une habitude personnelle après l’emménagement à deux. Quelle serait votre première démarche ?",
      pt: "Você quer manter um costume pessoal após começar a morar junto. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_41_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          LIFE_VALUES: 1,
        },
      },
      {
        stableKey: "CD2_41_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          LIFE_VALUES: 2,
        },
      },
      {
        stableKey: "CD2_41_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          LIFE_VALUES: 3,
        },
      },
      {
        stableKey: "CD2_41_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          LIFE_VALUES: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_42",
    position: 42,
    dimension: "LIFE_VALUES",
    difficulty: "HARD",
    prompt: {
      en: "You disagree on exposing personal life on social media. What would your first step be?",
      es: "No coincidís sobre exponer la vida personal en redes. ¿Cuál sería tu primer paso?",
      fr: "Vous divergez sur l’exposition de la vie privée sur les réseaux. Quelle serait votre première démarche ?",
      pt: "Vocês discordam sobre a exposição da vida pessoal nas redes. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_42_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          LIFE_VALUES: 3,
        },
      },
      {
        stableKey: "CD2_42_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          LIFE_VALUES: 0,
        },
      },
      {
        stableKey: "CD2_42_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          LIFE_VALUES: 1,
        },
      },
      {
        stableKey: "CD2_42_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          LIFE_VALUES: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_43",
    position: 43,
    dimension: "LIFE_VALUES",
    difficulty: "HARD",
    prompt: {
      en: "A celebration important to you is not your partner’s priority. What would your first step be?",
      es: "Una celebración importante para ti no es prioridad para tu pareja. ¿Cuál sería tu primer paso?",
      fr: "Une fête importante pour vous n’est pas prioritaire pour l’autre. Quelle serait votre première démarche ?",
      pt: "Uma celebração importante para você não é prioridade para a outra pessoa. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_43_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          LIFE_VALUES: 1,
        },
      },
      {
        stableKey: "CD2_43_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          LIFE_VALUES: 2,
        },
      },
      {
        stableKey: "CD2_43_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          LIFE_VALUES: 3,
        },
      },
      {
        stableKey: "CD2_43_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          LIFE_VALUES: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_44",
    position: 44,
    dimension: "LIFE_VALUES",
    difficulty: "HARD",
    prompt: {
      en: "You need to balance personal privacy and shared habits. What would your first step be?",
      es: "Necesitas equilibrar privacidad personal y hábitos compartidos. ¿Cuál sería tu primer paso?",
      fr: "Vous devez concilier intimité personnelle et habitudes communes. Quelle serait votre première démarche ?",
      pt: "Você precisa equilibrar privacidade pessoal e hábitos compartilhados. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_44_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          LIFE_VALUES: 3,
        },
      },
      {
        stableKey: "CD2_44_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          LIFE_VALUES: 0,
        },
      },
      {
        stableKey: "CD2_44_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          LIFE_VALUES: 1,
        },
      },
      {
        stableKey: "CD2_44_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          LIFE_VALUES: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_45",
    position: 45,
    dimension: "CONFLICT_MANAGEMENT",
    difficulty: "EASY",
    prompt: {
      en: "An argument about household chores returns every week. What would your first step be?",
      es: "Una discusión sobre tareas domésticas se repite cada semana. ¿Cuál sería tu primer paso?",
      fr: "Une dispute sur les tâches ménagères revient chaque semaine. Quelle serait votre première démarche ?",
      pt: "Uma discussão sobre tarefas domésticas volta toda semana. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_45_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 1,
        },
      },
      {
        stableKey: "CD2_45_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 2,
        },
      },
      {
        stableKey: "CD2_45_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 3,
        },
      },
      {
        stableKey: "CD2_45_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_46",
    position: 46,
    dimension: "CONFLICT_MANAGEMENT",
    difficulty: "EASY",
    prompt: {
      en: "You notice a conversation becoming more tense. What would your first step be?",
      es: "Notáis que una conversación está ganando tensión. ¿Cuál sería tu primer paso?",
      fr: "Vous constatez qu’une conversation devient plus tendue. Quelle serait votre première démarche ?",
      pt: "Vocês percebem que uma conversa está ficando mais tensa. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_46_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 3,
        },
      },
      {
        stableKey: "CD2_46_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 0,
        },
      },
      {
        stableKey: "CD2_46_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 1,
        },
      },
      {
        stableKey: "CD2_46_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_47",
    position: 47,
    dimension: "CONFLICT_MANAGEMENT",
    difficulty: "EASY",
    prompt: {
      en: "Your partner asks to settle a disagreement before bed. What would your first step be?",
      es: "Tu pareja pide resolver un desacuerdo antes de dormir. ¿Cuál sería tu primer paso?",
      fr: "L’autre demande de régler un désaccord avant de dormir. Quelle serait votre première démarche ?",
      pt: "A outra pessoa pede para resolver um desacordo antes de dormir. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_47_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 1,
        },
      },
      {
        stableKey: "CD2_47_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 2,
        },
      },
      {
        stableKey: "CD2_47_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 3,
        },
      },
      {
        stableKey: "CD2_47_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_48",
    position: 48,
    dimension: "CONFLICT_MANAGEMENT",
    difficulty: "MEDIUM",
    prompt: {
      en: "You realise you were wrong after firmly defending your position. What would your first step be?",
      es: "Notas que te equivocaste tras defender tu postura con firmeza. ¿Cuál sería tu primer paso?",
      fr: "Vous réalisez votre erreur après avoir fermement défendu votre position. Quelle serait votre première démarche ?",
      pt: "Você percebe que errou depois de defender sua posição com firmeza. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_48_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 3,
        },
      },
      {
        stableKey: "CD2_48_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 0,
        },
      },
      {
        stableKey: "CD2_48_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 1,
        },
      },
      {
        stableKey: "CD2_48_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_49",
    position: 49,
    dimension: "CONFLICT_MANAGEMENT",
    difficulty: "MEDIUM",
    prompt: {
      en: "You remember a recent agreement differently. What would your first step be?",
      es: "Recordáis de forma distinta un acuerdo reciente. ¿Cuál sería tu primer paso?",
      fr: "Vous vous souvenez différemment d’un accord récent. Quelle serait votre première démarche ?",
      pt: "Vocês lembram de formas diferentes um acordo recente. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_49_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 1,
        },
      },
      {
        stableKey: "CD2_49_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 2,
        },
      },
      {
        stableKey: "CD2_49_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 3,
        },
      },
      {
        stableKey: "CD2_49_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_50",
    position: 50,
    dimension: "CONFLICT_MANAGEMENT",
    difficulty: "MEDIUM",
    prompt: {
      en: "A delay causes irritation before an important appointment. What would your first step be?",
      es: "Un retraso causa irritación antes de una cita importante. ¿Cuál sería tu primer paso?",
      fr: "Un retard provoque de l’irritation avant un rendez-vous important. Quelle serait votre première démarche ?",
      pt: "Um atraso gera irritação antes de um compromisso importante. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_50_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 3,
        },
      },
      {
        stableKey: "CD2_50_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 0,
        },
      },
      {
        stableKey: "CD2_50_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 1,
        },
      },
      {
        stableKey: "CD2_50_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_51",
    position: 51,
    dimension: "CONFLICT_MANAGEMENT",
    difficulty: "HARD",
    prompt: {
      en: "A comment on organisation feels harsher than expected. What would your first step be?",
      es: "Una crítica sobre organización parece más dura de lo esperado. ¿Cuál sería tu primer paso?",
      fr: "Une critique sur l’organisation vous semble plus dure que prévu. Quelle serait votre première démarche ?",
      pt: "Uma crítica sobre organização parece mais dura do que você esperava. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_51_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 1,
        },
      },
      {
        stableKey: "CD2_51_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 2,
        },
      },
      {
        stableKey: "CD2_51_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 3,
        },
      },
      {
        stableKey: "CD2_51_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_52",
    position: 52,
    dimension: "CONFLICT_MANAGEMENT",
    difficulty: "HARD",
    prompt: {
      en: "You disagree during a trip and need to continue the itinerary. What would your first step be?",
      es: "Discutís durante un viaje y necesitáis seguir el itinerario. ¿Cuál sería tu primer paso?",
      fr: "Vous divergez pendant un voyage et devez poursuivre l’itinéraire. Quelle serait votre première démarche ?",
      pt: "Vocês discordam durante uma viagem e precisam seguir o roteiro. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_52_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 3,
        },
      },
      {
        stableKey: "CD2_52_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 0,
        },
      },
      {
        stableKey: "CD2_52_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 1,
        },
      },
      {
        stableKey: "CD2_52_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_53",
    position: 53,
    dimension: "CONFLICT_MANAGEMENT",
    difficulty: "HARD",
    prompt: {
      en: "A request for change arrives when you are tired. What would your first step be?",
      es: "Una petición de cambio llega cuando estás cansado. ¿Cuál sería tu primer paso?",
      fr: "Une demande de changement arrive à un moment de fatigue. Quelle serait votre première démarche ?",
      pt: "Um pedido de mudança chega em um momento de cansaço. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_53_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 1,
        },
      },
      {
        stableKey: "CD2_53_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 2,
        },
      },
      {
        stableKey: "CD2_53_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 3,
        },
      },
      {
        stableKey: "CD2_53_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_54",
    position: 54,
    dimension: "CONFLICT_MANAGEMENT",
    difficulty: "HARD",
    prompt: {
      en: "You tried a solution and the problem returned. What would your first step be?",
      es: "Ya probasteis una solución y el problema reapareció. ¿Cuál sería tu primer paso?",
      fr: "Vous avez essayé une solution et le problème est revenu. Quelle serait votre première démarche ?",
      pt: "Vocês já tentaram uma solução e o problema reapareceu. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_54_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 3,
        },
      },
      {
        stableKey: "CD2_54_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 0,
        },
      },
      {
        stableKey: "CD2_54_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 1,
        },
      },
      {
        stableKey: "CD2_54_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_55",
    position: 55,
    dimension: "CONFLICT_MANAGEMENT",
    difficulty: "HARD",
    prompt: {
      en: "You want to reopen a conversation that ended without agreement. What would your first step be?",
      es: "Quieres retomar una conversación que terminó sin acuerdo. ¿Cuál sería tu primer paso?",
      fr: "Vous voulez reprendre une conversation terminée sans accord. Quelle serait votre première démarche ?",
      pt: "Você quer retomar uma conversa que terminou sem acordo. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_55_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 1,
        },
      },
      {
        stableKey: "CD2_55_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 2,
        },
      },
      {
        stableKey: "CD2_55_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 3,
        },
      },
      {
        stableKey: "CD2_55_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_56",
    position: 56,
    dimension: "CONFLICT_MANAGEMENT",
    difficulty: "HARD",
    prompt: {
      en: "A division of responsibilities has started to feel unfair. What would your first step be?",
      es: "Un reparto de responsabilidades empezó a parecer injusto. ¿Cuál sería tu primer paso?",
      fr: "Une répartition des responsabilités commence à sembler injuste. Quelle serait votre première démarche ?",
      pt: "Uma divisão de responsabilidades passou a parecer injusta. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_56_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 3,
        },
      },
      {
        stableKey: "CD2_56_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 0,
        },
      },
      {
        stableKey: "CD2_56_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 1,
        },
      },
      {
        stableKey: "CD2_56_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          CONFLICT_MANAGEMENT: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_57",
    position: 57,
    dimension: "FINANCES",
    difficulty: "EASY",
    prompt: {
      en: "A personal purchase affects a shared goal’s timeline. What would your first step be?",
      es: "Una compra personal afecta al plazo de una meta compartida. ¿Cuál sería tu primer paso?",
      fr: "Un achat personnel modifie le calendrier d’un objectif commun. Quelle serait votre première démarche ?",
      pt: "Uma compra pessoal afeta o prazo de uma meta compartilhada. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_57_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FINANCES: 1,
        },
      },
      {
        stableKey: "CD2_57_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FINANCES: 2,
        },
      },
      {
        stableKey: "CD2_57_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FINANCES: 3,
        },
      },
      {
        stableKey: "CD2_57_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FINANCES: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_58",
    position: 58,
    dimension: "FINANCES",
    difficulty: "EASY",
    prompt: {
      en: "Your incomes differ and you need to split a new expense. What would your first step be?",
      es: "Tenéis ingresos distintos y debéis repartir un gasto nuevo. ¿Cuál sería tu primer paso?",
      fr: "Vos revenus diffèrent et vous devez répartir une nouvelle dépense. Quelle serait votre première démarche ?",
      pt: "Vocês têm rendas diferentes e precisam dividir uma despesa nova. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_58_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FINANCES: 3,
        },
      },
      {
        stableKey: "CD2_58_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FINANCES: 0,
        },
      },
      {
        stableKey: "CD2_58_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FINANCES: 1,
        },
      },
      {
        stableKey: "CD2_58_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FINANCES: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_59",
    position: 59,
    dimension: "FINANCES",
    difficulty: "EASY",
    prompt: {
      en: "A shared bill came in above the expected amount. What would your first step be?",
      es: "Una factura compartida superó el importe previsto. ¿Cuál sería tu primer paso?",
      fr: "Une facture commune dépasse le montant prévu. Quelle serait votre première démarche ?",
      pt: "Uma conta conjunta veio acima do valor previsto. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_59_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FINANCES: 1,
        },
      },
      {
        stableKey: "CD2_59_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FINANCES: 2,
        },
      },
      {
        stableKey: "CD2_59_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FINANCES: 3,
        },
      },
      {
        stableKey: "CD2_59_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FINANCES: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_60",
    position: 60,
    dimension: "FINANCES",
    difficulty: "MEDIUM",
    prompt: {
      en: "Your partner wants to lend money to a friend. What would your first step be?",
      es: "Tu pareja quiere prestar dinero a un amigo. ¿Cuál sería tu primer paso?",
      fr: "L’autre souhaite prêter de l’argent à un ami. Quelle serait votre première démarche ?",
      pt: "A outra pessoa quer emprestar dinheiro a um amigo. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_60_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FINANCES: 3,
        },
      },
      {
        stableKey: "CD2_60_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FINANCES: 0,
        },
      },
      {
        stableKey: "CD2_60_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FINANCES: 1,
        },
      },
      {
        stableKey: "CD2_60_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FINANCES: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_61",
    position: 61,
    dimension: "FINANCES",
    difficulty: "MEDIUM",
    prompt: {
      en: "You would like to keep some income in a personal account. What would your first step be?",
      es: "Te gustaría guardar parte de tus ingresos en una cuenta personal. ¿Cuál sería tu primer paso?",
      fr: "Vous aimeriez garder une partie de vos revenus sur un compte personnel. Quelle serait votre première démarche ?",
      pt: "Você gostaria de manter parte da renda em uma conta pessoal. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_61_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FINANCES: 1,
        },
      },
      {
        stableKey: "CD2_61_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FINANCES: 2,
        },
      },
      {
        stableKey: "CD2_61_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FINANCES: 3,
        },
      },
      {
        stableKey: "CD2_61_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FINANCES: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_62",
    position: 62,
    dimension: "FINANCES",
    difficulty: "MEDIUM",
    prompt: {
      en: "You need to decide a holiday spending ceiling. What would your first step be?",
      es: "Necesitáis decidir un límite de gasto para las vacaciones. ¿Cuál sería tu primer paso?",
      fr: "Vous devez décider d’un plafond de dépenses pour les vacances. Quelle serait votre première démarche ?",
      pt: "Vocês precisam decidir um teto de gastos para as férias. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_62_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FINANCES: 3,
        },
      },
      {
        stableKey: "CD2_62_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FINANCES: 0,
        },
      },
      {
        stableKey: "CD2_62_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FINANCES: 1,
        },
      },
      {
        stableKey: "CD2_62_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FINANCES: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_63",
    position: 63,
    dimension: "FINANCES",
    difficulty: "HARD",
    prompt: {
      en: "A subscription used by one person enters shared bills. What would your first step be?",
      es: "Una suscripción usada por una persona entra en gastos comunes. ¿Cuál sería tu primer paso?",
      fr: "Un abonnement utilisé par une seule personne entre dans les frais communs. Quelle serait votre première démarche ?",
      pt: "Uma assinatura usada por apenas uma pessoa entra nas contas comuns. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_63_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FINANCES: 1,
        },
      },
      {
        stableKey: "CD2_63_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FINANCES: 2,
        },
      },
      {
        stableKey: "CD2_63_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FINANCES: 3,
        },
      },
      {
        stableKey: "CD2_63_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FINANCES: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_64",
    position: 64,
    dimension: "FINANCES",
    difficulty: "HARD",
    prompt: {
      en: "You receive a bonus while a shared expense is pending. What would your first step be?",
      es: "Recibes una prima mientras queda un gasto compartido pendiente. ¿Cuál sería tu primer paso?",
      fr: "Vous recevez une prime alors qu’une dépense commune reste en attente. Quelle serait votre première démarche ?",
      pt: "Você recebe um bônus enquanto há uma despesa compartilhada pendente. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_64_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FINANCES: 3,
        },
      },
      {
        stableKey: "CD2_64_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FINANCES: 0,
        },
      },
      {
        stableKey: "CD2_64_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FINANCES: 1,
        },
      },
      {
        stableKey: "CD2_64_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FINANCES: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_65",
    position: 65,
    dimension: "FINANCES",
    difficulty: "HARD",
    prompt: {
      en: "You differ on how much to reserve for emergencies. What would your first step be?",
      es: "No coincidís sobre cuánto reservar para emergencias. ¿Cuál sería tu primer paso?",
      fr: "Vous divergez sur le montant à réserver aux imprévus. Quelle serait votre première démarche ?",
      pt: "Vocês divergem sobre quanto reservar para emergências. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_65_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FINANCES: 1,
        },
      },
      {
        stableKey: "CD2_65_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FINANCES: 2,
        },
      },
      {
        stableKey: "CD2_65_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FINANCES: 3,
        },
      },
      {
        stableKey: "CD2_65_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FINANCES: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_66",
    position: 66,
    dimension: "FINANCES",
    difficulty: "HARD",
    prompt: {
      en: "A drop in income requires reviewing each person’s contribution. What would your first step be?",
      es: "Una caída de ingresos exige revisar la contribución de cada persona. ¿Cuál sería tu primer paso?",
      fr: "Une baisse de revenus exige de revoir la contribution de chacun. Quelle serait votre première démarche ?",
      pt: "Uma redução de renda exige rever a contribuição de cada pessoa. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_66_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FINANCES: 3,
        },
      },
      {
        stableKey: "CD2_66_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FINANCES: 0,
        },
      },
      {
        stableKey: "CD2_66_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FINANCES: 1,
        },
      },
      {
        stableKey: "CD2_66_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FINANCES: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_67",
    position: 67,
    dimension: "FINANCES",
    difficulty: "HARD",
    prompt: {
      en: "A home renovation requires choosing which expenses to postpone. What would your first step be?",
      es: "Una reforma exige decidir qué gastos aplazar. ¿Cuál sería tu primer paso?",
      fr: "Une rénovation du logement oblige à choisir les dépenses à reporter. Quelle serait votre première démarche ?",
      pt: "Uma reforma da casa exige escolher quais despesas adiar. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_67_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FINANCES: 1,
        },
      },
      {
        stableKey: "CD2_67_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FINANCES: 2,
        },
      },
      {
        stableKey: "CD2_67_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FINANCES: 3,
        },
      },
      {
        stableKey: "CD2_67_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FINANCES: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_68",
    position: 68,
    dimension: "FINANCES",
    difficulty: "HARD",
    prompt: {
      en: "You need to choose how to record shared expenses. What would your first step be?",
      es: "Necesitáis elegir cómo registrar los gastos compartidos. ¿Cuál sería tu primer paso?",
      fr: "Vous devez choisir comment consigner les dépenses communes. Quelle serait votre première démarche ?",
      pt: "Vocês precisam escolher como registrar as despesas compartilhadas. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_68_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FINANCES: 3,
        },
      },
      {
        stableKey: "CD2_68_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FINANCES: 0,
        },
      },
      {
        stableKey: "CD2_68_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FINANCES: 1,
        },
      },
      {
        stableKey: "CD2_68_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FINANCES: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_69",
    position: 69,
    dimension: "FUTURE_PLANS",
    difficulty: "EASY",
    prompt: {
      en: "A job offer may require moving to another city. What would your first step be?",
      es: "Una oferta laboral puede exigir cambiar de ciudad. ¿Cuál sería tu primer paso?",
      fr: "Une offre d’emploi peut nécessiter un déménagement. Quelle serait votre première démarche ?",
      pt: "Uma proposta de trabalho pode exigir mudança de cidade. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_69_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FUTURE_PLANS: 1,
        },
      },
      {
        stableKey: "CD2_69_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FUTURE_PLANS: 2,
        },
      },
      {
        stableKey: "CD2_69_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FUTURE_PLANS: 3,
        },
      },
      {
        stableKey: "CD2_69_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FUTURE_PLANS: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_70",
    position: 70,
    dimension: "FUTURE_PLANS",
    difficulty: "EASY",
    prompt: {
      en: "You have different timelines for moving in together. What would your first step be?",
      es: "Tenéis plazos distintos para empezar a convivir. ¿Cuál sería tu primer paso?",
      fr: "Vous avez des calendriers différents pour vivre ensemble. Quelle serait votre première démarche ?",
      pt: "Vocês têm prazos diferentes para começar a morar juntos. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_70_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FUTURE_PLANS: 3,
        },
      },
      {
        stableKey: "CD2_70_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FUTURE_PLANS: 0,
        },
      },
      {
        stableKey: "CD2_70_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FUTURE_PLANS: 1,
        },
      },
      {
        stableKey: "CD2_70_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FUTURE_PLANS: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_71",
    position: 71,
    dimension: "FUTURE_PLANS",
    difficulty: "EASY",
    prompt: {
      en: "You want to resume studying and it would change your shared routine. What would your first step be?",
      es: "Quieres retomar estudios y eso cambiaría la rutina de pareja. ¿Cuál sería tu primer paso?",
      fr: "Vous souhaitez reprendre des études et cela modifierait votre routine commune. Quelle serait votre première démarche ?",
      pt: "Você quer voltar a estudar e isso mudaria a rotina do casal. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_71_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FUTURE_PLANS: 1,
        },
      },
      {
        stableKey: "CD2_71_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FUTURE_PLANS: 2,
        },
      },
      {
        stableKey: "CD2_71_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FUTURE_PLANS: 3,
        },
      },
      {
        stableKey: "CD2_71_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FUTURE_PLANS: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_72",
    position: 72,
    dimension: "FUTURE_PLANS",
    difficulty: "MEDIUM",
    prompt: {
      en: "A travel goal no longer fits next year. What would your first step be?",
      es: "Una meta de viaje ya no cabe el próximo año. ¿Cuál sería tu primer paso?",
      fr: "Un projet de voyage ne trouve plus sa place l’an prochain. Quelle serait votre première démarche ?",
      pt: "Uma meta de viagem deixou de caber no próximo ano. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_72_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FUTURE_PLANS: 3,
        },
      },
      {
        stableKey: "CD2_72_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FUTURE_PLANS: 0,
        },
      },
      {
        stableKey: "CD2_72_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FUTURE_PLANS: 1,
        },
      },
      {
        stableKey: "CD2_72_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FUTURE_PLANS: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_73",
    position: 73,
    dimension: "FUTURE_PLANS",
    difficulty: "MEDIUM",
    prompt: {
      en: "You are unsure where you would like to live in future. What would your first step be?",
      es: "Tenéis dudas sobre dónde os gustaría vivir en el futuro. ¿Cuál sería tu primer paso?",
      fr: "Vous hésitez sur le lieu où vivre à l’avenir. Quelle serait votre première démarche ?",
      pt: "Vocês têm dúvidas sobre onde gostariam de viver no futuro. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_73_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FUTURE_PLANS: 1,
        },
      },
      {
        stableKey: "CD2_73_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FUTURE_PLANS: 2,
        },
      },
      {
        stableKey: "CD2_73_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FUTURE_PLANS: 3,
        },
      },
      {
        stableKey: "CD2_73_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FUTURE_PLANS: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_74",
    position: 74,
    dimension: "FUTURE_PLANS",
    difficulty: "MEDIUM",
    prompt: {
      en: "An exchange opportunity changes your plans for several months. What would your first step be?",
      es: "Una oportunidad de intercambio cambia tus planes unos meses. ¿Cuál sería tu primer paso?",
      fr: "Une occasion d’échange modifie vos projets pour quelques mois. Quelle serait votre première démarche ?",
      pt: "Uma oportunidade de intercâmbio muda seus planos por alguns meses. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_74_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FUTURE_PLANS: 3,
        },
      },
      {
        stableKey: "CD2_74_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FUTURE_PLANS: 0,
        },
      },
      {
        stableKey: "CD2_74_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FUTURE_PLANS: 1,
        },
      },
      {
        stableKey: "CD2_74_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FUTURE_PLANS: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_75",
    position: 75,
    dimension: "FUTURE_PLANS",
    difficulty: "HARD",
    prompt: {
      en: "You want to redefine a career goal that affects time together. What would your first step be?",
      es: "Quieres redefinir una meta laboral que afecta al tiempo juntos. ¿Cuál sería tu primer paso?",
      fr: "Vous souhaitez redéfinir un objectif professionnel qui affecte votre temps ensemble. Quelle serait votre première démarche ?",
      pt: "Você quer redefinir uma meta profissional que afeta o tempo juntos. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_75_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FUTURE_PLANS: 1,
        },
      },
      {
        stableKey: "CD2_75_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FUTURE_PLANS: 2,
        },
      },
      {
        stableKey: "CD2_75_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FUTURE_PLANS: 3,
        },
      },
      {
        stableKey: "CD2_75_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FUTURE_PLANS: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_76",
    position: 76,
    dimension: "FUTURE_PLANS",
    difficulty: "HARD",
    prompt: {
      en: "You have not yet discussed future caring responsibilities. What would your first step be?",
      es: "Aún no hablasteis de futuras responsabilidades de cuidado. ¿Cuál sería tu primer paso?",
      fr: "Vous n’avez pas encore parlé de futures responsabilités d’aide aux proches. Quelle serait votre première démarche ?",
      pt: "Vocês ainda não conversaram sobre responsabilidades futuras de cuidado. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_76_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FUTURE_PLANS: 3,
        },
      },
      {
        stableKey: "CD2_76_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FUTURE_PLANS: 0,
        },
      },
      {
        stableKey: "CD2_76_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FUTURE_PLANS: 1,
        },
      },
      {
        stableKey: "CD2_76_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FUTURE_PLANS: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_77",
    position: 77,
    dimension: "FUTURE_PLANS",
    difficulty: "HARD",
    prompt: {
      en: "A family change requires reorganising plans for the next six months. What would your first step be?",
      es: "Un cambio familiar exige reorganizar el próximo semestre. ¿Cuál sería tu primer paso?",
      fr: "Un changement familial exige de revoir les projets du prochain semestre. Quelle serait votre première démarche ?",
      pt: "Uma mudança familiar exige reorganizar planos para o próximo semestre. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_77_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FUTURE_PLANS: 1,
        },
      },
      {
        stableKey: "CD2_77_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FUTURE_PLANS: 2,
        },
      },
      {
        stableKey: "CD2_77_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FUTURE_PLANS: 3,
        },
      },
      {
        stableKey: "CD2_77_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FUTURE_PLANS: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_78",
    position: 78,
    dimension: "FUTURE_PLANS",
    difficulty: "HARD",
    prompt: {
      en: "You want time to consider the possibility of having children. What would your first step be?",
      es: "Quieres valorar con calma la posibilidad de tener hijos. ¿Cuál sería tu primer paso?",
      fr: "Vous souhaitez réfléchir sereinement à la possibilité d’avoir des enfants. Quelle serait votre première démarche ?",
      pt: "Você quer avaliar com calma a possibilidade de ter filhos. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_78_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FUTURE_PLANS: 3,
        },
      },
      {
        stableKey: "CD2_78_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FUTURE_PLANS: 0,
        },
      },
      {
        stableKey: "CD2_78_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FUTURE_PLANS: 1,
        },
      },
      {
        stableKey: "CD2_78_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FUTURE_PLANS: 2,
        },
      },
    ],
  },
  {
    stableKey: "CD2_79",
    position: 79,
    dimension: "FUTURE_PLANS",
    difficulty: "HARD",
    prompt: {
      en: "A shared project grew beyond what you can manage now. What would your first step be?",
      es: "Un proyecto conjunto creció más de lo que podéis ejecutar ahora. ¿Cuál sería tu primer paso?",
      fr: "Un projet commun dépasse ce que vous pouvez réaliser maintenant. Quelle serait votre première démarche ?",
      pt: "Um projeto conjunto ficou maior do que vocês conseguem executar agora. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_79_1",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FUTURE_PLANS: 1,
        },
      },
      {
        stableKey: "CD2_79_2",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FUTURE_PLANS: 2,
        },
      },
      {
        stableKey: "CD2_79_3",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FUTURE_PLANS: 3,
        },
      },
      {
        stableKey: "CD2_79_4",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FUTURE_PLANS: 0,
        },
      },
    ],
  },
  {
    stableKey: "CD2_80",
    position: 80,
    dimension: "FUTURE_PLANS",
    difficulty: "HARD",
    prompt: {
      en: "You want to plan next year while keeping possibilities open. What would your first step be?",
      es: "Quieres planear el próximo año sin cerrar todas las posibilidades. ¿Cuál sería tu primer paso?",
      fr: "Vous souhaitez préparer l’année prochaine en gardant des possibilités ouvertes. Quelle serait votre première démarche ?",
      pt: "Você deseja planejar o próximo ano sem fechar todas as possibilidades. Qual seria seu primeiro passo?",
    },
    options: [
      {
        stableKey: "CD2_80_1",
        label: {
          en: "Discuss what matters to each person before deciding a way forward.",
          es: "Hablar de lo que importa a cada persona antes de definir el camino.",
          fr: "Discuter de ce qui compte pour chacun avant de définir la suite.",
          pt: "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        },
        signals: {
          FUTURE_PLANS: 3,
        },
      },
      {
        stableKey: "CD2_80_2",
        label: {
          en: "Reflect on my needs and boundaries before bringing a proposal.",
          es: "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
          fr: "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
          pt: "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        },
        signals: {
          FUTURE_PLANS: 0,
        },
      },
      {
        stableKey: "CD2_80_3",
        label: {
          en: "Decide what I can adjust and communicate my position afterwards.",
          es: "Definir qué puedo ajustar y comunicar mi postura después.",
          fr: "Définir ce que je peux adapter puis communiquer ma position.",
          pt: "Definir o que posso ajustar e comunicar minha posição depois.",
        },
        signals: {
          FUTURE_PLANS: 1,
        },
      },
      {
        stableKey: "CD2_80_4",
        label: {
          en: "Suggest a small joint adjustment and see how it works.",
          es: "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
          fr: "Proposer un petit ajustement commun et observer son effet.",
          pt: "Propor um pequeno ajuste conjunto e observar como funciona.",
        },
        signals: {
          FUTURE_PLANS: 2,
        },
      },
    ],
  },
  {
    stableKey: "MD2_21",
    position: 21,
    dimension: "BUILDER",
    difficulty: "EASY",
    prompt: {
      en: "You can pay for professional training or keep the money available next month. What would you prioritise?",
      es: "Puedes pagar formación profesional o conservar el dinero para el mes próximo. ¿Qué priorizarías?",
      fr: "Vous pouvez financer une formation ou garder cette somme pour le mois prochain. Quelle priorité choisir ?",
      pt: "Você pode pagar um curso profissional ou manter esse dinheiro disponível para o próximo mês. Qual seria sua prioridade?",
    },
    options: [
      {
        stableKey: "MD2_21_1",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_21_2",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_21_3",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_21_4",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_22",
    position: 22,
    dimension: "BUILDER",
    difficulty: "EASY",
    prompt: {
      en: "A tool may improve your work, but its benefits will take months. How would you decide how to use the funds?",
      es: "Una herramienta puede mejorar tu trabajo, pero su beneficio tardará meses. ¿Cómo decidirías usar ese dinero?",
      fr: "Un outil peut améliorer votre travail, mais ses bénéfices prendront des mois. Comment utiliser cette somme ?",
      pt: "Uma ferramenta pode melhorar seu trabalho, mas seu benefício só aparecerá em alguns meses. Como você decidiria usar essa verba?",
    },
    options: [
      {
        stableKey: "MD2_22_1",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_22_2",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_22_3",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_22_4",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_23",
    position: 23,
    dimension: "BUILDER",
    difficulty: "EASY",
    prompt: {
      en: "Your personal project needs materials and competes with a short trip. The budget covers only one. What matters most?",
      es: "Tu proyecto necesita materiales y compite con un viaje corto. El presupuesto solo cubre uno. ¿Qué pesa más?",
      fr: "Votre projet nécessite du matériel et concurrence un court voyage. Le budget ne couvre qu’un choix. Quelle priorité ?",
      pt: "Seu projeto pessoal precisa de materiais e compete com uma viagem curta. O orçamento cobre apenas uma escolha. O que pesa mais?",
    },
    options: [
      {
        stableKey: "MD2_23_1",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_23_2",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_23_3",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_23_4",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_24",
    position: 24,
    dimension: "BUILDER",
    difficulty: "MEDIUM",
    prompt: {
      en: "You finish repaying a debt and free up a monthly payment. What priority would you give that money now?",
      es: "Terminas de pagar una deuda y liberas una cuota mensual. ¿Qué prioridad darías ahora a ese dinero?",
      fr: "Vous finissez de rembourser une dette et libérez une mensualité. Quelle priorité donner à cet argent ?",
      pt: "Você termina de pagar uma dívida e libera uma parcela mensal. Que prioridade daria a esse dinheiro a partir de agora?",
    },
    options: [
      {
        stableKey: "MD2_24_1",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_24_2",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_24_3",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_24_4",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_25",
    position: 25,
    dimension: "BUILDER",
    difficulty: "MEDIUM",
    prompt: {
      en: "You sell unused equipment and could fund the first stage of a project. How would you allocate the proceeds?",
      es: "Vendes un equipo que no usas y podrías financiar una etapa de un proyecto. ¿Cómo distribuirías ese importe?",
      fr: "Vous vendez un équipement inutilisé et pourriez financer une étape d’un projet. Comment répartir cette somme ?",
      pt: "Você vende um equipamento que não usa e pode financiar uma primeira etapa de um projeto. Como alocaria esse valor?",
    },
    options: [
      {
        stableKey: "MD2_25_1",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_25_2",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_25_3",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_25_4",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_26",
    position: 26,
    dimension: "BUILDER",
    difficulty: "MEDIUM",
    prompt: {
      en: "A side activity could earn money but requires buying materials first. What priority would guide your financial decision?",
      es: "Una actividad extra puede generar ingresos, pero exige comprar materiales antes. ¿Qué prioridad guiaría tu decisión?",
      fr: "Une activité complémentaire peut rapporter mais nécessite du matériel au départ. Quelle priorité guiderait votre décision ?",
      pt: "Uma atividade extra gera renda, mas exige comprar materiais antes de começar. Qual prioridade guiaria sua decisão financeira?",
    },
    options: [
      {
        stableKey: "MD2_26_1",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_26_2",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_26_3",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_26_4",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_27",
    position: 27,
    dimension: "BUILDER",
    difficulty: "HARD",
    prompt: {
      en: "You receive a refund and consider starting an idea, while other needs have been postponed. How would you allocate it?",
      es: "Recibes un reembolso y piensas iniciar una idea, pero hay necesidades aplazadas. ¿Cómo decidirías su destino?",
      fr: "Vous recevez un remboursement et envisagez de lancer une idée, avec d’autres besoins reportés. Comment l’affecter ?",
      pt: "Você recebe um reembolso e pensa em tirar uma ideia do papel. Há também necessidades adiadas. Como escolheria o destino do valor?",
    },
    options: [
      {
        stableKey: "MD2_27_1",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_27_2",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_27_3",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_27_4",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_28",
    position: 28,
    dimension: "BUILDER",
    difficulty: "HARD",
    prompt: {
      en: "A qualification requires payments over six months with no guaranteed return. What financial priority would you adopt?",
      es: "Una certificación exige pagos durante seis meses sin retorno garantizado. ¿Qué prioridad financiera adoptarías?",
      fr: "Une certification demande six mois de paiements sans retour garanti. Quelle priorité financière adopter ?",
      pt: "Uma certificação exige pagamentos ao longo de seis meses, sem garantia de retorno. Qual prioridade financeira adotaria?",
    },
    options: [
      {
        stableKey: "MD2_28_1",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_28_2",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_28_3",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_28_4",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_29",
    position: 29,
    dimension: "BUILDER",
    difficulty: "HARD",
    prompt: {
      en: "A partnership proposes sharing costs to create a product. You have a small amount available. What would guide your choice?",
      es: "Una colaboración propone compartir costes para crear un producto. Tienes algo de dinero libre. ¿Qué guiaría tu elección?",
      fr: "Un partenariat propose de partager les frais d’un produit. Vous avez une petite marge. Qu’est-ce qui guiderait votre choix ?",
      pt: "Uma parceria propõe dividir custos para criar um produto. Você tem uma pequena quantia livre. O que orientaria sua escolha?",
    },
    options: [
      {
        stableKey: "MD2_29_1",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_29_2",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_29_3",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_29_4",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_30",
    position: 30,
    dimension: "BUILDER",
    difficulty: "HARD",
    prompt: {
      en: "You can improve your workspace or reserve the money for other needs. Which use would you consider first?",
      es: "Puedes mejorar tu espacio de trabajo o reservar el dinero para otras necesidades. ¿Qué uso considerarías primero?",
      fr: "Vous pouvez améliorer votre espace de travail ou garder la somme pour d’autres besoins. Quel usage considérer en premier ?",
      pt: "Você pode melhorar seu espaço de trabalho ou reservar o valor para outras necessidades. Que uso consideraria primeiro?",
    },
    options: [
      {
        stableKey: "MD2_30_1",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_30_2",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_30_3",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_30_4",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_31",
    position: 31,
    dimension: "BUILDER",
    difficulty: "HARD",
    prompt: {
      en: "A purchase today could speed up a project, which could also continue slowly without it. What would you prioritise?",
      es: "Una compra hoy aceleraría un proyecto que también puede seguir más despacio sin ella. ¿Qué priorizarías?",
      fr: "Un achat accélérerait un projet qui peut aussi avancer lentement sans lui. Que privilégieriez-vous ?",
      pt: "Um projeto pode avançar mais rápido com uma compra hoje, mas também pode continuar devagar sem ela. O que priorizaria?",
    },
    options: [
      {
        stableKey: "MD2_31_1",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_31_2",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_31_3",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_31_4",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_32",
    position: 32,
    dimension: "BUILDER",
    difficulty: "HARD",
    prompt: {
      en: "You have funds to learn a skill, refurbish an item or keep a cushion. Which goal would guide your decision?",
      es: "Tienes dinero para aprender una habilidad, renovar algo o conservar margen. ¿Qué objetivo guiaría tu decisión?",
      fr: "Vous avez de quoi apprendre une compétence, rénover un objet ou garder une marge. Quel objectif guiderait votre décision ?",
      pt: "Você tem verba para aprender uma habilidade nova, reformar um item ou manter a folga. Qual objetivo guiaria sua decisão?",
    },
    options: [
      {
        stableKey: "MD2_32_1",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_32_2",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_32_3",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_32_4",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_33",
    position: 33,
    dimension: "GUARDIAN",
    difficulty: "EASY",
    prompt: {
      en: "Your income varies monthly and a predictable annual bill is approaching. How would you prioritise the money left?",
      es: "Tus ingresos varían cada mes y se acerca un gasto anual previsible. ¿Cómo priorizarías el dinero restante?",
      fr: "Vos revenus varient et une facture annuelle prévisible approche. Comment affecter votre marge ?",
      pt: "Sua renda varia a cada mês e surgiu uma despesa anual previsível. Como priorizaria o dinheiro que sobrou?",
    },
    options: [
      {
        stableKey: "MD2_33_1",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_33_2",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_33_3",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_33_4",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_34",
    position: 34,
    dimension: "GUARDIAN",
    difficulty: "EASY",
    prompt: {
      en: "Home maintenance can happen now or in a few months. How would you decide how to use that money?",
      es: "Un mantenimiento doméstico puede hacerse ahora o aplazarse unos meses. ¿Cómo decidirías usar ese dinero?",
      fr: "Un entretien du logement peut se faire maintenant ou dans quelques mois. Comment affecter cette somme ?",
      pt: "Uma manutenção doméstica pode ser feita agora ou adiada por alguns meses. Como decidiria o uso desse dinheiro?",
    },
    options: [
      {
        stableKey: "MD2_34_1",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_34_2",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_34_3",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_34_4",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_35",
    position: 35,
    dimension: "GUARDIAN",
    difficulty: "EASY",
    prompt: {
      en: "Your work contract is due for renewal and you received extra money. Which use would you consider first?",
      es: "Tu contrato laboral se renovará pronto y recibiste un extra. ¿Qué destino considerarías primero?",
      fr: "Votre contrat de travail arrive à renouvellement et vous recevez un supplément. Quel usage considérer en premier ?",
      pt: "Seu contrato de trabalho será renovado em breve e você recebeu um valor extra. Qual destino consideraria primeiro?",
    },
    options: [
      {
        stableKey: "MD2_35_1",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_35_2",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_35_3",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_35_4",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_36",
    position: 36,
    dimension: "GUARDIAN",
    difficulty: "MEDIUM",
    prompt: {
      en: "An old appliance still works but may need repairs. Your budget has a little room. How would you use it?",
      es: "Un electrodoméstico antiguo funciona, pero puede necesitar reparación. Tienes algo de margen. ¿Cómo lo usarías?",
      fr: "Un appareil ancien fonctionne encore mais pourrait nécessiter une réparation. Comment utiliser une petite marge ?",
      pt: "Um eletrodoméstico antigo ainda funciona, mas pode precisar de reparo. Há uma pequena folga no orçamento. Como a usaria?",
    },
    options: [
      {
        stableKey: "MD2_36_1",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_36_2",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_36_3",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_36_4",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_37",
    position: 37,
    dimension: "GUARDIAN",
    difficulty: "MEDIUM",
    prompt: {
      en: "You are moving home and final costs are unclear. What priority would you give the available money?",
      es: "Vas a mudarte y los costes finales no están claros. ¿Qué prioridad darías al dinero disponible?",
      fr: "Vous déménagez et les frais finaux restent incertains. Quelle priorité donner à l’argent disponible ?",
      pt: "Você vai mudar de casa e os custos finais ainda não estão claros. Qual prioridade daria ao dinheiro disponível?",
    },
    options: [
      {
        stableKey: "MD2_37_1",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_37_2",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_37_3",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_37_4",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_38",
    position: 38,
    dimension: "GUARDIAN",
    difficulty: "MEDIUM",
    prompt: {
      en: "Transport costs fell, freeing a recurring amount. How would you decide what to do with this new margin?",
      es: "Bajó un gasto de transporte y liberó una cantidad recurrente. ¿Cómo decidirías usar ese nuevo margen?",
      fr: "Les frais de transport baissent et libèrent une somme régulière. Comment affecter cette nouvelle marge ?",
      pt: "Uma despesa de transporte caiu e liberou um valor recorrente. Como decidiria o destino dessa nova margem?",
    },
    options: [
      {
        stableKey: "MD2_38_1",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_38_2",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_38_3",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_38_4",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_39",
    position: 39,
    dimension: "GUARDIAN",
    difficulty: "HARD",
    prompt: {
      en: "You are close to your planned savings cushion and receive a paid invitation. Which priority would guide your choice?",
      es: "Estás cerca de tu reserva prevista y recibes una invitación de pago. ¿Qué prioridad guiaría tu elección?",
      fr: "Vous approchez de votre réserve prévue et recevez une invitation payante. Quelle priorité guiderait votre choix ?",
      pt: "Você está perto de atingir sua reserva planejada e recebeu um convite pago. Qual prioridade guiaria a escolha?",
    },
    options: [
      {
        stableKey: "MD2_39_1",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_39_2",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_39_3",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_39_4",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_40",
    position: 40,
    dimension: "GUARDIAN",
    difficulty: "HARD",
    prompt: {
      en: "An insurance deductible may increase next year. You have a small amount free today. How would you use it?",
      es: "La franquicia de un seguro puede subir el próximo año. Hoy tienes algo de dinero libre. ¿Cómo lo usarías?",
      fr: "Une franchise d’assurance pourrait augmenter l’an prochain. Comment utiliser une petite somme disponible aujourd’hui ?",
      pt: "Uma franquia de seguro pode aumentar no próximo ano. Hoje existe uma pequena quantia livre. Como decidiria usá-la?",
    },
    options: [
      {
        stableKey: "MD2_40_1",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_40_2",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_40_3",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_40_4",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_41",
    position: 41,
    dimension: "GUARDIAN",
    difficulty: "HARD",
    prompt: {
      en: "Your freelance work had a good month, but next month has no contracts yet. How would you use the difference?",
      es: "Tu trabajo autónomo tuvo un buen mes, pero el siguiente aún no tiene contratos. ¿Cómo usarías la diferencia?",
      fr: "Votre activité indépendante a bien marché ce mois-ci, sans contrat pour le suivant. Comment utiliser l’écart ?",
      pt: "Seu trabalho autônomo teve um mês bom, mas o próximo ainda não tem contratos. Qual uso daria à diferença?",
    },
    options: [
      {
        stableKey: "MD2_41_1",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_41_2",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_41_3",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_41_4",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_42",
    position: 42,
    dimension: "GUARDIAN",
    difficulty: "HARD",
    prompt: {
      en: "A bill was lower than expected and your routine is stable. How would you allocate the savings?",
      es: "Una factura fue menor de lo previsto y tu rutina sigue estable. ¿Cómo destinarías el ahorro?",
      fr: "Une facture est inférieure aux prévisions et votre routine reste stable. Comment affecter cette économie ?",
      pt: "Uma conta foi menor do que o previsto e sua rotina segue estável. Como escolheria o destino da economia?",
    },
    options: [
      {
        stableKey: "MD2_42_1",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_42_2",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_42_3",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_42_4",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_43",
    position: 43,
    dimension: "GUARDIAN",
    difficulty: "HARD",
    prompt: {
      en: "You plan a work break in a few months. What financial priority would you adopt for your current balance?",
      es: "Planeas una pausa laboral dentro de unos meses. ¿Qué prioridad financiera adoptarías con el saldo actual?",
      fr: "Vous prévoyez une pause professionnelle dans quelques mois. Quelle priorité donner à votre solde actuel ?",
      pt: "Você planeja uma pausa no trabalho dentro de alguns meses. Qual prioridade financeira adotaria com o saldo atual?",
    },
    options: [
      {
        stableKey: "MD2_43_1",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_43_2",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_43_3",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_43_4",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_44",
    position: 44,
    dimension: "GUARDIAN",
    difficulty: "HARD",
    prompt: {
      en: "Living costs rose and you still have some monthly room. How would you decide what to do with it?",
      es: "Subió el coste de vida y aún conservas algo de margen mensual. ¿Cómo decidirías qué hacer con él?",
      fr: "Le coût de la vie augmente et il vous reste une marge mensuelle. Comment décider de son usage ?",
      pt: "O custo de vida aumentou e você ainda tem alguma folga mensal. Como decidiria o que fazer com essa margem?",
    },
    options: [
      {
        stableKey: "MD2_44_1",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_44_2",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_44_3",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_44_4",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_45",
    position: 45,
    dimension: "STRATEGIST",
    difficulty: "EASY",
    prompt: {
      en: "Two internet plans have different fees and terms. How would you set your financial priority?",
      es: "Dos planes de internet tienen cuotas y plazos distintos. ¿Cómo definirías tu prioridad financiera?",
      fr: "Deux forfaits internet ont des frais et des durées différents. Comment définir votre priorité financière ?",
      pt: "Dois planos de internet têm taxas e prazos diferentes. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_45_1",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_45_2",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_45_3",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_45_4",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_46",
    position: 46,
    dimension: "STRATEGIST",
    difficulty: "EASY",
    prompt: {
      en: "An instalment purchase costs more overall than paying upfront. How would you set your financial priority?",
      es: "Una compra a plazos cuesta más en total que al contado. ¿Cómo definirías tu prioridad financiera?",
      fr: "Un achat échelonné coûte plus cher au total que le paiement comptant. Comment définir votre priorité financière ?",
      pt: "Uma compra parcelada tem custo total maior que o pagamento à vista. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_46_1",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_46_2",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_46_3",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_46_4",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_47",
    position: 47,
    dimension: "STRATEGIST",
    difficulty: "EASY",
    prompt: {
      en: "You receive two job offers with different benefits. How would you set your financial priority?",
      es: "Recibes dos ofertas laborales con prestaciones diferentes. ¿Cómo definirías tu prioridad financiera?",
      fr: "Vous recevez deux offres d’emploi aux avantages différents. Comment définir votre priorité financière ?",
      pt: "Você recebe duas propostas de trabalho com benefícios diferentes. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_47_1",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_47_2",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_47_3",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_47_4",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_48",
    position: 48,
    dimension: "STRATEGIST",
    difficulty: "MEDIUM",
    prompt: {
      en: "A bulk discount requires buying more than you use in a month. How would you set your financial priority?",
      es: "Un descuento por volumen exige comprar más de lo que usas al mes. ¿Cómo definirías tu prioridad financiera?",
      fr: "Une remise en volume exige d’acheter plus que votre usage mensuel. Comment définir votre priorité financière ?",
      pt: "Um desconto por volume exige comprar mais do que você usa no mês. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_48_1",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_48_2",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_48_3",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_48_4",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_49",
    position: 49,
    dimension: "STRATEGIST",
    difficulty: "MEDIUM",
    prompt: {
      en: "A low monthly fee comes with a high joining charge. How would you set your financial priority?",
      es: "Una cuota mensual baja incluye un alta elevada. ¿Cómo definirías tu prioridad financiera?",
      fr: "Une mensualité faible s’accompagne de frais d’adhésion élevés. Comment définir votre priorité financière ?",
      pt: "Uma mensalidade baixa esconde uma taxa de adesão elevada. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_49_1",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_49_2",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_49_3",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_49_4",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_50",
    position: 50,
    dimension: "STRATEGIST",
    difficulty: "MEDIUM",
    prompt: {
      en: "A new service promises time savings but needs an annual contract. How would you set your financial priority?",
      es: "Un servicio promete ahorrar tiempo, pero exige contrato anual. ¿Cómo definirías tu prioridad financiera?",
      fr: "Un nouveau service promet du temps gagné mais exige un contrat annuel. Comment définir votre priorité financière ?",
      pt: "Um serviço novo promete economizar tempo mas exige contrato anual. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_50_1",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_50_2",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_50_3",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_50_4",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_51",
    position: 51,
    dimension: "STRATEGIST",
    difficulty: "HARD",
    prompt: {
      en: "You can rent or buy equipment you only use occasionally. How would you set your financial priority?",
      es: "Puedes alquilar o comprar un equipo de uso ocasional. ¿Cómo definirías tu prioridad financiera?",
      fr: "Vous pouvez louer ou acheter un équipement utilisé occasionnellement. Comment définir votre priorité financière ?",
      pt: "Você pode alugar ou comprar um equipamento de uso ocasional. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_51_1",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_51_2",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_51_3",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_51_4",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_52",
    position: 52,
    dimension: "STRATEGIST",
    difficulty: "HARD",
    prompt: {
      en: "A school offers a partial scholarship with travel costs. How would you set your financial priority?",
      es: "Una escuela ofrece beca parcial, pero exige gastos de transporte. ¿Cómo definirías tu prioridad financiera?",
      fr: "Une école offre une bourse partielle mais implique des frais de trajet. Comment définir votre priorité financière ?",
      pt: "Uma escola oferece bolsa parcial mas exige custos de deslocamento. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_52_1",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_52_2",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_52_3",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_52_4",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_53",
    position: 53,
    dimension: "STRATEGIST",
    difficulty: "HARD",
    prompt: {
      en: "Changing banks lowers fees but requires reorganising payments. How would you set your financial priority?",
      es: "Cambiar de banco reduce comisiones, pero exige reorganizar pagos. ¿Cómo definirías tu prioridad financiera?",
      fr: "Changer de banque réduit les frais mais exige de réorganiser les paiements. Comment définir votre priorité financière ?",
      pt: "Trocar de banco reduz tarifas mas exige reorganizar os pagamentos. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_53_1",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_53_2",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_53_3",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_53_4",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_54",
    position: 54,
    dimension: "STRATEGIST",
    difficulty: "HARD",
    prompt: {
      en: "A holiday package includes activities you may not use. How would you set your financial priority?",
      es: "Un paquete de vacaciones incluye actividades que quizá no uses. ¿Cómo definirías tu prioridad financiera?",
      fr: "Un forfait vacances inclut des activités que vous n’utiliserez peut-être pas. Comment définir votre priorité financière ?",
      pt: "Um pacote de férias inclui atividades que você talvez não use. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_54_1",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_54_2",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_54_3",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_54_4",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_55",
    position: 55,
    dimension: "STRATEGIST",
    difficulty: "HARD",
    prompt: {
      en: "A subscription discounts a full year paid in advance. How would you set your financial priority?",
      es: "Una suscripción ofrece descuento al anticipar un año entero. ¿Cómo definirías tu prioridad financiera?",
      fr: "Un abonnement réduit son prix si vous payez une année d’avance. Comment définir votre priorité financière ?",
      pt: "Uma assinatura oferece desconto se você antecipar um ano inteiro. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_55_1",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_55_2",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_55_3",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_55_4",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_56",
    position: 56,
    dimension: "STRATEGIST",
    difficulty: "HARD",
    prompt: {
      en: "A promotion ends today but you have not compared alternatives. How would you set your financial priority?",
      es: "Una promoción termina hoy, pero aún no comparaste alternativas. ¿Cómo definirías tu prioridad financiera?",
      fr: "Une promotion finit aujourd’hui sans que vous ayez comparé les alternatives. Comment définir votre priorité financière ?",
      pt: "Uma promoção termina hoje mas você ainda não comparou alternativas. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_56_1",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_56_2",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_56_3",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_56_4",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_57",
    position: 57,
    dimension: "ADVENTURER",
    difficulty: "EASY",
    prompt: {
      en: "Friends suggest a short trip outside your plans. How would you set your financial priority?",
      es: "Amigos proponen un viaje corto fuera de tus planes. ¿Cómo definirías tu prioridad financiera?",
      fr: "Des amis proposent un court voyage imprévu. Comment définir votre priorité financière ?",
      pt: "Amigos propõem uma viagem curta fora dos seus planos. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_57_1",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_57_2",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_57_3",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_57_4",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_58",
    position: 58,
    dimension: "ADVENTURER",
    difficulty: "EASY",
    prompt: {
      en: "An artist you enjoy will perform one show in town. How would you set your financial priority?",
      es: "Un artista que te gusta dará un único concierto en tu ciudad. ¿Cómo definirías tu prioridad financiera?",
      fr: "Un artiste que vous aimez donne un seul concert en ville. Comment définir votre priorité financière ?",
      pt: "Um artista de que você gosta fará um único show na cidade. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_58_1",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_58_2",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_58_3",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_58_4",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_59",
    position: 59,
    dimension: "ADVENTURER",
    difficulty: "EASY",
    prompt: {
      en: "A paid introductory class sparks your curiosity. How would you set your financial priority?",
      es: "Una clase de prueba de pago despierta tu curiosidad. ¿Cómo definirías tu prioridad financiera?",
      fr: "Un cours d’essai payant éveille votre curiosité. Comment définir votre priorité financière ?",
      pt: "Uma aula experimental paga desperta sua curiosidade. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_59_1",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_59_2",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_59_3",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_59_4",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_60",
    position: 60,
    dimension: "ADVENTURER",
    difficulty: "MEDIUM",
    prompt: {
      en: "A dining experience costs your entire weekly spare budget. How would you set your financial priority?",
      es: "Una experiencia gastronómica cuesta todo tu margen semanal. ¿Cómo definirías tu prioridad financiera?",
      fr: "Une expérience gastronomique coûte toute votre marge hebdomadaire. Comment définir votre priorité financière ?",
      pt: "Uma experiência gastronômica custa o mesmo que sua folga semanal. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_60_1",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_60_2",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_60_3",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_60_4",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_61",
    position: 61,
    dimension: "ADVENTURER",
    difficulty: "MEDIUM",
    prompt: {
      en: "A last-minute place opens on a weekend outing. How would you set your financial priority?",
      es: "Surge una plaza de última hora para una excursión de fin de semana. ¿Cómo definirías tu prioridad financiera?",
      fr: "Une place se libère au dernier moment pour une sortie de week-end. Comment définir votre priorité financière ?",
      pt: "Surge uma vaga de última hora em um passeio de fim de semana. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_61_1",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_61_2",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_61_3",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_61_4",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_62",
    position: 62,
    dimension: "ADVENTURER",
    difficulty: "MEDIUM",
    prompt: {
      en: "You find a new activity during an already paid trip. How would you set your financial priority?",
      es: "Encuentras una actividad nueva durante un viaje ya pagado. ¿Cómo definirías tu prioridad financiera?",
      fr: "Vous découvrez une activité nouvelle lors d’un voyage déjà payé. Comment définir votre priorité financière ?",
      pt: "Você encontra uma atividade nova durante uma viagem já paga. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_62_1",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_62_2",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_62_3",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_62_4",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_63",
    position: 63,
    dimension: "ADVENTURER",
    difficulty: "HARD",
    prompt: {
      en: "A new hobby needs a small initial purchase. How would you set your financial priority?",
      es: "Un nuevo pasatiempo exige una pequeña compra inicial. ¿Cómo definirías tu prioridad financiera?",
      fr: "Un nouveau loisir nécessite un petit achat initial. Comment définir votre priorité financière ?",
      pt: "Um hobby novo exige uma pequena compra inicial. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_63_1",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_63_2",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_63_3",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_63_4",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_64",
    position: 64,
    dimension: "ADVENTURER",
    difficulty: "HARD",
    prompt: {
      en: "A special party competes with another use of your spare money. How would you set your financial priority?",
      es: "Una fiesta especial compite con otro uso de tu dinero libre. ¿Cómo definirías tu prioridad financiera?",
      fr: "Une fête spéciale concurrence un autre usage de votre argent disponible. Comment définir votre priorité financière ?",
      pt: "Uma festa especial compete com outro uso do seu dinheiro livre. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_64_1",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_64_2",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_64_3",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_64_4",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_65",
    position: 65,
    dimension: "ADVENTURER",
    difficulty: "HARD",
    prompt: {
      en: "You want to celebrate an achievement after a demanding month. How would you set your financial priority?",
      es: "Quieres celebrar un logro tras un mes exigente. ¿Cómo definirías tu prioridad financiera?",
      fr: "Vous souhaitez célébrer une réussite après un mois exigeant. Comment définir votre priorité financière ?",
      pt: "Você quer comemorar uma conquista depois de um mês exigente. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_65_1",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_65_2",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_65_3",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_65_4",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_66",
    position: 66,
    dimension: "ADVENTURER",
    difficulty: "HARD",
    prompt: {
      en: "Visiting a loved one requires an unplanned ticket. How would you set your financial priority?",
      es: "Visitar a alguien querido exige un billete que no estaba previsto. ¿Cómo definirías tu prioridad financiera?",
      fr: "Rendre visite à un proche exige un billet imprévu. Comment définir votre priorité financière ?",
      pt: "Uma visita a alguém querido exige uma passagem que não estava prevista. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_66_1",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_66_2",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_66_3",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_66_4",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_67",
    position: 67,
    dimension: "ADVENTURER",
    difficulty: "HARD",
    prompt: {
      en: "A local festival offers activities you have never tried. How would you set your financial priority?",
      es: "Un festival local ofrece actividades que nunca probaste. ¿Cómo definirías tu prioridad financiera?",
      fr: "Un festival local propose des activités que vous n’avez jamais essayées. Comment définir votre priorité financière ?",
      pt: "Um festival local oferece atividades que você nunca experimentou. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_67_1",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_67_2",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_67_3",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_67_4",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_68",
    position: 68,
    dimension: "ADVENTURER",
    difficulty: "HARD",
    prompt: {
      en: "You can extend your holiday by a day for an extra cost. How would you set your financial priority?",
      es: "Puedes alargar tus vacaciones un día pagando un extra. ¿Cómo definirías tu prioridad financiera?",
      fr: "Vous pouvez prolonger vos vacances d’un jour pour un supplément. Comment définir votre priorité financière ?",
      pt: "Você pode prolongar suas férias por um dia mediante um custo extra. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_68_1",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_68_2",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_68_3",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_68_4",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_69",
    position: 69,
    dimension: "BALANCER",
    difficulty: "EASY",
    prompt: {
      en: "A tiring week increased your convenience spending. How would you set your financial priority?",
      es: "Una semana agotadora aumentó tus gastos de comodidad. ¿Cómo definirías tu prioridad financiera?",
      fr: "Une semaine fatigante a augmenté vos dépenses de commodité. Comment définir votre priorité financière ?",
      pt: "Uma semana cansativa aumentou seus gastos com conveniência. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_69_1",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_69_2",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_69_3",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_69_4",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_70",
    position: 70,
    dimension: "BALANCER",
    difficulty: "EASY",
    prompt: {
      en: "You want to help someone while keeping your bills covered. How would you set your financial priority?",
      es: "Quieres ayudar a alguien sin comprometer tus propias facturas. ¿Cómo definirías tu prioridad financiera?",
      fr: "Vous voulez aider quelqu’un en préservant vos propres factures. Comment définir votre priorité financière ?",
      pt: "Você quer ajudar alguém sem comprometer suas próprias contas. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_70_1",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_70_2",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_70_3",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_70_4",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_71",
    position: 71,
    dimension: "BALANCER",
    difficulty: "EASY",
    prompt: {
      en: "Your budget allows a small treat alongside a future goal. How would you set your financial priority?",
      es: "Tu presupuesto permite un pequeño gusto, pero también hay una meta futura. ¿Cómo definirías tu prioridad financiera?",
      fr: "Votre budget permet un petit plaisir mais vous avez aussi un objectif futur. Comment définir votre priorité financière ?",
      pt: "Seu orçamento permite um pequeno prazer mas também há uma meta futura. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_71_1",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_71_2",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_71_3",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_71_4",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_72",
    position: 72,
    dimension: "BALANCER",
    difficulty: "MEDIUM",
    prompt: {
      en: "You notice spending cuts made you drop meaningful activities. How would you set your financial priority?",
      es: "Notas que redujiste tanto el gasto que dejaste actividades importantes. ¿Cómo definirías tu prioridad financiera?",
      fr: "Vous constatez que vos économies vous ont fait abandonner des activités importantes. Comment définir votre priorité financière ?",
      pt: "Você percebe que reduziu tanto os gastos que abandonou atividades importantes. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_72_1",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_72_2",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_72_3",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_72_4",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_73",
    position: 73,
    dimension: "BALANCER",
    difficulty: "MEDIUM",
    prompt: {
      en: "A recurring social invitation weighs on this month’s budget. How would you set your financial priority?",
      es: "Una invitación social recurrente pesa en el presupuesto mensual. ¿Cómo definirías tu prioridad financiera?",
      fr: "Une invitation sociale régulière pèse sur le budget du mois. Comment définir votre priorité financière ?",
      pt: "Um convite social recorrente pesa no orçamento do mês. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_73_1",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_73_2",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_73_3",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_73_4",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_74",
    position: 74,
    dimension: "BALANCER",
    difficulty: "MEDIUM",
    prompt: {
      en: "You need to balance everyday health spending and leisure. How would you set your financial priority?",
      es: "Necesitas conciliar gastos de salud cotidiana y ocio. ¿Cómo definirías tu prioridad financiera?",
      fr: "Vous devez concilier dépenses de santé courantes et loisirs. Comment définir votre priorité financière ?",
      pt: "Você precisa conciliar gastos de saúde cotidiana com lazer. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_74_1",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_74_2",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_74_3",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_74_4",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_75",
    position: 75,
    dimension: "BALANCER",
    difficulty: "HARD",
    prompt: {
      en: "Someone suggests cutting all leisure to reach a goal sooner. How would you set your financial priority?",
      es: "Alguien propone cortar todo ocio para alcanzar antes una meta. ¿Cómo definirías tu prioridad financiera?",
      fr: "Quelqu’un propose de supprimer tous les loisirs pour atteindre un objectif plus vite. Comment définir votre priorité financière ?",
      pt: "Uma pessoa sugere cortar todo lazer para atingir uma meta mais rápido. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_75_1",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_75_2",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_75_3",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_75_4",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_76",
    position: 76,
    dimension: "BALANCER",
    difficulty: "HARD",
    prompt: {
      en: "You saved money but miss meeting friends. How would you set your financial priority?",
      es: "Lograste ahorrar, pero echas de menos reunirte con amigos. ¿Cómo definirías tu prioridad financiera?",
      fr: "Vous avez économisé mais les rencontres amicales vous manquent. Comment définir votre priorité financière ?",
      pt: "Você conseguiu economizar mas sente falta de encontros com amigos. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_76_1",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_76_2",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_76_3",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_76_4",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_77",
    position: 77,
    dimension: "BALANCER",
    difficulty: "HARD",
    prompt: {
      en: "A small daily-life improvement competes with this month’s savings. How would you set your financial priority?",
      es: "Una mejora sencilla de la rutina compite con el ahorro del mes. ¿Cómo definirías tu prioridad financiera?",
      fr: "Une petite amélioration du quotidien concurrence l’épargne du mois. Comment définir votre priorité financière ?",
      pt: "Uma melhoria simples na rotina compete com a poupança do mês. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_77_1",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_77_2",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_77_3",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_77_4",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_78",
    position: 78,
    dimension: "BALANCER",
    difficulty: "HARD",
    prompt: {
      en: "You want to give someone a gift while keeping your financial plan. How would you set your financial priority?",
      es: "Quieres hacer un regalo y mantener tu plan financiero. ¿Cómo definirías tu prioridad financiera?",
      fr: "Vous souhaitez offrir un cadeau tout en préservant votre plan financier. Comment définir votre priorité financière ?",
      pt: "Você quer presentear alguém e também manter seu plano financeiro. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_78_1",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_78_2",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_78_3",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_78_4",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_79",
    position: 79,
    dimension: "BALANCER",
    difficulty: "HARD",
    prompt: {
      en: "Your budget became rigid and a small surprise needs an adjustment. How would you set your financial priority?",
      es: "Tu presupuesto se volvió rígido y un imprevisto exige adaptarlo. ¿Cómo definirías tu prioridad financiera?",
      fr: "Votre budget est devenu rigide et un petit imprévu exige un ajustement. Comment définir votre priorité financière ?",
      pt: "Seu orçamento ficou rígido e um pequeno imprevisto exige adaptação. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_79_1",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_79_2",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
      {
        stableKey: "MD2_79_3",
        label: {
          en: "Use the money for a step in a long-term project.",
          es: "Usar el dinero en una etapa de un proyecto a largo plazo.",
          fr: "Consacrer la somme à une étape d’un projet à long terme.",
          pt: "Aplicar o valor em uma etapa de um projeto de longo prazo.",
        },
        signals: {
          BUILDER: 1,
        },
      },
      {
        stableKey: "MD2_79_4",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
    ],
  },
  {
    stableKey: "MD2_80",
    position: 80,
    dimension: "BALANCER",
    difficulty: "HARD",
    prompt: {
      en: "Your income is stable and you want to review goals and wellbeing. How would you set your financial priority?",
      es: "Tienes ingresos estables y quieres revisar el espacio de metas y bienestar. ¿Cómo definirías tu prioridad financiera?",
      fr: "Vos revenus sont stables et vous voulez revoir la place des objectifs et du bien-être. Comment définir votre priorité financière ?",
      pt: "Você tem renda estável e quer rever o espaço dado a metas e bem-estar. Como definiria sua prioridade financeira?",
    },
    options: [
      {
        stableKey: "MD2_80_1",
        label: {
          en: "Split the margin between a current need and a future goal.",
          es: "Repartir el margen entre una necesidad actual y una meta futura.",
          fr: "Répartir la marge entre un besoin actuel et un objectif futur.",
          pt: "Dividir a margem entre uma necessidade atual e uma meta futura.",
        },
        signals: {
          BALANCER: 1,
        },
      },
      {
        stableKey: "MD2_80_2",
        label: {
          en: "Keep the money to preserve my cushion for unexpected costs.",
          es: "Conservar el dinero para mantener mi margen ante imprevistos.",
          fr: "Garder l’argent pour préserver ma marge face aux imprévus.",
          pt: "Preservar o dinheiro para manter minha margem diante de imprevistos.",
        },
        signals: {
          GUARDIAN: 1,
        },
      },
      {
        stableKey: "MD2_80_3",
        label: {
          en: "Compare costs, timing and impact before allocating the money.",
          es: "Comparar costes, plazos e impacto antes de asignar el dinero.",
          fr: "Comparer coûts, délais et effets avant d’affecter la somme.",
          pt: "Comparar custos, prazos e impacto antes de alocar o dinheiro.",
        },
        signals: {
          STRATEGIST: 1,
        },
      },
      {
        stableKey: "MD2_80_4",
        label: {
          en: "Make room for a meaningful experience in the present.",
          es: "Dar espacio a una experiencia significativa en el presente.",
          fr: "Faire une place à une expérience significative dans le présent.",
          pt: "Dar espaço a uma experiência significativa no presente.",
        },
        signals: {
          ADVENTURER: 1,
        },
      },
    ],
  },
];
