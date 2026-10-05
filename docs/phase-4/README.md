# Fase 4 — Comércio e Fulfillment

**Data de validação:** 26/09/2026  
**Estado:** Concluído localmente; Stripe é o único provedor, com precificação exclusivamente server-side (zero manipulação de preços pelo cliente), webhooks assinados com processamento estritamente idempotente (tabela append-only com restrição única de provider_event_id), máquina de estados de pedidos (`CREATED -> PENDING -> PAID -> FULFILLED`), concessão automática de grants premium (`result_access_grants`), reconciliação de pedidos e páginas completas de checkout e retorno (`/[locale]/checkout`, `/success`, `/pending`, `/failed`).

## Entregas

| Item                                 | Estado    | Evidência                                                                                                                                         |
| ------------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| F4-01 Modelo de dados comercial      | Concluído | Migration `20260926030000_commerce_fulfillment.sql` com `orders`, `order_items`, `payment_attempts`, `payment_events`, `refunds`                  |
| F4-02 Precificação server-side       | Concluído | Preço é resolvido exclusivamente no servidor consultando `meqyro.product_prices` aprovado. Payload do cliente não pode definir ou alterar valores |
| F4-03 Adapter de pagamento           | Concluído | Interface `PaymentProvider` com `StripeAdapter` e métodos dinâmicos (Pix, cartões e carteiras elegíveis)                                          |
| F4-04 Ingestão idempotente webhooks  | Concluído | Tabela `payment_events` com restrição única `(provider, provider_event_id)`. Eventos duplicados são descartados de forma segura e idempotente     |
| F4-05 Fulfillment automático         | Concluído | `fulfillment-service.ts` concede grant `PREMIUM_REPORT` na tabela `result_access_grants` e transiciona pedido para `PAID` e `FULFILLED`           |
| F4-06 Reconciliação e resiliência    | Concluído | `reconciliation-service.ts` detecta pedidos pagos sem fulfillment ou pendentes e executa autofix e sincronização                                  |
| F4-07 Reembolsos rastreáveis         | Concluído | `refundOrder` registra motivo em `refunds`, revoga grant de acesso e transiciona pedido para `REFUNDED`                                           |
| F4-08 APIs de comércio               | Concluído | `POST /api/checkout`, `POST /api/webhooks/stripe`, `GET /api/orders/[id]`                                                                         |
| F4-09 Interface de checkout e status | Concluído | `/[locale]/checkout`, `/[locale]/checkout/success`, `/[locale]/checkout/pending`, `/[locale]/checkout/failed` estilizadas e responsivas           |

## Validação executada

- **ESLint**: aprovado (zero erros e zero avisos).
- **TypeScript (`tsc --noEmit`)**: aprovado (zero erros de tipo).
- **Vitest**: 13 arquivos e 37 testes aprovados (`tests/unit/commerce.test.ts`), cobrindo:
  - Criação de pedido com preço do servidor e inicialização da máquina de estados.
  - Fulfillment idempotente com concessão de grant `PREMIUM_REPORT` e transição `PAID -> FULFILLED`.
  - Ingestão de webhooks com verificação criptográfica de assinatura e descarte seguro de duplicatas.
  - Reconciliação automática de pedidos com fulfillment pendente e cancelamento/estorno com revogação de acessos.
- **Next.js Production Build**: aprovado (Next.js 16.3.6 Turbopack) gerando 55 rotas SSG/SSR estáticas e dinâmicas, sem erros de prerenderização.
- **Smoke Test (`pnpm smoke`)**:
  - `GET /api/health` -> `200`
  - `GET /pt`, `/en`, `/es`, `/fr` -> `200`
  - `GET /pt/quizzes/brainrank` -> `200`
  - `GET /en/quizzes/personality-map` -> `200`
  - `GET /pt/legal/privacy` -> `200`
  - `GET /pt/legal/terms` -> `200`
  - `GET /pt/privacy/data-request` -> `200`
  - `GET /pt/unsubscribe` -> `200`
  - `GET /pt/checkout` -> `200`
  - `GET /pt/checkout/success` -> `200`
  - `GET /pt/checkout/pending` -> `200`
  - `GET /pt/checkout/failed` -> `200`
- **Segurança e RLS**:
  - Todas as 5 tabelas da Fase 4 criadas no schema `meqyro` com RLS ativado.
  - Zero permissões concedidas a `anon`, `authenticated` ou `PUBLIC`.
  - Verificação rigorosa de HMAC nas requisições de webhook.
  - Redação automática de dados sensíveis e credenciais nos logs operacionais.

## Critérios de Aceite da Fase 4 (PLANO_DE_IMPLEMENTACAO_MEQYRO_V1.md)

1. _Nenhum preço enviado pelo cliente é confiado:_ **Aprovado.** Toda precificação é resolvida pelo `order-service.ts` a partir de `meqyro.product_prices`.
2. _Webhook duplicado nunca concede fulfillment duplo:_ **Aprovado.** A restrição única `(provider, provider_event_id)` em `meqyro.payment_events` e a lógica de idempotência em `fulfillment-service.ts` garantem execução única.
3. _Acesso premium é protegido por grant no banco:_ **Aprovado.** Desbloqueio depende exclusivamente da presença de registro ativo em `meqyro.result_access_grants`.
