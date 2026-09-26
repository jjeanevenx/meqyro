"use client";

import Link from "next/link";
import { CheckCircle2, Lock, Sparkles, ArrowRight, ShieldCheck, Info } from "lucide-react";
import type { PartialResultSummary } from "@/features/quiz-engine/contracts";
import type { PaywallOffer, ComprehensiveReport, AccessLevel } from "@/features/results/contracts";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

type ResultViewProps = {
  summary: PartialResultSummary;
  accessLevel: AccessLevel;
  paywall?: PaywallOffer;
  premiumReport?: ComprehensiveReport;
  locale: string;
};

export function ResultView({
  summary,
  accessLevel,
  paywall,
  premiumReport,
  locale,
}: ResultViewProps) {
  const isPremium = accessLevel === "PREMIUM_UNLOCKED";
  const safeLocale: Locale = locale === "en" || locale === "es" || locale === "fr" ? locale : "pt";
  const dict = getDictionary(safeLocale);

  const quizInfo = dict.quizzes[summary.quizSlug] ?? dict.quizzes.brainrank;

  const labels = {
    freeBadge: dict.resultView.freeTitle,
    premiumBadge: dict.resultView.premiumUnlocked,
    strongestLabel: {
      pt: "DESTAQUE PREDOMINANTE",
      en: "PRIMARY STRENGTH",
      es: "DESTACADO PREDOMINANTE",
      fr: "POINT FORT DOMINANT",
    }[safeLocale],
    dimensionsTitle: dict.resultView.allDimensions,
    executiveSummary: {
      pt: "Síntese Executiva",
      en: "Executive Summary",
      es: "Síntesis Ejecutiva",
      fr: "Synthèse Exécutive",
    }[safeLocale],
    actionItems: {
      pt: "Recomendações Práticas:",
      en: "Actionable Recommendations:",
      es: "Recomendaciones Prácticas:",
      fr: "Recommandations Pratiques :",
    }[safeLocale],
    protectedNotice: {
      pt: "Conteúdo Aprofundado Protegido",
      en: "In-depth Content Protected",
      es: "Contenido Detallado Protegido",
      fr: "Contenu Approfondi Protégé",
    }[safeLocale],
    oneTimePayment: {
      pt: "pagamento único",
      en: "one-time payment",
      es: "pago único",
      fr: "paiement unique",
    }[safeLocale],
    guaranteeText: {
      pt: "Acesso vitalício imediato · Garantia incondicional de 7 dias",
      en: "Instant lifetime access · 7-day money-back guarantee",
      es: "Acceso inmediato de por vida · Garantía de 7 días",
      fr: "Accès instantané à vie · Garantie satisfait ou remboursé 7 jours",
    }[safeLocale],
    unlockCta: dict.resultView.unlockPremium,
    backHome: dict.common.back,
    disclaimer: dict.resultView.disclaimer,
  };

  return (
    <div className="result-preview-card space-y-6">
      {/* 1. Header Badge */}
      <div className="result-badge flex items-center gap-2">
        {isPremium ? (
          <>
            <Sparkles size={20} className="text-amber-500" />
            <span className="font-semibold text-amber-700">{labels.premiumBadge}</span>
          </>
        ) : (
          <>
            <CheckCircle2 size={20} className="text-emerald-600" />
            <span>{labels.freeBadge}</span>
          </>
        )}
      </div>

      <h1 className="result-title text-2xl md:text-3xl font-serif font-bold text-stone-900">
        {quizInfo.name}
      </h1>

      {/* 2. Score Hero (when numeric overall score is present) */}
      {summary.overallScore !== undefined ? (
        <div className="score-hero py-4">
          <span className="score-hero__number text-5xl font-bold font-mono text-stone-900">
            {summary.overallScore}
          </span>
          <span className="score-hero__total text-lg text-stone-500"> / 1000</span>
        </div>
      ) : null}

      {/* 3. Strongest Dimension Highlight */}
      {summary.strongestDimension ? (
        <div className="strength-highlight bg-stone-100/70 border border-stone-200 p-5 rounded-2xl space-y-1">
          <small className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {labels.strongestLabel}
          </small>
          <h2 className="text-xl font-bold text-stone-900 capitalize">
            {summary.strongestDimension.replace(/_/g, " ").toLowerCase()}
          </h2>
          {summary.strongestDimensionDescription ? (
            <p className="text-sm text-stone-600">{summary.strongestDimensionDescription}</p>
          ) : null}
        </div>
      ) : null}

      {/* 4. Dimension Breakdown */}
      {summary.dimensionScores && Object.keys(summary.dimensionScores).length > 0 ? (
        <div className="dimension-breakdown space-y-3">
          <h3 className="text-base font-semibold text-stone-900">{labels.dimensionsTitle}</h3>
          <div className="dimension-list space-y-2">
            {Object.entries(summary.dimensionScores).map(([key, val]) => (
              <div
                key={key}
                className="dimension-row flex items-center justify-between text-sm py-1.5 border-b border-stone-100"
              >
                <span className="dimension-row__name capitalize text-stone-700">
                  {key.replace(/_/g, " ").toLowerCase()}
                </span>
                <span className="dimension-row__val font-mono font-medium text-stone-900">
                  {val}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* 5. Premium Unlocked Content */}
      {isPremium && premiumReport ? (
        <section className="premium-report-content space-y-6 pt-4 border-t border-stone-200">
          <div className="premium-summary-card bg-amber-50/50 border border-amber-200/60 p-5 rounded-2xl space-y-2">
            <h3 className="text-lg font-bold text-amber-950">{labels.executiveSummary}</h3>
            <p className="text-sm text-amber-900 leading-relaxed">
              {premiumReport.executiveSummary}
            </p>
          </div>

          <div className="premium-sections space-y-4">
            {premiumReport.sections.map((section) => (
              <div
                key={section.id}
                className="premium-section-card bg-white border border-stone-200 p-5 rounded-2xl space-y-3 shadow-sm"
              >
                <h4 className="text-base font-bold text-stone-900">{section.title}</h4>
                <p className="premium-section-summary text-sm text-stone-700 leading-relaxed">
                  {section.summary}
                </p>

                {section.paragraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className="premium-section-para text-sm text-stone-600 leading-relaxed"
                  >
                    {p}
                  </p>
                ))}

                {section.actionItems.length > 0 ? (
                  <div className="action-items-box bg-stone-50 p-4 rounded-xl space-y-2">
                    <strong className="text-xs font-semibold text-stone-800 uppercase tracking-wider block">
                      {labels.actionItems}
                    </strong>
                    <ul className="list-disc pl-5 text-xs text-stone-700 space-y-1">
                      {section.actionItems.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* 6. Paywall Offer (When not premium) */}
      {!isPremium && paywall ? (
        <section className="paywall-card bg-gradient-to-br from-stone-900 to-stone-950 text-white p-6 rounded-2xl space-y-4 shadow-lg">
          <div className="paywall-lock-banner flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Lock size={16} />
            <span>{labels.protectedNotice}</span>
          </div>

          <h3 className="paywall-title text-xl font-bold tracking-tight text-white">
            {paywall.headline}
          </h3>

          <ul className="paywall-features space-y-2 text-sm text-stone-300">
            {paywall.features.map((feature, i) => (
              <li key={i} className="paywall-feature-item flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="paywall-price-box border-t border-stone-800 pt-4 space-y-1">
            <div className="paywall-price-display flex items-baseline gap-2">
              <span className="paywall-price-value text-3xl font-extrabold text-white">
                {paywall.formattedPrice}
              </span>
              <span className="paywall-price-period text-xs text-stone-400">
                {labels.oneTimePayment}
              </span>
            </div>
            <p className="paywall-guarantee text-xs text-stone-400 flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>{labels.guaranteeText}</span>
            </p>
          </div>

          <div className="paywall-actions pt-2">
            <Link
              href={`/${locale}/checkout?session=${summary.sessionId}&product=${paywall.productCode}`}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm transition shadow-md"
            >
              <span>{labels.unlockCta}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      ) : null}

      {/* 7. Non-clinical Disclaimer */}
      <div className="result-disclaimer bg-stone-50 border border-stone-200/60 p-4 rounded-xl flex items-start gap-2.5 text-xs text-stone-500">
        <Info size={16} className="shrink-0 text-stone-400 mt-0.5" />
        <span>{labels.disclaimer}</span>
      </div>

      {/* 8. Footer Link */}
      <div className="result-actions text-center pt-2">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center justify-center text-sm font-medium text-stone-600 hover:text-stone-900 transition"
        >
          {labels.backHome}
        </Link>
      </div>
    </div>
  );
}
