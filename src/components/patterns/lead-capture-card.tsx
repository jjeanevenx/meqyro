"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ShieldCheck, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

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

  const safeLocale: Locale = locale === "en" || locale === "es" || locale === "fr" ? locale : "pt";
  const dict = getDictionary(safeLocale);

  const localizedText = {
    title: dict.leadCapture.title,
    subtitle: dict.leadCapture.subtitle,
    emailPlaceholder: dict.leadCapture.emailPlaceholder,
    marketingLabel: dict.leadCapture.promotionalConsent,
    submitBtn: dict.leadCapture.submitButton,
    submittingBtn: dict.leadCapture.submitting,
    emailLabel: {
      pt: "Seu melhor e-mail",
      en: "Your best email address",
      es: "Tu mejor correo electrónico",
      fr: "Votre meilleure adresse e-mail",
    }[safeLocale],
    skipBtn: {
      pt: "Ver resultado sem salvar",
      en: "View results without saving",
      es: "Ver resultado sin guardar",
      fr: "Voir les résultats sans enregistrer",
    }[safeLocale],
    invalidEmailError: {
      pt: "Por favor, digite um endereço de e-mail válido.",
      en: "Please enter a valid email address.",
      es: "Por favor, introduce un correo electrónico válido.",
      fr: "Veuillez saisir une adresse e-mail valide.",
    }[safeLocale],
    genericError: {
      pt: "Ocorreu um erro ao salvar seu e-mail.",
      en: "An error occurred while saving your email.",
      es: "Ocurrió un error al guardar tu correo.",
      fr: "Une erreur est survenue lors de l'enregistrement de votre e-mail.",
    }[safeLocale],
    legalPrefix: {
      pt: "Ao continuar, você concorda com nossos ",
      en: "By continuing, you agree to our ",
      es: "Al continuar, aceptas nuestros ",
      fr: "En continuant, vous acceptez nos ",
    }[safeLocale],
    termsLink: {
      pt: "Termos de Uso",
      en: "Terms of Service",
      es: "Términos de Uso",
      fr: "Conditions d'utilisation",
    }[safeLocale],
    andWord: {
      pt: " e ",
      en: " and ",
      es: " y ",
      fr: " et ",
    }[safeLocale],
    privacyLink: {
      pt: "Política de Privacidade",
      en: "Privacy Policy",
      es: "Política de Privacidad",
      fr: "Politique de confidentialité",
    }[safeLocale],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError(localizedText.invalidEmailError);
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
        throw new Error(errorData.error ?? localizedText.genericError);
      }

      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : localizedText.genericError);
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
            label={localizedText.emailLabel}
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
                <span>{localizedText.submittingBtn}</span>
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
