import type { Locale } from "@/lib/i18n/config";

export interface ArticleContent {
  slug: string;
  relatedQuizSlug: string;
  readingTimeMinutes: number;
  publishedAt: string;
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  sections: {
    heading: Record<Locale, string>;
    paragraphs: Record<Locale, string[]>;
  }[];
  keyTakeaways: Record<Locale, string[]>;
}

export const ARTICLES: ArticleContent[] = [
  {
    slug: "how-logical-reasoning-works",
    relatedQuizSlug: "brainrank",
    readingTimeMinutes: 5,
    publishedAt: "2026-09-20T10:00:00Z",
    title: {
      pt: "Como funciona o raciocínio lógico e por que ele importa?",
      en: "How does logical reasoning work and why does it matter?",
      es: "¿Cómo funciona el razonamiento lógico y por qué importa?",
      fr: "Comment fonctionne le raisonnement logique et pourquoi est-il essentiel ?",
    },
    subtitle: {
      pt: "Entenda os mecanismos mentais por trás do reconhecimento de padrões e resolução de problemas.",
      en: "Understand the mental mechanisms behind pattern recognition and agile problem solving.",
      es: "Comprende los mecanismos cognitivos detrás del reconocimiento de patrones y la resolución de problemas.",
      fr: "Comprenez les mécanismes cognitifs sous-jacents à la détection de motifs et à la résolution de problèmes.",
    },
    excerpt: {
      pt: "O raciocínio lógico não é uma capacidade fixa; é a habilidade do cérebro de identificar padrões em dados ruidosos e deduzir conclusões estruturadas sob restrições.",
      en: "Logical reasoning is not a static trait; it is the brain's ability to extract structure from ambiguity and deduce conclusions under constraints.",
      es: "El razonamiento lógico no es una capacidad estática; es la habilidad mental para extraer orden del caos y deducir conclusiones estructuradas.",
      fr: "Le raisonnement logique n'est pas figé ; c'est l'aptitude du cerveau à extraire de la cohérence à partir du désordre et à déduire avec méthode.",
    },
    sections: [
      {
        heading: {
          pt: "1. O que é a arquitetura lógica do cérebro?",
          en: "1. What is the brain's logical architecture?",
          es: "1. ¿Qué es la arquitectura lógica del cerebro?",
          fr: "1. Qu'est-ce que l'architecture logique du cerveau ?",
        },
        paragraphs: {
          pt: [
            "Quando enfrentamos um quebra-cabeça visual ou um desafio abstrato, nosso córtex pré-frontal realiza um processo iterativo: ele decompõe elementos visuais em características fundamentais (forma, rotação, simetria e ritmo).",
            "A velocidade com que esse processamento ocorre determina a capacidade de resposta sob pressão de tempo, separando a adivinhação da inferência dedutiva metódica.",
          ],
          en: [
            "When faced with an abstract puzzle, the prefrontal cortex initiates an iterative decomposition: separating visual elements into fundamental rules such as rotation, symmetry, and parity.",
            "The speed of this processing governs precision under time constraints, cleanly distinguishing guesswork from methodical deductive reasoning.",
          ],
          es: [
            "Ante un reto abstracto, la corteza prefrontal descompone los elementos en reglas esenciales de rotación, simetría y secuencia.",
            "La velocidad de este procesamiento define la agilidad bajo presión, diferenciando la intuición apresurada de la deducción rigurosa.",
          ],
          fr: [
            "Face à un défi abstrait, le cortex préfrontal décompose les formes en principes fondamentaux : rotation, symétrie et cohérence numérique.",
            "La rapidité d'exécution conditionne la précision sous contrainte de temps, marquant la frontière entre le hasard et la déduction méthodique.",
          ],
        },
      },
      {
        heading: {
          pt: "2. Como exercitar a velocidade analítica",
          en: "2. How to strengthen analytical processing speed",
          es: "2. Cómo potenciar la agilidad analítica",
          fr: "2. Comment développer sa vitesse analytique",
        },
        paragraphs: {
          pt: [
            "Testes cognitivos objetivos não medem o seu valor pessoal, mas oferecem um mapa preciso de quais tipos de padrões você absorve com naturalidade e onde ocorrem gargalos de atenção.",
            "A melhor forma de desenvolver essa musculatura cognitiva é expor-se a desafios curtos e objetivos com feedback imediato.",
          ],
          en: [
            "Objective reasoning assessments do not define your human worth; they map out which patterns your mind parses effortlessly and where cognitive load spikes.",
            "The most effective way to train this cognitive muscle is regular engagement with concise, calibrated challenges followed by instant feedback.",
          ],
          es: [
            "Las pruebas de razonamiento no juzgan tu capacidad absoluta, sino que ofrecen un mapa claro de tus patrones más intuitivos y de tus puntos de fatiga.",
            "Entrenar esta agilidad exige desafíos calibrados breves y retroalimentación inmediata.",
          ],
          fr: [
            "Les évaluations cognitives objectives mesurent votre profil de traitement, révélant vos facilités naturelles et vos zones de saturation mentale.",
            "Le meilleur entraînement repose sur la pratique régulière de défis courts avec retour immédiat.",
          ],
        },
      },
    ],
    keyTakeaways: {
      pt: [
        "Raciocínio lógico se apoia em reconhecimento de padrões e eliminação sistemática de hipóteses.",
        "Desempenho sob restrição de tempo reflete foco sustentado e baixa reatividade à pressão.",
        "Mapear seus pontos fortes permite direcionar escolhas de carreira e tomada de decisão com mais clareza.",
      ],
      en: [
        "Logical reasoning relies on pattern extraction and systematic hypothesis elimination.",
        "Performance under time bounds reflects sustained focus and disciplined impulse control.",
        "Mapping your cognitive strengths enables more deliberate choices in work and problem-solving.",
      ],
      es: [
        "El razonamiento lógico se basa en extraer patrones y descartar hipótesis de manera metódica.",
        "El rendimiento bajo límite de tiempo refleja concentración y control de impulsos.",
        "Mapear tus fortalezas cognitivas permite tomar decisiones profesionales con mayor seguridad.",
      ],
      fr: [
        "Le raisonnement logique repose sur la détection de règles et l'élimination méthodique d'hypothèses.",
        "La maîtrise du temps traduit une concentration stable et une résistance à la précipitation.",
        "Identifier vos points forts cognitifs éclaire vos choix professionnels et stratégiques.",
      ],
    },
  },
  {
    slug: "what-are-big-five-personality-traits",
    relatedQuizSlug: "personality-map",
    readingTimeMinutes: 6,
    publishedAt: "2026-09-21T10:00:00Z",
    title: {
      pt: "O que são os Cinco Grandes Fatores de Personalidade?",
      en: "What are the Big Five personality traits?",
      es: "¿Cuáles son los Cinco Grandes Factores de la personalidad?",
      fr: "Que sont les Cinq Grands Facteurs de la personnalité ?",
    },
    subtitle: {
      pt: "Conheça o modelo OCEAN, o padrão de ouro da psicologia moderna para entender o comportamento humano.",
      en: "Discover the OCEAN framework, the gold standard of modern psychology for understanding behavior.",
      es: "Conoce el modelo OCEAN, el referente científico para comprender las diferencias individuales.",
      fr: "Découvrez le modèle OCEAN, référence de la psychologie contemporaine pour cerner les traits humains.",
    },
    excerpt: {
      pt: "Diferente de testes de tipologia rígida, o modelo dos Cinco Grandes Fatores analisa cada indivíduo em um espectro contínuo de tendências estáveis.",
      en: "Unlike rigid typecasting, the Big Five model positions individuals along continuous spectrums of scientifically validated traits.",
      es: "A diferencia de tipologías rígidas, el modelo Big Five evalúa a cada individuo en un espectro continuo de rasgos consistentes.",
      fr: "Loin des typologies réductrices, le modèle des Big Five situe chaque personne sur un continuum de traits stables.",
    },
    sections: [
      {
        heading: {
          pt: "1. As cinco dimensões fundamentais (OCEAN)",
          en: "1. The five core dimensions (OCEAN)",
          es: "1. Las cinco dimensiones esenciales (OCEAN)",
          fr: "1. Les cinq dimensions fondamentales (OCEAN)",
        },
        paragraphs: {
          pt: [
            "Abertura à Experiência (Openness): curiosidade intelectual, imaginação e interesse por novidades.",
            "Conscienciosidade (Conscientiousness): organização, autodisciplina e orientação a metas.",
            "Extroversão (Extraversion): entusiasmo social, assertividade e busca por estímulos externos.",
            "Amabilidade (Agreeableness): cooperação, empatia e confiança nas relações interpessoais.",
            "Estabilidade Emocional (Emotional Stability): resiliência perante o estresse e serenidade diante de incertezas.",
          ],
          en: [
            "Openness: intellectual curiosity, aesthetic sensitivity, and appetite for novel ideas.",
            "Conscientiousness: self-discipline, organized execution, and goal persistence.",
            "Extraversion: energy in social settings, assertiveness, and outward enthusiasm.",
            "Agreeableness: collaborative orientation, empathy, and interpersonal warmth.",
            "Emotional Stability: stress resilience, emotional balance, and calm under uncertainty.",
          ],
          es: [
            "Apertura a la experiencia: curiosidad intelectual, creatividad y gusto por lo nuevo.",
            "Responsabilidad: organización, disciplina personal y orientación a objetivos.",
            "Extraversión: sociabilidad, energía comunicativa y dinamismo.",
            "Amabilidad: empatía, cooperación y calidez interpersonal.",
            "Estabilidad emocional: serenidad ante la incertidumbre y tolerancia al estrés.",
          ],
          fr: [
            "Ouverture d'esprit : curiosité intellectuelle, créativité et goût pour la nouveauté.",
            "Conscience professionnelle : rigueur, autodiscipline et persévérance vers les objectifs.",
            "Extraversion : dynamisme relationnel, assertivité et énergie sociale.",
            "Agréabilité : empathie, coopération et bienveillance relationnelle.",
            "Stabilité émotionnelle : sang-froid face au stress et sérénité dans l'incertitude.",
          ],
        },
      },
    ],
    keyTakeaways: {
      pt: [
        "Nenhum traço é inerentemente 'bom' ou 'ruim'; cada polo traz vantagens em contextos específicos.",
        "Compreender sua combinação Big Five facilita escolhas de carreira e comunicação interpessoal.",
        "O Personality Map avalia essas 5 dimensões em uma escala Likert de 40 afirmações equilibradas.",
      ],
      en: [
        "No trait is inherently superior; every pole offers competitive advantages in specific environments.",
        "Understanding your trait constellation unlocks clearer workplace alignment and relationship communication.",
        "Personality Map evaluates these 5 spectrums using 40 balanced Likert statements.",
      ],
      es: [
        "Ningún rasgo es intrínsecamente positivo o negativo; cada polo ofrece ventajas en contextos particulares.",
        "Conocer tu constelación Big Five mejora tu comunicación y tus decisiones de carrera.",
        "Personality Map mide estas 5 dimensiones mediante 40 afirmaciones calibradas en escala Likert.",
      ],
      fr: [
        "Aucun trait n'est intrinsèquement supérieur ; chaque profil offre des atouts selon le contexte.",
        "Mieux cerner sa constellation Big Five éclaire les choix d'environnement et la communication.",
        "Personality Map analyse ces 5 dimensions à travers 40 affirmations équilibrées.",
      ],
    },
  },
  {
    slug: "how-decision-style-affects-work",
    relatedQuizSlug: "decisiondna",
    readingTimeMinutes: 5,
    publishedAt: "2026-09-22T10:00:00Z",
    title: {
      pt: "Como seu estilo de decisão afeta carreira, finanças e relações?",
      en: "How does your decision-making style shape your career and life?",
      es: "¿Cómo influye tu estilo de decisión en el trabajo y las finanzas?",
      fr: "Comment votre style de décision façonne-t-il votre vie professionnelle ?",
    },
    subtitle: {
      pt: "A tensão contínua entre intuição veloz, deliberação analítica e aversão ao risco.",
      en: "The perpetual interplay between fast intuition, analytical deliberation, and risk tolerance.",
      es: "La interacción constante entre intuición veloz, análisis pausado y tolerancia al riesgo.",
      fr: "Le dialogue constant entre intuition rapide, réflexion analytique et gestion du risque.",
    },
    excerpt: {
      pt: "Tomar boas decisões não significa seguir um único método rígido, mas reconhecer se você tende a agir por impulso, por sobreanálise ou por cautela excessiva.",
      en: "Sound judgment is not about applying a single rigid formula, but recognizing whether your natural default leans toward impulse, over-analysis, or risk aversion.",
      es: "Tomar buenas decisiones implica reconocer si tu inclinación natural tiende hacia el impulso, el análisis excesivo o la cautela protectora.",
      fr: "Prendre de bonnes décisions exige d'identifier si son réflexe penche vers l'impulsion, l'analyse excessive ou la prudence défensive.",
    },
    sections: [
      {
        heading: {
          pt: "1. Os quatro arquétipos clássicos de tomada de decisão",
          en: "1. Four classic decision archetypes",
          es: "1. Los cuatro arquetipos de decisión",
          fr: "1. Les quatre archétypes de décision",
        },
        paragraphs: {
          pt: [
            "O Deliberativo: reúne todos os dados possíveis antes de dar um passo. Raramente erra por descuido, mas pode perder janelas de oportunidade.",
            "O Intuitivo: confia em sinais tácitos acumulados por experiência. Decide rápido, mas pode ser vítima de vieses cognitivos sutis.",
            "O Construtor Ousado: busca assimetrias positivas e tolera volatilidade. Prospera em cenários de alta inovação.",
            "O Guardião Cauteloso: prioriza proteção contra perdas e estabilidade de longo prazo.",
          ],
          en: [
            "The Deliberative: gathers extensive data before acting. Rarely makes careless mistakes, but risks missing narrow windows of opportunity.",
            "The Intuitive: relies on tacit heuristics distilled from past experience. Moves swiftly, but remains vulnerable to cognitive bias.",
            "The Bold Builder: seeks positive asymmetry and embraces volatility. Excels in high-velocity innovation.",
            "The Cautious Guardian: prioritizes downside protection, predictability, and long-term sustainability.",
          ],
          es: [
            "El Deliberativo: recopila datos exhaustivos antes de actuar. Evita errores por descuido, pero puede perder ventanas de oportunidad.",
            "El Intuitivo: confía en su experiencia tácita. Actúa con rapidez, pero puede caer en sesgos cognitivos.",
            "El Constructor Audaz: busca asimetrías positivas y tolera volatilidad en entornos de cambio.",
            "El Guardián Cauteloso: prioriza la protección del capital y la estabilidad a largo plazo.",
          ],
          fr: [
            "Le Délibératif : rassemble un maximum de données avant d'agir. Évite les erreurs d'inattention mais risque l'hésitation.",
            "L'Intuitif : s'appuie sur son expérience passée pour trancher vite, mais doit se méfier des biais cognitifs.",
            "Le Bâtisseur Audacieux : recherche l'asymétrie positive et tolère l'incertitude dans l'innovation.",
            "Le Gardien Prudent : privilégie la préservation des acquis et la durabilité à long terme.",
          ],
        },
      },
    ],
    keyTakeaways: {
      pt: [
        "Seu perfil de decisão influencia diretamente hábitos financeiros e dinâmicas de equipe.",
        "Identificar se você tende à paralisia por análise ou à impulsividade permite criar salvaguardas pessoais.",
        "O teste DecisionDNA avalia 24 cenários práticos para mapear suas preferências reais de escolha.",
      ],
      en: [
        "Your decision archetype directly impacts financial behavior, work dynamics, and relationships.",
        "Identifying whether you lean toward analysis paralysis or rapid impulse enables healthy safeguards.",
        "DecisionDNA evaluates 24 realistic scenarios to map your authentic judgment style.",
      ],
      es: [
        "Tu arquetipo de decisión condiciona directamente tus finanzas, trabajo y relaciones de pareja.",
        "Saber si tiendes a la sobreanalítica o a la impulsividad te permite fijar reglas protectoras.",
        "DecisionDNA evalúa 24 escenarios prácticos para revelar tus hábitos reales de juicio.",
      ],
      fr: [
        "Votre archétype de décision influence directement vos finances et votre dynamique de travail.",
        "Savoir si vous tendez vers la paralysie d'analyse ou l'impulsion permet d'instaurer des garde-fous.",
        "DecisionDNA teste 24 scénarios réalistes pour révéler votre méthode d'arbitrage.",
      ],
    },
  },
];
