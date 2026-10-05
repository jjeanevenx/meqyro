# Architecture

## Style

**Feature-sliced modular monolith** inside a Next.js App Router application.

There is no separate backend process. All server-side logic runs as Next.js Route Handlers (the equivalent of API endpoints) and React Server Components. There is no middleware file; locale detection is handled at the root page level via `Accept-Language` header parsing.

## High-level structure

```
Browser
  │  HTTP
  ▼
Next.js App Router (src/app/)
  ├── Server Components  ← read-only data fetching, page rendering
  ├── Route Handlers     ← /api/* (mutations, webhooks, checkout)
  └── Client Components  ← QuizRunner, checkout form, lead capture
         │  fetch()
         ▼
      Route Handlers
         │
         ▼
    Feature Services (src/features/*/  — all import "server-only")
         │
         ├── Supabase Secret Client (service role)
         │        │
         │        ▼
         │    Postgres (Supabase)
         │    meqyro schema + RLS policies
         │
         ├── Stripe API  (external)
         └── Resend API  (external)
```

## Module map

```
src/
├── app/                   Entry points (routes, pages, API handlers)
│
├── features/              Domain feature modules — ALL server-only
│   ├── analytics/         Funnel event recording
│   ├── commerce/          Orders, payments, fulfillment, webhooks
│   │   └── adapters/      StripeAdapter
│   ├── couple/            CoupleDNA bilateral flow
│   ├── email/             Transactional email via Resend
│   ├── experiments/       Feature flags, A/B experiment buckets
│   ├── privacy/           Consent, lead capture, data requests, LGPD/GDPR
│   ├── quiz-engine/       Session lifecycle, answer persistence, scoring dispatch
│   ├── referrals/         Referral link creation and conversion
│   ├── results/           Protected result access, paywall, premium report builder
│   └── scoring/           Pure scoring functions, one file per quiz
│
├── content/               Static quiz content (questions + translations)
│   ├── experiences.ts     Catalog metadata for all 7 quizzes
│   └── quizzes/           One file per quiz: questions, options, locale strings
│
├── components/            React components
│   ├── patterns/          Composite UI (QuizRunner, ResultView, SiteHeader…)
│   └── ui/                Primitive components (Button, Input, ProgressBar…)
│
└── lib/                   Shared infrastructure, no business logic
    ├── config/            Environment variable access (getSiteUrl, getTokenSecuritySecret)
    ├── domain/            State machines (session/order/grant transitions)
    ├── i18n/              Locale config, dictionary type, all 4 locale dictionaries
    ├── market/            Market/currency resolution, price tables
    ├── observability/     Structured logger with automatic PII redaction
    ├── security/          Anonymous session token creation/verification
    └── supabase/          Supabase client factories (server, secret)
```

## Dependency direction

```
app/  →  features/  →  lib/
         features/  →  content/
         components/  →  lib/i18n
         components/  →  features/quiz-engine/contracts  (types only)
```

**No circular dependencies. `lib/` never imports from `features/` or `app/`.**

## Key contracts

- `src/features/quiz-engine/contracts.ts` — shared types used by both server features and client components (`PublicQuiz`, `PublicQuestion`, `ActiveSession`, `PartialResultSummary`).
- `src/features/scoring/*.ts` — each exports a `*ScoringV1` object implementing `ScoringContract<TItem, TResult>`.
- `src/features/commerce/contracts.ts` — `PaymentProvider` interface implemented by `StripeAdapter`.
- `src/lib/domain/states.ts` — state machine definitions for sessions, orders, and grants.

## Scoring architecture (critical)

Scoring is **entirely server-side**. The flow:

1. Client submits answers to `/api/sessions/[id]/answers` (one at a time).
2. Client calls `/api/sessions/[id]/complete` (POST, no body needed).
3. Server loads all questions + answers from DB, constructs scoring items, calls the appropriate `*ScoringV1.score()` function.
4. Score is stored in `results` table as a JSON `score` column.
5. Client never sends a score — it only sends option IDs or numeric Likert values.

## i18n architecture

- Four locales: `pt`, `en`, `es`, `fr`. Default fallback: `en`.
- URL structure: `/{locale}/...` — locale is the first path segment.
- Language detection: `Accept-Language` header parsed in root page (`src/app/page.tsx`), redirects to `/{locale}`.
- All UI strings live in `src/lib/i18n/dictionaries.ts` as a single typed `Dictionary` object with all four locales.
- Quiz content strings (prompts, options) live in `src/content/quizzes/` per quiz.
- No third-party i18n library (next-intl, react-i18next, etc.).

## Database

Postgres via Supabase. Custom schema `meqyro` (not `public`). Row-Level Security (RLS) is enabled on all tables. The application uses the **service role key** (secret client) for all server-side operations; the anon key is only present for browser-safe env vars (never used for direct DB mutations from the browser).

## Stateless sessions (no auth)

There is no user authentication system. Sessions are identified by:

- A 256-bit random token stored in an `HttpOnly` cookie (`meqyro_session`).
- The SHA-256 hash of that token stored in the `quiz_sessions.access_token_hash` column.
- All sensitive endpoints compare the cookie token against the stored hash using `timingSafeEqual`.

## Webhook idempotency

Payment webhooks are idempotent via a unique constraint on `payment_events(provider, provider_event_id)`. A duplicate webhook insertion fails with Postgres error code `23505`; this is treated as a no-op, not an error.
