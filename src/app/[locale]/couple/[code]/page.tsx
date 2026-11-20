import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertCircle, Heart, Lock } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/features/seo/metadata-builder";
import { ButtonLink } from "@/components/ui/button-link";
import { validateInviteForRedemption } from "@/features/couple/couple-invite-service";
import { createSupabaseSecretClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type CoupleInvitePageProps = {
  params: Promise<{ locale: string; code: string }>;
};

async function checkInviteAvailability(
  code: string,
): Promise<{ available: boolean; reason?: "ALREADY_REDEEMED" | "EXPIRED" | "UNAVAILABLE" }> {
  try {
    const slotCheck = await validateInviteForRedemption(code);
    if (slotCheck.isValid) {
      return { available: true };
    }
    if (slotCheck.reason && slotCheck.reason !== "NOT_FOUND") {
      if (slotCheck.reason === "ALREADY_REDEEMED") {
        return { available: false, reason: "ALREADY_REDEEMED" };
      }
      if (slotCheck.reason === "EXPIRED") {
        return { available: false, reason: "EXPIRED" };
      }
      return { available: false, reason: "UNAVAILABLE" };
    }

    // Fallback for legacy bilateral invites in couple_invites
    const db = createSupabaseSecretClient();
    const { data: legacyInvite } = await db
      .from("couple_invites")
      .select("id, status, partner_session_id, expires_at")
      .eq("invite_code", code)
      .maybeSingle();

    if (!legacyInvite) {
      return { available: false, reason: "UNAVAILABLE" };
    }
    if (legacyInvite.partner_session_id) {
      return { available: false, reason: "ALREADY_REDEEMED" };
    }
    if (
      legacyInvite.status === "EXPIRED" ||
      new Date(legacyInvite.expires_at as string) <= new Date()
    ) {
      return { available: false, reason: "EXPIRED" };
    }
    if (legacyInvite.status !== "PENDING") {
      return { available: false, reason: "UNAVAILABLE" };
    }

    return { available: true };
  } catch {
    return { available: false, reason: "UNAVAILABLE" };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}): Promise<Metadata> {
  const { locale, code } = await params;
  if (!isLocale(locale)) return {};

  const titles: Record<Locale, string> = {
    pt: "Convite CoupleDNA — Compatibilidade a Dois | Meqyro",
    en: "CoupleDNA Invitation — Partner Compatibility | Meqyro",
    es: "Invitación CoupleDNA — Compatibilidad en Pareja | Meqyro",
    fr: "Invitation CoupleDNA — Compatibilité de Couple | Meqyro",
  };

  return buildPageMetadata({
    locale,
    path: `/couple/${code}`,
    title: titles[locale as Locale],
    description:
      "Você foi convidado(a) para responder ao CoupleDNA e comparar sua compatibilidade.",
    isPrivate: true,
  });
}

export default async function CoupleInvitePage({ params }: CoupleInvitePageProps) {
  const { locale, code } = await params;
  if (!isLocale(locale)) notFound();

  const formattedCode = code.trim().toUpperCase();
  const availability = await checkInviteAvailability(formattedCode);

  const copy: Record<
    Locale,
    {
      badge: string;
      title: string;
      desc: string;
      privacyNote: string;
      cta: string;
      howItWorks: string;
      footer: string;
      steps: [string, string, string];
      alreadyRedeemedTitle: string;
      alreadyRedeemedDesc: string;
      unavailableTitle: string;
      unavailableDesc: string;
      ownTestCta: string;
    }
  > = {
    pt: {
      badge: "Convite para Casal",
      title: "Seu par convidou você para o CoupleDNA",
      desc: "Descubra como seus valores de vida, estilo de comunicação, finanças e planos futuros se alinham.",
      privacyNote:
        "Suas respostas individuais permanecem confidenciais. Apenas o índice de sintonia bilateral será comparado.",
      cta: "Começar meu teste agora",
      howItWorks: "Como funciona:",
      footer: "Meqyro CoupleDNA • Sem cadastro ou criação de senha necessária",
      steps: [
        "Você responde a 20 afirmações (6–9 min).",
        "Ambos confirmam o consentimento mútuo de compartilhamento.",
        "O relatório conjunto revela onde vocês combinam e tópicos para conversar.",
      ],
      alreadyRedeemedTitle: "Este convite já foi utilizado",
      alreadyRedeemedDesc:
        "Cada link de convite corresponde a uma única vaga individual e já foi resgatado por outro participante.",
      unavailableTitle: "Convite indisponível ou expirado",
      unavailableDesc:
        "Este código de convite não está ativo ou já expirou. Peça um novo link para a pessoa que convidou você.",
      ownTestCta: "Conhecer o CoupleDNA",
    },
    en: {
      badge: "Couple Invite",
      title: "Your partner invited you to CoupleDNA",
      desc: "Discover how your communication styles, core values, finances, and future plans align.",
      privacyNote:
        "Your individual answers remain strictly confidential. Only bilateral alignment scores are revealed.",
      cta: "Start my assessment",
      howItWorks: "How it works:",
      footer: "Meqyro CoupleDNA • No account or password required",
      steps: [
        "Answer 20 statements (6–9 min).",
        "Both partners confirm mutual consent.",
        "The joint report reveals synergy areas and talking points.",
      ],
      alreadyRedeemedTitle: "This invitation has already been used",
      alreadyRedeemedDesc:
        "Each invitation link corresponds to a single individual slot and has already been redeemed.",
      unavailableTitle: "Invitation unavailable or expired",
      unavailableDesc:
        "This invitation code is not active or has expired. Ask the person who invited you for a new link.",
      ownTestCta: "Explore CoupleDNA",
    },
    es: {
      badge: "Invitación en Pareja",
      title: "Tu pareja te ha invitado a CoupleDNA",
      desc: "Descubre cómo se alinean sus valores esenciales, comunicación, finanzas y planes a futuro.",
      privacyNote:
        "Tus respuestas individuales son confidenciales. Solo se compara el grado de armonía bilateral.",
      cta: "Comenzar mi reto ahora",
      howItWorks: "Cómo funciona:",
      footer: "Meqyro CoupleDNA • Sin registro ni contraseña requerida",
      steps: [
        "Responde 20 afirmaciones (6–9 min).",
        "Ambos confirman el consentimiento mutuo.",
        "El informe conjunto muestra dónde coinciden y temas de diálogo.",
      ],
      alreadyRedeemedTitle: "Esta invitación ya fue utilizada",
      alreadyRedeemedDesc:
        "Cada enlace de invitación corresponde a un único cupo individual y ya ha sido canjeado.",
      unavailableTitle: "Invitación no disponible o expirada",
      unavailableDesc:
        "Este código de invitación no está activo o ha expirado. Solicita un nuevo enlace a quien te invitó.",
      ownTestCta: "Conocer CoupleDNA",
    },
    fr: {
      badge: "Invitation de Couple",
      title: "Votre partenaire vous invite sur CoupleDNA",
      desc: "Découvrez vos harmonies en matière de communication, valeurs de vie, finances et projets d'avenir.",
      privacyNote:
        "Vos réponses restent confidentielles. Seule l'adéquation bilatérale est révélée.",
      cta: "Commencer mon test",
      howItWorks: "Comment ça fonctionne :",
      footer: "Meqyro CoupleDNA • Aucune inscription ni mot de passe requis",
      steps: [
        "Répondez à 20 affirmations (6–9 min).",
        "Chacun confirme son accord bilatéral.",
        "Le rapport mutuel met en lumière vos forces et pistes d'échange.",
      ],
      alreadyRedeemedTitle: "Cette invitation a déjà été utilisée",
      alreadyRedeemedDesc:
        "Chaque lien d'invitation correspond à une seule place individuelle et a déjà été utilisé.",
      unavailableTitle: "Invitation indisponible ou expirée",
      unavailableDesc:
        "Ce code d'invitation n'est pas actif ou a expiré. Demandez un nouveau lien à la personne qui vous a invité(e).",
      ownTestCta: "Découvrir CoupleDNA",
    },
  };

  const text = copy[locale as Locale];

  if (!availability.available) {
    const isRedeemed = availability.reason === "ALREADY_REDEEMED";
    return (
      <main className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-stone-200 rounded-3xl p-8 shadow-sm text-center space-y-6">
          <div className="inline-flex p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 mx-auto">
            <AlertCircle size={28} />
          </div>
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold uppercase tracking-wider">
              {text.badge} • {formattedCode}
            </span>
            <h1 className="text-2xl font-serif font-bold text-stone-900 leading-snug">
              {isRedeemed ? text.alreadyRedeemedTitle : text.unavailableTitle}
            </h1>
            <p className="text-xs text-stone-600 leading-relaxed" role="alert">
              {isRedeemed ? text.alreadyRedeemedDesc : text.unavailableDesc}
            </p>
          </div>
          <div>
            <ButtonLink href={`/${locale}/quizzes/coupledna`} variant="secondary">
              {text.ownTestCta}
            </ButtonLink>
          </div>
          <p className="text-[11px] text-stone-400">{text.footer}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white border border-stone-200 rounded-3xl p-8 shadow-sm text-center space-y-6">
        <div className="inline-flex p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 mx-auto">
          <Heart size={28} />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold uppercase tracking-wider">
            {text.badge} • {formattedCode}
          </span>
          <h1 className="text-2xl font-serif font-bold text-stone-900 leading-snug">
            {text.title}
          </h1>
          <p className="text-xs text-stone-600 leading-relaxed">{text.desc}</p>
        </div>

        {/* 3 Steps */}
        <div className="text-left bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
            {text.howItWorks}
          </span>
          <ol className="space-y-2 text-xs text-stone-600">
            {text.steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-semibold text-stone-900">{idx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Privacy Note */}
        <div className="flex items-center gap-2 text-[11px] text-stone-500 bg-stone-50/70 p-3 rounded-xl border border-stone-100 text-left">
          <Lock size={15} className="text-stone-400 shrink-0" />
          <span>{text.privacyNote}</span>
        </div>

        <div>
          <ButtonLink
            href={`/${locale}/quizzes/coupledna/play?invite=${formattedCode}`}
            variant="primary"
          >
            {text.cta}
          </ButtonLink>
        </div>

        <p className="text-[11px] text-stone-400">{text.footer}</p>
      </div>
    </main>
  );
}
