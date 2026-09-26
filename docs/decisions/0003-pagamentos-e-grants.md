# ADR 0003 — Pagamento confirmado e acesso por grant

**Status:** aceito  
**Data:** 25/09/2026

## Decisão

Preço, moeda, produto e provedor são resolvidos no servidor. Redirects são apenas navegação. Eventos de pagamento passam por verificação, conferência e idempotência; InfinitePay exige também `payment_check`. O acesso premium é representado por `result_access_grants`.

## Consequência

Evita desbloqueio por manipulação do cliente e permite bundles/refundos. Introduz estado `PAID` separado de `FULFILLED` e reconciliador.
