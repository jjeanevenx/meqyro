# Lançamento comercial — três relatórios Meqyro

Este runbook prepara uma publicação revisável. A auditoria de 18/10/2026 ainda não aprova produção.

## Configuração

- Catálogo novo: BRAINRANK, MONEYDNA e COUPLEDNA, compra única. Os quatro demais e bundles não aceitam novas vendas. Grants históricos continuam suportados.
- Idiomas: pt/en/es/fr. Preferência de mercado e país determinam BR/US/EU/GB; idioma nunca determina moeda.
- `product_prices`: exatamente um preço ativo por quiz/mercado, inteiro em unidade mínima, moeda BRL/USD/EUR/GBP correspondente. Conferir oferta protegida, pedido persistido e Checkout. Não alterar preços de pedidos já criados.
- Checkout cria preços inline com o SDK oficial: não exige criar manualmente Price IDs no Dashboard. Metadados identificam pedido e produto. Não criar assinaturas.
- Secrets: `SUPABASE_SECRET_KEY`, `TOKEN_SECURITY_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SMTP_PASSWORD`, `ADMIN_API_SECRET`, `CRON_SECRET`, `REPORT_DELIVERY_SECRET`. Nunca usar prefixo NEXT_PUBLIC para segredos.
- Configuração pública: Supabase URL/publishable key e `NEXT_PUBLIC_SITE_URL` HTTPS no domínio aprovado. Test e live exigem configurações separadas.
- SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM`. Validar DNS do provedor realmente usado e caixa de suporte atendida. Não copiar configurações Resend de documentos antigos para Hostinger.
- Edge Function `deliver-report`: secrets correspondentes, acesso restrito por `REPORT_DELIVERY_SECRET`, SMTP e URL/credenciais do Supabase do mesmo ambiente.
- Produção usa o contador DB nas rotas críticas, independentemente de um backend em memória. A nova RPC deve existir antes da publicação.

## Stripe em modo de teste

1. Configurar a conta test e `STRIPE_SECRET_KEY` test no servidor. Configurar endpoint HTTPS de homologação `POST /api/webhooks/stripe` e seu signing secret próprio.
2. Subscrever `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `charge.refunded`, `charge.dispute.created`.
3. Habilitar métodos dinâmicos no Dashboard. Pix só deve ser prometido após confirmar elegibilidade da conta, moeda, cliente e execução assíncrona; a presença do badge não comprova suporte.
4. Para desenvolvimento, usar Stripe CLI autenticada encaminhando os eventos ao endpoint local. O secret do listener local é diferente do secret do endpoint de homologação.
5. Completar os três quizzes com respostas reais de teste. Conferir produto, moeda, total e idioma da sessão Stripe. Executar cartão aprovado e recusado, cancelamento e retorno antes do webhook.
6. Reenviar o mesmo evento e eventos concorrentes. Conferir um pagamento, um conjunto de grants, uma conversão e entrega sem duplicidade.
7. Impedir a chegada do webhook em um cenário test; executar a reconciliação autenticada e conferir o match de identidade/valor/moeda/produto.
8. Reembolsar somente em modo de teste nessa homologação. Conferir transação SQL, revogação, ledger e falha segura. Validar política de estorno parcial antes de utilizá-lo.
9. Fechar a aba antes da confirmação, abrir o e-mail em outro navegador e recuperar o relatório. Tokens errados/expirados e sessão de outra pessoa devem ser recusados.
10. No CoupleDNA, testar o comprador aguardando parceiro, consentimento ausente, revogado e renovado. Conferir que o acesso ao score individual do parceiro continua negado.

## Banco e qualidade

- [ ] Docker/Supabase de homologação disponíveis; nunca apontar os testes destrutivos para produção.
- [ ] Aplicar todas as migrações, incluindo `20261018231842_commercial_payment_safety.sql`, em banco isolado.
- [ ] Testar `refund_payment`, `consume_rate_limit`, trigger e `commercial_metrics` com transações reais e concorrência.
- [ ] RLS ativa e funções novas sem EXECUTE para PUBLIC/anon/authenticated; service_role apenas no servidor. Rodar advisors.
- [ ] `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm lint` e formatação no commit exato candidato.
- [ ] Unitários e integração passaram; skips justificados, sem marcar ausência de banco como sucesso.
- [ ] Revisar conteúdo premium e os quatro idiomas com exemplos reais dos três produtos.
- [ ] Verificar mobile, tablet, desktop, teclado, loading, erro, retomada e proteção contra perda de respostas.
- [ ] Verificar env público e bundle cliente sem segredos ou gabaritos.
- [ ] Aprovar retenção, exportação/exclusão, consentimentos e traduções legais.

## Métricas mínimas

Consultar `/api/admin/metrics` somente com autenticação administrativa. `metrics.byQuiz` traz inícios, conclusões, contagens de eventos, compras confirmadas e valores por moeda. A receita apresentada é a soma de pedidos PAID/FULFILLED, não receita líquida de taxas ou impostos. Não somar moedas diferentes.

Para acompanhamento por quiz: conclusão/início; oferta/resultado; checkout/oferta; compra/checkout. Abandono é a diferença entre contagens de sessões comparáveis, com mesma janela/coorte e tempo suficiente para confirmação assíncrona. Contagens de eventos podem incluir revisitas. `page_view` não identifica visitantes únicos. Não atribuir queda financeira a eventos de navegador sem comparar com pedidos e Stripe.

O trigger registra `payment_completed` atomicamente para novas confirmações após a migração; não preenche automaticamente eventos históricos. Receita e quantidade de compras usam pedidos persistidos, inclusive anteriores. Reconciliar com exportação test/live do Stripe identificada por pedido, PaymentIntent, moeda, valor, estorno e disputa.

## Publicação e operação

1. Confirmar domínio e projeto de hospedagem com o responsável. Criar release/commit revisado e registrar versão atual da aplicação e migrações aplicadas.
2. Criar backup e comprovar restauração em ambiente isolado. Não prometer PITR sem confirmar o plano contratado.
3. Publicar primeiro em homologação. Aplicar migração e testar os critérios acima. A aplicação nova depende das RPCs novas: publicar apenas o frontend antes do banco interrompe checkout e métricas.
4. Preparar secrets live e endpoint Stripe live no destino aprovado. Não reutilizar chaves test, webhook secrets ou arquivos de branding entre modos.
5. Configurar cron autenticado para `/api/cron/reconcile` a cada cinco minutos e alertar ausência de execução, falha e pedidos pagos sem entrega. `/api/health` só verifica vida HTTP, não prontidão de banco, Stripe ou SMTP.
6. Apresentar evidências do candidato para autorização final de publicação crítica e cobrança real controlada. **O pedido atual não autoriza uma operação financeira real.**
7. Depois de autorizado, publicar a versão homologada, confirmar DNS/HTTPS/cookies e realizar uma compra de baixo valor autorizada. Verificar pagamento efetivo, relatório, e-mail e recuperação.
8. Abrir tráfego limitado somente após esse aceite. Observar erros, conversão, receita, estornos e suporte antes de escalar.

## Rollback

- Em incidente, pausar a aquisição e as novas vendas na camada de hospedagem, mantendo webhook e reconciliação ativos para compradores que já pagaram.
- Reverter a aplicação para o artefato/commit anterior conhecido. Não usar reset de banco, reescrever migrações ou apagar pedidos, eventos, grants ou reembolsos.
- As novas funções e trigger são aditivos; normalmente podem permanecer no banco durante rollback da aplicação. Conferir compatibilidade do candidato anterior e evitar remover eventos já gravados.
- Se uma função nova for a causa, criar uma migração corretiva revisada. Nunca alterar o histórico de migrações já aplicado nem reativar um grant reembolsado para esconder o incidente.
- Reconciliar pagamentos recebidos durante a janela e reentregar relatórios pendentes. Documentar incidente, versão afetada, reparação e evidências antes de reabrir vendas.
