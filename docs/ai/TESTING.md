# Testing

## Framework

**Vitest 5.0.1** — configured in `vitest.config.ts`.

No Playwright, Cypress, React Testing Library, or Jest. E2E browser automation is not set up.

## Test location

```
tests/
├── setup.ts               Global setup: sets test env vars (avoids "missing secret" errors)
├── mocks/
│   └── server-only.ts     Replaces "server-only" package so server modules can be imported in tests
├── unit/                  No database required
└── integration/           Require local Supabase (skipped without DB)
```

## Path alias

The `@/` alias is configured in `vitest.config.ts` to resolve to `src/`. Use it in test imports.

The `"server-only"` package is mocked to a no-op so feature service modules can be imported and tested without the Next.js runtime.

## Unit tests (no DB required)

All unit tests in `tests/unit/` run in CI and locally without any external service.

| File | What it covers |
|---|---|
| `scoring.test.ts` | BrainRank and Personality Map golden fixtures |
| `golden-scoring.test.ts` | All 7 quiz scorers — deterministic cases |
| `content-integrity.test.ts` | Question counts, unique stableKeys, 4-locale completeness, encoding |
| `seed-builder.test.ts` | BrainRank/PM structure; also runs seed SQL generation |
| `quiz-engine.test.ts` | Fallback quiz content sanitization (no scoring keys leaked) |
| `quiz-ui-state.test.ts` | Progress calculation, state transitions, double-click lock |
| `i18n.test.ts` | `localeFromAcceptLanguage` parsing |
| `i18n-dictionary-completeness.test.ts` | All 4 locales have equal keys and non-empty strings |
| `market-context.test.ts` | Market resolution from locale/country/cookie |
| `domain.test.ts` | State machine transition rules |
| `pricing.test.ts` | Minor-unit storage, `formatMoney` output |
| `admin-auth.test.ts` | ADMIN_API_SECRET validation logic |
| `webhooks.test.ts` | Stripe and InfinitePay signature verification |
| `anonymous-session.test.ts` | Token creation, hashing, constant-time comparison |
| `session-recovery.test.ts` | Recovery token validation rules |
| `paywall-defense.test.ts` | Premium content not leaked in free tier, disclaimers present |
| `consent.test.ts` | Email normalization, masking, IP hashing |
| `observability.test.ts` | Logger PII redaction |
| `security-hardening.test.ts` | Rate limiter, security headers config |
| `growth-seo.test.ts` | Analytics sanitization, metadata builder, robots/sitemap generation |
| `quizzes-catalog.test.ts` | CareerFit, MoneyDNA, FocusStyle, DecisionDNA, CoupleDNA scorers |

## Integration tests (require local Supabase)

Tests in `tests/integration/` connect to a real local Supabase instance. They are marked with `.skip` or wrapped in guards that skip when the DB is unavailable.

| File | What it covers |
|---|---|
| `quiz-engine-db.test.ts` | Full session lifecycle: start → answer → complete |
| `all-quizzes-flow.test.ts` | E2E flow for all 7 quiz types |
| `couple-bilateral.test.ts` | CoupleDNA bilateral consent and comparison |
| `commerce.test.ts` | Order creation, fulfillment, webhook idempotency, bundles |
| `protected-result.test.ts` | Paywall enforcement, premium unlock |
| `privacy-lifecycle.test.ts` | Lead capture, consents, unsubscribe, data requests |
| `growth-seo-db.test.ts` | Analytics event persistence, referral tracking |
| `security-db.test.ts` | RLS policy audit (all tables have RLS enabled) |
| `qa-audit.test.ts` | Comprehensive adversarial verification (session forgery, price tampering, IDOR) |

## Running tests

```bash
# All tests
pnpm test

# Single file
pnpm vitest run tests/unit/scoring.test.ts

# Watch mode
pnpm test:watch
```

## Writing new tests

### Unit test structure

```ts
import { describe, it, expect } from "vitest";

describe("Module name — What it does", () => {
  it("describes the specific behavior being tested", () => {
    // arrange
    // act
    // assert
    expect(result).toBe(expected);
  });
});
```

### Scoring tests

Every new scoring function needs deterministic golden-fixture tests:
- All correct → maximum score
- All wrong / zero → minimum score
- Specific dimension dominance
- Edge cases: ties, boundary thresholds

Add to `tests/unit/golden-scoring.test.ts`.

### Content tests

Every new quiz content file needs tests in `tests/unit/content-integrity.test.ts`:
- Correct question count
- Unique stableKeys
- All 4 locales present for every question
- No encoding corruption

## Agent rule

After any code change, run `pnpm typecheck && pnpm test` before reporting the task complete. If the environment does not have a DB, unit tests (no DB) must still pass. Report which tests were skipped and why.

## Prohibited test practices

- **DO NOT** add `.skip` or `.only` to hide failing tests.
- **DO NOT** weaken assertions to make tests pass.
- **DO NOT** mock the module under test (mock its dependencies instead).
- **DO NOT** delete tests because they expose a bug — fix the bug.
- If a test is conceptually wrong, document why and fix the test logic — never just suppress it.
