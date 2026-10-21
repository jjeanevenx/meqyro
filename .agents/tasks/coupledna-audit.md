# Auditoria Completa — CoupleDNA (Meqyro)

**Data:** 2025-07-  
**Objetivo:** Mapa detalhado da implementação atual para servir de base ao documento de controle de progresso da funcionalidade de convites pagos, multiparticipantes e relatórios comparativos.

---

## SUMÁRIO EXECUTIVO

A implementação existente do CoupleDNA cobre o fluxo bilateral de **dois participantes fixos** (1 anfitrião + 1 parceiro) com checkout Stripe para o relatório comparativo. O que **está implementado e funcional**:

- Quiz com 20 perguntas LIKERT, 5 dimensões, 4 idiomas
- Scoring individual + comparação bilateral (pure functions)
- Convite por código (tabela `couple_invites`), consentimento bilateral (`couple_consents`)
- Checkout Stripe via fluxo genérico existente (product code `COUPLEDNA`)
- Paywalled comparison: pagamento confirma acesso; `findPaidEntitlement()` detecta entitlement cruzado entre parceiros
- Relatório bilateral (`buildCoupleReport`) com 5 seções de dimensão
- Página de resultado com componente `CoupleResultPanel` que gerencia os estados

O que está **completamente ausente**:

- **N convidados** (>1): a arquitetura atual suporta apenas 1 parceiro por convite
- **Pagamento por convite individual**: não existe; o pagamento atual é por relatório individual
- **Precificação progressiva** (P + (N-1) × P/3): não existe
- **Dashboard de anfitrião**: não existe listagem/gerenciamento de múltiplos convidados
- **Isolamento de privacidade entre convidados**: não existe mecanismo (estrutural, pois há só 1)
- **Geração de link pós-pagamento**: os links são gerados antes do pagamento
- **Vinculação payment → invite**: os pagamentos são por `session_id` e `product_code`, sem vínculo com convite específico

---

## 1. QUIZ CONTENT

**Arquivo:** `src/content/quizzes/coupledna.ts`

- **20 perguntas LIKERT** (escala 1–5)
- **5 dimensões** com 4 perguntas cada:
  - `COMMUNICATION` — questões CD_COMM_01 a CD_COMM_04
  - `LIFE_VALUES` — questões CD_VAL_01 a CD_VAL_04
  - `CONFLICT_MANAGEMENT` — questões CD_CONF_01 a CD_CONF_04
  - `FINANCES` — questões CD_FIN_01 a CD_FIN_04
  - `FUTURE_PLANS` — questões CD_FUT_01 a CD_FUT_04
- **4 idiomas** presentes em todas as perguntas: `pt`, `en`, `es`, `fr`
- Tipo exportado: `CoupleDnaQuestionDef` com campos `stableKey`, `position`, `dimension`, `prompt`
- Array exportado como `coupleDnaQuestions: readonly CoupleDnaQuestionDef[]`

---

## 2. SCORING

**Arquivo:** `src/features/scoring/coupledna.ts`

### Tipos exportados

```typescript
export type CoupleDimension =
  "COMMUNICATION" | "LIFE_VALUES" | "CONFLICT_MANAGEMENT" | "FINANCES" | "FUTURE_PLANS";

export interface IndividualCoupleScore {
  dimensionScores: Record<CoupleDimension, number>; // 0 a 100
  totalResponses: number;
}

export interface BilateralCoupleComparison {
  bilateralUnlocked: boolean;
  overallAlignmentPercentage: number; // 0 a 100
  dimensionAlignments: Record<CoupleDimension, number>; // 0 a 100
  strongestAlignment: CoupleDimension;
  growthDialogueArea: CoupleDimension;
}
```

### Objeto exportado: `coupleDnaScoringV1`

**`scoreIndividual(items, answers)`**

- Converte escala Likert 1–5 para 0–100 por dimensão: `Math.round(((media - 1) / 4) * 100)`
- Fallback = 50 para dimensão sem respostas

**`compareBilateral(scoreA, scoreB, consentsGiven)`**

- Se `consentsGiven === false`: retorna `bilateralUnlocked: false` com zeros
- Alinhamento por dimensão = `100 - |scoreA - scoreB|` (mín 0)
- `overallAlignmentPercentage` = média dos 5 alinhamentos
- `strongestAlignment` = dimensão com maior alinhamento
- `growthDialogueArea` = dimensão com menor alinhamento

### Contrato ScoringContract

O `coupleDnaScoringV1` **não implementa formalmente a interface `ScoringContract`** (não há arquivo `src/features/scoring/contracts.ts` genérico). É um objeto com métodos diretos, diferente de outros scorings que exportam funções puras simples.

---

## 3. MODELO DE DADOS (Supabase)

### Tabelas centrais de CoupleDNA

#### `meqyro.couple_invites`

Migration: `20260926050000_coupledna_bilateral.sql`

| Coluna                      | Tipo                             | Descrição                                                                  |
| --------------------------- | -------------------------------- | -------------------------------------------------------------------------- |
| `id`                        | uuid PK                          |                                                                            |
| `invite_code`               | text UNIQUE                      | Padrão `^[A-Z0-9_-]{6,32}$`. Gerado como `CP-XXXXXXXX` (ex: `CP-3A7F9E12`) |
| `initiator_session_id`      | uuid FK → quiz_sessions          | Quem criou o convite                                                       |
| `partner_session_id`        | uuid FK → quiz_sessions NULLABLE | Quem aceitou                                                               |
| `status`                    | text                             | `PENDING`, `ACCEPTED`, `COMPLETED`, `EXPIRED`                              |
| `expires_at`                | timestamptz                      | Padrão: 14 dias                                                            |
| `created_at` / `updated_at` | timestamptz                      |                                                                            |

**Índices:**

- `couple_invites_code_idx` em `invite_code`
- `couple_invites_initiator_idx` em `initiator_session_id`
- `couple_invites_active_initiator_unique` UNIQUE parcial onde `status <> 'EXPIRED'` (adicionado em `20261004223516`)
- `couple_invites_active_partner_unique` UNIQUE parcial onde `partner_session_id IS NOT NULL AND status <> 'EXPIRED'` (idem)

**Restrição estrutural crítica:** Os dois índices únicos parciais acima **garantem que cada sessão pode estar em no máximo 1 convite ativo ao mesmo tempo**. Isso torna impossível suportar N convidados sem uma mudança de schema.

#### `meqyro.couple_consents`

Migration: `20260926050000_coupledna_bilateral.sql`

| Coluna                 | Tipo                     | Descrição    |
| ---------------------- | ------------------------ | ------------ |
| `id`                   | uuid PK                  |              |
| `invite_id`            | uuid FK → couple_invites |              |
| `session_id`           | uuid FK → quiz_sessions  |              |
| `can_share_comparison` | boolean                  | Default true |
| `consented_at`         | timestamptz              |              |

- UNIQUE em `(invite_id, session_id)`
- RLS: `service_role` apenas

### Tabelas de Comércio relevantes

#### `meqyro.orders`

Migration: `20260926030000_commerce_fulfillment.sql` + `20260929011148_payment_readiness.sql`

Colunas-chave:

- `session_id` — vincula o pagamento a uma sessão
- `product_code` — `COUPLEDNA` para compras do CoupleDNA
- `amount`, `currency`, `market` — persistidos no momento da compra
- `payment_provider` — `stripe` apenas (constraint `orders_stripe_only` via `20261011012737`)
- `lookup_token_hash` — token para verificação pós-checkout
- `status` — `CREATED → PROCESSING → PENDING → FULFILLED → REFUNDED`

Índice único: `orders_active_purchase_unique ON (session_id, product_code)` where status ∈ active. **Isso garante apenas 1 compra ativa por `(session_id, product_code)` — estrutura assume 1 compra por sessão.**

#### `meqyro.result_access_grants`

Migration: `20260926020000_leads_privacy_results.sql` + `20260929011148_payment_readiness.sql`

- `session_id`, `product_code`, `grant_type`, `order_id`
- `grant_type`: `FREE_PARTIAL`, `PREMIUM_REPORT`, `PREMIUM_BUNDLE`
- UNIQUE: `result_access_grants_order_product_unique ON (order_id, product_code, grant_type)` where `order_id IS NOT NULL`

#### `meqyro.product_prices`

Migration: `20260925124431_foundation_catalog.sql`

- `(quiz_id, market, currency)` UNIQUE
- `amount` em unidades mínimas (ex: 1490 = R$ 14,90)

**Preço atual do CoupleDNA** (migration `20260926050000_coupledna_bilateral.sql`):

| Market | Currency | Amount          |
| ------ | -------- | --------------- |
| BR     | BRL      | 1490 (R$ 14,90) |
| US     | USD      | 399 ($3,99)     |
| EU     | EUR      | 399 (€3,99)     |
| GB     | GBP      | 349 (£3,49)     |

#### `meqyro.payment_events`

- UNIQUE em `(provider, provider_event_id)` — idempotência de webhooks
- Constraint `payment_events_stripe_only`

#### `meqyro.quiz_sessions`

- `buyer_id` (uuid) — adicionado em `20261004223516` para ligar sessões do mesmo "comprador"
- `access_token_hash` (hex SHA-256) — autenticação sem conta

### Tabelas SEM relação com convites atualmente

As tabelas `orders`, `order_items`, `payment_events`, `result_access_grants` **não têm coluna `invite_id`**. Não há como identificar qual pagamento corresponde a qual convite específico.

---

## 4. API ROUTES

### Rotas CoupleDNA-específicas

| Rota                        | Método | Arquivo                                     | Função                                     |
| --------------------------- | ------ | ------------------------------------------- | ------------------------------------------ |
| `/api/couple/invite`        | POST   | `src/app/api/couple/invite/route.ts`        | Cria convite; requer `consent: true`       |
| `/api/couple/consent`       | POST   | `src/app/api/couple/consent/route.ts`       | Atualiza consentimento de compartilhamento |
| `/api/couple/status/[code]` | GET    | `src/app/api/couple/status/[code]/route.ts` | Retorna `BilateralCoupleComparison`        |

### Rotas de pagamento/checkout

| Rota                   | Método | Arquivo                                | Função                               |
| ---------------------- | ------ | -------------------------------------- | ------------------------------------ |
| `/api/checkout`        | POST   | `src/app/api/checkout/route.ts`        | Cria ordem + Stripe Checkout Session |
| `/api/webhooks/stripe` | POST   | `src/app/api/webhooks/stripe/route.ts` | Processa eventos Stripe              |
| `/api/orders/[id]`     | GET    | `src/app/api/orders/[id]/`             | Consulta status de ordem             |

### Rotas de sessão/resultado

| Rota                          | Método | Arquivo                                       |
| ----------------------------- | ------ | --------------------------------------------- |
| `/api/sessions`               | POST   | `src/app/api/sessions/route.ts`               |
| `/api/sessions/[id]/answers`  | POST   | `src/app/api/sessions/[id]/answers/route.ts`  |
| `/api/sessions/[id]/complete` | POST   | `src/app/api/sessions/[id]/complete/route.ts` |
| `/api/sessions/[id]/result`   | GET    | `src/app/api/sessions/[id]/result/route.ts`   |
| `/api/sessions/[id]/report`   | GET    | `src/app/api/sessions/[id]/report/route.ts`   |
| `/api/sessions/recover`       | POST   | `src/app/api/sessions/recover/route.ts`       |

---

## 5. FEATURES (server-only)

### `src/features/couple/couple-service.ts`

Módulo servidor (`import "server-only"`). Funções exportadas:

| Função                                                  | Descrição                                                                             |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `createCoupleInvite(sessionId, token, locale, consent)` | Cria ou reusa convite; upsert de consentimento. Reutiliza convite ativo se existente. |
| `acceptCoupleInvite(code, sessionId, token, consent)`   | Parceiro aceita convite, atualiza `partner_session_id`, registra consent.             |
| `getCoupleState(sessionId, code?)`                      | Retorna `CoupleState` com estado atual: `NO_INVITE                                    | EXPIRED | WAITING_PARTNER | WAITING_RESULTS | CONSENT_REQUIRED | PAYMENT_REQUIRED | READY` |
| `getCoupleComparison(code, sessionId, token)`           | Verifica autenticação + estado; retorna `BilateralCoupleComparison` ou bloqueado      |
| `setCoupleConsent(sessionId, token, granted)`           | Atualiza `can_share_comparison`                                                       |

**Função interna `authorize(sessionId, token)`**: verifica que a sessão é de `quiz = coupledna` e que o token bate via `matchesAnonymousSessionToken`.

### `src/features/commerce/order-service.ts`

- `createOrder(input: CreateOrderInput)`: cria order, cria PaymentAttempt, cria Stripe Checkout Session, transiciona status
- Resolve preço **do servidor** via `product_prices` ou `BUNDLE_PRICES` — nunca aceita preço do cliente
- `getOrderById()`, `getOrderByNumber()`: busca com autorização por `lookup_token_hash` ou `session_token`

### `src/features/commerce/fulfillment-service.ts`

- `fulfillOrder(orderId, providerEventId?, providerPaymentId?)`: chama `meqyro.complete_payment()` atomicamente; expande bundle codes; registra analytics
- `refundOrder(orderId, reason, providerRefundId?)`: chama `meqyro.refund_payment()` atomicamente

### `src/features/commerce/webhook-handler.ts`

- `handleWebhook(providerName, input)`: verifica assinatura → busca order → verifica amount/currency → insere `payment_events` (idempotência via UNIQUE constraint 23505) → `fulfillOrder` ou `refundOrder`

### `src/features/commerce/entitlement-service.ts`

- `findPaidEntitlement(sessionId, productCode, includeCouple?)`: busca `result_access_grants` por `session_id` (e todas sessões com mesmo `buyer_id`); para `COUPLEDNA`, se `includeCouple=true`, também verifica o parceiro via `couple_invites` — **um pagamento de qualquer um dos dois libera para ambos**

### `src/features/results/result-service.ts`

- `getProtectedResult(input)`: carrega sessão, resultado, calcula `accessLevel`, chama `getCoupleState()` para quizzes CoupleDNA, chama `buildCoupleReport()` se `READY`, constrói paywall offer com preço do DB

### `src/features/results/couple-report.ts`

- `buildCoupleReport(comparison, language)`: gera `ComprehensiveReport` com seção de `bilateral-overall` + 5 seções de dimensão, cada uma com texto contextualizado por nível de alinhamento (≥70 = próximos, <70 = diferentes) e exercício de diálogo

### `src/features/commerce/adapters/stripe.ts` (`StripeAdapter`)

- `createCheckout(input)`: cria Stripe Checkout Session `mode: "payment"`, `ui_mode: "hosted_page"`, com `client_reference_id = orderId`, metadados `{ order_id, order_number, product_code }`, idempotencyKey
- `verifyWebhook(input)`: usa `stripe.webhooks.constructEvent()` com `STRIPE_WEBHOOK_SECRET`, tolerance 300s; lida com `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `charge.refunded`, `charge.dispute.created`

---

## 6. COMPONENTES

### `src/components/patterns/couple-result-panel.tsx`

**Client component** (`"use client"`). Props:

```typescript
{
  sessionId: string;
  locale: Locale;
  initialState: ProtectedResultResponse["couple"];
  paid: boolean;
}
```

Estados renderizados: `NO_INVITE`, `EXPIRED`, `WAITING_PARTNER`, `WAITING_RESULTS`, `CONSENT_REQUIRED`, `PAYMENT_REQUIRED`, `READY`

- Auto-refresh a cada 10s quando `paid && state ∈ [WAITING_PARTNER, WAITING_RESULTS, CONSENT_REQUIRED]`
- Ações via `/api/couple/invite` (POST) e `/api/couple/consent` (POST)
- Exibe link de convite após criação
- **Botões**: "Criar convite" (com checkbox de consentimento), "Retirar autorização" / "Autorizar comparação", "Atualizar andamento"
- **Não há UI para comprar convite** — o pagamento é tratado separadamente via paywall genérico

### `src/components/patterns/result-view.tsx`

- Renderiza badge de acesso (free/premium), score hero, dimensões, relatório premium, paywall
- Para `quizSlug === "coupledna"`, renderiza `<CoupleResultPanel>` acima das dimensões
- Paywall usa `paywall.formattedPrice` calculado no servidor

### `src/app/[locale]/couple/[code]/page.tsx`

- Página de landing para convidado com código
- Estática (Server Component)
- Exibe explicação do CoupleDNA em 4 idiomas
- CTA direciona para `/{locale}/quizzes/coupledna/play?invite={code}`
- **Não verifica se o convite está ativo nem se foi pago**

---

## 7. PREÇOS E CONFIGURAÇÃO COMERCIAL

### Preço base do CoupleDNA

Definidos via seed em `20260926050000_coupledna_bilateral.sql`:

| Mercado | Moeda | Valor (minor units) | Valor display |
| ------- | ----- | ------------------- | ------------- |
| BR      | BRL   | 1490                | R$ 14,90      |
| US      | USD   | 399                 | $3,99         |
| EU      | EUR   | 399                 | €3,99         |
| GB      | GBP   | 349                 | £3,49         |

### Onde estão os preços

- Tabela `meqyro.product_prices` (DB, autoritativa)
- Não há hardcode de preço em componentes — correto
- `src/lib/market/prices.ts` define apenas `brainRankPrices` e `BUNDLE_PRICES` hardcoded; CoupleDNA usa a tabela do DB
- `formatMoney(amount, currency, locale)` usa `Intl.NumberFormat`

### Fluxo de checkout atual para CoupleDNA

1. Frontend → `GET /api/sessions/[id]/result` → recebe `paywall.amount` + `paywall.productCode`
2. Frontend → `POST /api/checkout` com `{ sessionId, productCode: "COUPLEDNA", customerEmail, locale }`
3. `order-service.ts` → consulta `product_prices` → calcula amount → cria `orders` → chama `StripeAdapter.createCheckout()`
4. Frontend redireciona para URL do Stripe
5. Stripe envia webhook → `handleWebhook()` → `fulfillOrder()` → `result_access_grants` inserido
6. `findPaidEntitlement()` encontra grant → `getCoupleState()` retorna `READY` → `buildCoupleReport()` é chamado

### Catálogo comercial

`src/content/commercial-catalog.ts`:

```typescript
export const commercialQuizSlugs = ["brainrank", "moneydna", "coupledna"] as const;
export const commercialProductCodes = ["BRAINRANK", "MONEYDNA", "COUPLEDNA"] as const;
```

CoupleDNA está na lista de produtos comercializáveis (necessário para `isCommercialProduct()` retornar true no checkout).

---

## 8. STRIPE INTEGRATION

### Criação de Checkout Session

Arquivo: `src/features/commerce/adapters/stripe.ts` — classe `StripeAdapter`

Configurações relevantes:

- `mode: "payment"` — não assinatura
- `ui_mode: "hosted_page"` — redirect para Stripe
- `allow_promotion_codes: false`
- `automatic_tax: { enabled: false }`
- Metadados: `{ order_id, order_number, product_code }` em `session.metadata` e `payment_intent_data.metadata`
- `client_reference_id: orderId`
- `idempotencyKey: "checkout:{orderId}"`

### Webhook Handler

Arquivo: `src/app/api/webhooks/stripe/route.ts`

- Lê body como texto raw (necessário para verificação de assinatura)
- Passa `stripe-signature` header
- Chama `handleWebhook("stripe", { payload, headers, signature })`

Eventos tratados:

- `checkout.session.completed` → CONFIRMED (se `payment_status === "paid"`)
- `checkout.session.async_payment_succeeded` → CONFIRMED
- `checkout.session.async_payment_failed` → FAILED
- `charge.refunded` → REFUNDED
- `charge.dispute.created` → CHARGEBACK
- Outros → IGNORED

### Verificações de segurança

- `stripe.webhooks.constructEvent()` com tolerance 300s
- Amount mismatch: rejeita e loga se `verifiedEvent.amount !== order.amount`
- Currency mismatch: rejeita se moedas divergem
- Provider mismatch: rejeita se evento Stripe chegou para order de outro provider
- Idempotência: UNIQUE constraint em `(provider, provider_event_id)` → código 23505 = no-op

---

## 9. GAPS — O QUE EXISTE E O QUE ESTÁ AUSENTE

### O que existe (implementado e funcional)

✅ Quiz CoupleDNA com 20 perguntas, 5 dimensões, 4 idiomas  
✅ Scoring individual e bilateral (pure functions)  
✅ Tabelas `couple_invites` + `couple_consents` com RLS  
✅ Convite por código (1 convidado por anfitrião)  
✅ Consentimento bilateral para compartilhamento  
✅ Integração com Stripe (fluxo genérico)  
✅ Paywall de acesso ao relatório comparativo  
✅ `findPaidEntitlement()` com cruzamento entre parceiros (um paga para ambos)  
✅ Relatório bilateral com 5 dimensões  
✅ Componente `CoupleResultPanel` com polling automático  
✅ Página de landing para convidado (`/[locale]/couple/[code]`)  
✅ Idempotência de webhooks  
✅ State machine de orders com `assertTransition()`  
✅ Teste de integração `couple-bilateral.test.ts`

### O que está ausente

❌ **N convidados**: Schema limita a 1 parceiro por convite (índices únicos `couple_invites_active_initiator_unique` e `couple_invites_active_partner_unique`)  
❌ **Pagamento por convite individual**: O produto `COUPLEDNA` paga o relatório da sessão, não o acesso a um convidado específico  
❌ **Precificação progressiva** (P + (N-1) × P/3): inexistente  
❌ **Vínculo entre payment e invite**: Nenhuma FK entre `orders` e `couple_invites`  
❌ **Geração de link pós-pagamento**: Link gerado antes do pagamento via `createCoupleInvite()`  
❌ **Dashboard de anfitrião**: Sem listagem de múltiplos convidados  
❌ **Isolamento entre convidados**: Convidado não pode ver outros convidados (estrutural, mas sem política explícita para N>1)  
❌ **Relatório comparativo por par**: O relatório atual é fixo (par A+B); para N convidados, precisaria de N relatórios individuais  
❌ **Tratamento de checkout abandonado para invite**: Não há expiração de convites pendentes de pagamento  
❌ **Compras concorrentes**: Sem mecanismo de reserva de preço para evitar que dois checkouts simultâneos recebam desconto indevido  
❌ **UI de compra de convite**: `CoupleResultPanel` não tem fluxo de compra; usa paywall genérico

### Problemas estruturais a resolver antes de implementar

#### Problema 1 — Schema de 1 parceiro fixo

`couple_invites` tem `partner_session_id` como coluna única. Para N convidados, é necessário:

- Manter `couple_invites` para o convite base (o que o anfitrião paga)
- Criar `couple_invite_slots` ou mudar a semântica para 1 invite = 1 slot pago

O índice único `couple_invites_active_initiator_unique` precisará ser removido ou adaptado.

#### Problema 2 — Falta de vínculo entre pagamento e convite

Atualmente: `orders.session_id` → sessão do anfitrião, `orders.product_code = "COUPLEDNA"`.  
Para convites pagos individualmente: cada convite precisa ser vinculado a um `order_id`. Será necessário adicionar `invite_id` ou `couple_invite_id` em `orders` (ou criar um produto separado por convite).

#### Problema 3 — Link antes do pagamento

`createCoupleInvite()` gera o link imediatamente ao ser chamada, sem verificar pagamento. Para implementar o requisito de "link somente após pagamento confirmado":

- Será necessária uma tabela de convites pendentes de pagamento
- Ou separar o fluxo: criar intenção de convite → pagar → ativar convite

#### Problema 4 — Precificação sem coluna de "invites_count"

`order-service.ts` resolve o preço diretamente de `product_prices`. Para a regra progressiva, será necessário:

- Contar convites já confirmados do anfitrião para a avaliação
- Calcular preço no servidor antes de criar o checkout
- Usar locking transacional para evitar race condition em compras simultâneas

#### Problema 5 — Relatório bilateral vs. N relatórios

`getCoupleState()` e `getCoupleComparison()` operam sobre exatamente 2 sessões. Para N convidados:

- Cada par (anfitrião, convidado_N) precisa de estado e comparação independentes
- A função precisará aceitar o ID do convidado específico, não apenas o do anfitrião

#### Problema 6 — `findPaidEntitlement()` com cross-referência por `couple_invites`

O código atual (`includeCouple = true` para `COUPLEDNA`) resolve entitlement cruzado apenas entre par A e par B. Para N convidados, essa lógica precisará saber qual par está sendo consultado.

#### Problema 7 — Integração entre compra de convite e relatório individual

O usuário não deve pagar duas vezes. Atualmente:

- Comprar `COUPLEDNA` dá acesso ao relatório individual e à comparação bilateral
- Com convites pagos, será preciso definir se:
  - O primeiro convite inclui o relatório individual do anfitrião (equivalência comercial)
  - Ou são produtos separados
- A `entitlement-service.ts` terá que ser expandida para cobrir esses cenários

---

## 10. INVENTÁRIO COMPLETO DE ARQUIVOS RELEVANTES

### Conteúdo e scoring

- `src/content/quizzes/coupledna.ts` — 20 perguntas, 4 idiomas
- `src/features/scoring/coupledna.ts` — scoring individual + bilateral

### Feature server-only

- `src/features/couple/couple-service.ts` — serviço principal de convites e comparação
- `src/features/results/couple-report.ts` — gerador do relatório bilateral
- `src/features/results/result-service.ts` — serviço de resultado (integra CoupleDNA)
- `src/features/commerce/order-service.ts` — criação de orders + checkout Stripe
- `src/features/commerce/fulfillment-service.ts` — fulfillment atomico
- `src/features/commerce/webhook-handler.ts` — handler de webhooks
- `src/features/commerce/entitlement-service.ts` — verificação de entitlement pago
- `src/features/commerce/adapters/stripe.ts` — implementação do Stripe

### API Routes

- `src/app/api/couple/invite/route.ts`
- `src/app/api/couple/consent/route.ts`
- `src/app/api/couple/status/[code]/route.ts`
- `src/app/api/checkout/route.ts`
- `src/app/api/webhooks/stripe/route.ts`
- `src/app/api/sessions/[id]/result/route.ts`

### Componentes UI

- `src/components/patterns/couple-result-panel.tsx` — painel do CoupleDNA no resultado
- `src/components/patterns/result-view.tsx` — view de resultado (integra CoupleDNA)
- `src/app/[locale]/couple/[code]/page.tsx` — landing page do convidado

### Migrations relevantes

- `20260925124431_foundation_catalog.sql` — schema base, `product_prices`
- `20260926010000_quiz_engine.sql` — `quiz_sessions`, `answers`, `results`
- `20260926020000_leads_privacy_results.sql` — `result_access_grants`
- `20260926030000_commerce_fulfillment.sql` — `orders`, `payment_events`
- `20260926050000_coupledna_bilateral.sql` — **`couple_invites`, `couple_consents`**, preços do CoupleDNA
- `20260929011148_payment_readiness.sql` — índices únicos de pagamento, `complete_payment()`
- `20261004223516_buyer_entitlements_couple_delivery.sql` — `buyer_id`, `report_deliveries`, índices únicos de couple
- `20261011012737_stripe_only_payment_providers.sql` — constraint Stripe-only
- `20261018231842_commercial_payment_safety.sql` — `refund_payment()`, trigger de analytics

### Testes

- `tests/integration/couple-bilateral.test.ts` — teste de integração (requer Supabase local)
- Referências a couple em: `all-quizzes-flow-inmemory.test.ts`, `content-integrity.test.ts`, `golden-scoring.test.ts`, `paid-entitlement-recovery.test.ts`, `scoring-comprehensive.test.ts`, `quizzes-catalog.test.ts`

---

## 11. RECOMENDAÇÕES PARA O DOCUMENTO DE CONTROLE

### Decisões de design a tomar antes de codificar

1. **Produto comercial do convite**: Criar `COUPLEDNA_INVITE` como produto separado ou adicionar `invite_slot` ao modelo de `couple_invites`?
2. **Compatibilidade com compra existente**: Usuários que já compraram `COUPLEDNA` recebem 1 convite grátis ou precisam comprar?
3. **Escopo do relatório individual**: O primeiro convite pago inclui ou substitui o relatório individual do anfitrião?
4. **Número máximo de convidados**: Há limite técnico/comercial?

### Mudanças de schema necessárias (nova migration, nunca editar existentes)

1. Remover ou adaptar `couple_invites_active_initiator_unique` para permitir múltiplos convites por sessão
2. Adicionar `invite_slot_id` (ou similar) em `orders` para vincular pagamento a convite específico
3. Adicionar `paid_at` ou `status = 'PAID'` em `couple_invites` para controlar disponibilidade do link
4. Adicionar tabela `couple_invite_slots` separada (recomendado) para registrar N convites por anfitrião

### Mudanças em `order-service.ts`

- Aceitar `inviteSlotId` como parâmetro de `CreateOrderInput`
- Calcular preço progressivo no servidor: `COUNT(confirmed_invites_for_session)` com `SELECT FOR UPDATE` para evitar race

### Mudanças em `couple-service.ts`

- `createCoupleInvite()`: não gerar link imediatamente; criar slot `PENDING_PAYMENT` e aguardar webhook
- `getCoupleState()`: receber `guestSessionId` como parâmetro para suportar N convidados
- Nova função: `listCoupleInvites(sessionId, token)` para o dashboard do anfitrião

### Mudanças em `webhook-handler.ts`

- Após `fulfillOrder()`: se order tem `invite_slot_id`, ativar o slot correspondente em `couple_invites` (ou criar convite novo)

### Novo componente UI

- `InviteManagerPanel` — gerenciamento de múltiplos convites pelo anfitrião
  - Lista de slots (pendente, ativo, expirado, concluído)
  - Preço do próximo convite (calculado via endpoint no servidor)
  - Botão "Comprar convite" por slot
  - Link copiável após ativação

---

_Este documento foi gerado por auditoria estática do código. Todas as referências apontam para arquivos e símbolos reais encontrados no repositório._
