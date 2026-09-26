import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock3, BarChart3, Lock, ArrowRight, Binary, Sparkles, Briefcase, Wallet, Target, Scale, Heart } from "lucide-react";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getPublicQuiz } from "@/features/quiz-engine/repository";
import { buildPageMetadata } from "@/features/seo/metadata-builder";
import { generateQuizJsonLd } from "@/features/seo/json-ld";

const VALID_SLUGS = [
  "brainrank",
  "personality-map",
  "careerfit",
  "moneydna",
  "focusstyle",
  "decisiondna",
  "coupledna",
] as const;

type QuizSlug = (typeof VALID_SLUGS)[number];

function isValidSlug(slug: string): slug is QuizSlug {
  return (VALID_SLUGS as readonly string[]).includes(slug);
}

type QuizPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    VALID_SLUGS.map((slug) => ({
      locale,
      slug,
    })),
  );
}

const QUIZ_CATALOG_META: Record<
  QuizSlug,
  {
    titles: Record<Locale, string>;
    subtitles: Record<Locale, string>;
    descriptions: Record<Locale, string>;
    duration: string;
    itemsCount: Record<Locale, string>;
    badge: Record<Locale, string>;
    dimensions: Record<Locale, string[]>;
  }
> = {
  brainrank: {
    titles: {
      pt: "BrainRank — Desafio de Raciocínio Cognitivo",
      en: "BrainRank — Cognitive Reasoning Assessment",
      es: "BrainRank — Evaluación de Razonamiento Cognitivo",
      fr: "BrainRank — Évaluation du Raisonnement Cognitif",
    },
    subtitles: {
      pt: "Descubra como você raciocina sob diferentes desafios mentais.",
      en: "Discover how your mind navigates diverse cognitive challenges.",
      es: "Descubre cómo razonas ante diferentes retos cognitivos.",
      fr: "Découvrez comment vous raisonnez face aux défis cognitifs.",
    },
    descriptions: {
      pt: "Avaliação rápida, rigorosa e confidencial de raciocínio lógico e padrões com resultado gratuito.",
      en: "Fast, rigorous, and confidential assessment of logical reasoning and pattern recognition with free baseline results.",
      es: "Evaluación rápida, rigurosa y confidencial con resultado gratuito.",
      fr: "Évaluation rapide, rigoureuse et confidentielle avec résultat gratuit.",
    },
    duration: "7–10 min",
    itemsCount: { pt: "24 desafios", en: "24 challenges", es: "24 retos", fr: "24 défis" },
    badge: { pt: "Desafio Cognitivo", en: "Cognitive Challenge", es: "Reto Cognitivo", fr: "Défi Cognitif" },
    dimensions: {
      pt: ["Padrões", "Lógica", "Números", "Atenção", "Problemas", "Velocidade"],
      en: ["Patterns", "Logic", "Numbers", "Attention", "Problems", "Speed"],
      es: ["Patrones", "Lógica", "Números", "Atención", "Problemas", "Velocidad"],
      fr: ["Motifs", "Logique", "Nombres", "Attention", "Problèmes", "Vitesse"],
    },
  },
  "personality-map": {
    titles: {
      pt: "Personality Map — Mapeamento Big Five",
      en: "Personality Map — Big Five Assessment",
      es: "Personality Map — Evaluación Big Five",
      fr: "Personality Map — Évaluation Big Five",
    },
    subtitles: {
      pt: "Mapeie suas tendências naturais nas cinco grandes dimensões da personalidade.",
      en: "Map your natural tendencies across the five major personality dimensions.",
      es: "Mapea tus tendencias naturales en las cinco grandes dimensiones de la personalidad.",
      fr: "Cartographiez vos tendances naturelles selon les cinq grandes dimensions.",
    },
    descriptions: {
      pt: "Descubra seu perfil comportamental detalhado com base no modelo científico dos Cinco Grandes Fatores.",
      en: "Uncover your behavioral tendencies based on the scientifically validated Big Five model.",
      es: "Descubre tu perfil de personalidad según el modelo científico Big Five.",
      fr: "Découvrez votre profil comportemental selon le modèle scientifique des Big Five.",
    },
    duration: "8–12 min",
    itemsCount: { pt: "40 afirmações", en: "40 statements", es: "40 afirmaciones", fr: "40 affirmations" },
    badge: { pt: "Personalidade", en: "Personality", es: "Personalidad", fr: "Personnalité" },
    dimensions: {
      pt: ["Abertura", "Conscienciosidade", "Extroversão", "Amabilidade", "Estabilidade"],
      en: ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Stability"],
      es: ["Apertura", "Responsabilidad", "Extraversión", "Amabilidad", "Estabilidad"],
      fr: ["Ouverture", "Conscience", "Extraversion", "Agréabilité", "Stabilité"],
    },
  },
  careerfit: {
    titles: {
      pt: "CareerFit — Âncoras e Estilos de Carreira",
      en: "CareerFit — Career Anchors & Alignment",
      es: "CareerFit — Anclas y Estilos de Carrera",
      fr: "CareerFit — Alignement et Carrière",
    },
    subtitles: {
      pt: "Identifique as motivações essenciais que orientam suas melhores escolhas profissionais.",
      en: "Identify the core motivations guiding your most fulfilling career moves.",
      es: "Identifica las motivaciones clave que guían tus mejores elecciones profesionales.",
      fr: "Identifiez les motivations profondes guidant votre épanouissement professionnel.",
    },
    descriptions: {
      pt: "Mapeamento das suas âncoras de carreira: técnica, liderança, autonomia, segurança, criatividade e causa.",
      en: "Map your career anchors: technical expertise, leadership, autonomy, security, creativity, and purpose.",
      es: "Mapeo de anclas profesionales: técnica, liderazgo, autonomía, seguridad, creatividad y propósito.",
      fr: "Cartographie de vos ancres professionnelles : expertise, leadership, autonomie, sécurité, créativité et mission.",
    },
    duration: "6–8 min",
    itemsCount: { pt: "24 afirmações", en: "24 statements", es: "24 afirmaciones", fr: "24 affirmations" },
    badge: { pt: "Carreira & Propósito", en: "Career & Purpose", es: "Carrera y Propósito", fr: "Carrière & Mission" },
    dimensions: {
      pt: ["Técnico/Especialista", "Gestão/Liderança", "Criatividade", "Autonomia", "Segurança", "Causa"],
      en: ["Technical", "Managerial", "Creativity", "Autonomy", "Security", "Purpose"],
      es: ["Técnico", "Liderazgo", "Creatividad", "Autonomía", "Seguridad", "Propósito"],
      fr: ["Technique", "Management", "Créativité", "Autonomie", "Sécurité", "Mission"],
    },
  },
  moneydna: {
    titles: {
      pt: "MoneyDNA — Psicologia e Comportamento Financeiro",
      en: "MoneyDNA — Financial Psychology & Archetypes",
      es: "MoneyDNA — Psicología y Conducta Financiera",
      fr: "MoneyDNA — Psychologie et Rapport à l'Argent",
    },
    subtitles: {
      pt: "Descubra como você toma decisões financeiras e sua relação inconsciente com o dinheiro.",
      en: "Discover how you make financial decisions and your relationship with money.",
      es: "Descubre cómo tomas decisiones financieras y tu relación con el dinero.",
      fr: "Découvrez votre rapport psychologique et vos réflexes de décision financière.",
    },
    descriptions: {
      pt: "Identifique seu arquétipo financeiro dominante: Construtor, Guardião, Estrategista, Aventureiro ou Equilibrador.",
      en: "Uncover your dominant financial archetype: Builder, Guardian, Strategist, Adventurer, or Balancer.",
      es: "Identifica tu arquetipo financiero: Constructor, Guardián, Estratega, Aventurero o Equilibrador.",
      fr: "Identifiez votre archétype financier dominant : Bâtisseur, Gardien, Stratège, Aventurier ou Équilibreur.",
    },
    duration: "5–7 min",
    itemsCount: { pt: "20 afirmações", en: "20 statements", es: "20 afirmaciones", fr: "20 affirmations" },
    badge: { pt: "Psicologia Financeira", en: "Financial Psychology", es: "Conducta Financiera", fr: "Rapport à l'Argent" },
    dimensions: {
      pt: ["Construtor", "Guardião", "Estrategista", "Aventureiro", "Equilibrador"],
      en: ["Builder", "Guardian", "Strategist", "Adventurer", "Balancer"],
      es: ["Constructor", "Guardián", "Estratega", "Aventurero", "Equilibrador"],
      fr: ["Bâtisseur", "Gardien", "Stratège", "Aventurier", "Équilibreur"],
    },
  },
  focusstyle: {
    titles: {
      pt: "FocusStyle — Ritmo de Atenção e Foco Produtivo",
      en: "FocusStyle — Attention Rhythms & Flow",
      es: "FocusStyle — Ritmo de Atención y Enfoque",
      fr: "FocusStyle — Rythmes d'Attention et Productivité",
    },
    subtitles: {
      pt: "Compreenda seu estilo natural de concentração e como organizar seu fluxo de trabalho.",
      en: "Understand your natural concentration style and design your ideal workday cadence.",
      es: "Comprende tu estilo natural de concentración y organiza tu flujo óptimo de trabajo.",
      fr: "Comprenez votre fonctionnement attentionnel et structurez votre journée de travail.",
    },
    descriptions: {
      pt: "Descubra seu padrão produtivo: Hiperfoco Imersivo, Modular Estruturado, Cocriação Colaborativa ou Sprint Reativo.",
      en: "Discover your productive pattern: Immersive Hyperfocus, Modular Serial, Collaborative, or Reactive Sprint.",
      es: "Descubre tu patrón: Hiperenfoque Inmersivo, Modular Estructurado, Colaborativo o Sprint Reactivo.",
      fr: "Découvrez votre profil : Flow Immersif, Modulaire Structuré, Collaboratif ou Sprint Réactif.",
    },
    duration: "5–7 min",
    itemsCount: { pt: "20 afirmações", en: "20 statements", es: "20 afirmaciones", fr: "20 affirmations" },
    badge: { pt: "Foco & Ritmo", en: "Focus & Productivity", es: "Enfoque y Ritmo", fr: "Focus & Rythme" },
    dimensions: {
      pt: ["Hiperfoco Imersivo", "Foco Modular", "Cocriação Colaborativa", "Sprint Reativo"],
      en: ["Deep Flow", "Structured Modular", "Collaborative", "Reactive Sprint"],
      es: ["Hiperenfoque Inmersivo", "Modular Estructurado", "Colaborativo", "Sprint Reactivo"],
      fr: ["Flow Immersif", "Modulaire Structuré", "Collaboratif", "Sprint Réactif"],
    },
  },
  decisiondna: {
    titles: {
      pt: "DecisionDNA — Tomada de Decisão sob Pressão",
      en: "DecisionDNA — Decision-Making Under Pressure",
      es: "DecisionDNA — Toma de Decisiones bajo Presión",
      fr: "DecisionDNA — Prise de Décision sous Pression",
    },
    subtitles: {
      pt: "Descubra seu estilo decisório enfrentando cenários práticos de risco e incerteza.",
      en: "Uncover your decision style through real-world scenarios of uncertainty and trade-offs.",
      es: "Descubre tu estilo decisorio ante escenarios reales de incertidumbre y riesgo.",
      fr: "Découvrez votre style de décision face à des situations concrètes d'incertitude.",
    },
    descriptions: {
      pt: "Avaliação por cenários: estilos Analítico, Intuitivo, Pragmático e Colaborativo.",
      en: "Scenario-based judgment assessment: Analytical, Intuitive, Pragmatic, and Collaborative styles.",
      es: "Evaluación por escenarios: estilos Analítico, Intuitivo, Pragmático y Colaborativo.",
      fr: "Évaluation par scénarios : styles Analytique, Intuitif, Pragmatique et Collaboratif.",
    },
    duration: "5–8 min",
    itemsCount: { pt: "4 cenários práticos", en: "4 practical scenarios", es: "4 escenarios prácticos", fr: "4 scénarios pratiques" },
    badge: { pt: "Cenários Decisórios", en: "Decision Scenarios", es: "Escenarios Decisorios", fr: "Scénarios Décisionnels" },
    dimensions: {
      pt: ["Analítico", "Intuitivo", "Pragmático", "Colaborativo"],
      en: ["Analytical", "Intuitive", "Pragmatic", "Collaborative"],
      es: ["Analítico", "Intuitivo", "Pragmático", "Colaborativo"],
      fr: ["Analytique", "Intuitif", "Pragmatique", "Collaboratif"],
    },
  },
  coupledna: {
    titles: {
      pt: "CoupleDNA — Dinâmica de Relacionamento e Harmonia a Dois",
      en: "CoupleDNA — Relationship Dynamics & Mutual Alignment",
      es: "CoupleDNA — Dinámica de Relación y Armonía de Pareja",
      fr: "CoupleDNA — Dynamique de Couple et Alignement",
    },
    subtitles: {
      pt: "Mapeie os pontos fortes da sua conexão com consentimento bilateral e comparação segura.",
      en: "Map mutual relationship strengths with bilateral consent and secure joint comparison.",
      es: "Mapea las fortalezas de tu relación con consentimiento bilateral y comparación protegida.",
      fr: "Analysez les piliers de votre relation avec consentement mutuel et restitution partagée.",
    },
    descriptions: {
      pt: "Avaliação bilateral de relacionamento: comunicação, valores de vida, gestão de conflitos, finanças e planos futuros.",
      en: "Bilateral partnership assessment: communication, life values, conflict resolution, finances, and shared future.",
      es: "Evaluación bilateral de pareja: comunicación, valores, resolución de conflictos, finanzas y futuro.",
      fr: "Évaluation de couple à double consentement : communication, valeurs, gestion des conflits, finances et avenir.",
    },
    duration: "6–9 min",
    itemsCount: { pt: "20 afirmações", en: "20 statements", es: "20 afirmaciones", fr: "20 affirmations" },
    badge: { pt: "Harmonia a Dois", en: "Couple Harmony", es: "Armonía de Pareja", fr: "Harmonie de Couple" },
    dimensions: {
      pt: ["Comunicação", "Valores de Vida", "Conflitos", "Finanças", "Planos Futuros"],
      en: ["Communication", "Life Values", "Conflict Resolution", "Finances", "Future Vision"],
      es: ["Comunicación", "Valores", "Conflictos", "Finanzas", "Planes Futuros"],
      fr: ["Communication", "Valeurs", "Conflits", "Finances", "Projets d'Avenir"],
    },
  },
};

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isValidSlug(slug)) {
    return {};
  }

  const meta = QUIZ_CATALOG_META[slug];
  const title = meta.titles[locale];
  const description = meta.descriptions[locale];

  return buildPageMetadata({
    locale: locale as Locale,
    path: `/quizzes/${slug}`,
    title,
    description,
  });
}

export default async function QuizLandingPage({ params }: QuizPageProps) {
  const { locale, slug } = await params;

  if (!isLocale(locale) || !isValidSlug(slug)) notFound();

  const quiz = await getPublicQuiz(slug, locale as Locale);
  if (!quiz) notFound();

  const meta = QUIZ_CATALOG_META[slug];
  const title = slug === "brainrank" ? "BrainRank" : slug === "personality-map" ? "Personality Map" : slug === "careerfit" ? "CareerFit" : slug === "moneydna" ? "MoneyDNA" : slug === "focusstyle" ? "FocusStyle" : slug === "decisiondna" ? "DecisionDNA" : "CoupleDNA";
  const subtitle = meta.subtitles[locale as Locale];
  const duration = meta.duration;
  const itemsCount = meta.itemsCount[locale as Locale];
  const badgeText = meta.badge[locale as Locale];
  const dimensions = meta.dimensions[locale as Locale];

  const ctaText = {
    pt: "Começar a avaliação",
    en: "Start assessment",
    es: "Comenzar evaluación",
    fr: "Commencer l'évaluation",
  }[locale as Locale];

  const disclaimer = {
    pt: "Sem cadastro obrigatório. Não substitui avaliação clínica ou aconselhamento profissional.",
    en: "No sign-up required. Not a clinical assessment or professional counseling.",
    es: "Sin registro obligatorio. No sustituye una evaluación clínica o asesoramiento profesional.",
    fr: "Sans inscription obligatoire. Ne remplace pas une évaluation clinique ou un conseil professionnel.",
  }[locale as Locale];

  const jsonLd = generateQuizJsonLd({
    name: title,
    description: subtitle,
    quizSlug: slug,
    locale: locale as Locale,
  });

  const renderIcon = () => {
    switch (slug) {
      case "brainrank":
        return <Binary size={16} />;
      case "personality-map":
        return <Sparkles size={16} />;
      case "careerfit":
        return <Briefcase size={16} />;
      case "moneydna":
        return <Wallet size={16} />;
      case "focusstyle":
        return <Target size={16} />;
      case "decisiondna":
        return <Scale size={16} />;
      case "coupledna":
        return <Heart size={16} />;
    }
  };

  return (
    <main className="quiz-landing-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="quiz-landing-header">
        <Link href={`/${locale}`} className="quiz-landing-back" aria-label="Voltar para a página inicial">
          <ArrowLeft size={18} />
          <span>MEQYRO</span>
        </Link>
      </header>

      <article className="quiz-landing-card">
        <div className="quiz-landing-badge">
          {renderIcon()}
          <span>{badgeText}</span>
        </div>

        <h1 className="quiz-landing-title">{title}</h1>
        <p className="quiz-landing-subtitle">{subtitle}</p>

        <div className="quiz-landing-facts">
          <div className="quiz-landing-fact">
            <Clock3 size={18} className="text-blue" />
            <span>{duration} · {itemsCount}</span>
          </div>
          <div className="quiz-landing-fact">
            <BarChart3 size={18} className="text-blue" />
            <span>Resultado gratuito incluído</span>
          </div>
        </div>

        <section className="quiz-landing-dimensions">
          <h2>Dimensões avaliadas</h2>
          <div className="quiz-dimension-pills">
            {dimensions.map((dim) => (
              <span key={dim} className="quiz-dimension-pill">
                {dim}
              </span>
            ))}
          </div>
        </section>

        <div className="quiz-landing-action">
          <Link href={`/${locale}/quizzes/${slug}/play`} className="button button--primary quiz-start-btn">
            <span>{ctaText}</span>
            <ArrowRight size={18} />
          </Link>
          <small className="quiz-landing-disclaimer">
            <Lock size={14} />
            <span>{disclaimer}</span>
          </small>
        </div>
      </article>
    </main>
  );
}
