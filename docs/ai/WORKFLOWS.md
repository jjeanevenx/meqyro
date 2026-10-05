# Development Workflows

## Prerequisites

- Node.js ≥ 22
- pnpm 11.19.0 (`corepack enable` or install directly)
- Supabase CLI (installed as a devDependency via pnpm)
- Docker (required for local Supabase instance)

## Environment setup

1. Copy `.env.example` to `.env.local`.
2. Fill in required values — see `.env.example` for descriptions.
3. For local development, the Supabase local values are pre-filled in `.env.example`.

**Never commit `.env.local` or any file containing real secrets.**

## Install dependencies

```bash
pnpm install
```

## Start local Supabase

```bash
pnpm supabase start
```

This starts a local Postgres + PostgREST + Auth stack via Docker. The first run pulls images and may take a few minutes.

After starting, apply migrations:

```bash
pnpm supabase db reset
```

This applies all migrations from `supabase/migrations/` and runs `supabase/seed.sql`.

## Regenerate seed SQL

The `supabase/seed.sql` is generated from `src/content/quizzes/`. After editing quiz content:

```bash
pnpm tsx scripts/build-seed-sql.ts
```

Then reset the local DB to apply the new seed:

```bash
pnpm supabase db reset
```

## Start development server

```bash
pnpm dev
```

Runs `next dev` on `http://localhost:3000`. The root URL redirects to `/{locale}` based on the browser's `Accept-Language` header.

## Quality checks (run before committing)

```bash
# Format check (does not modify files)
pnpm format:check

# Auto-format (modifies files)
pnpm format

# Lint
pnpm lint

# Type check
pnpm typecheck

# Unit + integration tests
pnpm test

# Production build
pnpm build

# All of the above in sequence
pnpm check
```

## Run tests

```bash
# Run all tests once
pnpm test

# Watch mode during development
pnpm test:watch

# Run a specific file
pnpm vitest run tests/unit/scoring.test.ts
```

Unit tests run without a database (mocked or in-memory). Integration tests require a running local Supabase instance — they are skipped (marked with `.skip`) when the DB is unavailable.

## Smoke test

```bash
pnpm smoke
```

Runs `scripts/smoke.mjs` — a lightweight post-build check that hits key API endpoints. Requires the dev or production server to be running.

## CI pipeline

The GitHub Actions pipeline (`.github/workflows/ci.yml`) runs on every PR and push to `main`:

```
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm smoke
```

All steps must pass. The pipeline uses Node.js 24 and pnpm 11.19.0.

## Database migrations

Create a new migration:

```bash
pnpm supabase migration new <migration_name>
```

This creates a new timestamped file in `supabase/migrations/`. Write SQL in that file and apply it:

```bash
pnpm supabase db reset   # local only — resets and re-applies all migrations
```

For production, use `pnpm supabase db push` (requires Supabase project credentials).

**Never modify existing migration files** — always create a new one.

## Adding a new quiz

1. Create `src/content/quizzes/<slug>.ts` with the question array.
2. Create `src/features/scoring/<slug>.ts` with the scoring function.
3. Add scoring dispatch in `completeQuizSession()` in `src/features/quiz-engine/session-service.ts`.
4. Add fallback quiz builder in `getFallbackPublicQuiz()` in `src/features/quiz-engine/repository.ts`.
5. Add the quiz to `VALID_SLUGS` in both `src/app/[locale]/quizzes/[slug]/page.tsx` and `play/page.tsx`.
6. Add entry to `src/content/experiences.ts`.
7. Add i18n metadata to `dictionaries.ts` under the `quizzes` key.
8. Regenerate seed SQL (`pnpm tsx scripts/build-seed-sql.ts`).
9. Add scoring tests to `tests/unit/golden-scoring.test.ts`.
10. Add content integrity assertions to `tests/unit/content-integrity.test.ts`.

## Adding a new i18n string

1. Add the key and type to the `Dictionary` type in `src/lib/i18n/dictionaries.ts`.
2. Add values for **all four locales** (pt, en, es, fr).
3. Run `pnpm typecheck` to confirm no locale is missing.
4. The `i18n-dictionary-completeness.test.ts` test validates structural completeness automatically.

## Environment variable checklist

| Variable | Required for | Server/Client |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | All DB operations | Client (browser-safe) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Anon DB client | Client (browser-safe) |
| `NEXT_PUBLIC_SITE_URL` | Email links, SEO canonical | Client (browser-safe) |
| `SUPABASE_SECRET_KEY` | All server mutations | Server only |
| `TOKEN_SECURITY_SECRET` | Token HMAC, IP hashing | Server only |
| `STRIPE_SECRET_KEY` | Stripe checkout | Server only |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification | Server only |
| `INFINITEPAY_API_KEY` | InfinitePay checkout | Server only |
| `INFINITEPAY_WEBHOOK_SECRET` | InfinitePay webhook verification | Server only |
| `RESEND_API_KEY` | Email sending | Server only |
| `EMAIL_FROM` | Email sender address | Server only |
| `ADMIN_API_SECRET` | Admin routes | Server only |
| `CRON_SECRET` | Cron routes | Server only |
