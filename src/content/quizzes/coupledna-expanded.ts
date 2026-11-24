import { scenario, type ScenarioDefinition } from "./behavioral-scenario";

// New contexts on the same descriptive continuum; neither pole is relationship quality.
export const additionalCoupleScenarios: readonly ScenarioDefinition[] = [
  scenario(
    "CD2_21",
    21,
    "COMMUNICATION",
    {
      pt: [
        "Uma mensagem sua foi entendida como cobrança. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "Your message was understood as a demand. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Un mensaje tuyo se entendió como exigencia. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Votre message a été compris comme un reproche. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        COMMUNICATION: 1,
      },
      {
        COMMUNICATION: 2,
      },
      {
        COMMUNICATION: 3,
      },
      {
        COMMUNICATION: 0,
      },
    ],
    "EASY",
  ),
  scenario(
    "CD2_22",
    22,
    "COMMUNICATION",
    {
      pt: [
        "Você quer falar de um dia difícil enquanto a outra pessoa está ocupada. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "You want to discuss a hard day while your partner is busy. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Quieres hablar de un día difícil mientras tu pareja está ocupada. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Vous voulez parler d’une journée difficile alors que l’autre est occupé. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        COMMUNICATION: 3,
      },
      {
        COMMUNICATION: 0,
      },
      {
        COMMUNICATION: 1,
      },
      {
        COMMUNICATION: 2,
      },
    ],
    "EASY",
  ),
  scenario(
    "CD2_23",
    23,
    "COMMUNICATION",
    {
      pt: [
        "Uma brincadeira feita em público deixou você desconfortável. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "A joke in public made you uncomfortable. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Una broma en público te hizo sentir mal. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Une plaisanterie en public vous a mis mal à l’aise. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        COMMUNICATION: 1,
      },
      {
        COMMUNICATION: 2,
      },
      {
        COMMUNICATION: 3,
      },
      {
        COMMUNICATION: 0,
      },
    ],
    "EASY",
  ),
  scenario(
    "CD2_24",
    24,
    "COMMUNICATION",
    {
      pt: [
        "Vocês têm preferências diferentes sobre mensagens durante o trabalho. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "You have different preferences about messages during work. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Tenéis preferencias distintas sobre mensajes durante el trabajo. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Vous avez des préférences différentes pour les messages au travail. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        COMMUNICATION: 3,
      },
      {
        COMMUNICATION: 0,
      },
      {
        COMMUNICATION: 1,
      },
      {
        COMMUNICATION: 2,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "CD2_25",
    25,
    "COMMUNICATION",
    {
      pt: [
        "Você sente falta de ouvir reconhecimento por algo que fez. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "You miss hearing appreciation for something you did. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Echas de menos reconocimiento por algo que hiciste. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Vous aimeriez entendre de la reconnaissance pour quelque chose que vous avez fait. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        COMMUNICATION: 1,
      },
      {
        COMMUNICATION: 2,
      },
      {
        COMMUNICATION: 3,
      },
      {
        COMMUNICATION: 0,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "CD2_26",
    26,
    "COMMUNICATION",
    {
      pt: [
        "A outra pessoa pede sua opinião enquanto você ainda está confuso. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "Your partner asks your opinion while you still feel unsure. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Tu pareja pide tu opinión cuando aún tienes dudas. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "L’autre vous demande votre avis alors que vous hésitez encore. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        COMMUNICATION: 3,
      },
      {
        COMMUNICATION: 0,
      },
      {
        COMMUNICATION: 1,
      },
      {
        COMMUNICATION: 2,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "CD2_27",
    27,
    "COMMUNICATION",
    {
      pt: [
        "Uma conversa importante foi interrompida várias vezes. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "An important conversation was interrupted several times. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Una conversación importante se interrumpió varias veces. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Une conversation importante a été interrompue plusieurs fois. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        COMMUNICATION: 1,
      },
      {
        COMMUNICATION: 2,
      },
      {
        COMMUNICATION: 3,
      },
      {
        COMMUNICATION: 0,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_28",
    28,
    "COMMUNICATION",
    {
      pt: [
        "Vocês discordam sobre compartilhar detalhes do casal com amigos. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "You disagree about sharing relationship details with friends. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "No coincidís sobre compartir detalles de pareja con amigos. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Vous n’êtes pas d’accord sur les détails du couple à partager avec des amis. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        COMMUNICATION: 3,
      },
      {
        COMMUNICATION: 0,
      },
      {
        COMMUNICATION: 1,
      },
      {
        COMMUNICATION: 2,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_29",
    29,
    "COMMUNICATION",
    {
      pt: [
        "Você quer pedir mais tempo de qualidade durante a semana. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "You want to ask for more quality time during the week. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Quieres pedir más tiempo de calidad durante la semana. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Vous souhaitez demander plus de temps de qualité en semaine. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        COMMUNICATION: 1,
      },
      {
        COMMUNICATION: 2,
      },
      {
        COMMUNICATION: 3,
      },
      {
        COMMUNICATION: 0,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_30",
    30,
    "COMMUNICATION",
    {
      pt: [
        "Uma mudança de rotina fez suas conversas ficarem muito curtas. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "A routine change made your conversations much shorter. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Un cambio de rutina acortó mucho vuestras conversaciones. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Un changement de routine a beaucoup raccourci vos échanges. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        COMMUNICATION: 3,
      },
      {
        COMMUNICATION: 0,
      },
      {
        COMMUNICATION: 1,
      },
      {
        COMMUNICATION: 2,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_31",
    31,
    "COMMUNICATION",
    {
      pt: [
        "Você recebe uma notícia pessoal e ainda não sabe como compartilhá-la. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "You receive personal news and do not yet know how to share it. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Recibes una noticia personal y aún no sabes cómo compartirla. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Vous recevez une nouvelle personnelle sans savoir encore comment la partager. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        COMMUNICATION: 1,
      },
      {
        COMMUNICATION: 2,
      },
      {
        COMMUNICATION: 3,
      },
      {
        COMMUNICATION: 0,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_32",
    32,
    "COMMUNICATION",
    {
      pt: [
        "A outra pessoa interpreta seu silêncio como desinteresse. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "Your partner interprets your silence as lack of interest. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Tu pareja interpreta tu silencio como desinterés. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "L’autre interprète votre silence comme un manque d’intérêt. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        COMMUNICATION: 3,
      },
      {
        COMMUNICATION: 0,
      },
      {
        COMMUNICATION: 1,
      },
      {
        COMMUNICATION: 2,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_33",
    33,
    "LIFE_VALUES",
    {
      pt: [
        "Uma tradição familiar importante para você não faz sentido para a outra pessoa. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "A family tradition important to you means little to your partner. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Una tradición familiar importante para ti no tiene sentido para tu pareja. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Une tradition familiale importante pour vous n’a pas de sens pour l’autre. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        LIFE_VALUES: 1,
      },
      {
        LIFE_VALUES: 2,
      },
      {
        LIFE_VALUES: 3,
      },
      {
        LIFE_VALUES: 0,
      },
    ],
    "EASY",
  ),
  scenario(
    "CD2_34",
    34,
    "LIFE_VALUES",
    {
      pt: [
        "Vocês têm preferências diferentes sobre praticar uma religião. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "You have different preferences about practising a religion. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Tenéis preferencias distintas sobre practicar una religión. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Vous avez des préférences différentes concernant la pratique religieuse. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        LIFE_VALUES: 3,
      },
      {
        LIFE_VALUES: 0,
      },
      {
        LIFE_VALUES: 1,
      },
      {
        LIFE_VALUES: 2,
      },
    ],
    "EASY",
  ),
  scenario(
    "CD2_35",
    35,
    "LIFE_VALUES",
    {
      pt: [
        "Você quer dedicar parte do fim de semana a uma causa social. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "You want to dedicate part of the weekend to a social cause. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Quieres dedicar parte del fin de semana a una causa social. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Vous souhaitez consacrer une partie du week-end à une cause sociale. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        LIFE_VALUES: 1,
      },
      {
        LIFE_VALUES: 2,
      },
      {
        LIFE_VALUES: 3,
      },
      {
        LIFE_VALUES: 0,
      },
    ],
    "EASY",
  ),
  scenario(
    "CD2_36",
    36,
    "LIFE_VALUES",
    {
      pt: [
        "Vocês divergem sobre a frequência de visitas à família. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "You differ on how often to visit family. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "No coincidís sobre la frecuencia de visitas familiares. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Vous divergez sur la fréquence des visites familiales. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        LIFE_VALUES: 3,
      },
      {
        LIFE_VALUES: 0,
      },
      {
        LIFE_VALUES: 1,
      },
      {
        LIFE_VALUES: 2,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "CD2_37",
    37,
    "LIFE_VALUES",
    {
      pt: [
        "Uma escolha de consumo sustentável exige mudar um hábito do casal. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "A sustainable purchase requires changing a shared habit. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Una elección de consumo sostenible exige cambiar un hábito de pareja. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Un choix de consommation durable demande de changer une habitude commune. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        LIFE_VALUES: 1,
      },
      {
        LIFE_VALUES: 2,
      },
      {
        LIFE_VALUES: 3,
      },
      {
        LIFE_VALUES: 0,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "CD2_38",
    38,
    "LIFE_VALUES",
    {
      pt: [
        "Você quer preservar uma amizade que a outra pessoa não conhece. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "You want to preserve a friendship your partner does not know. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Quieres mantener una amistad que tu pareja no conoce. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Vous voulez préserver une amitié que l’autre ne connaît pas. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        LIFE_VALUES: 3,
      },
      {
        LIFE_VALUES: 0,
      },
      {
        LIFE_VALUES: 1,
      },
      {
        LIFE_VALUES: 2,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "CD2_39",
    39,
    "LIFE_VALUES",
    {
      pt: [
        "Vocês têm visões diferentes sobre receber convidados em casa. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "You have different views on hosting guests at home. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Tenéis ideas distintas sobre recibir visitas en casa. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Vous avez des avis différents sur l’accueil d’invités à la maison. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        LIFE_VALUES: 1,
      },
      {
        LIFE_VALUES: 2,
      },
      {
        LIFE_VALUES: 3,
      },
      {
        LIFE_VALUES: 0,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_40",
    40,
    "LIFE_VALUES",
    {
      pt: [
        "Um compromisso familiar compete com seu tempo de descanso. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "A family commitment competes with your rest time. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Un compromiso familiar compite con tu descanso. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Un engagement familial concurrence votre temps de repos. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        LIFE_VALUES: 3,
      },
      {
        LIFE_VALUES: 0,
      },
      {
        LIFE_VALUES: 1,
      },
      {
        LIFE_VALUES: 2,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_41",
    41,
    "LIFE_VALUES",
    {
      pt: [
        "Você quer manter um costume pessoal após começar a morar junto. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "You want to keep a personal custom after moving in together. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Quieres mantener una costumbre personal al empezar a convivir. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Vous souhaitez garder une habitude personnelle après l’emménagement à deux. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        LIFE_VALUES: 1,
      },
      {
        LIFE_VALUES: 2,
      },
      {
        LIFE_VALUES: 3,
      },
      {
        LIFE_VALUES: 0,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_42",
    42,
    "LIFE_VALUES",
    {
      pt: [
        "Vocês discordam sobre a exposição da vida pessoal nas redes. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "You disagree on exposing personal life on social media. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "No coincidís sobre exponer la vida personal en redes. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Vous divergez sur l’exposition de la vie privée sur les réseaux. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        LIFE_VALUES: 3,
      },
      {
        LIFE_VALUES: 0,
      },
      {
        LIFE_VALUES: 1,
      },
      {
        LIFE_VALUES: 2,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_43",
    43,
    "LIFE_VALUES",
    {
      pt: [
        "Uma celebração importante para você não é prioridade para a outra pessoa. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "A celebration important to you is not your partner’s priority. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Una celebración importante para ti no es prioridad para tu pareja. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Une fête importante pour vous n’est pas prioritaire pour l’autre. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        LIFE_VALUES: 1,
      },
      {
        LIFE_VALUES: 2,
      },
      {
        LIFE_VALUES: 3,
      },
      {
        LIFE_VALUES: 0,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_44",
    44,
    "LIFE_VALUES",
    {
      pt: [
        "Você precisa equilibrar privacidade pessoal e hábitos compartilhados. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "You need to balance personal privacy and shared habits. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Necesitas equilibrar privacidad personal y hábitos compartidos. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Vous devez concilier intimité personnelle et habitudes communes. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        LIFE_VALUES: 3,
      },
      {
        LIFE_VALUES: 0,
      },
      {
        LIFE_VALUES: 1,
      },
      {
        LIFE_VALUES: 2,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_45",
    45,
    "CONFLICT_MANAGEMENT",
    {
      pt: [
        "Uma discussão sobre tarefas domésticas volta toda semana. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "An argument about household chores returns every week. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Una discusión sobre tareas domésticas se repite cada semana. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Une dispute sur les tâches ménagères revient chaque semaine. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        CONFLICT_MANAGEMENT: 1,
      },
      {
        CONFLICT_MANAGEMENT: 2,
      },
      {
        CONFLICT_MANAGEMENT: 3,
      },
      {
        CONFLICT_MANAGEMENT: 0,
      },
    ],
    "EASY",
  ),
  scenario(
    "CD2_46",
    46,
    "CONFLICT_MANAGEMENT",
    {
      pt: [
        "Vocês percebem que uma conversa está ficando mais tensa. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "You notice a conversation becoming more tense. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Notáis que una conversación está ganando tensión. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Vous constatez qu’une conversation devient plus tendue. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        CONFLICT_MANAGEMENT: 3,
      },
      {
        CONFLICT_MANAGEMENT: 0,
      },
      {
        CONFLICT_MANAGEMENT: 1,
      },
      {
        CONFLICT_MANAGEMENT: 2,
      },
    ],
    "EASY",
  ),
  scenario(
    "CD2_47",
    47,
    "CONFLICT_MANAGEMENT",
    {
      pt: [
        "A outra pessoa pede para resolver um desacordo antes de dormir. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "Your partner asks to settle a disagreement before bed. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Tu pareja pide resolver un desacuerdo antes de dormir. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "L’autre demande de régler un désaccord avant de dormir. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        CONFLICT_MANAGEMENT: 1,
      },
      {
        CONFLICT_MANAGEMENT: 2,
      },
      {
        CONFLICT_MANAGEMENT: 3,
      },
      {
        CONFLICT_MANAGEMENT: 0,
      },
    ],
    "EASY",
  ),
  scenario(
    "CD2_48",
    48,
    "CONFLICT_MANAGEMENT",
    {
      pt: [
        "Você percebe que errou depois de defender sua posição com firmeza. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "You realise you were wrong after firmly defending your position. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Notas que te equivocaste tras defender tu postura con firmeza. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Vous réalisez votre erreur après avoir fermement défendu votre position. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        CONFLICT_MANAGEMENT: 3,
      },
      {
        CONFLICT_MANAGEMENT: 0,
      },
      {
        CONFLICT_MANAGEMENT: 1,
      },
      {
        CONFLICT_MANAGEMENT: 2,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "CD2_49",
    49,
    "CONFLICT_MANAGEMENT",
    {
      pt: [
        "Vocês lembram de formas diferentes um acordo recente. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "You remember a recent agreement differently. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Recordáis de forma distinta un acuerdo reciente. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Vous vous souvenez différemment d’un accord récent. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        CONFLICT_MANAGEMENT: 1,
      },
      {
        CONFLICT_MANAGEMENT: 2,
      },
      {
        CONFLICT_MANAGEMENT: 3,
      },
      {
        CONFLICT_MANAGEMENT: 0,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "CD2_50",
    50,
    "CONFLICT_MANAGEMENT",
    {
      pt: [
        "Um atraso gera irritação antes de um compromisso importante. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "A delay causes irritation before an important appointment. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Un retraso causa irritación antes de una cita importante. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Un retard provoque de l’irritation avant un rendez-vous important. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        CONFLICT_MANAGEMENT: 3,
      },
      {
        CONFLICT_MANAGEMENT: 0,
      },
      {
        CONFLICT_MANAGEMENT: 1,
      },
      {
        CONFLICT_MANAGEMENT: 2,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "CD2_51",
    51,
    "CONFLICT_MANAGEMENT",
    {
      pt: [
        "Uma crítica sobre organização parece mais dura do que você esperava. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "A comment on organisation feels harsher than expected. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Una crítica sobre organización parece más dura de lo esperado. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Une critique sur l’organisation vous semble plus dure que prévu. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        CONFLICT_MANAGEMENT: 1,
      },
      {
        CONFLICT_MANAGEMENT: 2,
      },
      {
        CONFLICT_MANAGEMENT: 3,
      },
      {
        CONFLICT_MANAGEMENT: 0,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_52",
    52,
    "CONFLICT_MANAGEMENT",
    {
      pt: [
        "Vocês discordam durante uma viagem e precisam seguir o roteiro. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "You disagree during a trip and need to continue the itinerary. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Discutís durante un viaje y necesitáis seguir el itinerario. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Vous divergez pendant un voyage et devez poursuivre l’itinéraire. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        CONFLICT_MANAGEMENT: 3,
      },
      {
        CONFLICT_MANAGEMENT: 0,
      },
      {
        CONFLICT_MANAGEMENT: 1,
      },
      {
        CONFLICT_MANAGEMENT: 2,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_53",
    53,
    "CONFLICT_MANAGEMENT",
    {
      pt: [
        "Um pedido de mudança chega em um momento de cansaço. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "A request for change arrives when you are tired. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Una petición de cambio llega cuando estás cansado. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Une demande de changement arrive à un moment de fatigue. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        CONFLICT_MANAGEMENT: 1,
      },
      {
        CONFLICT_MANAGEMENT: 2,
      },
      {
        CONFLICT_MANAGEMENT: 3,
      },
      {
        CONFLICT_MANAGEMENT: 0,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_54",
    54,
    "CONFLICT_MANAGEMENT",
    {
      pt: [
        "Vocês já tentaram uma solução e o problema reapareceu. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "You tried a solution and the problem returned. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Ya probasteis una solución y el problema reapareció. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Vous avez essayé une solution et le problème est revenu. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        CONFLICT_MANAGEMENT: 3,
      },
      {
        CONFLICT_MANAGEMENT: 0,
      },
      {
        CONFLICT_MANAGEMENT: 1,
      },
      {
        CONFLICT_MANAGEMENT: 2,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_55",
    55,
    "CONFLICT_MANAGEMENT",
    {
      pt: [
        "Você quer retomar uma conversa que terminou sem acordo. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "You want to reopen a conversation that ended without agreement. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Quieres retomar una conversación que terminó sin acuerdo. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Vous voulez reprendre une conversation terminée sans accord. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        CONFLICT_MANAGEMENT: 1,
      },
      {
        CONFLICT_MANAGEMENT: 2,
      },
      {
        CONFLICT_MANAGEMENT: 3,
      },
      {
        CONFLICT_MANAGEMENT: 0,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_56",
    56,
    "CONFLICT_MANAGEMENT",
    {
      pt: [
        "Uma divisão de responsabilidades passou a parecer injusta. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "A division of responsibilities has started to feel unfair. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Un reparto de responsabilidades empezó a parecer injusto. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Une répartition des responsabilités commence à sembler injuste. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        CONFLICT_MANAGEMENT: 3,
      },
      {
        CONFLICT_MANAGEMENT: 0,
      },
      {
        CONFLICT_MANAGEMENT: 1,
      },
      {
        CONFLICT_MANAGEMENT: 2,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_57",
    57,
    "FINANCES",
    {
      pt: [
        "Uma compra pessoal afeta o prazo de uma meta compartilhada. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "A personal purchase affects a shared goal’s timeline. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Una compra personal afecta al plazo de una meta compartida. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Un achat personnel modifie le calendrier d’un objectif commun. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        FINANCES: 1,
      },
      {
        FINANCES: 2,
      },
      {
        FINANCES: 3,
      },
      {
        FINANCES: 0,
      },
    ],
    "EASY",
  ),
  scenario(
    "CD2_58",
    58,
    "FINANCES",
    {
      pt: [
        "Vocês têm rendas diferentes e precisam dividir uma despesa nova. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "Your incomes differ and you need to split a new expense. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Tenéis ingresos distintos y debéis repartir un gasto nuevo. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Vos revenus diffèrent et vous devez répartir une nouvelle dépense. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        FINANCES: 3,
      },
      {
        FINANCES: 0,
      },
      {
        FINANCES: 1,
      },
      {
        FINANCES: 2,
      },
    ],
    "EASY",
  ),
  scenario(
    "CD2_59",
    59,
    "FINANCES",
    {
      pt: [
        "Uma conta conjunta veio acima do valor previsto. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "A shared bill came in above the expected amount. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Una factura compartida superó el importe previsto. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Une facture commune dépasse le montant prévu. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        FINANCES: 1,
      },
      {
        FINANCES: 2,
      },
      {
        FINANCES: 3,
      },
      {
        FINANCES: 0,
      },
    ],
    "EASY",
  ),
  scenario(
    "CD2_60",
    60,
    "FINANCES",
    {
      pt: [
        "A outra pessoa quer emprestar dinheiro a um amigo. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "Your partner wants to lend money to a friend. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Tu pareja quiere prestar dinero a un amigo. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "L’autre souhaite prêter de l’argent à un ami. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        FINANCES: 3,
      },
      {
        FINANCES: 0,
      },
      {
        FINANCES: 1,
      },
      {
        FINANCES: 2,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "CD2_61",
    61,
    "FINANCES",
    {
      pt: [
        "Você gostaria de manter parte da renda em uma conta pessoal. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "You would like to keep some income in a personal account. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Te gustaría guardar parte de tus ingresos en una cuenta personal. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Vous aimeriez garder une partie de vos revenus sur un compte personnel. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        FINANCES: 1,
      },
      {
        FINANCES: 2,
      },
      {
        FINANCES: 3,
      },
      {
        FINANCES: 0,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "CD2_62",
    62,
    "FINANCES",
    {
      pt: [
        "Vocês precisam decidir um teto de gastos para as férias. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "You need to decide a holiday spending ceiling. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Necesitáis decidir un límite de gasto para las vacaciones. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Vous devez décider d’un plafond de dépenses pour les vacances. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        FINANCES: 3,
      },
      {
        FINANCES: 0,
      },
      {
        FINANCES: 1,
      },
      {
        FINANCES: 2,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "CD2_63",
    63,
    "FINANCES",
    {
      pt: [
        "Uma assinatura usada por apenas uma pessoa entra nas contas comuns. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "A subscription used by one person enters shared bills. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Una suscripción usada por una persona entra en gastos comunes. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Un abonnement utilisé par une seule personne entre dans les frais communs. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        FINANCES: 1,
      },
      {
        FINANCES: 2,
      },
      {
        FINANCES: 3,
      },
      {
        FINANCES: 0,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_64",
    64,
    "FINANCES",
    {
      pt: [
        "Você recebe um bônus enquanto há uma despesa compartilhada pendente. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "You receive a bonus while a shared expense is pending. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Recibes una prima mientras queda un gasto compartido pendiente. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Vous recevez une prime alors qu’une dépense commune reste en attente. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        FINANCES: 3,
      },
      {
        FINANCES: 0,
      },
      {
        FINANCES: 1,
      },
      {
        FINANCES: 2,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_65",
    65,
    "FINANCES",
    {
      pt: [
        "Vocês divergem sobre quanto reservar para emergências. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "You differ on how much to reserve for emergencies. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "No coincidís sobre cuánto reservar para emergencias. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Vous divergez sur le montant à réserver aux imprévus. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        FINANCES: 1,
      },
      {
        FINANCES: 2,
      },
      {
        FINANCES: 3,
      },
      {
        FINANCES: 0,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_66",
    66,
    "FINANCES",
    {
      pt: [
        "Uma redução de renda exige rever a contribuição de cada pessoa. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "A drop in income requires reviewing each person’s contribution. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Una caída de ingresos exige revisar la contribución de cada persona. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Une baisse de revenus exige de revoir la contribution de chacun. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        FINANCES: 3,
      },
      {
        FINANCES: 0,
      },
      {
        FINANCES: 1,
      },
      {
        FINANCES: 2,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_67",
    67,
    "FINANCES",
    {
      pt: [
        "Uma reforma da casa exige escolher quais despesas adiar. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "A home renovation requires choosing which expenses to postpone. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Una reforma exige decidir qué gastos aplazar. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Une rénovation du logement oblige à choisir les dépenses à reporter. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        FINANCES: 1,
      },
      {
        FINANCES: 2,
      },
      {
        FINANCES: 3,
      },
      {
        FINANCES: 0,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_68",
    68,
    "FINANCES",
    {
      pt: [
        "Vocês precisam escolher como registrar as despesas compartilhadas. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "You need to choose how to record shared expenses. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Necesitáis elegir cómo registrar los gastos compartidos. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Vous devez choisir comment consigner les dépenses communes. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        FINANCES: 3,
      },
      {
        FINANCES: 0,
      },
      {
        FINANCES: 1,
      },
      {
        FINANCES: 2,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_69",
    69,
    "FUTURE_PLANS",
    {
      pt: [
        "Uma proposta de trabalho pode exigir mudança de cidade. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "A job offer may require moving to another city. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Una oferta laboral puede exigir cambiar de ciudad. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Une offre d’emploi peut nécessiter un déménagement. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        FUTURE_PLANS: 1,
      },
      {
        FUTURE_PLANS: 2,
      },
      {
        FUTURE_PLANS: 3,
      },
      {
        FUTURE_PLANS: 0,
      },
    ],
    "EASY",
  ),
  scenario(
    "CD2_70",
    70,
    "FUTURE_PLANS",
    {
      pt: [
        "Vocês têm prazos diferentes para começar a morar juntos. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "You have different timelines for moving in together. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Tenéis plazos distintos para empezar a convivir. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Vous avez des calendriers différents pour vivre ensemble. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        FUTURE_PLANS: 3,
      },
      {
        FUTURE_PLANS: 0,
      },
      {
        FUTURE_PLANS: 1,
      },
      {
        FUTURE_PLANS: 2,
      },
    ],
    "EASY",
  ),
  scenario(
    "CD2_71",
    71,
    "FUTURE_PLANS",
    {
      pt: [
        "Você quer voltar a estudar e isso mudaria a rotina do casal. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "You want to resume studying and it would change your shared routine. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Quieres retomar estudios y eso cambiaría la rutina de pareja. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Vous souhaitez reprendre des études et cela modifierait votre routine commune. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        FUTURE_PLANS: 1,
      },
      {
        FUTURE_PLANS: 2,
      },
      {
        FUTURE_PLANS: 3,
      },
      {
        FUTURE_PLANS: 0,
      },
    ],
    "EASY",
  ),
  scenario(
    "CD2_72",
    72,
    "FUTURE_PLANS",
    {
      pt: [
        "Uma meta de viagem deixou de caber no próximo ano. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "A travel goal no longer fits next year. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Una meta de viaje ya no cabe el próximo año. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Un projet de voyage ne trouve plus sa place l’an prochain. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        FUTURE_PLANS: 3,
      },
      {
        FUTURE_PLANS: 0,
      },
      {
        FUTURE_PLANS: 1,
      },
      {
        FUTURE_PLANS: 2,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "CD2_73",
    73,
    "FUTURE_PLANS",
    {
      pt: [
        "Vocês têm dúvidas sobre onde gostariam de viver no futuro. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "You are unsure where you would like to live in future. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Tenéis dudas sobre dónde os gustaría vivir en el futuro. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Vous hésitez sur le lieu où vivre à l’avenir. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        FUTURE_PLANS: 1,
      },
      {
        FUTURE_PLANS: 2,
      },
      {
        FUTURE_PLANS: 3,
      },
      {
        FUTURE_PLANS: 0,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "CD2_74",
    74,
    "FUTURE_PLANS",
    {
      pt: [
        "Uma oportunidade de intercâmbio muda seus planos por alguns meses. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "An exchange opportunity changes your plans for several months. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Una oportunidad de intercambio cambia tus planes unos meses. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Une occasion d’échange modifie vos projets pour quelques mois. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        FUTURE_PLANS: 3,
      },
      {
        FUTURE_PLANS: 0,
      },
      {
        FUTURE_PLANS: 1,
      },
      {
        FUTURE_PLANS: 2,
      },
    ],
    "MEDIUM",
  ),
  scenario(
    "CD2_75",
    75,
    "FUTURE_PLANS",
    {
      pt: [
        "Você quer redefinir uma meta profissional que afeta o tempo juntos. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "You want to redefine a career goal that affects time together. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Quieres redefinir una meta laboral que afecta al tiempo juntos. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Vous souhaitez redéfinir un objectif professionnel qui affecte votre temps ensemble. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        FUTURE_PLANS: 1,
      },
      {
        FUTURE_PLANS: 2,
      },
      {
        FUTURE_PLANS: 3,
      },
      {
        FUTURE_PLANS: 0,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_76",
    76,
    "FUTURE_PLANS",
    {
      pt: [
        "Vocês ainda não conversaram sobre responsabilidades futuras de cuidado. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "You have not yet discussed future caring responsibilities. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Aún no hablasteis de futuras responsabilidades de cuidado. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Vous n’avez pas encore parlé de futures responsabilités d’aide aux proches. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        FUTURE_PLANS: 3,
      },
      {
        FUTURE_PLANS: 0,
      },
      {
        FUTURE_PLANS: 1,
      },
      {
        FUTURE_PLANS: 2,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_77",
    77,
    "FUTURE_PLANS",
    {
      pt: [
        "Uma mudança familiar exige reorganizar planos para o próximo semestre. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "A family change requires reorganising plans for the next six months. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Un cambio familiar exige reorganizar el próximo semestre. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Un changement familial exige de revoir les projets du prochain semestre. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        FUTURE_PLANS: 1,
      },
      {
        FUTURE_PLANS: 2,
      },
      {
        FUTURE_PLANS: 3,
      },
      {
        FUTURE_PLANS: 0,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_78",
    78,
    "FUTURE_PLANS",
    {
      pt: [
        "Você quer avaliar com calma a possibilidade de ter filhos. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "You want time to consider the possibility of having children. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Quieres valorar con calma la posibilidad de tener hijos. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Vous souhaitez réfléchir sereinement à la possibilité d’avoir des enfants. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        FUTURE_PLANS: 3,
      },
      {
        FUTURE_PLANS: 0,
      },
      {
        FUTURE_PLANS: 1,
      },
      {
        FUTURE_PLANS: 2,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_79",
    79,
    "FUTURE_PLANS",
    {
      pt: [
        "Um projeto conjunto ficou maior do que vocês conseguem executar agora. Qual seria seu primeiro passo?",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
      ],
      en: [
        "A shared project grew beyond what you can manage now. What would your first step be?",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
      ],
      es: [
        "Un proyecto conjunto creció más de lo que podéis ejecutar ahora. ¿Cuál sería tu primer paso?",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
      ],
      fr: [
        "Un projet commun dépasse ce que vous pouvez réaliser maintenant. Quelle serait votre première démarche ?",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
      ],
    },
    [
      {
        FUTURE_PLANS: 1,
      },
      {
        FUTURE_PLANS: 2,
      },
      {
        FUTURE_PLANS: 3,
      },
      {
        FUTURE_PLANS: 0,
      },
    ],
    "HARD",
  ),
  scenario(
    "CD2_80",
    80,
    "FUTURE_PLANS",
    {
      pt: [
        "Você deseja planejar o próximo ano sem fechar todas as possibilidades. Qual seria seu primeiro passo?",
        "Conversar sobre o que importa para cada pessoa antes de definir o caminho.",
        "Refletir sobre minhas necessidades e limites antes de trazer uma proposta.",
        "Definir o que posso ajustar e comunicar minha posição depois.",
        "Propor um pequeno ajuste conjunto e observar como funciona.",
      ],
      en: [
        "You want to plan next year while keeping possibilities open. What would your first step be?",
        "Discuss what matters to each person before deciding a way forward.",
        "Reflect on my needs and boundaries before bringing a proposal.",
        "Decide what I can adjust and communicate my position afterwards.",
        "Suggest a small joint adjustment and see how it works.",
      ],
      es: [
        "Quieres planear el próximo año sin cerrar todas las posibilidades. ¿Cuál sería tu primer paso?",
        "Hablar de lo que importa a cada persona antes de definir el camino.",
        "Reflexionar sobre mis necesidades y límites antes de proponer algo.",
        "Definir qué puedo ajustar y comunicar mi postura después.",
        "Proponer un pequeño ajuste conjunto y observar cómo funciona.",
      ],
      fr: [
        "Vous souhaitez préparer l’année prochaine en gardant des possibilités ouvertes. Quelle serait votre première démarche ?",
        "Discuter de ce qui compte pour chacun avant de définir la suite.",
        "Réfléchir à mes besoins et limites avant de proposer quelque chose.",
        "Définir ce que je peux adapter puis communiquer ma position.",
        "Proposer un petit ajustement commun et observer son effet.",
      ],
    },
    [
      {
        FUTURE_PLANS: 3,
      },
      {
        FUTURE_PLANS: 0,
      },
      {
        FUTURE_PLANS: 1,
      },
      {
        FUTURE_PLANS: 2,
      },
    ],
    "HARD",
  ),
];
