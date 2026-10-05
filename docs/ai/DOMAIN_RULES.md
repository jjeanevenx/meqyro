# Domain Rules

## Core entities

### Quiz (`quizzes` table)

- Has a `slug` (URL-safe identifier) and a `product_code` (billing identifier, e.g. `BRAINRANK`).
- Has one or more `quiz_versions`; only versions with status `APPROVED` or `PUBLISHED` are used to start sessions.

### QuizVersion (`quiz_versions` table)

- Pinned combination of `version` + `scoring_version`.
- Each version has its own set of `questions`.
- Scoring functions are versioned separately from quiz content.

### QuizSession (`quiz_sessions` table)

- Created anonymously on first question navigation.
- Identified by a 256-bit opaque token stored in an `HttpOnly` cookie; only the SHA-256 hash is stored in DB.
- Has a TTL of 30 days (`expires_at`).
- Transitions: `CREATED → IN_PROGRESS → COMPLETED` (terminal) or `CREATED/IN_PROGRESS → EXPIRED` (terminal).

**Session state machine** (from `src/lib/domain/states.ts`):

```
CREATED → IN_PROGRESS → COMPLETED
        ↘                ↗
          EXPIRED (terminal)
```

### Answer (`answers` table)

- One row per question per session; upserted (not inserted) to allow answer changes.
- Stores `option_id` (for SINGLE_CHOICE/SCENARIO) or `numeric_value` (1–5 for LIKERT).
- Never stores which answer is "correct" — that mapping lives in `questions.scoring_value` and is only read server-side at completion time.

### Result (`results` table)

- Created exactly once per session at completion.
- Stores the full computed score as a JSONB `score` column.
- If a session is already `COMPLETED` and a result exists, the completion endpoint returns the existing result — it does **not** recalculate.

### Order (`orders` table)

**Order state machine:**

```
CREATED → PENDING → PAID → FULFILLED → REFUNDED
        ↘         ↘      ↗
          FAILED    CANCELLED → FULFILLED (special case)
          CANCELLED
          EXPIRED
```

- `CREATED` → payment provider checkout session created → `PENDING`.
- `PENDING` → webhook confirms payment → `FULFILLED` (skipping PAID when direct fulfillment).
- `FULFILLED` is the only terminal success state that grants premium access.
- Price is resolved server-side from `product_prices` table or `BUNDLE_PRICES` constant — never from the request body.

### ResultAccessGrant (`result_access_grants` table)

- Created by `fulfillOrder()` after payment confirmation.
- `grant_type = 'PREMIUM_REPORT'` unlocks premium content for a session.
- Grants are revoked on refund via `refundOrder()`.

**Grant state machine:**

```
PENDING → ACTIVE → REVOKED (terminal)
        ↘
          REVOKED (terminal)
```

### Lead (`leads` table)

- Created when a user submits their email.
- Stores normalized email and consent flags separately (`transactional_consent`, `promotional_consent`).
- `transactional_consent` is required to send the result email.
- `promotional_consent` is optional and must be separately granted — providing email does not imply marketing consent.

## Scoring rules

### BrainRank

- 24 items across 6 dimensions (4 items each): `PATTERN_RECOGNITION`, `LOGICAL_REASONING`, `NUMERICAL_REASONING`, `ATTENTION`, `PROBLEM_SOLVING`, `SPEED`.
- `overallScore = round(1000 × rawCorrect / 24)` — scale of 0–1000.
- `dimensionScores[dim] = round(100 × correct_in_dim / 4)` — scale of 0–100.
- `strongestDimension` ties are broken by: 1) most HARD correct, 2) fastest median response time (≥2000ms samples only), 3) blueprint order.
- Requires exactly 24 unique answers with no duplicates.

### Personality Map (Big Five)

- 40 items across 5 dimensions (8 each): `OPENNESS`, `CONSCIENTIOUSNESS`, `EXTRAVERSION`, `AGREEABLENESS`, `EMOTIONAL_STABILITY`.
- Each item is `DIRECT` or `REVERSE`; reverse items are scored as `6 − value`.
- `dimensionScore = round(25 × (mean − 1))` — scale of 0–100.
- `uniformResponseWarning = true` when ≥36/40 responses use the same Likert value.

### CareerFit

- 24 items across 6 dimensions: `TECHNICAL`, `MANAGERIAL`, `CREATIVE`, `AUTONOMOUS`, `SECURITY`, `CAUSE`.
- `dimensionScore = round(((mean − 1) / 4) × 100)` — scale of 0–100.
- `primaryAnchor` and `secondaryAnchor` are the top two scoring dimensions.

### MoneyDNA

- 20 items across 5 archetypes: `BUILDER`, `GUARDIAN`, `STRATEGIST`, `ADVENTURER`, `BALANCER`.
- Same normalization as CareerFit: `round(((mean − 1) / 4) × 100)`.
- `dominantArchetype` + `secondaryArchetype` are top two.

### FocusStyle

- 20 items across 4 styles: `IMMERSIVE_HYPERFOCUS`, `MODULAR_SERIAL`, `COLLABORATIVE`, `REACTIVE_SPRINT`.
- Same normalization formula.

### DecisionDNA

- 4 scenario-based items; each option maps to a style: `ANALYTICAL`, `INTUITIVE`, `PRAGMATIC`, `COLLABORATIVE`.
- Score is a distribution of chosen styles as percentages.
- `dominantStyle` is the most-chosen style.

### CoupleDNA (individual)

- 20 items across 5 dimensions: `COMMUNICATION`, `LIFE_VALUES`, `CONFLICT_MANAGEMENT`, `FINANCES`, `FUTURE_PLANS`.
- Same normalization as CareerFit.

### CoupleDNA (bilateral comparison)

- Requires both partners to have completed their individual sessions AND given `consentsGiven = true`.
- `dimensionAlignment[dim] = max(0, 100 − abs(scoreA[dim] − scoreB[dim]))`.
- `overallAlignmentPercentage = round(sum(alignments) / 5)`.
- `strongestAlignment` = highest-aligning dimension; `growthDialogueArea` = lowest.

## Market determination rules

The market determines the payment provider and currency:

- `BR` → Stripe, BRL
- `US` → Stripe, USD
- `EU` → Stripe, EUR
- `GB` → Stripe, GBP

Resolution priority:

1. Explicit `meqyro_market` cookie (user preference, set on checkout).
2. Country from geolocation header (if available).
3. Default to `US` (never derive from locale).

**Locale ≠ Market.** A user with locale `pt` may be in Portugal (EU market) or Brazil (BR market). A user with locale `fr` may be in France (EU), Canada (US), or anywhere else.

## Consent rules (LGPD / GDPR)

- `transactional_consent` must be true to send any email related to the user's own data (result link, purchase confirmation).
- `promotional_consent` is always separate and optional.
- A data deletion request removes all personal data and revokes premium grants.
- Data requests require email verification before execution.
- IP addresses are never stored raw — always SHA-256 hashed with `TOKEN_SECURITY_SECRET` salt.

## CoupleDNA bilateral rules

- An invite link is valid for 14 days.
- Both sessions must be `COMPLETED` before comparison is available.
- Comparison is only unlocked if `consentsGiven = true` (both partners explicitly agreed).
- Partner A cannot see Partner B's individual scores — only the bilateral comparison metrics.
- Session tokens from A cannot be used to access B's session.

## Pricing rules

- Individual quiz prices are stored in the `product_prices` DB table (market + quiz_id → amount + currency).
- Bundle prices are defined as constants in `src/lib/market/prices.ts` (`BUNDLE_PRICES`).
- The server **always** resolves price from DB or constants — never from the client request body.
- Amounts are stored and processed in **minor currency units** (cents): BRL 12.90 = `1290`.

## Webhook idempotency rules

- On receiving a payment webhook, the handler inserts a row into `payment_events` with the provider's stable event ID.
- The `(provider, provider_event_id)` pair has a unique constraint.
- A duplicate webhook returns `{ handled: true, duplicate: true }` — no double-fulfillment.
- Amount and currency in the webhook are validated against the stored order values. Mismatches are rejected and logged.
