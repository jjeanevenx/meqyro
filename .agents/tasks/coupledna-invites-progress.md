# CoupleDNA — Convites Pagos, Multiparticipantes e Relatórios Comparativos
## Documento de Controle de Progresso

**Criado em:** 2026-10-19  
**Última atualização:** 2026-10-19  
**Status geral:** 🔴 Não iniciado  
**Auditoria base:** `.agents/tasks/coupledna-audit.md`

---

## ÍNDICE

1. [Diagnóstico da Implementação Atual](#1-diagnóstico-da-implementação-atual)
2. [Problemas Estruturais Identificados](#2-problemas-estruturais-identificados)
3. [Decisões de Design Pendentes](#3-decisões-de-design-pendentes)
4. [Arquitetura Proposta](#4-arquitetura-proposta)
5. [Modelo de Dados — Evolução](#5-modelo-de-dados--evolução)
6. [Fases de Implementação](#6-fases-de-implementação)
7. [Matriz de Tarefas](#7-matriz-de-tarefas)
8. [Critérios de Aceitação](#8-critérios-de-aceitação)
9. [Riscos e Dependências](#9-riscos-e-dependências)
10. [Histórico de Progresso](#10-histórico-de-progresso)

---

## 1. Diagnóstico da Implementação Atual

### O que está funcional

| Componente | Status | Arquivo(s) |
|---|---|---|
| Quiz — 20 perguntas LIKERT, 5 dimensões, 4 idiomas | ✅ Completo | `src/content/quizzes/coupledna.ts` |
| Scoring individual (5 dimensões, 0–100) | ✅ Completo | `src/features/scoring/coupledna.ts` |
| Scoring bilateral (`compareBilateral`) | ✅ Completo | `src/features/scoring/coupledna.ts` |
| Tabela `couple_invites` + `couple_consents` | ✅ Existe (1 convidado) | Migration `20260926050000` |
| Convite por código (`CP-XXXXXXXX`) | ✅ Funcional | `src/features/couple/couple-service.ts` |
| Consentimento bilateral | ✅ Funcional | `src/features/couple/couple-service.ts` |
| Checkout Stripe (produto `COUPLEDNA`) | ✅ Funcional | `src/features/commerce/order-service.ts` |
| Webhook Stripe com idempotência | ✅ Funcional | `src/features/commerce/webhook-handler.ts` |
| `findPaidEntitlement()` cruzado entre par | ✅ Funcional | `src/features/commerce/entitlement-service.ts` |
| Relatório bilateral (`buildCoupleReport`) | ✅ Funcional | `src/features/results/couple-report.ts` |
| `CoupleResultPanel` com polling automático | ✅ Funcional | `src/components/patterns/couple-result-panel.tsx` |
| Landing page do convidado | ✅ Existe | `src/app/[locale]/couple/[code]/page.tsx` |
| State machine de orders com `assertTransition()` | ✅ Funcional | `src/lib/domain/states.ts` |
| Preços no DB (`product_prices`) | ✅ BRL/USD/EUR/GBP | Migration `20260926050000` |

**Preços atuais do CoupleDNA (P = preço base):**

| Mercado | Moeda | Valor (minor units) | Display |
|---|---|---|---|
| BR | BRL | 1490 | R$ 14,90 |
| US | USD | 399 | $3,99 |
| EU | EUR | 399 | €3,99 |
| GB | GBP | 349 | £3,49 |

### O que está ausente

| Funcionalidade | Status |
|---|---|
| N convidados por anfitrião (>1) | ❌ Ausente — bloqueado por schema |
| Pagamento por convite individual | ❌ Ausente |
| Precificação progressiva P + (N−1)×P/3 | ❌ Ausente |
| Vínculo `orders` ↔ `couple_invites` | ❌ Ausente |
| Geração de link **pós** confirmação de pagamento | ❌ Ausente — link gerado antes do pagamento |
| Dashboard de anfitrião (lista de convidados) | ❌ Ausente |
| Isolamento de privacidade entre convidados | ❌ Ausente (estrutural — só existe 1 hoje) |
| Relatório comparativo por par (anfitrião + convidado_N) | ❌ Ausente |
| Proteção contra compras concorrentes com desconto indevido | ❌ Ausente |
| Expiração de intenção de compra abandonada | ❌ Ausente |
| UI de compra de convite no painel | ❌ Ausente |
| Suporte a N relatórios comparativos independentes | ❌ Ausente |

---

## 2. Problemas Estruturais Identificados

Estes problemas **devem ser resolvidos antes** de qualquer nova funcionalidade.

### P-001 — Schema limita a 1 parceiro por convite
**Gravidade:** 🔴 Bloqueador  
**Arquivo:** Migration `20261004223516_buyer_entitlements_couple_delivery.sql`  
**Detalhe:** Dois índices únicos parciais impedem múltiplos convites ativos por sessão:
- `couple_invites_active_initiator_unique ON (initiator_session_id) WHERE status <> 'EXPIRED'`
- `couple_invites_active_partner_unique ON (partner_session_id) WHERE partner_session_id IS NOT NULL AND status <> 'EXPIRED'`
**Solução:** Nova migration que introduz `couple_invite_slots` separando "convite raiz" de "vagas individuais pagas", ou adapta os índices para permitir múltiplos registros por `initiator_session_id`.

### P-002 — Link gerado antes do pagamento
**Gravidade:** 🔴 Bloqueador (requisito obrigatório)  
**Arquivo:** `src/features/couple/couple-service.ts` → `createCoupleInvite()`  
**Detalhe:** O código do convite é gerado e retornado imediatamente, sem verificação de pagamento. Qualquer pessoa com o link pode participar.  
**Solução:** Separar fluxo em duas etapas: (1) criar `invite_slot` em estado `PENDING_PAYMENT`, (2) ativar o slot somente via webhook de confirmação de pagamento.

### P-003 — Nenhum vínculo entre `orders` e `couple_invites`
**Gravidade:** 🔴 Bloqueador  
**Arquivo:** `src/features/commerce/order-service.ts`  
**Detalhe:** `orders` vincula sessão e produto (`session_id`, `product_code`), mas não identifica qual slot de convite foi comprado. Impossível saber qual convite ativar após pagamento confirmado.  
**Solução:** Adicionar `couple_invite_slot_id uuid FK` em `orders`; ou incluir `slot_id` nos metadados do Stripe Checkout.

### P-004 — Sem precificação progressiva
**Gravidade:** 🔴 Bloqueador (regra comercial central)  
**Arquivo:** `src/features/commerce/order-service.ts`  
**Detalhe:** `order-service.ts` busca preço diretamente de `product_prices` sem considerar histórico de compras do anfitrião.  
**Solução:** Nova função `calculateInvitePrice(hostSessionId, marketId)` que conta `confirmed_invite_slots` da sessão e aplica regra P + (N−1)×P/3 com `SELECT FOR UPDATE` para evitar race condition.

### P-005 — `getCoupleState()` e `getCoupleComparison()` operam sobre par fixo
**Gravidade:** 🟡 Alto  
**Arquivo:** `src/features/couple/couple-service.ts`  
**Detalhe:** As funções assumem exatamente 2 participantes. Para N convidados, precisam receber `guestSessionId` como parâmetro e operar sobre um par específico.  
**Solução:** Refatorar para aceitar parâmetro de qual convidado específico consultar.

### P-006 — `findPaidEntitlement()` com cruzamento bilateral fixo
**Gravidade:** 🟡 Alto  
**Arquivo:** `src/features/commerce/entitlement-service.ts`  
**Detalhe:** A lógica de "um paga para ambos" funciona para 1 par, mas precisará de nova lógica para N pares: qual pagamento cobre qual convidado.  
**Solução:** Vincular entitlement ao `couple_invite_slot_id`; verificar cruzamento por slot, não por produto geral.

### P-007 — Landing page do convidado não valida pagamento
**Gravidade:** 🟡 Alto  
**Arquivo:** `src/app/[locale]/couple/[code]/page.tsx`  
**Detalhe:** A página não verifica se o convite está ativo/pago antes de apresentar o CTA.  
**Solução:** Verificar status do slot antes de renderizar; exibir mensagem de erro se slot inválido/expirado/não-pago.

---

## 3. Decisões de Design — APROVADAS em 2026-10-19

| ID | Decisão | Escolha | Regra |
|---|---|---|---|
| D-001 | Modelo de produto para convite | ✅ **Opção A** | Criar `COUPLEDNA_INVITE`; cada slot tem order independente vinculada a `couple_invite_slot_id`; preservar índice existente para produtos tradicionais; unicidade de slot por estado ativo |
| D-002 | Compatibilidade com compras anteriores | ✅ **Opção B** | Preservar grants existentes sem migração; compra legada de `COUPLEDNA` equivale ao primeiro convite para fins de precificação (novos convites custam P/3); não conceder direitos extras automaticamente |
| D-003 | Primeiro convite inclui relatório individual | ✅ **Opção C** | `COUPLEDNA_INVITE` substitui `COUPLEDNA` para novos compradores; fulfillment do primeiro slot cria grant `PREMIUM_REPORT` + `INVITE_ACCESS`; produto antigo continua reconhecido para legados |
| D-004 | Número máximo de convidados | ✅ **Opção B** | `MAX_COUPLEDNA_INVITES = 10`; configurável no backend sem migration; slots cancelados/expirados liberam capacidade; validado no backend inclusive em concorrência |
| D-005 | Arredondamento de P/3 | ✅ **Opção A** | `Math.floor(P / 3)` em minor units inteiros; ex: 1490 → 496 (R$ 4,96); nunca decimais para dinheiro |
| D-006 | Expiração de slot pendente | ✅ **Opção A** | Processar `checkout.session.expired`; slot → `CANCELLED`; reconciliação periódica; idempotente; não depender exclusivamente de webhooks |
| D-007 | Identificação do convidado | ✅ **Opção A** | `host_name_for_guest` opcional; fallback "Convidado N"; não bloqueia compra; apelido não exposto a outros convidados |

---

## 4. Arquitetura Proposta

### Fluxo de compra de convite

```
Anfitrião (UI) → POST /api/couple/invites/purchase
  → couple-invite-service.ts: calculateInvitePrice() [SELECT FOR UPDATE]
  → order-service.ts: createOrder(productCode=COUPLEDNA_INVITE, inviteSlotId)
  → stripe-adapter.ts: createCheckout(orderId, inviteSlotId)
  → Redirect para Stripe

Stripe webhook → POST /api/webhooks/stripe
  → webhook-handler.ts: handleWebhook()
    → fulfillment-service.ts: fulfillOrder(orderId)
      → couple-invite-service.ts: activateInviteSlot(slotId)
        → UPDATE couple_invite_slots SET status = 'ACTIVE', invite_code = generateCode()
  → Link disponível na UI via polling / refetch
```

### Fluxo de resgate pelo convidado

```
Convidado → GET /[locale]/couple/[code]
  → couple-invite-service.ts: validateInviteSlot(code)
    → Verificar status = 'ACTIVE' e not expired
    → Exibir consentimento obrigatório
  → Convidado aceita consentimento → POST /api/couple/invites/[slotId]/accept
    → associate guestSessionId + marcar slot como REDEEMED
  → Convidado responde quiz → /api/sessions/[id]/complete
  → couple-invite-service.ts: markSlotCompleted(slotId)
```

### Arquivos novos (estimativa)

| Arquivo | Tipo | Função |
|---|---|---|
| `src/features/couple/couple-invite-service.ts` | Feature server-only | Gestão de slots: criar, ativar, resgatar, listar, calcular preço |
| `src/features/couple/invite-pricing.ts` | Feature server-only | `calculateInvitePrice()` com SELECT FOR UPDATE |
| `src/app/api/couple/invites/purchase/route.ts` | Route Handler | Iniciar compra de slot |
| `src/app/api/couple/invites/[slotId]/route.ts` | Route Handler | GET status, POST aceitar |
| `src/app/api/couple/invites/[slotId]/accept/route.ts` | Route Handler | Convidado resgata slot |
| `src/components/patterns/invite-manager-panel.tsx` | Client Component | Dashboard do anfitrião |
| `src/components/patterns/invite-purchase-flow.tsx` | Client Component | Fluxo de compra de convite |
| `src/components/patterns/invite-link-card.tsx` | Client Component | Card com link + botão copiar |
| `supabase/migrations/YYYYMMDDHHMMSS_coupledna_multi_invite.sql` | Migration | Tabela `couple_invite_slots`, adaptar índices |

### Arquivos a modificar

| Arquivo | Modificação necessária |
|---|---|
| `src/features/couple/couple-service.ts` | Refatorar `getCoupleState()` e `getCoupleComparison()` para par específico; `createCoupleInvite()` → depreciado/adaptado |
| `src/features/commerce/order-service.ts` | Aceitar `inviteSlotId`; implementar `calculateInvitePrice()` ou delegar |
| `src/features/commerce/fulfillment-service.ts` | Após fulfill, ativar slot de convite se `invite_slot_id` presente na order |
| `src/features/commerce/webhook-handler.ts` | Orquestrar ativação de slot pós-fulfillment |
| `src/features/commerce/entitlement-service.ts` | Entitlement por slot para CoupleDNA |
| `src/features/results/couple-report.ts` | Suportar relatório por par (host + convidado_N) |
| `src/features/results/result-service.ts` | Integrar novo modelo de N convidados |
| `src/app/[locale]/couple/[code]/page.tsx` | Validar status do slot antes de renderizar |
| `src/components/patterns/couple-result-panel.tsx` | Integrar `InviteManagerPanel`; adaptar para N comparações |
| Dicionários de i18n (todos os 4 idiomas) | Novas strings: convite, preço progressivo, estados de slot, consentimento |

---

## 5. Modelo de Dados — Evolução

### Nova tabela: `couple_invite_slots`

```sql
CREATE TABLE meqyro.couple_invite_slots (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_session_id       uuid NOT NULL REFERENCES meqyro.quiz_sessions(id),
  order_id              uuid REFERENCES meqyro.orders(id),       -- preenchido após pagamento
  invite_code           text UNIQUE,                              -- gerado após pagamento
  guest_session_id      uuid REFERENCES meqyro.quiz_sessions(id), -- preenchido após resgate
  host_name_for_guest   text,                                     -- nome/rótulo dado pelo anfitrião
  status                text NOT NULL DEFAULT 'PENDING_PAYMENT',  -- ver estados abaixo
  price_amount          integer NOT NULL,                         -- minor units, persistido no ato
  price_currency        text NOT NULL,
  slot_number           integer NOT NULL,                         -- posição (1 = primeiro, 2 = segundo...)
  expires_at            timestamptz,                              -- definido após ativação
  redeemed_at           timestamptz,
  completed_at          timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);
```

**Estados do slot:**
```
PENDING_PAYMENT → ACTIVE → REDEEMED → QUIZ_STARTED → COMPLETED
                         ↓
                      EXPIRED | REVOKED
PENDING_PAYMENT → CANCELLED  (checkout abandonado)
```

### Alteração em `orders`

```sql
ALTER TABLE meqyro.orders
  ADD COLUMN couple_invite_slot_id uuid REFERENCES meqyro.couple_invite_slots(id);
```

### Alteração nos índices de `couple_invites`

```sql
-- Remover índice que bloqueia múltiplos convites por sessão
DROP INDEX IF EXISTS meqyro.couple_invites_active_initiator_unique;
-- O índice de parceiro pode ser mantido (1 sessão = 1 parceiro ativo)
-- ou também removido dependendo da decisão D-001
```

### RLS policies necessárias para `couple_invite_slots`

```sql
-- Service role: acesso total
-- Anfitrião: pode ler seus próprios slots (verificado via access_token_hash em quiz_sessions)
-- Convidado: pode ler apenas o slot onde guest_session_id = sua sessão
-- Nenhum acesso a slots de outros anfitriões ou outros convidados
```

### Tabela `couple_consents` — extensão

```sql
ALTER TABLE meqyro.couple_consents
  ADD COLUMN invite_slot_id uuid REFERENCES meqyro.couple_invite_slots(id);
-- Consentimento agora referencia o slot específico, não apenas o invite genérico
```

---

## 6. Fases de Implementação

### P0 — Fundação Comercial e Segurança (Bloqueadores)
**Critério de conclusão:** Anfitrião pode comprar um convite, pagamento é processado pelo Stripe, link só aparece após confirmação, primeiro convidado consegue participar.

### P1 — N Convidados + Dashboard + Relatórios
**Critério de conclusão:** Anfitrião pode comprar N convites com precificação progressiva, gerenciar painel, ver relatório comparativo com cada convidado.

### P2 — Polimento UX e i18n
**Critério de conclusão:** Todos os 4 idiomas corretos, mobile-first validado, acessibilidade, estados visuais completos.

### P3 — Testes e Validação Final
**Critério de conclusão:** Todos os testes da especificação passando; jornada completa validada.

---

## 7. Matriz de Tarefas

**Legenda de status:**
- 🔴 Não iniciado
- 🟡 Em progresso
- 🟢 Concluído
- ⏭️ Bloqueado por dependência
- 🚫 Cancelado

---

### FASE P0 — Fundação Comercial e Segurança

#### P0-DB — Banco de Dados e Schema

| ID | Tarefa | Status | Dependências | Arquivo(s) envolvidos |
|---|---|---|---|---|
| P0-DB-01 | Criar migration `couple_invite_slots` (tabela, índices, RLS) | 🟢 | — | `supabase/migrations/20261019000000_coupledna_multi_invite.sql` |
| P0-DB-02 | Alterar `orders` para adicionar `couple_invite_slot_id` | 🟢 | P0-DB-01 | `supabase/migrations/20261019000000_coupledna_multi_invite.sql` |
| P0-DB-03 | Remover/adaptar `couple_invites_active_initiator_unique` | 🟢 | D-001 | `supabase/migrations/20261019000000_coupledna_multi_invite.sql` |
| P0-DB-04 | Adicionar `invite_slot_id` em `couple_consents` | 🟢 | P0-DB-01 | `supabase/migrations/20261019000000_coupledna_multi_invite.sql` |
| P0-DB-05 | Criar função SQL `get_confirmed_invite_count(host_session_id)` para contagem com lock | 🔴 | P0-DB-01 | `supabase/migrations/NOVA_coupledna_multi_invite.sql` |
| P0-DB-06 | Criar/revisar RLS policies para `couple_invite_slots` | 🟢 | P0-DB-01 | `supabase/migrations/20261019000000_coupledna_multi_invite.sql` |

#### P0-FEAT — Features Server-Only

| ID | Tarefa | Status | Dependências | Arquivo(s) envolvidos |
|---|---|---|---|---|
| P0-FEAT-01 | Criar `src/features/couple/invite-pricing.ts` — `calculateInvitePrice()` com SELECT FOR UPDATE | 🔴 | P0-DB-01, D-005 | novo arquivo |
| P0-FEAT-02 | Criar `src/features/couple/couple-invite-service.ts` — CRUD de slots, ativar após pagamento, validar resgate | 🔴 | P0-DB-01, P0-FEAT-01 | novo arquivo |
| P0-FEAT-03 | Modificar `order-service.ts` — aceitar `inviteSlotId`, chamar `calculateInvitePrice()` | 🔴 | P0-FEAT-01, P0-FEAT-02 | `src/features/commerce/order-service.ts` |
| P0-FEAT-04 | Modificar `fulfillment-service.ts` — após fulfill, ativar slot se `couple_invite_slot_id` presente | 🔴 | P0-FEAT-02 | `src/features/commerce/fulfillment-service.ts` |
| P0-FEAT-05 | Modificar `webhook-handler.ts` — orquestrar ativação de slot pós-fulfillment | 🔴 | P0-FEAT-04 | `src/features/commerce/webhook-handler.ts` |
| P0-FEAT-06 | Criar product code `COUPLEDNA_INVITE` no catálogo comercial | 🔴 | D-001 | `src/content/commercial-catalog.ts` |
| P0-FEAT-07 | Inserir preços de `COUPLEDNA_INVITE` em `product_prices` via migration (idênticos ao preço-base) | 🔴 | P0-DB-01, D-001 | migration |
| P0-FEAT-08 | Modificar `entitlement-service.ts` — entitlement por slot para CoupleDNA | 🔴 | P0-DB-02 | `src/features/commerce/entitlement-service.ts` |

#### P0-API — Route Handlers

| ID | Tarefa | Status | Dependências | Arquivo(s) envolvidos |
|---|---|---|---|---|
| P0-API-01 | Criar `POST /api/couple/invites/purchase` — iniciar compra de slot (valida identidade, calcula preço, cria order, retorna Stripe URL) | 🔴 | P0-FEAT-02, P0-FEAT-03 | `src/app/api/couple/invites/purchase/route.ts` |
| P0-API-02 | Criar `GET /api/couple/invites` — lista slots do anfitrião (autenticado por cookie) | 🔴 | P0-FEAT-02 | `src/app/api/couple/invites/route.ts` |
| P0-API-03 | Criar `POST /api/couple/invites/[slotId]/accept` — convidado resgata slot (valida código, registra consentimento, associa sessão) | 🔴 | P0-FEAT-02 | `src/app/api/couple/invites/[slotId]/accept/route.ts` |
| P0-API-04 | Adaptar `GET /api/couple/status/[code]` — usar slot ID / novo modelo | 🔴 | P0-FEAT-02 | `src/app/api/couple/status/[code]/route.ts` |
| P0-API-05 | Criar `GET /api/couple/invites/[slotId]/price` — preço do próximo convite (para UI) | 🔴 | P0-FEAT-01 | `src/app/api/couple/invites/price/route.ts` |

#### P0-SEC — Segurança e Controle de Acesso

| ID | Tarefa | Status | Dependências | Arquivo(s) envolvidos |
|---|---|---|---|---|
| P0-SEC-01 | Implementar verificação: convidado só resgata slot com código ativo, não expirado, não resgatado | 🔴 | P0-FEAT-02 | `couple-invite-service.ts` |
| P0-SEC-02 | Implementar verificação: anfitrião só pode listar/gerenciar seus próprios slots | 🔴 | P0-FEAT-02, P0-DB-06 | RLS + service |
| P0-SEC-03 | Implementar verificação: convidado não acessa slots de outros convites | 🔴 | P0-DB-06 | RLS |
| P0-SEC-04 | Implementar proteção anti-race-condition para precificação progressiva (SELECT FOR UPDATE) | 🔴 | P0-FEAT-01 | `invite-pricing.ts` |
| P0-SEC-05 | Garantir que `couple_invite_slot_id` em `orders` não pode ser alterado pelo frontend | 🔴 | P0-API-01 | validação Zod + server-side only |
| P0-SEC-06 | Validar que landing page de convidado verifica status do slot antes de renderizar CTA | 🔴 | P0-FEAT-02 | `src/app/[locale]/couple/[code]/page.tsx` |

---

### FASE P1 — N Convidados, Dashboard e Relatórios

#### P1-DATA — Suporte a N Convidados no Service Layer

| ID | Tarefa | Status | Dependências | Arquivo(s) envolvidos |
|---|---|---|---|---|
| P1-DATA-01 | Refatorar `getCoupleState()` para aceitar `guestSlotId` — operação sobre par específico | 🔴 | P0 completo | `src/features/couple/couple-service.ts` |
| P1-DATA-02 | Refatorar `getCoupleComparison()` para par específico (host + convidado_N) | 🔴 | P1-DATA-01 | `src/features/couple/couple-service.ts` |
| P1-DATA-03 | Criar `listHostInvites(hostSessionId, token)` — todos os slots com estado e convidado | 🔴 | P0-FEAT-02 | `src/features/couple/couple-invite-service.ts` |
| P1-DATA-04 | Criar `getCoupleComparisonForPair(hostSessionId, guestSlotId, token)` | 🔴 | P1-DATA-01 | `src/features/couple/couple-service.ts` |
| P1-DATA-05 | Adaptar `buildCoupleReport()` para receber par específico (não par único fixo) | 🔴 | P1-DATA-04 | `src/features/results/couple-report.ts` |
| P1-DATA-06 | Adaptar `result-service.ts` para suportar N comparações | 🔴 | P1-DATA-05 | `src/features/results/result-service.ts` |

#### P1-API — Novos Endpoints

| ID | Tarefa | Status | Dependências | Arquivo(s) envolvidos |
|---|---|---|---|---|
| P1-API-01 | Criar `GET /api/couple/invites/[slotId]/comparison` — relatório comparativo par específico | 🔴 | P1-DATA-04 | `src/app/api/couple/invites/[slotId]/comparison/route.ts` |
| P1-API-02 | Atualizar `GET /api/sessions/[id]/result` — incluir lista de slots e estados para CoupleDNA | 🔴 | P1-DATA-03 | `src/app/api/sessions/[id]/result/route.ts` |

#### P1-UI — Interface do Anfitrião

| ID | Tarefa | Status | Dependências | Arquivo(s) envolvidos |
|---|---|---|---|---|
| P1-UI-01 | Criar `src/components/patterns/invite-manager-panel.tsx` — dashboard com lista de slots, status, ações | 🔴 | P1-API bom estado | novo arquivo |
| P1-UI-02 | Criar `src/components/patterns/invite-purchase-flow.tsx` — fluxo de compra: preço, benefícios, botão checkout | 🔴 | P0-API-01, P0-API-05 | novo arquivo |
| P1-UI-03 | Criar `src/components/patterns/invite-link-card.tsx` — card com link, botão copiar, botão compartilhar nativo | 🔴 | — | novo arquivo |
| P1-UI-04 | Criar `src/components/patterns/couple-comparison-view.tsx` — visualização do relatório comparativo par | 🔴 | P1-API-01 | novo arquivo |
| P1-UI-05 | Integrar `InviteManagerPanel` em `couple-result-panel.tsx` | 🔴 | P1-UI-01 | `src/components/patterns/couple-result-panel.tsx` |
| P1-UI-06 | Adaptar `result-view.tsx` para navegação entre comparações (anfitrião) | 🔴 | P1-UI-04 | `src/components/patterns/result-view.tsx` |
| P1-UI-07 | Adaptar landing page do convidado (`/[locale]/couple/[code]`) — validar slot, exibir consentimento | 🔴 | P0-SEC-06 | `src/app/[locale]/couple/[code]/page.tsx` |
| P1-UI-08 | Criar estados visuais: 8 estados de slot × componente visual (loading, erro, empty, etc.) | 🔴 | P1-UI-01 | componentes novos/editados |

#### P1-REPORT — Relatórios Comparativos

| ID | Tarefa | Status | Dependências | Arquivo(s) envolvidos |
|---|---|---|---|---|
| P1-RPT-01 | Adaptar `buildCoupleReport()` para par específico — resultado anfitrião + resultado do convidado_N | 🔴 | P1-DATA-05 | `src/features/results/couple-report.ts` |
| P1-RPT-02 | Garantir que relatório não expõe score bruto — apenas indicadores e texto interpretativo | 🔴 | P1-RPT-01 | `src/features/results/couple-report.ts` |
| P1-RPT-03 | Estados de geração: aguardando parceiro, em preparação, disponível, falha com recuperação | 🔴 | P1-DATA-01 | UI + service |
| P1-RPT-04 | Convidado visualiza comparação com anfitrião (não com outros convidados) — enforcement server-side | 🔴 | P0-SEC-03 | RLS + service |

---

### FASE P2 — Polimento UX e i18n

| ID | Tarefa | Status | Dependências | Arquivo(s) envolvidos |
|---|---|---|---|---|
| P2-I18N-01 | Adicionar strings de convite nos 4 dicionários (pt/en/es/fr) — invites, preços, status, botões | 🔴 | P1-UI completo | arquivos de dicionário `src/lib/i18n/` |
| P2-I18N-02 | Adicionar strings de consentimento nos 4 idiomas | 🔴 | P2-I18N-01 | dicionários |
| P2-I18N-03 | Adicionar strings do relatório comparativo nos 4 idiomas | 🔴 | P2-I18N-01 | dicionários + `couple-report.ts` |
| P2-I18N-04 | Adaptar formatação de preço progressivo por moeda e idioma | 🔴 | P0-FEAT-01 | `src/lib/market/prices.ts` |
| P2-UX-01 | Validar responsividade mobile-first em todos os novos componentes | 🔴 | P1-UI completo | todos componentes UI |
| P2-UX-02 | Implementar feedback visual de "link copiado" (1 toque no mobile) | 🔴 | P1-UI-03 | `invite-link-card.tsx` |
| P2-UX-03 | Implementar Web Share API no botão "Compartilhar" | 🔴 | P1-UI-03 | `invite-link-card.tsx` |
| P2-UX-04 | Garantir foco e navegação por teclado em todos os novos componentes (WCAG AA) | 🔴 | P1-UI completo | todos componentes UI |
| P2-UX-05 | Testar e corrigir mensagens de estado vazio (nenhum convite, aguardando, etc.) | 🔴 | P1-UI completo | `invite-manager-panel.tsx` |
| P2-UX-06 | CTA discreta durante o quiz informando sobre a funcionalidade de convites | 🔴 | P1-UI completo | quiz runner existente |

---

### FASE P3 — Testes e Validação Final

| ID | Tarefa | Status | Dependências | Arquivo(s) envolvidos |
|---|---|---|---|---|
| P3-TEST-01 | Testes unitários de `invite-pricing.ts` — regra P + (N−1)×P/3, arredondamento, race condition | 🔴 | P0-FEAT-01 | `tests/unit/invite-pricing.test.ts` |
| P3-TEST-02 | Testes unitários de `couple-invite-service.ts` — estados de slot, validações | 🔴 | P0-FEAT-02 | `tests/unit/couple-invite-service.test.ts` |
| P3-TEST-03 | Testes de integração — fluxo completo: comprar slot → webhook → ativar → resgatar → concluir | 🔴 | P0 + P1 completo | `tests/integration/couple-multi-invite.test.ts` |
| P3-TEST-04 | Testes de autorização — matriz de acesso com 1 anfitrião + 3 convidados + 1 anfitrião independente | 🔴 | P0-SEC completo | `tests/integration/couple-access-matrix.test.ts` |
| P3-TEST-05 | Testes de Stripe — checkout criado, webhook autenticado, idempotência, abandono, reembolso | 🔴 | P0-FEAT completo | `tests/integration/couple-stripe.test.ts` |
| P3-TEST-06 | Testes de precificação — 9 cenários da especificação (ver critérios 12.1) | 🔴 | P3-TEST-01 | `tests/unit/invite-pricing.test.ts` |
| P3-TEST-07 | Testes de convite — 10 cenários da especificação (ver critérios 12.3) | 🔴 | P3-TEST-03 | `tests/integration/couple-multi-invite.test.ts` |
| P3-TEST-08 | Validação de `pnpm typecheck && pnpm test && pnpm build` sem erros | 🔴 | tudo | — |

---

## 8. Critérios de Aceitação

Cada item abaixo deve ser verificado com evidência (log, screenshot, teste) antes de declarar conclusão.

| # | Critério | Verificado? |
|---|---|---|
| AC-01 | Usuário pode convidar múltiplas pessoas (N ≥ 1) | ❌ |
| AC-02 | Primeiro convite cobra exatamente P | ❌ |
| AC-03 | Cada convite adicional cobra exatamente P/3 (arredondamento correto) | ❌ |
| AC-04 | Backend calcula e aplica o preço — frontend não pode influenciar | ❌ |
| AC-05 | Pagamento processado exclusivamente pelo Stripe | ❌ |
| AC-06 | Link utilizável **só** disponível após confirmação do webhook Stripe | ❌ |
| AC-07 | Retorno para URL de sucesso do Stripe **não** libera o link | ❌ |
| AC-08 | Cada link corresponde a exatamente 1 vaga individual | ❌ |
| AC-09 | Link compartilhado com terceiros após resgate não permite nova vaga | ❌ |
| AC-10 | Botão "Copiar link" funciona no mobile com feedback visual | ❌ |
| AC-11 | Convidados conseguem responder ao quiz | ❌ |
| AC-12 | Anfitrião visualiza resultados autorizados de todos os convidados | ❌ |
| AC-13 | Cada convidado visualiza apenas seus resultados e os do anfitrião | ❌ |
| AC-14 | Convidado não acessa resultados de outros convidados | ❌ |
| AC-15 | Relatórios comparativos por par funcionam | ❌ |
| AC-16 | Controle de acesso aplicado no servidor (não só na UI) | ❌ |
| AC-17 | Consentimento explícito antes de compartilhar resultados | ❌ |
| AC-18 | Experiência funciona em mobile e desktop | ❌ |
| AC-19 | Todos os 4 idiomas corretos (pt, en, es, fr) | ❌ |
| AC-20 | Testes de pagamento passando | ❌ |
| AC-21 | Testes de autorização passando | ❌ |
| AC-22 | Testes de relatórios passando | ❌ |
| AC-23 | `pnpm typecheck && pnpm test && pnpm build` sem erros | ❌ |

---

## 9. Riscos e Dependências

| ID | Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| R-01 | Race condition na precificação progressiva (2 checkouts simultâneos) | Média | Alto | SELECT FOR UPDATE na contagem de slots confirmados |
| R-02 | Webhook Stripe fora de ordem (fulfilled antes de PENDING) | Baixa | Alto | `assertTransition()` + idempotência via `payment_events` UNIQUE |
| R-03 | Usuário retorna da URL de sucesso do Stripe e recebe link sem webhook chegar | Alta | Alto | Polling com verificação de status no backend; nunca liberar link no redirect |
| R-04 | Convidado encaminha link para outra pessoa após resgatar | Média | Médio | `status = REDEEMED` + `guest_session_id` imutável após resgate |
| R-05 | Conflito entre produto `COUPLEDNA` (existente) e `COUPLEDNA_INVITE` (novo) — usuário paga duas vezes | Alta | Alto | Decisão D-002 e D-003 devem ser tomadas antes de P0-FEAT-06 |
| R-06 | Schema quebra testes de integração existentes (`couple-bilateral.test.ts`) | Alta | Médio | Adaptar testes ao novo schema na mesma migration |
| R-07 | Strings de i18n faltantes causam build error (TypeScript enforce completeness) | Alta | Baixo | Adicionar todas as strings nos 4 idiomas antes do build |
| R-08 | Supabase RLS mal configurado permite vazamento de dados entre anfitriões | Baixa | Crítico | Testes de autorização (P3-TEST-04) obrigatórios antes do deploy |

### Dependências externas

- Stripe Checkout (sem mudanças na API — modo `payment` já em uso)
- Supabase local rodando para testes de integração (`pnpm supabase start`)
- Variáveis de ambiente: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (já existentes)

---

## 10. Histórico de Progresso

| Data | Agente/Autor | Ação |
|---|---|---|
| 2026-10-19 | Kiro (auditoria) | Auditoria completa da implementação existente gerada em `.agents/tasks/coupledna-audit.md` |
| 2026-10-19 | Kiro | Documento de controle criado com base na auditoria |
| 2026-10-19 | Kiro (step 1) | Migration `20261019000000_coupledna_multi_invite.sql` criada — tabela `couple_invite_slots` (tabela, índices, RLS, trigger `set_updated_at`), coluna `couple_invite_slot_id` em `orders` (índice + unique index por slot ativo), remoção de `couple_invites_active_initiator_unique`, coluna `invite_slot_id` em `couple_consents`, inserção de quiz/versão/preços para `COUPLEDNA_INVITE`. P0-DB-01, P0-DB-02, P0-DB-03, P0-DB-04, P0-DB-06 marcados como 🟢 Concluído. P0-DB-05 permanece 🔴 (função `get_confirmed_invite_count` adiada para etapa TypeScript onde SELECT FOR UPDATE será implementado em `invite-pricing.ts`). com base na auditoria |

---

---

## 11. Decisões Registradas em `docs/ai/DECISIONS.md`

As decisões D-001 a D-007 foram aprovadas em 2026-10-19 e devem ser registradas em `docs/ai/DECISIONS.md` antes do início da implementação.

---

*Próxima ação: Etapa 1 — Modelagem de dados, constraints e migrations (P0-DB-01 a P0-DB-06).*
