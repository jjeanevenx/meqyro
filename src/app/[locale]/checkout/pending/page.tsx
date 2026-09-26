"use client";

import { Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { Clock, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";

const pendingTranslations: Record<
  Locale,
  {
    title: string;
    description: string;
    orderReferenceLabel: string;
    checkStatusButton: string;
    returnToQuizButton: string;
    loadingText: string;
  }
> = {
  pt: {
    title: "Aguardando Confirmação do Pagamento",
    description:
      "Identificamos seu pedido. Caso tenha optado por PIX, o processamento costuma ocorrer em poucos segundos. Assim que o pagamento for confirmado pela instituição financeira, seu relatório será desbloqueado automaticamente.",
    orderReferenceLabel: "Número do Pedido:",
    checkStatusButton: "Verificar se já foi aprovado",
    returnToQuizButton: "Voltar ao Meu Teste",
    loadingText: "Carregando status do pagamento…",
  },
  en: {
    title: "Awaiting Payment Confirmation",
    description:
      "We received your order. If you paid via card or local transfer, processing usually takes a few moments. Once the transaction is cleared, your report will unlock automatically.",
    orderReferenceLabel: "Order Reference:",
    checkStatusButton: "Check Approval Status",
    returnToQuizButton: "Return to My Assessment",
    loadingText: "Loading payment status…",
  },
  es: {
    title: "Esperando Confirmación del Pago",
    description:
      "Hemos identificado tu pedido. En cuanto la entidad financiera confirme el pago, tu informe completo se desbloqueará de forma automática.",
    orderReferenceLabel: "Número de Pedido:",
    checkStatusButton: "Verificar Aprobación",
    returnToQuizButton: "Volver a Mi Test",
    loadingText: "Cargando estado del pago…",
  },
  fr: {
    title: "En Attente de Confirmation de Paiement",
    description:
      "Nous avons bien enregistré votre commande. Dès validation du paiement par l'organisme bancaire, votre rapport sera accessible sans délai.",
    orderReferenceLabel: "Référence de Commande :",
    checkStatusButton: "Vérifier le Statut",
    returnToQuizButton: "Retourner à Mon Test",
    loadingText: "Chargement du statut de paiement…",
  },
};

function PendingContent() {
  const searchParams = useSearchParams();
  const rawParams = useParams();
  const rawLocale = Array.isArray(rawParams?.locale) ? rawParams.locale[0] : rawParams?.locale;
  const locale: Locale = typeof rawLocale === "string" && isLocale(rawLocale) ? rawLocale : "pt";
  const t = pendingTranslations[locale];

  const sessionId = searchParams.get("session");
  const orderNumber = searchParams.get("order");

  const returnUrl = sessionId
    ? `/${locale}/quizzes/brainrank/play?session=${sessionId}`
    : `/${locale}`;

  return (
    <div className="checkout-return-card">
      <div className="return-icon-wrapper return-icon--pending">
        <Clock size={48} className="text-amber-600" />
      </div>

      <h1>{t.title}</h1>
      <p className="return-description">{t.description}</p>

      {orderNumber ? (
        <div className="order-reference-box">
          <small>{t.orderReferenceLabel}</small>
          <strong>{orderNumber}</strong>
        </div>
      ) : null}

      <div className="return-actions flex flex-col gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="button button--primary return-cta-btn"
        >
          <RefreshCw size={18} />
          <span>{t.checkStatusButton}</span>
        </button>

        <Link href={returnUrl} className="button button--secondary">
          <span>{t.returnToQuizButton}</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutPendingPage() {
  return (
    <main className="legal-page-container">
      <Suspense
        fallback={
          <div className="checkout-return-card text-center py-12">
            <Loader2 size={36} className="animate-spin text-forest mx-auto mb-4" />
            <p>Loading payment status…</p>
          </div>
        }
      >
        <PendingContent />
      </Suspense>
    </main>
  );
}
