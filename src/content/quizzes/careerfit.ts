import type { CareerFitDimension } from "@/features/scoring/careerfit";

export type CareerFitQuestionDef = {
  stableKey: string;
  position: number;
  dimension: CareerFitDimension;
  prompt: {
    pt: string;
    en: string;
    es: string;
    fr: string;
  };
};

export const careerFitQuestions: readonly CareerFitQuestionDef[] = [
  // TECHNICAL (4)
  {
    stableKey: "CF_TECH_01",
    position: 1,
    dimension: "TECHNICAL",
    prompt: {
      pt: "Prefiro aprofundar minha especialidade técnica do que assumir funções de gestão geral.",
      en: "I prefer deepening my technical expertise over taking on general management roles.",
      es: "Prefiero profundizar mi especialidad técnica que asumir funciones de gestión general.",
      fr: "Je préfère approfondir mon expertise technique plutôt que d'assumer des fonctions de gestion générale.",
    },
  },
  {
    stableKey: "CF_TECH_02",
    position: 2,
    dimension: "TECHNICAL",
    prompt: {
      pt: "Sinto orgulho quando sou procurado como referência no assunto que domino.",
      en: "I feel proud when colleagues seek me out as a subject-matter reference.",
      es: "Me siento orgulloso cuando me buscan como referente en el tema que domino.",
      fr: "Je suis fier d'être consulté comme référence dans le domaine que je maîtrise.",
    },
  },
  {
    stableKey: "CF_TECH_03",
    position: 3,
    dimension: "TECHNICAL",
    prompt: {
      pt: "Resolver desafios complexos com rigor e qualidade é mais motivador do que política corporativa.",
      en: "Solving complex challenges with rigor and craft is more motivating than corporate politics.",
      es: "Resolver retos complejos con rigor y calidad es más motivador que la política corporativa.",
      fr: "Résoudre des défis complexes avec rigueur et qualité est plus motivant que la politique d'entreprise.",
    },
  },
  {
    stableKey: "CF_TECH_04",
    position: 4,
    dimension: "TECHNICAL",
    prompt: {
      pt: "Mantenho-me constantemente atualizado sobre ferramentas e metodologias avançadas da minha área.",
      en: "I constantly keep up to date with cutting-edge tools and methodologies in my field.",
      es: "Me mantengo constantemente actualizado sobre herramientas y metodologías de vanguardia.",
      fr: "Je me tiens constamment informé des outils et méthodologies de pointe de mon secteur.",
    },
  },
  // MANAGERIAL (4)
  {
    stableKey: "CF_MGT_01",
    position: 5,
    dimension: "MANAGERIAL",
    prompt: {
      pt: "Gosto de coordenar pessoas, alinhar objetivos e acompanhar entregas de equipe.",
      en: "I enjoy coordinating people, aligning goals, and tracking team deliverables.",
      es: "Disfruto coordinando personas, alineando objetivos y supervisando entregas de equipo.",
      fr: "J'aime coordonner les personnes, aligner les objectifs et suivre les livrables d'équipe.",
    },
  },
  {
    stableKey: "CF_MGT_02",
    position: 6,
    dimension: "MANAGERIAL",
    prompt: {
      pt: "Assumir a responsabilidade final pelo resultado global me energiza.",
      en: "Taking ultimate responsibility for overall outcomes energizes me.",
      es: "Asumir la responsabilidad final por los resultados globales me llena de energía.",
      fr: "Prendre la responsabilité finale des résultats globaux me stimule.",
    },
  },
  {
    stableKey: "CF_MGT_03",
    position: 7,
    dimension: "MANAGERIAL",
    prompt: {
      pt: "Tenho facilidade para articular interesses distintos entre áreas e liderar mudanças.",
      en: "I easily navigate diverse cross-functional interests and lead organizational change.",
      es: "Tengo facilidad para articular intereses diversos entre áreas y liderar el cambio.",
      fr: "J'articule facilement des intérêts variés entre services et mène le changement.",
    },
  },
  {
    stableKey: "CF_MGT_04",
    position: 8,
    dimension: "MANAGERIAL",
    prompt: {
      pt: "Desenvolver talentos e preparar sucessores é uma prioridade natural no meu trabalho.",
      en: "Developing talent and mentoring future leaders is a natural priority in my work.",
      es: "Desarrollar talento y preparar sucesores es una prioridad natural en mi trabajo.",
      fr: "Développer les talents et préparer la relève est une priorité naturelle dans mon travail.",
    },
  },
  // CREATIVE (4)
  {
    stableKey: "CF_CREAT_01",
    position: 9,
    dimension: "CREATIVE",
    prompt: {
      pt: "Sinto necessidade constante de criar produtos, formatos ou soluções inéditas.",
      en: "I feel a constant urge to create novel products, formats, or original solutions.",
      es: "Siento una necesidad constante de crear productos, formatos o soluciones novedosas.",
      fr: "J'éprouve le besoin constant de créer des produits, formats ou solutions inédites.",
    },
  },
  {
    stableKey: "CF_CREAT_02",
    position: 10,
    dimension: "CREATIVE",
    prompt: {
      pt: "Rotinas repetitivas esgotam rapidamente meu entusiasmo profissional.",
      en: "Repetitive routines quickly drain my professional enthusiasm.",
      es: "Las rutinas repetitivas agotan rápidamente mi entusiasmo profesional.",
      fr: "Les routines répétitives épuisent rapidement mon enthousiasme professionnel.",
    },
  },
  {
    stableKey: "CF_CREAT_03",
    position: 11,
    dimension: "CREATIVE",
    prompt: {
      pt: "Prefiro trabalhar em projetos onde tenho liberdade estética e conceitual.",
      en: "I prefer working on initiatives where I have artistic and conceptual freedom.",
      es: "Prefiero trabajar en proyectos donde cuento con libertad estética y conceptual.",
      fr: "Je préfère travailler sur des projets où je dispose d'une liberté esthétique et conceptuelle.",
    },
  },
  {
    stableKey: "CF_CREAT_04",
    position: 12,
    dimension: "CREATIVE",
    prompt: {
      pt: "Conectar ideias de áreas aparentemente desconexas é meu principal diferencial.",
      en: "Connecting ideas from seemingly unrelated domains is my core strength.",
      es: "Conectar ideas de áreas aparentemente inconexas es mi principal ventaja diferencial.",
      fr: "Faire des ponts entre des domaines apparemment sans lien est mon atout majeur.",
    },
  },
  // AUTONOMOUS (4)
  {
    stableKey: "CF_AUTO_01",
    position: 13,
    dimension: "AUTONOMOUS",
    prompt: {
      pt: "Valorizo mais a autonomia de horários e método do que o prestígio de um cargo fixo.",
      en: "I value autonomy over schedule and methods more than the prestige of a rigid title.",
      es: "Valoro más la autonomía de horarios y métodos que el prestigio de un puesto fijo.",
      fr: "J'accorde plus de valeur à l'autonomie d'horaires et de méthodes qu'au prestige d'un titre rigide.",
    },
  },
  {
    stableKey: "CF_AUTO_02",
    position: 14,
    dimension: "AUTONOMOUS",
    prompt: {
      pt: "Prefiro definir minhas próprias prioridades a seguir manuais operacionais estritos.",
      en: "I prefer setting my own priorities over following strict operational playbooks.",
      es: "Prefiero definir mis propias prioridades a seguir manuales operativos estrictos.",
      fr: "Je préfère définir mes propres priorités plutôt que de suivre des manuels stricts.",
    },
  },
  {
    stableKey: "CF_AUTO_03",
    position: 15,
    dimension: "AUTONOMOUS",
    prompt: {
      pt: "Trabalhar como profissional independente ou empreendedor é uma aspiração forte.",
      en: "Working independently or building an entrepreneurial venture is a strong aspiration.",
      es: "Trabajar de forma independiente o emprender es una aspiración firme para mí.",
      fr: "Travailler de manière indépendante ou entreprendre est une forte aspiration.",
    },
  },
  {
    stableKey: "CF_AUTO_04",
    position: 16,
    dimension: "AUTONOMOUS",
    prompt: {
      pt: "Produzo meus melhores resultados quando ninguém microgerencia meu dia a dia.",
      en: "I deliver my best results when nobody micromanages my daily flow.",
      es: "Produzco mis mejores resultados cuando nadie microgestiona mi día a día.",
      fr: "Je produis mes meilleurs résultats lorsque personne ne microgère mon quotidien.",
    },
  },
  // SECURITY (4)
  {
    stableKey: "CF_SEC_01",
    position: 17,
    dimension: "SECURITY",
    prompt: {
      pt: "Estabilidade contratual e previsibilidade de remuneração são essenciais para minha paz mental.",
      en: "Contract stability and predictable compensation are essential for my peace of mind.",
      es: "La estabilidad contractual y la previsibilidad salarial son indispensables para mi tranquilidad.",
      fr: "La stabilité contractuelle et la prévisibilité salariale sont indispensables à ma sérénité.",
    },
  },
  {
    stableKey: "CF_SEC_02",
    position: 18,
    dimension: "SECURITY",
    prompt: {
      pt: "Prefiro organizações consolidadas a startups que operam em incerteza contínua.",
      en: "I prefer well-established organizations over early startups operating in constant uncertainty.",
      es: "Prefiero empresas consolidadas a startups que operan en incertidumbre continua.",
      fr: "Je préfère les organisations établies aux startups fonctionnant dans une incertitude permanente.",
    },
  },
  {
    stableKey: "CF_SEC_03",
    position: 19,
    dimension: "SECURITY",
    prompt: {
      pt: "Benefícios sólidos (plano de saúde, previdência) pesam muito na escolha de um trabalho.",
      en: "Comprehensive benefits (healthcare, retirement) weigh heavily when choosing an opportunity.",
      es: "Beneficios sólidos (salud, pensiones) tienen un gran peso al elegir una propuesta de trabajo.",
      fr: "Des avantages solides (mutuelle, retraite) pèsent lourd dans mes choix professionnels.",
    },
  },
  {
    stableKey: "CF_SEC_04",
    position: 20,
    dimension: "SECURITY",
    prompt: {
      pt: "Ter clareza sobre critérios de promoção e estabilidade me traz segurança produtiva.",
      en: "Clear criteria for advancement and job security gives me productive confidence.",
      es: "Tener claridad sobre los criterios de ascenso y estabilidad me brinda seguridad para rendir.",
      fr: "Une clarté sur les critères d'avancement et la pérennité me donne confiance au travail.",
    },
  },
  // CAUSE (4)
  {
    stableKey: "CF_CAUSE_01",
    position: 21,
    dimension: "CAUSE",
    prompt: {
      pt: "Preciso sentir que meu trabalho diário melhora concretamente a vida das pessoas.",
      en: "I need to feel that my daily work tangibly improves people's lives.",
      es: "Necesito sentir que mi trabajo diario mejora concretamente la vida de las personas.",
      fr: "J'ai besoin de sentir que mon travail quotidien améliore concrètement la vie d'autrui.",
    },
  },
  {
    stableKey: "CF_CAUSE_02",
    position: 22,
    dimension: "CAUSE",
    prompt: {
      pt: "Abriria mão de remuneração maior para atuar em uma organização com forte impacto social.",
      en: "I would trade higher pay to work for an organization with strong social impact.",
      es: "Renunciaría a un mayor sueldo para trabajar en una organización con impacto social positivo.",
      fr: "Je renoncerais à un salaire supérieur pour œuvrer dans une structure à fort impact sociétal.",
    },
  },
  {
    stableKey: "CF_CAUSE_03",
    position: 23,
    dimension: "CAUSE",
    prompt: {
      pt: "Não consigo me dedicar a produtos ou projetos que violem meus valores éticos.",
      en: "I cannot commit to products or missions that conflict with my core ethical values.",
      es: "No puedo involucrarme en proyectos que contradigan mis principios éticos esenciales.",
      fr: "Je ne peux pas m'investir dans des projets qui heurtent mes valeurs éthiques.",
    },
  },
  {
    stableKey: "CF_CAUSE_04",
    position: 24,
    dimension: "CAUSE",
    prompt: {
      pt: "Deixar um legado positivo para a sociedade é minha principal métrica de realização.",
      en: "Leaving a positive societal legacy is my chief measure of professional fulfillment.",
      es: "Dejar un legado positivo para la sociedad es mi mayor medida de realización personal.",
      fr: "Laisser un impact positif dans la société est mon critère majeur d'accomplissement.",
    },
  },
];
