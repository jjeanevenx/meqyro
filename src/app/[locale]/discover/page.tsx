import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Brain,
  Sparkles,
  Briefcase,
  Wallet,
  Heart,
  Scale,
  Target,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/features/seo/metadata-builder";
import { ButtonLink } from "@/components/ui/button-link";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const titles: Record<Locale, string> = {
    pt: "Descobrir — Catálogo de Testes e Experiências | Meqyro",
    en: "Discover — Full Quiz & Assessment Catalog | Meqyro",
    es: "Descubrir — Catálogo Completo de Testes | Meqyro",
    fr: "Découvrir — Catalogue des Tests et Évaluations | Meqyro",
  };

  const descriptions: Record<Locale, string> = {
    pt: "Explore nossos 7 testes objetivos sobre inteligência, personalidade, carreira, finanças e relacionamentos.",
    en: "Explore our 7 objective assessments across intelligence, personality, career, finances, and relationships.",
    es: "Explora nuestras 7 evaluaciones objetivas de autoconocimiento sin registro obligatorio.",
    fr: "Explorez nos 7 évaluations objectives sans inscription obligatoire.",
  };

  return buildPageMetadata({
    locale,
    path: "/discover",
    title: titles[locale as Locale],
    description: descriptions[locale as Locale],
  });
}

type QuizItem = {
  slug: string;
  category: "cognitive" | "identity" | "career" | "finance" | "relationship" | "performance";
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  duration: string;
  items: Record<Locale, string>;
  icon: typeof Brain;
  color: string;
};

const QUIZZES: QuizItem[] = [
  {
    slug: "brainrank",
    category: "cognitive",
    title: {
      pt: "BrainRank — Desafio de Raciocínio",
      en: "BrainRank — Reasoning Challenge",
      es: "BrainRank — Reto de Razonamiento",
      fr: "BrainRank — Défi de Raisonnement",
    },
    subtitle: {
      pt: "Avalie velocidade de processamento, padrões e lógica com pontuação precisa.",
      en: "Assess processing speed, patterns, and logic with precise benchmarking.",
      es: "Evalúa velocidad mental, patrones y lógica con puntuación precisa.",
      fr: "Évaluez rapidité, motifs et logique avec une notation rigoureuse.",
    },
    duration: "7–10 min",
    items: { pt: "24 desafios", en: "24 challenges", es: "24 retos", fr: "24 défis" },
    icon: Brain,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    slug: "personality-map",
    category: "identity",
    title: {
      pt: "Personality Map — Cinco Grandes Fatores",
      en: "Personality Map — Big Five Profile",
      es: "Personality Map — Cinco Grandes Factores",
      fr: "Personality Map — Carte des 5 Facteurs",
    },
    subtitle: {
      pt: "Mapeie suas tendências naturais nas 5 grandes dimensões científicas da personalidade.",
      en: "Map your natural tendencies across the 5 scientifically validated personality dimensions.",
      es: "Mapea tus tendencias en las 5 grandes dimensiones científicas de la personalidad.",
      fr: "Cartographiez vos tendances selon les 5 dimensions scientifiques de la personnalité.",
    },
    duration: "8–12 min",
    items: { pt: "40 afirmações", en: "40 statements", es: "40 afirmaciones", fr: "40 affirmations" },
    icon: Sparkles,
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    slug: "careerfit",
    category: "career",
    title: {
      pt: "CareerFit — Perfil Vocacional e Profissional",
      en: "CareerFit — Vocational & Work Alignment",
      es: "CareerFit — Perfil Vocacional y Profesional",
      fr: "CareerFit — Profil Professionnel et Vocation",
    },
    subtitle: {
      pt: "Identifique seus ambientes ideais de trabalho e preferências ocupacionais (modelo RIASEC).",
      en: "Identify your ideal workplace environments and occupational preferences (RIASEC model).",
      es: "Identifica tus entornos de trabajo ideales y preferencias profesionales (modelo RIASEC).",
      fr: "Identifiez vos environnements de travail idéaux et styles professionnels (modèle RIASEC).",
    },
    duration: "7–10 min",
    items: { pt: "30 perguntas", en: "30 questions", es: "30 preguntas", fr: "30 questions" },
    icon: Briefcase,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    slug: "moneydna",
    category: "finance",
    title: {
      pt: "MoneyDNA — Comportamento Financeiro",
      en: "MoneyDNA — Financial Behavior Profile",
      es: "MoneyDNA — Perfil de Comportamiento Financiero",
      fr: "MoneyDNA — Comportement et Rapport à l'Argent",
    },
    subtitle: {
      pt: "Descubra seu arquétipo com dinheiro: planejamento, impulsividade e tolerância a risco.",
      en: "Discover your financial archetype: planning, impulsivity, and risk tolerance.",
      es: "Descubre tu arquetipo financiero: planificación, impulsividad y tolerancia al riesgo.",
      fr: "Découvrez votre archétype financier : planification, impulsivité et appétence au risque.",
    },
    duration: "5–8 min",
    items: { pt: "25 perguntas", en: "25 questions", es: "25 preguntas", fr: "25 questions" },
    icon: Wallet,
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    slug: "coupledna",
    category: "relationship",
    title: {
      pt: "CoupleDNA — Compatibilidade em Dupla",
      en: "CoupleDNA — Bilateral Compatibility",
      es: "CoupleDNA — Compatibilidad en Pareja",
      fr: "CoupleDNA — Compatibilité de Couple",
    },
    subtitle: {
      pt: "Responda individualmente e convide seu par para desbloquear uma análise conjunta e segura.",
      en: "Answer individually and invite your partner to unlock a secure, bilateral comparison.",
      es: "Responde de forma individual e invita a tu pareja para desbloquear un informe conjunto.",
      fr: "Répondez individuellement et invitez votre partenaire pour débloquer l'analyse mutuelle.",
    },
    duration: "6–8 min",
    items: { pt: "25 perguntas", en: "25 questions", es: "25 preguntas", fr: "25 questions" },
    icon: Heart,
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    slug: "decisiondna",
    category: "performance",
    title: {
      pt: "DecisionDNA — Tomada de Decisão",
      en: "DecisionDNA — Decision-Making Profile",
      es: "DecisionDNA — Estilo de Toma de Decisiones",
      fr: "DecisionDNA — Prise de Décision sous Pression",
    },
    subtitle: {
      pt: "Analise seus padrões de escolha entre intuição, deliberação, risco e consistência.",
      en: "Analyze your choice patterns across intuition, deliberation, risk, and consistency.",
      es: "Analiza tus patrones de elección entre intuición, deliberación, riesgo y coherencia.",
      fr: "Analysez vos arbitrages entre intuition, délibération, prise de risque et cohérence.",
    },
    duration: "6–9 min",
    items: { pt: "24 cenários", en: "24 scenarios", es: "24 escenarios", fr: "24 scénarios" },
    icon: Scale,
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  {
    slug: "focusstyle",
    category: "performance",
    title: {
      pt: "FocusStyle — Foco e Produtividade",
      en: "FocusStyle — Focus & Productivity Rhythm",
      es: "FocusStyle — Enfoque y Ritmo de Productividad",
      fr: "FocusStyle — Concentration et Productivité",
    },
    subtitle: {
      pt: "Diagnóstico de estilo de concentração: sprint, deep work ou adaptabilidade ágil.",
      en: "Diagnostic of your concentration pattern: sprint flow, deep work, or agile execution.",
      es: "Diagnóstico de tu estilo de concentración: sprint, trabajo profundo o adaptabilidad.",
      fr: "Diagnostic de votre mode de concentration : sprint, immersion profonde ou agilité.",
    },
    duration: "6–8 min",
    items: { pt: "25 perguntas", en: "25 questions", es: "25 preguntas", fr: "25 questions" },
    icon: Target,
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
];

type DiscoverPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DiscoverPage({ params }: DiscoverPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const headings: Record<Locale, { title: string; subtitle: string; freeTag: string; cta: string }> = {
    pt: {
      title: "Descubra mais sobre você",
      subtitle: "7 experiências curtas e fundamentadas para transformar curiosidade em autoconhecimento claro.",
      freeTag: "Resultado Parcial Grátis",
      cta: "Iniciar teste",
    },
    en: {
      title: "Discover more about you",
      subtitle: "7 short, grounded experiences turning curiosity into actionable self-understanding.",
      freeTag: "Free Baseline Result",
      cta: "Start challenge",
    },
    es: {
      title: "Descubre más sobre ti",
      subtitle: "7 experiencias ágiles y fundamentadas para convertir tu curiosidad en claridad personal.",
      freeTag: "Resultado Básico Gratis",
      cta: "Comenzar reto",
    },
    fr: {
      title: "Découvrez-en davantage sur vous",
      subtitle: "7 expériences courtes et rigoureuses pour transformer votre curiosité en repères concrets.",
      freeTag: "Résultat Gratuit Inclus",
      cta: "Commencer le test",
    },
  };

  const copy = headings[locale as Locale];

  return (
    <main className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200/70 text-stone-700 text-xs font-semibold uppercase tracking-wider">
            Meqyro Experiences
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            {copy.title}
          </h1>
          <p className="text-base text-stone-600 max-w-xl mx-auto">
            {copy.subtitle}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {QUIZZES.map((quiz) => {
            const Icon = quiz.icon;
            return (
              <article
                key={quiz.slug}
                className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl border ${quiz.color}`}>
                      <Icon size={22} />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 size={12} /> {copy.freeTag}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-serif font-bold text-stone-900 leading-snug">
                      <Link
                        href={`/${locale}/quizzes/${quiz.slug}`}
                        className="hover:text-stone-700 transition-colors"
                      >
                        {quiz.title[locale as Locale]}
                      </Link>
                    </h2>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      {quiz.subtitle[locale as Locale]}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-stone-500 pt-1">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 size={13} /> {quiz.duration}
                    </span>
                    <span>•</span>
                    <span>{quiz.items[locale as Locale]}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <Link
                    href={`/${locale}/quizzes/${quiz.slug}`}
                    className="text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    Ver detalhes
                  </Link>
                  <ButtonLink
                    href={`/${locale}/quizzes/${quiz.slug}/play`}
                    variant="primary"
                  >
                    {copy.cta}
                  </ButtonLink>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
