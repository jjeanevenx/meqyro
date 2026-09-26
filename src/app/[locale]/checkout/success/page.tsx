"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Loader2,
  Sparkles,
  Share2,
  Copy,
  Check,
  Compass,
} from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";

const successTranslations: Record<
  Locale,
  {
    accessGrantedBadge: string;
    title: string;
    description: string;
    orderNumberLabel: string;
    accessReportButton: string;
    recommendedJourneyTitle: string;
    personalityMapTitle: string;
    personalityMapDesc: string;
    viewAssessmentButton: string;
    shareChallengeTitle: string;
    shareChallengeDesc: string;
    copyLinkButton: string;
    linkCopiedButton: string;
    shareText: string;
    loadingText: string;
  }
> = {
  pt: {
    accessGrantedBadge: "Acesso Concedido",
    title: "Pagamento Confirmado!",
    description:
      "Seu relatório completo foi desbloqueado com sucesso. Você já pode visualizar todas as dimensões, análises aprofundadas e recomendações práticas.",
    orderNumberLabel: "Número do Pedido:",
    accessReportButton: "Acessar Meu Relatório Completo",
    recommendedJourneyTitle: "Próxima Jornada Recomendada",
    personalityMapTitle: "Personality Map (Big Five)",
    personalityMapDesc: "Conheça seu perfil nas 5 dimensões universais da personalidade humana.",
    viewAssessmentButton: "Conhecer Avaliação",
    shareChallengeTitle: "Compartilhar Desafio",
    shareChallengeDesc:
      "Convide colegas ou amigos para realizarem a avaliação sem expor suas respostas ou pontuações pessoais.",
    copyLinkButton: "Copiar Link de Compartilhamento",
    linkCopiedButton: "Link Copiado!",
    shareText:
      "Acabei de desbloquear meu relatório analítico na Meqyro! Descubra também seus pontos fortes:",
    loadingText: "Carregando confirmação…",
  },
  en: {
    accessGrantedBadge: "Access Granted",
    title: "Payment Confirmed!",
    description:
      "Your full report has been unlocked successfully. You can now explore all dimensions, deep analytics, and actionable recommendations.",
    orderNumberLabel: "Order Reference:",
    accessReportButton: "Access My Full Report",
    recommendedJourneyTitle: "Next Recommended Journey",
    personalityMapTitle: "Personality Map (Big Five)",
    personalityMapDesc:
      "Discover your profile across the 5 universal human personality dimensions.",
    viewAssessmentButton: "Explore Assessment",
    shareChallengeTitle: "Share Assessment",
    shareChallengeDesc:
      "Invite friends or colleagues to take the assessment without exposing your personal answers or scores.",
    copyLinkButton: "Copy Share Link",
    linkCopiedButton: "Link Copied!",
    shareText: "I just unlocked my analytical report on Meqyro! Discover your strengths too:",
    loadingText: "Loading confirmation…",
  },
  es: {
    accessGrantedBadge: "Acceso Concedido",
    title: "¡Pago Confirmado!",
    description:
      "Tu informe completo ha sido desbloqueado con éxito. Ya puedes consultar todas las dimensiones, análisis en profundidad y recomendaciones prácticas.",
    orderNumberLabel: "Número de Pedido:",
    accessReportButton: "Acceder a Mi Informe Completo",
    recommendedJourneyTitle: "Siguiente Reto Recomendado",
    personalityMapTitle: "Personality Map (Big Five)",
    personalityMapDesc: "Descubre tu perfil en las 5 dimensiones universales de la personalidad.",
    viewAssessmentButton: "Conocer Evaluación",
    shareChallengeTitle: "Compartir Evaluación",
    shareChallengeDesc:
      "Invita a colegas o amigos a realizar la evaluación sin exponer tus respuestas o puntuaciones personales.",
    copyLinkButton: "Copiar Enlace de Compartir",
    linkCopiedButton: "¡Enlace Copiado!",
    shareText:
      "¡Acabo de desbloquear mi informe analítico en Meqyro! Descubre tú también tus fortalezas:",
    loadingText: "Cargando confirmación…",
  },
  fr: {
    accessGrantedBadge: "Accès Accordé",
    title: "Paiement Confirmé !",
    description:
      "Votre rapport complet a été débloqué avec succès. Vous pouvez désormais consulter l'ensemble des dimensions, analyses approfondies et pistes pratiques.",
    orderNumberLabel: "Référence de Commande :",
    accessReportButton: "Accéder à Mon Rapport Complet",
    recommendedJourneyTitle: "Prochaine Étape Recommandée",
    personalityMapTitle: "Personality Map (Big Five)",
    personalityMapDesc:
      "Découvrez votre profil selon les 5 dimensions universelles de la personnalité.",
    viewAssessmentButton: "Découvrir le Test",
    shareChallengeTitle: "Partager l'Évaluation",
    shareChallengeDesc:
      "Invitez des collègues ou proches à passer l'évaluation sans dévoiler vos réponses ou scores individuels.",
    copyLinkButton: "Copier le Lien de Partage",
    linkCopiedButton: "Lien Copié !",
    shareText:
      "Je viens de débloquer mon rapport analytique sur Meqyro ! Découvrez aussi vos forces :",
    loadingText: "Chargement de la confirmation…",
  },
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const rawParams = useParams();
  const rawLocale = Array.isArray(rawParams?.locale) ? rawParams.locale[0] : rawParams?.locale;
  const locale: Locale = typeof rawLocale === "string" && isLocale(rawLocale) ? rawLocale : "pt";
  const t = successTranslations[locale];

  const sessionId = searchParams.get("session");
  const orderNumber = searchParams.get("order");

  const [copied, setCopied] = useState(false);

  const returnUrl = sessionId
    ? `/${locale}/quizzes/brainrank/play?session=${sessionId}`
    : `/${locale}`;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}`
      : `https://meqyro.com/${locale}`;

  const handleCopy = async () => {
    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(`${t.shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="checkout-return-card">
      <div className="return-icon-wrapper return-icon--success">
        <CheckCircle2 size={48} className="text-emerald-600" />
      </div>

      <div className="return-badge">
        <Sparkles size={16} className="text-amber-600" />
        <span>{t.accessGrantedBadge}</span>
      </div>

      <h1>{t.title}</h1>
      <p className="return-description">{t.description}</p>

      {orderNumber ? (
        <div className="order-reference-box">
          <small>{t.orderNumberLabel}</small>
          <strong>{orderNumber}</strong>
        </div>
      ) : null}

      <div className="return-actions">
        <Link href={returnUrl} className="button button--primary return-cta-btn">
          <span>{t.accessReportButton}</span>
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* Cross-Sell Recommendation Card */}
      <section className="cross-sell-section mt-8 pt-6 border-t border-border">
        <div className="flex items-center gap-2 mb-2 text-forest font-semibold">
          <Compass size={20} />
          <span>{t.recommendedJourneyTitle}</span>
        </div>
        <div className="cross-sell-card bg-cream/50 p-4 rounded-xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-charcoal">{t.personalityMapTitle}</h2>
            <p className="text-xs text-charcoal/70">{t.personalityMapDesc}</p>
          </div>
          <Link
            href={`/${locale}/quizzes/personality-map`}
            className="button button--secondary text-xs px-3 py-2 whitespace-nowrap"
          >
            {t.viewAssessmentButton}
          </Link>
        </div>
      </section>

      {/* Safe Referral Share Box */}
      <section className="referral-share-box mt-6 p-4 bg-white rounded-xl border border-border">
        <div className="flex items-center gap-2 mb-2 text-charcoal font-semibold text-sm">
          <Share2 size={16} className="text-forest" />
          <span>{t.shareChallengeTitle}</span>
        </div>
        <p className="text-xs text-charcoal/70 mb-3">{t.shareChallengeDesc}</p>
        <button
          type="button"
          onClick={handleCopy}
          className="button button--secondary w-full text-xs flex items-center justify-center gap-2 py-2"
        >
          {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
          <span>{copied ? t.linkCopiedButton : t.copyLinkButton}</span>
        </button>
      </section>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="legal-page-container">
      <Suspense
        fallback={
          <div className="checkout-return-card text-center py-12">
            <Loader2 size={36} className="animate-spin text-forest mx-auto mb-4" />
            <p>Loading confirmation…</p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}
