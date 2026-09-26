import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, AlertTriangle } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { CURRENT_POLICY_VERSION } from "@/features/privacy/contracts";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function TermsOfServicePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main className="legal-page-container">
      <header className="legal-header">
        <Link href={`/${locale}`} className="back-link">
          <ArrowLeft size={16} />
          <span>Voltar ao início</span>
        </Link>
        <div className="policy-meta">
          <BookOpen size={28} className="text-forest" />
          <h1>Termos de Uso</h1>
          <p className="policy-version-badge">
            Versão: {CURRENT_POLICY_VERSION} · Vigência: Setembro de 2026
          </p>
        </div>
      </header>

      <article className="legal-content">
        <div className="disclaimer-alert">
          <AlertTriangle size={24} className="text-amber-600 shrink-0" />
          <div>
            <strong>Aviso Legal Importante:</strong>
            <p>
              Os testes, índices e relatórios oferecidos pela Meqyro destinam-se exclusivamente ao
              autoconhecimento, desenvolvimento pessoal e exploração intelectual. Eles{" "}
              <strong>
                não constituem avaliação psicológica clínica, diagnóstico médico, neurológico ou
                psiquiátrico
              </strong>{" "}
              e não substituem o acompanhamento de profissionais de saúde habilitados.
            </p>
          </div>
        </div>

        <section>
          <h2>1. Objeto e Aceitação</h2>
          <p>
            Estes Termos de Uso regulam o acesso e a utilização dos testes interativos, resumos
            gratuitos e relatórios premium fornecidos pela plataforma Meqyro. Ao iniciar um teste ou
            adquirir um relatório, você declara ter lido e concordado com estas regras.
          </p>
        </section>

        <section>
          <h2>2. Elegibilidade</h2>
          <p>
            O serviço é destinado a indivíduos com idade igual ou superior a{" "}
            <strong>16 anos</strong>. Indivíduos menores de 18 anos devem utilizar a plataforma sob
            supervisão ou com o consentimento dos responsáveis legais, conforme a legislação local
            aplicável.
          </p>
        </section>

        <section>
          <h2>3. Propriedade Intelectual</h2>
          <p>
            Todas as metodologias psicométricas proprietárias, algoritmos de pontuação, itens de
            teste, ilustrações, marcas e textos analíticos pertencem exclusivamente à Meqyro. É
            expressamente vedada a reprodução, redistribuição, engenharia reversa ou exploração
            comercial dos conteúdos sem autorização prévia por escrito.
          </p>
        </section>

        <section>
          <h2>4. Relatórios Premium e Pagamentos</h2>
          <p>
            A aquisição do relatório completo confere licença de uso pessoal e intransferível para
            visualização do conteúdo detalhado. Garantimos a devolução integral do valor pago caso
            você solicite o cancelamento no prazo de <strong>7 (sete) dias corridos</strong>
            após a compra, bastando enviar um e-mail com o número do pedido para{" "}
            <strong>suporte@meqyro.com</strong>.
          </p>
        </section>

        <section>
          <h2>5. Foro e Legislação Aplicável</h2>
          <p>
            Estes termos são regidos pelas leis da República Federativa do Brasil, sem prejuízo de
            direitos imperativos do consumidor nos países e mercados onde os serviços forem
            contratados.
          </p>
        </section>
      </article>
    </main>
  );
}
