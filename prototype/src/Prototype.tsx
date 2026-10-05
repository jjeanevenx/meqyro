import { useMemo, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BarChartIcon,
  CheckCircledIcon,
  ClockIcon,
  CubeIcon,
  EyeOpenIcon,
  LightningBoltIcon,
  LockClosedIcon,
  MagicWandIcon,
} from "@radix-ui/react-icons";
import {
  FlowStack,
  MobileScroll,
  MobileTextField,
  type FlowControls,
  type FlowScreen,
} from "./mobile";

const dimensions = [
  { label: "Padrões", icon: <MagicWandIcon /> },
  { label: "Lógica", icon: <CubeIcon /> },
  { label: "Números", icon: <BarChartIcon /> },
  { label: "Atenção", icon: <EyeOpenIcon /> },
  { label: "Problemas", icon: <CheckCircledIcon /> },
  { label: "Velocidade", icon: <LightningBoltIcon /> },
];

const questions = [
  {
    title: "Qual número completa a sequência?",
    clue: "2 · 6 · 12 · 20 · ?",
    options: ["26", "28", "30", "32"],
  },
  {
    title: "Qual palavra não pertence ao grupo?",
    clue: "Observe a relação entre as quatro opções.",
    options: ["Círculo", "Quadrado", "Azul", "Triângulo"],
  },
  {
    title: "Se todo Nilo é Vero, qual afirmação é segura?",
    clue: "Use apenas as informações apresentadas.",
    options: ["Todo Vero é Nilo", "Algum Nilo é Vero", "Nenhum Vero é Nilo", "Todo Nilo é azul"],
  },
];

function Header({ flow, step }: { flow: FlowControls; step?: string }) {
  return (
    <div className="flow-toolbar">
      <button className="icon-button" aria-label="Voltar" onClick={flow.pop}>
        <ArrowLeftIcon />
      </button>
      <span className="toolbar-wordmark">MEQYRO</span>
      <span className="toolbar-step">{step ?? "BrainRank"}</span>
    </div>
  );
}

function Landing({ flow }: { flow: FlowControls }) {
  return (
    <MobileScroll className="app-screen landing-screen">
      <main className="landing-content" data-testid="brainrank-landing">
        <header className="brand-row">
          <span className="wordmark">
            MEQ<span>Y</span>RO
          </span>
          <button className="locale-button" aria-label="Idioma e país">
            PT · BR⌄
          </button>
        </header>
        <section className="hero-copy">
          <p className="eyebrow">
            <span /> MENTE EM
            <br />
            NOVAS PERSPECTIVAS
          </p>
          <h1>
            <span>Brain</span>Rank
          </h1>
          <h2>
            Descubra como
            <br />
            você raciocina.
          </h2>
          <p className="lede">
            24 desafios para revelar seus padrões de lógica, atenção e resolução de problemas.
          </p>
        </section>
        <img
          className="hero-image"
          src="/assets/meqyro/brainrank-cognitive-field.png"
          alt="Perfil humano com linhas e pontos que representam conexões de raciocínio"
          draggable={false}
        />
        <div className="facts" aria-label="Informações do desafio">
          <span>
            <ClockIcon />
            <strong>7–10 min</strong>
          </span>
          <i />
          <span>
            <BarChartIcon />
            Resultado
            <br />
            básico grátis
          </span>
        </div>
        <p className="perspective-line">
          DIFERENTES ÂNGULOS.
          <br />
          UM MESMO VOCÊ.
        </p>
        <div className="dimension-grid">
          {dimensions.map((item) => (
            <div className="dimension" key={item.label}>
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <button className="primary-button" onClick={() => flow.push(questionScreen(0))}>
          Começar o desafio <ArrowRightIcon />
        </button>
        <p className="trust-note">
          <LockClosedIcon /> Sem cadastro. Não é um teste clínico de QI.
        </p>
        <div className="landing-footer-line">
          <span /> RACIOCÍNIO PARA UM AMANHÃ MAIS SEU.
        </div>
      </main>
    </MobileScroll>
  );
}

function Question({ flow, index }: { flow: FlowControls; index: number }) {
  const [selected, setSelected] = useState<string | null>(null);
  const q = questions[index];
  const progress = ((index + 1) / 24) * 100;
  return (
    <MobileScroll className="app-screen">
      <main className="question-screen">
        <div className="progress-meta">
          <span>{index + 1} de 24</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="progress-track">
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className="question-kicker">DESAFIO {String(index + 1).padStart(2, "0")}</p>
        <h1>{q.title}</h1>
        <p className="question-clue">{q.clue}</p>
        <div className="answer-list" role="radiogroup" aria-label="Alternativas">
          {q.options.map((option, optionIndex) => (
            <button
              key={option}
              className={selected === option ? "answer selected" : "answer"}
              role="radio"
              aria-checked={selected === option}
              onClick={() => setSelected(option)}
            >
              <span>{String.fromCharCode(65 + optionIndex)}</span>
              {option}
            </button>
          ))}
        </div>
        <button
          className="primary-button question-next"
          disabled={!selected}
          onClick={() =>
            index < questions.length - 1
              ? flow.push(questionScreen(index + 1))
              : flow.push(emailScreen)
          }
        >
          Continuar <ArrowRightIcon />
        </button>
        <p className="demo-note">Protótipo reduzido: 3 de 24 desafios</p>
      </main>
    </MobileScroll>
  );
}

function EmailCapture({ flow }: { flow: FlowControls }) {
  const [consent, setConsent] = useState(false);
  return (
    <MobileScroll className="app-screen">
      <main className="form-screen">
        <p className="question-kicker">RESULTADO CALCULADO</p>
        <div className="success-orbit">
          <CheckCircledIcon />
        </div>
        <h1>
          Seu resultado
          <br />
          está pronto.
        </h1>
        <p>Onde devemos salvar seu resultado?</p>
        <MobileTextField
          id="result-email"
          label="E-mail"
          placeholder="seuemail@exemplo.com"
          testId="result-email"
        />
        <label className="consent-row">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
          />
          <span>Quero receber novos testes, desafios e ofertas da Meqyro.</span>
        </label>
        <button className="primary-button" onClick={() => flow.push(resultScreen)}>
          Ver meu resultado <ArrowRightIcon />
        </button>
        <p className="privacy-note">
          Usaremos seu e-mail para entregar e recuperar este resultado. Marketing é opcional.
        </p>
      </main>
    </MobileScroll>
  );
}

function FreeResult({ flow }: { flow: FlowControls }) {
  return (
    <MobileScroll className="app-screen">
      <main className="result-screen">
        <p className="question-kicker">SEU BRAINRANK</p>
        <div className="score-lockup">
          <strong>782</strong>
          <span>/ 1000</span>
        </div>
        <div className="score-track">
          <span />
        </div>
        <section className="strength-block">
          <span>SEU PONTO MAIS FORTE</span>
          <h1>
            Reconhecimento
            <br />
            de padrões
          </h1>
          <p>
            Você identifica relações visuais com consistência, especialmente quando a regra muda
            entre etapas.
          </p>
        </section>
        <section className="premium-list">
          <h2>Sua análise completa inclui</h2>
          <p>
            <CheckCircledIcon /> 6 dimensões detalhadas
          </p>
          <p>
            <CheckCircledIcon /> Respostas explicadas
          </p>
          <p>
            <CheckCircledIcon /> Pontos fortes e a desenvolver
          </p>
        </section>
        <button className="primary-button" onClick={() => flow.push(paymentScreen)}>
          Ver análise completa · R$ 12,90 <ArrowRightIcon />
        </button>
        <p className="trust-note">
          <LockClosedIcon /> Pagamento seguro via Stripe
        </p>
      </main>
    </MobileScroll>
  );
}

function Payment({ flow }: { flow: FlowControls }) {
  const [pending, setPending] = useState(false);
  return (
    <MobileScroll className="app-screen">
      <main className="payment-screen">
        <p className="question-kicker">CHECKOUT DEMONSTRATIVO</p>
        {!pending ? (
          <>
            <h1>
              Desbloqueie seu
              <br />
              relatório completo.
            </h1>
            <div className="order-summary">
              <span>BrainRank Premium</span>
              <strong>R$ 12,90</strong>
            </div>
            <p>Escolha Pix, cartão ou uma carteira elegível no ambiente seguro da Stripe.</p>
            <button className="primary-button" onClick={() => setPending(true)}>
              Ir para pagamento <ArrowRightIcon />
            </button>
            <button className="text-button" onClick={flow.pop}>
              Agora não
            </button>
          </>
        ) : (
          <>
            <div className="loading-orbit" aria-hidden="true" />
            <h1>Confirmando seu pagamento…</h1>
            <p>
              Isso normalmente leva alguns segundos. O acesso só é liberado após confirmação segura.
            </p>
            <button className="primary-button" onClick={() => flow.push(premiumScreen)}>
              Simular confirmação <ArrowRightIcon />
            </button>
          </>
        )}
      </main>
    </MobileScroll>
  );
}

function PremiumReport() {
  const scores = [86, 78, 72, 81, 76, 69];
  return (
    <MobileScroll className="app-screen">
      <main className="premium-screen">
        <p className="question-kicker">RELATÓRIO DESBLOQUEADO</p>
        <h1>
          Seu mapa de
          <br />
          raciocínio.
        </h1>
        <div className="score-lockup compact">
          <strong>782</strong>
          <span>/ 1000</span>
        </div>
        <div className="report-bars">
          {dimensions.map((item, index) => (
            <div className="report-row" key={item.label}>
              <div>
                <span>{item.label}</span>
                <strong>{scores[index]}</strong>
              </div>
              <i>
                <b style={{ width: `${scores[index]}%` }} />
              </i>
            </div>
          ))}
        </div>
        <section className="insight-block">
          <span>PRIMEIRO INSIGHT</span>
          <h2>Você percebe a regra antes de acelerar.</h2>
          <p>
            Seu desempenho combina atenção alta com reconhecimento rápido de mudanças no padrão.
          </p>
        </section>
        <button className="secondary-button">
          Ver análise completa <ArrowRightIcon />
        </button>
      </main>
    </MobileScroll>
  );
}

const questionScreen = (index: number): FlowScreen => ({
  id: `question-${index}`,
  headerHeight: 58,
  header: (flow) => <Header flow={flow} step={`${index + 1} / 24`} />,
  render: (flow) => <Question flow={flow} index={index} />,
});
const emailScreen: FlowScreen = {
  id: "email",
  headerHeight: 58,
  header: (flow) => <Header flow={flow} />,
  render: (flow) => <EmailCapture flow={flow} />,
};
const resultScreen: FlowScreen = {
  id: "result",
  headerHeight: 58,
  header: (flow) => <Header flow={flow} />,
  render: (flow) => <FreeResult flow={flow} />,
};
const paymentScreen: FlowScreen = {
  id: "payment",
  headerHeight: 58,
  header: (flow) => <Header flow={flow} step="Pagamento" />,
  render: (flow) => <Payment flow={flow} />,
};
const premiumScreen: FlowScreen = {
  id: "premium",
  headerHeight: 58,
  header: (flow) => <Header flow={flow} step="Relatório" />,
  render: () => <PremiumReport />,
};

export default function Prototype() {
  const landingScreen = useMemo<FlowScreen>(
    () => ({ id: "landing", render: (flow) => <Landing flow={flow} /> }),
    [],
  );
  return <FlowStack initial={landingScreen} />;
}
