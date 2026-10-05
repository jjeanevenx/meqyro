# PAYMENT IMPLEMENTATION AUDIT / PAYMENT READINESS REPORT

> Documento histórico, superado pela decisão Stripe-only de 01/10/2026. Consulte
> `docs/runbooks/payment-webhooks.md` para o estado operacional atual.

Data: 28/09/2026. Escopo: Stripe, Order, entitlement, e-mail, recuperação e UX de retorno.

## Estado encontrado antes das correções

### Stripe

| Item            | Classificação inicial | Evidência                                                                              |
| --------------- | --------------------- | -------------------------------------------------------------------------------------- |
| SDK             | MISSING               | Não havia pacote `stripe`; chamadas HTTP eram manuais.                                 |
| Create checkout | PARTIAL               | Usava API real com chave, mas criava `cs_test_*` falso sem chave em dev.               |
| Webhook         | PARTIAL               | HMAC manual; `checkout.session.completed` era aceito sem exigir `payment_status=paid`. |
| Persistence     | PARTIAL               | Order/attempt/event existiam, sem IDs do provider na Order e sem fulfillment atômico.  |
| Success         | BROKEN                | Exibia “Payment Confirmed” e “Access Granted” sem consultar Order.                     |
| Cancel          | PARTIAL               | Tela existia, mas não atualizava Order.                                                |
| Entitlement     | PARTIAL               | Grant server-side existia, mas era criado fora de transação e sem `order_id`.          |
| Status inicial  | PARTIAL               | Havia arquitetura real misturada com simulação.                                        |

## Implementação atual

- Stripe SDK `22.6.2`, com versão API embutida `2026-08-26.dahlia`.
- Checkout Sessions hospedado com preço resolvido no servidor, metadata mínima e idempotency key por Order.
- Webhook Stripe verificado pelo SDK sobre o raw body; conclusão só paga libera acesso.
- `market` é persistido na sessão a partir de cookie explícito ou geolocalização (`x-vercel-ip-country`/`cf-ipcountry`), separado de locale. Checkout ignora market enviado pelo browser.
- Order central com produto, provider checkout/payment IDs, expiração quando informada pelo provider e constraints de unicidade.
- Fulfillment em uma função Postgres transacional: Order e grants mudam juntos; grants carregam `order_id`.
- Evento duplicado retoma fulfillment interrompido sem duplicar Order/grant.
- Success começa em confirmação e só mostra sucesso quando `Order.status=FULFILLED`.
- Cancel marca a Order como `CANCELLED`; confirmação tardia real ainda prevalece.
- E-mail de compra usa idempotency key e link de recuperação seguro. `/{locale}/reports/access` oferece recuperação anti-enumeração por e-mail.
- Logs guardam metadados técnicos sanitizados, não payload completo/segredos.

## Readiness

### STRIPE

| Controle             | Resultado                                       |
| -------------------- | ----------------------------------------------- |
| SDK                  | PASS                                            |
| Checkout creation    | PASS (código/teste controlado)                  |
| Test payment         | NOT TESTED — credenciais/Stripe CLI ausentes    |
| Webhook              | PASS (unitário)                                 |
| Signature validation | PASS (SDK oficial)                              |
| Idempotency          | PASS (evento, Order, attempt, grant e Checkout) |
| Order                | PASS                                            |
| Entitlement          | PASS (Supabase local)                           |
| Full report unlock   | PASS (teste de integração controlado)           |

## Pendências e gates

### CODE COMPLETE

- Adapters, endpoints, persistência, transação, status UI, cancelamento, e-mail e recuperação.
- Migração `20260929011148_payment_readiness.sql` aplicada com sucesso no Supabase local.

### EXTERNAL CONFIG REQUIRED / CREDENTIAL REQUIRED

- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY` e `EMAIL_FROM`.
- Registrar `POST /api/webhooks/stripe` no Dashboard Stripe em test mode.

### MANUAL PROVIDER CONFIG REQUIRED

- Stripe: métodos/moedas, branding, receipts e eventos do webhook.

### NOT TESTED

- Cartão Stripe de sucesso/recusa, cancel real, webhook via Stripe CLI, refund/dispute real.
- Entrega real via Resend.

### PRODUCTION READY

**NO.** O código está pronto para validação TEST/CONTROLLED, mas produção permanece bloqueada até os testes reais acima e a configuração externa serem concluídos.

Fontes oficiais: [Stripe Checkout Sessions](https://docs.stripe.com/api/checkout/sessions/create), [Stripe webhook signatures](https://docs.stripe.com/webhooks/signature).
