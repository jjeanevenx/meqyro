# Meqyro — pendências para produção e início das vendas

Data: 02/10/2026. Base: código e documentação do checkout atual no workspace, incluindo alterações ainda não commitadas.

## Parecer

**Ainda não há evidência suficiente para liberar vendas em produção.** A aplicação tem boa parte da infraestrutura implementada, mas há bloqueios no conteúdo premium e faltam provas do funcionamento integrado com banco, Stripe e e-mail reais.

Publicar uma versão de homologação é o próximo passo operacional. Abrir vendas exige concluir os itens P0 abaixo. Não é necessário reconstruir o site: o trabalho concentra-se em corrigir a entrega prometida, configurar serviços e validar o funil completo.

Este relatório é uma auditoria do repositório, não uma certificação do ambiente online. Não foram inspecionados painéis de hosting, DNS, Stripe, Resend ou Supabase Cloud. “Não comprovado” não significa que a configuração não exista. Não houve pagamento real, envio de e-mail ou alteração de infraestrutura nesta análise.

## O que já existe

| Área        | Evidência no repositório                                                                           | Limite da evidência                                                            |
| ----------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Produto     | Sete quizzes, pontuação no servidor, captura de e-mail, páginas de resultado                       | Renderizar e pontuar não comprova qualidade do relatório pago                  |
| Pagamento   | Stripe Checkout hospedado, preço no servidor, validação de assinatura, eventos assíncronos         | Runbook atual declara validação externa em test mode pendente                  |
| Liberação   | RPC `complete_payment`, grants vinculados ao pedido, idempotência e revogação em reembolso/disputa | Precisa funcionar com migrações e permissões do banco de produção              |
| Recuperação | Links seguros de resultado e página `/[locale]/reports/access`                                     | Entrega real, expiração e uso em outro dispositivo precisam ser testados       |
| Operação    | Reconciliação, admin, logs e runbooks                                                              | Agenda, alertas e restauração não comprovados externamente                     |
| Aquisição   | Landing pages, artigos, sitemap, robots e analytics próprios                                       | Conversão, atribuição e desempenho precisam ser medidos no ambiente publicado  |
| Qualidade   | Workflow CI com format, lint, tipagem, testes, build e smoke                                       | Histórico documentado não substitui uma execução aprovada da versão a publicar |

O provedor atual é **Stripe-only**. O audit de 28/09 é histórico; não deve ser usado como checklist atual.

## P0 — concluir antes da primeira venda

| ID    | Pendência e evidência                                                                                                                                                                                                                                                                 | Ação necessária                                                                                                                                                                      | Critério de conclusão                                                                                                                                                             | Responsável sugerido                          |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P0-01 | Conteúdo premium parcialmente genérico em `src/features/results/result-service.ts`. BrainRank mantém elogios fixos com qualquer score; CoupleDNA fixa percentil 90; os cinco demais usam percentil 85 e textos genéricos. BrainRank converte score em percentil por simples proporção | Gerar interpretação por resultado e dimensões reais. Remover comparações populacionais sem base documentada. Revisar o valor entregue por cada produto                               | Resultados baixos, médios e altos geram interpretações coerentes; perfis distintos geram relatórios distintos; nenhum percentil arbitrário aparece na entrega                     | Produto + engenharia                          |
| P0-02 | Oferta lista “Síntese para download” e “Acesso vitalício”; política de privacidade diz “Acesso vitalício garantido por até 24 meses”                                                                                                                                                  | Definir duração do acesso e formato entregue. Implementar download se continuar na oferta, ou ajustar a promessa. Alinhar landing, paywall, checkout, relatório e termos             | Cliente recebe todas as funcionalidades anunciadas e encontra a mesma duração de acesso em todas as páginas                                                                       | Produto + engenharia                          |
| P0-03 | Stripe externa ainda pendente segundo `docs/runbooks/payment-webhooks.md` e `STRIPE_INTEGRATION_TODO.md`                                                                                                                                                                              | Concluir configuração da conta, meios elegíveis, endpoint e secrets separados de teste/live. Validar com sessões criadas pela aplicação                                              | Compra test mode completa: pagamento → evento autenticado → pedido FULFILLED → grant → relatório. Recusa, cancelamento, atraso, duplicação, reembolso e disputa também conferidos | Engenharia + titular da conta                 |
| P0-04 | Migrações e schema `meqyro` existem, mas não há prova do estado do Supabase Cloud nesta auditoria                                                                                                                                                                                     | Aplicar migrações em ordem, carregar catálogo/banco de questões, verificar schema acessível ao servidor e restrito aos papéis previstos, preços e RPCs                               | Funil persistido funciona após reiniciar a aplicação; acesso anônimo direto a dados privados é negado; todos os produtos ativos têm questões e preços válidos                     | Engenharia                                    |
| P0-05 | Configuração do deploy/domínio não comprovada                                                                                                                                                                                                                                         | Publicar versão identificada, configurar domínio/HTTPS e variáveis por ambiente; manter homologação com credenciais de teste                                                         | URLs de checkout e e-mail usam o domínio correto; nenhum localhost ou chave de teste no fluxo live; versão publicável tem CI aprovada                                             | Engenharia                                    |
| P0-06 | Resend implementado, mas sem prova de entrega real; sem chave em produção retorna falha                                                                                                                                                                                               | Configurar remetente, domínio e autenticação DNS com valores fornecidos pelo provedor. Testar confirmação, recuperação, privacidade e convite quando vendido                         | Mensagem chega, link abre o relatório correto em outro navegador e recuperação funciona sem liberar relatório alheio                                                              | Engenharia + operação                         |
| P0-07 | `RATE_LIMIT_BACKEND=db` na configuração de exemplo não é consumido pelo limitador. Implementação usa `Map` local; criação de sessão não chama limitador                                                                                                                               | Aplicar proteção distribuída no app ou infraestrutura aos endpoints expostos, incluindo sessão, leads, recuperação e checkout; validar origem dos headers de IP no hosting escolhido | Limites continuam funcionando com múltiplas instâncias e não são contornados trocando headers enviados pelo cliente                                                               | Engenharia                                    |
| P0-08 | Cron existe, mas agendamento não comprovado. Reconciliação repara grants; não inclui varredura de e-mails de compra não enviados                                                                                                                                                      | Agendar `/api/cron/reconcile` autenticado. Adicionar retry persistente ou rotina operacional comprovada para e-mails falhos e compras recuperadas por cron                           | Pagamento com webhook perdido é recuperado; comprador recebe acesso mesmo fechando a aba; falha temporária de e-mail tem reprocessamento e alerta                                 | Engenharia + operação                         |
| P0-09 | Política promete exclusão de respostas após 30 dias e retenção de 12/24 meses. Rotina examinada expira sessões e revoga tokens, sem implementar esses ciclos completos                                                                                                                | Implementar retenção real ou ajustar política ao comportamento aprovado. Revisar identidade do fornecedor, canais e tratamento de dados com os responsáveis                          | Política e rotina executada concordam; exportação/exclusão/descadastro foram validados em homologação                                                                             | Engenharia + responsável jurídico/privacidade |
| P0-10 | Contato usa `support@meqyro.com`; termos usam `suporte@meqyro.com`; privacidade usa `dpo@meqyro.com`. Disponibilidade dessas caixas não comprovada                                                                                                                                    | Confirmar caixas/aliases atendidos, responsável pelo suporte e procedimento de reembolso. Definir cadastro comercial e emissão fiscal com o responsável contábil                     | Pedido de suporte e reembolso chega a uma pessoa responsável; processo de atendimento e registro da venda definido                                                                | Operação + titular do negócio                 |
| P0-11 | Funil com provedor real e QA de navegador da versão atual não comprovados                                                                                                                                                                                                             | Executar roteiro abaixo em homologação e compra controlada live com autorização do titular, após configurar produção                                                                 | Evidências vinculam sessão, pedido, pagamento, evento, acesso e entrega; ausência de falhas impeditivas no mobile e desktop                                                       | Engenharia + produto                          |
| P0-12 | `pnpm check` falhou no lint nesta auditoria: 11 erros e 9 avisos, sobretudo `any` explícito em testes                                                                                                                                                                                 | Corrigir os erros de lint e executar novamente o pipeline completo, incluindo formatação e smoke do CI                                                                               | CI aprovada no commit exato do lançamento, com integração persistida executada e skips identificados                                                                              | Engenharia                                    |

P0-07 é bloqueio operacional recomendado para venda pública com tráfego. O endpoint de saúde atual responde `ok` sem consultar banco, Stripe ou e-mail: um HTTP 200 não comprova que a loja pode vender.

## P1 — preparar para operar e adquirir clientes

1. **Alertas e disponibilidade:** monitorar erro de checkout, webhook inválido/falho, pedido pago sem entrega, e-mail falho e cron ausente. Separar disponibilidade HTTP da prontidão de dependências. Nomear quem recebe e atende cada alerta.
2. **Backup e recuperação:** confirmar plano e configuração reais. O runbook declara snapshots com 30 dias e PITR, mas isso não comprova contratação ou ativação. Fazer restauração em ambiente isolado e registrar tempo e perda máxima de dados aceitáveis.
3. **Métricas de venda:** validar persistência de eventos de início/conclusão do quiz, visualização de oferta, checkout iniciado/concluído, entrega, reembolso e origem da visita. Conciliar pedidos pagos com Stripe; diferenciar receita bruta de receita após taxas, reembolsos e impostos.
4. **Preço e margem:** conferir consistência entre catálogo, banco e checkout. Código possui BrainRank BR por R$ 12,90 e bundles BR por R$ 19,90/R$ 39,90; são valores configurados, não uma validação da estratégia comercial. Calcular margem e limite de custo de aquisição antes de escalar anúncios.
5. **Idiomas e mercados:** páginas legais examinadas continuam em português mesmo sob outros locales; relatório trata muitos textos como inglês ou português. Traduzir os mercados vendidos ou restringir a oferta inicial aos mercados efetivamente revisados.
6. **Qualidade de experiência:** testar celular, teclado, foco, retomada, conexão instável, estados de erro e carregamento. Medir desempenho das páginas reais e corrigir problemas que atrapalham completar ou comprar.
7. **Documentação operacional:** atualizar divergências sobre healthcheck, retenção, cron, schema/locks, contagem de tabelas e garantias de entregabilidade. Não usar a afirmação “99%+ inbox” do documento como resultado medido.
8. **Versão e rollback:** consolidar alterações atuais em versão revisada; há vários arquivos modificados e não rastreados. Registrar commit publicado, migrações aplicadas e como reverter aplicação sem desfazer registros financeiros.

## Roteiro de aceite do funil

Executar cada cenário com registro de ambiente, versão, data, resultado e IDs técnicos, sem guardar chaves ou dados pessoais no relatório de evidências.

- [ ] Todos os quizzes oferecidos: início, respostas, retomada, conclusão e score coerente.
- [ ] Resultado gratuito não revela conteúdo premium por UI, API ou acesso direto.
- [ ] Compra unitária: preço/moeda corretos, pagamento, acesso e confirmação por e-mail.
- [ ] Bundles: cada produto incluído pode ser usado e acessado conforme a promessa, inclusive quizzes iniciados depois da compra.
- [ ] CoupleDNA, se vendido: convite, segundo participante, consentimentos e comparação com dados de ambos.
- [ ] Cartão aprovado, recusado e cancelamento do checkout.
- [ ] Pix, se oferecido pela conta: pendente sem liberação, confirmação assíncrona e falha/expiração.
- [ ] Retorno à success antes do webhook não afirma pagamento confirmado indevidamente.
- [ ] Webhook duplicado não duplica pedido, grant ou entrega.
- [ ] Assinatura inválida e divergência de valor/moeda/produto não liberam acesso.
- [ ] Webhook atrasado/perdido e aba fechada: cron recupera compra e entrega.
- [ ] E-mail indisponível temporariamente: retry entrega depois, com alerta em falha persistente.
- [ ] Recuperação de compra em outro navegador; token inválido/expirado e relatório de outra pessoa são negados.
- [ ] Reembolso/disputa: status e acesso correspondem à política definida.
- [ ] Exportação, exclusão e descadastro persistidos; cron de retenção compatível com a política.
- [ ] Mobile e desktop: pagamento e acesso concluídos sem bloqueio de navegação.
- [ ] Compra controlada em live: cobrança, relatório, e-mail e procedimento de suporte comprovados antes de ampliar tráfego.

## Sequência sugerida

| Etapa | Entrega                                                                    | Dependência                        |
| ----- | -------------------------------------------------------------------------- | ---------------------------------- |
| 1     | Definir oferta, duração de acesso e corrigir conteúdo premium              | Decisão de produto                 |
| 2     | Consolidar versão, publicar homologação, preparar banco e secrets de teste | Acesso às contas de infraestrutura |
| 3     | Concluir proteção distribuída, retenção, retries, cron e alertas           | Ambiente persistido                |
| 4     | Testar Stripe/Resend reais em modo de teste e executar QA                  | Configuração dos provedores        |
| 5     | Preparar live, suporte, backup e compra controlada                         | Todos os P0 concluídos             |
| 6     | Abrir vendas com tráfego limitado e observar conversão/entrega             | Aceite registrado                  |
| 7     | Escalar aquisição após conhecer margem, conversão e reembolsos             | Dados das primeiras vendas         |

Não há estimativa confiável de prazo sem confirmar acessos externos e a profundidade da revisão dos sete relatórios. Uma alternativa de escopo é lançar primeiro um único produto/mercado completamente revisado, retirando da oferta o que ainda não passou pelo aceite.

## Verificação nesta auditoria

- Leitura de código, migrações, CI, runbooks, oferta e páginas institucionais.
- Guia de produção do Next.js instalado consultado em `node_modules/next/dist/docs/01-app/02-guides/production-checklist.md`, conforme AGENTS.md.
- Comandos iniciais de lint, tipagem e testes bloquearam por `EPERM` ao ler dependências no sandbox; nenhuma suíte iniciou nessas tentativas.
- Reexecução de `pnpm check` fora da restrição: **reprovado no lint, com 11 erros e 9 avisos**. Erros em `tests/unit/db-questions-audit.test.ts` e `tests/unit/selection-engine.test.ts`; também há avisos em outros testes. Tipagem, testes e build não foram executados por esse comando porque a sequência para na primeira falha. Formatação e smoke não foram executados nesta auditoria.
- Existem duas configurações de Vitest: a `.ts` inclui integração e a `.mts` inclui somente unitários. Confirmar a configuração usada no CI, preferencialmente com comando explícito. `tests/integration/db-check.ts` permite detectar banco indisponível; conferir quais testes foram efetivamente executados ou pulados antes de declarar integração aprovada.
- Não foram executados testes com serviços externos, inspeção visual de navegador ou compra live.

## Fontes locais principais

- `STRIPE_INTEGRATION_TODO.md` e `docs/runbooks/payment-webhooks.md`: situação atual dos pagamentos.
- `src/features/results/result-service.ts`: promessa e conteúdo premium.
- `src/features/commerce/{order-service,fulfillment-service,webhook-handler,reconciliation-service}.ts`: compra, liberação, entrega e recuperação.
- `src/features/email/email-service.ts`: integração de e-mail.
- `src/lib/security/rate-limit.ts` e `src/app/api/sessions/route.ts`: proteção de tráfego.
- `src/app/[locale]/legal/{terms,privacy}/page.tsx` e `src/app/[locale]/contact/page.tsx`: condições publicadas.
- `.env.example`, `.github/workflows/ci.yml`, `vitest.config.ts`, `vitest.config.mts`, `tests/integration/db-check.ts`: configuração e verificações.
- `docs/runbooks/database-backup-restore.md`, `docs/operations/email-deliverability.md`: procedimentos que exigem confirmação externa.
