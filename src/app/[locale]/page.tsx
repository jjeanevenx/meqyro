import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  FileText,
  ShieldCheck,
  Plus,
  Brain,
  Briefcase,
  Target,
  Fingerprint,
} from "lucide-react";
import { SiteHeader } from "@/components/patterns/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { experiences } from "@/content/experiences";
import { homeConversionCopy } from "@/content/home-conversion";
import { buildPageMetadata } from "@/features/seo/metadata-builder";
import { generateOrganizationJsonLd } from "@/features/seo/json-ld";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";

type PageProps = { params: Promise<{ locale: string }> };
type HomeCopy = {
  explore: string;
  howTitle: string;
  howBody: string;
  steps: [string, string, string];
  methodTitle: string;
  methodBody: string;
  freeTitle: string;
  freeBody: string;
  premiumTitle: string;
  premiumBody: string;
  faqTitle: string;
  faqs: [string, string][];
};
const HOME_COPY: Record<Locale, HomeCopy> = {
  pt: {
    explore: "Explorar experiências",
    howTitle: "Clareza em poucos passos",
    howBody:
      "Escolha uma experiência, responda no seu ritmo e receba uma leitura inicial imediatamente.",
    steps: ["Escolha o que quer explorar", "Responda perguntas objetivas", "Entenda seus padrões"],
    methodTitle: "Autoconhecimento com método",
    methodBody:
      "Cada experiência transforma modelos reconhecidos em perguntas acessíveis, com privacidade e linguagem clara.",
    freeTitle: "Resultado inicial grátis",
    freeBody: "Veja seus principais padrões ao concluir, sem cadastro obrigatório.",
    premiumTitle: "Aprofunde quando quiser",
    premiumBody: "O relatório premium adiciona dimensões, contexto e recomendações práticas.",
    faqTitle: "Perguntas frequentes",
    faqs: [
      [
        "É grátis? Preciso pagar para ver o resultado?",
        "O resultado inicial é gratuito. O relatório premium é opcional e pago; você só compra se quiser aprofundar sua leitura.",
      ],
      [
        "Preciso criar uma conta?",
        "Não. Você pode começar e ver o resultado inicial sem cadastro obrigatório.",
      ],
      [
        "Os testes são diagnósticos?",
        "Não. São experiências de autoconhecimento e não substituem avaliação profissional.",
      ],
      [
        "O que o relatório premium inclui?",
        "Uma leitura mais detalhada, comparações e recomendações aplicáveis ao cotidiano.",
      ],
    ],
  },
  en: {
    explore: "Explore experiences",
    howTitle: "Clarity in a few steps",
    howBody: "Choose an experience, answer at your pace, and get an initial reading right away.",
    steps: ["Choose what to explore", "Answer focused questions", "Understand your patterns"],
    methodTitle: "Self-knowledge with method",
    methodBody:
      "Each experience turns established models into accessible questions, with privacy and clear language.",
    freeTitle: "Free initial result",
    freeBody: "See your main patterns when you finish, with no account required.",
    premiumTitle: "Go deeper when you want",
    premiumBody: "The premium report adds dimensions, context, and practical recommendations.",
    faqTitle: "Frequently asked questions",
    faqs: [
      [
        "Is it free? Do I have to pay to see my result?",
        "Your initial result is free. The paid premium report is optional, if you want to explore further.",
      ],
      [
        "Do I need an account?",
        "No. You can start and see your initial result without creating one.",
      ],
      [
        "Are these diagnostic tests?",
        "No. They support self-reflection and do not replace professional assessment.",
      ],
      [
        "What is in the premium report?",
        "A deeper reading, comparisons, and practical recommendations for everyday life.",
      ],
    ],
  },
  es: {
    explore: "Explorar experiencias",
    howTitle: "Claridad en pocos pasos",
    howBody: "Elige una experiencia, responde a tu ritmo y recibe una lectura inicial al instante.",
    steps: ["Elige qué explorar", "Responde preguntas objetivas", "Comprende tus patrones"],
    methodTitle: "Autoconocimiento con método",
    methodBody:
      "Cada experiencia convierte modelos reconocidos en preguntas accesibles, con privacidad y lenguaje claro.",
    freeTitle: "Resultado inicial gratis",
    freeBody: "Conoce tus principales patrones al terminar, sin registro obligatorio.",
    premiumTitle: "Profundiza cuando quieras",
    premiumBody: "El informe premium añade dimensiones, contexto y recomendaciones prácticas.",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      [
        "¿Es gratis? ¿Tengo que pagar para ver el resultado?",
        "El resultado inicial es gratis. El informe premium es opcional y de pago, si quieres profundizar.",
      ],
      [
        "¿Necesito crear una cuenta?",
        "No. Puedes comenzar y ver el resultado inicial sin registro.",
      ],
      [
        "¿Son pruebas diagnósticas?",
        "No. Son experiencias de autoconocimiento y no sustituyen una evaluación profesional.",
      ],
      [
        "¿Qué incluye el informe premium?",
        "Una lectura detallada, comparaciones y recomendaciones prácticas.",
      ],
    ],
  },
  fr: {
    explore: "Explorer les expériences",
    howTitle: "De la clarté en quelques étapes",
    howBody:
      "Choisissez une expérience, répondez à votre rythme et obtenez une première lecture immédiatement.",
    steps: ["Choisissez votre sujet", "Répondez à des questions ciblées", "Comprenez vos schémas"],
    methodTitle: "Une méthode au service de la connaissance de soi",
    methodBody:
      "Chaque expérience rend des modèles reconnus accessibles, dans un langage clair et respectueux de votre vie privée.",
    freeTitle: "Premier résultat gratuit",
    freeBody: "Découvrez vos principaux schémas dès la fin, sans inscription obligatoire.",
    premiumTitle: "Approfondissez à votre rythme",
    premiumBody:
      "Le rapport premium ajoute des dimensions, du contexte et des recommandations pratiques.",
    faqTitle: "Questions fréquentes",
    faqs: [
      [
        "Est-ce gratuit ? Faut-il payer pour voir le résultat ?",
        "Le premier résultat est gratuit. Le rapport premium est facultatif et payant, si vous souhaitez approfondir.",
      ],
      [
        "Faut-il créer un compte ?",
        "Non. Vous pouvez commencer et voir le premier résultat sans inscription.",
      ],
      [
        "S’agit-il de diagnostics ?",
        "Non. Ces expériences favorisent la réflexion personnelle sans remplacer un avis professionnel.",
      ],
      [
        "Que contient le rapport premium ?",
        "Une lecture détaillée, des comparaisons et des recommandations concrètes.",
      ],
    ],
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = homeConversionCopy[locale];
  return buildPageMetadata({
    locale,
    path: "",
    title: copy.title,
    description: copy.body,
  });
}

export default async function LocalizedHome({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dictionary = getDictionary(locale);
  const copy = HOME_COPY[locale];
  const conversion = homeConversionCopy[locale];
  const goals = ["personality-map", "careerfit", "focusstyle"] as const;
  const goalIcons = [Fingerprint, Briefcase, Target];
  const startHref = `/${locale}/quizzes/brainrank/play?source=home_hero`;
  return (
    <main className="home-page conversion-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationJsonLd()) }}
      />
      <SiteHeader
        locale={locale}
        languageLabel={dictionary.nav.language}
        discoverLabel={dictionary.nav.discover}
        howLabel={dictionary.nav.about}
        current="home"
      />
      <section className="conversion-hero" id="about" aria-labelledby="home-title">
        <div className="conversion-hero__copy">
          <p className="conversion-eyebrow">
            <span />
            {conversion.eyebrow}
          </p>
          <h1 id="home-title">
            {conversion.title} <span>{conversion.accent}</span>
          </h1>
          <p className="conversion-hero__body">{conversion.body}</p>
          <div className="conversion-hero__actions">
            <ButtonLink href={startHref}>{conversion.cta}</ButtonLink>
            <Link className="conversion-text-link" href="#experiences">
              {conversion.secondary}
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>
          <ul className="conversion-trust">
            {conversion.trust.map((label) => (
              <li key={label}>
                <CheckCircle2 aria-hidden="true" size={16} />
                {label}
              </li>
            ))}
          </ul>
        </div>
        <div className="conversion-preview">
          <div className="conversion-preview__top">
            <Brain aria-hidden="true" size={22} />
            <span>{conversion.featured}</span>
            <span aria-hidden="true">↗</span>
          </div>
          <div className="conversion-preview__art" aria-hidden="true">
            <div className="conversion-orbit conversion-orbit--outer" />
            <div className="conversion-orbit conversion-orbit--inner" />
            <Brain size={88} strokeWidth={1.2} />
            <span className="conversion-node conversion-node--one" />
            <span className="conversion-node conversion-node--two" />
            <span className="conversion-node conversion-node--three" />
          </div>
          <h2>{conversion.challenge}</h2>
          <p>{conversion.challengeBody}</p>
          <div className="conversion-dimensions">
            {conversion.dimensions.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div className="conversion-preview__result">
            <Compass aria-hidden="true" size={22} />
            <div>
              <strong>{conversion.result}</strong>
              <p>{conversion.resultBody}</p>
            </div>
          </div>
          <Link className="conversion-text-link" href={`/${locale}/quizzes/brainrank`}>
            {dictionary.brainrank.label}
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </section>
      <section
        className="home-section conversion-goals"
        id="experiences"
        aria-labelledby="goals-title"
      >
        <p className="conversion-eyebrow">
          MEQYRO · {experiences.length} {conversion.catalog}
        </p>
        <h2 id="goals-title">{conversion.goalsTitle}</h2>
        <p>{conversion.goalsBody}</p>
        <div className="conversion-goals__grid">
          {goals.map((slug, index) => {
            const experience = experiences.find((item) => item.slug === slug)!;
            const Icon = goalIcons[index];
            return (
              <Link
                className="conversion-goal"
                key={slug}
                href={`/${locale}/quizzes/${slug}?source=home_goal`}
              >
                <div className="conversion-goal__top">
                  <Icon aria-hidden="true" size={24} />
                  <span>{experience.duration}</span>
                </div>
                <h3>{conversion.goals[index]}</h3>
                <p>{experience.description[locale]}</p>
                <span className="conversion-goal__cta">
                  {conversion.goalCta}
                  <ArrowRight aria-hidden="true" size={18} />
                </span>
              </Link>
            );
          })}
        </div>
        <Link className="conversion-text-link" href={`/${locale}/discover`}>
          {copy.explore}
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </section>
      <section className="home-section" id="how-it-works">
        <div className="home-section__heading">
          <span>01</span>
          <div>
            <h2>{copy.howTitle}</h2>
            <p>{copy.howBody}</p>
          </div>
        </div>
        <ol className="home-steps">
          {copy.steps.map((step, index) => (
            <li key={step}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>
      <section className="home-section home-method">
        <ShieldCheck aria-hidden="true" />
        <div>
          <h2>{copy.methodTitle}</h2>
          <p>{copy.methodBody}</p>
        </div>
      </section>
      <section className="home-section home-results">
        <article>
          <Compass aria-hidden="true" />
          <h2>{copy.freeTitle}</h2>
          <p>{copy.freeBody}</p>
          <ul className="conversion-checklist">
            {conversion.freeItems.map((item) => (
              <li key={item}>
                <CheckCircle2 aria-hidden="true" size={18} />
                {item}
              </li>
            ))}
          </ul>
          <ButtonLink href={`/${locale}/quizzes/brainrank/play?source=home_free`}>
            {conversion.cta}
          </ButtonLink>
        </article>
        <article>
          <FileText aria-hidden="true" />
          <h2>{copy.premiumTitle}</h2>
          <p>{copy.premiumBody}</p>
          <ul className="conversion-checklist">
            {conversion.premiumItems.map((item) => (
              <li key={item}>
                <CheckCircle2 aria-hidden="true" size={18} />
                {item}
              </li>
            ))}
          </ul>
          <small>{conversion.premiumNote}</small>
        </article>
      </section>
      <section className="home-section home-faq">
        <div className="home-section__heading">
          <span>FAQ</span>
          <h2>{copy.faqTitle}</h2>
        </div>
        {copy.faqs.map(([question, answer]) => (
          <details key={question}>
            <summary>
              {question}
              <Plus aria-hidden="true" />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>
      <section className="home-final">
        <h2>{conversion.finalTitle}</h2>
        <p>{conversion.finalBody}</p>
        <ButtonLink href={`/${locale}/quizzes/brainrank/play?source=home_final`}>
          {conversion.cta}
        </ButtonLink>
        <small>{dictionary.hero.note}</small>
      </section>
      <footer className="site-footer">
        <Link className="brand" href={`/${locale}`}>
          MEQ<span>Y</span>RO
        </Link>
        <p>© {new Date().getFullYear()} Meqyro</p>
        <div className="conversion-footer-links">
          <Link href={`/${locale}/privacy`}>{conversion.privacy}</Link>
          <Link href={`/${locale}/terms`}>{conversion.terms}</Link>
        </div>
      </footer>
    </main>
  );
}
