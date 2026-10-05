---
inclusion: always
---

# Meqyro — Code Conventions

## Non-negotiable rules

### server-only modules
Every file in `src/features/` must begin with:
```ts
import "server-only";
```

### Path alias
Always use `@/` instead of relative paths:
```ts
import { getDictionary } from "@/lib/i18n/dictionaries"; // correct
import { getDictionary } from "../../../lib/i18n/dictionaries"; // wrong
```

### TypeScript
- `strict: true` is active — never use `any`, `@ts-ignore`, or `@ts-expect-error` to suppress errors.
- Use `readonly` arrays/objects for immutable data.

### Supabase client
- Mutations and feature services → `createSupabaseSecretClient()` (service role).
- Never use the anon client for DB mutations.
- Custom schema is `meqyro` — use `.schema("meqyro")` where needed.

### Route Handler validation
All request bodies must be validated with Zod before processing:
```ts
const parsed = schema.safeParse(body);
if (!parsed.success) return NextResponse.json({ error: "...", details: parsed.error.format() }, { status: 400 });
```

### Logging
Use `logEvent()` from `src/lib/observability/logger.ts` — never `console.log/error` directly. It auto-redacts sensitive keys.

### Prices / amounts
Always in **minor currency units** (integer cents). Use `formatMoney()` from `src/lib/market/prices.ts` for display.

### State transitions
Always call `assertTransition()` from `src/lib/domain/states.ts` before updating a status column.

### Security comparisons
Always use `timingSafeEqual` for token/hash comparisons — never `===`.

### i18n strings
When adding a new dictionary key: add it for **all four locales** (pt, en, es, fr) in the same change. TypeScript enforces completeness.

### Scoring functions
Pure functions only — no DB, no HTTP, no side effects. Must throw `InvalidQuizSubmissionError` for invalid input. Add deterministic golden-fixture tests.

### CSS
Global CSS in `src/app/globals.css` using BEM-like class naming. No Tailwind, no CSS Modules, no CSS-in-JS.

## Full documentation
→ `docs/ai/CONVENTIONS.md`
