import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { createSupabaseSecretClient } from "@/lib/supabase/server";
import { buildPageMetadata } from "@/features/seo/metadata-builder";
import { hashToken } from "@/features/privacy/consent-service";

export const dynamic = "force-dynamic";

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
    .select("session_id, expires_at, revoked_at")
    .eq("token_hash", tokenHash)
    .single();

  let sessionId: string | undefined;

  if (
    recoveryRecord &&
    !recoveryRecord.revoked_at &&
    new Date(recoveryRecord.expires_at) >= new Date()
  ) {
    sessionId = recoveryRecord.session_id;
  }

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
    const safeLocale: Locale = isLocale(locale) ? (locale as Locale) : "pt";
    const errorMap: Record<Locale, { title: string; body: string; back: string }> = {
      pt: {
        title: "Link de resultado inválido ou expirado",
        body: "O link de recuperação informado não foi encontrado ou expirou. Por favor, solicite um novo envio de e-mail ou inicie um novo teste.",
        back: "Voltar para a página inicial",
      },
      en: {
        title: "Invalid or expired result link",
        body: "The recovery link provided was not found or has expired. Please request a new link or start a new challenge.",
        back: "Back to Home",
      },
      es: {
        title: "Enlace de resultado no válido o caducado",
        body: "El enlace de recuperación no se encontró o ha caducado. Solicita un nuevo correo o inicia un nuevo test.",
        back: "Volver a la página principal",
      },
      fr: {
        title: "Lien de résultat invalide ou expiré",
        body: "Le lien de récupération est introuvable ou a expiré. Veuillez demander un nouvel e-mail ou démarrer un nouveau test.",
        back: "Retour à l'accueil",
      },
    };
    const errorMessages = errorMap[safeLocale];

    return (
      <main className="min-h-screen bg-stone-50 py-16 px-4">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h1 className="text-2xl font-serif font-bold text-stone-900">{errorMessages.title}</h1>
          <p className="text-stone-600 text-sm">{errorMessages.body}</p>
          <Link
            href={`/${locale}`}
            className="inline-block py-2.5 px-6 rounded-lg bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
          >
            {errorMessages.back}
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
