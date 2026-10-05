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
    body: "Seu jeito de raciocinar, trabalhar e decidir tem padrões. Explore os seus com experiências rápidas e um resultado inicial gratuito.",
    cta: "Começar meu desafio grátis",
    secondary: "Escolher outra experiência",
    trust: ["7–10 minutos", "Resultado inicial grátis", "Sem cadastro obrigatório"],
    featured: "Comece por aqui · BrainRank",
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
      "Entender minha personalidade",
      "Explorar meu caminho profissional",
      "Conhecer meu estilo de foco",
    ],
    goalCta: "Explorar esta experiência",
    freeItems: [
      "Uma leitura inicial dos seus padrões",
      "Resultado ao concluir a experiência",
      "Comece sem criar uma conta",
    ],
    premiumItems: [
      "Mais detalhes sobre as dimensões avaliadas",
      "Contexto para interpretar seus padrões",
      "Recomendações práticas para o cotidiano",
    ],
    premiumNote: "Opcional e pago. Você vê a oferta antes de decidir comprar.",
    finalTitle: "Seu próximo insight começa com uma pergunta.",
    finalBody:
      "Reserve 7–10 minutos para explorar seu raciocínio. O resultado inicial é por nossa conta.",
    privacy: "Privacidade",
    terms: "Termos de uso",
  },
  en: {
    eyebrow: "Less guesswork. More self-knowledge.",
    title: "Understand how you think.",
    accent: "Discover your next step.",
    body: "The way you reason, work, and decide follows patterns. Explore yours with short experiences and a free initial result.",
    cta: "Start my free challenge",
    secondary: "Choose another experience",
    trust: ["7–10 minutes", "Free initial result", "No account required"],
    featured: "Start here · BrainRank",
    challenge: "How do you solve a new challenge?",
    challengeBody: "Explore your reasoning through 24 logic, pattern, and attention challenges.",
    dimensions: ["Logic", "Patterns", "Attention"],
    result: "From curiosity to clarity",
    resultBody: "Finish to see an initial reading of your performance and the patterns explored.",
    goalsTitle: "What would you like to understand about yourself?",
    catalog: "experiences to explore",
    goalsBody:
      "Choose a topic that fits where you are today. Every experience includes a free initial result.",
    goals: ["Understand my personality", "Explore my career direction", "Discover my focus style"],
    goalCta: "Explore this experience",
    freeItems: [
      "An initial reading of your patterns",
      "A result when you finish",
      "Start without creating an account",
    ],
    premiumItems: [
      "More detail on the dimensions explored",
      "Context to interpret your patterns",
      "Practical everyday recommendations",
    ],
    premiumNote: "Optional and paid. See the offer before deciding to buy.",
    finalTitle: "Your next insight starts with a question.",
    finalBody: "Take 7–10 minutes to explore your reasoning. Your initial result is on us.",
    privacy: "Privacy",
    terms: "Terms of use",
  },
  es: {
    eyebrow: "Menos suposiciones. Más autoconocimiento.",
    title: "Entiende cómo piensas.",
    accent: "Descubre tu próximo paso.",
    body: "Tu forma de razonar, trabajar y decidir tiene patrones. Explora los tuyos con experiencias breves y un resultado inicial gratis.",
    cta: "Comenzar mi reto gratis",
    secondary: "Elegir otra experiencia",
    trust: ["7–10 minutos", "Resultado inicial gratis", "Sin registro obligatorio"],
    featured: "Empieza aquí · BrainRank",
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
      "Entender mi personalidad",
      "Explorar mi camino profesional",
      "Conocer mi estilo de enfoque",
    ],
    goalCta: "Explorar esta experiencia",
    freeItems: [
      "Una lectura inicial de tus patrones",
      "Resultado al terminar",
      "Empieza sin crear una cuenta",
    ],
    premiumItems: [
      "Más detalles sobre las dimensiones evaluadas",
      "Contexto para interpretar tus patrones",
      "Recomendaciones prácticas para el día a día",
    ],
    premiumNote: "Opcional y de pago. Consulta la oferta antes de comprar.",
    finalTitle: "Tu próxima revelación empieza con una pregunta.",
    finalBody: "Dedica 7–10 minutos a explorar tu razonamiento. El resultado inicial es gratis.",
    privacy: "Privacidad",
    terms: "Términos de uso",
  },
  fr: {
    eyebrow: "Moins de suppositions. Plus de connaissance de soi.",
    title: "Comprenez comment vous pensez.",
    accent: "Découvrez votre prochaine étape.",
    body: "Votre façon de raisonner, de travailler et de décider suit des schémas. Explorez les vôtres avec des expériences courtes et un premier résultat gratuit.",
    cta: "Commencer mon défi gratuit",
    secondary: "Choisir une autre expérience",
    trust: ["7–10 minutes", "Premier résultat gratuit", "Sans inscription obligatoire"],
    featured: "Commencez ici · BrainRank",
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
      "Comprendre ma personnalité",
      "Explorer ma voie professionnelle",
      "Découvrir mon style de concentration",
    ],
    goalCta: "Explorer cette expérience",
    freeItems: [
      "Une première lecture de vos schémas",
      "Un résultat à la fin",
      "Commencez sans créer de compte",
    ],
    premiumItems: [
      "Plus de détails sur les dimensions évaluées",
      "Du contexte pour interpréter vos schémas",
      "Des recommandations pratiques au quotidien",
    ],
    premiumNote: "Facultatif et payant. Consultez l’offre avant de décider d’acheter.",
    finalTitle: "Votre prochaine découverte commence par une question.",
    finalBody:
      "Prenez 7–10 minutes pour explorer votre raisonnement. Le premier résultat est gratuit.",
    privacy: "Confidentialité",
    terms: "Conditions d’utilisation",
  },
};
