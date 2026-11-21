"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

type InviteLinkCardProps = {
  slotNumber: number;
  guestLabel: string | null;
  inviteCode: string;
  inviteUrl: string;
  status: string;
  locale: Locale;
};

const cardCopy: Record<
  Locale,
  {
    guestFallback: string;
    shareLabel: string;
    shareTitle: string;
    statusLabels: Record<string, string>;
  }
> = {
  pt: {
    guestFallback: "Convidado",
    shareLabel: "Compartilhar",
    shareTitle: "Convite CoupleDNA — Meqyro",
    statusLabels: {
      ACTIVE: "Ativo • aguardando resgate",
      REDEEMED: "Resgatado • aguardando início",
      QUIZ_STARTED: "Em andamento",
      COMPLETED: "Concluído",
      EXPIRED: "Expirado",
    },
  },
  en: {
    guestFallback: "Guest",
    shareLabel: "Share",
    shareTitle: "CoupleDNA Invitation — Meqyro",
    statusLabels: {
      ACTIVE: "Active • waiting for redemption",
      REDEEMED: "Redeemed • waiting to start",
      QUIZ_STARTED: "In progress",
      COMPLETED: "Completed",
      EXPIRED: "Expired",
    },
  },
  es: {
    guestFallback: "Invitado",
    shareLabel: "Compartir",
    shareTitle: "Invitación CoupleDNA — Meqyro",
    statusLabels: {
      ACTIVE: "Activo • esperando canje",
      REDEEMED: "Canjeado • por iniciar",
      QUIZ_STARTED: "En curso",
      COMPLETED: "Completado",
      EXPIRED: "Expirado",
    },
  },
  fr: {
    guestFallback: "Invité",
    shareLabel: "Partager",
    shareTitle: "Invitation CoupleDNA — Meqyro",
    statusLabels: {
      ACTIVE: "Actif • en attente d'acceptation",
      REDEEMED: "Accepté • prêt à démarrer",
      QUIZ_STARTED: "En cours",
      COMPLETED: "Terminé",
      EXPIRED: "Expiré",
    },
  },
};

export function InviteLinkCard({
  slotNumber,
  guestLabel,
  inviteCode,
  inviteUrl,
  status,
  locale,
}: InviteLinkCardProps) {
  const dict = getDictionary(locale);
  const t = cardCopy[locale];
  const [copied, setCopied] = useState(false);

  const label = guestLabel?.trim() || `${t.guestFallback} #${slotNumber}`;
  const statusText = t.statusLabels[status] ?? status;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback selection handled by input focus
    }
  }

  async function handleShare() {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: t.shareTitle,
          url: inviteUrl,
        });
      } catch {
        // User cancelled native share
      }
    } else {
      await handleCopy();
    }
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-stone-900">{label}</span>
          <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-mono text-stone-600">
            {inviteCode}
          </span>
        </div>
        <span className="text-xs font-medium text-stone-600">{statusText}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          readOnly
          value={inviteUrl}
          aria-label={`${label} — ${dict.common.copyLink}`}
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-700 font-mono"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void handleCopy()}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-100 transition-colors"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? dict.common.linkCopied : dict.common.copyLink}</span>
          </button>
          <button
            type="button"
            onClick={() => void handleShare()}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-stone-100 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <Share2 size={14} />
            <span>{t.shareLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
