"use client";

import { useEffect, useRef, useState } from "react";

export function MemoryObservation({
  sessionId,
  cueId,
  text,
  locale,
  onComplete,
}: {
  sessionId: string;
  cueId: string;
  text: string;
  locale: string;
  onComplete: (seen: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const locked = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  const copy = {
    pt: {
      title: "Leia a informação a seguir",
      next: "Continuar",
      loading: "Continuando…",
      error: "Não foi possível continuar. Tente novamente.",
    },
    en: {
      title: "Read the following information",
      next: "Continue",
      loading: "Continuing…",
      error: "Unable to continue. Please try again.",
    },
    es: {
      title: "Lee la siguiente información",
      next: "Continuar",
      loading: "Continuando…",
      error: "No se pudo continuar. Inténtalo de nuevo.",
    },
    fr: {
      title: "Lisez les informations suivantes",
      next: "Continuer",
      loading: "Suite…",
      error: "Impossible de continuer. Réessayez.",
    },
  }[locale === "en" || locale === "es" || locale === "fr" ? locale : "pt"];
  async function advance() {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setFailed(false);
    try {
      const response = await fetch(`/api/sessions/${sessionId}/memory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cueId }),
      });
      if (!response.ok) throw new Error("Observation unavailable");
      const data = (await response.json()) as { memorySeen: string[] };
      onComplete(data.memorySeen);
    } catch {
      setFailed(true);
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  return (
    <main className="quiz-runner">
      <section className="quiz-question-card" aria-labelledby="observation-title" aria-busy={busy}>
        <h1 id="observation-title" className="quiz-question-title" tabIndex={-1} ref={heading}>
          {copy.title}
        </h1>
        <p className="strength-highlight">{text}</p>
        <button className="button button--primary" disabled={busy} onClick={() => void advance()}>
          {busy ? copy.loading : copy.next}
        </button>
        {failed ? <p role="alert">{copy.error}</p> : null}
      </section>
    </main>
  );
}
