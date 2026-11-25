# Runbook: Stripe Checkout, Webhooks e Conciliação

**Versão:** 3.0

**Status:** Stripe-only; segredos live salvos em Production, destino live desativado; validação externa em modo de teste pendente

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
- `checkout.session.expired`: encerra a tentativa de checkout expirada.
- `charge.refunded`: revoga grants e marca o pedido como reembolsado.
- `charge.dispute.created`: revoga grants e registra chargeback.

## Teste local

1. Configure `STRIPE_SECRET_KEY=sk_test_...` em `.env.local`.
2. Autentique a Stripe CLI e execute:

   ```bash
   stripe listen \
     --events checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.async_payment_failed,checkout.session.expired,charge.refunded,charge.dispute.created \
     --forward-to localhost:3000/api/webhooks/stripe
   ```

3. Copie o `whsec_...` exibido para `STRIPE_WEBHOOK_SECRET` e reinicie `pnpm dev`.
4. Habilite Pix e cartões nos métodos de pagamento do Dashboard em modo de teste.
5. Faça uma compra pelo fluxo real. Confira o pedido, `payment_events`, grant e acesso ao relatório.

## Configuração de Production

O destino principal é `https://meqyro.com/api/webhooks/stripe`. Os domínios secundários redirecionam para `meqyro.com` e não precisam de destinos duplicados. Use eventos de snapshot da própria conta; o handler atual consome `event.data.object`, não payloads thin. Selecione os seis eventos listados acima.

A versão de API do destino deve corresponder ao SDK instalado. Neste candidato, Stripe Node 22.6.2 fixa `2026-08-26.dahlia`, conforme `node_modules/stripe/cjs/apiVersion.js`. Reconfira esse valor se o SDK mudar; não altere a versão global da conta para configurar este destino.

Na Vercel, salve `STRIPE_SECRET_KEY` live (`sk_live_` ou `rk_live_` com permissões suficientes) e o `STRIPE_WEBHOOK_SECRET` específico desse destino como secrets, somente no target **Production**. O secret de um listener local ou de Preview não serve para esse destino. A chave publishable Stripe não é necessária para o Checkout hospedado atual. `STRIPE_BRAND_ICON_FILE_ID` é opcional e, se usado, deve apontar para um arquivo do mesmo modo live.

Os preços são resolvidos pelo servidor e enviados via `price_data` em cada sessão Checkout. O aplicativo não usa IDs fixos de produtos/preços Stripe e não depende de copiar o catálogo test para live.

Antes de habilitar entregas live, confirme a identidade da conta, sua habilitação para pagamentos e os métodos/moedas necessários. Confirme também que o domínio principal já serve o deployment Production correto por HTTPS, que a rota não exige login da Vercel nem redireciona, e que os secrets foram incorporados a esse deployment. Não enviar eventos live de uma conta para a homologação. Uma compra real depende de autorização específica; configurar o destino não comprova pagamento ou entrega de relatório.

Em 18/11/2026, a conta live J2E Solutions (`acct_1UJ5Rq6r3o8eejkY`) foi confirmada. A chave dedicada **Meqyro Production - Vercel** tem três permissões explícitas: Checkout Sessions com escrita, Charges and Refunds com leitura e Payment Intents com leitura. O destino **Meqyro Production** (`we_1UdJbC6r3o8eejkYtFTCY84Y`) foi criado com os seis eventos acima e a API indicada, e desativado imediatamente. Os dois segredos estão salvos como Secret/Production na Vercel; Preview foi preservado. O domínio ainda depende da troca de DNS e de deployment validado. Habilite o destino somente após concluir as verificações anteriores; nenhum pagamento real foi executado para essa configuração.

Referências: [checklist de produção](https://docs.stripe.com/get-started/checklist/go-live), [webhooks e formatos de evento](https://docs.stripe.com/webhooks), [gestão de chaves](https://docs.stripe.com/keys-best-practices).

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
