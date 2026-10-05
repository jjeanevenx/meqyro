---
inclusion: always
---

# Meqyro — Folder Structure

## Key directories and their rules

### `src/app/` — routes and pages
Pages, layouts, Route Handlers only. No business logic, no DB queries.

### `src/features/` — server-only domain modules
Every file must start with `import "server-only"`. Contains all DB access, scoring dispatch, payment logic, email, analytics, privacy. Never imported by client components.

### `src/content/quizzes/` — static quiz content
One `readonly` array per quiz with all questions and all 4 locale strings. No async, no DB, no server imports. After editing, regenerate `supabase/seed.sql` via `pnpm tsx scripts/build-seed-sql.ts`.

### `src/features/scoring/` — pure scoring functions
One file per quiz. Pure functions only — no I/O, no DB, no HTTP. Implement `ScoringContract<TItem, TResult>`.

### `src/components/patterns/` — composite UI components
Client components (`"use client"`). Fetch data via `/api/*` routes. Never import `src/features/` directly.

### `src/components/ui/` — primitive components
Stateless, generic building blocks (Button, Input, ProgressBar).

### `src/lib/` — shared infrastructure
Supabase clients, i18n config/dictionaries, market context, state machines, logger, security utils. No business logic. Never imports from `src/features/`.

### `tests/unit/` — fast tests, no DB
Run in CI without external services.

### `tests/integration/` — DB tests
Require local Supabase. Skipped when DB unavailable.

### `supabase/migrations/` — SQL migrations
Never edit existing files. Always create a new migration.

## Dependency direction

```
app/ → features/ → lib/
       features/ → content/
       components/ → lib/i18n, features/*/contracts (types only)
```

`lib/` never imports from `features/` or `app/`.

## Full documentation

→ `docs/ai/STRUCTURE.md`
