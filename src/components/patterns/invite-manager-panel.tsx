"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, PlusCircle, Sparkles, Users } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { ComprehensiveReport } from "@/features/results/contracts";
import { InviteLinkCard } from "./invite-link-card";

type HostSlotItem = {
  id: string;
  slotNumber: number;
  hostNameForGuest: string | null;
  inviteCode: string | null;
  inviteUrl: string | null;
  status: string;
  comparisonState: string;
  priceAmount: number;
  priceCurrency: string;
};

type NextPriceInfo = {
  amount: number;
  currency: string;
  formattedPrice: string;
  slotNumber: number;
  isDiscounted: boolean;
  limitReached: boolean;
  maxInvites: number;
};

type ComparisonPayload = {
  slotId: string;
  slotNumber: number;
  guestLabel: string | null;
  state: string;
  report?: ComprehensiveReport;
};

const panelCopy: Record<
  Locale,
  {
    sectionTitle: string;
    sectionSubtitle: string;
    firstPriceBadge: string;
    discountedPriceBadge: string;
    guestNameLabel: string;
    guestNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    buyInviteBtn: string;
    buyingInviteBtn: string;
    limitReachedText: string;
    pendingPaymentNote: string;
    viewComparisonBtn: string;
    hideComparisonBtn: string;
    guestFallback: string;
    purchaseError: string;
  }
> = {
  pt: {
    sectionTitle: "Convites Individuais & Múltiplos Convidados",
    sectionSubtitle:
      "Convide diferentes pessoas para comparar resultados de forma isolada e confidencial. Cada link é liberado somente após a confirmação do pagamento no Stripe.",
    firstPriceBadge: "1º convite pelo preço-base (inclui seu relatório completo)",
    discountedPriceBadge: "Convite adicional por 1/3 do preço-base",
    guestNameLabel: "Identificação do convidado (opcional, visível apenas para você)",
    guestNamePlaceholder: "Ex.: Parceiro(a), Convidado 2",
    emailLabel: "Seu e-mail para confirmação do pedido",
    emailPlaceholder: "seu@email.com",
    buyInviteBtn: "Comprar convite pelo Stripe",
    buyingInviteBtn: "Iniciando Stripe Checkout…",
    limitReachedText: "Limite máximo de convites atingido para esta avaliação.",
    pendingPaymentNote: "Aguardando confirmação do pagamento pelo Stripe para liberar o link.",
    viewComparisonBtn: "Ver comparação deste par",
    hideComparisonBtn: "Ocultar comparação",
    guestFallback: "Convidado",
    purchaseError: "Não foi possível iniciar a compra do convite. Verifique o e-mail informado.",
  },
  en: {
    sectionTitle: "Individual Invitations & Multiple Guests",
    sectionSubtitle:
      "Invite multiple people to compare results privately and independently. Each link is generated only after Stripe payment confirmation.",
    firstPriceBadge: "1st invite at base price (includes your full report)",
    discountedPriceBadge: "Additional invite at 1/3 of base price",
    guestNameLabel: "Guest label (optional, visible only to you)",
    guestNamePlaceholder: "e.g., Partner, Guest 2",
    emailLabel: "Your email for order confirmation",
    emailPlaceholder: "your@email.com",
    buyInviteBtn: "Buy invitation via Stripe",
    buyingInviteBtn: "Starting Stripe Checkout…",
    limitReachedText: "Maximum number of invitations reached for this assessment.",
    pendingPaymentNote: "Waiting for Stripe payment confirmation to unlock the invitation link.",
    viewComparisonBtn: "View pair comparison",
    hideComparisonBtn: "Hide comparison",
    guestFallback: "Guest",
    purchaseError: "Unable to start invitation purchase. Please check your email address.",
  },
  es: {
    sectionTitle: "Invitaciones Individuales y Múltiples Invitados",
    sectionSubtitle:
      "Invita a varias personas para comparar resultados de forma aislada y confidencial. Cada enlace se genera solo tras confirmar el pago en Stripe.",
    firstPriceBadge: "1.ª invitación al precio base (incluye tu informe completo)",
    discountedPriceBadge: "Invitación adicional por 1/3 del precio base",
    guestNameLabel: "Identificación del invitado (opcional, visible solo para ti)",
    guestNamePlaceholder: "Ej.: Pareja, Invitado 2",
    emailLabel: "Tu correo para confirmación del pedido",
    emailPlaceholder: "tu@email.com",
    buyInviteBtn: "Comprar invitación con Stripe",
    buyingInviteBtn: "Iniciando Stripe Checkout…",
    limitReachedText: "Se alcanzó el límite máximo de invitaciones para esta evaluación.",
    pendingPaymentNote: "Esperando confirmación del pago en Stripe para activar el enlace.",
    viewComparisonBtn: "Ver comparación de este par",
    hideComparisonBtn: "Ocultar comparación",
    guestFallback: "Invitado",
    purchaseError: "No se pudo iniciar la compra de la invitación. Verifica tu correo.",
  },
  fr: {
    sectionTitle: "Invitations Individuelles et Multi-Invités",
    sectionSubtitle:
      "Invitez plusieurs personnes pour comparer vos résultats de manière isolée et confidentielle. Chaque lien est généré uniquement après confirmation du paiement Stripe.",
    firstPriceBadge: "1re invitation au tarif de base (inclut votre rapport complet)",
    discountedPriceBadge: "Invitation supplémentaire à 1/3 du tarif de base",
    guestNameLabel: "Identifiant de l'invité (optionnel, visible uniquement par vous)",
    guestNamePlaceholder: "Ex. : Partenaire, Invité 2",
    emailLabel: "Votre e-mail pour la confirmation de commande",
    emailPlaceholder: "votre@email.com",
    buyInviteBtn: "Acheter une invitation via Stripe",
    buyingInviteBtn: "Ouverture de Stripe Checkout…",
    limitReachedText: "Nombre maximal d'invitations atteint pour cette évaluation.",
    pendingPaymentNote: "En attente de la confirmation du paiement Stripe pour générer le lien.",
    viewComparisonBtn: "Voir la comparaison de ce duo",
    hideComparisonBtn: "Masquer la comparaison",
    guestFallback: "Invité",
    purchaseError: "Impossible de lancer l'achat de l'invitation. Vérifiez votre e-mail.",
  },
};

export function InviteManagerPanel({ sessionId, locale }: { sessionId: string; locale: Locale }) {
  const t = panelCopy[locale];
  const [slots, setSlots] = useState<HostSlotItem[]>([]);
  const [nextPrice, setNextPrice] = useState<NextPriceInfo | null>(null);
  const [guestLabel, setGuestLabel] = useState("");
  const [email, setEmail] = useState("");
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeComparison, setActiveComparison] = useState<ComparisonPayload | null>(null);
  const [loadingSlotId, setLoadingSlotId] = useState<string | null>(null);

  const loadSlots = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/couple/invites?sessionId=${encodeURIComponent(sessionId)}&locale=${locale}`,
        { cache: "no-store" },
      );
      if (!res.ok) return;
      const data = (await res.json()) as { slots?: HostSlotItem[]; nextPrice?: NextPriceInfo };
      if (data.slots) setSlots(data.slots);
      if (data.nextPrice) setNextPrice(data.nextPrice);
    } catch {
      // Non-blocking background load
    }
  }, [sessionId, locale]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/couple/invites?sessionId=${encodeURIComponent(sessionId)}&locale=${locale}`, {
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { slots?: HostSlotItem[]; nextPrice?: NextPriceInfo } | null) => {
        if (cancelled || !data) return;
        if (data.slots) setSlots(data.slots);
        if (data.nextPrice) setNextPrice(data.nextPrice);
      })
      .catch(() => {
        // Non-blocking background load
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId, locale]);

  async function handleBuyInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@") || buying) {
      setError(t.purchaseError);
      return;
    }
    setBuying(true);
    setError(null);
    try {
      const res = await fetch("/api/couple/invites/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          customerEmail: email.trim(),
          hostNameForGuest: guestLabel.trim() || undefined,
          locale,
        }),
      });
      const data = (await res.json()) as {
        checkoutUrl?: string | null;
        alreadyPaid?: boolean;
        order?: { id: string };
        lookupToken?: string;
        error?: string;
      };
      if (!res.ok) {
        throw new Error(data.error ?? t.purchaseError);
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      await loadSlots();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.purchaseError);
    } finally {
      setBuying(false);
    }
  }

  async function handleToggleComparison(slotId: string) {
    if (activeComparison?.slotId === slotId) {
      setActiveComparison(null);
      return;
    }
    setLoadingSlotId(slotId);
    try {
      const res = await fetch(
        `/api/couple/invites/${encodeURIComponent(slotId)}/comparison?sessionId=${encodeURIComponent(sessionId)}&locale=${locale}`,
        { cache: "no-store" },
      );
      if (res.ok) {
        const data = (await res.json()) as ComparisonPayload;
        setActiveComparison(data);
      }
    } finally {
      setLoadingSlotId(null);
    }
  }

  const visibleSlots = slots.filter((s) => s.status !== "CANCELLED" && s.status !== "REVOKED");

  return (
    <div className="pt-4 border-t border-stone-200 space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-stone-900 font-semibold text-base">
          <Users size={18} />
          <h3>{t.sectionTitle}</h3>
        </div>
        <p className="text-xs text-stone-600">{t.sectionSubtitle}</p>
      </div>

      {/* Existing paid/pending invite slots */}
      {visibleSlots.length > 0 ? (
        <div className="space-y-3">
          {visibleSlots.map((slot) => {
            const label = slot.hostNameForGuest?.trim() || `${t.guestFallback} #${slot.slotNumber}`;
            return (
              <div key={slot.id} className="space-y-2">
                {slot.inviteCode && slot.inviteUrl ? (
                  <InviteLinkCard
                    slotNumber={slot.slotNumber}
                    guestLabel={slot.hostNameForGuest}
                    inviteCode={slot.inviteCode}
                    inviteUrl={slot.inviteUrl}
                    status={slot.status}
                    locale={locale}
                  />
                ) : (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-800 flex items-center justify-between">
                    <span className="font-medium">{label}</span>
                    <span>{t.pendingPaymentNote}</span>
                  </div>
                )}

                {slot.comparisonState === "READY" ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => void handleToggleComparison(slot.id)}
                      disabled={loadingSlotId === slot.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 transition-colors"
                    >
                      <Sparkles size={13} />
                      <span>
                        {activeComparison?.slotId === slot.id
                          ? t.hideComparisonBtn
                          : `${t.viewComparisonBtn} (${label})`}
                      </span>
                    </button>
                  </div>
                ) : null}

                {activeComparison?.slotId === slot.id && activeComparison.report ? (
                  <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-3">
                    <h4 className="font-semibold text-sm text-stone-900">
                      {label} — {activeComparison.report.bandLabel}
                    </h4>
                    <p className="text-xs text-stone-600">
                      {activeComparison.report.executiveSummary}
                    </p>
                    <div className="space-y-2">
                      {activeComparison.report.sections.map((sec) => (
                        <div
                          key={sec.id}
                          className="rounded-lg bg-stone-50 p-3 border border-stone-100 space-y-1"
                        >
                          <div className="text-xs font-semibold text-stone-800">{sec.title}</div>
                          <div className="text-xs text-stone-600">{sec.summary}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Progressive Invite Purchase Form */}
      {nextPrice && !nextPrice.limitReached ? (
        <form
          onSubmit={handleBuyInvite}
          className="rounded-xl border border-stone-200 bg-white p-4 space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-stone-700">
              {nextPrice.isDiscounted ? t.discountedPriceBadge : t.firstPriceBadge}
            </span>
            <span className="text-sm font-bold font-mono text-stone-900">
              {nextPrice.formattedPrice}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={guestLabel}
              onChange={(e) => setGuestLabel(e.target.value)}
              placeholder={t.guestNamePlaceholder}
              aria-label={t.guestNameLabel}
              maxLength={80}
              className="rounded-lg border border-stone-200 px-3 py-2 text-xs text-stone-800"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              aria-label={t.emailLabel}
              className="rounded-lg border border-stone-200 px-3 py-2 text-xs text-stone-800"
            />
          </div>

          {error ? (
            <p role="alert" className="text-xs text-rose-600">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={buying}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800 disabled:opacity-60 transition-colors"
          >
            {buying ? <Loader2 size={14} className="animate-spin" /> : <PlusCircle size={14} />}
            <span>
              {buying ? t.buyingInviteBtn : `${t.buyInviteBtn} (${nextPrice.formattedPrice})`}
            </span>
          </button>
        </form>
      ) : nextPrice?.limitReached ? (
        <p className="text-xs text-stone-500">{t.limitReachedText}</p>
      ) : null}
    </div>
  );
}
