"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Clock, ArrowRight, Loader2, RefreshCw } from "lucide-react";

function PendingContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const orderNumber = searchParams.get("order");

  const returnUrl = sessionId
    ? `/pt/quizzes/brainrank/play?session=${sessionId}`
    : "/pt";

  return (
    <div className="checkout-return-card">
      <div className="return-icon-wrapper return-icon--pending">
        <Clock size={48} className="text-amber-600" />
      </div>

      <h1>Aguardando Confirmação do Pagamento</h1>
      <p className="return-description">
        Identificamos seu pedido. Caso tenha optado por PIX, o processamento costuma ocorrer em poucos segundos. Assim que o pagamento for confirmado pelo banco, seu relatório será desbloqueado automaticamente.
      </p>

      {orderNumber ? (
        <div className="order-reference-box">
          <small>Número do Pedido:</small>
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
          <span>Verificar se já foi aprovado</span>
        </button>

        <Link href={returnUrl} className="button button--secondary">
          <span>Voltar ao Meu Teste</span>
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
            <p>Carregando status do pagamento…</p>
          </div>
        }
      >
        <PendingContent />
      </Suspense>
    </main>
  );
}
