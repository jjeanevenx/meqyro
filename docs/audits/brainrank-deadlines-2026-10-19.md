# BrainRank — prazos por pergunta (19/10/2026)

## Auditoria e decisões

- Dificuldade existente: `questions.scoring_key.difficulty`, com EASY/MEDIUM/HARD; recuperação usa dimensão DELAYED_MEMORY e recebe fallback seguro quando não há dificuldade.
- Seleção: `selectQuestionsForAttempt` produz o conjunto; `quiz_session_questions` preserva ordem e identidade da tentativa. Novas tentativas também fixam dificuldade, limite e versão temporal nessa tabela.
- Tempo anterior: `Date.now()` no QuizRunner, reiniciado ao trocar pergunta/recarregar, e `durationMs` fornecido pelo navegador. Agora a duração avaliativa vem do Postgres.
- Scoring anterior: a nota é 1000 × acertos/itens centrais; recuperações são registradas separadamente. Dificuldade HARD e mediana dos tempos de respostas corretas com pelo menos 2000 ms desempatem dimensões. Não havia bônus de rapidez na nota.
- Preservação: fórmula e desempates não foram substituídos. TIMEOUT é uma resposta terminal sem alternativa e sem acerto. A dificuldade usada na conclusão respeita o snapshot da tentativa. Métricas novas têm versão temporal independente, sem recalcular resultados históricos.
- Informação de memória: não conta como item nem usa cronômetro. O componente atual exige Continuar. A validação usa a ordem persistida e a migração complementar de execução de memória já presente no workspace.

## Configuração e política

`src/features/quiz-engine/question-timing.ts` centraliza os padrões: 30/45/60/90 segundos para EASY/MEDIUM/HARD/VERY_HARD. Espaços/hífens e caixa são normalizados. `questions.metadata.timeLimitSeconds` inteiro de 1–3600 sobrescreve o padrão; documentar a justificativa no conteúdo. Dificuldade desconhecida ou configuração inválida usa 45 segundos.

O serviço aceita `timeMultiplier` confiável entre 1 e 4 para acomodação por acessibilidade e fixa o valor final no plano. Ainda não existe seletor público de tempo adicional. Alterar defaults afeta apenas novos snapshots.

O relógio começa quando a interface pronta solicita o início, depois de concluir a informação de memória. Recarregar, mudar de aba e fechar a página não pausam um prazo iniciado. A próxima pergunta começa apenas quando é aberta. O navegador usa prazo retornado pelo banco e `performance.now()`, sem depender de ajustes do relógio civil do dispositivo.

A chegada ao banco é a referência para confirmação, capturada antes da espera pelo lock. No instante exato da expiração ou depois, a resposta vira TIMEOUT, consome o limite completo e não recebe alternativa/acerto. Não há tolerância baseada em horário declarado pelo cliente. Por isso, conexões lentas exigem confirmar com antecedência; a interface informa essa política. Falhas de rede mostram nova tentativa e recuperam o mesmo prazo, sem renová-lo.

A RPC é SECURITY INVOKER, somente service_role, com lock por sessão e leitura idempotente da resposta já persistida. Não aceita saltar perguntas, opções de outro item, expiração antecipada ou envio antes de iniciar a pergunta. A API verifica o token da sessão e não entrega gabarito.

## Dados e relatório

- Plano: dificuldade, limite, versão, início e expiração em `quiz_session_questions`.
- Resposta: opção/nulo, `duration_ms` autoritativo e `answer_status` em `answers`.
- Auditoria em `score.timing.items`: pergunta, dificuldade, limite, início/fim, duração, tempo restante, fração normalizada, alternativa, acerto, pontos brutos, status, indicador de recuperação e versão.
- Premium: média global, média por dificuldade, percentual no prazo, total expirado, precisão e acerto/tempo de recuperação. O texto evita diagnóstico e inferências de memória/atenção baseadas somente em rapidez. O conteúdo segue a proteção premium existente e os quatro idiomas.

## Arquivos centrais

- `src/features/quiz-engine/question-timing.ts`, `session-service.ts`, `contracts.ts`.
- `src/app/api/sessions/[id]/question-clock/route.ts`, `answers/route.ts`.
- `src/components/patterns/quiz-runner.tsx`, estilos `.question-timer` em `globals.css` e traduções em `dictionaries.ts`.
- `src/features/scoring/brainrank.ts`, `brainrank-timing.ts`.
- `src/features/results/timing-report.ts`, integração em `human-report.ts`.
- Testes unitários, integração, helper de início de prazo e `tests/e2e/brainrank-timing.cjs`.

## Migrações e publicação

`20261019031152_brainrank_question_deadlines.sql` adiciona os campos e RPC e adota tentativas ativas com plano persistido, sem mexer nos resultados históricos. Foi aplicada somente no banco local. `20261019031558_delayed_recall_execution_plan.sql`, já existente no workspace, compatibiliza o relógio com o plano atual de memória e também foi aplicada localmente. Publicar as migrações em ordem antes do código; não houve deploy nesta tarefa.

## Execução dos testes de navegador

Iniciar Next contra o Supabase local. Executar `node tests/e2e/brainrank-timing.cjs`; o teste requer Playwright disponível, podendo usar `PLAYWRIGHT_MODULE_PATH` para uma instalação já existente e `E2E_CHROMIUM_EXECUTABLE` para um Chromium instalado. `E2E_OUTPUT_DIR` escolhe a pasta de evidências, e `E2E_BASE_URL` é restrita a localhost/127.0.0.1. O teste controla o relógio do navegador e os prazos de suas próprias tentativas locais, sem esperas reais de expiração.

## Evidências

- Relógio do ambiente WSL2 estabilizado (serviço `systemd-timesyncd` da distro auxiliar paralisado para evitar saltos contra o relógio do host Windows/Docker).
- Unitários (`tests/unit/brainrank-timing.test.ts`): 10 testes aprovados; suíte unitária completa: 44 arquivos, 318 testes aprovados.
- Integração (`tests/integration/brainrank-timing.test.ts`): 4 testes aprovados contra o Postgres local; suíte de integração completa: 15 arquivos, 80 testes aprovados.
- Navegador E2E (`node tests/e2e/brainrank-timing.cjs`): aprovado em `pt` (`1440x1000`) e `en`/`es`/`fr` (`390x844`), sem erros de página ou overflow horizontal, com capturas salvas em `docs/audits/brainrank-deadlines-evidence-2026-10-19/`.
- Qualidade e build: `pnpm lint`, `pnpm typecheck`, `pnpm build` e `pnpm smoke` aprovados.

## Revisão de retomada — 20/10/2026

A implementação principal e suas evidências anteriores foram preservadas. Na revisão foram corrigidos dois casos de perda de resposta de rede no QuizRunner:

- Se a confirmação de uma resposta expirada se perde, a sincronização recupera seu status terminal, limpa a alternativa local e contabiliza a pergunta no progresso, sem reenviá-la.
- Se a conclusão foi persistida, mas sua resposta se perde, o botão de nova tentativa repete somente a conclusão idempotente, sem reenviar a última resposta ou solicitar um cronômetro para uma sessão já concluída.
- Durante a sincronização inicial, o indicador usa o estado visual normal, evitando um falso alerta de expiração enquanto carrega.

O E2E agora aborta deliberadamente essas duas respostas depois de o servidor processá-las. Verifica o progresso recuperado, ausência de reenvio da última resposta e uma única linha de resultado. Os testes não mudam a fórmula, os gabaritos, a proteção premium ou os limites de tempo.

Validação final desta revisão:

- TypeScript e build de produção aprovados. Lint e Prettier dos arquivos de interface/testes alterados aprovados; diff sem erros de whitespace.
- Suíte completa: **59 arquivos e 399 testes aprovados**, sem falhas ou testes ignorados. Foi usado o mesmo Vitest/configuração base do projeto, com um arquivo temporário que redireciona apenas as chamadas da API local para um relay em 127.0.0.1:55421. A configuração e os testes do repositório não foram modificados para esse encaminhamento; o banco foi obrigatório (REQUIRE_INTEGRATION_DB=true).
- E2E real: aprovado nos quatro idiomas, pt em 1440×1000 e en/es/fr em 390×844. Sem erros de página ou overflow horizontal. Verificou expiração, recuperação de confirmação perdida, progresso da resposta recuperada, 24 questões, três recuperações de memória, recuperação da conclusão e apenas um resultado persistido.
- Regressão focada de interface (tests/e2e/brainrank-network-recovery.cjs): aprovada no Chromium com apenas dependências HTTP simuladas. Cobre também parada do cronômetro na confirmação e erro 503 antes de concluir. Essa prova é complementar ao E2E com banco real.
- Diagnóstico de infraestrutura: o Windows reservou a faixa 54232–54331, bloqueando as portas locais 54321/54322. Um relay temporário resolveu o acesso à API sem alterar reservas, .env ou código de produção. O relógio do WSL também oscilava cerca de 160 segundos; com autorização explícita do usuário, systemd-timesyncd foi pausado somente durante a validação, em bloco try/finally. O serviço foi restaurado e seu estado final confirmado como active. O relógio do Windows não foi alterado.
- A revisão corrigiu a documentação de domínio para distinguir respostas temporizadas definitivas de upserts dos demais quizzes e registrar a fórmula já existente sobre 21 itens centrais + três recuperações (ou 24 centrais legados). Não houve alteração adicional no scorer, migração ou deploy nesta revisão.

Limites: tempo adicional está preparado por parâmetro confiável do serviço, sem seletor público. A homologação comercial usa provedor controlado; não representa compra no Checkout hospedado da Stripe. Testes futuros neste ambiente local exigem portas acessíveis e relógio estável; as asserções temporais não foram flexibilizadas.
