---
inclusion: always
---

# Meqyro — Architecture

## Style

Feature-sliced modular monolith inside Next.js App Router. No separate backend process. All server logic runs as Route Handlers and React Server Components.

## Data flow

```
Browser
  │ HTTP
  ▼
Next.js App Router (src/app/)
  ├── Server Components     read-only fetching, page rendering
  ├── Route Handlers        /api/* — mutations, webhooks, checkout
  └── Client Components     QuizRunner, checkout form, lead capture
        │ fetch()
        ▼
    Route Handlers
        │
        ▼
  Feature Services (src/features/* — all server-only)
        │
        ├── Supabase secret client → Postgres (meqyro schema)
        ├── Stripe REST API
        ├── InfinitePay REST API
        └── Resend REST API
```

## Scoring pipeline (critical)

```
Client submits option IDs / Likert values
  → POST /api/sessions/[id]/answers  (saves to DB)
  → POST /api/sessions/[id]/complete (no body needed)
        │
        ▼
  Server loads questions + answers from DB
  Calls scoring/[quiz].ts pure function
  Stores result JSON in results table
  Returns PartialResultSummary (no correct answers)
```

The client never sends a score. The server always recalculates from raw answers.

## Session identity (no auth)

- 256-bit random token in `HttpOnly` cookie `meqyro_session`
- SHA-256 hash stored in `quiz_sessions.access_token_hash`
- All sensitive endpoints use `timingSafeEqual` for comparison
- No user accounts, no JWT, no OAuth

## State machines

Transitions must always go through `assertTransition()` from `src/lib/domain/states.ts`:

```
Session:  CREATED → IN_PROGRESS → COMPLETED | EXPIRED
Order:    CREATED → PENDING → FULFILLED → REFUNDED
Grant:    PENDING → ACTIVE → REVOKED
```

## Webhook idempotency

`payment_events(provider, provider_event_id)` unique constraint.  
Postgres `23505` error = duplicate webhook = no-op, not an error.

## Full documentation

→ `docs/ai/ARCHITECTURE.md`
