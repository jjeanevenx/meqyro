import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { BrainRankHero } from "@/components/patterns/brainrank-hero";
import { LocaleMarketSelector } from "@/components/patterns/locale-market-selector";
import { ButtonLink } from "@/components/ui/button-link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { resolveMarketContext } from "@/lib/market/market-context";
import { buildPageMetadata } from "@/features/seo/metadata-builder";
import { generateOrganizationJsonLd } from "@/features/seo/json-ld";

type PageProps = {
  params: Promise<{ locale: string }>;
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
  const cookieStore = await cookies();
  const dictionary = getDictionary(localeParam);
  const market = resolveMarketContext({
    locale: localeParam,
    market: cookieStore.get("meqyro_market")?.value,
    source: cookieStore.has("meqyro_market") ? "user" : "locale-fallback",
  });

  const orgJsonLd = generateOrganizationJsonLd();

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <header className="site-header">
        <a className="brand" href={`/${localeParam}`} aria-label="Meqyro home">
          MEQ<span>Y</span>RO
        </a>
        <nav aria-label="Primary">
          <a href="#discover">{dictionary.nav.discover}</a>
          <a href="#about">{dictionary.nav.about}</a>
        </nav>
        <LocaleMarketSelector
          locale={localeParam}
          market={market.market}
          languageLabel={dictionary.nav.language}
          marketLabel={dictionary.nav.market}
        />
      </header>
      <section className="intro" id="about">
        <div>
          <h1>{dictionary.hero.title}</h1>
          <p>{dictionary.hero.body}</p>
          <ButtonLink href="#discover" variant="secondary">
            {dictionary.hero.cta}
          </ButtonLink>
          <small>{dictionary.hero.note}</small>
        </div>
        <div className="intro__mark" aria-hidden="true">
          <span>ME</span>
          <span>QY</span>
          <span>RO</span>
        </div>
      </section>
      <div id="discover">
        <BrainRankHero locale={localeParam as Locale} dictionary={dictionary} market={market} />
      </div>
    </main>
  );
}
