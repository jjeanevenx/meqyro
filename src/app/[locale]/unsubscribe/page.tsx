"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    token ? "loading" : "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    async function doUnsubscribe() {
      try {
        const response = await fetch("/api/privacy/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error ?? "Não foi possível processar o cancelamento.");
        }

        if (isMounted) {
          setStatus("success");
        }
      } catch (err: unknown) {
        if (isMounted) {
          setStatus("error");
          setErrorMessage(err instanceof Error ? err.message : "Token inválido ou expirado.");
        }
      }
    }

    doUnsubscribe();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="unsubscribe-card">
      {status === "loading" ? (
        <div className="unsubscribe-state">
          <Loader2 size={36} className="animate-spin text-forest mb-4" />
          <h1>Processando seu descadastramento…</h1>
          <p>Aguarde um instante.</p>
        </div>
      ) : status === "success" ? (
        <div className="unsubscribe-state">
          <CheckCircle2 size={44} className="text-emerald-600 mb-4" />
          <h1>Inscrição Cancelada</h1>
          <p>
            Você foi descadastrado com sucesso de todas as comunicações de marketing e novidades da
            Meqyro.
          </p>
          <small className="text-muted block mt-2 mb-6">
            Caso você tenha resultados salvos ou pedidos ativos, notificações estritamente
            transacionais continuarão disponíveis para acesso e segurança.
          </small>
          <Link href="/" className="button button--secondary">
            Voltar ao Início
          </Link>
        </div>
      ) : status === "error" ? (
        <div className="unsubscribe-state">
          <AlertCircle size={44} className="text-rose-600 mb-4" />
          <h1>Não foi possível cancelar</h1>
          <p>{errorMessage}</p>
          <Link href="/" className="button button--secondary mt-6">
            Voltar ao Início
          </Link>
        </div>
      ) : (
        <div className="unsubscribe-state">
          <h1>Cancelar Inscrição de E-mails</h1>
          <p>
            Nenhum token de cancelamento foi fornecido. Para cancelar, clique no link presente no
            rodapé de um dos e-mails recebidos.
          </p>
          <Link href="/" className="button button--secondary mt-6">
            Voltar ao Início
          </Link>
        </div>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <main className="legal-page-container">
      <Suspense
        fallback={
          <div className="unsubscribe-card">
            <div className="unsubscribe-state">
              <Loader2 size={36} className="animate-spin text-forest mb-4" />
              <p>Carregando…</p>
            </div>
          </div>
        }
      >
        <UnsubscribeContent />
      </Suspense>
    </main>
  );
}
