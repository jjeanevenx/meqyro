# Fase 5 — Growth e SEO

**Data de validação:** 26/09/2026  
**Estado:** Concluído localmente; instrumentação ponta-a-ponta de eventos do funil com sanitização estrita via allowlist (zero PII ou respostas brutas), páginas de quizzes e home com geração estática (SSG), metadados completos com canonical, quatro hreflangs recíprocos e x-default, schemas estruturados Schema.org (Quiz e Organization), sitemap.xml e robots.txt defensivos, links de compartilhamento e indicação seguros com atribuição de referrals, cross-sell pós-checkout com suporte a bundles em fulfillment, e framework determinístico de experimentos A/B e feature flags.

## Entregas

| Item                             | Estado    | Evidência                                                                                                |
| -------------------------------- | --------- | -------------------------------------------------------------------------------------------------------- |
| F5-01 Modelo de dados analytics/growth| Concluído | Migration `20260926040000_growth_seo_analytics.sql` com `analytics_events`, `referrals`, `experiments`, colunas de atribuição em `quiz_sessions` e `orders` |
| F5-02 Eventos do funil sanitizados| Concluído | `src/features/analytics/` com allowlist estrita (`ALLOWED_ANALYTICS_PROPERTY_KEYS`) descartando e-mails, senhas, tokens e respostas brutas |
| F5-03 Ingestão de beacons        | Concluído | `POST /api/analytics/events` e persistência em `meqyro.analytics_events` com RLS ativado                |
| F5-04 Metadados e hreflang       | Concluído | `metadata-builder.ts` gerando canonical, hreflangs para `pt`, `en`, `es`, `fr`, `x-default` e Open Graph completo |
| F5-05 Schemas estruturados JSON-LD| Concluído| `json-ld.ts` gerando schemas Schema.org `Quiz` e `Organization` sem alegações médicas ou deterministas |
| F5-06 Sitemap e Robots dinâmicos | Concluído | `sitemap.ts` cobrindo todas as rotas públicas nos 4 idiomas; `robots.txt` bloqueando play, checkout, unsubscribe e API |
| F5-07 Referrals e compartilhamento seguro| Concluído| `referral-service.ts` e `POST /api/referrals` gerando códigos únicos (`MQ...`) e rastreando cliques/conversões sem vazar dados |
| F5-08 Pós-compra, cross-sell e bundles| Concluído| `checkout/success` com recomendação editorial de próximo quiz; `fulfillment-service.ts` expande bundles para concessão múltipla de grants |
| F5-09 Experimentos A/B determinísticos| Concluído| `experiment-service.ts` com hash SHA-256 distribuindo buckets estáveis (0–99) sem flickering            |
| F5-10 Feature flags com contexto | Concluído | `feature-flags.ts` com suporte a overrides de variáveis de ambiente e contexto de mercado/país          |

## Validação executada

- **ESLint**: aprovado (zero erros e zero avisos).
- **TypeScript (`tsc --noEmit`)**: aprovado (zero erros de tipo).
- **Vitest**: 14 arquivos e 48 testes aprovados (`tests/unit/growth-seo.test.ts`), cobrindo:
  - Sanitização de eventos do funil com descarte estrito de PII, tokens e respostas.
  - Gravação de eventos no Postgres.
  - Metadados SEO multilíngues com 4 `hreflangs` e `x-default`.
  - JSON-LD para `Quiz` e `Organization`.
  - Resolução dinâmica de `sitemap.xml` e regras defensivas de `robots.txt`.
  - Geração e contabilidade de links de referral (cliques e conversões).
  - Determinismo estrito em experimentos A/B e isolamento de variantes.
  - Expansão e fulfillment de produtos bundle (`PREMIUM_BUNDLE`).
- **Next.js Production Build**: aprovado (Next.js 16.3.6 Turbopack) gerando 61 rotas estáticas e dinâmicas.
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
  - `GET /sitemap.xml` -> `200`
  - `GET /robots.txt` -> `200`

## Critérios de Aceite da Fase 5 (PLANO_DE_IMPLEMENTACAO_MEQYRO_V1.md)

1. *Cada etapa do funil é mensurável:* **Aprovado.** Eventos `landing_viewed`, `quiz_started`, `question_answered`, `quiz_completed`, `checkout_initiated`, `checkout_completed` são registrados com schema estrito sem PII.
2. *Cada landing publicada passa no checklist SEO/localização:* **Aprovado.** Título, descrição, canonical, 4 tags hreflang recíprocas com x-default, JSON-LD Quiz Schema.org e Open Graph configurados e testados.
