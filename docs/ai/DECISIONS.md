# Architecture Decisions

## ADR-001 — No mandatory user authentication

**Status:** Existing (confirmed by codebase)

**Context:** Self-discovery assessments work best with zero friction at entry. Requiring account creation adds drop-off before the first question.

**Decision:** Sessions are fully anonymous. A 256-bit random token is stored in an `HttpOnly` cookie and its SHA-256 hash is stored in the database. Optional email capture (lead capture) allows result recovery via a signed link — not account login.

**Evidence:**

- `src/lib/security/anonymous-session.ts`
- `src/features/quiz-engine/session-service.ts` — `startQuizSession()` creates sessions without any user identity
- `.env.example` — no auth provider credentials defined

**Consequences:** No `users` table. Premium access is tied to a session + payment event, not a user account. Users who clear cookies lose their session (unless they saved their email and use the recovery link).

---

## ADR-002 — Market is independent of locale

**Status:** Existing (confirmed by code and ADR document)

**Context:** Language choice does not determine country. A Brazilian user may browse in English; a Portuguese user in French. Payment provider and currency must reflect the user's actual country, not their language preference.

**Decision:** Market (`BR`/`US`/`EU`/`GB`) is resolved from: (1) explicit `meqyro_market` cookie, (2) country from geolocation header, (3) default `US`. Locale only controls language display.

**Evidence:**

- `src/lib/market/market-context.ts` — `resolveMarketContext()` with explicit comment
- `docs/decisions/0003-pagamentos-e-grants.md`
- `tests/unit/market-context.test.ts`

**Consequences:** All markets use Stripe. Currency follows market; payment methods depend on account configuration, independently of locale.

---

## ADR-003 — Server-side scoring only

**Status:** Existing (confirmed by codebase)

**Context:** Scoring functions contain the correct answers. Exposing them to the client would allow users to trivially cheat.

**Decision:** All scoring is computed server-side at session completion. The client submits raw answers (option IDs or Likert values) to `/api/sessions/[id]/complete`. The server loads questions, constructs scoring items, calls the pure scoring function, and stores the result.

**Evidence:**

- `src/features/quiz-engine/session-service.ts` — `completeQuizSession()`
- `src/features/scoring/*.ts` — all marked `server-only` indirectly via feature imports
- `src/features/quiz-engine/repository.ts` — `getFallbackPublicQuiz()` strips `isCorrect` and `scoringKey` from public question data

**Consequences:** The public quiz API (`/api/sessions/[id]/result`) returns scores but never correct answers. A compromised client cannot generate a fake score.

---

## ADR-004 — Stripe as the sole payment provider

**Status:** Current, confirmed by source code and the product decision.

**Decision:** Use hosted Stripe Checkout through the installed official SDK (22.6.2) for BR/US/EU/GB. Market determines BRL/USD/EUR/GBP independently of locale. Payment methods require account eligibility and configuration.

**Evidence:** `src/features/commerce/adapters/stripe.ts`, `src/features/commerce/contracts.ts`, `package.json`.

**Consequences:** Only `/api/webhooks/stripe` processes payments. The SDK verifies the raw-body signature; fulfillment validates order, amount, currency and idempotency before granting access.

---

## ADR-005 — Custom i18n dictionary system (no library)

**Status:** Existing (confirmed by codebase)

**Context:** Four locales (pt, en, es, fr). The dictionary is small enough to be fully typed and statically included.

**Decision:** A single `dictionaries.ts` file exports a typed `Dictionary` object for all four locales. `getDictionary(locale)` returns the appropriate locale's strings. No dynamic imports, no i18n library.

**Evidence:**

- `src/lib/i18n/dictionaries.ts`
- `src/lib/i18n/config.ts`
- `package.json` — no next-intl, react-i18next, or similar

**Consequences:** Adding a new UI string requires updating all four locales in one file. TypeScript enforces completeness. The dictionary is statically included in the bundle (acceptable for the current size).

---

## ADR-006 — Supabase custom schema `meqyro`

**Status:** Existing (confirmed by migrations and config)

**Context:** Separates application tables from Supabase's built-in `public` schema to avoid naming conflicts and enable clean RLS policies.

**Decision:** All application tables live in the `meqyro` Postgres schema. The Supabase config exposes this schema via the API.

**Evidence:**

- `supabase/config.toml` — `schemas = ["public", "graphql_public", "meqyro"]`
- `supabase/migrations/` — all `CREATE TABLE` statements use `meqyro.` prefix
- `src/features/analytics/analytics-service.ts` — `.schema("meqyro")` call

**Consequences:** Queries must specify the `meqyro` schema when using `.schema("meqyro")` on the Supabase client. All tables have RLS enabled.

---

## ADR-007 — Webhook idempotency via DB unique constraint

**Status:** Existing (confirmed by code)

**Context:** Payment providers may send the same webhook multiple times (retries, delays, network issues). Fulfilling an order twice would result in duplicate grants.

**Decision:** A `payment_events(provider, provider_event_id)` unique constraint prevents duplicate processing. On `23505` error (unique violation), the handler returns `{ handled: true, duplicate: true }` without error.

**Evidence:**

- `src/features/commerce/webhook-handler.ts` — `handleWebhook()` duplicate detection
- `supabase/migrations/20260926030000_commerce_fulfillment.sql` — unique constraint definition

**Consequences:** Webhook handling is safe to retry without side effects. Reconciliation cron can safely re-trigger fulfillment for orders that missed their webhook.

---

## ADR-008 — Seed SQL generated from TypeScript content

**Status:** Existing (confirmed by codebase)

**Context:** Quiz questions exist as TypeScript objects in `src/content/quizzes/`. Maintaining a separate SQL seed file by hand would create drift.

**Decision:** `scripts/build-seed-sql.ts` generates `supabase/seed.sql` from the TypeScript content arrays. The seed file is committed but should not be edited manually.

**Evidence:**

- `scripts/build-seed-sql.ts`
- `tests/unit/seed-builder.test.ts` — calls `generateSeedSql()` and writes the file as part of the test run
- `supabase/seed.sql` — comment at top indicates it is generated

**Consequences:** Any question content change requires running the seed builder script and re-running `supabase db reset` locally. The seed builder test enforces that the generated SQL contains expected stable keys.

---

## ADR-009 — No CSS framework or component library

**Status:** Existing (confirmed by package.json and globals.css)

**Context:** UNKNOWN — no explicit decision document found. Inferred from the absence of any UI library in dependencies and the presence of a large `globals.css`.

**Decision:** All styling is in `src/app/globals.css` using BEM-like class naming and CSS custom properties. No Tailwind, no CSS Modules, no styled-components, no shadcn/ui.

**Evidence:**

- `package.json` — no UI library dependencies
- `src/app/globals.css` — extensive custom CSS
- Component files use plain `className` strings

**Reason:** UNKNOWN (not documented in project decisions).

**Consequences:** New components must follow the existing CSS patterns. Do not introduce a CSS framework.

## ADR — comprador, comparação e entrega

Usar identidade anônima de comprador herdada de sessão autenticada para grants de pacotes. Exigir conclusão, consentimentos bilaterais e pagamento na comparação CoupleDNA. Registrar entrega por pedido/sessão para abranger testes concluídos depois da compra, selecionando o grant mais recente antes de filtrar entregas pendentes.

Permitir PROCESSING para FULFILLED quando o pagamento verificado chega antes de persistir o checkout; atualizações subsequentes usam estado esperado para não regredir pedido confirmado. Scoring continua exclusivamente no servidor.

## ADR — lançamento comercial de três produtos (2026-10-18)

Separar catálogo comercial (BrainRank, MoneyDNA e CoupleDNA) do catálogo técnico de sete quizzes. Bloquear novos checkouts de produtos retirados e bundles no serviço, preservando grants históricos. Exigir sessão concluída para nova compra. Idioma não altera mercado, inclusive no fallback US; preços exibidos vêm da oferta protegida do banco.

Preparar revogação por reembolso como transação com lock de pedido e retry idempotente de eventos. Registrar conversão financeira na transação do pedido e agregar métricas em SQL sobre todos os pedidos. Rejeitar eventos financeiros enviados ao endpoint público de analytics. Usar limite atômico de banco em produção para início de sessão e checkout, com chave HMAC sem IP bruto.

Não foram alterados scorers, gabaritos ou versões de scoring. A migração e o funil Stripe/SMTP precisam de homologação persistida antes da publicação. Ver auditoria e runbook comercial de 18/10/2026.

## ADR — BrainRank: prazos individuais (2026-10-19)

A versão temporal `brainrank-deadline-1.0` fixa dificuldade e limite em `quiz_session_questions` durante a seleção. Prioridade: `questions.metadata.timeLimitSeconds` inteiro positivo até 3600, padrão EASY=30/MEDIUM=45/HARD=60/VERY_HARD=90, fallback 45 segundos. `StartQuizSessionInput.timeMultiplier` permite acomodação confiável no servidor (1–4); o navegador não pode alterar os limites já fixados.

Iniciar e submeter usam RPC restrita a service_role, SECURITY INVOKER e lock da sessão. O banco mede chegada e duração. A primeira resposta confirmada é definitiva e tentativas repetidas retornam o registro existente. Resposta recebida no prazo exato ou depois recebe TIMEOUT, sem alternativa nem acerto; respostas incorretas não têm bônus. Não há pausa ao mudar de aba, fechar ou recarregar. A próxima pergunta começa somente quando a interface solicita seu prazo, depois da etapa informativa.

A fórmula histórica de acertos e os desempates do scorer 1.0 permanecem: o tempo serve apenas ao desempate entre acertos. TIMEOUT conta como erro, sem segunda penalização. Auditoria temporal e métricas premium são armazenadas em `score.timing`, com versão própria; resultados históricos não são recalculados. Não há diagnóstico clínico ou inferência de memória a partir apenas de rapidez.

A política de rede é estrita e explícita: vale a chegada ao banco, antes da espera pelo lock. Não há tolerância baseada em horário informado pelo cliente. Falha de rede exige tentar novamente, sempre recuperando o mesmo prazo. A API de relógio não retorna gabarito ou pontuação.

## ADR — correções BrainRank 1.1 e acesso premium (2026-10-19)

Criar conteúdo BrainRank 1.1 com scoring_version 1.1 para corrigir ambiguidades e distratores de oito itens (incluindo o valor correto de BR_NUM_01, de 41 para 43). Manter as perguntas, respostas e resultados 1.0 intactos; arquivar sua versão apenas para impedir novas seleções. A fórmula cognitiva não muda, e a recuperação tardia permanece indicador exploratório separado.

Centralizar o plano de 24 questões: informações antes de 1/13/20 e recuperações em 8/18/24. Preservar os blocos de tentativas antigas pela ordem persistida. Informações aguardam Continuar, sem timer; uma interrupção antes da confirmação permite retomar a leitura. Registrar situações e intervalos nos novos resultados, sem recalcular resultados finalizados.

Resolver o destino pós-compra pelo quiz da sessão autenticada; garantir que o grant da própria tentativa seja consultado mesmo sem buyer_id. Manter pagamento e consentimento bilateral para CoupleDNA. Remover certificados do checkout e do documento entregue. Evidências e limitações em docs/audits/quiz-premium-corrections-2026-10-19.md.

## ADR — instrumentos comportamentais MoneyDNA/CoupleDNA v2 (2026-10-19)

Publicar novos cenários em v2.0.0 / behavioral-v2, mantendo 20 questões, cinco grupos, quatro idiomas e as versões Likert anteriores intactas. Reutilizar SCENARIO e scoring_value JSONB, sem nova tabela. Selecionar a versão publicada mais recente apenas para novas tentativas destes dois quizzes; tentativas e convites existentes mantêm versão e conjunto fixados.

MoneyDNA passa a índices descritivos por prioridade escolhida, normalizados pela quantidade de oportunidades em que essa prioridade aparece. CoupleDNA usa preferências bipolares de processamento individual a elaboração conjunta por tema, sem converter pontuação alta em qualidade da relação. Pesos iguais por cenário; dificuldade e duração não afetam índices. Registrar evidências de alternativas, empates e variação contextual. Rejeitar entradas incompletas, alternativas externas ou pesos divergentes da versão canônica.

Comparação bilateral v2 usa concordância das alternativas nos mesmos cenários, evitando cancelamento de diferenças em médias iguais. Continuam obrigatórios pagamento, conclusão e consentimento dos dois. Relatórios acrescentam evidências e ações do próprio participante, sem revelar respostas individuais da outra pessoa. Nenhum resultado anterior é recalculado. Reexecução da migração é no-op para conteúdo já existente. Modelo editorial exploratório, sem alegação de validação psicométrica. Detalhes, cobertura e limitações em docs/audits/behavioral-redesign-2026-10-19.md.

## ADR — BrainRank 1.2: situações variadas por tentativa (2026-10-28)

Substituir o conjunto fixo das novas tentativas por três situações distintas selecionadas de um banco de 12 narrativas em pt/en/es/fr. Reutilizar o PRNG de seleção e persistir os IDs em `quiz_session_questions`: a retomada e a troca de idioma não sorteiam outra sequência. O banco finito permite coincidências entre pessoas, mas não impõe as mesmas três situações a todos. Manter informações antes de 1/13/20, recuperações em 8/18/24 e 24 questões totais. Não alterar o instrumento FocusStyle.

Publicar conteúdo/scoring 1.2 sem recalcular resultados nem editar perguntas de 1.0/1.1. A fórmula cognitiva permanece igual; a versão identifica o novo conteúdo de recuperação. A RPC identifica ciclos pela ordem persistida, preserva tentativas legadas e exige confirmação da informação vinculada antes de iniciar o prazo. O endpoint aceita apenas uma situação atribuída na posição atual, sem confiar no ID enviado pelo navegador.

O relatório BrainRank explica o que foi recuperado, contextualiza acertos parciais sem rotular a pessoa, mantém as limitações do indicador exploratório e usa nomes de dificuldade traduzidos. A ressalva geral aparece uma vez no relatório cognitivo, preservando os contratos dos demais quizzes. Corrigir também o recorte de sequências visuais no mobile permitindo que o grid e a sequência encolham ao espaço disponível.
