# Folder Structure

## Root

```
meqyro/
├── src/                   All application source code
├── tests/                 All test files (unit + integration)
├── supabase/              DB migrations, seed SQL, local Supabase config
├── scripts/               Build-time scripts (seed generation, smoke tests)
├── docs/                  Project documentation
│   └── ai/                AI agent knowledge base (this directory)
├── public/                Static assets served by Next.js
├── .github/               GitHub workflows and Copilot instructions
├── AGENTS.md              Root agent instruction file
├── next.config.ts         Next.js configuration (security headers, etc.)
├── package.json           npm scripts and dependencies
├── pnpm-workspace.yaml    pnpm workspace config (single-package monorepo)
├── tsconfig.json          TypeScript configuration
├── vitest.config.ts       Vitest test runner configuration
├── eslint.config.mjs      ESLint flat config
└── .env.example           Environment variable template (no real secrets)
```

## `src/app/` — Next.js App Router

```
src/app/
├── page.tsx               Root page: detects locale, redirects to /{locale}
├── layout.tsx             Root layout (sets html lang, global CSS)
├── globals.css            Global CSS (design tokens, layout, component styles)
├── robots.ts              Robots.txt generation
├── sitemap.ts             Sitemap generation (all public routes × 4 locales)
├── manifest.ts            Web App Manifest
├── icon.svg               Favicon
│
├── [locale]/              Locale-scoped pages (pt, en, es, fr)
│   ├── layout.tsx         Sets html lang attribute
│   ├── page.tsx           Home page (hero, how-it-works, FAQ)
│   ├── discover/          Quiz catalog page (7 cards)
│   ├── quizzes/
│   │   ├── brainrank/     BrainRank-specific landing (separate route)
│   │   └── [slug]/        Generic quiz landing + play pages
│   │       ├── page.tsx   Quiz detail/landing page
│   │       └── play/
│   │           └── page.tsx  Quiz runner (Server Component shell)
│   ├── results/
│   │   └── [token]/       Direct result access via recovery token
│   ├── checkout/          Checkout flow (client component)
│   │   ├── page.tsx
│   │   ├── success/
│   │   ├── pending/
│   │   └── failed/
│   ├── couple/            CoupleDNA bilateral flow pages
│   ├── admin/             Admin interface (protected by ADMIN_API_SECRET)
│   ├── articles/          Content/blog pages
│   ├── legal/             Terms, privacy policy
│   ├── cookies/           Cookie policy
│   ├── privacy/           LGPD/GDPR data request pages
│   ├── contact/
│   └── unsubscribe/
│
└── api/                   Route Handlers (server-only, no UI)
    ├── sessions/          Quiz session lifecycle (POST create, GET, POST answers, POST complete, GET result)
    ├── checkout/          Order creation + payment provider redirect
    ├── webhooks/          stripe/ payment event handler
    ├── leads/             Email capture
    ├── orders/            Order status lookup
    ├── couple/            CoupleDNA invite creation and status
    ├── analytics/         Funnel event ingestion
    ├── referrals/         Referral link creation
    ├── privacy/           Data request + unsubscribe endpoints
    ├── admin/             Internal metrics and operations
    ├── cron/              Reconciliation jobs
    └── health/            Health check
```

**Allowed in `src/app/`:** pages, layouts, route handlers, metadata exports.  
**Not allowed in `src/app/`:** business logic, DB queries, scoring functions, payment logic. These belong in `src/features/`.

## `src/features/` — Domain feature modules

Each feature is a self-contained module. All files must include `import "server-only"` at the top (they are never imported by client components directly — only through Route Handlers or Server Components).

```
src/features/
├── analytics/             Funnel event recording, property sanitization
├── commerce/              Payment flow: orders, fulfillment, webhooks, reconciliation
│   └── adapters/          StripeAdapter (implement PaymentProvider)
├── couple/                CoupleDNA invite creation, partner linking, bilateral comparison
├── email/                 All transactional emails via Resend API
├── experiments/           Feature flags, deterministic A/B bucketing
├── privacy/               Lead capture, consent, data requests, unsubscribe, LGPD/GDPR
├── quiz-engine/           Session start/resume, answer persistence, score dispatch, recovery
├── referrals/             Referral link generation and conversion tracking
├── results/               Protected result access, paywall offer builder, premium report
└── scoring/               Pure scoring functions (no I/O, no DB, no HTTP)
```

**Allowed:** service functions, DB queries via `createSupabaseSecretClient()`, calls to external APIs.  
**Not allowed:** UI rendering, direct HTTP responses, importing client-only code.

## `src/content/` — Static quiz content

```
src/content/
├── experiences.ts         Catalog: slug, brand, title, description, duration, items count (all 4 locales)
└── quizzes/
    ├── brainrank.ts        24 questions, 4 options each, isCorrect flag, all 4 locales
    ├── personality-map.ts  40 statements, direction (DIRECT/REVERSE), all 4 locales
    ├── careerfit.ts        24 statements, CareerFitDimension, all 4 locales
    ├── moneydna.ts         20 statements, MoneyArchetype, all 4 locales
    ├── coupledna.ts        20 statements, CoupleDimension, all 4 locales
    ├── decisiondna.ts      4 scenarios, options with style mapping, all 4 locales
    └── focusstyle.ts       20 statements, FocusStyleType, all 4 locales
```

**Allowed:** static `readonly` question/option arrays. No async. No DB.  
**Not allowed:** dynamic data, DB imports, server-only imports.

## `src/components/` — React components

```
src/components/
├── patterns/              Composite, feature-aware components
│   ├── quiz-runner.tsx    Main quiz interaction (client, manages state machine)
│   ├── question-renderers/ SINGLE_CHOICE and LIKERT renderers
│   ├── result-view.tsx    Free + premium result display
│   ├── lead-capture-card.tsx  Email capture form
│   ├── site-header.tsx    Navigation header with language selector
│   ├── brainrank-hero.tsx BrainRank featured section on home page
│   └── locale-market-selector.tsx  Language + market picker
└── ui/                    Primitive, stateless components
    ├── button.tsx
    ├── button-link.tsx
    ├── input.tsx
    └── progress-bar.tsx
```

**Allowed:** `"use client"` directives, React state, fetch calls to `/api/*`.  
**Not allowed:** importing from `features/` (server-only modules), direct DB access, payment logic.

## `src/lib/` — Shared infrastructure

```
src/lib/
├── config/
│   └── env.ts             getSiteUrl(), getTokenSecuritySecret() — validated env access
├── domain/
│   └── states.ts          State machines: SessionState, OrderState, GrantState, assertTransition()
├── i18n/
│   ├── config.ts          locales array, Locale type, localeFromAcceptLanguage()
│   └── dictionaries.ts    Complete UI strings for all 4 locales
├── market/
│   ├── market-context.ts  Market/country/currency/provider resolution
│   └── prices.ts          Product prices per market, bundle definitions, formatMoney()
├── observability/
│   └── logger.ts          logEvent() with automatic PII/secret redaction
├── security/
│   └── anonymous-session.ts  Token creation, hashing, cookie options
└── supabase/
    ├── server.ts           createSupabaseServerClient() (anon), createSupabaseSecretClient() (service role)
    ├── env.ts              Validates NEXT_PUBLIC_SUPABASE_* env vars
    └── server-env.ts       Validates SUPABASE_SECRET_KEY
```

**Allowed:** pure utility functions, type definitions, infrastructure configuration.  
**Not allowed:** business logic, direct feature imports, UI code.

## `tests/`

```
tests/
├── setup.ts               Vitest global setup (env vars for tests)
├── mocks/
│   └── server-only.ts     Mocks the "server-only" package for unit test environments
├── unit/                  Fast unit tests, no DB required
└── integration/           DB integration tests (require local Supabase — skipped in CI without DB)
```

## `supabase/`

```
supabase/
├── config.toml            Local Supabase project config (project_id: meqyro, schema: meqyro)
├── migrations/            SQL migration files (numbered, chronological)
├── seed.sql               Generated seed data (do not edit manually — use scripts/build-seed-sql.ts)
└── snippets/              SQL snippets for development reference
```

**The seed.sql is generated by `pnpm tsx scripts/build-seed-sql.ts`. Edit content in `src/content/quizzes/` instead.**
