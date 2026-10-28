# BrainRank 1.2 — situações variadas e relatório revisado

## Alteração

O conjunto anterior era fixo: todas as novas tentativas recebiam as mesmas três informações. A versão 1.2 oferece 12 narrativas curtas em pt/en/es/fr. Cada tentativa seleciona três IDs distintos com o PRNG já usado pelo motor e os persiste em `quiz_session_questions`. Recarregar, retomar ou trocar o idioma não altera essas escolhas.

O banco finito não garante exclusividade entre pessoas: conjuntos podem coincidir. Ele elimina o conjunto obrigatório igual para todos. Existem 1.320 sequências ordenadas possíveis. As informações continuam antes de 1/13/20 e as recuperações em 8/18/24, dentro das 24 perguntas.

Conteúdo e scoring são identificados por 1.2; a fórmula cognitiva não mudou. Perguntas e resultados de 1.0/1.1 não foram reescritos. FocusStyle conserva o conjunto original. A confirmação da informação e a RPC de prazo validam a situação atribuída e a posição persistida, sem depender de IDs fixos como MEMORY_02.

## Relatório e interface

- Interpretação específica para nenhum, alguns ou todos os detalhes recuperados, sem classificar a pessoa.
- Limitações exploratórias mantidas; ausência de diagnóstico ou alegação de validade psicométrica.
- Ressalva geral do BrainRank apresentada no fechamento, sem repetição em cada dimensão. Os contratos dos outros quizzes foram preservados.
- Nomes de dificuldade traduzidos em vez de códigos internos EASY/MEDIUM/HARD/UNKNOWN.
- Sequência visual BR_PAT_02: corrigida largura mínima do grid/contêiner. O caso de 390 px que produzia 411 px passou a ocupar 390 px, com todas as figuras visíveis.

## Validação local

- Suíte completa: **416 testes aprovados, 63 arquivos**, sem falhas ou skips; `brainrank-varied-final-tests.log`.
- Verificação de tipos aprovada; `brainrank-varied-typecheck.log`.
- Build final aprovado; `brainrank-varied-final-build.log`.
- ESLint e Prettier dos arquivos da alteração aprovados; logs `brainrank-varied-lint.log` e `brainrank-varied-format.log`.
- Banco real com testes de variação entre tentativas, retomada nos quatro idiomas, preservação das versões antigas e relatório pago gerado do resultado persistido. O pagamento é controlado por fixture, sem cobrança real.
- Testes reais no Chromium: português desktop 1440×1000 e mobile 390×844; inglês, espanhol e francês mobile 390×844. Verificam leitura neutra sem timer, confirmação explícita, recarga antes/depois de confirmar, ordem persistida, perguntas 8/18/24, 24 respostas únicas e três acertos de recuperação.
- Relatório HTML realmente gerado para os quatro idiomas, examinado em 1440 e 390 px: oito seções, sem overflow ou erros de página; revisão visual da seção de memória realizada.
- O sincronizador WSL foi temporariamente pausado conforme autorização anterior para evitar saltos de relógio, com restauração em `finally`; estado final confirmado como `active`. O relógio do Windows não foi alterado.

As evidências de navegador, imagens e relatórios completos estão em `C:/Users/ingev/.codex/visualizations/2026/10/19/01a15224-91f8-7d10-bac0-34014e3669ff/`: `varied-memory-functional-evidence.json`, `brainrank-report-visual-evidence.json`, `brainrank-report-{pt,en,es,fr}.html` e capturas correspondentes. Logs não são versionados. A suíte local inclui mudanças paralelas do workspace; o commit desta tarefa inclui somente a alteração BrainRank e seus testes/documentação.

## Supabase de homologação

Projeto confirmado: `meqyro-hml`, ref `zfdipjfgzkaqcbudfzub`. Estava inativo e foi restaurado antes da atualização. Aplicadas pelo conector Supabase, em ordem, as migrações pendentes necessárias ao código já presente em development: `coupledna_multi_invite`, `brainrank_question_deadlines`, `delayed_recall_execution_plan`, `brainrank_content_v11`, `behavioral_scenarios_v2`, seguidas de `brainrank_varied_recall`.

Verificação remota: BrainRank 1.0 e 1.1 arquivados com 63 perguntas cada; 1.2 aprovado com 72 perguntas no banco (60 centrais + 12 opções de recuperação). Os 12 itens de recuperação possuem quatro traduções e exatamente uma resposta correta. Isso não altera a quantidade aplicada por tentativa: continuam 21 centrais + três recuperações.

`brainrank_question_clock` permanece SECURITY INVOKER e sem EXECUTE para anon/authenticated. Os advisors anteriores registram RLS sem políticas públicas por desenho e dois avisos sobre a função pública preexistente `rls_auto_enable`, fora desta alteração. Referências: [anon](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable) e [authenticated](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable).

Publicação autorizada pelo usuário: commit e push para `development`; sem deploy manual adicional ou publicação de produção. A confirmação de um build remoto deve ser distinguida da confirmação do push. Não houve reset, exclusão de tentativas, cobrança real ou envio de e-mail real nesta validação.
