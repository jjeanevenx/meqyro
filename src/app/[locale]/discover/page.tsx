import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Brain,
  Briefcase,
  CheckCircle2,
  Clock3,
  Heart,
  Scale,
  Sparkles,
  Target,
  Wallet,
} from "lucide-react";
import { SiteHeader } from "@/components/patterns/site-header";
import { experiences, type Experience, type ExperienceSlug } from "@/content/experiences";
import { buildPageMetadata } from "@/features/seo/metadata-builder";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
const META: Record<Locale, { title: string; description: string }> = {
  pt: {
    title: "Descobrir — 7 experiências de autoconhecimento | Meqyro",
    description:
      "Compare e escolha entre as sete experiências Meqyro, com resultado inicial grátis e sem cadastro obrigatório.",
  },
  en: {
    title: "Discover — 7 self-discovery experiences | Meqyro",
    description:
      "Compare and choose among seven Meqyro experiences, with a free initial result and no account required.",
  },
  es: {
    title: "Descubrir — 7 experiencias de autoconocimiento | Meqyro",
    description:
      "Compara y elige entre siete experiencias Meqyro, con resultado inicial gratis y sin registro.",
  },
  fr: {
    title: "Découvrir — 7 expériences de connaissance de soi | Meqyro",
    description:
      "Comparez et choisissez parmi sept expériences Meqyro, avec un premier résultat gratuit et sans inscription.",
  },
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildPageMetadata({ locale, path: "/discover", ...META[locale] });
}

type Copy = {
  title: string;
  subtitle: string;
  count: string;
  free: string;
  noAccount: string;
  freeTag: string;
  cta: string;
  details: string;
};
const COPY: Record<Locale, Copy> = {
  pt: {
    title: "Escolha uma experiência",
    subtitle: "Explore diferentes aspectos de como você pensa, decide, trabalha e se relaciona.",
    count: "7 experiências",
    free: "Resultados iniciais grátis",
    noAccount: "Sem cadastro obrigatório",
    freeTag: "Resultado grátis",
    cta: "Iniciar teste",
    details: "Ver detalhes",
  },
  en: {
    title: "Choose an experience",
    subtitle: "Explore different aspects of how you think, decide, work, and connect.",
    count: "7 experiences",
    free: "Free initial results",
    noAccount: "No account required",
    freeTag: "Free result",
    cta: "Start assessment",
    details: "View details",
  },
  es: {
    title: "Elige una experiencia",
    subtitle: "Explora distintos aspectos de cómo piensas, decides, trabajas y te relacionas.",
    count: "7 experiencias",
    free: "Resultados iniciales gratis",
    noAccount: "Sin registro obligatorio",
    freeTag: "Resultado gratis",
    cta: "Comenzar test",
    details: "Ver detalles",
  },
  fr: {
    title: "Choisissez une expérience",
    subtitle:
      "Explorez différents aspects de votre façon de penser, décider, travailler et interagir.",
    count: "7 expériences",
    free: "Premiers résultats gratuits",
    noAccount: "Sans inscription obligatoire",
    freeTag: "Résultat gratuit",
    cta: "Commencer le test",
    details: "Voir les détails",
  },
};
const ICONS = {
  brainrank: Brain,
  "personality-map": Sparkles,
  careerfit: Briefcase,
  moneydna: Wallet,
  coupledna: Heart,
  decisiondna: Scale,
  focusstyle: Target,
} satisfies Record<ExperienceSlug, typeof Brain>;

function ExperienceCard({
  experience,
  locale,
  copy,
  index,
}: {
  experience: Experience;
  locale: Locale;
  copy: Copy;
  index: number;
}) {
  const Icon = ICONS[experience.slug];
  return (
    <article className="exp-card">
      <div className="exp-card__top">
        <div className="exp-card__icon" aria-hidden="true">
          <Icon />
        </div>
        <span className="exp-card__badge">
          <CheckCircle2 aria-hidden="true" />
          {copy.freeTag}
        </span>
      </div>
      <div className="exp-card__body">
        <p className="exp-card__brand">
          <span>{String(index + 1).padStart(2, "0")}</span>
          {experience.brand}
        </p>
        <h2 className="exp-card__name">{experience.title[locale]}</h2>
        <p className="exp-card__desc">{experience.description[locale]}</p>
      </div>
      <div className="exp-card__meta">
        <span className="exp-card__meta-item">
          <Clock3 aria-hidden="true" />
          {experience.duration}
        </span>
        <span aria-hidden="true">•</span>
        <span className="exp-card__meta-item">{experience.items[locale]}</span>
      </div>
      <div className="exp-card__actions">
        <Link
          href={`/${locale}/quizzes/${experience.slug}/play?source=discover`}
          className="exp-card__cta"
        >
          <span>{copy.cta}</span>
          <ArrowRight aria-hidden="true" />
        </Link>
        <Link href={`/${locale}/quizzes/${experience.slug}`} className="exp-card__details">
          {copy.details}
        </Link>
      </div>
    </article>
  );
}

export default async function DiscoverPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const copy = COPY[locale];
  const dictionary = getDictionary(locale);
  return (
    <main className="discover">
      <SiteHeader
        locale={locale}
        languageLabel={dictionary.nav.language}
        discoverLabel={dictionary.nav.discover}
        howLabel={dictionary.nav.about}
      />
      <header className="discover__hero">
        <span className="discover__eyebrow">Meqyro Experiences</span>
        <h1 className="discover__title">{copy.title}</h1>
        <p className="discover__subtitle">{copy.subtitle}</p>
        <div className="discover__trust">
          <span>{copy.count}</span>
          <span className="discover__trust-dot" />
          <span>{copy.free}</span>
          <span className="discover__trust-dot" />
          <span>{copy.noAccount}</span>
        </div>
      </header>
      <section className="discover__grid" aria-label={copy.title}>
        {experiences.map((experience, index) => (
          <ExperienceCard
            key={experience.slug}
            experience={experience}
            locale={locale}
            copy={copy}
            index={index}
          />
        ))}
      </section>
    </main>
  );
}
