# Tech Stack

All versions confirmed from `package.json` and lock files unless noted.

## Runtime & language

| Technology | Version | Purpose |
|---|---|---|
| Node.js | ≥22 (CI uses 24) | Server runtime |
| TypeScript | 6.0.3 | Primary language |
| pnpm | 11.19.0 | Package manager |

## Framework

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.3.6 | Full-stack framework — App Router, RSC, Route Handlers |
| React | 19.3.0 | UI rendering |
| react-dom | 19.3.0 | DOM rendering |

> **Important:** This is Next.js 16, not 13/14/15. API surfaces may differ from common training data. Read `node_modules/next/dist/docs/` before using any Next.js API.

## Database & backend-as-a-service

| Technology | Version | Purpose |
|---|---|---|
| Supabase | local + hosted | Postgres host, auth-free RLS, realtime (unused) |
| @supabase/supabase-js | 2.117.1 | Supabase JS client |
| @supabase/ssr | 0.12.7 | SSR-aware Supabase client for Next.js |
| PostgreSQL | via Supabase | Primary database; custom schema `meqyro` |

## Validation

| Technology | Version | Purpose |
|---|---|---|
| Zod | 4.6.5 | Runtime schema validation in Route Handlers |

## UI / icons

| Technology | Version | Purpose |
|---|---|---|
| lucide-react | 1.48.0 | Icon components |

> **No UI component library** (no shadcn/ui, Radix, Chakra, MUI, etc.). All components are written from scratch in `src/components/`.

## Payment providers

| Technology | Purpose |
|---|---|
| Stripe API (REST, no SDK) | International payments (US/EU/GB) |
| InfinitePay API (REST, no SDK) | Brazilian payments (PIX + credit card) |

> Payment providers are called via raw `fetch()` — there is **no Stripe SDK or InfinitePay SDK installed**.

## Email

| Technology | Purpose |
|---|---|
| Resend API (REST, no SDK) | Transactional email — called via raw `fetch()` |

> No `resend` npm package installed. Emails are plain text only (no HTML templates currently).

## Testing

| Technology | Version | Purpose |
|---|---|---|
| Vitest | 5.0.1 | Test runner for unit and integration tests |

> No Playwright, Cypress, or other E2E framework installed. No React Testing Library.

## Build & tooling

| Technology | Version | Purpose |
|---|---|---|
| ESLint | 9.39.5 | Linting (flat config in `eslint.config.mjs`) |
| eslint-config-next | 16.3.6 | Next.js ESLint rules |
| Prettier | 3.9.9 | Code formatting (config in `.prettierrc.json`) |
| supabase CLI | 2.117.0 (devDep) | Local Supabase instance management |

## Security primitives

All cryptographic operations use Node.js built-in `node:crypto`:
- `randomBytes` — token generation
- `createHmac` — webhook signature verification (Stripe, InfinitePay)
- `createHash` — session token hashing, IP hashing
- `timingSafeEqual` — constant-time comparison to prevent timing attacks

## CI/CD

- GitHub Actions (`.github/workflows/ci.yml`)
- Pipeline: `format:check → lint → typecheck → test → build → smoke`
- Runs on every PR and on pushes to `main`

## Environment variables

See `.env.example` for the full list. Key categories:
- `NEXT_PUBLIC_SUPABASE_*` — public, browser-safe
- `SUPABASE_SECRET_KEY` — service role key, server-only
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — server-only
- `INFINITEPAY_API_KEY`, `INFINITEPAY_WEBHOOK_SECRET` — server-only
- `RESEND_API_KEY`, `EMAIL_FROM` — server-only
- `TOKEN_SECURITY_SECRET` — HMAC salt for tokens and IP hashes, server-only
- `ADMIN_API_SECRET` — protects `/api/admin/*` and `/[locale]/admin`
- `CRON_SECRET` — protects `/api/cron/*`
- `NEXT_PUBLIC_SITE_URL` — canonical base URL

## What is NOT in the stack

The following are explicitly absent — do not introduce them:

- No ORM (Prisma, Drizzle, TypeORM) — raw Supabase client only
- No state management library (Redux, Zustand, Jotai) — React `useState` only
- No i18n library (next-intl, react-i18next) — custom dictionary system
- No UI component library (shadcn/ui, Radix, MUI, Chakra) — custom components
- No HTTP client library (axios) — native `fetch()` only
- No Stripe SDK — raw REST calls
- No Resend SDK — raw REST calls
- No email template library (React Email, MJML) — plain text only
- No GraphQL — REST API routes only
- No WebSockets / Realtime — not in use
- No server-side caching layer (Redis) — Supabase DB only (RATE_LIMIT_BACKEND=db)
