import type { CoupleDimension } from "@/features/scoring/coupledna";

export type CoupleDnaQuestionDef = {
  stableKey: string;
  position: number;
  dimension: CoupleDimension;
  prompt: {
    pt: string;
    en: string;
    es: string;
    fr: string;
  };
};

export const coupleDnaQuestions: readonly CoupleDnaQuestionDef[] = [
  // COMMUNICATION (4)
  {
    stableKey: "CD_COMM_01",
    position: 1,
    dimension: "COMMUNICATION",
    prompt: {
      pt: "Consigo expressar minhas vulnerabilidades e medos com meu parceiro(a) com total segurança emocional.",
      en: "I can share my deepest vulnerabilities and fears with my partner with complete emotional safety.",
      es: "Puedo expresar mis vulnerabilidades e inseguridades a mi pareja con total seguridad emocional.",
      fr: "Je peux exprimer mes vulnérabilités et doutes à mon partenaire en toute sécurité émotionnelle.",
    },
  },
  {
    stableKey: "CD_COMM_02",
    position: 2,
    dimension: "COMMUNICATION",
    prompt: {
      pt: "Conversamos abertamente sobre nossos sentimentos sem medo de julgamentos ou retaliações.",
      en: "We talk candidly about our feelings without fearing judgment or unspoken retaliation.",
      es: "Hablamos con honestidad de lo que sentimos sin temor a juicios ni reproches guardados.",
      fr: "Nous parlons librement de nos ressentis sans craindre de jugement ni de ressentiment.",
    },
  },
  {
    stableKey: "CD_COMM_03",
    position: 3,
    dimension: "COMMUNICATION",
    prompt: {
      pt: "Sinto que sou verdadeiramente ouvido(a) e compreendido(a) quando divido um incômodo.",
      en: "I feel truly heard and understood whenever I voice a personal frustration.",
      es: "Me siento genuinamente escuchado(a) y comprendido(a) cuando comparto una inquietud.",
      fr: "Je me sens véritablement écouté(e) et compris(e) lorsque j'exprime une préoccupation.",
    },
  },
  {
    stableKey: "CD_COMM_04",
    position: 4,
    dimension: "COMMUNICATION",
    prompt: {
      pt: "Temos o hábito de checar um ao outro sobre nosso estado de espírito ao longo da semana.",
      en: "We regularly check in on each other's emotional well-being throughout the week.",
      es: "Tenemos el hábito de interesarnos mutuamente por nuestro estado de ánimo durante la semana.",
      fr: "Nous prenons régulièrement des nouvelles de notre état émotionnel au cours de la semaine.",
    },
  },
  // LIFE_VALUES (4)
  {
    stableKey: "CD_VAL_01",
    position: 5,
    dimension: "LIFE_VALUES",
    prompt: {
      pt: "Compartilhamos princípios éticos e morais fundamentais que guiam nossas escolhas de vida.",
      en: "We share fundamental ethical and moral values that guide our major life choices.",
      es: "Compartimos principios éticos y morales esenciales que guían nuestras decisiones de vida.",
      fr: "Nous partageons des principes éthiques et moraux essentiels qui guident nos choix de vie.",
    },
  },
  {
    stableKey: "CD_VAL_02",
    position: 6,
    dimension: "LIFE_VALUES",
    prompt: {
      pt: "Temos visões harmoniosas sobre o papel da família, amigos e convivência social.",
      en: "We hold aligned views regarding family presence, friendships, and social life.",
      es: "Mantenemos posturas afines sobre el lugar de la familia, amistades y vida social.",
      fr: "Nos visions s'accordent sur la place de la famille, des amis et de la vie sociale.",
    },
  },
  {
    stableKey: "CD_VAL_03",
    position: 7,
    dimension: "LIFE_VALUES",
    prompt: {
      pt: "Respeitamos a espiritualidade, crenças e filosofia de vida um do outro.",
      en: "We genuinely respect each other's spiritual beliefs, philosophies, and worldviews.",
      es: "Respetamos sinceramente las creencias, espiritualidad y filosofía de vida del otro.",
      fr: "Nous respectons profondément la spiritualité et la philosophie de vie de chacun.",
    },
  },
  {
    stableKey: "CD_VAL_04",
    position: 8,
    dimension: "LIFE_VALUES",
    prompt: {
      pt: "O que consideramos sucesso e realização pessoal aponta para a mesma direção geral.",
      en: "Our definitions of personal success and meaningful living point in a shared direction.",
      es: "Lo que consideramos éxito y realización personal camina en una dirección similar.",
      fr: "Notre conception du bonheur et de la réussite personnelle converge vers un cap commun.",
    },
  },
  // CONFLICT_MANAGEMENT (4)
  {
    stableKey: "CD_CONF_01",
    position: 9,
    dimension: "CONFLICT_MANAGEMENT",
    prompt: {
      pt: "Quando divergimos, conseguimos debater sem recorrer a agressividade, ironia ou silêncio punitivo.",
      en: "When we disagree, we navigate friction without hostility, stonewalling, or contempt.",
      es: "Ante desacuerdos, debatimos sin caer en agresividad, ironías ni silencios castigadores.",
      fr: "Lors des désaccords, nous échangeons sans agressivité, sarcasme ni silence punitif.",
    },
  },
  {
    stableKey: "CD_CONF_02",
    position: 10,
    dimension: "CONFLICT_MANAGEMENT",
    prompt: {
      pt: "Temos capacidade mútua de pedir desculpas e perdoar de coração após uma discussão.",
      en: "We both have the humility to apologize and forgive sincerely after a disagreement.",
      es: "Tenemos la capacidad mutua de pedir perdón y perdonar de corazón tras una discusión.",
      fr: "Nous savons tous deux présenter des excuses sincères et pardonner après un différend.",
    },
  },
  {
    stableKey: "CD_CONF_03",
    position: 11,
    dimension: "CONFLICT_MANAGEMENT",
    prompt: {
      pt: "Buscamos soluções em que ambos se sintam contemplados em vez de vencer a disputa.",
      en: "We aim for collaborative solutions where both win, rather than scoring points in an argument.",
      es: "Buscamos acuerdos donde ambos se sientan respetados en vez de competir por tener la razón.",
      fr: "Nous recherchons des compromis bienveillants plutôt que de vouloir avoir raison.",
    },
  },
  {
    stableKey: "CD_CONF_04",
    position: 12,
    dimension: "CONFLICT_MANAGEMENT",
    prompt: {
      pt: "Sabemos dar uma pausa para respirar quando a conversa esquenta antes de dizer algo prejudicial.",
      en: "We know how to pause and cool down when tempers flare before saying hurtful things.",
      es: "Sabemos hacer una pausa para serenarnos cuando la charla se tensa antes de herir al otro.",
      fr: "Nous savons marquer une pause pour apaiser les tensions avant de blesser l'autre.",
    },
  },
  // FINANCES (4)
  {
    stableKey: "CD_FIN_01",
    position: 13,
    dimension: "FINANCES",
    prompt: {
      pt: "Temos transparência total sobre rendas, gastos, dívidas e investimentos individuais e conjuntos.",
      en: "We practice transparent honesty regarding earnings, spending, debts, and investments.",
      es: "Existe transparencia plena sobre ingresos, gastos, deudas y ahorros compartidos.",
      fr: "Nous cultivons une transparence complète sur les revenus, dépenses, dettes et épargne.",
    },
  },
  {
    stableKey: "CD_FIN_02",
    position: 14,
    dimension: "FINANCES",
    prompt: {
      pt: "Nossos hábitos de consumo e equilíbrio entre poupar e gastar são compatíveis.",
      en: "Our spending habits and rhythm between saving and enjoying are mutually compatible.",
      es: "Nuestros hábitos de gasto y la disciplina entre ahorrar y disfrutar son afines.",
      fr: "Nos habitudes financières et notre équilibre entre épargne et plaisir sont compatibles.",
    },
  },
  {
    stableKey: "CD_FIN_03",
    position: 15,
    dimension: "FINANCES",
    prompt: {
      pt: "Planejamos compras de maior porte juntos e respeitamos os combinados orçamentários.",
      en: "We plan significant purchases jointly and respect agreed financial boundaries.",
      es: "Planificamos juntos las compras importantes y respetamos los acuerdos de presupuesto.",
      fr: "Nous concertons les achats majeurs et respectons les accords budgétaires conclus.",
    },
  },
  {
    stableKey: "CD_FIN_04",
    position: 16,
    dimension: "FINANCES",
    prompt: {
      pt: "Assuntos de dinheiro no relacionamento são tratados como trabalho em equipe, não cobrança.",
      en: "Money matters in our relationship are approached as teamwork rather than blame.",
      es: "Los temas económicos se abordan como una labor en equipo y no como reproche.",
      fr: "Les questions financières sont abordées comme une équipe, sans reproches unilatéraux.",
    },
  },
  // FUTURE_PLANS (4)
  {
    stableKey: "CD_FUT_01",
    position: 17,
    dimension: "FUTURE_PLANS",
    prompt: {
      pt: "Temos clareza e convergência sobre onde desejamos morar e nosso estilo de vida nos próximos anos.",
      en: "We share alignment on our preferred living environment and lifestyle for the years ahead.",
      es: "Tenemos sintonía sobre dónde deseamos residir y qué estilo de vida proyectamos juntos.",
      fr: "Nous partageons une vision claire sur notre lieu de vie et nos choix des prochaines années.",
    },
  },
  {
    stableKey: "CD_FUT_02",
    position: 18,
    dimension: "FUTURE_PLANS",
    prompt: {
      pt: "Estamos alinhados em relação a ter ou não ter filhos (e como criá-los).",
      en: "We are aligned on our intentions regarding children (and how to raise them).",
      es: "Estamos alineados sobre la decisión de tener hijos (y las pautas de crianza).",
      fr: "Nous sommes en harmonie concernant le projet d'enfants (et leur éducation).",
    },
  },
  {
    stableKey: "CD_FUT_03",
    position: 19,
    dimension: "FUTURE_PLANS",
    prompt: {
      pt: "Apoiamos mutuamente os sonhos e ambições profissionais de cada um no longo prazo.",
      en: "We actively champion each other's individual long-term professional dreams.",
      es: "Apoyamos con entusiasmo los sueños y proyectos profesionales del otro a largo plazo.",
      fr: "Nous soutenons activement les ambitions professionnelles à long terme de chacun.",
    },
  },
  {
    stableKey: "CD_FUT_04",
    position: 20,
    dimension: "FUTURE_PLANS",
    prompt: {
      pt: "Visualizo nosso futuro conjunto com entusiasmo, companheirismo e propósito duradouro.",
      en: "I look forward to our shared future with deep excitement, trust, and lasting partnership.",
      es: "Visualizo nuestro futuro compartido con entusiasmo, complicidad y propósito sólido.",
      fr: "J'envisage notre avenir commun avec confiance, complicité et enthousiasme durable.",
    },
  },
];
