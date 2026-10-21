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

- One row per question per session. Untimed answers are upserted to allow changes. Timed BrainRank answers are final: the first submission is retained and retries return the same answer.
- Stores `option_id` (for SINGLE_CHOICE/SCENARIO) or `numeric_value` (1–5 for LIKERT).
- A timed `TIMEOUT` has neither option nor numeric value, consumes the full assigned limit and receives no credit. Its deadline and duration are validated by the database.
- Never stores which answer is "correct" — that mapping lives in `options.scoring_value` (with dimension/difficulty in `questions.scoring_key`) and is only read server-side at completion time.

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

- The original blueprint selects 24 items across 6 dimensions (4 each): `PATTERN_RECOGNITION`, `LOGICAL_REASONING`, `NUMERICAL_REASONING`, `ATTENTION`, `PROBLEM_SOLVING`, `SPEED`. Attempts with delayed recall replace three selected items, retaining 24 evaluative questions: 21 core items plus 3 separately scored recall exercises. Informational memory steps do not increase this count.
- `overallScore = round(1000 × rawCorrect / coreItemCount)` — scale of 0–1000; `coreItemCount` is 21 with recall or 24 for original attempts.
- `dimensionScores[dim] = round(100 × correct_in_dim / coreItemsInDimension)` — scale of 0–100, using the actual assigned core items.
- `strongestDimension` ties are broken by: 1) most HARD correct, 2) fastest median response time (≥2000ms samples only), 3) blueprint order.
- Completion requires all 24 assigned answers, including terminal timeouts. The core scorer requires 21 or 24 unique answers to match its items, with recall processed separately.
- Timed attempts freeze difficulty, limit and rule version at selection; default limits are EASY 30s, MEDIUM 45s, HARD 60s and VERY_HARD 90s, with a valid question override taking priority and a 45s fallback. Time does not change the accuracy score; it remains a tie-breaker among correct answers. Separate premium timing metrics do not recalculate historical results.

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

- 20 items across 5 dimensions/archetypes: `BUILDER`, `GUARDIAN`, `STRATEGIST`, `ADVENTURER`, `BALANCER`.
- **v2 (`v2.0.0`, `scoring_version = "behavioral-v2"`, `SCENARIO`):** 4 plausible options per scenario, ordered via `SCENARIO_RAMP` (`EASY` → `MEDIUM` → `HARD`). Each option maps to `{ [dimension]: 1 }`; dimension score is normalized by total exposure `round((chosen[d] / available[d]) × 100)`. The current blueprint offers BUILDER in 15 scenarios, GUARDIAN in 16, STRATEGIST in 18, ADVENTURER in 13 and BALANCER in 18. Records `observations`, `contextDependentDimensions`, `tiedDimensions`, and `evidence`.
- **v1 (`v1.0.0`, `scoring_version = "v1"`, `LIKERT` legacy):** Same normalization as CareerFit: `round(((mean − 1) / 4) × 100)`.
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
- **v2 (`v2.0.0`, `scoring_version = "behavioral-v2"`, `SCENARIO`):** 4 options per scenario along a descriptive bipolar continuum (`0..3` from individual reflection/autonomy to joint elaboration). Dimension score is `round((sum(weight) / (4 × 3)) × 100)`. Records `contextDependentDimensions`, `tiedDimensions`, and `evidence`.
- **v1 (`v1.0.0`, `scoring_version = "v1"`, `LIKERT` legacy):** Same normalization as CareerFit.

### CoupleDNA (bilateral comparison)

- Requires both partners to have completed their individual sessions AND given `consentsGiven = true`.
- **v2 (`behavioral-v2`):** `dimensionAlignments[dim] = round(100 × identical option choices / 4)` across the four shared scenarios in that topic. Different choices never cancel each other out through equal individual averages. This describes exact response agreement, not relationship quality. Reports append only the requesting participant's own choice evidence (`buildParticipantCoupleReport`).
- **v1 (`v1` legacy):** `dimensionAlignment[dim] = max(0, 100 − abs(scoreA[dim] − scoreB[dim]))`.
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
