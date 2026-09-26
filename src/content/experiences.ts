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
      pt: "Mapeie suas tendências nas cinco grandes dimensões científicas da personalidade.",
      en: "Map your tendencies across the five scientifically established personality dimensions.",
      es: "Mapea tus tendencias en las cinco grandes dimensiones científicas de la personalidad.",
      fr: "Cartographiez vos tendances selon les cinq dimensions scientifiques de la personnalité.",
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
    duration: "7–10 min",
    items: { pt: "30 perguntas", en: "30 questions", es: "30 preguntas", fr: "30 questions" },
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
      pt: "Entenda seus padrões de planejamento, impulsividade e tolerância a risco.",
      en: "Understand your patterns around planning, impulsivity, and risk tolerance.",
      es: "Comprende tus patrones de planificación, impulsividad y tolerancia al riesgo.",
      fr: "Comprenez vos réflexes de planification, d’impulsivité et de tolérance au risque.",
    },
    duration: "5–8 min",
    items: { pt: "25 perguntas", en: "25 questions", es: "25 preguntas", fr: "25 questions" },
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
    items: { pt: "25 perguntas", en: "25 questions", es: "25 preguntas", fr: "25 questions" },
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
    items: { pt: "24 cenários", en: "24 scenarios", es: "24 escenarios", fr: "24 scénarios" },
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
      pt: "Descubra seu modo de concentração: sprint, imersão profunda ou agilidade.",
      en: "Discover your concentration mode: sprint, deep immersion, or agility.",
      es: "Descubre tu modo de concentración: sprint, inmersión profunda o agilidad.",
      fr: "Diagnostic de votre mode de concentration : sprint, immersion profonde ou agilité.",
    },
    duration: "6–8 min",
    items: { pt: "25 perguntas", en: "25 questions", es: "25 preguntas", fr: "25 questions" },
  },
] as const;

export const featuredExperience = experiences.find(
  (experience) => experience.slug === "brainrank",
)!;
