"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Loader2, Sparkles, Share2, Copy, Check, Compass } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const orderNumber = searchParams.get("order");

  const [copied, setCopied] = useState(false);

  const returnUrl = sessionId
    ? `/pt/quizzes/brainrank/play?session=${sessionId}`
    : "/pt";

  const shareText = "Acabei de desbloquear meu relatório analítico na Meqyro! Descubra também seus pontos fortes:";
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/pt` : "https://meqyro.com/pt";

  const handleCopy = async () => {
    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
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
        <span>Acesso Concedido</span>
      </div>

      <h1>Pagamento Confirmado!</h1>
      <p className="return-description">
        Seu relatório completo foi desbloqueado com sucesso. Você já pode visualizar todas as dimensões, análises aprofundadas e recomendações práticas.
      </p>

      {orderNumber ? (
        <div className="order-reference-box">
          <small>Número do Pedido:</small>
          <strong>{orderNumber}</strong>
        </div>
      ) : null}

      <div className="return-actions">
        <Link href={returnUrl} className="button button--primary return-cta-btn">
          <span>Acessar Meu Relatório Completo</span>
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* Cross-Sell Recommendation Card */}
      <section className="cross-sell-section mt-8 pt-6 border-t border-border">
        <div className="flex items-center gap-2 mb-2 text-forest font-semibold">
          <Compass size={20} />
          <span>Próxima Jornada Recomendada</span>
        </div>
        <div className="cross-sell-card bg-cream/50 p-4 rounded-xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-charcoal">Personality Map (Big Five)</h2>
            <p className="text-xs text-charcoal/70">
              Conheça seu perfil nas 5 dimensões universais da personalidade.
            </p>
          </div>
          <Link
            href="/pt/quizzes/personality-map"
            className="button button--secondary text-xs px-3 py-2 whitespace-nowrap"
          >
            Conhecer Avaliação
          </Link>
        </div>
      </section>

      {/* Safe Referral Share Box */}
      <section className="referral-share-box mt-6 p-4 bg-white rounded-xl border border-border">
        <div className="flex items-center gap-2 mb-2 text-charcoal font-semibold text-sm">
          <Share2 size={16} className="text-forest" />
          <span>Compartilhar Desafio</span>
        </div>
        <p className="text-xs text-charcoal/70 mb-3">
          Convide colegas ou amigos para realizarem a avaliação sem expor suas respostas ou pontuações pessoais.
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="button button--secondary w-full text-xs flex items-center justify-center gap-2 py-2"
        >
          {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
          <span>{copied ? "Link Copiado!" : "Copiar Link de Compartilhamento"}</span>
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
            <p>Carregando confirmação…</p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}
