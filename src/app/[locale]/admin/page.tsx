import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ShieldAlert,
  Activity,
  Layers,
  DollarSign,
  CheckCircle2,
  ExternalLink,
  Package,
  Globe2,
} from "lucide-react";
import { isLocale, locales } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/features/seo/metadata-builder";
import { BUNDLE_PRICES } from "@/lib/market/prices";

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

  return buildPageMetadata({
    locale,
    path: "/admin",
    title: "Operations & Catalog Inspection | Meqyro",
    description: "Internal operations overview and minimal metrics inspection.",
  });
}

const ALL_QUIZZES = [
  { slug: "brainrank", code: "BRAINRANK", name: "BrainRank", category: "Cognitivo", active: true, items: 20 },
  { slug: "personality-map", code: "PERSONALITY_MAP", name: "Personality Map", category: "Personalidade", active: true, items: 25 },
  { slug: "careerfit", code: "CAREERFIT", name: "CareerFit", category: "Carreira", active: true, items: 18 },
  { slug: "moneydna", code: "MONEYDNA", name: "MoneyDNA", category: "Finanças", active: true, items: 16 },
  { slug: "focusstyle", code: "FOCUSSTYLE", name: "FocusStyle", category: "Produtividade", active: true, items: 15 },
  { slug: "decisiondna", code: "DECISIONDNA", name: "DecisionDNA", category: "Decisão", active: true, items: 16 },
  { slug: "coupledna", code: "COUPLEDNA", name: "CoupleDNA", category: "Relacionamentos", active: true, items: 20 },
];

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              Operações & Governança — Seção 55
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Painel de Operações Meqyro
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Inspeção de catálogo, precificação regional, bundles e conformidade de arquitetura.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/api/admin/metrics`}
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-slate-200 hover:bg-slate-800 transition"
            >
              <span>API JSON Metrics</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Quick KPI Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Testes Ativos</span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white">7 / 7</div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 100% disponíveis
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Mercados Regionais</span>
              <Globe2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">4 Mercados</div>
            <p className="text-xs text-slate-400 mt-1">BR (BRL), US (USD), EU (EUR), GB (GBP)</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Gateways Ativos</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">InfinitePay + Stripe</div>
            <p className="text-xs text-slate-400 mt-1">Roteamento por moeda e país</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Privacidade & RLS</span>
              <Activity className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">Ativa</div>
            <p className="text-xs text-slate-400 mt-1">Zero vazamento de PII / Paywall blindado</p>
          </div>
        </div>

        {/* Quizzes Table */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Catálogo de Testes (7 Quizzes)</h2>
              <p className="text-xs text-slate-400">Status operacional dos testes disponíveis para o público</p>
            </div>
            <Link
              href={`/${locale}/discover`}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
            >
              Ver no Catálogo Público <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Nome</th>
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3">Código Produto</th>
                  <th className="px-6 py-3">Categoria</th>
                  <th className="px-6 py-3">Itens</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {ALL_QUIZZES.map((q) => (
                  <tr key={q.slug} className="hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4 font-sans font-semibold text-white">{q.name}</td>
                    <td className="px-6 py-4 text-slate-400">{q.slug}</td>
                    <td className="px-6 py-4 text-indigo-300">{q.code}</td>
                    <td className="px-6 py-4 font-sans text-slate-300">{q.category}</td>
                    <td className="px-6 py-4 text-slate-400">{q.items} itens</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Ativo
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/${locale}/quizzes/${q.slug}/play`}
                        className="font-sans text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Jogar →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bundles Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
              <Package className="w-4 h-4" />
              <span>Discover Pack (3 Testes)</span>
            </div>
            <p className="text-xs text-slate-400">
              BrainRank + Personality Map + DecisionDNA
            </p>
            <div className="space-y-1 pt-2 border-t border-slate-800/60 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Brasil (BR):</span>
                <span className="font-semibold text-white">R$ {(BUNDLE_PRICES.BUNDLE_DISCOVER.BR / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>EUA (US):</span>
                <span className="font-semibold text-white">${(BUNDLE_PRICES.BUNDLE_DISCOVER.US / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Europa (EU):</span>
                <span className="font-semibold text-white">€{(BUNDLE_PRICES.BUNDLE_DISCOVER.EU / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Reino Unido (GB):</span>
                <span className="font-semibold text-white">£{(BUNDLE_PRICES.BUNDLE_DISCOVER.GB / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Package className="w-4 h-4" />
              <span>Life Pack (3 Testes)</span>
            </div>
            <p className="text-xs text-slate-400">
              CareerFit + MoneyDNA + FocusStyle
            </p>
            <div className="space-y-1 pt-2 border-t border-slate-800/60 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Brasil (BR):</span>
                <span className="font-semibold text-white">R$ {(BUNDLE_PRICES.BUNDLE_LIFE.BR / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>EUA (US):</span>
                <span className="font-semibold text-white">${(BUNDLE_PRICES.BUNDLE_LIFE.US / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Europa (EU):</span>
                <span className="font-semibold text-white">€{(BUNDLE_PRICES.BUNDLE_LIFE.EU / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Reino Unido (GB):</span>
                <span className="font-semibold text-white">£{(BUNDLE_PRICES.BUNDLE_LIFE.GB / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Package className="w-4 h-4" />
              <span>All Access (Todos os 7)</span>
            </div>
            <p className="text-xs text-slate-400">
              Acesso irrestrito aos 7 relatórios completos
            </p>
            <div className="space-y-1 pt-2 border-t border-slate-800/60 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Brasil (BR):</span>
                <span className="font-semibold text-white">R$ {(BUNDLE_PRICES.BUNDLE_ALL_ACCESS.BR / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>EUA (US):</span>
                <span className="font-semibold text-white">${(BUNDLE_PRICES.BUNDLE_ALL_ACCESS.US / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Europa (EU):</span>
                <span className="font-semibold text-white">€{(BUNDLE_PRICES.BUNDLE_ALL_ACCESS.EU / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Reino Unido (GB):</span>
                <span className="font-semibold text-white">£{(BUNDLE_PRICES.BUNDLE_ALL_ACCESS.GB / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
