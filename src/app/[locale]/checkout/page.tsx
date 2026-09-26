"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, CheckCircle2, Loader2, Lock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session") ?? "";
  const productCode = searchParams.get("product") ?? "BRAINRANK";

  const [customerEmail, setCustomerEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isBrainRank = productCode === "BRAINRANK";
  const productName = isBrainRank ? "Relatório Cognitivo Completo" : "Mapeamento de Personalidade Profundo";

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !customerEmail.includes("@")) {
      setError("Por favor, digite um e-mail válido para receber seu relatório.");
      return;
    }

    if (!sessionId) {
      setError("Sessão não identificada. Por favor, retorne ao teste.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          productCode,
          customerEmail,
          market: "BR",
          locale: "pt",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Erro ao iniciar pagamento.");
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        router.push(`/pt/checkout/success?session=${sessionId}&order=${data.order.orderNumber}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao processar checkout.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-shell">
      <header className="checkout-header">
        <Link href="/" className="back-link">
          <ArrowLeft size={16} />
          <span>Voltar</span>
        </Link>
        <div className="checkout-badge">
          <Lock size={16} className="text-emerald-700" />
          <span>Checkout Seguro de Alta Criptografia</span>
        </div>
      </header>

      <div className="checkout-grid">
        {/* Order Summary */}
        <section className="checkout-summary-card">
          <h2>Resumo do Pedido</h2>
          <div className="checkout-item">
            <div>
              <h3>{productName}</h3>
              <p>Acesso vitalício, análise completa e certificado digital.</p>
            </div>
            <span className="checkout-item-price">R$ 12,90</span>
          </div>

          <ul className="checkout-features">
            <li>
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Detalhamento aprofundado de todas as dimensões</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Identificação de pontos cegos sob pressão</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Plano prático de desenvolvimento</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Garantia incondicional de 7 dias com reembolso integral</span>
            </li>
          </ul>

          <div className="checkout-total-row">
            <span>Total a pagar:</span>
            <span className="checkout-total-val">R$ 12,90</span>
          </div>
        </section>

        {/* Payment Action Form */}
        <section className="checkout-form-card">
          <h2>Dados de Envio e Acesso</h2>
          <p className="checkout-form-intro">
            Seu relatório e as chaves de acesso permanente serão associados a este e-mail.
          </p>

          <form onSubmit={handlePay} className="checkout-form">
            {error ? (
              <div className="lead-capture-error" role="alert">
                <span>{error}</span>
              </div>
            ) : null}

            <div className="form-group">
              <Input
                id="checkout-email"
                label="Seu e-mail principal"
                type="email"
                required
                placeholder="seu@email.com"
                value={customerEmail}
                onChange={(e) => setEmailValue(e.target.value)}
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>

            <div className="checkout-payment-methods">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Métodos aceitos
              </span>
              <div className="payment-badges">
                <span className="badge">PIX (Aprovação Instantânea)</span>
                <span className="badge">Cartão de Crédito</span>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="checkout-pay-btn button--primary">
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Preparando pagamento seguro…</span>
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  <span>Prosseguir para o Pagamento</span>
                </>
              )}
            </Button>

            <div className="checkout-trust-footer">
              <ShieldCheck size={16} className="text-emerald-700" />
              <small>Transação protegida por criptografia de ponta a ponta.</small>
            </div>
          </form>
        </section>
      </div>
    </div>
  );

  function setEmailValue(val: string) {
    setCustomerEmail(val);
  }
}

export default function CheckoutPage() {
  return (
    <main className="legal-page-container">
      <Suspense
        fallback={
          <div className="checkout-shell text-center py-12">
            <Loader2 size={36} className="animate-spin text-forest mx-auto mb-4" />
            <p>Carregando checkout seguro…</p>
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
    </main>
  );
}
