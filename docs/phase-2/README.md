# Fase 2 — Quiz Engine

**Data de validação:** 26/09/2026  
**Estado:** Concluído localmente; motor de quiz unificado, catálogo versionado, pontuação no servidor e persistência de sessões validados com testes automatizados e smoke test.

## Entregas

| Item                         | Estado    | Evidência                                                                                                   |
| ---------------------------- | --------- | ----------------------------------------------------------------------------------------------------------- |
| F2-01 Catálogo e conteúdo    | Concluído | Schema `meqyro` com `questions`, `options` e traduções; seed para BrainRank (24q) e Personality Map (40q)   |
| F2-02 Sessão anônima segura  | Concluído | Cookie HttpOnly `meqyro_session` (`SameSite=Lax`), UUID de sessão e token de integridade criptográfico      |
| F2-03 Renderers de perguntas | Concluído | `SingleChoice` (alvos de toque >= 44 px) e `LikertScale` (escala 1 a 5 com labels localizados)              |
| F2-04 Persistência e avanço  | Concluído | Autosave via `/api/sessions/[id]/answers`, navegação avançar/voltar e retomada sem perda de estado          |
| F2-05 Scoring no servidor    | Concluído | `brainRankScoringV1` e `personalityMapScoringV1`; zero vazamento de chaves ou respostas corretas ao cliente |
| F2-06 Imutabilidade pós-quiz | Concluído | Trigger Postgres `prevent_completed_session_answer_change` impede alteração de respostas após conclusão     |
| F2-07 Conclusão e resultado  | Concluído | `/api/sessions/[id]/complete` calcula pontuação, salva snapshot e retorna sumário gratuito parcial          |
| F2-08 Rotas App Router       | Concluído | `/[locale]/quizzes/[slug]` (landing) e `/[locale]/quizzes/[slug]/play` (runner interativo)                  |

## Validação executada

- **ESLint**: aprovado (zero erros e zero avisos).
- **TypeScript (`tsc --noEmit`)**: aprovado (zero erros de tipo).
- **Vitest**: 9 arquivos e 26 testes aprovados, cobrindo pricing, domínio, scoring, seeds, sessão anônima, observabilidade, i18n e ciclo de vida do quiz engine.
- **Next.js Production Build**: aprovado com Turbopack (Next.js 16.3.6), com rotas estáticas e dinâmicas geradas sem erros.
- **Smoke Test (`pnpm smoke`)**:
  - `GET /api/health` -> `200`
  - `GET /pt`, `/en`, `/es`, `/fr` -> `200`
  - `GET /pt/quizzes/brainrank` -> `200`
  - `GET /en/quizzes/personality-map` -> `200`
- **Segurança e RLS**:
  - Respostas corretas (`correctOptionId`) e chaves psicométricas (`scoring_key`) filtradas estritamente no servidor (`contracts.ts` e `repository.ts`).
  - Score calculado exclusivamente no servidor via `session-service.ts`.
- **Mobile-first**:
  - Componentes renderizados respeitando touch target mínimo de 44 px.
  - Zero overflow horizontal em viewport de 360 px.

## Critérios de Aceite da Fase 2 (PLANO_DE_IMPLEMENTACAO_MEQYRO_V1.md)

1. _BrainRank e Personality Map rodam com fixtures:_ **Aprovado.** Ambos possuem 100% de cobertura de perguntas nos 4 idiomas (PT, EN, ES, FR) e scoring validado por golden tests.
2. _Refresh não perde progresso:_ **Aprovado.** Sessão é vinculada via cookie HttpOnly e recupera `currentPosition` e `answers` gravadas.
3. _Score não é calculado no cliente:_ **Aprovado.** O cliente apenas envia `optionId` ou `numericValue` e recebe o sumário parcial formatado após validação e cálculo no servidor.
