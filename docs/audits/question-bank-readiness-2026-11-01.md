# Validação da base de perguntas — 01/11/2026

Auditoria inicial, anterior às correções. O estado do candidato revisado está em [question-bank-corrections-2026-11-01.md](question-bank-corrections-2026-11-01.md).

**Parecer: NÃO APTO para publicação do conjunto comercial com o código deste checkout.** BrainRank contém uma questão sem resposta correta disponível; MoneyDNA e CoupleDNA têm incompatibilidade reproduzida entre banco e scorer. Testes unitários e build aprovados não eliminam esses bloqueios.

## Escopo e fontes

- Código: commit `27b67f2`, fontes em `src/content/quizzes/`, seleção e scoring atuais.
- Banco consultado apenas em leitura: `meqyro-hml`, projeto `zfdipjfgzkaqcbudfzub`. Não se consultaram respostas de usuários, leads, pagamentos ou outros dados pessoais.
- Versões consideradas: BrainRank 1.2; MoneyDNA/CoupleDNA v2.0.0; versões publicáveis atuais dos demais testes. Legados foram inventariados, mas não receberam a mesma revisão estrutural completa.
- As duas conexões Supabase disponíveis listaram apenas `meqyro-hml` e um projeto distinto chamado `lumina`. Não foi identificado um banco Meqyro de produção; sua paridade não está validada.
- Auditoria estrutural integral dos 359 itens ativos das versões selecionadas, com 1.436 enunciados e 4.400 rótulos de alternativas em quatro idiomas. Revisão semântica dirigida; não equivale a revisão linguística profissional de todos os textos nem validação psicométrica.

## Inventário verificado no banco

| Teste           | Versão |                  Itens no banco |           Itens por tentativa | Avaliação                                                 |
| --------------- | ------ | ------------------------------: | ----------------------------: | --------------------------------------------------------- |
| BrainRank       | 1.2    | 108 (96 centrais + 12 memórias) | 24 (21 centrais + 3 memórias) | Bloqueado por gabarito inválido                           |
| MoneyDNA        | v2.0.0 |                              80 |                            20 | Bloqueado por incompatibilidade com scorer                |
| CoupleDNA       | v2.0.0 |                              80 |                            20 | Bloqueado por incompatibilidade com scorer/comparação     |
| Personality Map | 1.0    |                              40 |                            40 | Estrutura aprovada; aprovação de produção pendente        |
| CareerFit       | v1.0.0 |                              24 |                            24 | Estrutura aprovada; aprovação de produção pendente        |
| DecisionDNA     | v1.0.0 |                               4 |                             4 | Estrutura aprovada; alcance interpretativo muito limitado |
| FocusStyle      | v1.0.0 |   23 (20 centrais + 3 memórias) |                            20 | Estrutura aprovada; aprovação de produção pendente        |

Quantidade no banco não é quantidade aplicada. FocusStyle substitui três itens por memória; não aplica 23 perguntas. `coupledna-invite` é um adicional comercial sem questionário e foi excluído corretamente.

## Bloqueios

### 1. BrainRank BR_ATT_02: nenhuma alternativa matematicamente correta

Fonte: `src/content/quizzes/brainrank.ts:685`; confirmado também no banco, na versão 1.2 ativa, nos quatro idiomas.

Texto contado: `RACIOCINAR COM RIGOR REQUER RECONHECER REGRAS`.

Contagem independente: RACIOCINAR = 2; COM = 0; RIGOR = 2; REQUER = 2; RECONHECER = 2; REGRAS = 2. Total **10**, mas as alternativas são 6, 7, 12 e 9; o gabarito marca 12. Reprodução: `[...texto].filter(c => c === 'R').length` retorna 10.

Impacto: um participante atento não pode responder corretamente, prejudicando a dimensão e o resultado geral. A presença de exatamente um `isCorrect` não detecta esse defeito semântico.

Correção necessária: publicar item corrigido em nova versão documentada de conteúdo/scoring, preservando tentativas e resultados históricos. Adicionar verificação baseada na contagem real, independente do gabarito. Não sobrescrever silenciosamente a versão respondida.

### 2. MoneyDNA/CoupleDNA: banco expandido não é aceito pelo código atual

O remoto contém a migração `20261101000121_expand_commercial_question_banks`, ausente das migrações deste checkout. Os bancos atuais têm `MD2_01..80` e `CD2_01..80`; as fontes locais terminam em `MD2_20` e `CD2_20`.

`scoreBehavioralV2` constrói o catálogo canônico a partir dessas fontes e rejeita perguntas desconhecidas (`src/features/scoring/behavioral-v2.ts:58`). O seletor, por sua vez, permite selecionar os itens novos do banco.

**Reprodução sem mutações:** carregar os itens reais consultados, mapear para `CandidateQuestion`, executar `selectQuestionsForAttempt` com a configuração atual e sementes `production-audit-0` até `production-audit-99`; construir respostas usando a primeira alternativa válida de cada item selecionado e chamar o scorer real com seus sinais privados, sem mocks. Resultado: **100/100 falhas no MoneyDNA e 100/100 no CoupleDNA**, com `Invalid behavioral item or answer`. Esses números descrevem a amostra determinística de sementes, não uma estimativa populacional. Nenhuma sessão foi criada no banco.

A comparação bilateral também percorre o catálogo fixo de 20 cenários e exige respostas para cada um (`compareBehavioralCouple`); sua compatibilidade com amostras aleatórias expandidas precisa ser corrigida e testada para os dois participantes.

Correção necessária: reconciliar migração, catálogo canônico, seleção, evidências do relatório e comparação bilateral sob uma versão consistente. Testar conclusão e retomada com itens acima de 20, nos quatro idiomas, e comparação de parceiros com conjuntos atribuídos compatíveis. Preservar instrumentos históricos.

## Qualidade de conteúdo que precisa de revisão

- **Repetição nos itens expandidos:** CD2_21..80 reutilizam exatamente as mesmas quatro alternativas genéricas em todos os 60 cenários. Por exemplo, refletir sobre necessidades e limites sempre recebe 0 e conversar conjuntamente sempre recebe 3. São polos descritivos, mas a repetição reduz a especificidade das cinco dimensões e torna o padrão de pontuação previsível. Recomenda-se revisão editorial antes de comercializar interpretações por dimensão.
- **MoneyDNA expandido:** cinco frases genéricas reaparecem 48 vezes cada entre as 240 alternativas dos 60 itens adicionais. Algumas opções não respondem diretamente ao contexto: em MD2_74, sobre saúde cotidiana versus lazer, aparecem investir em projeto e preservar dinheiro, mas falta uma opção explícita que concilie saúde e lazer. Revisar plausibilidade e aderência de cada escolha à situação.
- **Viés de posição no BrainRank:** as 108 perguntas, incluindo memórias, distribuem o gabarito em posições 1/2/3/4 como 24/45/24/15. Isso é um sinal para revisão e testes de viés; isoladamente não comprova invalidade. Qualquer embaralhamento deve manter o vínculo com os IDs e o gabarito.
- **DecisionDNA:** só quatro cenários, todos profissionais; não sustenta generalizações amplas sobre decisões em todos os contextos. Resultados devem permanecer exploratórios e reconhecer empates e baixa resolução.
- Não foram apresentadas nesta auditoria amostras normativas, estudos de confiabilidade, validade de construto ou equivalência entre idiomas. A existência de traduções e o modelo Big Five não comprovam validade do instrumento específico. Publicar como autoconhecimento exploratório exige que marketing e relatórios respeitem esses limites.

## Verificações aprovadas

- 359/359 itens com enunciados não vazios em pt/en/es/fr.
- 1.100 alternativas com os quatro rótulos não vazios; nenhuma ausência de tradução detectada.
- Nenhuma chave de pergunta duplicada dentro das versões auditadas; nenhuma corrupção encontrada pelos padrões de encoding inspecionados.
- BrainRank e memórias do FocusStyle: exatamente uma alternativa marcada correta por item. Essa validação é estrutural e não elimina o erro BR_ATT_02.
- Os sinais de cenário inspecionados existem e são numéricos finitos.
- Personality Map: oito itens por dimensão, quatro diretos e quatro reversos. CareerFit: quatro por dimensão. FocusStyle: cinco itens centrais por estilo. Bancos comerciais expandidos: 16 itens por dimensão central.
- Seleção real com 100 sementes por teste: nenhum erro de seleção nos sete testes. Para MoneyDNA e CoupleDNA, a falha ocorre na etapa seguinte, de scoring. Nos outros cinco, essa simulação NÃO executou a conclusão completa nem a persistência.
- `pnpm test:unit`: **324 testes aprovados em 45 arquivos**.
- `pnpm typecheck`: aprovado.
- `pnpm build`: aprovado, incluindo geração das páginas.

Não executados: suíte de integração em Supabase local, navegação no browser, pagamentos, entrega de relatório e fluxo completo no ambiente remoto. A validação do banco remoto foi somente leitura. Não há aprovação ponta a ponta de produção.

## Critérios para liberar

1. Corrigir/versionar BR_ATT_02 e verificar o gabarito por cálculo independente.
2. Reconciliar o banco expandido com as fontes/scorers e o instrumento bilateral; versionar a migração ausente no repositório.
3. Revisar as alternativas repetidas e pouco aderentes dos bancos comportamentais expandidos.
4. Executar testes reais de início → respostas → conclusão → resultado → relatório e CoupleDNA bilateral, incluindo retomada e os quatro idiomas, na versão exata candidata à publicação.
5. Identificar o banco de produção e confirmar versões, conteúdo e migrações contra o candidato homologado.

Nenhuma pergunta, gabarito ou registro remoto foi alterado. Nenhum deploy foi realizado. Este trabalho adiciona apenas relatório e evidências de auditoria.

Evidências: `question-bank-readiness-2026-11-01.json` e diretório `question-bank-evidence-2026-11-01/`.
