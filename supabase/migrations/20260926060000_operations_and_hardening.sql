-- ==============================================================================
-- Migration: Operations, Hardening, Rate Limiting and Privacy Recovery
-- Schema: meqyro
-- ==============================================================================

-- 1. Extend data_requests with expiration and structured result payload
alter table meqyro.data_requests 
  add column if not exists expires_at timestamptz not null default (timezone('utc', now()) + interval '48 hours'),
  add column if not exists result_data jsonb;

create index if not exists data_requests_expires_at_idx on meqyro.data_requests(expires_at);

-- 2. Extend recovery_tokens with usage tracking and revocation
alter table meqyro.recovery_tokens
  add column if not exists usage_count int not null default 0,
  add column if not exists max_uses int not null default 5,
  add column if not exists revoked_at timestamptz;

-- 3. Extend orders with lookup_token_hash for secure status queries
alter table meqyro.orders
  add column if not exists lookup_token_hash text;

create index if not exists orders_lookup_token_hash_idx on meqyro.orders(lookup_token_hash);

-- 4. Shared Atomic Rate Limits table for distributed/serverless environments
create table if not exists meqyro.rate_limits (
  key text primary key,
  count int not null default 1,
  expires_at timestamptz not null
);

create index if not exists rate_limits_expires_at_idx on meqyro.rate_limits(expires_at);

-- 5. Operational distributed lock to prevent concurrent scheduled jobs
create table if not exists meqyro.operational_locks (
  job_name text primary key,
  locked_at timestamptz not null default timezone('utc', now()),
  locked_by text not null
);

-- 6. Audit log table for LGPD/GDPR actions, admin operations and reconciliations
create table if not exists meqyro.audit_events (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  actor text not null,
  details jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists audit_events_action_idx on meqyro.audit_events(action);
create index if not exists audit_events_created_at_idx on meqyro.audit_events(created_at);

-- 7. Ensure Row Level Security is enabled on all newly created tables
alter table meqyro.rate_limits enable row level security;
alter table meqyro.operational_locks enable row level security;
alter table meqyro.audit_events enable row level security;

-- 8. Strict isolation: zero browser grants, only service_role access
revoke all on all tables in schema meqyro from public, anon, authenticated;
revoke all on all sequences in schema meqyro from public, anon, authenticated;

grant select, insert, update, delete on all tables in schema meqyro to service_role;
grant usage, select on all sequences in schema meqyro to service_role;
grant usage on schema meqyro to service_role;
