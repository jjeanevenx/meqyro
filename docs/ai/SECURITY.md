# Security

## Authentication model

There is **no user authentication system**. Sessions are fully anonymous and identified by a 256-bit random token:

- Generated: `randomBytes(32).toString("base64url")` in `src/lib/security/anonymous-session.ts`.
- Stored client-side: `HttpOnly; Secure; SameSite=Lax` cookie named `meqyro_session`.
- Stored server-side: SHA-256 hash of the token in `quiz_sessions.access_token_hash`.
- Compared using `timingSafeEqual` on every request — prevents timing attacks.
- TTL: 30 days.

The cookie is never accessible to JavaScript. Client components identify sessions by passing the cookie automatically with `fetch()` calls to `/api/*` routes.

## Admin access

`/api/admin/*` and `/[locale]/admin` are protected by the `ADMIN_API_SECRET` environment variable. The secret must be ≥ 16 characters. Accepts the token via:
- `x-admin-token` header
- `Authorization: Bearer <token>` header
- `token` query parameter

Routes fail-closed: if `ADMIN_API_SECRET` is not set, all admin requests are rejected.

## Payment security

### Server-side price resolution

The amount charged is **never taken from the client request**. The server resolves price from:
- `product_prices` DB table (for individual quizzes)
- `BUNDLE_PRICES` constant in `src/lib/market/prices.ts` (for bundles)

Any attempt to pass a `price` or `amount` in the checkout request body is ignored.

### Webhook signature verification

Both Stripe and InfinitePay webhooks are verified using HMAC-SHA256 before any processing:

- **Stripe**: `t=<timestamp>,v1=<signature>` format; timestamps older than 300 seconds are rejected (replay attack protection); uses `timingSafeEqual`.
- **InfinitePay**: `sha256=<signature>` header format; same constant-time comparison.

Webhooks fail-closed: if the secret is not configured in production, all webhook requests throw immediately.

### Webhook idempotency

The `payment_events(provider, provider_event_id)` pair has a unique DB constraint. A second webhook with the same event ID produces a Postgres `23505` error, which the handler treats as a no-op. This prevents double-fulfillment from duplicate or delayed webhooks.

### Premium unlock via DB only

Premium content access requires a row in `result_access_grants` with `grant_type = 'PREMIUM_REPORT'`. This grant is created only by `fulfillOrder()` after webhook confirmation. There is no client-side path to create or fake a grant. The result service checks the DB on every request — there is no client-side cache of the access level.

## IDOR protection

Quiz results require the session token (cookie) to access:
- The session token must match the `access_token_hash` stored for that session.
- A user cannot access another user's result by changing a session ID in the URL.
- Recovery tokens use separate HMAC-based tokens with max-use limits.

## Row-Level Security (RLS)

All tables in the `meqyro` Postgres schema have RLS enabled. The application uses the **service role key** (bypasses RLS) only on the server. The anon key (browser-safe) cannot read or write any `meqyro` schema tables directly from the client — all mutations flow through Route Handlers with session validation.

## Secrets management

- All secrets live in environment variables only.
- `.env.local` is gitignored.
- No secret is hardcoded anywhere in the codebase.
- `NEXT_PUBLIC_*` variables are browser-safe and must never contain secrets.
- `TOKEN_SECURITY_SECRET` is the HMAC salt for tokens and IP hashing — it must be ≥ 16 characters and rotated carefully (rotating it invalidates all existing recovery tokens).

## PII handling

- Email addresses: stored normalized (lowercased, trimmed). Logged only as masked form (`u***r@domain.com`).
- IP addresses: hashed with SHA-256 + `TOKEN_SECURITY_SECRET` before storage. Raw IPs are never stored.
- Quiz answers: stored per session in the DB; not logged. Scoring input snapshots in `results.input_snapshot` contain answer IDs but not the full question text.

## Logger PII redaction

`logEvent()` in `src/lib/observability/logger.ts` automatically redacts any key matching `/authorization|cookie|email|password|secret|token/i` in the context object. Use `logEvent()` — never `console.log` — for anything that might contain sensitive fields.

## Security headers (confirmed in `next.config.ts`)

Applied to all routes (`/:path*`):

| Header | Value |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `X-Frame-Options` | `DENY` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline' ['unsafe-eval' in dev]; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https: http://127.0.0.1:*; frame-ancestors 'none'` |

`poweredByHeader: false` — removes the `X-Powered-By: Next.js` header.

## Privacy / consent

Transactional emails (result link, purchase confirmation) require explicit `transactional_consent = true`. Marketing emails require separate `promotional_consent = true`. Providing an email does not imply any consent beyond what the user explicitly checks.

## Agent security rules

- Never hardcode any secret, API key, or token.
- Never log full email addresses, raw tokens, or payment details.
- Never add client-side logic that grants or checks premium access without a DB round-trip.
- Never relax session token validation (e.g. skip `timingSafeEqual`) for convenience.
- Never expose `SUPABASE_SECRET_KEY`, `STRIPE_SECRET_KEY`, or any `*_WEBHOOK_SECRET` to the browser bundle.
- Any `NEXT_PUBLIC_*` variable is visible to all users — never put secrets there.
