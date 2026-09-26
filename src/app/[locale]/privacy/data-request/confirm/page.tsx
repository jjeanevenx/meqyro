import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, AlertCircle, ArrowLeft, Download } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { confirmDataRequest } from "@/features/privacy/consent-service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Confirmação de Privacidade | Meqyro",
    robots: {
      index: false,
      follow: false,
    },
  };
}

const UI_TEXT: Record<
  Locale,
  {
    title: string;
    description: string;
    successExport: string;
    successDeletion: string;
    successRectification: string;
    downloadJson: string;
    errorTitle: string;
    backHome: string;
    noToken: string;
  }
> = {
  pt: {
    title: "Confirmação de Solicitação de Privacidade",
    description: "Validação segura do titular de dados (LGPD / GDPR).",
    successExport: "Sua solicitação de exportação de dados foi processada com sucesso.",
    successDeletion:
      "Seus dados foram excluídos e anonimizados com sucesso. Registros legais obrigatórios foram mantidos de forma descaracterizada.",
    successRectification:
      "Sua solicitação de retificação foi confirmada e encaminhada para o setor operacional.",
    downloadJson: "Baixar Dados (JSON)",
    errorTitle: "Não foi possível confirmar a solicitação",
    backHome: "Voltar para o início",
    noToken: "Token de confirmação não fornecido. Por favor, utilize o link recebido por e-mail.",
  },
  en: {
    title: "Privacy Request Confirmation",
    description: "Secure data subject verification (GDPR / CCPA / LGPD).",
    successExport: "Your data export request has been processed successfully.",
    successDeletion:
      "Your personal data has been deleted and anonymized. Legally required records are retained in anonymized form.",
    successRectification: "Your rectification request has been verified and registered.",
    downloadJson: "Download Data (JSON)",
    errorTitle: "Unable to confirm request",
    backHome: "Back to Home",
    noToken: "Confirmation token missing. Please use the link sent to your email address.",
  },
  es: {
    title: "Confirmación de Solicitud de Privacidad",
    description: "Verificación segura del titular de datos (GDPR / LGPD).",
    successExport: "Su solicitud de exportación de datos ha sido procesada con éxito.",
    successDeletion: "Sus datos personales han sido eliminados y anonimizados con éxito.",
    successRectification: "Su solicitud de rectificación ha sido confirmada.",
    downloadJson: "Descargar Datos (JSON)",
    errorTitle: "No se pudo confirmar la solicitud",
    backHome: "Volver al inicio",
    noToken: "Token de confirmación ausente. Utilice el enlace recibido por correo electrónico.",
  },
  fr: {
    title: "Confirmation de Demande de Confidentialité",
    description: "Vérification sécurisée du titulaire des données (RGPD / LGPD).",
    successExport: "Votre demande d'exportation de données a été traitée avec succès.",
    successDeletion: "Vos données personnelles ont été supprimées et anonymisées avec succès.",
    successRectification: "Votre demande de rectification a été confirmée.",
    downloadJson: "Télécharger les données (JSON)",
    errorTitle: "Impossible de confirmer la demande",
    backHome: "Retour à l'accueil",
    noToken: "Jeton de confirmation manquant. Veuillez utiliser le lien reçu par e-mail.",
  },
};

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ token?: string }>;
};

export default async function DataRequestConfirmPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const query = searchParams ? await searchParams : {};
  const token = query.token;
  const t = UI_TEXT[locale as Locale];

  if (!token) {
    return (
      <main className="min-h-screen bg-stone-50 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-stone-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-serif font-bold text-stone-900">{t.errorTitle}</h1>
          <p className="text-sm text-stone-600">{t.noToken}</p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition"
          >
            {t.backHome}
          </Link>
        </div>
      </main>
    );
  }

  const result = await confirmDataRequest(token);

  if (!result.success) {
    return (
      <main className="min-h-screen bg-stone-50 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-stone-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-serif font-bold text-stone-900">{t.errorTitle}</h1>
          <p className="text-sm text-stone-600">{result.error}</p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition"
          >
            {t.backHome}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 py-16 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-2xl p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">{t.title}</h1>
          <p className="text-sm text-stone-600">{t.description}</p>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-emerald-950 text-sm">
          {result.requestType === "EXPORT" && t.successExport}
          {result.requestType === "DELETION" && t.successDeletion}
          {result.requestType === "RECTIFICATION" && t.successRectification}
        </div>

        {result.requestType === "EXPORT" && "exportData" in result && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Dados Exportados (JSON)
            </h2>
            <pre className="p-4 rounded-xl bg-stone-900 text-stone-100 text-xs overflow-x-auto max-h-60 leading-relaxed font-mono">
              {JSON.stringify(result.exportData, null, 2)}
            </pre>
            <a
              href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(result.exportData, null, 2))}`}
              download={`meqyro-data-export-${new Date().toISOString().slice(0, 10)}.json`}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition"
            >
              <Download className="w-4 h-4" />
              <span>{t.downloadJson}</span>
            </a>
          </div>
        )}

        <div className="pt-4 border-t border-stone-100 text-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backHome}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
