---
inclusion: always
---

# Meqyro — Tech Stack

## Core

| Technology           | Version                   |
| -------------------- | ------------------------- |
| Next.js (App Router) | **16.3.6** — not 13/14/15 |
| React                | 19.3.0                    |
| TypeScript           | 6.0.3                     |
| Node.js              | ≥22 (CI: 24)              |
| pnpm                 | 11.19.0                   |

> **Read `node_modules/next/dist/docs/` before using any Next.js API** — this version may differ from training data.

## Data & backend

| Technology            | Notes                                             |
| --------------------- | ------------------------------------------------- |
| Supabase (Postgres)   | Custom schema `meqyro`, RLS on all tables         |
| @supabase/supabase-js | 2.117.1                                           |
| @supabase/ssr         | 0.12.7                                            |
| Zod                   | 4.6.5 — request body validation in Route Handlers |

## Key absences — do not introduce these

- ❌ No ORM (Prisma, Drizzle) — use Supabase client directly
- ❌ No UI library (shadcn/ui, MUI, Radix) — custom components only
- ❌ No i18n library (next-intl, react-i18next) — custom dictionary
- ❌ No Stripe SDK — raw `fetch()` to Stripe REST API
- ❌ No Resend SDK — raw `fetch()` to Resend REST API
- ❌ No state management (Redux, Zustand) — React `useState` only
- ❌ No axios — native `fetch()` only

## Testing

| Technology | Version |
| ---------- | ------- |
| Vitest     | 5.0.1   |

No Playwright, Cypress, or React Testing Library.

## Tooling

ESLint 9 (flat config) · Prettier 3.9.9 · CI via GitHub Actions

## Full documentation

→ `docs/ai/TECH_STACK.md`
