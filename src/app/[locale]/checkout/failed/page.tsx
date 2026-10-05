"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RefreshCw, Loader2, ArrowLeft } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";

const failedTranslations: Record<
  Locale,
  {
    title: string;
    description: string;
    orderReferenceLabel: string;
    tryAgainButton: string;
    backToHomeButton: string;
    loadingText: string;
  }
> = {
  pt: {
    title: "Pagamento não Concluído",
    description:
      "A transação não pôde ser processada ou foi cancelada pela instituição financeira. Nenhuma cobrança foi efetuada no seu cartão ou conta.",
    orderReferenceLabel: "Referência do Pedido:",
    tryAgainButton: "Tentar Novamente",
    backToHomeButton: "Voltar ao Início",
    loadingText: "Carregando status…",
  },
  en: {
    title: "Payment Not Completed",
    description:
      "The transaction could not be processed or was cancelled by the card issuer. No charges have been made to your account.",
    orderReferenceLabel: "Order Reference:",
    tryAgainButton: "Try Again",
    backToHomeButton: "Return to Home",
    loadingText: "Loading status…",
  },
  es: {
    title: "Pago no Completado",
    description:
      "La transacción no pudo completarse o fue cancelada por la entidad emisora. No se ha aplicado ningún cargo en tu cuenta.",
    orderReferenceLabel: "Referencia del Pedido:",
    tryAgainButton: "Reintentar Pago",
    backToHomeButton: "Volver al Inicio",
    loadingText: "Cargando estado…",
  },
  fr: {
    title: "Paiement Non Abouti",
    description:
      "La transaction n'a pas pu aboutir ou a été interrompue. Aucun montant n'a été prélevé sur votre compte bancaire.",
    orderReferenceLabel: "Référence de Commande :",
    tryAgainButton: "Réessayer le Paiement",
    backToHomeButton: "Retour à l'Accueil",
    loadingText: "Chargement du statut…",
  },
};

function FailedContent() {
  const searchParams = useSearchParams();
  const rawParams = useParams();
  const rawLocale = Array.isArray(rawParams?.locale) ? rawParams.locale[0] : rawParams?.locale;
  const locale: Locale = typeof rawLocale === "string" && isLocale(rawLocale) ? rawLocale : "pt";
  const t = failedTranslations[locale];

  const orderId = searchParams.get("order");
  const lookupToken = searchParams.get("token");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || !lookupToken) return;
    const cancelOrder = async () => {
      const response = await fetch(
        `/api/orders/${encodeURIComponent(orderId)}?token=${encodeURIComponent(lookupToken)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "cancel" }),
          cache: "no-store",
        },
      );
      if (!response.ok) return;
      const data = (await response.json()) as {
        order?: { sessionId?: string; orderNumber?: string };
      };
      setSessionId(data.order?.sessionId ?? null);
      setOrderNumber(data.order?.orderNumber ?? null);
    };
    void cancelOrder();
  }, [lookupToken, orderId]);

  const retryUrl = sessionId
    ? `/${locale}/checkout?session=${encodeURIComponent(sessionId)}&product=BRAINRANK`
    : `/${locale}`;
  const resultUrl = sessionId
    ? `/${locale}/quizzes/brainrank/result?session=${encodeURIComponent(sessionId)}`
    : `/${locale}`;

  return (
    <div className="checkout-return-card">
      <div className="return-icon-wrapper return-icon--failed">
        <XCircle size={48} className="text-rose-600" />
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
        <Link href={retryUrl} className="button button--primary return-cta-btn">
          <RefreshCw size={18} />
          <span>{t.tryAgainButton}</span>
        </Link>

        <Link href={resultUrl} className="button button--secondary">
          <ArrowLeft size={18} />
          <span>{t.backToHomeButton}</span>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutFailedPage() {
  return (
    <main className="legal-page-container">
      <Suspense
        fallback={
          <div className="checkout-return-card text-center py-12">
            <Loader2 size={36} className="animate-spin text-forest mx-auto mb-4" />
            <p>Loading status…</p>
          </div>
        }
      >
        <FailedContent />
      </Suspense>
    </main>
  );
}
