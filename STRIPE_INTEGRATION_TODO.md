# Stripe Integration — pendências para teste local

O código está configurado para Stripe Checkout hospedado em todos os mercados. A sessão usa métodos
dinâmicos, sem `payment_method_types`, para a Stripe decidir quais opções elegíveis exibir.

## Já implementado

- Stripe como único provedor.
- Preço, moeda e produto resolvidos no servidor.
- Correlação de pedido por `client_reference_id` e metadados na sessão e no PaymentIntent.
- E-mail do comprador pré-preenchido no Checkout.
- Webhook com corpo bruto, assinatura, idempotência, validação de valor/moeda/produto e fulfillment.
- Eventos síncronos, assíncronos, reembolso e disputa.

## Falta configurar externamente

- `STRIPE_SECRET_KEY=sk_test_...` em `.env.local`.
- `STRIPE_WEBHOOK_SECRET=whsec_...` obtido pelo `stripe listen` local.
- Pix habilitado no Dashboard Stripe em modo de teste.
- Cartões e carteiras habilitados no Dashboard. Google Pay aparece somente em dispositivo/navegador elegível.
- Supabase local iniciado e migrações aplicadas para validar o funil persistido.

## Comandos do teste

```bash
pnpm supabase start
pnpm supabase db reset
stripe listen \
  --events checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.async_payment_failed,charge.refunded,charge.dispute.created \
  --forward-to localhost:3000/api/webhooks/stripe
pnpm dev
```

Use cartão de teste `4242 4242 4242 4242`, validade futura e qualquer CVC. Para Pix, selecione Pix
quando ele for oferecido em um Checkout BRL de teste e conclua a simulação apresentada pela Stripe.

Não habilite live mode antes de confirmar: sucesso, cancelamento, falha, Pix assíncrono, entrega
duplicada de webhook, fulfillment, concessão de grant e acesso ao relatório.
