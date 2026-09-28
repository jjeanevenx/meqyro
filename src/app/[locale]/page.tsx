import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Compass, FileText, ShieldCheck, Sparkles } from "lucide-react";
import { BrainRankHero } from "@/components/patterns/brainrank-hero";
import { SiteHeader } from "@/components/patterns/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { featuredExperience } from "@/content/experiences";
import { buildPageMetadata } from "@/features/seo/metadata-builder";
import { generateOrganizationJsonLd } from "@/features/seo/json-ld";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { resolveMarketContext } from "@/lib/market/market-context";

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
  const dictionary = getDictionary(locale);
  return buildPageMetadata({
    locale,
    path: "",
    title: `Meqyro — ${dictionary.hero.title}`,
    description: dictionary.hero.body,
  });
}

export default async function LocalizedHome({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dictionary = getDictionary(locale);
  const copy = HOME_COPY[locale];
  const cookieStore = await cookies();
  const market = resolveMarketContext({
    locale,
    market: cookieStore.get("meqyro_market")?.value,
    source: cookieStore.has("meqyro_market") ? "user" : "locale-fallback",
  });
  return (
    <main className="home-page">
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
      <section className="intro" id="about">
        <div className="intro__content">
          <h1>{dictionary.hero.title}</h1>
          <p>{dictionary.hero.body}</p>
          <div className="intro__cta-group">
            <div className="intro__cta-row">
              <ButtonLink href={`/${locale}/discover`}>{dictionary.hero.cta}</ButtonLink>
            </div>
            <small>
              <CheckCircle2 aria-hidden="true" />
              {dictionary.hero.note}
            </small>
          </div>
        </div>
        <div className="intro__mark" aria-hidden="true">
          <span>ME</span>
          <span>QY</span>
          <span>RO</span>
        </div>
      </section>
      <BrainRankHero
        locale={locale}
        dictionary={dictionary}
        market={market}
        experience={featuredExperience}
      />
      <div className="home-catalog-link">
        <Link href={`/${locale}/discover`}>
          {copy.explore}
          <ArrowRight aria-hidden="true" />
        </Link>
        <span>7</span>
      </div>
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
        </article>
        <article>
          <FileText aria-hidden="true" />
          <h2>{copy.premiumTitle}</h2>
          <p>{copy.premiumBody}</p>
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
              <Sparkles aria-hidden="true" />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>
      <section className="home-final">
        <h2>{dictionary.hero.title}</h2>
        <ButtonLink href={`/${locale}/discover`}>{copy.explore}</ButtonLink>
      </section>
      <footer className="site-footer">
        <Link className="brand" href={`/${locale}`}>
          MEQ<span>Y</span>RO
        </Link>
        <p>© {new Date().getFullYear()} Meqyro</p>
      </footer>
    </main>
  );
}
