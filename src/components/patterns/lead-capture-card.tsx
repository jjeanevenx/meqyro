"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ShieldCheck, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

type LeadCaptureCardProps = {
  sessionId: string;
  locale: string;
  market: string;
  onSuccess: () => void;
  onSkip: () => void;
};

export function LeadCaptureCard({
  sessionId,
  locale,
  market,
  onSuccess,
  onSkip,
}: LeadCaptureCardProps) {
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const localizedText = {
    title: {
      pt: "Salvar seu resultado",
      en: "Save your result",
      es: "Guardar tu resultado",
      fr: "Enregistrer vos résultats",
    }[locale] ?? "Salvar seu resultado",
    subtitle: {
      pt: "Informe seu e-mail para receber o link seguro de acesso e nunca perder sua pontuação.",
      en: "Enter your email to receive a secure access link and preserve your score.",
      es: "Introduce tu correo para recibir un enlace seguro y no perder tu puntuación.",
      fr: "Saisissez votre e-mail pour recevoir un lien d'accès sécurisé.",
    }[locale] ?? "Informe seu e-mail para receber o link seguro de acesso.",
    emailPlaceholder: {
      pt: "seu@email.com",
      en: "your@email.com",
      es: "tu@email.com",
      fr: "votre@email.com",
    }[locale] ?? "seu@email.com",
    marketingLabel: {
      pt: "Desejo receber conteúdos exclusivos, novos quizzes e atualizações da Meqyro (opcional).",
      en: "I wish to receive exclusive content, new quizzes and updates from Meqyro (optional).",
      es: "Deseo recibir contenido exclusivo, nuevos quizzes y actualizaciones de Meqyro (opcional).",
      fr: "Je souhaite recevoir des contenus exclusifs et des mises à jour de Meqyro (facultatif).",
    }[locale] ?? "Desejo receber conteúdos exclusivos da Meqyro.",
    submitBtn: {
      pt: "Salvar e ver resultado",
      en: "Save and view results",
      es: "Guardar y ver resultado",
      fr: "Enregistrer et voir les résultats",
    }[locale] ?? "Salvar e ver resultado",
    skipBtn: {
      pt: "Ver resultado sem salvar",
      en: "View results without saving",
      es: "Ver resultado sin guardar",
      fr: "Voir les résultats sans enregistrer",
    }[locale] ?? "Ver resultado sem salvar",
    legalPrefix: {
      pt: "Ao continuar, você concorda com nossos ",
      en: "By continuing, you agree to our ",
      es: "Al continuar, aceptas nuestros ",
      fr: "En continuant, vous acceptez nos ",
    }[locale] ?? "Ao continuar, você concorda com nossos ",
    termsLink: {
      pt: "Termos de Uso",
      en: "Terms of Service",
      es: "Términos de Uso",
      fr: "Conditions d'utilisation",
    }[locale] ?? "Termos de Uso",
    andWord: {
      pt: " e ",
      en: " and ",
      es: " y ",
      fr: " et ",
    }[locale] ?? " e ",
    privacyLink: {
      pt: "Política de Privacidade",
      en: "Privacy Policy",
      es: "Política de Privacidad",
      fr: "Politique de confidentialité",
    }[locale] ?? "Política de Privacidade",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Por favor, digite um e-mail válido.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          email,
          marketingConsent,
          locale,
          market,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Erro ao salvar e-mail.");
      }

      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao salvar seu e-mail.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lead-capture-card">
      <div className="lead-capture-header">
        <div className="lead-capture-icon">
          <Mail size={24} className="text-forest" />
        </div>
        <h2>{localizedText.title}</h2>
        <p>{localizedText.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="lead-capture-form">
        {error ? (
          <div className="lead-capture-error" role="alert">
            <span>{error}</span>
          </div>
        ) : null}

        <div className="form-group">
          <Input
            id="lead-email"
            label="Seu melhor e-mail"
            type="email"
            required
            placeholder={localizedText.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            autoComplete="email"
          />
        </div>

        <div className="lead-capture-marketing">
          <Checkbox
            id="marketing-optin"
            label={localizedText.marketingLabel}
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            disabled={isSubmitting}
          />
        </div>

        <div className="lead-capture-legal">
          <ShieldCheck size={14} className="text-muted" />
          <span>
            {localizedText.legalPrefix}
            <Link href={`/${locale}/legal/terms`} className="legal-link" target="_blank">
              {localizedText.termsLink}
            </Link>
            {localizedText.andWord}
            <Link href={`/${locale}/legal/privacy`} className="legal-link" target="_blank">
              {localizedText.privacyLink}
            </Link>
            .
          </span>
        </div>

        <div className="lead-capture-actions">
          <Button type="submit" disabled={isSubmitting} className="button--primary">
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Salvando…</span>
              </>
            ) : (
              <>
                <span>{localizedText.submitBtn}</span>
                <ArrowRight size={18} />
              </>
            )}
          </Button>

          <button
            type="button"
            onClick={onSkip}
            disabled={isSubmitting}
            className="lead-capture-skip-btn"
          >
            {localizedText.skipBtn}
          </button>
        </div>
      </form>
    </div>
  );
}
