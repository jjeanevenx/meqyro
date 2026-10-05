# Code Conventions

## TypeScript

- `strict: true` is in effect. Do not suppress errors with `any`, `@ts-ignore`, or `@ts-expect-error`.
- Use `readonly` arrays and objects for immutable data (see `brainRankQuestions: readonly BrainRankQuestionDef[]`).
- Use `const` assertions (`as const`) on tuple/literal types.
- Prefer `type` over `interface` for simple shapes; use `interface` when declaration merging is needed (it isn't, in this project).
- Return typed objects, not inferred-only types, from functions that are part of a service contract.

## Server-only enforcement

Every file in `src/features/` and `src/lib/supabase/` must start with:

```ts
import "server-only";
```

This causes a build error if the module is accidentally imported by a client component.

## Module aliases

The `@/` path alias points to `src/`. Use it everywhere instead of relative paths:

```ts
// Correct
import { getDictionary } from "@/lib/i18n/dictionaries";

// Wrong
import { getDictionary } from "../../../lib/i18n/dictionaries";
```

## Supabase client usage

| Context                                                    | Client                         | How to obtain                                                        |
| ---------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------- |
| Server Components, Route Handlers (reading session cookie) | `createSupabaseServerClient()` | `import { createSupabaseServerClient } from "@/lib/supabase/server"` |
| Feature services, all mutations, scoring                   | `createSupabaseSecretClient()` | `import { createSupabaseSecretClient } from "@/lib/supabase/server"` |

- **Always** use the secret client for any DB mutation.
- Never expose the service role key or use it client-side.
- The custom schema is `meqyro`. When querying outside this schema (e.g. `analytics_events`), use `.schema("meqyro")` on the client.

## Zod validation in Route Handlers

All Route Handlers validate their request body with Zod before processing:

```ts
const schema = z.object({ ... });
const parsed = schema.safeParse(body);
if (!parsed.success) {
  return NextResponse.json({ error: "...", details: parsed.error.format() }, { status: 400 });
}
```

Never process an unvalidated request body.

## Error handling in Route Handlers

Return structured JSON errors, never raw exception messages:

```ts
// Correct
return NextResponse.json({ error: "Session not found" }, { status: 404 });

// Wrong — leaks internals
return NextResponse.json({ error: err.message }, { status: 500 });
```

For unexpected errors, log with `logEvent("error", ...)` and return a generic message.

## Logging

Use `logEvent()` from `src/lib/observability/logger.ts` — never `console.log/error` directly. It auto-redacts keys matching `authorization|cookie|email|password|secret|token`.

```ts
logEvent("info", "event_name", { orderId, amount });
logEvent("error", "event_name", { errorMessage });
```

Do not log full email addresses, raw tokens, or payment details.

## i18n dictionary

When adding a new UI string:

1. Add it to the `Dictionary` type in `src/lib/i18n/dictionaries.ts`.
2. Add the string for **all four locales** (pt, en, es, fr) in the same commit.
3. Never leave a locale key missing — it will cause a TypeScript error.

Parameterized strings use `{placeholder}` syntax (e.g. `"Question {current} of {total}"`). Replace at render time with string replacement — there is no i18n interpolation library.

## Quiz content

When adding or editing questions:

1. Edit the appropriate file in `src/content/quizzes/`.
2. Every question must have `prompt` in all four locales.
3. BrainRank questions must have exactly 4 options with exactly 1 `isCorrect: true`.
4. Stable keys must be unique within a quiz (e.g. `BR_PAT_01`, `PM_OPN_01`).
5. After changing content, regenerate `supabase/seed.sql` via `pnpm tsx scripts/build-seed-sql.ts` and run `pnpm test` to verify content integrity tests pass.

## Scoring functions

```ts
// Pattern: pure function, no I/O
export const myScoringV1: ScoringContract<TItem, TResult> = {
  quizSlug: "myquiz",
  quizVersion: "1.0",
  scoringVersion: "1.0",
  score(items, answers) {
    // ...
    return result;
  },
};
```

- Scoring functions are **pure** — no DB calls, no HTTP, no side effects.
- They must throw `InvalidQuizSubmissionError` for invalid input (wrong count, duplicate answers, unrecognized question IDs).
- Add deterministic golden-fixture tests in `tests/unit/golden-scoring.test.ts` for every new scoring path.

## State machine transitions

Always use `assertTransition()` before updating state:

```ts
assertTransition("order", currentStatus, "FULFILLED", orderTransitions);
await supabase.from("orders").update({ status: "FULFILLED" }).eq("id", orderId);
```

Never update a state column without calling `assertTransition` first.

## Security-sensitive comparisons

Always use `timingSafeEqual` for token/hash comparisons to prevent timing attacks:

```ts
const actualBuf = Buffer.from(hash, "hex");
const expectedBuf = Buffer.from(storedHash, "hex");
if (actualBuf.length !== expectedBuf.length || !timingSafeEqual(actualBuf, expectedBuf)) {
  throw new UnauthorizedError();
}
```

## API routes

- File location: `src/app/api/[path]/route.ts`
- Each method is a named export: `export async function GET(req, ctx)`, `export async function POST(req, ctx)`.
- Dynamic segments in the URL use `params: Promise<{ id: string }>` — always `await params` before accessing.
- Include `x-request-id` in error responses for traceability.

## Components

- Client components use `"use client"` as the first line.
- Server components have no directive (default in App Router).
- Do not import `src/features/` modules directly in client components — they are server-only. Client components fetch data through `/api/*` routes.
- CSS is global (in `globals.css`) using BEM-like class naming. No CSS modules, no Tailwind, no CSS-in-JS.

## Prices / amounts

Amounts are always in **minor units** (integer cents):

- BRL 12.90 → `1290`
- USD 2.99 → `299`

Use `formatMoney(amount, currency, locale)` from `src/lib/market/prices.ts` to format for display. Never format amounts inline.

## Package management

- Use `pnpm` only. Never use `npm install` or `yarn add`.
- Pin exact versions when adding dependencies.
- Verify the dependency is not already available before adding it.
