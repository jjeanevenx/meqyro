import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Mail, HelpCircle, ShieldCheck, ArrowLeft } from "lucide-react";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/features/seo/metadata-builder";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const titles: Record<Locale, string> = {
    pt: "Contato e Suporte | Meqyro",
    en: "Contact & Support | Meqyro",
    es: "Contacto y Soporte | Meqyro",
    fr: "Contact et Support | Meqyro",
  };

  return buildPageMetadata({
    locale,
    path: "/contact",
    title: titles[locale as Locale],
    description: "Canal oficial de atendimento, dúvidas sobre pagamentos, relatórios e privacidade.",
  });
}

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-8">
        <div>
          <Link
            href={`/${locale}`}
            className="text-xs text-stone-500 hover:text-stone-900 inline-flex items-center gap-1 mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Voltar à página inicial
          </Link>
          <h1 className="text-3xl font-serif font-bold text-stone-900">
            Fale com a Meqyro
          </h1>
          <p className="text-sm text-stone-600 mt-2">
            Estamos à disposição para ajudar com pagamentos, acesso a relatórios e solicitações de privacidade.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
              <Mail size={18} className="text-stone-700" />
              <span>Atendimento ao Cliente e Suporte</span>
            </div>
            <p className="text-xs text-stone-600">
              Para dúvidas sobre compras, desbloqueio de resultados ou envio de recibos:
            </p>
            <a
              href="mailto:support@meqyro.com"
              className="inline-block text-xs font-semibold text-stone-900 underline hover:text-stone-700 pt-1"
            >
              support@meqyro.com
            </a>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
              <ShieldCheck size={18} className="text-stone-700" />
              <span>Encarregado de Privacidade (DPO / LGPD / GDPR)</span>
            </div>
            <p className="text-xs text-stone-600">
              Para exercer direitos de titular de dados (acesso, correção ou exclusão):
            </p>
            <div className="pt-1 flex items-center gap-3">
              <a
                href="mailto:privacy@meqyro.com"
                className="text-xs font-semibold text-stone-900 underline hover:text-stone-700"
              >
                privacy@meqyro.com
              </a>
              <span className="text-xs text-stone-400">•</span>
              <Link
                href={`/${locale}/privacy/data-request`}
                className="text-xs font-medium text-stone-600 underline hover:text-stone-900"
              >
                Formulário de Dados
              </Link>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
              <HelpCircle size={18} className="text-stone-700" />
              <span>Garantia de 7 Dias e Cancelamento</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Em conformidade com o Código de Defesa do Consumidor e padrões internacionais de comércio eletrônico, você possui até 7 dias corridos após a compra para solicitar reembolso integral sem complicações enviando seu e-mail de compra para nosso suporte.
            </p>
          </div>
        </div>

        <div className="pt-4 text-center">
          <p className="text-[11px] text-stone-500">
            Meqyro Inc. • Operações Digitais Seguras • Respostas em até 1 dia útil.
          </p>
        </div>
      </div>
    </main>
  );
}
