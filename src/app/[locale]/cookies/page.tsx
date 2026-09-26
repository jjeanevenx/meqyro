import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";
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
    pt: "Política de Cookies | Meqyro",
    en: "Cookie Policy | Meqyro",
    es: "Política de Cookies | Meqyro",
    fr: "Politique relative aux Cookies | Meqyro",
  };

  return buildPageMetadata({
    locale,
    path: "/cookies",
    title: titles[locale as Locale],
    description:
      "Saiba como a Meqyro utiliza apenas cookies essenciais para garantir o funcionamento seguro dos testes.",
  });
}

type CookiePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CookiePage({ params }: CookiePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <Link
            href={`/${locale}`}
            className="text-xs text-stone-500 hover:text-stone-900 inline-flex items-center gap-1 mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Voltar à página inicial
          </Link>
          <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-3xl">
            <Cookie size={28} />
            <h1>Política de Cookies</h1>
          </div>
          <p className="text-xs text-stone-500 mt-2">
            Última atualização: Setembro de 2026 • Versão 2026-09-v1
          </p>
        </div>

        <section className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4 text-xs text-stone-700 leading-relaxed">
          <h2 className="text-sm font-semibold text-stone-900">1. Princípio de Minimização</h2>
          <p>
            A Meqyro adota uma política estrita de privacidade por design (Privacy by Design). Não
            utilizamos cookies de terceiros intrusivos, rastreadores comportamentais entre sites ou
            redes de publicidade direcionada.
          </p>

          <h2 className="text-sm font-semibold text-stone-900 pt-2">
            2. Cookies Estritamente Necessários
          </h2>
          <p>
            Para que você consiga responder aos quizzes, salvar seu progresso sem necessidade de
            criar conta com senha e acessar seus resultados de forma segura, utilizamos
            exclusivamente os seguintes cookies:
          </p>

          <div className="border border-stone-200 rounded-lg overflow-hidden my-3">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-700 border-b border-stone-200 font-medium">
                <tr>
                  <th className="p-2.5">Nome</th>
                  <th className="p-2.5">Finalidade</th>
                  <th className="p-2.5">Duração</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <td className="p-2.5 font-mono text-[11px]">meqyro_session</td>
                  <td className="p-2.5">
                    Identificador de sessão anônima criptografado (HttpOnly, Secure) para cálculo e
                    persistência das respostas.
                  </td>
                  <td className="p-2.5">30 dias</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono text-[11px]">meqyro_locale</td>
                  <td className="p-2.5">
                    Armazena sua preferência manual de idioma (PT, EN, ES, FR).
                  </td>
                  <td className="p-2.5">1 ano</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono text-[11px]">meqyro_market</td>
                  <td className="p-2.5">
                    Armazena sua preferência manual de moeda e mercado de pagamento (BR, US, EU,
                    GB).
                  </td>
                  <td className="p-2.5">1 ano</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-sm font-semibold text-stone-900 pt-2">3. Como gerenciar cookies</h2>
          <p>
            Você pode desativar ou apagar cookies a qualquer momento nas configurações do seu
            navegador de internet. Note que, ao desativar o cookie essencial{" "}
            <code className="bg-stone-100 px-1 py-0.5 rounded">meqyro_session</code>, não será
            possível manter seu progresso entre as perguntas do desafio.
          </p>

          <h2 className="text-sm font-semibold text-stone-900 pt-2">4. Dúvidas</h2>
          <p>
            Para quaisquer questões relacionadas ao tratamento de dados e cookies, entre em contato
            com nosso Encarregado através do e-mail{" "}
            <a href="mailto:privacy@meqyro.com" className="underline font-medium text-stone-900">
              privacy@meqyro.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
