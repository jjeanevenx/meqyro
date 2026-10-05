# Fase 7 — Hardening, Segurança e Lançamento

**Data de validação:** 26/09/2026  
**Estado:** Concluído localmente; plataforma blindada contra ataques comuns (rate limiting por IP com janela deslizante, cabeçalhos de segurança rigorosos com HSTS e CSP no Next.js, auditoria completa de RLS em 100% das 26 tabelas com zero privilégios a `anon` e `authenticated`), e runbooks operacionais elaborados para suporte, reconciliação de pagamentos, backup/restore e entregabilidade de e-mail com SPF/DKIM/DMARC.

## Entregas de Engenharia

| Item                               | Estado    | Evidência                                                                                                                           |
| ---------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| F7-01 Rate Limiting defensivo      | Concluído | `src/lib/security/rate-limit.ts` com janela deslizante, detecção de IP e integração em rotas de checkout e privacidade              |
| F7-02 Cabeçalhos de Segurança      | Concluído | `next.config.ts` com `HSTS` (63072000s com subdomínios e preload), `CSP`, `X-Frame-Options: DENY`, `nosniff` e `Permissions-Policy` |
| F7-03 Auditoria RLS do Postgres    | Concluído | 26 tabelas no schema `meqyro` com `rowsecurity = true`; 0 privilégios concedidos a `anon`, `authenticated` ou `public`              |
| F7-04 Runbook de Incidentes        | Concluído | `docs/runbooks/incident-response.md` detalhando níveis de severidade (SEV-1 a SEV-3), SLA e rotação de credenciais                  |
| F7-05 Runbook de Webhooks          | Concluído | `docs/runbooks/payment-webhooks.md` com procedimentos para diagnóstico de webhooks e reconciliação de pedidos `PAID`                |
| F7-06 Runbook de Backup/Restore    | Concluído | `docs/runbooks/database-backup-restore.md` com instruções de dump lógico e rotina de restauração (Restore Drill)                    |
| F7-07 Entregabilidade de E-mail    | Concluído | `docs/operations/email-deliverability.md` com registros DNS (SPF, DKIM, DMARC) e diretrizes de reputação de remetente               |
| F7-08 Segurança de Webhooks        | Concluído | SDK Stripe, tolerância 300s, IDs estáveis e conferência exata de moeda/valor                                                        |
| F7-09 Proteção de Admin & Métricas | Concluído | Auth fail-closed via token/header/cookie, exclusão de sitemap, noindex/nofollow e dados reais sem PII                               |
| F7-10 Reconciliação Operacional    | Concluído | `POST /api/cron/reconcile` protegido por `CRON_SECRET` com distributed locks em `meqyro.operational_locks`                          |

## Validação executada

- **ESLint**: aprovado (zero erros e zero avisos).
- **TypeScript (`tsc --noEmit`)**: aprovado (zero erros de tipo).
- **Vitest**: 27 arquivos de teste cobrindo fluxos unitários e de integração (scoring, pagamentos, webhooks, sessões, privacidade LGPD, isolamento bilateral, admin e SEO).
- **Next.js Production Build**: aprovado (Next.js 16.3.6 Turbopack) gerando rotas SSG e SSR otimizadas.
- **Smoke Test (`pnpm smoke`)**:
  - `GET /api/health` -> `200`
  - `GET /api/admin/metrics` (sem token) -> `401 Unauthorized`
  - `GET /api/admin/metrics` (com token) -> `200 OK`
  - `GET /pt`, `/en`, `/es`, `/fr` -> `200`
  - `GET /pt/quizzes/brainrank` -> `200`
  - `GET /en/quizzes/personality-map` -> `200`
  - `GET /pt/quizzes/careerfit` -> `200`
  - `GET /en/quizzes/moneydna` -> `200`
  - `GET /pt/quizzes/focusstyle` -> `200`
  - `GET /es/quizzes/decisiondna` -> `200`
  - `GET /pt/quizzes/coupledna` -> `200`
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

## Critérios de Aceite da Fase 7 (PLANO_DE_IMPLEMENTACAO_MEQYRO_V1.md)

1. _Zero severidade crítica/alta:_ **Aprovado.** Toda a comunicação passa por HTTPS com HSTS estrito; o schema `meqyro` é completamente isolado de acessos anônimos diretos; dados sensíveis e credenciais são redigidos de forma automática dos logs.
2. _Rollback e runbooks documentados:_ **Aprovado.** Runbooks de resposta a incidentes, rotação de chaves de gateways e restore drill do PostgreSQL formalizados em `docs/runbooks/`.
