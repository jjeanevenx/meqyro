# Meqyro — auditoria do MVP comercial

Data: 18/10/2026. Escopo: BrainRank, MoneyDNA e CoupleDNA.

**Produção comercial: NÃO LIBERADA. Homologação publicada e READY.** O banco `meqyro-hml` foi identificado e a migração comercial foi aplicada e validada com transações revertidas. O preview Vercel foi publicado para aceite dos três produtos em https://meqyro-git-development-meqyro.vercel.app/pt. O alias foi verificado pelos metadados da Vercel e aponta para `dpl_HSxt1aFY5FwxWPnAuiwzqrp7NAqc` (build remoto aprovado em aproximadamente 57 segundos). A proteção SSO existente foi mantida. Permanecem pendentes pagamento Stripe externo em modo de teste, entrega SMTP, privacidade/termos e autorização de produção e cobrança controlada. A existência dos endpoints não comprova uma venda.

O estado e a versão mais recentes de homologação estão em [homologation-deployment.json](commercial-evidence-2026-10-18/homologation-deployment.json). A validação inicial local com 269 testes foi complementada por uma proteção de Stripe preview e uma nova execução com 270 testes unitários, tipagem e build local aprovados. Nenhuma chave Stripe live é aceita em preview.

## Estado encontrado

O projeto já implementa os sete quizzes, seleção de perguntas por sessão, pontuação no servidor, resultados persistidos, grants vinculados a pedidos, Checkout Stripe, webhook com assinatura oficial, reconciliação e envio do relatório pela Edge Function `deliver-report`. O premium é um relatório HTML e conteúdo na tela, não um PDF. Os quatro produtos retirados continuam no código e nas fixtures históricas.

A auditoria cobriu rotas, catálogo, conteúdo, seleção, scorers, relatórios, privacidade, comércio, e-mail, migrações, analytics, testes, configuração e CI. A validação remota adicional confirmou RLS nas 31 tabelas de `meqyro`, zero privilégios diretos de tabela para anon/authenticated e funções novas SECURITY INVOKER restritas a service_role. Advisors ainda exibem INFO para o modelo deny-all e WARN para a função preexistente `public.rls_auto_enable`, do tipo event_trigger; esses avisos não foram apresentados como uma auditoria sem pendências.

Foram encontradas divergências importantes entre documentação e implementação:

- Português forçava BRL, inclusive sobre mercado explícito US. Os testes reproduziam essa regra incorreta. Agora idioma não altera mercado persistido; preferência explícita precede geolocalização, com fallback US.
- Home e Discover promoviam produtos fora do lançamento. Agora há um catálogo comercial separado, preservando o catálogo técnico de sete produtos.
- O checkout exibido usava sempre o preço fixo BrainRank; a cobrança consultava `product_prices`. Agora a página carrega a oferta protegida do mesmo backend.
- `RATE_LIMIT_BACKEND=db` não era consumido. As rotas críticas de criação de sessão e checkout agora usam um contador atômico compartilhado em produção.
- As métricas administrativas chamavam de receita a soma dos últimos 50 pedidos. A nova função SQL agrega os pedidos completos e discrimina moedas e quizzes.
- O workflow CI já exige integração com banco e o Vitest inclui unitários e integração; parte da documentação anterior dizia que o comando padrão rodava somente unitários.
- O código atual do BrainRank admite 21 itens cognitivos com três exercícios de memória separados, além do caminho original de 24 itens. A documentação simplificada descreve apenas o caminho original. Nenhuma fórmula, resposta correta ou versão de scoring foi alterada nesta entrega.
- Documentação antiga de e-mail ainda menciona Resend; o código usa Hostinger SMTP e uma Edge Function para relatórios pagos.

## Matriz de funcionalidades

Legenda: **U** = coberto por testes unitários executados; **C** = encontrado no código, sem validação persistida nesta execução; **B** = verificado no navegador; **P** = pendente de aceite externo. Os testes financeiros unitários substituem dependências e não comprovam liquidação no Stripe.

| Funcionalidade                                    | BrainRank                                      | MoneyDNA                              | CoupleDNA                                   | Status                                            | Criticidade | Ação necessária                                                        |
| ------------------------------------------------- | ---------------------------------------------- | ------------------------------------- | ------------------------------------------- | ------------------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| Catálogo comercial e links                        | B                                              | B                                     | B                                           | Corrigido                                         | P0          | Revalidar o build publicado                                            |
| Banco de questões em quatro idiomas               | U: 24 posições, incluindo memória              | U: 20 afirmações                      | U: 20 afirmações                            | Conteúdo estrutural validado                      | P1          | Revisão editorial nativa e sincronização com banco de homologação      |
| Seleção por dimensões e persistência da tentativa | U/C                                            | U/C                                   | U/C                                         | Implementado                                      | P0          | Rodar seleção e retomada no banco real                                 |
| Figuras e padrões                                 | U: schema e renderização existente             | Não se aplica                         | Não se aplica                               | Parcialmente validado                             | P1          | Navegar por todos os tipos visuais em celular e teclado                |
| Scoring no servidor                               | U: acertos por dimensão, 0–1000                | U: cinco arquétipos, 0–100            | U: cinco dimensões e comparação             | Implementado                                      | P0          | Confirmar golden fixtures contra as perguntas persistidas              |
| Resultado gratuito                                | U/C                                            | U/C                                   | U/C: individual                             | Implementado                                      | P1          | Concluir tentativa anônima em homologação                              |
| Relatório premium                                 | U/C: dimensões e recomendações                 | U/C: hábitos e educação financeira    | U/C: comparação consentida                  | Existe; valor editorial requer aceite             | P0          | Revisar exemplos reais variados de cada perfil                         |
| Limitações metodológicas                          | U: sem QI/percentil clínico                    | U: sem aconselhamento individualizado | C: sem previsão da relação                  | Implementado                                      | P1          | Revisão editorial dos textos e ofertas finais                          |
| Convite, vínculo e consentimento                  | Não se aplica                                  | Não se aplica                         | C: duas sessões; ambos concluem e consentem | Implementado                                      | P0          | Testar revogação, expiração e autorização cruzada no banco             |
| Preço e mercado independentes do idioma           | U                                              | U, checkout consulta oferta           | U, checkout consulta oferta                 | Corrigido                                         | P0          | Comparar oferta, pedido e Stripe nas quatro moedas habilitadas         |
| Compra única via Stripe                           | C                                              | C                                     | C                                           | Implementado                                      | P0          | Executar Checkout real em modo de teste                                |
| Confirmação assinada e idempotência               | U/C                                            | U/C                                   | U/C                                         | Implementado; retries corrigidos                  | P0          | Duplicação e concorrência persistidas no banco                         |
| Reconciliação de pagamento                        | U: identidade/valor/moeda/produto              | U: mesma infraestrutura               | U: mesma infraestrutura                     | Fortalecido                                       | P0          | Rodar cron contra Checkout test pago e pendente                        |
| Reembolso e revogação                             | U/C: RPC atômica nova                          | U/C                                   | U/C                                         | Aplicada em hml; teste SQL com rollback           | P0          | Validar reembolso por webhook Stripe em modo de teste                  |
| Recuperação e entrega de compra                   | U/C                                            | U/C                                   | C: aguarda parceiro/consentimento           | Implementado; falha de token agora bloqueia envio | P0          | Compra, SMTP, link em outro navegador e retry real                     |
| RLS e privilégios                                 | C                                              | C                                     | C                                           | SQL revisado; estado remoto desconhecido          | P0          | Advisors e teste com anon/authenticated/service_role                   |
| Proteção contra abuso                             | U/C: limites compartilhados nas rotas críticas | U/C                                   | U/C                                         | Aplicada em hml; teste SQL com rollback           | P0          | Teste concorrente distribuído; conferir cabeçalhos confiáveis do proxy |
| Analytics financeiro                              | U: eventos públicos de pagamento rejeitados    | U                                     | U                                           | Trigger transacional preparado                    | P1          | Conferir exatamente um evento por compra persistida                    |
| Métricas por quiz e moeda                         | C                                              | C                                     | C                                           | RPC validada em hml                               | P1          | Conferir valores contra pagamentos efetivos do Stripe                  |
| Responsividade do catálogo                        | B: 390/1440 px                                 | B: 390/1440 px                        | B: 390/1440 px                              | Verificado nas páginas descritas                  | P1          | Concluir quiz, checkout e relatório reais em celular/tablet/desktop    |
| Legais, privacidade e suporte                     | P                                              | P                                     | P                                           | Não aprovado                                      | P0          | Traduzir, conferir retenção implementada e contatos atendidos          |
| Produção e transação controlada                   | P                                              | P                                     | P                                           | Não executado                                     | P0          | Definir destino, aprovar versão, publicar e autorizar cobrança         |

## Avaliação dos três produtos

### BrainRank

A seleção configura seis dimensões, com cotas de dificuldade. O scorer valida contagem e respostas únicas e usa acertos, dificuldade e tempo como critérios documentados. O fluxo atual distribui exercícios de memória sem transformar essa observação em uma medição clínica. Os testes de estrutura e golden fixtures passaram, mas não substituem revisão de ambiguidade de cada questão ou calibração psicométrica.

O relatório usa o score armazenado, explicações por dimensão e sugestões de prática. Não há evidência de amostra normativa que justifique percentis populacionais, QI ou comparação clínica. A categoria SPEED não autoriza prometer uma medida clínica de velocidade. Manter as limitações explícitas.

### MoneyDNA

Há quatro afirmações por arquétipo: BUILDER, GUARDIAN, STRATEGIST, ADVENTURER e BALANCER. O algoritmo normaliza médias e ordena os dois maiores índices. Empates seguem a ordem estável; isso não comprova que um perfil domina quando as respostas empatam. O relatório apresenta todos os índices, interpretações em três faixas e ações específicas por dimensão.

Foi acrescentado o enquadramento de educação financeira nos quatro idiomas e retirada a expressão “diagnóstico” da oferta. Antes de tráfego pago, revisar casos de respostas uniformes e evitar vender uma classificação categórica como diagnóstico ou recomendação de investimento.

### CoupleDNA

O preenchimento é individual; o produto premium é bilateral. Há COMMUNICATION, LIFE_VALUES, CONFLICT_MANAGEMENT, FINANCES e FUTURE_PLANS. A comparação calcula semelhança entre índices, não qualidade objetiva da relação. O serviço exige duas conclusões, consentimentos e entitlement pago; o resultado compartilhado não expõe as respostas individuais do parceiro.

O acesso pago pode existir antes de o parceiro concluir. A interface possui estado de espera; o envio só ocorre quando o relatório estiver pronto. O aceite deve verificar que o comprador entende essa condição e que uma revogação posterior de consentimento bloqueia a comparação online. Um arquivo já enviado por e-mail não pode ser tecnicamente recolhido; isso precisa estar explicado na política e no consentimento.

## Bloqueadores e plano priorizado

1. **P0 — banco e migração.** Docker indisponível nesta máquina; a suíte completa não passou por falta de Supabase local. A migração local `20261018231842_commercial_payment_safety.sql` foi aplicada no projeto `meqyro-hml`, com versão remota `20261019014249`. Passaram testes transacionais com rollback de pagamento, grant, conversão única e reembolso idempotente, além do contador compartilhado e da RPC de métricas. A suíte completa de integração local continua pendente; isso não é equivalente a um pagamento Stripe externo.
2. **P0 — homologação financeira.** Fazer compras Stripe test para os três produtos, com aprovação, recusa, cancelamento, confirmação assíncrona elegível, webhook duplicado, cron e divergência de valor/moeda. Validar o caminho sem retorno à URL de sucesso. Os testes locais com dependências controladas não substituem esses pagamentos.
3. **P0 — entrega e recuperação.** Publicar/validar `deliver-report`, secrets, SMTP, caixa de entrada e anexo HTML; abrir recuperação em outro navegador. Conferir o retry e a entrega após conclusão do parceiro.
4. **P0 — privacidade e termos.** Páginas legais permanecem em português; contatos divergem entre `support@meqyro.com`, `suporte@meqyro.com` e `dpo@meqyro.com`. A política promete exclusão automática de respostas em 30 dias, mas a reconciliação examinada expira sessões/tokens e não executa essa exclusão. Definir retenção comercial, fiscal e das avaliações, implementar o comportamento aprovado e traduzir os textos.
5. **P0 — homologação de acesso.** Executar RLS, IDOR, grants históricos, revogação de consentimento e reembolso no banco. Conferir exportação/exclusão de dados de compradores sem lead: o serviço de privacidade usa `lead_id` em parte dos caminhos e não basta presumir cobertura de todas as compras anônimas.
6. **P0 — destino e operação.** Confirmar domínio/projeto, suporte, regras de reembolso, backup restaurável e execução do cron. A publicação solicitada é de homologação na equipe/projeto Vercel MEQYRO/meqyro; produção e cobrança real permanecem fora desta entrega.
7. **P1 — políticas financeiras pendentes.** O comportamento existente trata `charge.refunded` como revogação integral, inclusive em reembolsos parciais. Definir e implementar o tratamento de valores parciais antes de utilizá-los; o dashboard atual de receita não equivale a um extrato líquido de taxas, impostos, disputas ou estornos parciais. Disputas são tratadas como revogação, sem restauração automática após vitória.
8. **P1 — robustez de operação.** Monitorar checkout, reembolso, cron e entrega; testar pagamentos/eventos fora de ordem. A reconciliação atual consulta pedidos PENDING, não todos os estados possíveis de falha/expiração. Limites de leitura e filas precisam ser monitorados ao crescer o volume.
9. **P1 — produto e acessibilidade.** Revisão humana dos relatórios, casos de empate/baixo contraste de índices, teclado e leitor de tela em todos os tipos de pergunta. As durações exibidas são estimativas editoriais, não tempos medidos nesta execução.
10. **P2 — otimização.** Testar copy/preço depois de vendas válidas, medir conversão por coorte e origem, diferenciar visualizações de visitantes únicos. Não expandir os quatro quizzes retirados antes do aceite comercial.

O caminho incremental sugerido é homologar primeiro BrainRank, que já tem o CTA principal e maior cobertura específica de scoring/visuais. Isso não é uma aprovação antecipada: se a revisão visual/memória impedir o aceite, MoneyDNA tem um fluxo individual mais simples para uma primeira liberação. CoupleDNA deve ter aceite separado de privacidade e espera pelo parceiro.

## Alterações implementadas

- Catálogo comercial central com três produtos, usado na Home, Discover e sitemap.
- Backend recusa novas compras de produtos retirados, bundles e aliases; compras históricas continuam tendo seus grants verificados.
- Checkout exige conclusão da tentativa, usa o mercado persistido e mostra a oferta protegida do banco. Compradores já habilitados são encaminhados ao resultado.
- Fallback de mercado US independente de idioma; mapeamento dos 27 países da UE.
- Reconciliação Stripe verifica identidade do pedido, valor, moeda e produto antes de conceder acesso.
- Retry de refund/chargeback duplicado reaplica a operação idempotente; reembolso preparado como transação com lock de pedido.
- Erros de checkout retornam mensagem genérica localizada e ID para investigação; valores não são incluídos no log de mismatch.
- Persistência do token de recuperação é obrigatória antes do envio pago; idioma de reembolso usa o idioma da sessão.
- Eventos de visualização de página, quiz, resultado e relatório; endpoint público valida payload, limita volume e recusa eventos financeiros forjados.
- Trigger de pagamento preparado para registrar conversão na mesma transação do pedido, sem duplicação em retries concorrentes.
- RPC administrativa agrega toda a base de pedidos, por quiz e moeda, sem limitar receita aos últimos 50 pedidos. Eventos de página são contagens, não pessoas únicas.
- Limite distribuído de criação de sessão e checkout em produção; chaves HMAC, sem persistência de IP bruto.
- Testes unitários de segurança e adaptação das fixtures históricas, preservando testes dos produtos retirados.

## Evidências e limites da validação

Tipagem e lint passaram; 269 testes unitários em 39 arquivos passaram. O build gerou 165 páginas estáticas e o smoke HTTP passou em 38 verificações. O smoke valida renderização e gates de autenticação; o retorno administrativo com banco indisponível não é validação de métricas financeiras.

Os resultados finais dos comandos estão em `commercial-evidence-2026-10-18/validation.json`. Capturas e evidência de navegação estão em `commercial-evidence-2026-10-18/`.

A suíte completa foi executada e falhou por indisponibilidade do Supabase local: duas suítes exigem banco e uma auditoria não conseguiu ler o catálogo; dez arquivos ficaram ignorados pelos guards existentes. Nenhum teste foi enfraquecido ou acrescentado como skip para ocultar falha. A reexecução fora do sandbox confirmou que o Docker daemon não estava disponível.

QA de navegador: Playwright com Edge headless, pois o Browser plugin não está disponível. Catálogo em pt/en/es/fr, desktop 1440×1000 e celular 390×844; três cards e ausência de overflow horizontal. Home mobile promove apenas os três produtos. Clique em detalhes MoneyDNA chegou à página correta. Zero exceções de página. Houve dois HTTP 422 de analytics por falta de banco, registrados na evidência. Isso não comprova persistência dos eventos. Na repetição com o build final, o título MoneyDNA e o destino do link também foram confirmados após terminar a atualização da página.

Não foram executados nesta etapa: pagamento Stripe externo, transação live, SMTP real, teste de carga ou funil comercial completo no navegador com pagamento. A migração e os testes SQL descritos acima foram executados no banco remoto de homologação. As capturas anteriores representam o build local, não um teste da URL publicada.

## Fontes e operação

- Código: `src/features/{quiz-engine,scoring,commerce,results,couple,email,privacy,analytics}`; `src/app/api`; `src/content/quizzes`; `supabase/migrations`; testes e CI.
- Stripe: [fulfillment](https://docs.stripe.com/checkout/fulfillment?payment-ui=stripe-hosted) — webhook e idempotência, inclusive confirmação assíncrona.
- Supabase: [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) — políticas e proteção de dados. O índice de changelog não pôde ser lido pelo fetch web devido ao tipo de conteúdo; não houve atualização de dependências.
- Procedimentos, checklist, Stripe e rollback: [runbook comercial](../runbooks/commercial-launch.md).

O workspace já continha alterações na Home, CSS, navegação, seletor de idioma, catálogo e dicionário antes deste trabalho. Esta auditoria não atribui essas mudanças anteriores a esta implementação. A evidência de homologação antiga já estava modificada; os hooks da suíte de integração também escrevem esse arquivo. Não usar aquele artefato como aceite desta versão.
