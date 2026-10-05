"use client";

import { FormEvent, useState } from "react";
import { useParams } from "next/navigation";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isLocale, type Locale } from "@/lib/i18n/config";

export default function ReportAccessPage() {
  const params = useParams();
  const rawLocale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const locale: Locale = typeof rawLocale === "string" && isLocale(rawLocale) ? rawLocale : "pt";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    await fetch("/api/reports/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, locale }),
    }).catch(() => null);
    setLoading(false);
    setSent(true);
  }

  return (
    <main className="legal-page-container">
      <section className="checkout-return-card">
        <Mail size={42} className="mx-auto text-forest" />
        <h1>{locale === "pt" ? "Acessar meus relatórios" : "Access my reports"}</h1>
        <p className="return-description">
          {sent
            ? locale === "pt"
              ? "Se houver compras para este e-mail, enviaremos links seguros em instantes."
              : "If purchases exist for this email, secure links will arrive shortly."
            : locale === "pt"
              ? "Informe o e-mail usado na compra."
              : "Enter the email used for your purchase."}
        </p>
        {!sent ? (
          <form onSubmit={submit} className="checkout-form">
            <Input
              id="report-access-email"
              label="Email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button type="submit" disabled={loading} className="button--primary">
              {loading ? "…" : locale === "pt" ? "Enviar links seguros" : "Send secure links"}
            </Button>
          </form>
        ) : null}
      </section>
    </main>
  );
}
