# Meqyro — Operations & Maintenance Runbook

**Version:** 1.0  
**Last Updated:** 2026-09-26  
**Status:** Operational Production Guide

---

## 1. Overview & Architecture

Meqyro operates on a secure, server-driven architecture where all session lifecycle management, cognitive scoring, pricing resolution, and privacy rights are handled strictly server-side.

All automated background routines execute via the reconciliation service (`src/features/commerce/reconciliation-service.ts`) and are orchestrated via scheduled jobs calling the protected endpoint:

```http
POST /api/cron/reconcile
Authorization: Bearer <CRON_SECRET>
```

---

## 2. Automated Operational Routines

The reconciliation endpoint triggers `runFullReconciliationSuite()`, which runs 4 critical maintenance tasks in sequence under distributed locking (`meqyro.operational_locks`):

### 2.1 Reconcile Unfulfilled Paid Orders

- **Condition:** Orders with `paid_at IS NOT NULL` and `status != 'FULFILLED'`.
- **Action:** Provisions the corresponding `PREMIUM_REPORT` grants in `meqyro.result_access_grants` (expanding bundle items if applicable) and transitions order status to `FULFILLED`.
- **Purpose:** Heals any orders where network interruption occurred between payment confirmation and entitlement fulfillment.

### 2.2 Reconcile Stale Pending Orders

- **Condition:** Orders in `PENDING` status for more than 24 hours without gateway confirmation.
- **Action:** Marks order status as `FAILED` (expired) and records an audit log.

### 2.3 Expire Stale Anonymous Sessions

- **Condition:** Sessions in `CREATED` status older than 72 hours without completion.
- **Action:** Marks session status as `EXPIRED` to prevent dangling records.

### 2.4 Purge Expired Security Tokens

- **Condition:** Recovery tokens in `recovery_tokens` where `expires_at < NOW()`, or verified data requests past their retention period.
- **Action:** Purges or revokes tokens, preventing token replay attacks.

---

## 3. Distributed Locking & Concurrency Protection

To prevent concurrent cron workers from double-fulfilling orders or clashing on database updates, each routine acquires a row-level distributed lock in `meqyro.operational_locks` before execution:

- Lock table: `meqyro.operational_locks (lock_name, locked_until, owner)`
- Maximum lease time: 10 minutes (auto-expires if a worker crashes).
- If lock cannot be acquired, the worker logs `operational_lock_busy` and safely exits without error.

---

## 4. Administrative Dashboard & Metrics Inspection

Internal technical overview is accessible at:

```http
GET /[locale]/admin?token=<ADMIN_API_SECRET>
```

And programmatic metrics via:

```http
GET /api/admin/metrics
x-admin-token: <ADMIN_API_SECRET>
```

### Security Gates:

- Both the UI and API enforce constant-time cryptographic verification (`timingSafeEqual`) against `ADMIN_API_SECRET`.
- Endpoints fail-closed with HTTP `401 Unauthorized` if unauthenticated or if the secret is unconfigured.
- Admin pages are marked with `robots: { index: false, follow: false }` and excluded from `sitemap.xml`.
- Customer emails are redacted or excluded from administrative metrics.

---

## 5. LGPD & GDPR Privacy Requests (Self-Service)

User data requests are initiated at `/[locale]/privacy/data-request` and confirmed via a cryptographically secured one-time magic link at:

```http
GET /[locale]/privacy/data-request/confirm?token=<SECURE_TOKEN>
```

### Supported Rights:

1. **EXPORT (Data Portability):**
   - Packages all associated quiz sessions, completed results, and consent logs into a structured JSON file.
   - Strictly omits third-party data or internal security secrets.
   - Made available directly in the user's browser session.

2. **DELETION (Right to be Forgotten):**
   - Anonymizes lead email (`anonymized-<uuid>@deleted.local`) and IP hashes.
   - Hard-deletes non-essential quiz answers and session inputs.
   - Preserves immutable financial tax records (`orders`) with redacted personal details as legally required.
   - Revokes active access grants.

3. **RECTIFICATION:**
   - Registers corrected information and appends an immutable entry to `audit_events`.

---

## 6. Local vs. Production Environments

| Component           | Local Verification                 | Production Deployment                  |
| ------------------- | ---------------------------------- | -------------------------------------- |
| **Database**        | Local Supabase (`127.0.0.1:54321`) | Supabase Cloud (Managed PostgreSQL)    |
| **Payments**        | Deterministic adapter signatures   | Live Stripe & InfinitePay accounts     |
| **Email**           | Local log emission                 | Resend API (`RESEND_API_KEY`)          |
| **Cron Scheduling** | Manual curl / Vitest integration   | Vercel Cron or GitHub Actions workflow |
