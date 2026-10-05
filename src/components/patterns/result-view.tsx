"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Lock, Sparkles, ArrowRight, ShieldCheck, Info, Loader2 } from "lucide-react";
import type { PartialResultSummary } from "@/features/quiz-engine/contracts";
import type { PaywallOffer, ComprehensiveReport, AccessLevel } from "@/features/results/contracts";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { getDimensionLabel } from "@/lib/i18n/dimension-labels";
import { CoupleResultPanel } from "./couple-result-panel";
import type { ProtectedResultResponse } from "@/features/results/contracts";

type ResultViewProps = {
  summary: PartialResultSummary;
  accessLevel: AccessLevel;
  paywall?: PaywallOffer;
  premiumReport?: ComprehensiveReport;
  couple?: ProtectedResultResponse["couple"];
  includedQuizzes?: string[];
  locale: string;
  ctaVariant?: "unlock_report" | "complete_analysis";
};

export function ResultView({
  summary,
  accessLevel,
  paywall,
  premiumReport,
  couple,
  includedQuizzes,
  locale,
  ctaVariant = "unlock_report",
}: ResultViewProps) {
  const isPremium = accessLevel === "PREMIUM_UNLOCKED";
  const safeLocale: Locale = locale === "en" || locale === "es" || locale === "fr" ? locale : "pt";
  const dict = getDictionary(safeLocale);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const offerViewedRef = useRef(false);

  useEffect(() => {
    if (!isPremium && paywall && !offerViewedRef.current) {
      offerViewedRef.current = true;
      fetch("/api/analytics/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: "premium_offer_viewed",
          sessionId: summary.sessionId,
          quizSlug: summary.quizSlug,
          locale: safeLocale,
          market: paywall.market,
          properties: {
            assessment_id: summary.sessionId,
            product_id: paywall.productCode,
            currency: paywall.currency,
            market: paywall.market,
          },
        }),
      }).catch(() => {});
    }
  }, [isPremium, paywall, summary.sessionId, summary.quizSlug, safeLocale]);

  const handleCheckoutClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isLoading || isPremium || !paywall) return;

    setIsLoading(true);
    const checkoutUrl = `/${safeLocale}/checkout?session=${summary.sessionId}&product=${paywall.productCode}`;

    try {
      await Promise.allSettled([
        fetch("/api/analytics/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventName: "premium_cta_clicked",
            sessionId: summary.sessionId,
            quizSlug: summary.quizSlug,
            locale: safeLocale,
            market: paywall.market,
            properties: {
              assessment_id: summary.sessionId,
              product_id: paywall.productCode,
              currency: paywall.currency,
              market: paywall.market,
            },
          }),
          keepalive: true,
        }),
        fetch("/api/analytics/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventName: "checkout_started",
            sessionId: summary.sessionId,
            quizSlug: summary.quizSlug,
            locale: safeLocale,
            market: paywall.market,
            properties: {
              assessment_id: summary.sessionId,
              product_id: paywall.productCode,
              currency: paywall.currency,
              market: paywall.market,
            },
          }),
          keepalive: true,
        }),
      ]);
    } catch {
      // Non-blocking navigation
    }

    router.push(checkoutUrl);
  };

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
      pt: "Relatório Analítico Completo",
      en: "Comprehensive Analytical Report",
      es: "Informe Analítico Completo",
      fr: "Rapport Analytique Complet",
    }[safeLocale],
    oneTimePayment: dict.resultView.oneTimePayment,
    instantAccess:
      summary.quizSlug === "coupledna"
        ? dict.coupleFlow.accessConditions
        : dict.resultView.instantAccess,
    moneyBackGuarantee: dict.resultView.moneyBackGuarantee,
    securePayment: dict.resultView.securePayment,
    unlockCta:
      ctaVariant === "complete_analysis"
        ? dict.resultView.unlockCompleteAnalysis
        : dict.resultView.unlockPremium,
    viewUnlockedReport: dict.resultView.viewUnlockedReport,
    preparingCheckout: dict.resultView.preparingCheckout,
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
      {summary.quizSlug === "coupledna" ? (
        <CoupleResultPanel
          sessionId={summary.sessionId}
          locale={safeLocale}
          initialState={couple}
          paid={isPremium}
        />
      ) : null}
      {includedQuizzes && includedQuizzes.length > 1 ? (
        <section className="rounded-2xl border border-stone-200 p-5 space-y-3">
          <h2 className="font-semibold">{dict.includedPurchasesTitle}</h2>
          <div className="flex flex-wrap gap-3">
            {includedQuizzes.map((slug) => (
              <Link className="underline" key={slug} href={`/${safeLocale}/quizzes/${slug}/play`}>
                {dict.quizzes[slug]?.name ?? slug}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

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
            {getDimensionLabel(summary.strongestDimension, safeLocale)}
          </h2>
          {summary.strongestDimensionDescription ? (
            <p className="text-sm text-stone-600">{summary.strongestDimensionDescription}</p>
          ) : null}
        </div>
      ) : null}

      {/* 4. Quick Jump for Already-Unlocked Premium Users */}
      {isPremium && premiumReport ? (
        <div className="pt-2">
          <a href="#premium-report" className="paywall-cta-btn">
            <span>{labels.viewUnlockedReport}</span>
            <ArrowRight size={20} aria-hidden="true" />
          </a>
        </div>
      ) : null}

      {/* 5. Dimension Breakdown */}
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
                  {getDimensionLabel(key, safeLocale)}
                </span>
                <span className="dimension-row__val font-mono font-medium text-stone-900">
                  {val}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* 6. Premium Unlocked Content (When user already purchased) */}
      {isPremium && premiumReport ? (
        <section
          id="premium-report"
          className="premium-report-content space-y-6 pt-4 border-t border-stone-200"
        >
          <div className="premium-summary-card bg-amber-50/50 border border-amber-200/60 p-5 rounded-2xl space-y-2">
            <a
              href={`/api/sessions/${summary.sessionId}/report?locale=${safeLocale}`}
              className="button button--primary"
              download
            >
              {safeLocale === "pt"
                ? "Baixar resultado completo"
                : safeLocale === "es"
                  ? "Descargar resultado completo"
                  : safeLocale === "fr"
                    ? "Télécharger le résultat complet"
                    : "Download full result"}
            </a>
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

      {/* 7. Paywall Offer (When not premium): Dominant, High-Trust, Clear Conversion Block */}
      {!isPremium && paywall ? (
        <section className="paywall-card" aria-label="Premium Report Offer">
          {/* Kicker Badge */}
          <div className="paywall-lock-banner">
            <Lock size={14} aria-hidden="true" />
            <span>{labels.protectedNotice}</span>
          </div>

          {/* Offer Title */}
          <h2 className="paywall-title">{paywall.headline}</h2>

          {/* 6 Concrete Benefits */}
          <ul className="paywall-features">
            {paywall.features.map((feature, i) => (
              <li key={i} className="paywall-feature-item">
                <CheckCircle2 size={18} className="paywall-feature-icon" aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Unified Decision Box: Price + Trust Points + Dominant CTA */}
          <div className="paywall-decision-box">
            {/* Price Header */}
            <div className="paywall-price-header">
              <div className="paywall-price-row">
                <span className="paywall-price-val">{paywall.formattedPrice}</span>
                <span className="paywall-price-tag">{labels.oneTimePayment}</span>
              </div>
            </div>

            {/* Decision Trust Indicators */}
            <div className="paywall-trust-pills">
              <span className="paywall-trust-pill">
                <CheckCircle2 size={15} aria-hidden="true" />
                {labels.instantAccess}
              </span>
              <span className="paywall-trust-pill">
                <ShieldCheck size={16} aria-hidden="true" />
                {labels.moneyBackGuarantee}
              </span>
            </div>

            {/* Dominant Primary CTA */}
            <button
              type="button"
              onClick={handleCheckoutClick}
              disabled={isLoading}
              aria-busy={isLoading}
              className="paywall-cta-btn"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                  <span>{labels.preparingCheckout}</span>
                </>
              ) : (
                <>
                  <span>{labels.unlockCta}</span>
                  <ArrowRight size={20} aria-hidden="true" />
                </>
              )}
            </button>

            {/* Security Footnote */}
            <div className="paywall-security-footer">
              <Lock size={13} aria-hidden="true" />
              <span>{labels.securePayment}</span>
            </div>
          </div>
        </section>
      ) : null}

      {/* 8. Non-clinical Disclaimer (Clean visual separation: 32px spacing, full legibility) */}
      <div className="result-disclaimer-wrapper">
        <div className="result-disclaimer">
          <Info size={18} className="shrink-0 text-stone-400 mt-0.5" aria-hidden="true" />
          <span>{labels.disclaimer}</span>
        </div>
      </div>

      {/* 9. Footer Back Link */}
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
