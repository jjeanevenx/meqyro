"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RefreshCw, Loader2 } from "lucide-react";

function FailedContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const orderNumber = searchParams.get("order");

  const retryUrl = sessionId
    ? `/pt/checkout?session=${sessionId}`
    : "/pt";

  return (
    <div className="checkout-return-card">
      <div className="return-icon-wrapper return-icon--failed">
        <XCircle size={48} className="text-rose-600" />
      </div>

      <h1>Pagamento não Concluído</h1>
      <p className="return-description">
        A transação não pôde ser processada ou foi cancelada pela instituição financeira. Nenhuma cobrança foi efetuada no seu cartão ou conta.
      </p>

      {orderNumber ? (
        <div className="order-reference-box">
          <small>Referência do Pedido:</small>
          <strong>{orderNumber}</strong>
        </div>
      ) : null}

      <div className="return-actions flex flex-col gap-3">
        <Link href={retryUrl} className="button button--primary return-cta-btn">
          <RefreshCw size={18} />
          <span>Tentar Novamente</span>
        </Link>

        <Link href="/" className="button button--secondary">
          <span>Voltar ao Início</span>
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
            <p>Carregando status…</p>
          </div>
        }
      >
        <FailedContent />
      </Suspense>
    </main>
  );
}
