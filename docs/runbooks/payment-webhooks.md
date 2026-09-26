# Runbook: Diagnóstico de Webhooks e Conciliação de Pagamentos

**Versão:** 1.0  
**Data:** 26/09/2026

---

## 1. Arquitetura de Ingestão e Idempotência

Todos os eventos de pagamento passam pela tabela `meqyro.payment_events`:
- Restrição única: `(provider, provider_event_id)`
- Assinatura HMAC validada antes do processamento.
- Transição atômica do pedido: `CREATED -> PENDING -> PAID -> FULFILLED`.
- Liberação automática de grant em `meqyro.result_access_grants`.

---

## 2. Diagnóstico de Falhas Comuns

### 2.1 Webhook Retorna 400 (Assinatura Inválida)
- **Causa provável:** Chave de webhook desatualizada no ambiente de produção (`STRIPE_WEBHOOK_SECRET` ou segredo InfinitePay) ou body lido incorretamente como JSON em vez de raw buffer.
- **Verificação:** Checar header `stripe-signature` e conferir se o timestamp da assinatura está dentro da tolerância de 5 minutos.

### 2.2 Pedido Pago mas com Status Pendente (`PAID` sem `FULFILLED`)
- **Causa:** O webhook do gateway foi entregue com atraso ou o container caiu antes de concluir o grant.
- **Ação:** Executar a reconciliação automática:
  ```ts
  import { reconcileUnfulfilledPaidOrders } from "@/features/commerce/reconciliation-service";
  const repairedCount = await reconcileUnfulfilledPaidOrders();
  console.log(`Reparados: ${repairedCount}`);
  ```
- O serviço detecta pedidos com `paid_at IS NOT NULL` e `status != 'FULFILLED'`, provisiona o `result_access_grants` e atualiza para `FULFILLED` com log auditável.

### 2.3 Webhook Duplicado
- O gateway reenviou o mesmo evento:
- **Comportamento esperado:** A tabela `payment_events` rejeita a inserção pelo erro de unicidade (`23505`), o handler captura o erro, registra log `webhook_duplicate_ignored` e retorna HTTP `200 OK` ao gateway, evitando nova tentativa desnecessária.

---

## 3. Procedimento de Estorno / Reembolso Manual

1. Acesse o dashboard do provedor correspondente e execute o reembolso.
2. No banco de dados da Meqyro (ou via rota administrativa autenticada), o webhook `charge.refunded` chamará `refundOrder`:
   - Deleta o grant correspondente em `meqyro.result_access_grants`.
   - Insere registro em `meqyro.refunds`.
   - Transiciona o pedido para `REFUNDED`.
