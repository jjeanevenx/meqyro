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
