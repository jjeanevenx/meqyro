import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Heart, Lock } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/features/seo/metadata-builder";
import { ButtonLink } from "@/components/ui/button-link";

type CoupleInvitePageProps = {
  params: Promise<{ locale: string; code: string }>;
};

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
    description: "Você foi convidado(a) para responder ao CoupleDNA e comparar sua compatibilidade.",
    isPrivate: true,
  });
}

export default async function CoupleInvitePage({ params }: CoupleInvitePageProps) {
  const { locale, code } = await params;
  if (!isLocale(locale)) notFound();

  const formattedCode = code.toUpperCase();

  const copy: Record<
    Locale,
    {
      badge: string;
      title: string;
      desc: string;
      privacyNote: string;
      cta: string;
      steps: [string, string, string];
    }
  > = {
    pt: {
      badge: "Convite para Casal",
      title: "Seu par convidou você para o CoupleDNA",
      desc: "Descubra como seus valores de vida, estilo de comunicação, finanças e planos futuros se alinham.",
      privacyNote: "Suas respostas individuais permanecem confidenciais. Apenas o índice de sintonia bilateral será comparado.",
      cta: "Começar meu teste agora",
      steps: [
        "Você responde a 25 perguntas rápidas (6 min).",
        "Ambos confirmam o consentimento mútuo de compartilhamento.",
        "O relatório conjunto revela onde vocês combinam e tópicos para conversar.",
      ],
    },
    en: {
      badge: "Couple Invite",
      title: "Your partner invited you to CoupleDNA",
      desc: "Discover how your communication styles, core values, finances, and future plans align.",
      privacyNote: "Your individual answers remain strictly confidential. Only bilateral alignment scores are revealed.",
      cta: "Start my assessment",
      steps: [
        "Answer 25 quick prompts (around 6 min).",
        "Both partners confirm mutual consent.",
        "The joint report reveals synergy areas and talking points.",
      ],
    },
    es: {
      badge: "Invitación en Pareja",
      title: "Tu pareja te ha invitado a CoupleDNA",
      desc: "Descubre cómo se alinean sus valores esenciales, comunicación, finanzas y planes a futuro.",
      privacyNote: "Tus respuestas individuales son confidenciales. Solo se compara el grado de armonía bilateral.",
      cta: "Comenzar mi reto ahora",
      steps: [
        "Responde 25 preguntas ágiles (6 min).",
        "Ambos confirman el consentimiento mutuo.",
        "El informe conjunto muestra dónde coinciden y temas de diálogo.",
      ],
    },
    fr: {
      badge: "Invitation de Couple",
      title: "Votre partenaire vous invite sur CoupleDNA",
      desc: "Découvrez vos harmonies en matière de communication, valeurs de vie, finances et projets d'avenir.",
      privacyNote: "Vos réponses restent confidentielles. Seule l'adéquation bilatérale est révélée.",
      cta: "Commencer mon test",
      steps: [
        "Répondez à 25 affirmations simples (6 min).",
        "Chacun confirme son accord bilatéral.",
        "Le rapport mutuel met en lumière vos forces et pistes d'échange.",
      ],
    },
  };

  const text = copy[locale as Locale];

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
          <p className="text-xs text-stone-600 leading-relaxed">
            {text.desc}
          </p>
        </div>

        {/* 3 Steps */}
        <div className="text-left bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Como funciona:
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

        <p className="text-[11px] text-stone-400">
          Meqyro CoupleDNA • Sem cadastro ou criação de senha necessária
        </p>
      </div>
    </main>
  );
}
