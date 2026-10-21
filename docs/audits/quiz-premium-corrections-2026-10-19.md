# Correções de quizzes e relatórios premium — 19/10/2026

Validação final atualizada em 20/10/2026.

## Diagnóstico confirmado no código

- O retorno do checkout construía sempre `/quizzes/brainrank/result`, inclusive para MoneyDNA/CoupleDNA. A página de resultado rejeitava a sessão quando seu slug não correspondia à rota, produzindo página não encontrada após uma compra válida.
- A busca de entitlement dependia da lista de sessões por `buyer_id`. Sessões legadas sem essa identidade podiam perder o acesso ao grant da própria tentativa. A consulta agora inclui explicitamente a sessão autenticada e não agrupa compradores nulos.
- A recuperação consultava um único token por sessão, embora possam existir múltiplos links de recuperação. Agora também filtra o hash do token recebido e mantém a comparação em tempo constante.
- O fulfillment inferia BrainRank quando falhava a consulta dos itens. Agora falha de forma recuperável, sem conceder o produto errado.
- Falhas ao consultar a sessão para verificar acesso pago agora geram erro recuperável, em vez de aparentar ausência de compra e oferecer recompra.
- A distribuição anterior tinha recuperações nas posições 8/16/24 e informações antes de 1/9/17. A terceira informação aparecia cedo demais. A observação desaparecia automaticamente após 6–8 segundos e era registrada imediatamente, antes da confirmação de leitura.
- Checkout e documento HTML prometiam/entregavam uma seção de certificado. O produto solicitado é exclusivamente relatório; essas referências foram removidas em pt/en/es/fr.

## Implementação e sequência real do plano

O BrainRank mantém 24 questões avaliativas, incluindo três recuperações, e três telas informativas adicionais que não afetam o contador.

| Etapa         |             Posição | Intervalo de respostas |
| ------------- | ------------------: | ---------------------: |
| Informação A  |  antes da questão 1 |                      — |
| Recuperação A |           questão 8 |                      7 |
| Informação B  | antes da questão 13 |                      — |
| Recuperação B |          questão 18 |                      5 |
| Informação C  | antes da questão 20 |                      — |
| Recuperação C |          questão 24 |                      4 |

`memoryExecutionPlan` concentra os intervalos. A seleção dinâmica persiste IDs/posições em `quiz_session_questions`. As posições da ordem persistida identificam o plano atual ou os blocos legados; retomadas não redistribuem perguntas. O FocusStyle mantém sua distribuição anterior.

A leitura não tem contagem regressiva e exige Continuar. A exposição só é registrada após essa ação. Se houver interrupção antes de confirmar, a informação pode ser apresentada novamente; depois de confirmar, a retomada não a reapresenta. O endpoint autentica sessão, expiração, exercício atribuído e posição atual. A função de relógio valida que a informação pertinente foi confirmada antes de iniciar a questão.

O indicador exploratório é separado da pontuação cognitiva existente. O resultado persiste situações apresentadas, acertos e intervalos por desafio. O relatório explica as limitações: três exercícios sem condições controladas não medem memória geral, atenção sustentada ou concentração e não fornecem diagnóstico/validação psicométrica.

## Auditoria das 60 perguntas do pool BrainRank

Revisão de enunciados, alternativas e representações do pool completo. Correções de conteúdo em quatro idiomas, sem ocultar perguntas:

| Item      | Defeito e correção                                                                                         |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| BR_LOG_03 | Quarta etiqueta ausente e localização não dedutível; premissas completas com localização única.            |
| BR_NUM_01 | Operação não definida e padrão ambíguo; operação explícita, resultado 43.                                  |
| BR_PRB_01 | Dependência implícita de calor de lâmpadas; explicita incandescência, estado inicial e verificação segura. |
| BR_SPD_03 | Mais de um anagrama válido; distratores sem o mesmo multiconjunto de letras em todos os idiomas.           |
| BR_ATT_06 | Alternativas idênticas em inglês/espanhol; corrige os distratores dessas traduções.                        |
| BR_ATT_09 | Duas linhas com quatro sinais; torna a contagem correta única.                                             |
| BR_ATT_10 | Múltiplos pares perfeitamente invertidos; corrige distratores e descrição da tarefa.                       |
| BR_SPD_10 | 567/630/693 eram múltiplos de 63; mantém apenas uma alternativa válida.                                    |

Não há alteração de flags `isCorrect` nos IDs estáveis; há alteração do conteúdo das alternativas e enunciados, inclusive do valor correto de BR_NUM_01. Por isso, a migração cria perguntas novas na versão **1.1**, com scoring_version **1.1**, e arquiva 1.0 para novas tentativas. Não altera perguntas/alternativas da versão 1.0, respostas antigas ou resultados armazenados. A fórmula numérica do scorer permanece igual. Os índices não são validação psicométrica.

Os testes verificam as 60 definições, unicidade das alternativas em cada idioma e as respostas semânticas dos itens corrigidos. Inspeção visual completa e auditoria do conteúdo efetivamente instalado no banco dependem da homologação local descrita abaixo.

## Acesso premium e recuperação

O pedido autenticado retorna o slug/produto derivados da sessão persistida. A página de sucesso usa esse slug. Links antigos autenticados que chegam à rota errada são redirecionados para a rota canônica. O polling mantém verificação no backend; a reconciliação compara também valor, moeda e produto persistidos antes de liberar acesso. Não há desbloqueio por parâmetros do navegador.

O CoupleDNA mantém conclusão/consentimentos de ambos e compra confirmada para a comparação. A interface atualiza esse estado a cada 10 segundos, por até 30 verificações visíveis, com atualização manual disponível. A mensagem de sucesso da compra não promete que etapas bilaterais pendentes já terminaram.

## Arquivos da correção

- `src/features/commerce/{entitlement-service,fulfillment-service,order-service,contracts}.ts`
- `src/app/api/orders/[id]/route.ts`
- `src/app/[locale]/checkout/{page.tsx,success/page.tsx}`
- `src/app/[locale]/quizzes/[slug]/result/page.tsx`
- `src/features/quiz-engine/{delayed-memory,session-service,repository}.ts`
- `src/app/api/sessions/[id]/memory/route.ts`
- `src/components/patterns/{memory-observation,couple-result-panel}.tsx`
- `src/content/quizzes/brainrank.ts`
- `src/features/results/{report-document,human-report}.ts`
- `scripts/build-seed-sql.ts`, `supabase/seed.sql` (regenerado)
- `supabase/migrations/20261019031558_delayed_recall_execution_plan.sql`
- `supabase/migrations/20261019104646_brainrank_content_v11.sql`
- Testes novos: `brainrank-content-audit`, `paid-entitlement-recovery`, `order-result-routing`.
- Testes atualizados: `paid-report-memory` unitário e integração (novo requisito remove certificado).

O workspace já tinha alterações e recebeu edições simultâneas em outros fluxos. Elas foram preservadas; não são atribuídas a esta correção.

## Comunicação comercial

Pesquisa no código de aplicação, funções, scripts e templates: referências comerciais encontradas no checkout e documento HTML removidas nos quatro idiomas. Referências técnicas a certificados TLS e histórico de migrações não são benefícios de compra. A API Stripe em modo de teste foi consultada: os três produtos existentes não continham menções a certificados; nenhuma transação foi criada. Evidência: `quiz-premium-stripe-catalog.json`. Não houve auditoria do Dashboard ou do catálogo de produção.

## Evidências e pendências

- Migrações locais aplicadas e verificadas no Supabase local até `20261019105256` (`20261019000000_coupledna_multi_invite.sql`, `20261019031152_brainrank_question_deadlines.sql`, `20261019031558_delayed_recall_execution_plan.sql`, `20261019104646_brainrank_content_v11.sql`, `20261019105256_behavioral_scenarios_v2.sql`).
- BrainRank versão `1.1` (`APPROVED`, 63 itens ativos com os 3 exercícios de recuperação) e `1.0` (`ARCHIVED`) confirmados no banco local.
- Suíte completa final: **59 arquivos, 399 testes aprovados**, sem falhas ou testes ignorados. Comando executado: `node_modules/.bin/vitest.cmd run --config vitest.config.mts --maxWorkers=1` (mesmo executor/configuração do script `pnpm test`). Log: `quiz-premium-stable-final-tests.log`. Inclui testes unitários e integração com o Supabase local, inclusive recuperação premium, memória, prazos e homologação dos sete quizzes.
- A validação detectou saltos do relógio no WSL que causavam expirações indevidas. Conforme autorização explícita do usuário, `systemd-timesyncd` foi pausado somente durante a suíte final e restaurado em `finally`; seu estado final foi confirmado como `active`. O relógio do Windows não foi alterado. As asserções de prazo foram mantidas.
- Os três fluxos BrainRank/MoneyDNA/CoupleDNA usam banco real e provedor de pagamento controlado nos testes comerciais: conclusão, bloqueio enquanto pendente, fulfillment idempotente, relatório, recarga, recuperação e autorização. Isso não equivale a concluir um pagamento no Checkout hospedado da Stripe.
- Suíte E2E de navegador (`node tests/e2e/brainrank-timing.cjs`): aprovada nos 4 idiomas (`pt` em `1440x1000`, `en`/`es`/`fr` em `390x844`), validando tela de observação sem cronômetro, confirmação explícita, prazo autoritativo no servidor, retomada sem reexibir observação, expiração (`TIMEOUT`) e conclusão das 24 questões com redirecionamento ao resultado. Capturas em `docs/audits/brainrank-deadlines-evidence-2026-10-19/`.
- Checagens finais: `node_modules/.bin/tsc.cmd --noEmit` aprovado e `node_modules/.bin/next.cmd build` aprovado. Logs: `quiz-premium-typecheck.log` e `quiz-premium-final-build.log`. Foram usados os binários instalados porque o wrapper pnpm tentou acessar o registro indisponível. `git diff --check` aprovado. Lint/smoke registrados por outros fluxos não foram repetidos nesta conferência final.
- Evidências adicionais de navegador desta correção: telas desktop/mobile sem cronômetro, confirmação explícita, retomada sem repetir informação e recuperação na questão 8; capturas em `.playwright-mcp/brainrank-information-desktop.png`, `brainrank-information-mobile.png`, `brainrank-recall-eight-mobile.png`. A captura `brainrank-completed-mobile.png` registra chegada à captura de resultado depois das 24 questões.
- Pendências externas: concluir um pagamento no Checkout hospedado em modo de teste, auditar catálogo/Dashboard de produção e publicar migrações/código pelo pipeline de release. Não houve cobrança real, deploy remoto ou reset/exclusão de dados.
