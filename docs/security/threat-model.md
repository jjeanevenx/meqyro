# Meqyro — Modelo de Ameaças e Controles de Segurança

**Versão:** 2.0  
**Data:** 26/09/2026  
**Status:** Implementado e Verificado em Testes

---

## 1. Fronteiras de Confiança e Ativos Críticos

1. **Tokens de Sessão Anônima e Recuperação:**
   - Tokens de 256 bits gerados via `crypto.randomBytes(32)`.
   - Armazenamento em banco exclusivamente via **hash SHA-256**.
   - Comparação segura em tempo constante (`timingSafeEqual`) contra ataques de temporização.
   - Limite de uso (`usage_count < max_uses`) e expiração estrita.

2. **Webhooks e Transações Financeiras:**
   - Modo **estritamente fail-closed**: rejeita webhooks sem assinatura válida ou sem segredo configurado (`HTTP 401`).
   - Janela de tolerância temporal de 300 segundos contra ataques de replay.
   - Validação cruzada de valor, moeda, ID de pedido e provedor de pagamento.
   - Idempotência baseada na chave única `(provider, provider_event_id)`.
   - Grants concedidos unicamente após confirmação criptograficamente validada do gateway.

3. **Defesa do Paywall e Conteúdo Premium:**
   - Em sessões gratuitas (`FREE_PARTIAL`), o backend omite 100% dos dados analíticos aprofundados (`premiumReport = undefined`).
   - Não há dependência de CSS/JavaScript no browser para esconder conteúdo.
   - O desbloqueio (`PREMIUM_UNLOCKED`) exige verificação ativa em `meqyro.result_access_grants`.

4. **Privacidade Bilateral do CoupleDNA:**
   - Bloqueio integral de pontuações individuais e comparações até que **ambos os participantes** tenham concluído o quiz e assinado explicitamente o termo de consentimento (`can_share_comparison = true`).
   - Sessões externas não participantes recebem `null` ao tentar inspecionar o código de convite.

5. **Privacidade LGPD / GDPR (Exportação e Exclusão):**
   - Solicitações exigem confirmação via link seguro de uso único (`magic link`).
   - Prevenção contra enumeração de e-mails (respostas genéricas idênticas no formulário).
   - Exportação de dados estruturados associados estritamente ao solicitante.
   - Exclusão com anonimização de identificadores e preservação legal de registros fiscais (`orders`) sem PII desnecessária.

6. **Painel Administrativo e Métricas:**
   - Autenticação obrigatória com verificação criptográfica de `ADMIN_API_SECRET`.
   - Headers anti-indexação: `X-Robots-Tag: noindex, nofollow` e exclusão formal do `sitemap.xml`.
   - Mascaramento ou omissão de e-mails em agregações de métricas.

---

## 2. Matriz de Ameaças, Vetores e Mitigações Implementadas

| Ameaça / Vetor                  | Impacto                              | Mitigação Implementada                                                                                     | Verificação / Teste                                                                |
| :------------------------------ | :----------------------------------- | :--------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| **Falsificação de Sessão**      | Acesso indevido a respostas alheias  | Token opaco de 256 bits, hash no banco, verificação `timingSafeEqual`.                                     | `tests/unit/anonymous-session.test.ts`, `tests/integration/qa-audit.test.ts`       |
| **Replay de Webhook**           | Múltiplas tentativas de fulfillment  | Chave única `(provider, provider_event_id)` e tolerância de 300s.                                          | `tests/unit/webhooks.test.ts`, `tests/integration/commerce.test.ts`                |
| **Manipulação de Preço**        | Compra por valor inferior            | Preços resolvidos exclusivamente pelo catálogo server-side; conferência exata de moeda e valor no webhook. | `tests/unit/pricing.test.ts`, `tests/integration/qa-audit.test.ts`                 |
| **Vazamento de Paywall**        | Acesso a insights pagos sem compra   | O payload `FREE_PARTIAL` não contém o objeto do relatório premium.                                         | `tests/unit/paywall-defense.test.ts`, `tests/integration/protected-result.test.ts` |
| **Vazamento CoupleDNA**         | Exposição unilateral de respostas    | Verificação bilateral de consentimento e rejeição de sessões não vinculadas.                               | `tests/integration/qa-audit.test.ts`                                               |
| **Enumeração LGPD**             | Identificação de e-mails cadastrados | Resposta constante fail-closed; token temporário com hash para confirmação.                                | `tests/unit/consent.test.ts`, `tests/integration/qa-audit.test.ts`                 |
| **Acesso Indevido ao Admin**    | Visualização de métricas e pedidos   | Middleware / guard fail-closed em todas as rotas `/admin` e `/api/admin/*`.                                | `tests/unit/admin-auth.test.ts`, `scripts/smoke.mjs`                               |
| **Indexação de Rotas Privadas** | Exposição em mecanismos de busca     | `robots.ts` e `sitemap.ts` bloqueiam play, results, checkout, couple, admin e confirm.                     | `tests/unit/growth-seo.test.ts`                                                    |

---

## 3. Diretrizes de Operação Segura

1. Nunca desative a verificação de assinatura em ambientes com tráfego real.
2. Mantenha `NODE_ENV === "production"` para garantir que nenhum mock silencioso seja ativado.
3. Rotação periódica de `ADMIN_API_SECRET`, `TOKEN_SECURITY_SECRET` e `CRON_SECRET`.
