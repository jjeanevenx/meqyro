import Image from "next/image";
import { BarChart3, Clock3, Grid3X3, Box, Eye, Gauge, Puzzle, Binary } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import type { MarketContext } from "@/lib/market/market-context";
import { brainRankPrice, formatMoney } from "@/lib/market/prices";
import { ButtonLink } from "@/components/ui/button-link";

const icons = [Grid3X3, Box, BarChart3, Eye, Puzzle, Gauge];

export function BrainRankHero({
  locale,
  dictionary,
  market,
}: {
  locale: Locale;
  dictionary: ReturnType<typeof getDictionary>;
  market: MarketContext;
}) {
  const price = formatMoney(brainRankPrice(market.market), market.currency, locale);
  return (
    <section className="brainrank" aria-labelledby="brainrank-title">
      <div className="brainrank__copy">
        <div className="brainrank__signal">
          <Binary aria-hidden="true" size={18} />
          <span>{dictionary.brainrank.label}</span>
        </div>
        <h2 id="brainrank-title">
          <span>Brain</span>Rank
        </h2>
        <h3>{dictionary.brainrank.title}</h3>
        <p>{dictionary.brainrank.body}</p>
        <div className="brainrank__facts">
          <span>
            <Clock3 aria-hidden="true" />
            {dictionary.brainrank.duration}
          </span>
          <span>
            <BarChart3 aria-hidden="true" />
            {dictionary.brainrank.free}
          </span>
        </div>
      </div>
      <Image
        className="brainrank__image"
        src="/images/brainrank-cognitive-field.png"
        width={900}
        height={1200}
        sizes="(max-width: 760px) 88vw, 560px"
        priority
        alt=""
      />
      <div className="brainrank__dimensions" aria-label="BrainRank dimensions">
        {dictionary.dimensions.map((label, index) => {
          const Icon = icons[index];
          return (
            <span key={label}>
              <Icon aria-hidden="true" />
              {label}
            </span>
          );
        })}
      </div>
      <div className="brainrank__action">
        <ButtonLink href={`/${locale}/quizzes/brainrank`}>{dictionary.brainrank.cta}</ButtonLink>
        <small>
          {dictionary.brainrank.disclaimer} · {price}
        </small>
      </div>
    </section>
  );
}
