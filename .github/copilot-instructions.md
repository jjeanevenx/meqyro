# GitHub Copilot — Repository Instructions

Before making any architectural or implementation decision, follow the repository instructions in `/AGENTS.md`.

Detailed project knowledge is in `/docs/ai/`. Always prefer existing project patterns over introducing new abstractions or dependencies.

## Required reading before code changes

1. `/AGENTS.md` — universal agent rules and key invariants
2. `/docs/ai/DO_NOT_DO.md` — prohibited actions
3. `/docs/ai/PROJECT_CONTEXT.md` — what the system does and how it flows
4. `/docs/ai/ARCHITECTURE.md` — module boundaries and data flow

## Source of truth by topic

| Topic | Document |
|---|---|
| Architecture & module boundaries | `docs/ai/ARCHITECTURE.md` |
| Folder structure & placement rules | `docs/ai/STRUCTURE.md` |
| Libraries & versions | `docs/ai/TECH_STACK.md` |
| Business/domain rules, scoring, states | `docs/ai/DOMAIN_RULES.md` |
| Code style & patterns | `docs/ai/CONVENTIONS.md` |
| Build, test & migration commands | `docs/ai/WORKFLOWS.md` |
| Test structure & conventions | `docs/ai/TESTING.md` |
| Auth, tokens, payments, PII | `docs/ai/SECURITY.md` |
| What never to do | `docs/ai/DO_NOT_DO.md` |
| Why decisions were made | `docs/ai/DECISIONS.md` |

## Most critical rules (non-negotiable)

- All scoring logic lives in `src/features/scoring/` — pure, server-side, no I/O. Never move it client-side.
- Every file in `src/features/` must start with `import "server-only"`. Never import these from client components.
- All DB mutations use `createSupabaseSecretClient()` — never the anon client.
- Checkout price is always resolved server-side — never from the request body.
- State transitions must go through `assertTransition()` from `src/lib/domain/states.ts`.
- Token comparisons must use `timingSafeEqual` — never `===`.
- Market (BR/US/EU/GB) determines payment provider — never derive it from locale.
- New i18n keys must be added for all four locales: pt, en, es, fr.
- `supabase/seed.sql` is generated — never edit it manually.
- Do not install: Stripe SDK, Resend SDK, Prisma, Drizzle, shadcn/ui, Radix, Tailwind, any i18n library.
- Do not use `any`, `@ts-ignore`, `@ts-expect-error`, `.skip`, or `.only`.

## Validation after changes

```bash
pnpm typecheck
pnpm test
pnpm build
```

All three must pass before a change is considered complete.
