# Meqyro — plano de execução para produção e vendas

Data: 02/10/2026. Estado: entrega premium e memória implementadas e validadas localmente; demais etapas e aceite em produção pendentes.

Escopo solicitado: retirar acesso vitalício, permitir download após pagamento, enviar resultado completo via Supabase Function e distribuir três exercícios de memória em BrainRank e FocusStyle. Mantido o prazo existente de 24 meses online. Implementação e publicação: [entrega de resultado pago](runbooks/paid-report-delivery.md).

Atualização de 04/10: os três exercícios ficam dentro do total original (24 BrainRank; 20 FocusStyle). Os estímulos usam linguagem neutra e exibição breve com avanço automático, sem antecipar a pergunta de lembrança ou mencionar anotações. Validado com testes unitários, sessões persistidas e navegador; migração dos textos aplicada somente no ambiente local.

Base: [auditoria de prontidão](audits/production-sales-readiness-2026-10-02.md). Os IDs P0 referem-se a esse relatório. Este plano organiza o trabalho; não altera funcionalidades nem autoriza compras ou ativações em contas externas.

## Objetivo e estratégia

Publicar uma versão que permita concluir o quiz, comprar, receber e recuperar um relatório coerente com as respostas, com operação capaz de resolver falhas de pagamento e entrega.

Planejamento-base: preparar os sete produtos existentes. Para antecipar a primeira venda, pode-se optar por lançar somente BrainRank em português para o Brasil, após concluir seu conteúdo e aceite. Essa redução é uma decisão de produto ainda não tomada: não remover produtos ou bundles silenciosamente. Produtos fora do lançamento devem ficar indisponíveis também no checkout/API, e não apenas escondidos na interface.

A ordem de execução será: **qualidade do código → entrega premium e oferta → ambiente persistido → operação resiliente → aceite integrado → lançamento controlado**. A coleta de acessos e decisões comerciais começa junto da primeira etapa, pois não depende das correções de código.

## Responsabilidades

| Papel                            | Responsabilidade                                                                                                              |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Engenharia / Codex               | Implementação, testes, migrações versionadas, configuração técnica disponível e evidências                                    |
| Titular do negócio               | Escopo de lançamento, prazo de acesso, funcionalidades prometidas, preço, contas, domínio e decisão comercial de abrir vendas |
| Produto / revisão editorial      | Validar interpretação dos resultados e conteúdo pago por produto e idioma                                                     |
| Operação                         | Atendimento, reembolso, acompanhamento de alertas e tratamento de falhas                                                      |
| Responsáveis jurídico e contábil | Revisar condições, privacidade, cadastro comercial e processo fiscal                                                          |

Uma pessoa pode acumular papéis. Antes do lançamento, cada responsabilidade deve ter um nome e canal de contato.

## Decisões e acessos a resolver no início

| Item           | Decisão / informação necessária                                                                           | Trabalho que depende disso                                        |
| -------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Escopo         | Sete produtos ou lançamento reduzido; idiomas e mercados vendidos                                         | Conteúdo, catálogo, bundles e tamanho do QA                       |
| Entrega        | Download incluído; resultado por e-mail via Supabase Function; prazo existente de 24 meses online mantido | Configurar função, secrets, remetente e conferir recebimento real |
| Preço          | Valores por produto, bundles e mercado; margem desejada                                                   | Catálogo, banco e checkout                                        |
| Infraestrutura | Hosting escolhido, domínio e acesso ao DNS; projetos de homologação/produção                              | Publicação e validação de HTTPS, IP e cron                        |
| Supabase       | Projeto correto por ambiente e acesso administrativo necessário                                           | Migrações, catálogo, permissões e backup                          |
| Stripe         | Acesso à conta, estado de ativação e meios elegíveis                                                      | Configuração test/live e compra controlada                        |
| Resend         | Conta, domínio/remetente verificado e acesso DNS                                                          | Entrega real e recuperação                                        |
| Atendimento    | Caixa principal, aliases e responsável                                                                    | Suporte, reembolso e privacidade                                  |

Segredos devem ser configurados no ambiente apropriado, sem serem colocados no plano, commits ou evidências. Engenharia pode avançar nas tarefas locais enquanto acessos são providenciados.

## Etapa 1 — restabelecer uma base verificável

Cobre P0-12 e preparação de P0-05. Não depende de credenciais externas.

- [ ] **EX-01 — registrar o estado inicial:** revisar as alterações existentes sem sobrescrevê-las; identificar versão/base, arquivos de código, migrações e documentos necessários para a entrega.
- [ ] **EX-02 — corrigir lint:** resolver os 11 erros registrados, concentrados em `tests/unit/db-questions-audit.test.ts` e `tests/unit/selection-engine.test.ts`; revisar os 9 avisos. Usar tipos reais e corrigir declarações, sem desligar regras para fazer o pipeline passar.
- [ ] **EX-03 — esclarecer testes:** definir comandos explícitos para unitários e integração; resolver a ambiguidade entre `vitest.config.ts` e `vitest.config.mts`. Banco ausente deve ser reportado como integração não validada, e não como aprovação.
- [ ] **EX-04 — executar a base:** formatação, lint, tipagem, unitários e build; corrigir falhas encontradas. Executar smoke quando o ambiente necessário estiver disponível.

**Saída:** base local reproduzível; erros resolvidos; relação dos testes executados/pulados; configuração de CI sem ambiguidade. O aceite final da versão será repetido na etapa 5 após as demais mudanças.

## Etapa 2 — corrigir o produto vendido

Cobre P0-01 e P0-02. Depende das decisões de escopo e entrega.

- [ ] **EX-05 — interpretação real:** refatorar `src/features/results/result-service.ts` para usar pontuação, perfil e dimensões de cada quiz. Remover elogios universais, percentis fixos 85/90 e conversão de score em percentil sem população de referência. Se não houver base normativa, apresentar o índice do próprio teste com explicação adequada.
- [ ] **EX-06 — revisar cada relatório ativo:** construir conteúdo útil por perfil/faixa, forças, limitações e próximos passos. Para CoupleDNA, usar os dados de ambos os participantes. Revisar traduções somente para os mercados efetivamente vendidos.
- [ ] **EX-07 — alinhar a oferta:** definir e aplicar prazo de acesso; implementar o download prometido ou retirar a promessa de todos os pontos da oferta. Separar expiração do link de recuperação da duração do direito ao relatório.
- [ ] **EX-08 — validar bundles:** conferir cobertura, acesso a quizzes feitos depois da compra e recuperação em outro navegador. Ajustar identidade/vínculo dos grants se o teste indicar que a compra cobre somente a sessão atual.
- [ ] **EX-09 — revisar catálogo e preços:** conciliar landing, paywall, checkout e banco; retirar da venda produtos/mercados ainda não aprovados, caso seja escolhido lançamento reduzido.

**Verificação:** cenários de score baixo/médio/alto para BrainRank e perfis contrastantes nos demais; resultados diferentes precisam mudar as interpretações relevantes. Não basta testar que um texto existe. Comparar produto anunciado com relatório entregue e direitos de acesso.

**Saída:** matriz por produto/mercado com conteúdo revisado, preço, duração, funcionalidades e status “apto para venda”. Nenhum produto sem revisão entra na oferta inicial.

## Etapa 3 — preparar homologação com serviços reais de teste

Cobre P0-03, P0-04, P0-05 e P0-06. Depende dos acessos externos; pode começar após a base da etapa 1, enquanto o conteúdo é revisado.

- [ ] **EX-10 — ambientes separados:** configurar homologação e produção com URLs e segredos próprios. Manter Stripe em teste na homologação e impedir testes destrutivos sobre dados de produção.
- [ ] **EX-11 — banco:** revisar/aplicar migrações em ordem na homologação, carregar catálogo/questões e conferir RPCs, índices, constraints e permissões. Verificar acesso do servidor ao schema `meqyro` e negação para acesso público indevido. Consultar advisors e validar as alterações com queries/testes reais.
- [ ] **EX-12 — hosting e URLs:** publicar versão identificada em homologação; configurar variáveis, HTTPS e URLs usadas pelo checkout e e-mail. Verificar logs e comportamento de headers do proxy da plataforma.
- [ ] **EX-13 — Stripe teste:** manter Checkout hospedado atual; conferir compatibilidade de SDK, API e versão do endpoint; registrar webhook de teste e eventos processados. Habilitar somente métodos elegíveis para a conta/mercado. Não ampliar a integração para outro gateway neste lançamento.
- [ ] **EX-14 — e-mail:** configurar domínio e remetente com os registros DNS fornecidos pelo provedor; testar entrega e links de confirmação, recuperação, privacidade e convites quando aplicáveis.

**Saída:** uma compra test mode criada pela aplicação produz pedido persistido, evento autenticado, grant e acesso; e-mail real chega ao destinatário e funciona em outro navegador. Registrar os IDs técnicos sem dados pessoais ou segredos.

Separar chaves, objetos e endpoints test/live e testar eventos atrasados, duplicados e fora de ordem segue o [checklist oficial da Stripe](https://docs.stripe.com/get-started/checklist/go-live). A revisão de segurança, capacidade e disponibilidade do banco segue o [checklist de produção do Supabase](https://supabase.com/docs/guides/deployment/going-into-prod).

## Etapa 4 — tornar entrega e operação resilientes

Cobre P0-07, P0-08, P0-09, P0-10 e itens operacionais P1. Depende da homologação persistida e das decisões de acesso/retenção.

- [ ] **EX-15 — limites distribuídos:** substituir a dependência exclusiva de memória por backend compartilhado ou proteção equivalente da infraestrutura. Cobrir criação/respostas de sessão, leads, recuperação, checkout e privacidade conforme custo e risco de abuso. Consumir a configuração declarada ou removê-la se não representar a implementação. Validar a origem do IP e não confiar em headers arbitrários enviados pelo cliente.
- [ ] **EX-16 — entrega com reprocessamento:** persistir tentativas de e-mail de compra e reprocessar falhas temporárias com limites e idempotência. Incluir compras recuperadas pela reconciliação; não depender de o cliente permanecer na página de retorno.
- [ ] **EX-17 — cron:** agendar e autenticar reconciliação, retries e retenção; validar sobreposição, falha do banco, erro parcial e ausência de execução. A periodicidade precisa caber nas quotas e tempo de execução do hosting escolhido.
- [ ] **EX-18 — retenção:** implementar prazos aprovados para respostas, resultados e tokens; preservar registros necessários conforme a política revisada. Validar exclusão/exportação/descadastro e evitar apagar direitos de uma compra ainda válida.
- [ ] **EX-19 — sinais operacionais:** manter healthcheck simples para disponibilidade e acrescentar verificação protegida de prontidão. Alertar checkout/webhook falho, pedido pago sem entrega, retries esgotados e cron atrasado. Designar responsável e procedimento por alerta.
- [ ] **EX-20 — atendimento e políticas:** unificar caixa/aliases, testar recebimento, documentar recuperação manual de compra e reembolso. Revisar condições e identidade do fornecedor com os responsáveis; confirmar processo contábil/fiscal.
- [ ] **EX-21 — recuperação de desastre:** confirmar backup efetivamente disponível e executar restauração em ambiente isolado. Registrar RPO/RTO acordados, resultado do exercício e estratégia de rollback da aplicação compatível com migrações.

**Saída:** com aba fechada, webhook perdido e e-mail temporariamente indisponível, o sistema recupera a compra e entrega acesso; falhas persistentes chegam a alguém. Rotinas de retenção e suporte correspondem às condições publicadas.

## Etapa 5 — homologar a versão candidata

Cobre P0-11 e confirma todos os P0. Depende das etapas 2–4 concluídas para os produtos ativos.

- [ ] **EX-22 — pipeline do commit candidato:** executar formatação, lint, tipagem, unitários, integração com banco disponível, build e smoke. Registrar falhas, skips e limitações. Corrigir e repetir somente o necessário após cada mudança, finalizando com pipeline completo aprovado.
- [ ] **EX-23 — QA de navegador:** executar o roteiro integral da auditoria em desktop e mobile. Verificar teclado/foco, retomada, erro de conexão, estados de pagamento e acesso; revisar traduções e medir desempenho das páginas principais.
- [ ] **EX-24 — testes de falha:** recusa, cancelamento, Pix quando ofertado, webhook inválido/duplicado/atrasado/fora de ordem, preço divergente, reembolso/disputa, cron, retry, token expirado e tentativa de acesso a relatório alheio.
- [ ] **EX-25 — evidências e correções finais:** registrar matriz PASS/FAIL/NÃO EXECUTADO por cenário, produto e mercado. Atualizar runbooks e remover afirmações de prontidão que não correspondam a provas atuais.

**Saída:** nenhum bloqueio P0 aberto no escopo de venda; aceite técnico e editorial vinculado ao commit, schema e ambiente exatos. Cenário obrigatório “não executado” mantém o lançamento pendente.

## Etapa 6 — ativar produção e acompanhar primeiras vendas

Depende do aceite da etapa 5 e da decisão comercial de lançamento.

- [ ] **EX-26 — preparar produção:** revisar/aplicar migrações sem reset destrutivo, configurar domínio definitivo e secrets live, webhook live, cron, remetente, suporte, alertas e backup. Garantir que objetos/chaves de teste não sejam usados no fluxo real.
- [ ] **EX-27 — verificar a versão publicada:** smoke no domínio definitivo, acesso protegido, URLs canônicas e links de e-mail corretos. Registrar versão e plano de rollback.
- [ ] **EX-28 — compra controlada live:** após autorização do titular para a cobrança, comprovar valor/moeda, confirmação, relatório, entrega e recuperação. Verificar procedimento de reembolso quando autorizado. Registrar evidências.
- [ ] **EX-29 — abrir tráfego limitado:** disponibilizar apenas produtos aprovados; acompanhar continuamente os primeiros pedidos e diariamente receita, entrega, falhas e atendimento na primeira semana.
- [ ] **EX-30 — aquisição e expansão:** validar eventos do funil e origem das vendas, conciliar receita com Stripe e calcular margem após custos. Expandir tráfego, produtos e idiomas somente após aceite e desempenho observados.

**Critério para interromper novas compras:** cobrança sem acesso que não seja recuperada, exposição de dados, erro de preço/moeda, entrega incoerente com a oferta ou indisponibilidade persistente do checkout. Preservar acesso dos compradores existentes, avisar operação e resolver antes de reabrir. Preferir rollback da aplicação ou suspensão da oferta afetada a desfazer registros financeiros.

## Dependências e trabalho simultâneo

| Frente                        | Pode começar                                            | Precisa terminar antes de  |
| ----------------------------- | ------------------------------------------------------- | -------------------------- |
| Lint, testes e CI             | Imediatamente                                           | Aceite da versão candidata |
| Conteúdo e oferta             | Após decisões de escopo/entrega                         | QA comercial               |
| Contas, DNS e suporte         | Imediatamente pelo titular                              | Homologação externa e live |
| Banco e deploy de homologação | Após base verificável e acessos                         | Integração persistida      |
| Limites, retries e retenção   | Desenho local; validação após banco                     | Aceite integrado           |
| Alertas, backup e atendimento | Durante homologação                                     | Primeira venda             |
| Eventos e margem              | Instrumentação durante homologação; análise após vendas | Escalar aquisição          |

O caminho que determina o lançamento é: **oferta aprovada + conteúdo corrigido + serviços configurados → aceite integrado → configuração live → compra controlada → abertura**. Trabalho simultâneo descreve frentes que podem avançar juntas; não pressupõe criação de agentes ou chats adicionais.

## Cadência e estimativa

Usar ciclos curtos com entregas verificáveis:

1. **Primeiro ciclo:** EX-01 a EX-04; resolver decisões e inventariar acessos.
2. **Segundo ciclo:** EX-05 a EX-14; fechar conteúdo/escopo e homologação externa.
3. **Terceiro ciclo:** EX-15 a EX-21; recuperação automática e operação.
4. **Quarto ciclo:** EX-22 a EX-30; aceite, live e vendas acompanhadas.

Não fixar data de lançamento antes do primeiro ciclo. Reestimar ao conhecer falhas de tipagem/testes/build, escopo editorial e disponibilidade das contas. Ativação de serviços, DNS e revisão comercial podem determinar o prazo mesmo com código pronto. O plano deve reportar por ciclo: concluído, evidência, bloqueio, responsável e próxima ação.

## Registro de acompanhamento

Todos os itens EX estão inicialmente **a fazer**. Nenhum fica concluído somente por estar implementado; deve atingir seu critério de saída.

| Campo         | Preenchimento por tarefa                                     |
| ------------- | ------------------------------------------------------------ |
| Identificação | EX-XX e P0 relacionado                                       |
| Responsável   | Pessoa que executa e pessoa que valida                       |
| Estado        | A fazer / em execução / bloqueado / em validação / concluído |
| Dependência   | Decisão, tarefa ou acesso específico                         |
| Evidência     | Commit, execução de teste, captura ou IDs técnicos           |
| Pendência     | Problema observado e próxima ação                            |

Manter evidências técnicas em `docs/audits/` e atualizar este plano a cada ciclo. Não guardar credenciais, payloads com dados pessoais ou tokens de acesso.

## Checklist de liberação

- [ ] Oferta, relatórios, preços, download e prazo de acesso concordam.
- [ ] CI aprovada para a versão exata; integração persistida realmente executada.
- [ ] Produtos e mercados ativos passaram por revisão e QA.
- [ ] Stripe live confirma pagamento; acesso depende de confirmação autenticada.
- [ ] Banco de produção e catálogo verificados, sem exposição pública indevida.
- [ ] E-mail entrega e retry recupera falhas; recuperação em outro navegador funciona.
- [ ] Cron, limites distribuídos, retenção e alertas funcionando.
- [ ] Suporte, reembolso, condições e processo fiscal definidos pelos responsáveis.
- [ ] Backup, restauração e rollback documentados e verificados.
- [ ] Compra controlada live concluída e decisão comercial de abrir vendas registrada.

**Primeira ação de implementação:** corrigir o lint, explicitar a configuração dos testes e executar a base de qualidade. Enquanto isso, fechar escopo e promessas da oferta e providenciar os acessos externos.
