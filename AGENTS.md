# AI Agent Instructions — Meqyro

## Project

Meqyro is a self-discovery assessment platform. Users take one or more of seven psychological/cognitive quizzes (BrainRank, Personality Map, CareerFit, MoneyDNA, CoupleDNA, DecisionDNA, FocusStyle), receive a free partial result, and may purchase a premium analytical report. The stack is Next.js 16 (App Router), TypeScript, Supabase (Postgres + RLS), and Stripe as the sole payment provider for BR/US/EU/GB.

## Before making changes

1. Read `docs/ai/PROJECT_CONTEXT.md` — understand the product and its flows.
2. Read `docs/ai/ARCHITECTURE.md` — understand module boundaries and data flow.
3. Read `docs/ai/DO_NOT_DO.md` — memorize prohibited actions before touching a file.
4. Read the task-specific document for your area (e.g. `docs/ai/DOMAIN_RULES.md` for quiz/scoring work, `docs/ai/SECURITY.md` for auth/payment work).

## Source of truth

| Topic                   | File                         |
| ----------------------- | ---------------------------- |
| Product & flows         | `docs/ai/PROJECT_CONTEXT.md` |
| Architecture            | `docs/ai/ARCHITECTURE.md`    |
| Folder structure        | `docs/ai/STRUCTURE.md`       |
| Stack & versions        | `docs/ai/TECH_STACK.md`      |
| Domain & business rules | `docs/ai/DOMAIN_RULES.md`    |
| Code conventions        | `docs/ai/CONVENTIONS.md`     |
| Dev workflow & commands | `docs/ai/WORKFLOWS.md`       |
| Testing                 | `docs/ai/TESTING.md`         |
| Security practices      | `docs/ai/SECURITY.md`        |
| Prohibited actions      | `docs/ai/DO_NOT_DO.md`       |
| Architecture decisions  | `docs/ai/DECISIONS.md`       |

**The source code is always more authoritative than these docs. If they conflict, investigate and report the discrepancy — do not blindly follow stale documentation.**

## Working protocol

Every task must follow this sequence:

1. **UNDERSTAND** — Read the requirement. Do not start coding immediately.
2. **LOCATE** — Find related code, abstractions, and tests before writing anything new.
3. **CHECK RULES** — Consult `DO_NOT_DO.md`, `ARCHITECTURE.md`, `CONVENTIONS.md`.
4. **PLAN** — Determine the smallest coherent change that solves the task.
5. **IMPLEMENT** — Write code that fits existing patterns; do not introduce new ones without justification.
6. **VALIDATE** — Run `pnpm typecheck && pnpm test && pnpm build` when the environment permits.
7. **REPORT** — State what changed, why, what was tested, what was not, and any assumptions made.

## Key rules

- All scoring logic lives in `src/features/scoring/`. **Never move scoring to the client or to API routes.**
- All server operations require `import "server-only"` at the top of the file.
- All DB access goes through `createSupabaseSecretClient()` (service role), never directly through the anon client in server actions.
- Every new quiz question content file lives in `src/content/quizzes/` and must export a `readonly` array with all four locales (pt, en, es, fr).
- Market (BR/US/EU/GB) determines the payment provider — never derive market from locale.
- State machine transitions (`assertTransition`) must be respected for sessions and orders.
- Webhook handlers must be idempotent: check `payment_events(provider, provider_event_id)` unique constraint before fulfilling.
- The `dictionaries.ts` i18n file must be kept in sync across all four locales for every new key.
- Do not add `any`, `@ts-ignore`, or `@ts-expect-error` to suppress type errors — fix the types properly.
- Do not skip, delete, or weaken existing tests to make them pass.

## Before creating something new

Search for an existing:

- service (`src/features/*/`)
- abstraction (`src/lib/`)
- scoring module (`src/features/scoring/`)
- question content (`src/content/quizzes/`)
- UI component (`src/components/`)
- API route (`src/app/api/`)

Prefer reuse over invention.

## After modifying code

1. Run `pnpm typecheck`.
2. Run `pnpm test` (unit tests run without a database).
3. Run `pnpm build` to confirm no compilation errors.
4. Review the diff — verify no unrelated files were changed.
5. Confirm no secret, PII, or scoring key was exposed to the client bundle.
