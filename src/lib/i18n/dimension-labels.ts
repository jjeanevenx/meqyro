import type { Locale } from "./config";

const labels: Record<string, readonly [string, string, string, string]> = {
  PATTERN_RECOGNITION: [
    "Reconhecimento de padrões",
    "Pattern recognition",
    "Reconocimiento de patrones",
    "Reconnaissance des motifs",
  ],
  LOGICAL_REASONING: [
    "Raciocínio lógico",
    "Logical reasoning",
    "Razonamiento lógico",
    "Raisonnement logique",
  ],
  NUMERICAL_REASONING: [
    "Raciocínio numérico",
    "Numerical reasoning",
    "Razonamiento numérico",
    "Raisonnement numérique",
  ],
  ATTENTION: ["Atenção", "Attention", "Atención", "Attention"],
  PROBLEM_SOLVING: [
    "Resolução de problemas",
    "Problem solving",
    "Resolución de problemas",
    "Résolution de problèmes",
  ],
  SPEED: ["Velocidade", "Speed", "Velocidad", "Vitesse"],
  OPENNESS: ["Abertura", "Openness", "Apertura", "Ouverture"],
  CONSCIENTIOUSNESS: ["Conscienciosidade", "Conscientiousness", "Responsabilidad", "Conscience"],
  EXTRAVERSION: ["Extroversão", "Extraversion", "Extraversión", "Extraversion"],
  AGREEABLENESS: ["Amabilidade", "Agreeableness", "Amabilidad", "Agréabilité"],
  EMOTIONAL_STABILITY: [
    "Estabilidade emocional",
    "Emotional stability",
    "Estabilidad emocional",
    "Stabilité émotionnelle",
  ],
  TECHNICAL: [
    "Técnico / Especialista",
    "Technical expertise",
    "Especialista técnico",
    "Expertise technique",
  ],
  MANAGERIAL: [
    "Gestão / Liderança",
    "Management / Leadership",
    "Gestión / Liderazgo",
    "Management / Leadership",
  ],
  CREATIVE: ["Criatividade", "Creativity", "Creatividad", "Créativité"],
  AUTONOMOUS: ["Autonomia", "Autonomy", "Autonomía", "Autonomie"],
  SECURITY: ["Segurança", "Security", "Seguridad", "Sécurité"],
  CAUSE: ["Causa", "Purpose", "Propósito", "Mission"],
  BUILDER: ["Construtor", "Builder", "Constructor", "Bâtisseur"],
  GUARDIAN: ["Guardião", "Guardian", "Guardián", "Gardien"],
  STRATEGIST: ["Estrategista", "Strategist", "Estratega", "Stratège"],
  ADVENTURER: ["Aventureiro", "Adventurer", "Aventurero", "Aventurier"],
  BALANCER: ["Equilibrador", "Balancer", "Equilibrador", "Équilibreur"],
  IMMERSIVE_HYPERFOCUS: [
    "Hiperfoco imersivo",
    "Immersive hyperfocus",
    "Hiperenfoque inmersivo",
    "Flow immersif",
  ],
  MODULAR_SERIAL: ["Foco modular", "Modular focus", "Enfoque modular", "Focus modulaire"],
  COLLABORATIVE: ["Colaborativo", "Collaborative", "Colaborativo", "Collaboratif"],
  REACTIVE_SPRINT: ["Sprint reativo", "Reactive sprint", "Sprint reactivo", "Sprint réactif"],
  ANALYTICAL: ["Analítico", "Analytical", "Analítico", "Analytique"],
  INTUITIVE: ["Intuitivo", "Intuitive", "Intuitivo", "Intuitif"],
  PRAGMATIC: ["Pragmático", "Pragmatic", "Pragmático", "Pragmatique"],
  COMMUNICATION: ["Comunicação", "Communication", "Comunicación", "Communication"],
  LIFE_VALUES: ["Valores de vida", "Life values", "Valores de vida", "Valeurs de vie"],
  CONFLICT_MANAGEMENT: [
    "Gestão de conflitos",
    "Conflict management",
    "Gestión de conflictos",
    "Gestion des conflits",
  ],
  FINANCES: ["Finanças", "Finances", "Finanzas", "Finances"],
  FUTURE_PLANS: ["Planos futuros", "Future plans", "Planes futuros", "Projets d'avenir"],
};

export function getDimensionLabel(key: string, locale: Locale): string {
  return labels[key]?.[({ pt: 0, en: 1, es: 2, fr: 3 } as const)[locale]] ?? key.replace(/_/g, " ");
}
