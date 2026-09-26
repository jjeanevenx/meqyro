import type { PersonalityDimension } from "@/features/scoring/personality-map";

export type PersonalityQuestionDef = {
  stableKey: string;
  position: number;
  dimension: PersonalityDimension;
  direction: "DIRECT" | "REVERSE";
  prompt: {
    pt: string;
    en: string;
    es: string;
    fr: string;
  };
};

export const personalityMapQuestions: readonly PersonalityQuestionDef[] = [
  // --- 1. OPENNESS (8 items: 4 direct, 4 reverse) ---
  {
    stableKey: "PM_OPN_01",
    position: 1,
    dimension: "OPENNESS",
    direction: "DIRECT",
    prompt: {
      pt: "Tenho vivo interesse por ideias novas, teorias e conceitos abstratos.",
      en: "I have a keen interest in new ideas, theories, and abstract concepts.",
      es: "Tengo un vivo interés por ideas nuevas, teorías y conceptos abstractos.",
      fr: "J'ai un vif intérêt pour les idées nouvelles, les théories et les concepts abstraits.",
    },
  },
  {
    stableKey: "PM_OPN_02",
    position: 2,
    dimension: "OPENNESS",
    direction: "DIRECT",
    prompt: {
      pt: "Aprecio arte, música e experiências estéticas originais.",
      en: "I appreciate art, music, and original aesthetic experiences.",
      es: "Aprecio el arte, la música y las experiencias estéticas originales.",
      fr: "J'apprécie l'art, la musique et les expériences esthétiques originales.",
    },
  },
  {
    stableKey: "PM_OPN_03",
    position: 3,
    dimension: "OPENNESS",
    direction: "DIRECT",
    prompt: {
      pt: "Gosto de refletir sobre perspectivas incomuns antes de tomar uma decisão.",
      en: "I enjoy considering unusual perspectives before making a decision.",
      es: "Me gusta reflexionar sobre perspectivas inusuales antes de tomar una decisión.",
      fr: "J'aime réfléchir à des perspectives inhabituelles avant de prendre une décision.",
    },
  },
  {
    stableKey: "PM_OPN_04",
    position: 4,
    dimension: "OPENNESS",
    direction: "DIRECT",
    prompt: {
      pt: "Tenho imaginação fértil e gosto de explorar cenários hipotéticos.",
      en: "I have a vivid imagination and enjoy exploring hypothetical scenarios.",
      es: "Tengo una imaginación fértil y disfruto explorando escenarios hipotéticos.",
      fr: "J'ai une imagination fertile et j'aime explorer des scénarios hypothétiques.",
    },
  },
  {
    stableKey: "PM_OPN_05",
    position: 5,
    dimension: "OPENNESS",
    direction: "REVERSE",
    prompt: {
      pt: "Prefiro manter rotinas estabelecidas a experimentar métodos não testados.",
      en: "I prefer sticking to established routines rather than trying untested methods.",
      es: "Prefiero mantener rutinas establecidas antes que probar métodos no probados.",
      fr: "Je préfère m'en tenir à des routines établies plutôt que d'essayer des méthodes non testées.",
    },
  },
  {
    stableKey: "PM_OPN_06",
    position: 6,
    dimension: "OPENNESS",
    direction: "REVERSE",
    prompt: {
      pt: "Discussões puramente conceituais ou filosóficas me cansam rapidamente.",
      en: "Purely conceptual or philosophical discussions drain me quickly.",
      es: "Las discusiones puramente conceptuales o filosóficas me cansan rápidamente.",
      fr: "Les discussions purement conceptuelles ou philosophiques me fatiguent vite.",
    },
  },
  {
    stableKey: "PM_OPN_07",
    position: 7,
    dimension: "OPENNESS",
    direction: "REVERSE",
    prompt: {
      pt: "Raramente busco novidades culturais fora do que já conheço e confio.",
      en: "I rarely seek out cultural novelties outside what I already know and trust.",
      es: "Rara vez busco novedades culturales fuera de lo que ya conozco y confío.",
      fr: "Je cherche rarement des nouveautés culturelles en dehors de ce que je connais déjà.",
    },
  },
  {
    stableKey: "PM_OPN_08",
    position: 8,
    dimension: "OPENNESS",
    direction: "REVERSE",
    prompt: {
      pt: "Considero mais produtivo focar em fatos imediatos do que em possibilidades futuras.",
      en: "I find it more productive to focus on immediate facts rather than future possibilities.",
      es: "Considero más productivo enfocarme en hechos inmediatos que en posibilidades futuras.",
      fr: "Je trouve plus productif de me concentrer sur les faits immédiats que sur les possibilités.",
    },
  },

  // --- 2. CONSCIENTIOUSNESS (8 items: 4 direct, 4 reverse) ---
  {
    stableKey: "PM_CON_01",
    position: 9,
    dimension: "CONSCIENTIOUSNESS",
    direction: "DIRECT",
    prompt: {
      pt: "Mantenho meus planos organizados e cumpro prazos com disciplina.",
      en: "I keep my plans organized and meet deadlines with discipline.",
      es: "Mantengo mis planes organizados y cumplo los plazos con disciplina.",
      fr: "Je garde mes plans organisés et respecte les délais avec discipline.",
    },
  },
  {
    stableKey: "PM_CON_02",
    position: 10,
    dimension: "CONSCIENTIOUSNESS",
    direction: "DIRECT",
    prompt: {
      pt: "Presto muita atenção a detalhes importantes em tudo o que entrego.",
      en: "I pay careful attention to important details in everything I deliver.",
      es: "Presto mucha atención a detalles importantes en todo lo que entrego.",
      fr: "Je prête une attention soignée aux détails importants dans tout ce que je livre.",
    },
  },
  {
    stableKey: "PM_CON_03",
    position: 11,
    dimension: "CONSCIENTIOUSNESS",
    direction: "DIRECT",
    prompt: {
      pt: "Gosto de concluir uma tarefa por completo antes de iniciar outra.",
      en: "I like to complete a task thoroughly before starting another.",
      es: "Me gusta terminar una tarea por completo antes de comenzar otra.",
      fr: "J'aime terminer une tâche complètement avant d'en commencer une autre.",
    },
  },
  {
    stableKey: "PM_CON_04",
    position: 12,
    dimension: "CONSCIENTIOUSNESS",
    direction: "DIRECT",
    prompt: {
      pt: "Planejo com antecedência para evitar surpresas ou retrabalho.",
      en: "I plan ahead to avoid surprises or unnecessary rework.",
      es: "Planifico con anticipación para evitar sorpresas o retrabajo.",
      fr: "Je planifie à l'avance pour éviter les surprises ou le travail inutile.",
    },
  },
  {
    stableKey: "PM_CON_05",
    position: 13,
    dimension: "CONSCIENTIOUSNESS",
    direction: "REVERSE",
    prompt: {
      pt: "Com frequência deixo obrigações importantes para o último momento.",
      en: "I frequently leave important obligations until the last minute.",
      es: "Con frecuencia dejo obligaciones importantes para el último momento.",
      fr: "Je laisse souvent des obligations importantes à la dernière minute.",
    },
  },
  {
    stableKey: "PM_CON_06",
    position: 14,
    dimension: "CONSCIENTIOUSNESS",
    direction: "REVERSE",
    prompt: {
      pt: "Tenho dificuldade em manter meu espaço ou arquivos consistentemente ordenados.",
      en: "I have difficulty keeping my space or files consistently organized.",
      es: "Me cuesta mantener mi espacio o archivos consistentemente ordenados.",
      fr: "J'ai du mal à garder mon espace ou mes dossiers bien ordonnés.",
    },
  },
  {
    stableKey: "PM_CON_07",
    position: 15,
    dimension: "CONSCIENTIOUSNESS",
    direction: "REVERSE",
    prompt: {
      pt: "Costumo perder o interesse em projetos longos quando a novidade passa.",
      en: "I tend to lose interest in long-term projects once the novelty fades.",
      es: "Suelo perder el interés en proyectos largos cuando la novedad se desvanece.",
      fr: "J'ai tendance à me désintéresser des projets longs une fois la nouveauté passée.",
    },
  },
  {
    stableKey: "PM_CON_08",
    position: 16,
    dimension: "CONSCIENTIOUSNESS",
    direction: "REVERSE",
    prompt: {
      pt: "Prefiro improvisar do que seguir um cronograma detalhado.",
      en: "I prefer improvising rather than following a detailed schedule.",
      es: "Prefiero improvisar antes que seguir un cronograma detallado.",
      fr: "Je préfère improviser plutôt que suivre un calendrier détaillé.",
    },
  },

  // --- 3. EXTRAVERSION (8 items: 4 direct, 4 reverse) ---
  {
    stableKey: "PM_EXT_01",
    position: 17,
    dimension: "EXTRAVERSION",
    direction: "DIRECT",
    prompt: {
      pt: "Sinto-me energizado ao interagir com grupos dinâmicos e conhecer pessoas.",
      en: "I feel energized interacting with lively groups and meeting new people.",
      es: "Me siento lleno de energía interactuando con grupos y conociendo gente nueva.",
      fr: "Je me sens énergisé en interagissant avec des groupes et en rencontrant du monde.",
    },
  },
  {
    stableKey: "PM_EXT_02",
    position: 18,
    dimension: "EXTRAVERSION",
    direction: "DIRECT",
    prompt: {
      pt: "Tomo a iniciativa em conversas sociais com naturalidade e entusiasmo.",
      en: "I easily take initiative in social conversations with enthusiasm.",
      es: "Tomo la iniciativa en conversaciones sociales con naturalidad y entusiasmo.",
      fr: "Je prends facilement l'initiative des conversations sociales avec enthousiasme.",
    },
  },
  {
    stableKey: "PM_EXT_03",
    position: 19,
    dimension: "EXTRAVERSION",
    direction: "DIRECT",
    prompt: {
      pt: "Gosto de ambientes movimentados e cheios de estímulos.",
      en: "I enjoy bustling, fast-paced environments full of activity.",
      es: "Me gustan los ambientes concurridos y llenos de estímulos.",
      fr: "J'aime les environnements animés et pleins d'activité.",
    },
  },
  {
    stableKey: "PM_EXT_04",
    position: 20,
    dimension: "EXTRAVERSION",
    direction: "DIRECT",
    prompt: {
      pt: "Expresso minhas opiniões abertamente em discussões coletivas.",
      en: "I express my opinions openly in group discussions.",
      es: "Expreso mis opiniones abiertamente en debates colectivos.",
      fr: "J'exprime mes opinions ouvertement dans les discussions collectives.",
    },
  },
  {
    stableKey: "PM_EXT_05",
    position: 21,
    dimension: "EXTRAVERSION",
    direction: "REVERSE",
    prompt: {
      pt: "Prefiro passar momentos de descanso em silêncio ou sozinho.",
      en: "I prefer spending leisure time in quiet or by myself.",
      es: "Prefiero pasar momentos de descanso en silencio o a solas.",
      fr: "Je préfère passer mes moments de détente dans le calme ou seul.",
    },
  },
  {
    stableKey: "PM_EXT_06",
    position: 22,
    dimension: "EXTRAVERSION",
    direction: "REVERSE",
    prompt: {
      pt: "Eventos sociais com muitos estranhos drenam minha energia rapidamente.",
      en: "Large social gatherings with strangers quickly drain my energy.",
      es: "Grandes eventos sociales con desconocidos agotan mi energía rápidamente.",
      fr: "Les grands événements avec des inconnus épuisent vite mon énergie.",
    },
  },
  {
    stableKey: "PM_EXT_07",
    position: 23,
    dimension: "EXTRAVERSION",
    direction: "REVERSE",
    prompt: {
      pt: "Costumo manter pensamentos e impressões para mim até ser perguntado.",
      en: "I usually keep thoughts and impressions to myself until asked.",
      es: "Suelo guardar pensamientos e impresiones para mí hasta que me preguntan.",
      fr: "Je garde généralement mes pensées pour moi jusqu'à ce qu'on me demande.",
    },
  },
  {
    stableKey: "PM_EXT_08",
    position: 24,
    dimension: "EXTRAVERSION",
    direction: "REVERSE",
    prompt: {
      pt: "Evito ser o centro das atenções em situações sociais ou profissionais.",
      en: "I avoid being the center of attention in social or professional settings.",
      es: "Evito ser el centro de atención en situaciones sociales o laborales.",
      fr: "J'évite d'être le centre de l'attention en société ou au travail.",
    },
  },

  // --- 4. AGREEABLENESS (8 items: 4 direct, 4 reverse) ---
  {
    stableKey: "PM_AGR_01",
    position: 25,
    dimension: "AGREEABLENESS",
    direction: "DIRECT",
    prompt: {
      pt: "Preocupo-me genuinamente com o bem-estar e sentimentos dos outros.",
      en: "I genuinely care about the well-being and feelings of others.",
      es: "Me preocupo genuinamente por el bienestar y sentimientos de los demás.",
      fr: "Je me soucie sincèrement du bien-être et des sentiments des autres.",
    },
  },
  {
    stableKey: "PM_AGR_02",
    position: 26,
    dimension: "AGREEABLENESS",
    direction: "DIRECT",
    prompt: {
      pt: "Procuro encontrar consensos harmoniosos mesmo quando há divergências.",
      en: "I strive to find harmonious consensus even when there are disagreements.",
      es: "Intento encontrar consensos armoniosos incluso cuando hay desacuerdos.",
      fr: "Je m'efforce de trouver des consensus harmonieux même en cas de désaccord.",
    },
  },
  {
    stableKey: "PM_AGR_03",
    position: 27,
    dimension: "AGREEABLENESS",
    direction: "DIRECT",
    prompt: {
      pt: "Tenho facilidade em perdoar equívocos e dar segundas chances.",
      en: "I find it easy to forgive mistakes and give second chances.",
      es: "Tengo facilidad para perdonar errores y dar segundas oportunidades.",
      fr: "J'ai de la facilité à pardonner les erreurs et donner de nouvelles chances.",
    },
  },
  {
    stableKey: "PM_AGR_04",
    position: 28,
    dimension: "AGREEABLENESS",
    direction: "DIRECT",
    prompt: {
      pt: "Acredito na boa intenção fundamental da maioria das pessoas.",
      en: "I tend to believe in the good intentions of most people.",
      es: "Tiendo a creer en las buenas intenciones de la mayoría de las personas.",
      fr: "J'ai tendance à croire aux bonnes intentions de la plupart des gens.",
    },
  },
  {
    stableKey: "PM_AGR_05",
    position: 29,
    dimension: "AGREEABLENESS",
    direction: "REVERSE",
    prompt: {
      pt: "Sou naturalmente cético em relação aos motivos ocultos de terceiros.",
      en: "I am naturally skeptical of other people's hidden motives.",
      es: "Soy naturalmente escéptico respecto a las motivaciones de terceros.",
      fr: "Je suis naturellement sceptique quant aux motivations cachées des autres.",
    },
  },
  {
    stableKey: "PM_AGR_06",
    position: 30,
    dimension: "AGREEABLENESS",
    direction: "REVERSE",
    prompt: {
      pt: "Não hesito em confrontar alguém asperamente se achar necessário.",
      en: "I do not hesitate to confront someone sharply if I deem it necessary.",
      es: "No dudo en confrontar a alguien con dureza si lo considero necesario.",
      fr: "Je n'hésite pas à confronter quelqu'un fermement si nécessaire.",
    },
  },
  {
    stableKey: "PM_AGR_07",
    position: 31,
    dimension: "AGREEABLENESS",
    direction: "REVERSE",
    prompt: {
      pt: "Priorizo meus próprios objetivos antes de considerar o impacto nos outros.",
      en: "I prioritize my own goals before considering the impact on others.",
      es: "Priorizo mis propios objetivos antes de considerar el impacto en otros.",
      fr: "Je priorise mes propres objectifs avant de considérer l'impact sur autrui.",
    },
  },
  {
    stableKey: "PM_AGR_08",
    position: 32,
    dimension: "AGREEABLENESS",
    direction: "REVERSE",
    prompt: {
      pt: "Considero competição implacável mais eficiente do que colaboração suave.",
      en: "I consider sharp competition more effective than gentle collaboration.",
      es: "Considero la competencia implacable más eficaz que la colaboración suave.",
      fr: "Je considère la compétition directe plus efficace que la collaboration douce.",
    },
  },

  // --- 5. EMOTIONAL STABILITY (8 items: 4 direct, 4 reverse) ---
  {
    stableKey: "PM_EMS_01",
    position: 33,
    dimension: "EMOTIONAL_STABILITY",
    direction: "DIRECT",
    prompt: {
      pt: "Mantenho a calma e o equilíbrio mesmo sob forte pressão ou imprevistos.",
      en: "I remain calm and poised even under heavy pressure or unexpected events.",
      es: "Mantengo la calma y el equilibrio incluso bajo fuerte presión o imprevistos.",
      fr: "Je reste calme et équilibré même sous forte pression ou imprévus.",
    },
  },
  {
    stableKey: "PM_EMS_02",
    position: 34,
    dimension: "EMOTIONAL_STABILITY",
    direction: "DIRECT",
    prompt: {
      pt: "Recupero-me com rapidez de contratempos ou desapontamentos cotidianos.",
      en: "I bounce back quickly from setbacks or everyday disappointments.",
      es: "Me recupero con rapidez de contratiempos o decepciones cotidianas.",
      fr: "Je me remets rapidement des revers ou déceptions du quotidien.",
    },
  },
  {
    stableKey: "PM_EMS_03",
    position: 35,
    dimension: "EMOTIONAL_STABILITY",
    direction: "DIRECT",
    prompt: {
      pt: "Raramente sinto ansiedade desproporcional diante de incertezas.",
      en: "I rarely experience disproportionate anxiety in the face of uncertainty.",
      es: "Rara vez siento ansiedad desproporcionada ante la incertidumbre.",
      fr: "Je ressens rarement une anxiété disproportionnée face à l'incertitude.",
    },
  },
  {
    stableKey: "PM_EMS_04",
    position: 36,
    dimension: "EMOTIONAL_STABILITY",
    direction: "DIRECT",
    prompt: {
      pt: "Tenho confiança estável na minha capacidade de lidar com desafios.",
      en: "I have stable confidence in my ability to handle challenges.",
      es: "Tengo una confianza estable en mi capacidad para afrontar desafíos.",
      fr: "J'ai une confiance stable dans ma capacité à faire face aux défis.",
    },
  },
  {
    stableKey: "PM_EMS_05",
    position: 37,
    dimension: "EMOTIONAL_STABILITY",
    direction: "REVERSE",
    prompt: {
      pt: "Costumo me preocupar excessivamente com coisas fora do meu controle.",
      en: "I tend to worry excessively about things beyond my control.",
      es: "Suelo preocuparme en exceso por cosas fuera de mi control.",
      fr: "J'ai tendance à m'inquiéter excessivement de choses hors de mon contrôle.",
    },
  },
  {
    stableKey: "PM_EMS_06",
    position: 38,
    dimension: "EMOTIONAL_STABILITY",
    direction: "REVERSE",
    prompt: {
      pt: "Mudanças repentinas de humor afetam minha concentração ou disposição.",
      en: "Sudden mood shifts affect my concentration or motivation.",
      es: "Cambios repentinos de humor afectan mi concentración o disposición.",
      fr: "Des changements soudains d'humeur affectent ma concentration ou mon élan.",
    },
  },
  {
    stableKey: "PM_EMS_07",
    position: 39,
    dimension: "EMOTIONAL_STABILITY",
    direction: "REVERSE",
    prompt: {
      pt: "Sinto-me sobrecarregado facilmente quando múltiplas demandas surgem juntas.",
      en: "I easily feel overwhelmed when multiple demands arrive at once.",
      es: "Me siento abrumado con facilidad cuando surgen múltiples demandas a la vez.",
      fr: "Je me sens facilement dépassé lorsque plusieurs demandes arrivent ensemble.",
    },
  },
  {
    stableKey: "PM_EMS_08",
    position: 40,
    dimension: "EMOTIONAL_STABILITY",
    direction: "REVERSE",
    prompt: {
      pt: "Críticas ou julgamentos negativos costumam abalar minha autoconfiança por dias.",
      en: "Criticism or negative judgment often shakes my self-confidence for days.",
      es: "Las críticas o juicios negativos suelen sacudir mi autoconfianza durante días.",
      fr: "Les critiques ou jugements négatifs ébranlent souvent ma confiance pendant des jours.",
    },
  },
];
