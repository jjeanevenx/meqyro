"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Loader2, RefreshCw, XCircle } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";

type OrderStatus = {
  id: string;
  orderNumber: string;
  sessionId: string;
  status: string;
};

type ViewState = "confirming" | "pending" | "confirmed" | "error";

const copy: Record<
  Locale,
  {
    confirming: string;
    pending: string;
    pendingBody: string;
    confirmed: string;
    confirmedBody: string;
    error: string;
    retry: string;
    view: string;
    order: string;
  }
> = {
  pt: {
    confirming: "Confirmando seu pagamento…",
    pending: "Pagamento em confirmação",
    pendingBody:
      "A confirmação ainda não chegou. Você não precisa pagar novamente; esta página continuará consultando o status real do provedor.",
    confirmed: "Pagamento confirmado!",
    confirmedBody: "Seu acesso foi liberado e o relatório completo já está disponível.",
    error: "Não foi possível confirmar o pagamento agora.",
    retry: "Verificar novamente",
    view: "Ver relatório completo",
    order: "Pedido",
  },
  en: {
    confirming: "Confirming your payment…",
    pending: "Payment confirmation pending",
    pendingBody:
      "Confirmation has not arrived yet. You do not need to pay again; this page checks the provider's real status.",
    confirmed: "Payment confirmed!",
    confirmedBody: "Access has been granted and your full report is ready.",
    error: "We could not confirm the payment right now.",
    retry: "Check again",
    view: "View full report",
    order: "Order",
  },
  es: {
    confirming: "Confirmando tu pago…",
    pending: "Pago pendiente de confirmación",
    pendingBody:
      "La confirmación aún no ha llegado. No necesitas pagar otra vez; esta página consulta el estado real del proveedor.",
    confirmed: "¡Pago confirmado!",
    confirmedBody: "El acceso fue concedido y tu informe completo ya está disponible.",
    error: "No pudimos confirmar el pago ahora.",
    retry: "Verificar de nuevo",
    view: "Ver informe completo",
    order: "Pedido",
  },
  fr: {
    confirming: "Confirmation de votre paiement…",
    pending: "Paiement en attente de confirmation",
    pendingBody:
      "La confirmation n'est pas encore arrivée. Ne payez pas une seconde fois ; cette page vérifie le statut réel du prestataire.",
    confirmed: "Paiement confirmé !",
    confirmedBody: "L'accès est accordé et votre rapport complet est disponible.",
    error: "Impossible de confirmer le paiement pour le moment.",
    retry: "Vérifier à nouveau",
    view: "Voir le rapport complet",
    order: "Commande",
  },
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const rawParams = useParams();
  const rawLocale = Array.isArray(rawParams?.locale) ? rawParams.locale[0] : rawParams?.locale;
  const locale: Locale = typeof rawLocale === "string" && isLocale(rawLocale) ? rawLocale : "pt";
  const t = copy[locale];
  const orderId = searchParams.get("order") ?? "";
  const lookupToken = searchParams.get("token") ?? "";
  const transactionNsu = searchParams.get("transaction_nsu") ?? undefined;
  const [state, setState] = useState<ViewState>("confirming");
  const [order, setOrder] = useState<OrderStatus | null>(null);

  const statusUrl = useMemo(
    () => `/api/orders/${encodeURIComponent(orderId)}?token=${encodeURIComponent(lookupToken)}`,
    [lookupToken, orderId],
  );

  async function checkStatus() {
    if (!orderId || !lookupToken) {
      setState("error");
      return false;
    }

    try {
      const response = await fetch(statusUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reconcile", transactionNsu }),
        cache: "no-store",
      });
      const data = (await response.json()) as { order?: OrderStatus; error?: string };
      if (!response.ok || !data.order) throw new Error(data.error ?? "Status request failed");
      setOrder(data.order);

      if (data.order.status === "FULFILLED") {
        setState("confirmed");
        return true;
      }
      if (["FAILED", "CANCELLED", "EXPIRED", "REFUNDED"].includes(data.order.status)) {
        setState("error");
        return true;
      }
      setState("pending");
      return false;
    } catch {
      setState("error");
      return true;
    }
  }

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;

    const poll = async () => {
      if (cancelled) return;
      const terminal = await checkStatus();
      attempts += 1;
      if (!terminal && attempts < 8 && !cancelled) timer = setTimeout(poll, 2500);
    };
    void poll();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
    // The provider redirect parameters are immutable for this page load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusUrl, transactionNsu]);

  const resultUrl = order?.sessionId
    ? `/${locale}/quizzes/brainrank/result?session=${encodeURIComponent(order.sessionId)}`
    : `/${locale}`;

  return (
    <div className="checkout-return-card">
      <div
        className={`return-icon-wrapper return-icon--${state === "confirmed" ? "success" : "pending"}`}
      >
        {state === "confirming" ? <Loader2 size={48} className="animate-spin text-forest" /> : null}
        {state === "pending" ? <Clock size={48} className="text-amber-600" /> : null}
        {state === "confirmed" ? <CheckCircle2 size={48} className="text-emerald-600" /> : null}
        {state === "error" ? <XCircle size={48} className="text-rose-600" /> : null}
      </div>

      <h1>
        {state === "confirming"
          ? t.confirming
          : state === "pending"
            ? t.pending
            : state === "confirmed"
              ? t.confirmed
              : t.error}
      </h1>
      {state === "pending" ? <p className="return-description">{t.pendingBody}</p> : null}
      {state === "confirmed" ? <p className="return-description">{t.confirmedBody}</p> : null}

      {order?.orderNumber ? (
        <div className="order-reference-box">
          <small>{t.order}</small>
          <strong>{order.orderNumber}</strong>
        </div>
      ) : null}

      <div className="return-actions flex flex-col gap-3">
        {state === "confirmed" ? (
          <Link href={resultUrl} className="button button--primary return-cta-btn">
            <span>{t.view}</span>
            <ArrowRight size={18} />
          </Link>
        ) : null}
        {state === "pending" || state === "error" ? (
          <button
            type="button"
            onClick={() => {
              setState("confirming");
              void checkStatus();
            }}
            className="button button--secondary"
          >
            <RefreshCw size={18} />
            <span>{t.retry}</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main className="legal-page-container">
      <Suspense fallback={<div className="checkout-return-card">Confirming payment…</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
