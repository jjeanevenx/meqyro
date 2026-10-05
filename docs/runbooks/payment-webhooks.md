# Runbook: Stripe Checkout, Webhooks e Conciliação

**Versão:** 3.0

**Status:** Stripe-only; validação externa em modo de teste pendente

## Arquitetura e segurança

- Endpoint: `POST /api/webhooks/stripe`.
- O SDK oficial valida o corpo bruto com `Stripe-Signature` e `STRIPE_WEBHOOK_SECRET`.
- O `client_reference_id` e os metadados `order_id`, `order_number` e `product_code` correlacionam a sessão ao pedido.
- Valor, moeda, produto e provedor são conferidos antes do fulfillment.
- `(provider, provider_event_id)` garante idempotência em `meqyro.payment_events`.
- Redirects nunca liberam conteúdo; somente webhook autenticado ou reconciliação server-side concede grants.

## Eventos processados

- `checkout.session.completed`: confirma somente quando `payment_status=paid`.
- `checkout.session.async_payment_succeeded`: confirma pagamentos assíncronos, incluindo métodos elegíveis.
- `checkout.session.async_payment_failed`: marca o pedido como falho.
- `charge.refunded`: revoga grants e marca o pedido como reembolsado.
- `charge.dispute.created`: revoga grants e registra chargeback.

## Teste local

1. Configure `STRIPE_SECRET_KEY=sk_test_...` em `.env.local`.
2. Autentique a Stripe CLI e execute:

   ```bash
   stripe listen \
     --events checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.async_payment_failed,charge.refunded,charge.dispute.created \
     --forward-to localhost:3000/api/webhooks/stripe
   ```

3. Copie o `whsec_...` exibido para `STRIPE_WEBHOOK_SECRET` e reinicie `pnpm dev`.
4. Habilite Pix e cartões nos métodos de pagamento do Dashboard em modo de teste.
5. Faça uma compra pelo fluxo real. Confira o pedido, `payment_events`, grant e acesso ao relatório.

## Diagnóstico

### Assinatura 401

Confirme que o corpo chega sem transformação e que o `whsec_...` pertence ao listener ou endpoint do mesmo modo da chave usada.

### Método não aparece

Checkout usa métodos dinâmicos. Confira habilitação no Dashboard, país da conta, país do cliente,
moeda, valor, navegador e dispositivo. Pix exige cliente no Brasil e apresentação em BRL. Carteiras
como Google Pay só aparecem quando o dispositivo e a configuração são elegíveis.

### Pedido pago ainda pendente

Consulte a entrega do evento no Workbench. A rotina `POST /api/cron/reconcile`, autenticada com
`CRON_SECRET`, também consulta sessões Stripe pendentes e repara fulfillment interrompido.
