"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, CheckCircle2, Loader2, Lock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isMarket, resolveMarketContext, type Market } from "@/lib/market/market-context";
import { brainRankPrice, getBundlePrice, isBundleProduct, formatMoney } from "@/lib/market/prices";

const checkoutTranslations: Record<
  Locale,
  {
    back: string;
    secureCheckoutBadge: string;
    orderSummaryTitle: string;
    orderSubtitle: string;
    features: [string, string, string, string];
    totalToPay: string;
    formTitle: string;
    formIntro: string;
    emailLabel: string;
    emailPlaceholder: string;
    emailRequiredError: string;
    sessionMissingError: string;
    acceptedMethodsTitle: string;
    pixBadge: string;
    cardBadge: string;
    walletBadge: string;
    methodsAvailability: string;
    payButton: string;
    preparingPayment: string;
    trustFooter: string;
    bundleDiscover: string;
    bundleLife: string;
    bundleAllAccess: string;
    defaultReportName: string;
    loadingText: string;
  }
> = {
  pt: {
    back: "Voltar",
    secureCheckoutBadge: "Checkout seguro",
    orderSummaryTitle: "Resumo do Pedido",
    orderSubtitle: "Download do resultado, análise completa e certificado digital.",
    features: [
      "Detalhamento aprofundado de todas as dimensões",
      "Identificação de pontos cegos sob pressão",
      "Plano prático de desenvolvimento",
      "Garantia incondicional de 7 dias com reembolso integral",
    ],
    totalToPay: "Total a pagar:",
    formTitle: "Dados de Envio e Acesso",
    formIntro: "Seu relatório e as chaves de acesso permanente serão associados a este e-mail.",
    emailLabel: "Seu melhor e-mail",
    emailPlaceholder: "seu@email.com",
    emailRequiredError: "Por favor, digite um e-mail válido para receber seu relatório.",
    sessionMissingError: "Sessão não identificada. Por favor, retorne ao teste.",
    acceptedMethodsTitle: "Métodos aceitos",
    pixBadge: "PIX (Aprovação Instantânea)",
    cardBadge: "Cartão de Crédito",
    walletBadge: "Google Pay e outras carteiras",
    methodsAvailability: "A Stripe exibirá os métodos elegíveis para sua região e dispositivo.",
    payButton: "Prosseguir para o Pagamento",
    preparingPayment: "Preparando pagamento seguro…",
    trustFooter: "Pagamento processado com segurança pela Stripe.",
    bundleDiscover: "Pacote Descoberta (3 Testes)",
    bundleLife: "Pacote Vida & Carreira (3 Testes)",
    bundleAllAccess: "Passe Acesso Total (Todos os 7 Testes)",
    defaultReportName: "Relatório Analítico Completo",
    loadingText: "Carregando checkout seguro…",
  },
  en: {
    back: "Back",
    secureCheckoutBadge: "Secure checkout",
    orderSummaryTitle: "Order Summary",
    orderSubtitle: "Downloadable result, comprehensive analysis, and digital certificate.",
    features: [
      "In-depth breakdown of all cognitive and behavioral dimensions",
      "Identification of blind spots under pressure",
      "Actionable personal development roadmap",
      "7-day unconditional 100% money-back guarantee",
    ],
    totalToPay: "Total to pay:",
    formTitle: "Delivery & Access Details",
    formIntro: "Your full report and permanent access keys will be linked to this email address.",
    emailLabel: "Your primary email address",
    emailPlaceholder: "your@email.com",
    emailRequiredError: "Please enter a valid email address to receive your report.",
    sessionMissingError: "Unidentified session. Please return to the assessment.",
    acceptedMethodsTitle: "Accepted payment methods",
    pixBadge: "Instant Local Transfer",
    cardBadge: "Credit Card (Visa, Mastercard, Amex)",
    walletBadge: "Google Pay and other wallets",
    methodsAvailability: "Stripe displays the methods eligible for your region and device.",
    payButton: "Proceed to Payment",
    preparingPayment: "Preparing secure checkout…",
    trustFooter: "Payment processed securely by Stripe.",
    bundleDiscover: "Discovery Bundle (3 Quizzes)",
    bundleLife: "Life & Career Bundle (3 Quizzes)",
    bundleAllAccess: "All-Access Pass (All 7 Quizzes)",
    defaultReportName: "Complete Analytical Report",
    loadingText: "Loading secure checkout…",
  },
  es: {
    back: "Volver",
    secureCheckoutBadge: "Checkout seguro",
    orderSummaryTitle: "Resumen del Pedido",
    orderSubtitle: "Resultado descargable, análisis completo y certificado digital.",
    features: [
      "Detalle en profundidad de todas las dimensiones",
      "Identificación de puntos ciegos bajo presión",
      "Plan práctico de desarrollo personal",
      "Garantía incondicional de 7 días con reembolso íntegro",
    ],
    totalToPay: "Total a pagar:",
    formTitle: "Datos de Envío y Acceso",
    formIntro: "Tu informe completo y claves de acceso permanente se vincularán a este correo.",
    emailLabel: "Tu correo electrónico principal",
    emailPlaceholder: "tu@email.com",
    emailRequiredError:
      "Por favor, introduce un correo electrónico válido para recibir tu informe.",
    sessionMissingError: "Sesión no identificada. Por favor, vuelve al test.",
    acceptedMethodsTitle: "Métodos aceptados",
    pixBadge: "Transferencia Inmediata",
    cardBadge: "Tarjeta de Crédito",
    walletBadge: "Google Pay y otras carteras",
    methodsAvailability: "Stripe mostrará los métodos disponibles para tu región y dispositivo.",
    payButton: "Continuar al Pago",
    preparingPayment: "Preparando pago seguro…",
    trustFooter: "Pago procesado de forma segura por Stripe.",
    bundleDiscover: "Paquete Descubrimiento (3 Tests)",
    bundleLife: "Paquete Vida y Carrera (3 Tests)",
    bundleAllAccess: "Pase Acceso Total (Los 7 Tests)",
    defaultReportName: "Informe Analítico Completo",
    loadingText: "Cargando checkout seguro…",
  },
  fr: {
    back: "Retour",
    secureCheckoutBadge: "Paiement sécurisé",
    orderSummaryTitle: "Résumé de la Commande",
    orderSubtitle: "Résultat téléchargeable, analyse complète et certificat numérique.",
    features: [
      "Analyse détaillée et approfondie de toutes les dimensions",
      "Identification des points d'ombre sous tension",
      "Plan d'action et recommandations pratiques",
      "Garantie satisfait ou remboursé de 7 jours",
    ],
    totalToPay: "Total à payer :",
    formTitle: "Informations d'Envoi et d'Accès",
    formIntro: "Votre rapport complet et vos accès permanents seront associés à cet e-mail.",
    emailLabel: "Votre adresse e-mail principale",
    emailPlaceholder: "votre@email.com",
    emailRequiredError: "Veuillez saisir une adresse e-mail valide pour recevoir votre rapport.",
    sessionMissingError: "Session non identifiée. Veuillez retourner au test.",
    acceptedMethodsTitle: "Moyens de paiement acceptés",
    pixBadge: "Virement Instantané",
    cardBadge: "Carte Bancaire",
    walletBadge: "Google Pay et autres portefeuilles",
    methodsAvailability: "Stripe affiche les moyens éligibles pour votre région et votre appareil.",
    payButton: "Procéder au Paiement",
    preparingPayment: "Préparation du paiement sécurisé…",
    trustFooter: "Paiement traité de manière sécurisée par Stripe.",
    bundleDiscover: "Pack Découverte (3 Tests)",
    bundleLife: "Pack Vie & Carrière (3 Tests)",
    bundleAllAccess: "Pass Accès Total (Les 7 Tests)",
    defaultReportName: "Rapport Analytique Complet",
    loadingText: "Chargement du paiement sécurisé…",
  },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawParams = useParams();
  const rawLocale = Array.isArray(rawParams?.locale) ? rawParams.locale[0] : rawParams?.locale;
  const locale: Locale = typeof rawLocale === "string" && isLocale(rawLocale) ? rawLocale : "pt";
  const t = checkoutTranslations[locale];
  const dict = getDictionary(locale);

  const sessionId = searchParams.get("session") ?? "";
  const productCode = (searchParams.get("product") ?? "BRAINRANK").toUpperCase();

  const [customerEmail, setCustomerEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionMarket, setSessionMarket] = useState<{
    sessionId: string;
    market: Market;
  } | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    const loadSessionMarket = async () => {
      try {
        const response = await fetch(`/api/sessions?sessionId=${encodeURIComponent(sessionId)}`, {
          cache: "no-store",
        });
        const data = (await response.json()) as { session?: { market?: string } };
        if (!response.ok || !isMarket(data.session?.market)) {
          throw new Error(t.sessionMissingError);
        }
        setSessionMarket({ sessionId, market: data.session.market });
      } catch (marketError) {
        setError(marketError instanceof Error ? marketError.message : t.sessionMissingError);
      }
    };
    void loadSessionMarket();
  }, [sessionId, t.sessionMissingError]);

  const activeSessionMarket = sessionMarket?.sessionId === sessionId ? sessionMarket.market : null;
  const marketReady = !sessionId || activeSessionMarket !== null;
  const marketContext = resolveMarketContext({
    locale,
    market: activeSessionMarket ?? undefined,
  });
  const amount = isBundleProduct(productCode)
    ? (getBundlePrice(productCode, marketContext.market) ?? 1990)
    : brainRankPrice(marketContext.market);

  const formattedPrice = formatMoney(amount, marketContext.currency, locale);

  let productName = t.defaultReportName;
  if (productCode === "BUNDLE_DISCOVER") productName = t.bundleDiscover;
  else if (productCode === "BUNDLE_LIFE") productName = t.bundleLife;
  else if (productCode === "BUNDLE_ALL_ACCESS") productName = t.bundleAllAccess;
  else if (productCode === "BRAINRANK")
    productName = `${dict.quizzes.brainrank?.name ?? "BrainRank"} — ${t.defaultReportName}`;
  else if (productCode === "PERSONALITY_MAP")
    productName = `${dict.quizzes["personality-map"]?.name ?? "Personality Map"} — ${t.defaultReportName}`;
  else if (productCode === "CAREERFIT")
    productName = `${dict.quizzes.careerfit?.name ?? "CareerFit"} — ${t.defaultReportName}`;
  else if (productCode === "MONEYDNA")
    productName = `${dict.quizzes.moneydna?.name ?? "MoneyDNA"} — ${t.defaultReportName}`;
  else if (productCode === "FOCUSSTYLE")
    productName = `${dict.quizzes.focusstyle?.name ?? "FocusStyle"} — ${t.defaultReportName}`;
  else if (productCode === "DECISIONDNA")
    productName = `${dict.quizzes.decisiondna?.name ?? "DecisionDNA"} — ${t.defaultReportName}`;
  else if (productCode === "COUPLEDNA")
    productName = `${dict.quizzes.coupledna?.name ?? "CoupleDNA"} — ${t.defaultReportName}`;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !customerEmail.includes("@")) {
      setError(t.emailRequiredError);
      return;
    }

    if (!sessionId) {
      setError(t.sessionMissingError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          productCode,
          customerEmail,
          market: marketContext.market,
          locale,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Payment initialization failed.");
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.alreadyPaid && data.order?.id && data.lookupToken) {
        router.push(
          `/${locale}/checkout/success?order=${encodeURIComponent(data.order.id)}&token=${encodeURIComponent(data.lookupToken)}`,
        );
      } else {
        throw new Error("Payment provider did not return a checkout URL.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error processing checkout.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-shell">
      <header className="checkout-header">
        <Link href={`/${locale}`} className="back-link">
          <ArrowLeft size={16} />
          <span>{t.back}</span>
        </Link>
        <Link href={`/${locale}`} className="checkout-brand" aria-label="Meqyro">
          MEQ<span>Y</span>RO
        </Link>
        <div className="checkout-badge">
          <Lock size={16} className="text-emerald-700" />
          <span>{t.secureCheckoutBadge}</span>
        </div>
      </header>

      <div className="checkout-grid">
        {/* Order Summary */}
        <section className="checkout-summary-card">
          <h2>{t.orderSummaryTitle}</h2>
          <div className="checkout-item">
            <div>
              <h3>{productName}</h3>
              <p>{t.orderSubtitle}</p>
            </div>
            <span className="checkout-item-price">{formattedPrice}</span>
          </div>

          <ul className="checkout-features">
            {t.features.map((feat, idx) => (
              <li key={idx}>
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>

          <div className="checkout-total-row">
            <span>{t.totalToPay}</span>
            <span className="checkout-total-val">{formattedPrice}</span>
          </div>
        </section>

        {/* Payment Action Form */}
        <section className="checkout-form-card">
          <h2>{t.formTitle}</h2>
          <p className="checkout-form-intro">{t.formIntro}</p>

          <form onSubmit={handlePay} className="checkout-form">
            {error ? (
              <div className="lead-capture-error" role="alert">
                <span>{error}</span>
              </div>
            ) : null}

            <div className="form-group">
              <Input
                id="checkout-email"
                label={t.emailLabel}
                type="email"
                required
                placeholder={t.emailPlaceholder}
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>

            <div className="checkout-payment-methods">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                {t.acceptedMethodsTitle}
              </span>
              <div className="payment-badges">
                {marketContext.market === "BR" ? <span className="badge">{t.pixBadge}</span> : null}
                <span className="badge">{t.cardBadge}</span>
                <span className="badge">{t.walletBadge}</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">{t.methodsAvailability}</p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !marketReady || Boolean(error && !activeSessionMarket)}
              className="checkout-pay-btn button--primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>{t.preparingPayment}</span>
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  <span>{t.payButton}</span>
                </>
              )}
            </Button>

            <div className="checkout-trust-footer">
              <ShieldCheck size={16} className="text-emerald-700" />
              <small>{t.trustFooter}</small>
            </div>
            <Link href={`/${locale}/reports/access`} className="text-sm text-forest underline">
              {locale === "pt" ? "Acessar meus relatórios" : "Access my reports"}
            </Link>
          </form>
        </section>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="legal-page-container">
      <Suspense
        fallback={
          <div className="checkout-shell text-center py-12">
            <Loader2 size={36} className="animate-spin text-forest mx-auto mb-4" />
            <p>Loading checkout…</p>
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
    </main>
  );
}
