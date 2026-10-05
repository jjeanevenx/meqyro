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
  const [visible, setVisible] = useState(true);
  const [seen, setSeen] = useState<string[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const completeRef = useRef(onComplete);
  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);
  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), cueId === "MEMORY_02" ? 8000 : 6000);
    return () => window.clearTimeout(timeout);
  }, [cueId]);
  useEffect(() => {
    let active = true;
    // Register immediately: reloading must not grant another viewing period.
    fetch(`/api/sessions/${sessionId}/memory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cueId }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Observation unavailable");
        const data = (await response.json()) as { memorySeen: string[] };
        if (active) setSeen(data.memorySeen);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [sessionId, cueId, attempt]);
  useEffect(() => {
    if (!visible && seen) completeRef.current(seen);
  }, [visible, seen]);
  const copy = {
    pt: {
      title: "Observe com atenção",
      loading: "Continuando…",
      error: "Não foi possível continuar.",
      retry: "Tentar novamente",
    },
    en: {
      title: "Look closely",
      loading: "Continuing…",
      error: "Unable to continue.",
      retry: "Try again",
    },
    es: {
      title: "Observa con atención",
      loading: "Continuando…",
      error: "No se pudo continuar.",
      retry: "Intentar de nuevo",
    },
    fr: {
      title: "Observez attentivement",
      loading: "Suite…",
      error: "Impossible de continuer.",
      retry: "Réessayer",
    },
  }[locale === "en" || locale === "es" || locale === "fr" ? locale : "pt"];
  return (
    <main className="quiz-runner">
      <section className="quiz-question-card" aria-labelledby="observation-title">
        {visible ? (
          <>
            <h1 id="observation-title" className="quiz-question-title">
              {copy.title}
            </h1>
            <p className="strength-highlight">{text}</p>
          </>
        ) : failed ? (
          <>
            <p role="alert">{copy.error}</p>
            <button
              className="button button--primary"
              onClick={() => {
                setFailed(false);
                setAttempt((value) => value + 1);
              }}
            >
              {copy.retry}
            </button>
          </>
        ) : (
          <p role="status">{copy.loading}</p>
        )}
      </section>
    </main>
  );
}
