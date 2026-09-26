# Fase 3 — Lead, Resultado e Privacidade

**Data de validação:** 26/09/2026  
**Estado:** Concluído localmente; captura de lead com consentimento auditável segregado, entrega de resultado com paywall defensivo (zero vazamento de conteúdo premium), tokens criptográficos de recuperação e unsubscribe em 1 clique, e páginas legais versionadas com tabela de retenção.

## Entregas

| Item                             | Estado    | Evidência                                                                                                |
| -------------------------------- | --------- | -------------------------------------------------------------------------------------------------------- |
| F3-01 Modelo de dados privacidade| Concluído | Migration `20260926020000_leads_privacy_results.sql` com `leads`, `consents`, `unsubscribe_tokens`, `recovery_tokens`, `data_requests`, `result_access_grants` |
| F3-02 Segregação de consentimento| Concluído | Consentimento transacional (`TRANSACTIONAL_RESULTS`) separado de promocional (`MARKETING_PROMOTIONAL`, desmarcado por padrão) |
| F3-03 Trilha auditável append-only| Concluído | Tabela `consents` grava `policy_version`, hash de IP salgado, user-agent e revogação sem sobrescrever histórico |
| F3-04 Resultado protegido        | Concluído | `/api/sessions/[id]/result` retorna `FREE_PARTIAL` com oferta de paywall editorial e omite estritamente `premiumReport` |
| F3-05 Desbloqueio por grant      | Concluído | `result_access_grants` valida grants (`PREMIUM_REPORT`, `PREMIUM_BUNDLE`) no servidor e gera relatório analítico completo |
| F3-06 Tokens de recuperação/opt-out| Concluído| Tokens aleatórios de 256 bits (`recovery_tokens` e `unsubscribe_tokens`), persistência exclusiva de hash SHA-256 e comparação em tempo constante |
| F3-07 E-mails transacionais      | Concluído | `email-service.ts` com templates nos 4 idiomas (PT, EN, ES, FR), mascaramento de e-mails em logs e suporte a Resend |
| F3-08 Exercício de direitos LGPD | Concluído | Rota `/api/privacy/data-request` e página `/[locale]/privacy/data-request` com proteção contra enumeração |
| F3-09 Unsubscribe em 1 clique    | Concluído | Rota `/api/privacy/unsubscribe` e página `/[locale]/unsubscribe` revoga consentimento de marketing imediatamente |
| F3-10 Políticas versionadas      | Concluído | `/[locale]/legal/privacy` e `/[locale]/legal/terms` com versão `2026-09-v1`, tabela de retenção e aviso não-clínico |

## Validação executada

- **ESLint**: aprovado (zero erros e zero avisos).
- **TypeScript (`tsc --noEmit`)**: aprovado (zero erros de tipo).
- **Vitest**: 12 arquivos e 33 testes aprovados, cobrindo:
  - Normalização de e-mails e mascaramento para logs.
  - Hashing salgado de IP e geração segura de tokens.
  - Gravação de lead e separação estrita de consentimento transacional vs promocional.
  - 1-click unsubscribe com auditoria append-only de revogação.
  - Submissão de data requests LGPD com resposta anti-enumeração.
  - Bloqueio de conteúdo premium na visão gratuita e desbloqueio mediante `PREMIUM_REPORT` grant.
- **Next.js Production Build**: aprovado (Next.js 16.3.6 Turbopack) gerando 36 rotas SSG/SSR estáticas e dinâmicas.
- **Smoke Test (`pnpm smoke`)**:
  - `GET /api/health` -> `200`
  - `GET /pt`, `/en`, `/es`, `/fr` -> `200`
  - `GET /pt/quizzes/brainrank` -> `200`
  - `GET /en/quizzes/personality-map` -> `200`
  - `GET /pt/legal/privacy` -> `200`
  - `GET /pt/legal/terms` -> `200`
  - `GET /pt/privacy/data-request` -> `200`
  - `GET /pt/unsubscribe` -> `200`
- **Segurança e RLS**:
  - Todas as 6 novas tabelas da Fase 3 criadas no schema `meqyro` com RLS ativado.
  - Zero permissões concedidas a `anon`, `authenticated` ou `PUBLIC`.
  - Autorização executada exclusivamente pelo `service_role` no servidor Next.js.
  - Prevenção a timing attacks com `timingSafeEqual` na verificação de hashes de tokens.

## Critérios de Aceite da Fase 3 (PLANO_DE_IMPLEMENTACAO_MEQYRO_V1.md)

1. *Resultado básico tem valor real:* **Aprovado.** Usuário visualiza pontuação global (BrainRank índice 0-1000), dimensão de maior destaque com descrição aprofundada e visão percentual de todas as dimensões cognitivas ou traços Big Five.
2. *Marketing só é habilitado por consentimento explícito auditável:* **Aprovado.** Checkbox de consentimento promocional é desmarcado por padrão, separado dos termos de serviço, e gera registro auditável append-only com versão da política e hash de token para cancelamento instantâneo.
