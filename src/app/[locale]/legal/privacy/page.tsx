import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shield, Clock, UserCheck } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { CURRENT_POLICY_VERSION } from "@/features/privacy/contracts";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPolicyPage({ params }: PageProps) {
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
          <Shield size={28} className="text-forest" />
          <h1>Política de Privacidade e Proteção de Dados</h1>
          <p className="policy-version-badge">
            Versão: {CURRENT_POLICY_VERSION} · Vigência: Setembro de 2026
          </p>
        </div>
      </header>

      <article className="legal-content">
        <section>
          <h2>1. Compromisso e Princípios</h2>
          <p>
            A <strong>Meqyro</strong> adota a privacidade por design e por padrão (
            <em>Privacy by Design and by Default</em>). Tratamos seus dados com estrita finalidade,
            transparência e segurança, observando a Lei Geral de Proteção de Dados (LGPD — Lei nº
            13.709/2018) e o Regulamento Geral de Proteção de Dados da União Europeia (GDPR — Reg.
            2016/679).
          </p>
          <p>
            Nossos testes cognitivos e psicométricos são desenvolvidos para autoconhecimento e
            reflexão pessoal.
            <strong> Nunca comercializamos seus dados com terceiros</strong>, nem os utilizamos para
            decisões de crédito, emprego ou diagnóstico clínico.
          </p>
        </section>

        <section>
          <h2>2. Bases Legais e Finalidades do Tratamento</h2>
          <div className="legal-table-wrapper">
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Dado Coletado</th>
                  <th>Finalidade Específica</th>
                  <th>Base Legal Aplicável</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Cookie de Sessão</strong>
                  </td>
                  <td>
                    Executar o quiz, permitir navegação entre questões e retomada de progresso.
                  </td>
                  <td>
                    Necessidade para execução do serviço solicitado (estritamente necessário).
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Respostas e Pontuação</strong>
                  </td>
                  <td>Calcular os resultados psicométricos e gerar sumários e relatórios.</td>
                  <td>Execução do contrato / serviço solicitado.</td>
                </tr>
                <tr>
                  <td>
                    <strong>E-mail de Entrega</strong>
                  </td>
                  <td>
                    Salvar seu resultado, emitir link de recuperação segura e recibo de compra.
                  </td>
                  <td>Execução do contrato / fornecimento do resultado solicitado.</td>
                </tr>
                <tr>
                  <td>
                    <strong>Comunicações Promocionais</strong>
                  </td>
                  <td>Envio de novidades editoriais, lançamentos de testes e descontos.</td>
                  <td>
                    <strong>Consentimento explícito e separado</strong> (desmarcado por padrão,
                    revogável a qualquer momento).
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Telemetria Pseudonimizada</strong>
                  </td>
                  <td>
                    Garantir integridade do serviço, prevenção a fraude e monitoramento de falhas.
                  </td>
                  <td>Legítimo interesse do controlador.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>3. Prazos de Retenção de Dados</h2>
          <div className="retention-grid">
            <div className="retention-card">
              <Clock size={20} className="text-forest" />
              <h3>Sessão sem e-mail cadastrado</h3>
              <p>
                Exclusão automática de tokens e respostas em <strong>30 dias</strong> após a
                inatividade.
              </p>
            </div>
            <div className="retention-card">
              <Clock size={20} className="text-forest" />
              <h3>Resultado gratuito vinculado a e-mail</h3>
              <p>
                Retido por até <strong>12 meses</strong> a partir do último acesso, para permitir
                recuperação.
              </p>
            </div>
            <div className="retention-card">
              <Clock size={20} className="text-forest" />
              <h3>Resultado e relatório premium</h3>
              <p>
                Acesso vitalício garantido por até <strong>24 meses</strong>; registro contábil
                preservado conforme legislação fiscal.
              </p>
            </div>
            <div className="retention-card">
              <Clock size={20} className="text-forest" />
              <h3>Histórico de consentimento e opt-out</h3>
              <p>
                Preservado por <strong>5 anos</strong> em log imutável de auditoria jurídica.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>4. Direitos dos Titulares de Dados</h2>
          <p>
            Você tem total controle sobre seus dados pessoais. A qualquer momento, você pode exercer
            os seguintes direitos:
          </p>
          <ul className="legal-list">
            <li>
              <strong>Confirmação e Acesso:</strong> saber quais dados Meqyro possui sobre você.
            </li>
            <li>
              <strong>Correção:</strong> retificar e-mails ou preferências de contato.
            </li>
            <li>
              <strong>Portabilidade e Exportação:</strong> receber uma cópia estruturada dos seus
              resultados.
            </li>
            <li>
              <strong>Eliminação e Esquecimento:</strong> solicitar a exclusão definitiva dos seus
              dados e pontuações associadas.
            </li>
            <li>
              <strong>Revogação do Consentimento:</strong> cancelar o recebimento de e-mails
              promocionais em 1 clique via link de descadastramento.
            </li>
          </ul>

          <div className="data-request-cta">
            <UserCheck size={20} className="text-blue" />
            <div>
              <strong>Deseja exercer seus direitos de privacidade?</strong>
              <p>
                Você pode abrir uma solicitação de acesso, exportação ou exclusão de dados
                diretamente pelo nosso canal automatizado.
              </p>
            </div>
            <Link href={`/${locale}/privacy/data-request`} className="button button--secondary">
              Solicitar Dados
            </Link>
          </div>
        </section>

        <section>
          <h2>5. Encarregado pelo Tratamento de Dados (DPO)</h2>
          <p>
            Para esclarecer dúvidas sobre esta Política ou contatar nosso Encarregado de Proteção de
            Dados, envie um e-mail para:
            <br />
            <strong>dpo@meqyro.com</strong>
          </p>
        </section>
      </article>
    </main>
  );
}
