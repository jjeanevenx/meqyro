# Spike de pagamentos — InfinitePay e Stripe

**Data da verificação:** 25/09/2026  
**Fontes:** documentação pública oficial dos provedores. Recursos de conta não foram acessados.

## Decisão

- Brasil: InfinitePay Checkout Integrado, com preço e `order_nsu` definidos pelo servidor.
- Internacional: Stripe Checkout Sessions hospedado em modo `payment`.
- O redirect nunca concede acesso. O premium nasce somente de `result_access_grants` após confirmação server-to-server.
- O adaptador InfinitePay deve tratar o webhook como sinal para consulta, não como prova autossuficiente, até existir mecanismo oficial de autenticação documentado e validado.

## InfinitePay — o que está confirmado

A documentação oficial publica:

- criação de link por `POST https://api.checkout.infinitepay.io/links`;
- `order_nsu`, `redirect_url`, `webhook_url`, itens e cliente opcional;
- checkout com Pix e cartão;
- webhook de pagamento aprovado, com retentativa quando recebe HTTP 400;
- consulta `POST https://api.checkout.infinitepay.io/payment_check`;
- retorno de `paid`, `amount`, `paid_amount`, parcelas e método de captura.

Fonte: [Checkout Integrado](https://www.infinitepay.io/checkout-documentacao).

### Lacunas da documentação pública

Não foram encontrados, na documentação pública consultada:

- segredo ou assinatura criptográfica do webhook;
- sandbox ou credenciais de teste isoladas;
- contrato de idempotência na criação do link;
- API pública de reembolso/cancelamento;
- eventos de estorno/chargeback;
- SLA e política completa de retentativas;
- versionamento formal da API.

### Controle compensatório obrigatório

Ao receber webhook:

1. validar formato, tamanho, `order_nsu` e allowlist de campos;
2. registrar hash do payload e responder rapidamente;
3. consultar `payment_check` no servidor usando `handle`, `order_nsu`, `transaction_nsu` e `slug`;
4. comparar `amount`, moeda implícita BRL, itens e pedido esperado;
5. processar em transação idempotente;
6. conceder acesso apenas após `paid=true` e valores compatíveis.

Não usar IP allowlist como prova principal sem faixa oficial e política de mudança.

### Prova real exigida

- [ ] Conta aprovada e InfiniteTag disponível.
- [ ] Criar checkout de R$ 1,00 ou menor valor permitido em ambiente controlado.
- [ ] Pagar uma vez via Pix e uma vez via cartão.
- [ ] Capturar payloads de redirect, webhook e `payment_check` sem PII nos logs.
- [ ] Forçar HTTP 400 e medir retentativa.
- [ ] Reenviar o mesmo evento e comprovar idempotência.
- [ ] Confirmar com suporte como autenticar origem do webhook.
- [ ] Executar reembolso e documentar prazo, canal e sinal técnico recebido.
- [ ] Confirmar tratamento de chargeback e conciliação.

**Gate:** InfinitePay não pode liberar vendas públicas enquanto autenticação/consulta, reembolso e conciliação não forem ensaiados.

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
- [ ] Moedas USD, EUR e GBP habilitadas para apresentação.
- [ ] Política de conversão e moeda de liquidação registrada.
- [ ] Checkout test mode concluído com cartão de sucesso, falha e autenticação.
- [ ] Stripe CLI ou encaminhamento de webhook testado localmente.
- [ ] Evento duplicado e fora de ordem ensaiado.
- [ ] Reembolso total e parcial ensaiados.
- [ ] Disputa simulada/testada conforme recursos disponíveis.
- [ ] Descriptor, suporte e e-mail do recibo configurados.

## Fiscal e política comercial

Stripe e InfinitePay são processadores de pagamento, não substituem a definição fiscal do vendedor. Antes da produção, um responsável contábil/jurídico deve decidir:

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

Para InfinitePay, `verifyWebhook` deve retornar um evento **não confirmado** até a consulta `payment_check`; para Stripe, retorna confirmado após assinatura válida, mas a transição ainda confere pedido, valor, moeda e estado.
