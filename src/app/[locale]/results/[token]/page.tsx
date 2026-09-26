import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createHash } from "node:crypto";
import { isLocale } from "@/lib/i18n/config";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { buildPageMetadata } from "@/features/seo/metadata-builder";

function hashToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

type TokenResultPageProps = {
  params: Promise<{ locale: string; token: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return buildPageMetadata({
    locale,
    path: "/results",
    title: "Seu Resultado | Meqyro",
    description: "Acesse seu resultado salvo e análise detalhada no Meqyro.",
    isPrivate: true,
  });
}

export default async function TokenResultPage({ params }: TokenResultPageProps) {
  const { locale, token } = await params;

  if (!isLocale(locale)) notFound();

  const supabase = createSupabaseSecretClient();
  const tokenHash = hashToken(token);

  // 1. Check recovery_tokens
  const { data: recoveryRecord } = await supabase
    .from("recovery_tokens")
    .select("session_id, expires_at")
    .eq("token_hash", tokenHash)
    .single();

  let sessionId = recoveryRecord?.session_id;

  // 2. Fallback: check if token directly matches access_token_hash in quiz_sessions
  if (!sessionId) {
    const { data: sessionRecord } = await supabase
      .from("quiz_sessions")
      .select("id")
      .eq("access_token_hash", tokenHash)
      .single();

    if (sessionRecord) {
      sessionId = sessionRecord.id;
    }
  }

  if (!sessionId) {
    return (
      <main className="min-h-screen bg-stone-50 py-16 px-4">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Link de resultado inválido ou expirado
          </h1>
          <p className="text-stone-600 text-sm">
            O link de recuperação informado não foi encontrado ou expirou. Por favor, solicite um novo envio de e-mail ou inicie um novo teste.
          </p>
          <Link
            href={`/${locale}`}
            className="inline-block py-2.5 px-6 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </main>
    );
  }

  // Fetch session details
  const { data: session } = await supabase
    .from("quiz_sessions")
    .select("quiz_versions(quizzes(slug))")
    .eq("id", sessionId)
    .single();

  type SessionVersions = { quiz_versions?: { quizzes?: { slug?: string } } };
  const slug = (session as unknown as SessionVersions)?.quiz_versions?.quizzes?.slug ?? "brainrank";

  // Redirect to canonical quiz result page with authenticated query
  redirect(`/${locale}/quizzes/${slug}/result?session=${sessionId}&token=${token}`);
}
