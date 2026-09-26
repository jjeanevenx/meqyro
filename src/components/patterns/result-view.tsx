"use client";

import Link from "next/link";
import { CheckCircle2, Lock, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import type { PartialResultSummary } from "@/features/quiz-engine/contracts";
import type { PaywallOffer, ComprehensiveReport, AccessLevel } from "@/features/results/contracts";

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
  const isBrainRank = summary.quizSlug === "brainrank";

  return (
    <div className="result-preview-card">
      {/* 1. Header Badge */}
      <div className="result-badge">
        {isPremium ? (
          <>
            <Sparkles size={20} className="text-amber-500" />
            <span className="font-semibold text-amber-700">Relatório Completo Desbloqueado</span>
          </>
        ) : (
          <>
            <CheckCircle2 size={20} className="text-emerald-600" />
            <span>Resultado Gratuito</span>
          </>
        )}
      </div>

      <h1 className="result-title">
        {isBrainRank ? "Seu BrainRank" : "Seu Perfil de Personalidade"}
      </h1>

      {/* 2. Score Hero (BrainRank) */}
      {summary.overallScore !== undefined ? (
        <div className="score-hero">
          <span className="score-hero__number">{summary.overallScore}</span>
          <span className="score-hero__total">/ 1000</span>
        </div>
      ) : null}

      {/* 3. Strongest Dimension Highlight */}
      {summary.strongestDimensionLabel ? (
        <div className="strength-highlight">
          <small>PONTO MAIS FORTE</small>
          <h2>{summary.strongestDimensionLabel}</h2>
          {summary.strongestDimensionDescription ? (
            <p>{summary.strongestDimensionDescription}</p>
          ) : null}
        </div>
      ) : null}

      {/* 4. Dimension Breakdown */}
      {summary.dimensionScores ? (
        <div className="dimension-breakdown">
          <h3>Visão das Dimensões</h3>
          <div className="dimension-list">
            {Object.entries(summary.dimensionScores).map(([key, val]) => (
              <div key={key} className="dimension-row">
                <span className="dimension-row__name">{key.replace(/_/g, " ")}</span>
                <span className="dimension-row__val">{val}%</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* 5. Premium Unlocked Content */}
      {isPremium && premiumReport ? (
        <section className="premium-report-content">
          <div className="premium-summary-card">
            <h3>Síntese Executiva</h3>
            <p>{premiumReport.executiveSummary}</p>
            <div className="benchmark-pill">
              <span>Percentil {premiumReport.percentileRank}%</span>
              <small>({premiumReport.comparativeBenchmark.cohort})</small>
            </div>
          </div>

          <div className="premium-sections">
            {premiumReport.sections.map((section) => (
              <div key={section.id} className="premium-section-card">
                <h4>{section.title}</h4>
                <p className="premium-section-summary">{section.summary}</p>

                {section.paragraphs.map((p, idx) => (
                  <p key={idx} className="premium-section-para">{p}</p>
                ))}

                {section.actionItems.length > 0 ? (
                  <div className="action-items-box">
                    <strong>Recomendações Práticas:</strong>
                    <ul>
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

      {/* 6. Paywall Teaser & Offer (When not premium) */}
      {!isPremium && paywall ? (
        <section className="paywall-card">
          <div className="paywall-lock-banner">
            <Lock size={20} className="text-amber-600" />
            <span>Conteúdo Aprofundado Protegido</span>
          </div>

          <h3 className="paywall-title">{paywall.headline}</h3>

          <ul className="paywall-features">
            {paywall.features.map((feature, i) => (
              <li key={i} className="paywall-feature-item">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="paywall-price-box">
            <div className="paywall-price-display">
              <span className="paywall-price-value">{paywall.formattedPrice}</span>
              <span className="paywall-price-period">pagamento único</span>
            </div>
            <p className="paywall-guarantee">
              <ShieldCheck size={14} className="inline mr-1 text-emerald-700" />
              Acesso vitalício imediato · Garantia incondicional de 7 dias
            </p>
          </div>

          <div className="paywall-actions">
            <Link
              href={`/${locale}/checkout?session=${summary.sessionId}&product=${paywall.productCode}`}
              className="paywall-cta-btn button button--primary"
            >
              <span>Desbloquear Relatório Completo</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      ) : null}

      {/* 7. Footer Back Link */}
      <div className="result-actions">
        <Link href={`/${locale}`} className="button button--secondary">
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}
