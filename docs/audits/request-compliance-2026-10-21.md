# Validação contra o pedido original — 21/10/2026

Referência: pedido anexado “MEQYRO — CORREÇÃO DE QUIZZES, MEMÓRIA, ATENÇÃO E RELATÓRIOS PREMIUM”. Revisão do checkout atual, incluindo alterações ainda não commitadas sobre `dfdee23`. Este documento não declara homologação de produção.

## Parecer

**Atendimento substancial, com aceite final pendente.** O plano de memória e a correção da rota premium estão implementados e possuem testes. Permanecem falhas na recuperação após erros temporários do fluxo CoupleDNA e lacunas de validação externa. Os achados de recuperação abaixo são de inspeção de código; não foram reproduzidos por injeção de falha nesta revisão. A execução funcional atual também encontrou uma inconsistência temporal no BrainRank.

## Achados

### P1 — Falha na ativação do convite após pagamento não é reparada pela repetição

Em `src/features/commerce/fulfillment-service.ts`, `complete_payment` conclui o pedido antes de `activateInviteSlot`. Se a ativação falhar, o erro é propagado, mas o pedido já está `FULFILLED`. Na repetição, o retorno em `if (alreadyFulfilled)` ocorre antes da ativação. A reconciliação de pedido em `src/app/api/orders/[id]/route.ts` também retorna antecipadamente para `FULFILLED`; a reparação automática busca pedidos `PAID`, não slots pendentes de pedidos concluídos.

Impacto: uma compra de convite pode ficar paga sem link utilizável após falha transitória. Viola o requisito P0 de recuperação confiável do produto pago. A ativação precisa ser transacional com a compra ou retomada de forma idempotente mesmo quando o pedido já estiver concluído. Falta teste de falha inicial seguida de repetição/reconciliação.

### P1 — Erros nas consultas de vínculo podem aparentar ausência de compra

Em `src/features/commerce/entitlement-service.ts`, as consultas de `couple_invites` e `couple_invite_slots` no fallback de acesso compartilhado extraem somente `data` e ignoram `error`. Um erro nessas consultas pode terminar em `null`. `getProtectedResult` interpreta isso como `FREE_PARTIAL` e constrói a oferta de compra.

Impacto: participante cujo acesso depende da compra do outro pode receber oferta de recompra durante uma indisponibilidade. As consultas iniciais de sessão/grant já propagam erros; o mesmo tratamento precisa alcançar os vínculos. Falta teste específico dessas duas falhas.

### P2 — Falha temporária na página do resultado sugere iniciar outra tentativa

O `catch` em `src/app/[locale]/quizzes/[slug]/result/page.tsx` apresenta “resultado não encontrado”, o texto cru da exceção e o botão para iniciar o quiz. Não oferece ação explícita para tentar carregar novamente ou recuperar a compra nessa tela.

Impacto: a compra continua persistida, mas a interface não conduz o comprador à recuperação no momento da falha; mensagens internas também podem aparecer sem tradução. Deve distinguir indisponibilidade de resultado inexistente e oferecer repetição/recuperação no contexto da tentativa atual.

## Matriz de requisitos

| Requisito                                                                         | Estado                                    | Evidência ou limite                                                                                                                                                                                 |
| --------------------------------------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Três situações neutras e botão Continuar, sem timer na leitura                    | Atendido no código                        | `memory-observation.tsx`; cópia pt/en/es/fr, foco no título, confirmação persistida após ação                                                                                                       |
| Primeira recuperação após sete questões                                           | Atendido                                  | `memoryExecutionPlan(24)`: informação antes da 1, recuperação na 8                                                                                                                                  |
| Ciclo intermediário configurável                                                  | Atendido pela abstração                   | Informação antes da 13, recuperação na 18; parâmetro `middleGap` centralizado; não há configuração administrativa                                                                                   |
| Terceira situação perto do fim, recuperação na última questão                     | Atendido                                  | Informação antes da 20, recuperação na 24; quatro questões intermediárias                                                                                                                           |
| Preservar 24 questões, incluindo as três recuperações                             | Atendido                                  | `distributeMemoryItems` substitui três itens, não acrescenta perguntas                                                                                                                              |
| Ordem, seleção dinâmica e retomada                                                | Atendido no desenho e testes existentes   | Ordem persistida por tentativa; `attachMemoryCues` reconhece planos novos/legados; confirmação de exposição no servidor                                                                             |
| Sem pistas explícitas, feedback imediato ou gabarito no cliente                   | Atendido nas rotas/componentes examinados | Leitura neutra; API verifica exercício atribuído e posição; scoring no servidor                                                                                                                     |
| Indicadores exploratórios e histórico preservado                                  | Atendido                                  | Apresentações/acertos/intervalos/dimensão persistidos; ressalvas nos quatro idiomas; versão BrainRank 1.1 separada da 1.0                                                                           |
| Auditoria completa da qualidade do pool                                           | Parcial na evidência                      | 60 itens cobertos por integridade/unicidade em quatro idiomas e oito itens corrigidos/versionados; não há evidência de inspeção visual individual de todas as figuras/perguntas em desktop e mobile |
| Retorno premium para o quiz correto                                               | Atendido no código                        | Slug persistido no pedido; sucesso usa slug; links antigos com rota incorreta redirecionam após autenticação                                                                                        |
| Compra pendente sem acesso, autorização, repetição e recuperação nos três quizzes | Coberto por integração controlada         | `quiz-premium-regression.test.ts` conclui tentativas, cria pedidos, testa grant/recarga/token e isolamento; pagamento usa `ControlledPaymentProvider`                                               |
| Webhook Stripe real de teste até relatório renderizado                            | Pendente                                  | Testes de assinatura e mocks/integração local não substituem Checkout hospedado + webhook real de teste + navegador                                                                                 |
| Nenhuma compra válida fica sem recuperação confiável                              | Não atendido integralmente                | Achados P1 de ativação e consultas de vínculo                                                                                                                                                       |
| Remover certificados nas quatro traduções e relatórios                            | Atendido no código examinado              | Busca em `src`, `scripts`, `supabase/functions` sem ocorrências; testes de HTML dos produtos/idiomas; catálogo Stripe de teste auditado anteriormente                                               |
| Remover certificados em banco/catálogo/conteúdo de produção                       | Não comprovado                            | Não houve auditoria atual de dados e produtos Stripe em produção; catálogo de teste anterior não cobre produção                                                                                     |
| Benefícios correspondem à entrega                                                 | Parcial na homologação                    | Relatórios têm seções, recomendações, download e fluxo de e-mail; entrega externa completa não foi repetida nesta revisão                                                                           |
| Desktop/mobile e acessibilidade                                                   | Parcial na abrangência                    | Evidências anteriores de leitura/retomada/questão 8 e conclusão BrainRank; não cobrem visualmente todo o pool nem as três jornadas pagas hospedadas                                                 |

## Validação desta revisão

- `tsc --noEmit`: aprovado no estado atual (`quiz-request-typecheck-2026-10-21.log`).
- `eslint .`: aprovado (`quiz-request-lint-2026-10-21.log`).
- `next build`: aprovado (`quiz-request-build-2026-10-21.log`). A primeira execução falhou com `EPERM` ao criar um diretório gerado em `.next`; a repetição com acesso adequado passou.
- Suíte completa atual: **408 testes aprovados, 1 falha; 60 arquivos aprovados e 1 com falha**, em 570,78 s. Comando: `vitest run --config vitest.config.mts --maxWorkers=1`. Log: `quiz-request-validation-2026-10-21.log`. Não houve pausa do sincronizador WSL nesta revisão.
- Falha em `tests/integration/paid-report-memory.test.ts:78`, caso BrainRank: esperado `rawCorrect: 21, overallScore: 1000`, recebido `18/857`. Repetição isolada com filtro de teste também falhou, recebendo `20/952` (`quiz-request-memory-recheck-2026-10-21.log`; o outro caso do arquivo não foi executado devido ao filtro).
- Consulta dos resultados locais confirmou três timeouts na suíte completa e um na repetição isolada. Na repetição, a questão começou em `02:19:50 UTC`, tinha prazo até `02:20:50 UTC`, mas o resultado já estava gravado em `02:19:51 UTC` com timeout. A execução isolada do teste durou 2,683 s. Há inconsistência temporal no ambiente; não é evidência suficiente para atribuir a falha à fórmula de pontuação. Evidência resumida sem credenciais: `quiz-request-timeout-evidence-2026-10-21.json`. O comportamento temporal ainda precisa de homologação estável antes do aceite.
- Evidência anterior: 399 testes em 59 arquivos aprovados em 20/10, com sincronizador WSL temporariamente pausado e restaurado. Essa execução anterior não certifica automaticamente as alterações posteriores ainda presentes no workspace.

Não foram realizados deploy, reset, cobrança real ou alterações no código de produto nesta auditoria. O pedido anterior de commit já possui um commit amplo (`dfdee23`); há alterações posteriores ainda não commitadas, que precisam ser avaliadas separadamente antes de um novo commit.
