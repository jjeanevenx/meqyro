"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { ProtectedResultResponse } from "@/features/results/contracts";

export function CoupleResultPanel({
  sessionId,
  locale,
  initialState,
  paid,
}: {
  sessionId: string;
  locale: Locale;
  initialState: ProtectedResultResponse["couple"];
  paid: boolean;
}) {
  const t = getDictionary(locale).coupleFlow;
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const state = initialState?.state ?? "NO_INVITE";
  const invite = state === "NO_INVITE" || state === "EXPIRED";
  const url =
    inviteUrl ??
    (initialState?.inviteCode
      ? `${process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? ""}/${locale}/quizzes/coupledna/play?invite=${initialState.inviteCode}`
      : null);
  async function act(kind: "invite" | "consent" | "refresh") {
    setBusy(true);
    setError(false);
    try {
      if (kind !== "refresh") {
        const response = await fetch(`/api/couple/${kind}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            kind === "invite"
              ? { sessionId, locale, consent: allowed }
              : { sessionId, granted: !initialState?.consentGiven },
          ),
        });
        if (!response.ok) throw new Error();
        if (kind === "invite") setInviteUrl((await response.json()).inviteUrl);
      }
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section
      className="rounded-2xl border border-stone-200 bg-stone-50 p-5 space-y-3"
      aria-label={t.title}
    >
      <h2 className="text-xl font-semibold">{t.title}</h2>
      <p role="status">{t.states[state]}</p>
      {paid && state !== "READY" ? <p>{t.paid}</p> : null}
      {invite ? (
        <>
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={allowed}
              onChange={(event) => setAllowed(event.target.checked)}
            />
            {t.consent}
          </label>
          <button
            className="paywall-cta-btn"
            disabled={!allowed || busy}
            onClick={() => act("invite")}
          >
            {t.invite}
          </button>
        </>
      ) : (
        <button disabled={busy} onClick={() => act("consent")}>
          {initialState?.consentGiven ? t.withdraw : t.allow}
        </button>
      )}
      {url ? (
        <label className="block">
          {t.link}
          <input
            className="w-full rounded border p-2 mt-2"
            readOnly
            value={url}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
      ) : null}
      <button disabled={busy} onClick={() => act("refresh")}>
        {t.refresh}
      </button>
      {error ? <p role="alert">{t.error}</p> : null}
    </section>
  );
}
