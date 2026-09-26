-- Migration: Leads, Consents, Tokens, Privacy Requests & Result Grants (Phase 3)
-- All tables are kept inside the private 'meqyro' schema with RLS enabled.

create table if not exists meqyro.leads (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references meqyro.quiz_sessions(id) on delete set null,
  email text not null,
  email_normalized text not null,
  locale text not null,
  market text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists leads_email_normalized_idx on meqyro.leads(email_normalized);
create index if not exists leads_session_id_idx on meqyro.leads(session_id);

create table if not exists meqyro.consents (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references meqyro.leads(id) on delete cascade,
  consent_type text not null, -- 'TRANSACTIONAL_RESULTS', 'MARKETING_PROMOTIONAL'
  granted boolean not null,
  policy_version text not null,
  ip_hash text,
  user_agent text,
  source text not null default 'lead_capture',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists consents_lead_id_idx on meqyro.consents(lead_id);
create index if not exists consents_type_idx on meqyro.consents(consent_type, granted);

create table if not exists meqyro.unsubscribe_tokens (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references meqyro.leads(id) on delete cascade,
  token_hash text not null unique,
  used_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists unsubscribe_tokens_hash_idx on meqyro.unsubscribe_tokens(token_hash);

create table if not exists meqyro.recovery_tokens (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references meqyro.quiz_sessions(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists recovery_tokens_hash_idx on meqyro.recovery_tokens(token_hash);
create index if not exists recovery_tokens_session_idx on meqyro.recovery_tokens(session_id);

create table if not exists meqyro.data_requests (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references meqyro.leads(id) on delete set null,
  email text not null,
  email_normalized text not null,
  request_type text not null, -- 'EXPORT', 'RECTIFICATION', 'DELETION'
  status text not null default 'PENDING', -- 'PENDING', 'IN_PROGRESS', 'FULFILLED', 'REJECTED'
  details jsonb,
  verification_token_hash text,
  verified_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz
);

create index if not exists data_requests_email_normalized_idx on meqyro.data_requests(email_normalized);
create index if not exists data_requests_status_idx on meqyro.data_requests(status);

create table if not exists meqyro.result_access_grants (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references meqyro.quiz_sessions(id) on delete cascade,
  lead_id uuid references meqyro.leads(id) on delete set null,
  product_code text not null,
  grant_type text not null default 'FREE_PARTIAL', -- 'FREE_PARTIAL', 'PREMIUM_REPORT', 'PREMIUM_BUNDLE'
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists result_access_grants_session_idx on meqyro.result_access_grants(session_id);
create index if not exists result_access_grants_product_idx on meqyro.result_access_grants(product_code);

-- Enable Row Level Security on all Phase 3 tables
alter table meqyro.leads enable row level security;
alter table meqyro.consents enable row level security;
alter table meqyro.unsubscribe_tokens enable row level security;
alter table meqyro.recovery_tokens enable row level security;
alter table meqyro.data_requests enable row level security;
alter table meqyro.result_access_grants enable row level security;

-- Enforce strict permission boundaries:
revoke all on all tables in schema meqyro from public, anon, authenticated;
revoke all on all sequences in schema meqyro from public, anon, authenticated;

grant select, insert, update, delete on all tables in schema meqyro to service_role;
grant usage on schema meqyro to service_role;
