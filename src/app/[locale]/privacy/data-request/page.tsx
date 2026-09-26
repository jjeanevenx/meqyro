"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UserCheck, CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DataRequestPage() {
  const [email, setEmail] = useState("");
  const [requestType, setRequestType] = useState<"EXPORT" | "DELETION" | "RECTIFICATION">("EXPORT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Por favor, informe um e-mail válido.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/privacy/data-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          requestType,
          locale: "pt",
          market: "BR",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Erro ao enviar solicitação.");
      }

      setSuccessMessage(data.message);
      setIsSubmitting(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao processar solicitação.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="legal-page-container">
      <header className="legal-header">
        <Link href="/" className="back-link">
          <ArrowLeft size={16} />
          <span>Voltar ao início</span>
        </Link>
        <div className="policy-meta">
          <UserCheck size={28} className="text-forest" />
          <h1>Exercício de Direitos de Privacidade</h1>
          <p className="policy-version-badge">LGPD Art. 18 · GDPR Art. 15–17</p>
        </div>
      </header>

      <div className="data-request-wrapper">
        {successMessage ? (
          <div className="data-request-success">
            <CheckCircle2 size={36} className="text-emerald-600 mb-2" />
            <h2>Solicitação Registrada</h2>
            <p>{successMessage}</p>
            <Link href="/" className="button button--secondary mt-4">
              Retornar ao Início
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="data-request-form">
            <p className="data-request-intro">
              Para garantir sua segurança e evitar o acesso indevido por terceiros, enviaremos um
              link de confirmação para o endereço de e-mail informado antes de processar qualquer
              dado.
            </p>

            {error ? (
              <div className="lead-capture-error" role="alert">
                <span>{error}</span>
              </div>
            ) : null}

            <div className="form-group">
              <Input
                id="data-email"
                label="Seu e-mail cadastrado"
                type="email"
                required
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="request-type" className="font-semibold block mb-1 text-sm">
                Tipo de solicitação
              </label>
              <select
                id="request-type"
                className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white text-sm"
                value={requestType}
                onChange={(e) =>
                  setRequestType(e.target.value as "EXPORT" | "DELETION" | "RECTIFICATION")
                }
                disabled={isSubmitting}
              >
                <option value="EXPORT">Exportar meus dados e histórico de resultados</option>
                <option value="DELETION">
                  Excluir todos os meus dados e pontuações (Esquecimento)
                </option>
                <option value="RECTIFICATION">Solicitar retificação de dados</option>
              </select>
            </div>

            <div className="data-request-anti-enumeration-notice">
              <small>
                * Por motivos de segurança contra enumeração de usuários, confirmamos o recebimento
                de forma padronizada para qualquer e-mail enviado.
              </small>
            </div>

            <Button type="submit" disabled={isSubmitting} className="button--primary">
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Enviando solicitação…</span>
                </>
              ) : (
                <>
                  <span>Enviar Solicitação de Privacidade</span>
                  <Send size={16} />
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
