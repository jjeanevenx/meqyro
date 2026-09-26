# Runbook: Webhooks e Conciliação de Pagamentos

**Versão:** 1.1  
**Data:** 26/09/2026  
**Status:** Produção e Homologação

---

## 1. Arquitetura de Ingestão e Segurança

Todos os webhooks de gateways de pagamento (Stripe e InfinitePay) são processados de forma **estritamente fail-closed**:

- Rejeição imediata (`HTTP 401 Unauthorized`) caso a assinatura do webhook esteja ausente, malformada ou o segredo do provedor não esteja configurado no servidor.
- Validação temporal da assinatura: tolerância máxima de 300 segundos (5 minutos) para mitigar ataques de repetição (_replay attack_).
- Comparação criptográfica em tempo constante (`timingSafeEqual`) de hashes HMAC-SHA256 para prevenir _timing attacks_.
- Identificadores de evento extraídos unicamente do payload assinado pelo provedor (sem IDs pseudo-aleatórios ou baseados em `Date.now()`).
- Deduplicação e idempotência através de chave primária composta `(provider, provider_event_id)` na tabela `meqyro.payment_events`.
- Não liberação de conteúdo premium com base em redirect de navegador: **somente webhooks autenticados ou reconciliação server-side** concedem grants em `meqyro.result_access_grants`.

---

## 2. Contratos dos Provedores

### 2.1 Stripe

- **Endpoint:** `POST /api/webhooks/stripe`
- **Header:** `stripe-signature: t=<timestamp>,v1=<hmac_sha256>`
- **Segredo no Ambiente:** `STRIPE_WEBHOOK_SECRET`
- **Payload Assinado:** `<timestamp>.<raw_body_utf8>`
- **Eventos Monitorados:**
  - `checkout.session.completed`: Confirmação de pagamento (`CONFIRMED`). Valida `client_reference_id` (Order ID), `metadata.order_number`, `amount_total` e `currency`.
  - `charge.refunded`: Estorno/Reembolso (`REFUNDED`). Revoga grants ativos e marca pedido como `REFUNDED`.
  - `charge.dispute.created`: Chargeback/Disputa (`CHARGEBACK`). Revoga grants imediatamente e registra alerta de segurança.

### 2.2 InfinitePay

- **Endpoint:** `POST /api/webhooks/infinitepay`
- **Header:** `x-infinitepay-signature: <hmac_sha256>`
- **Segredo no Ambiente:** `INFINITEPAY_WEBHOOK_SECRET`
- **Payload Assinado:** `<raw_body_utf8>`
- **Eventos Monitorados:**
  - `transaction.success`: Pagamento aprovado via PIX ou Cartão (`CONFIRMED`). Valida `order_id` / `order_number`, `amount` e `currency` (BRL).
  - `transaction.refunded`: Reembolso (`REFUNDED`).
  - `transaction.chargeback`: Chargeback (`CHARGEBACK`).

---

## 3. Validação de Pedido e Anti-Tampering

Antes do fulfillment do pedido, o `webhook-handler` executa:

1. **Verificação de Existência:** Consulta o pedido por ID ou número oficial do pedido (`MQ-BR-...`).
2. **Isolamento de Provedor:** Um evento do Stripe não pode liberar um pedido originado pelo InfinitePay (e vice-versa).
3. **Casamento Exato de Valor e Moeda:** Se o webhook declarar valor ou moeda divergentes do pedido registrado no banco, o evento é rejeitado com status `UNMATCHED_AMOUNT`, sem concessão de grant.
4. **Idempotência Estrita:** Eventos duplicados retornam `{ handled: true, duplicate: true }` com `HTTP 200 OK`, sem duplicar grants.

---

## 4. Diagnóstico de Falhas e Procedimento Operacional

### 4.1 Erro 401: Assinatura Ausente ou Malformada

- **Causa:** O payload foi enviado sem o header de assinatura correto ou o segredo correspondente não está definido no ambiente.
- **Ação:** Verificar as variáveis `STRIPE_WEBHOOK_SECRET` e `INFINITEPAY_WEBHOOK_SECRET` no arquivo `.env.production` ou nas configurações do host (Vercel/Cloudflare).

### 4.2 Pedido Pago mas com Status Pendente (`PAID` sem `FULFILLED`)

- **Causa:** Interrupção de rede temporária durante a finalização do grant.
- **Ação:** Executar a rotina de reconciliação automática chamando o endpoint de cron:
  ```bash
  curl -X POST https://meqyro.com/api/cron/reconcile \
    -H "Authorization: Bearer <CRON_SECRET>"
  ```
  Ou manualmente via script operacional:
  ```ts
  import { reconcileUnfulfilledPaidOrders } from "@/features/commerce/reconciliation-service";
  const { repairedCount } = await reconcileUnfulfilledPaidOrders();
  ```

### 4.3 Procedimento de Estorno / Reembolso

- Quando o reembolso é disparado pelo painel do Stripe ou InfinitePay, o webhook processa a revogação automaticamente.
- Se necessário estorno manual de emergência:
  ```ts
  import { refundOrder } from "@/features/commerce/fulfillment-service";
  await refundOrder(orderId, "Solicitação de cancelamento em conformidade com o CDC");
  ```
