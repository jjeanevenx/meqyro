# ADR 0003 — Pagamento confirmado e acesso por grant

**Status:** aceito  
**Data:** 25/09/2026

## Decisão

Preço, moeda e produto são resolvidos no servidor. A Stripe é o único provedor e usa Checkout hospedado com métodos de pagamento dinâmicos. Redirects são apenas navegação; eventos passam por assinatura, conferência e idempotência. O acesso premium é representado por `result_access_grants`.

## Consequência

Evita desbloqueio por manipulação do cliente e permite bundles/refundos. Introduz estado `PAID` separado de `FULFILLED` e reconciliador.
