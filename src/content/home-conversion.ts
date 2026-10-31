import type { Locale } from "@/lib/i18n/config";

type HomeConversionCopy = {
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  cta: string;
  secondary: string;
  trust: string[];
  featured: string;
  challenge: string;
  challengeBody: string;
  dimensions: string[];
  result: string;
  resultBody: string;
  goalsTitle: string;
  catalog: string;
  goalsBody: string;
  goals: [string, string, string];
  goalCta: string;
  freeItems: string[];
  premiumItems: string[];
  premiumNote: string;
  finalTitle: string;
  finalBody: string;
  privacy: string;
  terms: string;
};

export const homeConversionCopy: Record<Locale, HomeConversionCopy> = {
  pt: {
    eyebrow: "Menos achismo. Mais autoconhecimento.",
    title: "Entenda como você pensa.",
    accent: "Descubra seu próximo passo.",
    body: "Explore seu raciocínio, suas escolhas com dinheiro e sua comunicação em casal. Comece pelo BrainRank e veja seu resultado inicial grátis ao concluir.",
    cta: "Começar meu desafio grátis",
    secondary: "Escolher outra experiência",
    trust: ["7–10 minutos", "Resultado inicial grátis", "Sem cadastro obrigatório"],
    featured: "Conheça o desafio · BrainRank",
    challenge: "Como você resolve um novo desafio?",
    challengeBody: "Explore seu raciocínio em 24 desafios de lógica, padrões e atenção.",
    dimensions: ["Lógica", "Padrões", "Atenção"],
    result: "Da curiosidade à clareza",
    resultBody: "Ao concluir, veja uma leitura inicial do seu desempenho e dos padrões explorados.",
    goalsTitle: "O que você quer entender sobre você?",
    catalog: "experiências para explorar",
    goalsBody:
      "Escolha o tema que faz sentido para o seu momento. Todas as experiências incluem um resultado inicial gratuito.",
    goals: [
      "Explorar meu raciocínio",
      "Entender meus hábitos financeiros",
      "Abrir espaço para o diálogo em casal",
    ],
    goalCta: "Explorar {experience}",
    freeItems: [
      "Seu indicador de maior destaque",
      "Um resumo dos indicadores avaliados",
      "Resultado na tela, sem conta obrigatória",
    ],
    premiumItems: [
      "Mais detalhes sobre as dimensões avaliadas",
      "Contexto para interpretar seus padrões",
      "Recomendações práticas para o cotidiano",
    ],
    premiumNote:
      "Opcional e pago. A oferta aparece após o resultado inicial, com o preço antes da compra.",
    finalTitle: "Seu próximo insight começa com uma pergunta.",
    finalBody:
      "Comece o BrainRank: 24 desafios de raciocínio, em cerca de 7–10 minutos, com resultado inicial grátis.",
    privacy: "Privacidade",
    terms: "Termos de uso",
  },
  en: {
    eyebrow: "Less guesswork. More self-knowledge.",
    title: "Understand how you think.",
    accent: "Discover your next step.",
    body: "Explore your reasoning, money choices, and communication as a couple. Start with BrainRank and see your free initial result when you finish.",
    cta: "Start my free challenge",
    secondary: "Choose another experience",
    trust: ["7–10 minutes", "Free initial result", "No account required"],
    featured: "Meet the challenge · BrainRank",
    challenge: "How do you solve a new challenge?",
    challengeBody: "Explore your reasoning through 24 logic, pattern, and attention challenges.",
    dimensions: ["Logic", "Patterns", "Attention"],
    result: "From curiosity to clarity",
    resultBody: "Finish to see an initial reading of your performance and the patterns explored.",
    goalsTitle: "What would you like to understand about yourself?",
    catalog: "experiences to explore",
    goalsBody:
      "Choose a topic that fits where you are today. Every experience includes a free initial result.",
    goals: [
      "Explore my reasoning",
      "Understand my financial habits",
      "Make room for dialogue as a couple",
    ],
    goalCta: "Explore {experience}",
    freeItems: [
      "Your most prominent indicator",
      "A summary of the indicators explored",
      "On-screen result, no account required",
    ],
    premiumItems: [
      "More detail on the dimensions explored",
      "Context to interpret your patterns",
      "Practical everyday recommendations",
    ],
    premiumNote:
      "Optional and paid. The offer appears after your initial result, with the price shown before purchase.",
    finalTitle: "Your next insight starts with a question.",
    finalBody:
      "Start BrainRank: 24 reasoning challenges in about 7–10 minutes, with a free initial result.",
    privacy: "Privacy",
    terms: "Terms of use",
  },
  es: {
    eyebrow: "Menos suposiciones. Más autoconocimiento.",
    title: "Entiende cómo piensas.",
    accent: "Descubre tu próximo paso.",
    body: "Explora tu razonamiento, tus decisiones con el dinero y la comunicación en pareja. Empieza con BrainRank y ve tu resultado inicial gratis al terminar.",
    cta: "Comenzar mi reto gratis",
    secondary: "Elegir otra experiencia",
    trust: ["7–10 minutos", "Resultado inicial gratis", "Sin registro obligatorio"],
    featured: "Conoce el reto · BrainRank",
    challenge: "¿Cómo resuelves un nuevo reto?",
    challengeBody: "Explora tu razonamiento con 24 retos de lógica, patrones y atención.",
    dimensions: ["Lógica", "Patrones", "Atención"],
    result: "De la curiosidad a la claridad",
    resultBody:
      "Al terminar, recibe una lectura inicial de tu desempeño y los patrones explorados.",
    goalsTitle: "¿Qué quieres entender sobre ti?",
    catalog: "experiencias para explorar",
    goalsBody:
      "Elige un tema para tu momento actual. Todas las experiencias incluyen un resultado inicial gratis.",
    goals: [
      "Explorar mi razonamiento",
      "Entender mis hábitos financieros",
      "Abrir espacio para el diálogo en pareja",
    ],
    goalCta: "Explorar {experience}",
    freeItems: [
      "Tu indicador más destacado",
      "Un resumen de los indicadores evaluados",
      "Resultado en pantalla, sin cuenta obligatoria",
    ],
    premiumItems: [
      "Más detalles sobre las dimensiones evaluadas",
      "Contexto para interpretar tus patrones",
      "Recomendaciones prácticas para el día a día",
    ],
    premiumNote:
      "Opcional y de pago. La oferta aparece después del resultado inicial, con el precio antes de comprar.",
    finalTitle: "Tu próxima revelación empieza con una pregunta.",
    finalBody:
      "Empieza BrainRank: 24 retos de razonamiento en unos 7–10 minutos, con resultado inicial gratis.",
    privacy: "Privacidad",
    terms: "Términos de uso",
  },
  fr: {
    eyebrow: "Moins de suppositions. Plus de connaissance de soi.",
    title: "Comprenez comment vous pensez.",
    accent: "Découvrez votre prochaine étape.",
    body: "Explorez votre raisonnement, vos choix financiers et votre communication en couple. Commencez par BrainRank et découvrez votre premier résultat gratuit à la fin.",
    cta: "Commencer mon défi gratuit",
    secondary: "Choisir une autre expérience",
    trust: ["7–10 minutes", "Premier résultat gratuit", "Sans inscription obligatoire"],
    featured: "Découvrez le défi · BrainRank",
    challenge: "Comment résolvez-vous un nouveau défi ?",
    challengeBody:
      "Explorez votre raisonnement avec 24 défis de logique, de motifs et d’attention.",
    dimensions: ["Logique", "Motifs", "Attention"],
    result: "De la curiosité à la clarté",
    resultBody:
      "À la fin, découvrez une première lecture de votre performance et des schémas explorés.",
    goalsTitle: "Que souhaitez-vous comprendre sur vous-même ?",
    catalog: "expériences à explorer",
    goalsBody:
      "Choisissez un sujet adapté à votre situation. Chaque expérience inclut un premier résultat gratuit.",
    goals: [
      "Explorer mon raisonnement",
      "Comprendre mes habitudes financières",
      "Ouvrir le dialogue en couple",
    ],
    goalCta: "Explorer {experience}",
    freeItems: [
      "Votre indicateur le plus marqué",
      "Un résumé des indicateurs évalués",
      "Un résultat à l’écran, sans compte obligatoire",
    ],
    premiumItems: [
      "Plus de détails sur les dimensions évaluées",
      "Du contexte pour interpréter vos schémas",
      "Des recommandations pratiques au quotidien",
    ],
    premiumNote:
      "Facultatif et payant. L’offre apparaît après le premier résultat, avec le prix indiqué avant l’achat.",
    finalTitle: "Votre prochaine découverte commence par une question.",
    finalBody:
      "Commencez BrainRank : 24 défis de raisonnement en environ 7–10 minutes, avec un premier résultat gratuit.",
    privacy: "Confidentialité",
    terms: "Conditions d’utilisation",
  },
};
