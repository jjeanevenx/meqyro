import type { MoneyArchetype } from "@/features/scoring/moneydna";

export type MoneyDnaQuestionDef = {
  stableKey: string;
  position: number;
  archetype: MoneyArchetype;
  prompt: {
    pt: string;
    en: string;
    es: string;
    fr: string;
  };
};

export const moneyDnaQuestions: readonly MoneyDnaQuestionDef[] = [
  // BUILDER (4)
  {
    stableKey: "MD_BLD_01",
    position: 1,
    archetype: "BUILDER",
    prompt: {
      pt: "Vejo o dinheiro principalmente como ferramenta para construir projetos e novos negócios.",
      en: "I see money primarily as a tool to build ambitious projects and ventures.",
      es: "Veo el dinero principalmente como una herramienta para construir proyectos e iniciativas.",
      fr: "Je conçois l'argent avant tout comme un levier pour bâtir des projets et entreprises.",
    },
  },
  {
    stableKey: "MD_BLD_02",
    position: 2,
    archetype: "BUILDER",
    prompt: {
      pt: "Prefiro reinvestir a maior parte dos meus ganhos do que gastar em consumo supérfluo.",
      en: "I prefer reinvesting most of my earnings into assets rather than spending on non-essentials.",
      es: "Prefiero reinvertir la mayoría de mis ingresos antes que gastar en consumo superfluo.",
      fr: "Je préfère réinvestir l'essentiel de mes gains plutôt que de consommer du superflu.",
    },
  },
  {
    stableKey: "MD_BLD_03",
    position: 3,
    archetype: "BUILDER",
    prompt: {
      pt: "Tenho satisfação em ver meu patrimônio líquido crescer de forma consistente ao longo dos anos.",
      en: "I take deep satisfaction in watching my net worth grow steadily over the years.",
      es: "Disfruto profundamente ver crecer mi patrimonio neto de manera constante con el tiempo.",
      fr: "J'éprouve une réelle satisfaction à voir mon patrimoine net croître au fil des années.",
    },
  },
  {
    stableKey: "MD_BLD_04",
    position: 4,
    archetype: "BUILDER",
    prompt: {
      pt: "Estou sempre buscando novas fontes de renda ou maneiras de alavancar resultados.",
      en: "I am always looking for new income streams and ways to compound my results.",
      es: "Siempre busco nuevas fuentes de ingresos y formas de escalar mis resultados.",
      fr: "Je recherche constamment de nouvelles sources de revenus et de leviers d'action.",
    },
  },
  // GUARDIAN (4)
  {
    stableKey: "MD_GRD_01",
    position: 5,
    archetype: "GUARDIAN",
    prompt: {
      pt: "Manter uma reserva de emergência confortável é prioritário antes de qualquer investimento arriscado.",
      en: "Maintaining a solid emergency cushion takes priority over any speculative investment.",
      es: "Mantener un colchón de emergencia amplio es prioritario antes de cualquier inversión de riesgo.",
      fr: "Conserver une épargne de précaution confortable prime sur tout investissement à risque.",
    },
  },
  {
    stableKey: "MD_GRD_02",
    position: 6,
    archetype: "GUARDIAN",
    prompt: {
      pt: "A possibilidade de perder dinheiro investido me causa desconforto imediato.",
      en: "The prospect of losing invested capital causes me immediate unease.",
      es: "La posibilidad de perder capital invertido me causa una intranquilidad inmediata.",
      fr: "L'éventualité de perdre un capital investi me crée un inconfort certain.",
    },
  },
  {
    stableKey: "MD_GRD_03",
    position: 7,
    archetype: "GUARDIAN",
    prompt: {
      pt: "Pesquiso minuciosamente preços e condições antes de realizar qualquer compra relevante.",
      en: "I thoroughly compare prices and terms before making any significant purchase.",
      es: "Investigo minuciosamente precios y condiciones antes de efectuar compras importantes.",
      fr: "Je compare minutieusement les prix et conditions avant chaque achat significatif.",
    },
  },
  {
    stableKey: "MD_GRD_04",
    position: 8,
    archetype: "GUARDIAN",
    prompt: {
      pt: "Dívidas financeiras tiram meu sono, por isso priorizo quitá-las o mais rápido possível.",
      en: "Debt keeps me awake at night, so I prioritize clearing balances as quickly as possible.",
      es: "Tener deudas me quita el sueño, así que priorizo liquidarlas de inmediato.",
      fr: "Les dettes financières me pèsent, je m'efforce donc de les solder au plus vite.",
    },
  },
  // STRATEGIST (4)
  {
    stableKey: "MD_STRAT_01",
    position: 9,
    archetype: "STRATEGIST",
    prompt: {
      pt: "Acompanho métricas de inflação, rentabilidade real e diversificação de carteira com rigor.",
      en: "I closely track inflation metrics, real yields, and disciplined portfolio allocation.",
      es: "Sigo con rigor métricas de inflación, rendimiento real y diversificación de cartera.",
      fr: "Je suis avec méthode l'inflation, les rendements réels et l'allocation de portefeuille.",
    },
  },
  {
    stableKey: "MD_STRAT_02",
    position: 10,
    archetype: "STRATEGIST",
    prompt: {
      pt: "Tomo decisões financeiras baseadas em dados e modelos racionais, nunca por impulso emocional.",
      en: "I make financial decisions using data and rational models, never emotional impulses.",
      es: "Tomo decisiones financieras basadas en datos y lógica, jamás por impulsos de euforia.",
      fr: "Je prends mes décisions financières d'après des données rationnelles, jamais par impulsion.",
    },
  },
  {
    stableKey: "MD_STRAT_03",
    position: 11,
    archetype: "STRATEGIST",
    prompt: {
      pt: "Tenho metas financeiras detalhadas para 3, 5 e 10 anos à frente.",
      en: "I have well-defined financial roadmaps for 3, 5, and 10 years ahead.",
      es: "Dispongo de metas financieras estructuradas para los próximos 3, 5 y 10 años.",
      fr: "J'établis des plans financiers clairs à 3, 5 et 10 ans.",
    },
  },
  {
    stableKey: "MD_STRAT_04",
    position: 12,
    archetype: "STRATEGIST",
    prompt: {
      pt: "Gosto de entender a fundo a estrutura de custos, tributos e taxas de qualquer produto financeiro.",
      en: "I make a point of understanding cost structures, taxes, and fees behind any instrument.",
      es: "Comprendo a fondo las comisiones, impuestos y costes ocultos de cada producto.",
      fr: "Je veille à comprendre les frais, fiscalités et mécanismes de chaque placement.",
    },
  },
  // ADVENTURER (4)
  {
    stableKey: "MD_ADV_01",
    position: 13,
    archetype: "ADVENTURER",
    prompt: {
      pt: "Aceito volatilidade alta se houver chance real de retornos assimétricos expressivos.",
      en: "I embrace high volatility when there is genuine opportunity for asymmetric upside.",
      es: "Acepto volatilidad elevada si existe una posibilidad real de retornos asimétricos.",
      fr: "J'accepte une forte volatilité s'il y a un vrai potentiel de gain asymétrique.",
    },
  },
  {
    stableKey: "MD_ADV_02",
    position: 14,
    archetype: "ADVENTURER",
    prompt: {
      pt: "Valorizo experiências memoráveis (viagens, eventos) mais do que acumular números na conta.",
      en: "I value unforgettable experiences (travel, events) more than hoarding digits in an account.",
      es: "Valoro las vivencias memorables (viajes, experiencias) más que acumular saldos bancarios.",
      fr: "Je privilégie les expériences marquantes (voyages, découvertes) à l'accumulation passive.",
    },
  },
  {
    stableKey: "MD_ADV_03",
    position: 15,
    archetype: "ADVENTURER",
    prompt: {
      pt: "Frequentemente me empolgo com ideias arrojadas de novos investimentos e apostas de mercado.",
      en: "I often get excited about bold new market plays and unconventional ventures.",
      es: "Suelo entusiasmarme con apuestas atrevidas e innovadoras de inversión.",
      fr: "Je m'enthousiasme facilement pour des paris d'investissement audacieux et novateurs.",
    },
  },
  {
    stableKey: "MD_ADV_04",
    position: 16,
    archetype: "ADVENTURER",
    prompt: {
      pt: "Para mim, o dinheiro existe para ser desfrutado no presente com intensidade e liberdade.",
      en: "To me, money exists to be enjoyed in the present with boldness and freedom.",
      es: "Para mí, el dinero existe para disfrutarse en el presente con libertad y plenitud.",
      fr: "Pour moi, l'argent sert à profiter du présent avec intensité et liberté.",
    },
  },
  // BALANCER (4)
  {
    stableKey: "MD_BAL_01",
    position: 17,
    archetype: "BALANCER",
    prompt: {
      pt: "Busco equilíbrio sereno entre guardar para o futuro e desfrutar com moderação o presente.",
      en: "I seek calm balance between saving for tomorrow and enjoying today with moderation.",
      es: "Busco un equilibrio sensato entre ahorrar para el futuro y disfrutar con mesura el hoy.",
      fr: "Je recherche un juste équilibre entre prévoyance pour demain et plaisir mesuré au présent.",
    },
  },
  {
    stableKey: "MD_BAL_02",
    position: 18,
    archetype: "BALANCER",
    prompt: {
      pt: "Não deixo o dinheiro se tornar fonte de obsessão nem de negligência na minha rotina.",
      en: "I do not let finances become an obsession nor an area of chronic neglect.",
      es: "No permito que el dinero sea ni motivo de obsesión ni de descuido en mi vida.",
      fr: "Je ne laisse pas l'argent devenir une obsession ni une source de négligence.",
    },
  },
  {
    stableKey: "MD_BAL_03",
    position: 19,
    archetype: "BALANCER",
    prompt: {
      pt: "Minhas despesas cabem confortavelmente no meu padrão de vida sem apertos nem ostentação.",
      en: "My expenditures fit comfortably within my lifestyle without stress or ostentation.",
      es: "Mis gastos se ajustan con comodidad a mi estilo de vida, sin estrecheces ni ostentación.",
      fr: "Mes dépenses correspondent sereinement à mon mode de vie, sans privation ni apparat.",
    },
  },
  {
    stableKey: "MD_BAL_04",
    position: 20,
    archetype: "BALANCER",
    prompt: {
      pt: "Generosidade e compartilhar recursos com quem precisa são aspectos centrais da minha ética.",
      en: "Generosity and sharing with those in need are central pillars of my financial ethics.",
      es: "La generosidad y compartir con quienes lo necesitan son pilares de mi ética financiera.",
      fr: "La générosité et le partage solidaire sont au cœur de mon éthique financière.",
    },
  },
];
