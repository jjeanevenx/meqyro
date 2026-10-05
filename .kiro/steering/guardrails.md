---
inclusion: always
---

# Meqyro — Guardrails

Critical rules every agent must respect. Full lists in `docs/ai/DO_NOT_DO.md` and `docs/ai/SECURITY.md`.

## Architecture

- DO NOT move scoring logic out of `src/features/scoring/` or to the client.
- DO NOT import `src/features/*` from client components — they are server-only.
- DO NOT bypass `assertTransition()` when updating session or order status.
- DO NOT introduce a new architectural layer, ORM, UI library, or i18n library.
- DO NOT reorganize folders without an explicit request.

## Security

- DO NOT hardcode secrets. DO NOT put secrets in `NEXT_PUBLIC_*` variables.
- DO NOT accept `price` or `amount` from the client request body in checkout — always resolve server-side.
- DO NOT skip `timingSafeEqual` for token comparison.
- DO NOT create any client-side path that grants or checks premium access without a DB round-trip.
- DO NOT disable webhook signature verification.
- DO NOT log full email addresses, raw tokens, or payment amounts.
- DO NOT derive market (payment provider) from locale.

## Data

- DO NOT edit `supabase/seed.sql` manually — regenerate from `src/content/quizzes/`.
- DO NOT edit existing migration files — always create a new one.
- DO NOT store raw IP addresses — always hash with `hashIp()`.

## Quiz content & scoring

- DO NOT change `isCorrect` / `correctOptionId` values without documenting the change.
- DO NOT leave any quiz question without all four locale translations (pt, en, es, fr).
- DO NOT add duplicate `stableKey` values within a quiz.
- DO NOT change scoring logic without an entry in `docs/ai/DECISIONS.md`.

## Code quality

- DO NOT use `any`, `@ts-ignore`, or `@ts-expect-error`.
- DO NOT add `.skip` or `.only` to hide failing tests.
- DO NOT weaken test assertions to make tests pass.
- DO NOT use `console.log/error` — use `logEvent()`.

## Scope

- DO NOT refactor code unrelated to the current task.
- DO NOT upgrade transitive dependencies as a side effect.
- DO NOT install Stripe SDK, Resend SDK, Prisma, Drizzle, shadcn/ui, or any i18n library.

## Full documentation
→ `docs/ai/DO_NOT_DO.md`
→ `docs/ai/SECURITY.md`
