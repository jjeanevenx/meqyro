import type { Locale } from "@/lib/i18n/config";

export type ExperienceSlug =
  | "brainrank"
  | "personality-map"
  | "careerfit"
  | "moneydna"
  | "coupledna"
  | "decisiondna"
  | "focusstyle";
type LocalizedText = Record<Locale, string>;
export type Experience = {
  slug: ExperienceSlug;
  brand: string;
  category: "cognitive" | "identity" | "career" | "finance" | "relationship" | "performance";
  title: LocalizedText;
  description: LocalizedText;
  duration: string;
  items: LocalizedText;
};

export const experiences: readonly Experience[] = [
  {
    slug: "brainrank",
    brand: "BrainRank",
    category: "cognitive",
    title: {
      pt: "Desafio de Raciocínio",
      en: "Reasoning Challenge",
      es: "Reto de Razonamiento",
      fr: "Défi de Raisonnement",
    },
    description: {
      pt: "Explore padrões de lógica, atenção e resolução de problemas em 24 desafios.",
      en: "Explore patterns in logic, attention, and problem solving across 24 challenges.",
      es: "Explora patrones de lógica, atención y resolución de problemas en 24 retos.",
      fr: "Explorez vos schémas de logique, d’attention et de résolution en 24 défis.",
    },
    duration: "7–10 min",
    items: { pt: "24 desafios", en: "24 challenges", es: "24 retos", fr: "24 défis" },
  },
  {
    slug: "personality-map",
    brand: "Personality Map",
    category: "identity",
    title: {
      pt: "Cinco Grandes Fatores",
      en: "Big Five Profile",
      es: "Cinco Grandes Factores",
      fr: "Carte des 5 Facteurs",
    },
    description: {
      pt: "Explore abertura, organização, sociabilidade, cooperação e estabilidade emocional nas suas respostas.",
      en: "Explore openness, organization, sociability, cooperation, and emotional stability in your answers.",
      es: "Explora apertura, organización, sociabilidad, cooperación y estabilidad emocional en tus respuestas.",
      fr: "Explorez l’ouverture, l’organisation, la sociabilité, la coopération et la stabilité émotionnelle dans vos réponses.",
    },
    duration: "8–12 min",
    items: {
      pt: "40 afirmações",
      en: "40 statements",
      es: "40 afirmaciones",
      fr: "40 affirmations",
    },
  },
  {
    slug: "careerfit",
    brand: "CareerFit",
    category: "career",
    title: {
      pt: "Perfil Vocacional e Profissional",
      en: "Vocational & Work Alignment",
      es: "Perfil Vocacional y Profesional",
      fr: "Profil Professionnel et Vocation",
    },
    description: {
      pt: "Identifique ambientes de trabalho e preferências profissionais alinhados ao seu perfil.",
      en: "Identify workplace environments and professional preferences aligned with your profile.",
      es: "Identifica entornos de trabajo y preferencias profesionales alineados con tu perfil.",
      fr: "Identifiez les environnements et préférences professionnelles adaptés à votre profil.",
    },
    duration: "6–9 min",
    items: { pt: "24 perguntas", en: "24 questions", es: "24 preguntas", fr: "24 questions" },
  },
  {
    slug: "moneydna",
    brand: "MoneyDNA",
    category: "finance",
    title: {
      pt: "Comportamento Financeiro",
      en: "Financial Behavior Profile",
      es: "Comportamiento Financiero",
      fr: "Comportement Financier",
    },
    description: {
      pt: "Explore suas prioridades ao gastar, guardar e planejar em 20 situações reais.",
      en: "Explore your spending, saving, and planning priorities through 20 real-life situations.",
      es: "Explora tus prioridades al gastar, ahorrar y planificar en 20 situaciones reales.",
      fr: "Explorez vos priorités de dépenses, d’épargne et de planification dans 20 situations réelles.",
    },
    duration: "5–8 min",
    items: { pt: "20 situações", en: "20 situations", es: "20 situaciones", fr: "20 situations" },
  },
  {
    slug: "coupledna",
    brand: "CoupleDNA",
    category: "relationship",
    title: {
      pt: "Compatibilidade em Dupla",
      en: "Bilateral Compatibility",
      es: "Compatibilidad en Pareja",
      fr: "Compatibilité de Couple",
    },
    description: {
      pt: "Compare comunicação e valores em uma análise conjunta, privada e consentida.",
      en: "Compare communication and values in a private, consensual joint analysis.",
      es: "Compara comunicación y valores en un análisis conjunto, privado y consentido.",
      fr: "Comparez communication et valeurs dans une analyse privée et mutuellement consentie.",
    },
    duration: "6–8 min",
    items: { pt: "20 situações", en: "20 situations", es: "20 situaciones", fr: "20 situations" },
  },
  {
    slug: "decisiondna",
    brand: "DecisionDNA",
    category: "performance",
    title: {
      pt: "Tomada de Decisão",
      en: "Decision-Making Profile",
      es: "Toma de Decisiones",
      fr: "Prise de Décision sous Pression",
    },
    description: {
      pt: "Analise seus padrões entre intuição, deliberação, risco e consistência.",
      en: "Analyze your patterns across intuition, deliberation, risk, and consistency.",
      es: "Analiza tus patrones entre intuición, deliberación, riesgo y coherencia.",
      fr: "Analysez vos arbitrages entre intuition, délibération, risque et cohérence.",
    },
    duration: "6–9 min",
    items: { pt: "4 cenários", en: "4 scenarios", es: "4 escenarios", fr: "4 scénarios" },
  },
  {
    slug: "focusstyle",
    brand: "FocusStyle",
    category: "performance",
    title: {
      pt: "Foco e Produtividade",
      en: "Focus & Productivity",
      es: "Enfoque y Productividad",
      fr: "Concentration et Productivité",
    },
    description: {
      pt: "Explore como você prefere organizar sua atenção, lidar com tarefas e manter a concentração.",
      en: "Explore how you prefer to organize your attention, handle tasks, and stay focused.",
      es: "Explora cómo prefieres organizar tu atención, abordar tareas y mantener la concentración.",
      fr: "Explorez vos préférences pour organiser votre attention, gérer vos tâches et rester concentré.",
    },
    duration: "6–8 min",
    items: { pt: "20 perguntas", en: "20 questions", es: "20 preguntas", fr: "20 questions" },
  },
] as const;

export const featuredExperience = experiences.find(
  (experience) => experience.slug === "brainrank",
)!;
