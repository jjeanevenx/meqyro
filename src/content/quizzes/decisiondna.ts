import type { DecisionStyleType } from "@/features/scoring/decisiondna";

export type DecisionDnaOptionDef = {
  stableKey: string;
  style: DecisionStyleType;
  label: {
    pt: string;
    en: string;
    es: string;
    fr: string;
  };
};

export type DecisionDnaScenarioDef = {
  stableKey: string;
  position: number;
  prompt: {
    pt: string;
    en: string;
    es: string;
    fr: string;
  };
  options: readonly DecisionDnaOptionDef[];
};

export const decisionDnaScenarios: readonly DecisionDnaScenarioDef[] = [
  {
    stableKey: "DD_SCEN_01",
    position: 1,
    prompt: {
      pt: "Você tem 24 horas para escolher entre duas propostas de fornecedor com custos e prazos diferentes. Como você decide?",
      en: "You have 24 hours to choose between two vendor proposals with varying costs and timelines. How do you decide?",
      es: "Tienes 24 horas para elegir entre dos propuestas de proveedores con costes y plazos distintos. ¿Cómo decides?",
      fr: "Vous avez 24 heures pour trancher entre deux offres de prestataires aux coûts et délais différents. Comment décidez-vous ?",
    },
    options: [
      {
        stableKey: "DD_01_A",
        style: "ANALYTICAL",
        label: {
          pt: "Monto uma planilha comparativa ponderando custo-benefício, SLAs e riscos de entrega.",
          en: "I build a comparison model weighting cost-benefit, SLAs, and delivery risks.",
          es: "Construyo una matriz comparativa ponderando coste-beneficio, ANS y riesgos.",
          fr: "Je construis une matrice comparant coûts-bénéfices, SLA et risques de livraison.",
        },
      },
      {
        stableKey: "DD_01_B",
        style: "INTUITIVE",
        label: {
          pt: "Confio no histórico de relacionamento e na impressão inicial de confiabilidade da equipe.",
          en: "I trust past track record and my gut reading on team trustworthiness.",
          es: "Confío en mi intuición sobre la fiabilidad del equipo y antecedentes clave.",
          fr: "Je me fie à mon ressenti sur la fiabilité de l'équipe et leur réputation.",
        },
      },
      {
        stableKey: "DD_01_C",
        style: "PRAGMATIC",
        label: {
          pt: "Escolho a opção com menor risco operacional imediato para destrancar a entrega.",
          en: "I pick whichever has the lowest immediate operational friction to keep moving.",
          es: "Elijo la opción con menor fricción operativa para desbloquear la entrega de inmediato.",
          fr: "Je retiens l'option au risque opérationnel minimal pour avancer sans attendre.",
        },
      },
      {
        stableKey: "DD_01_D",
        style: "COLLABORATIVE",
        label: {
          pt: "Reúno os líderes afetados para um alinhamento rápido e busco decisão consensual.",
          en: "I gather impacted team leads for a brief sync and aim for team consensus.",
          es: "Reúno a los responsables afectados para consensuar la mejor alternativa conjunta.",
          fr: "Je réunis les parties prenantes pour un alignement rapide et cherche le consensus.",
        },
      },
    ],
  },
  {
    stableKey: "DD_SCEN_02",
    position: 2,
    prompt: {
      pt: "Um lançamento importante apresenta uma falha não-crítica a poucas horas do anúncio oficial. Qual sua postura?",
      en: "A major launch exhibits a non-critical glitch hours before official announcement. What is your stance?",
      es: "Un lanzamiento clave muestra un fallo no crítico a pocas horas del anuncio oficial. ¿Qué postura adoptas?",
      fr: "Un lancement majeur révèle un bug non bloquant quelques heures avant l'annonce officielle. Quelle est votre réaction ?",
    },
    options: [
      {
        stableKey: "DD_02_A",
        style: "PRAGMATIC",
        label: {
          pt: "Mantenho o lançamento, documento o contorno e programo a correção para o ciclo seguinte.",
          en: "Proceed with the release, document workarounds, and patch in the next sprint.",
          es: "Mantengo el lanzamiento, documento la solución temporal y programo el parche.",
          fr: "Je maintiens la sortie, documente le contournement et planifie le correctif.",
        },
      },
      {
        stableKey: "DD_02_B",
        style: "ANALYTICAL",
        label: {
          pt: "Avalio estatisticamente o impacto potencial nos usuários antes de tomar qualquer decisão.",
          en: "Run statistical impact analysis on affected user cohorts before deciding.",
          es: "Evalúo con datos el porcentaje de usuarios afectados antes de mover un dedo.",
          fr: "J'analyse méthodiquement la proportion d'utilisateurs touchés avant d'agir.",
        },
      },
      {
        stableKey: "DD_02_C",
        style: "INTUITIVE",
        label: {
          pt: "Se meu sexto sentido indicar que a reputação pode ser ferida, pauso sem hesitar.",
          en: "If my instincts signal brand perception risk, I hit pause without hesitation.",
          es: "Si mi instinto me dice que la reputación puede verse dañada, pauso el evento.",
          fr: "Si mon intuition me souffle un risque d'image, je suspends sans hésiter.",
        },
      },
      {
        stableKey: "DD_02_D",
        style: "COLLABORATIVE",
        label: {
          pt: "Consulto suporte, produto e marketing para deliberar o caminho com menor dano geral.",
          en: "Consult support, product, and comms leads to jointly weigh trade-offs.",
          es: "Consulto a soporte, producto y comunicación para decidir juntos la mejor salida.",
          fr: "Je consulte le support, le produit et la communication pour arbitrer ensemble.",
        },
      },
    ],
  },
  {
    stableKey: "DD_SCEN_03",
    position: 3,
    prompt: {
      pt: "Você recebe um orçamento extra inesperado para o trimestre. Onde você investe?",
      en: "You receive an unexpected surplus budget for the quarter. Where do you allocate it?",
      es: "Recibes un presupuesto extra inesperado este trimestre. ¿Cómo decides asignarlo?",
      fr: "Vous bénéficiez d'un budget excédentaire imprévu ce trimestre. Comment l'allouez-vous ?",
    },
    options: [
      {
        stableKey: "DD_03_A",
        style: "ANALYTICAL",
        label: {
          pt: "Simulo o ROI projetado em diferentes frentes e direciono para a de maior retorno esperado.",
          en: "Model expected ROI across competing initiatives and fund the highest-yield option.",
          es: "Modelo el retorno de inversión proyectado y financio la opción con mayor rendimiento.",
          fr: "Je modélise le ROI prévisionnel et alloue les fonds au levier le plus rentable.",
        },
      },
      {
        stableKey: "DD_03_B",
        style: "COLLABORATIVE",
        label: {
          pt: "Abro espaço para a equipe sugerir melhorias estruturais e decidimos por votação deliberativa.",
          en: "Solicit proposals from the broader team and decide through structured consultation.",
          es: "Pido propuestas al equipo y decidimos mediante una votación consultiva compartida.",
          fr: "Je recueille les propositions de l'équipe et nous arbitrons collectivement.",
        },
      },
      {
        stableKey: "DD_03_C",
        style: "PRAGMATIC",
        label: {
          pt: "Elimino dívidas técnicas ou gargalos imediatos que estão travando a velocidade diária.",
          en: "Direct funds toward eliminating technical debt or acute bottlenecks slowing delivery.",
          es: "Elimino cuellos de botella técnicos inmediatos que frenan el ritmo diario de trabajo.",
          fr: "J'élimine en priorité la dette technique et les goulots d'étranglement quotidiens.",
        },
      },
      {
        stableKey: "DD_03_D",
        style: "INTUITIVE",
        label: {
          pt: "Aposto em uma inovação ousada que vejo como oportunidade de salto à frente da concorrência.",
          en: "Bet on a bold bet that I intuitively recognize as a leapfrogging opportunity.",
          es: "Apuesto por una idea vanguardista que percibo como un gran salto competitivo.",
          fr: "Je parie sur une innovation audacieuse que je pressens comme un avantage clé.",
        },
      },
    ],
  },
  {
    stableKey: "DD_SCEN_04",
    position: 4,
    prompt: {
      pt: "Ao contratar para uma posição-chave, você encontra um candidato brilhante tecnicamente, mas com dúvidas de alinhamento cultural. O que faz?",
      en: "Hiring for a key role, you find a candidate technically stellar but with cultural fit questions. What do you do?",
      es: "Al contratar un puesto clave, encuentras un candidato técnicamente brillante pero con dudas culturales. ¿Qué haces?",
      fr: "En recrutant pour un rôle clé, un profil est techniquement brillant mais pose question sur la culture d'équipe. Que faites-vous ?",
    },
    options: [
      {
        stableKey: "DD_04_A",
        style: "COLLABORATIVE",
        label: {
          pt: "Coloco o candidato em dinâmica real com os futuros pares e respeito o veredito da equipe.",
          en: "Have candidate shadow future peers in a collaborative session and respect team verdict.",
          es: "Pongo al candidato a trabajar con sus futuros pares y sigo el consenso del equipo.",
          fr: "Je le fais échanger avec ses futurs pairs et m'en remets au retour d'équipe.",
        },
      },
      {
        stableKey: "DD_04_B",
        style: "PRAGMATIC",
        label: {
          pt: "Contrato com período de experiência objetivo focado em entregáveis concretos e combinados.",
          en: "Hire on a milestone-based trial period strictly tied to deliverables and team norms.",
          es: "Contrato con un periodo de prueba claro supeditado a entregables y pautas fijadas.",
          fr: "J'engage une période d'essai cadrée sur des objectifs et livrables précis.",
        },
      },
      {
        stableKey: "DD_04_C",
        style: "ANALYTICAL",
        label: {
          pt: "Aplico testes estruturados de competências e checo múltiplas referências detalhadas.",
          en: "Run structured competencies scoring and conduct rigorous 360-degree reference checks.",
          es: "Aplico evaluaciones estructuradas y realizo una verificación exhaustiva de referencias.",
          fr: "J'utilise des grilles de compétences formelles et vérifie scrupuleusement les références.",
        },
      },
      {
        stableKey: "DD_04_D",
        style: "INTUITIVE",
        label: {
          pt: "Se a conversa informal me causou desconforto sutil, não contrato, pois confio na sintonia.",
          en: "If informal dialogue triggered intuitive red flags, I pass; chemistry matters most.",
          es: "Si en la charla informal sentí señales de fricción, rechazo; la sintonía no se fuerza.",
          fr: "Si l'échange informel m'a laissé un doute subtil, je refuse ; l'harmonie est capitale.",
        },
      },
    ],
  },
];
