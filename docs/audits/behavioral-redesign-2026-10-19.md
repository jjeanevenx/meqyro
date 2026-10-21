# MoneyDNA e CoupleDNA: evolução comportamental v2

## Diagnóstico

As versões v1 têm 20 afirmações Likert por quiz, quatro por grupo. MoneyDNA associa cada afirmação a um arquétipo e normaliza concordância; CoupleDNA agrega concordância por tema. Frases sobre prudência, honestidade e harmonia tornam o objetivo da pergunta previsível. Algumas afirmações de CoupleDNA atribuem sentimentos ou concordância à outra pessoa sem ouvi-la.

O banco já oferece `SCENARIO`, alternativas traduzidas e `scoring_value` JSONB privado. `quiz_versions` e `quiz_session_questions` já permitem fixar versão e conjunto por tentativa. A seleção usava a primeira versão publicada retornada pelo banco, sem ordem garantida. Os relatórios individuais eram derivados dos índices, sem mostrar decisões específicas. O produto CoupleDNA atual é bilateral: pagamento, conclusão e consentimento dos dois são obrigatórios. Essa condição foi preservada.

## Modelo e cobertura

Mantidas 20 questões por tentativa e cinco eixos por produto. As dez dimensões sugeridas no pedido foram tratadas como contextos e comportamentos observáveis, sem criar dez índices frágeis a partir de duas questões cada.

| MoneyDNA   | Definição operacional                                         | Contextos observados                                          |
| ---------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| BUILDER    | Priorizar recursos para desenvolver um objetivo ou projeto    | estudo, tempo de trabalho, ferramentas, renda extra           |
| GUARDIAN   | Preservar liquidez e previsibilidade diante de incerteza      | reserva, parcelas, despesas essenciais, renda variável        |
| STRATEGIST | Comparar informações e consequências antes de alocar recursos | promoção, assinaturas, serviços, conselhos conflitantes       |
| ADVENTURER | Priorizar uma experiência presente relevante                  | encontros, viagens, lazer, novas atividades                   |
| BALANCER   | Distribuir recursos entre objetivos concorrentes              | ajuda familiar, prazer, descanso, metas e margem de segurança |

Impulsividade não é inferida de uma compra isolada, dívida não equivale a irresponsabilidade e tolerância a investimento não é estimada. Influência social, emoção e adaptação são exploradas nos cenários, sem índices adicionais que aparentem medição validada.

| CoupleDNA           | Tema, com quatro observações                        | Preferências descritas                                                             |
| ------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------- |
| COMMUNICATION       | cancelamento, mensagem, afeto, apoio                | clarificação individual, conversa posterior ou diálogo explícito                   |
| LIFE_VALUES         | tempo individual, famílias, privacidade, valores    | autonomia e limites próprios, acordos compartilhados                               |
| CONFLICT_MANAGEMENT | escalada emocional, tarefas, reparação, recorrência | processamento individual, pausa combinada, solução provisória, elaboração conjunta |
| FINANCES            | celebração, compra, rendas, família                 | limite individual e negociação de compromissos compartilhados                      |
| FUTURE_PLANS        | férias, ritmos, mudança, revisão de meta            | definição individual, informação, teste reversível e planejamento conjunto         |

Cada tema do CoupleDNA usa um eixo bipolar: 0 descreve processamento individual; 100, elaboração explicitamente conjunta. Não é uma escala de saúde da relação, empatia ou habilidade. O instrumento individual não inventa opiniões da outra pessoa. Controle, coerção e vigilância não aparecem como alternativas românticas.

## Conteúdo e experiência

Os arquivos `moneydna-v2.ts` e `coupledna-v2.ts` contêm 40 cenários, 160 alternativas e todos os textos em pt/en/es/fr. Mantidos os arquivos v1 para fixtures e história. Valores monetários fixos foram evitados: os dilemas usam recursos relativos ao orçamento, sem inferir mercado pelo idioma ou exigir investimentos, renda elevada ou coabitação.

Exemplos: decidir sobre um extra com contas em dia; ajudar alguém sem prazo de devolução; conciliar descanso, trabalho extra e encontro; responder a um cancelamento recorrente; negociar privacidade durante uma atividade; avaliar uma mudança de cidade. As alternativas descrevem ações plausíveis e custos de oportunidade, sem gabarito.

Uma situação por tela, com título curto, contexto em corpo legível e alternativas em cartões existentes. Progresso, salvamento, retomada e confirmação são reutilizados. Mantida navegação por teclado e adicionado contexto acessível ao grupo de alternativas. Nenhum cronômetro ou peso de velocidade foi adicionado. Cinco cenários cotidianos, cinco de prioridades concorrentes e dez mais complexos. Sem ramificações: todos recebem a mesma cobertura.

## Pontuação e limites

Algoritmo `behavioral-v2`, instrumento `v2.0.0`, inteiramente em `src/features/scoring/`. Valida 20 questões e respostas únicas, pertença das opções, pesos da versão fixada e pelo menos quatro oportunidades por eixo. Recusa respostas numéricas, ausências, opções externas, timeout e pesos adulterados. A duração não participa da função.

Cada alternativa pode conter um mapa multidimensional. O banco inicial usa sinais simples para tornar o significado auditável; não foram inventados pesos cruzados sem justificativa. MoneyDNA atribui peso 1 à prioridade escolhida e 0 às demais disponíveis. O índice de cada prioridade é `round(100 × escolhas / oportunidades)`, corrigindo diferenças de exposição. As cinco prioridades não somam 100 e não representam percentis. CoupleDNA usa pesos 0/1/2/3 de processamento individual a conjunto: `round(100 × soma / (3 × 4))` por tema. A complexidade não altera os pesos.

Empates são registrados em `tiedDimensions`; a ordem do blueprint apenas estabiliza o contrato de arquétipo primário/secundário. A interpretação premium recusa exclusividade do perfil. Escolhas nos dois extremos geram observação de variação contextual, nunca acusação de mentira. Resultados são descrições desta tentativa, sem diagnóstico ou validação psicométrica alegada. Com quatro itens por tema, CoupleDNA tem granularidade limitada; é necessário estudo com participantes antes de fazer alegações de precisão ou confiabilidade.

Na comparação bilateral v2, cada tema informa a proporção de alternativas idênticas nos mesmos quatro cenários. A média dos cinco temas gera o índice geral de proximidade. Isso evita que escolhas opostas se anulem em médias individuais iguais. Diferenças não são incompatibilidade, nem semelhanças garantem relação saudável. Não se comparam versões distintas.

## Dados, seleção e preservação histórica

Migração aditiva gerada a partir de `scripts/behavioral-seed.ts`; o seed principal inclui o mesmo gerador. Nenhuma tabela, coluna, permissão, regra RLS ou preço foi alterado. Inserções usam conflitos como no-op; reexecutar a migração não reescreve conteúdo já versionado. Alterações futuras exigem nova versão, inclusive quando mudarem o significado das alternativas.

Somente novas tentativas de MoneyDNA/CoupleDNA escolhem a versão publicada mais recente de forma determinística. Tentativas antigas usam seu `quiz_version_id` fixado, inclusive na projeção pública. Em falhas ao carregar uma tentativa existente, não se substituem suas questões por fallback v2. Os índices e JSONs de resultados antigos não são recalculados. Convites bilaterais continuam espelhando versão e questões do participante inicial.

A seleção mantém quatro questões por grupo, fixa o conjunto no banco e ordena por complexidade com embaralhamento determinístico dentro de cada nível. O banco inicial possui exatamente 20 questões por quiz: há variação de ordem, não promessa de banco de conteúdo infinito. As traduções são verificadas nos testes de conteúdo; a projeção pública não contém pesos.

## Relatórios premium e comércio

MoneyDNA apresenta os cinco índices, explicação, limites, orientação específica já disponível por dimensão e as alternativas realmente selecionadas que sustentam cada prioridade. CoupleDNA acrescenta a leitura e as quatro evidências por tema do próprio participante ao relatório bilateral autorizado. Não expõe escolhas individuais do outro participante. A página e o documento de entrega compartilham o construtor do relatório.

O relatório mantém limites de interpretação e diferencia educação financeira de recomendação de investimento. Não há certificados ou afirmações de validação científica. Checkout, preços, StripeAdapter e webhooks não foram modificados por esta tarefa; o grant no banco continua sendo necessário. A validação comercial deve distinguir testes automatizados controlados de uma compra Stripe real.

## Validação

- Revalidação em **20/10/2026**: `pnpm typecheck` e `pnpm build` aprovados. O lint dos novos módulos de conteúdo, scoring, relatórios, versionamento, gerador e testes também passou.
- `pnpm test`: **397/399** testes aprovados, em 59 arquivos. Falharam dois casos de BrainRank: prazo e recuperação de memória. A repetição isolada e sequencial desses dois arquivos passou com **6/6** testes.
- `pnpm test --maxWorkers=1`: **398/399** testes aprovados, em 59 arquivos. Permanece intermitente `tests/integration/brainrank-timing.test.ts:111`: `completedInTimePercent` esperado 100, observado 96. Portanto, a suíte global não está inteiramente verde e a causa não pode ser atribuída somente à concorrência entre workers.
- Os testes de MoneyDNA/CoupleDNA e a homologação comercial passaram nessa rodada completa: respostas persistidas, conclusão, pagamento controlado, grants, relatório, documento entregue, recuperação, consentimento bilateral e reembolso. As fixtures CoupleDNA foram adaptadas para alternativas situacionais; as comparações buscam a seção `bilateral-overall` pelo identificador, pois o relatório também contém evidências individuais.
- Validação anterior da suíte unitária: 44 arquivos, 318 testes aprovados, incluindo `tests/unit/behavioral-v2.test.ts`. A migração `20261019105256_behavioral_scenarios_v2.sql` foi aplicada duas vezes no Postgres local; o hash dos resultados históricos permaneceu inalterado.
- Validação em navegador real (Playwright Desktop `1440x1000` e Mobile `390x844` para MoneyDNA e CoupleDNA): registrada em `docs/audits/behavioral-evidence-2026-10-19/browser.json` e capturas PNG correspondentes.
- Os testes verificam cobertura, traduções, seleção determinística e progressiva, sanitização, golden poles, normalização por exposição, pesos imutáveis, entradas inválidas, relatórios localizados com evidências e comparação bilateral sem cancelamento de médias. A suíte existente permanece habilitada. A documentação de domínio foi corrigida para descrever concordância exata das alternativas e exposições reais de MoneyDNA (15/16/18/13/18), conforme o código e a migração.

O pagamento foi exercitado com provider controlado e webhooks de teste; não foi feita compra real nem publicação remota nesta tarefa. A pendência de timing do BrainRank precisa ser resolvida antes de declarar a suíte global estável.

Limitações de pesquisa: revisão editorial e técnica não substitui entrevistas cognitivas, teste cultural com falantes nativos, estudo de consistência e validação com participantes. A equivalência linguística foi construída no conteúdo; não foi demonstrada por estudo empírico. Nenhuma produção remota é publicada como parte desta alteração.
