import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  ShieldAlert,
  Layers,
  CheckCircle2,
  Lock,
  ArrowRight,
  Database,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getAdminApiSecret } from "@/lib/config/env";
import { timingSafeEqual } from "node:crypto";
import { createSupabaseSecretClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Operations & Catalog Inspection | Meqyro",
    description: "Internal operations overview and metrics inspection.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

type AdminPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ token?: string }>;
};

export default async function AdminPage({ params, searchParams }: AdminPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const query = searchParams ? await searchParams : {};
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("meqyro_admin_session")?.value;

  const candidateToken = query.token || sessionCookie;

  let adminSecret: string | undefined;
  try {
    adminSecret = getAdminApiSecret();
  } catch {
    adminSecret = undefined;
  }

  const isConfigured = Boolean(adminSecret && adminSecret.length >= 16);
  let isAuthorized = false;

  if (isConfigured && candidateToken && adminSecret) {
    const candBuf = Buffer.from(candidateToken);
    const secBuf = Buffer.from(adminSecret);
    if (candBuf.length === secBuf.length && timingSafeEqual(candBuf, secBuf)) {
      isAuthorized = true;
    }
  }

  // If not authorized, render login gate
  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Painel de Operações</h1>
            <p className="text-xs text-slate-400">
              Acesso restrito à equipe técnica e administrativa do Meqyro.
            </p>
          </div>

          {!isConfigured ? (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                ADMIN_API_SECRET não está configurado nas variáveis de ambiente do servidor.
              </span>
            </div>
          ) : (
            <form method="GET" action={`/${locale}/admin`} className="space-y-4">
              <div>
                <label
                  htmlFor="token"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5"
                >
                  Token de Acesso Administrativo
                </label>
                <input
                  id="token"
                  name="token"
                  type="password"
                  required
                  placeholder="Insira o token de autorização..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition shadow"
              >
                Autenticar e Entrar
              </button>
            </form>
          )}

          <div className="text-center pt-2">
            <Link
              href={`/${locale}`}
              className="text-xs text-slate-500 hover:text-slate-300 transition"
            >
              Voltar ao site público
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Fetch real operational metrics from Supabase
  const supabase = createSupabaseSecretClient();

  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("id, slug, product_code, active, created_at")
    .order("created_at", { ascending: true })
    .limit(20);

  const { count: sessionCount } = await supabase
    .from("quiz_sessions")
    .select("id", { count: "exact", head: true });

  const { count: leadCount } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true });

  const { count: orderCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true });

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, order_number, amount, currency, status, payment_provider, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              Operações & Governança — Autenticado
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Painel de Operações Meqyro
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Catálogo, integridade de transações, contabilidade e governança de privacidade.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}`}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-slate-200 hover:bg-slate-800 transition"
            >
              Ir para o Site
            </Link>
          </div>
        </div>

        {/* Real KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Quizzes no Catálogo</span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white">{quizzes?.length ?? 0} produtos</div>
            <p className="text-xs text-slate-400 mt-1">Registrados no banco</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Sessões Registradas</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">{sessionCount ?? 0}</div>
            <p className="text-xs text-slate-400 mt-1">Total de sessões</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Leads Capturados</span>
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">{leadCount ?? 0}</div>
            <p className="text-xs text-slate-400 mt-1">Com consentimento auditado</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
              <span>Pedidos Totais</span>
              <DollarSign className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{orderCount ?? 0}</div>
            <p className="text-xs text-slate-400 mt-1">Transações registradas</p>
          </div>
        </div>

        {/* Quizzes Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Catálogo de Quizzes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/60 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {(quizzes ?? []).map((q) => (
                  <tr key={q.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-medium text-white">{q.slug}</td>
                    <td className="px-4 py-3 text-slate-400">{q.product_code}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          q.active
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {q.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/${locale}/quizzes/${q.slug}`}
                        className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
                      >
                        Landing <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders (no emails leaked) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Últimos Pedidos</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-950/60 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Número</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Provedor</th>
                  <th className="px-4 py-3">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {(recentOrders ?? []).map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono text-white text-xs">{o.order_number}</td>
                    <td className="px-4 py-3">
                      {(o.amount / 100).toFixed(2)} {o.currency}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          o.status === "FULFILLED" || o.status === "PAID"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : o.status === "REFUNDED"
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{o.payment_provider}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {new Date(o.created_at).toLocaleString(locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
