# Fase 1 — Fundação

**Data de validação:** 25/09/2026  
**Estado:** fundação local concluída; preview remoto depende de vincular projetos Vercel e Supabase.

## Entregas

| Item                          | Estado               | Evidência                                                                                       |
| ----------------------------- | -------------------- | ----------------------------------------------------------------------------------------------- |
| F1-01 App e qualidade         | Concluído            | Next.js 16, TypeScript, ESLint, Prettier, Vitest, build e CI                                    |
| F1-02 Shell localizado        | Concluído            | `/pt`, `/en`, `/es`, `/fr`; cookie de preferência; smoke test                                   |
| F1-03 MarketContext           | Concluído            | País, mercado, moeda, provedor e origem resolvidos no servidor; 4 mercados testados             |
| F1-04 UI e acessibilidade     | Concluído            | Tokens; Button, Input, Checkbox, RadioCard, ProgressBar e InlineError; foco e reduced motion    |
| F1-05 Supabase                | Concluído localmente | Migração e seed recriados do zero; 3 tabelas com RLS; zero grants de browser                    |
| F1-06 Secrets                 | Concluído            | Clientes browser/server separados; chave secreta em módulo `server-only`; Zod fail-fast         |
| F1-07 Observabilidade         | Concluído localmente | `x-request-id`, rota de saúde e logger estruturado com redação; coletor externo aguarda staging |
| F1-08 Domínio                 | Concluído            | Money em minor units e state machines testadas para sessão, tentativa, pedido, evento e grant   |
| F1-09 Arquitetura e segurança | Concluído            | ADRs 0001–0005 e threat model inicial                                                           |
| F1-10 Preview e smoke         | Parcial externo      | Smoke local verde e QA a 360 px; publicação aguarda vínculo Vercel                              |

## Validação executada

- ESLint: aprovado.
- TypeScript: aprovado.
- Vitest: 5 arquivos e 12 testes aprovados.
- Next.js production build: aprovado, 15 páginas geradas.
- Smoke: health + quatro locales responderam `200`.
- Supabase `db reset`: aprovado a partir de banco vazio.
- Supabase `db lint`: zero erros.
- Seed: 2 quizzes, 2 versões e 4 preços.
- Segurança: RLS ativo nas 3 tabelas; zero grants para `anon`, `authenticated` ou `PUBLIC`.
- Browser: PT→EN, BR→US e CTA do BrainRank validados; nenhum erro no console.
- Mobile: viewport de 360 px sem overflow horizontal; evidência em `mobile-qa.png`.

## Dependências externas restantes

1. Criar ou vincular o projeto Vercel para gerar o preview remoto.
2. Criar ou vincular projetos Supabase de staging e produção.
3. Configurar secrets no provedor e conectar o coletor de erros no staging.

Essas ações exigem acesso às contas externas e não bloqueiam o início da Fase 2 no ambiente local.
