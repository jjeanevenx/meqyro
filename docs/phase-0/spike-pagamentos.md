# Spike de pagamentos — Stripe

> Registro histórico. A decisão atual é Stripe-only; consulte
> `docs/runbooks/payment-webhooks.md`.

**Data da verificação:** 25/09/2026  
**Fontes:** documentação pública oficial dos provedores. Recursos de conta não foram acessados.

## Decisão

- Todos os mercados BR/US/EU/GB: Stripe Checkout Sessions hospedado em modo `payment`, com preço definido no servidor e moeda determinada pelo mercado.
- O redirect nunca concede acesso. O premium nasce somente de `result_access_grants` após confirmação server-to-server.

## Stripe — o que está confirmado

A documentação oficial confirma:

- Checkout Sessions hospedado e modo de pagamento único;
- `client_reference_id` e metadata para reconciliação;
- webhook assinado, que deve ser verificado sobre o corpo bruto;
- suporte a mais de 135 moedas de apresentação, sujeito ao país da conta e método;
- expiração, reembolso e eventos de disputa por APIs/eventos próprios.

Fontes: [Checkout Sessions](https://docs.stripe.com/api/checkout/sessions), [webhooks](https://docs.stripe.com/webhooks), [moedas](https://docs.stripe.com/currencies) e [reembolsos](https://docs.stripe.com/refunds).

### Configuração proposta

- Checkout hospedado; `mode=payment`.
- Um `Price` editorial por produto/mercado/moeda, ou `price_data` criado somente de dados internos aprovados.
- `client_reference_id=order_id`; metadata mínima: `order_id`, `quiz_id`, `session_id` opaco interno.
- `success_url` e `cancel_url` sem segredos e sem efeito de autorização.
- Webhook com tolerância de timestamp padrão e deduplicação por `event.id`.
- Eventos mínimos: conclusão assíncrona quando aplicável, expiração, pagamento falhou, reembolso e disputa.
- Fixar versão da API na conta e no SDK.

### Prova de conta exigida

- [ ] Entidade, país e conta bancária aprovados.
- [ ] Moedas BRL, USD, EUR e GBP habilitadas para apresentação.
- [ ] Política de conversão e moeda de liquidação registrada.
- [ ] Checkout test mode concluído com cartão de sucesso, falha e autenticação.
- [ ] Stripe CLI ou encaminhamento de webhook testado localmente.
- [ ] Evento duplicado e fora de ordem ensaiado.
- [ ] Reembolso total e parcial ensaiados.
- [ ] Disputa simulada/testada conforme recursos disponíveis.
- [ ] Descriptor, suporte e e-mail do recibo configurados.

## Fiscal e política comercial

Stripe é o processador de pagamento, não substituem a definição fiscal do vendedor. Antes da produção, um responsável contábil/jurídico deve decidir:

- entidade que vende e país de estabelecimento;
- emissão de documento fiscal no Brasil;
- incidência e recolhimento de IVA/VAT/sales tax em venda digital internacional;
- política de arrependimento, reembolso e chargeback;
- preços com ou sem tributos incluídos;
- moedas de apresentação e de liquidação.

## Contrato do adaptador

```ts
interface PaymentProvider {
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>;
  getPaymentStatus(input: PaymentLookup): Promise<PaymentStatus>;
  verifyWebhook(input: RawWebhookInput): Promise<VerifiedPaymentEvent>;
  refund?(input: RefundInput): Promise<RefundResult>;
}
```

O Stripe SDK verifica a assinatura; a confirmação ainda confere pedido, valor, moeda e estado antes de liberar acesso.
