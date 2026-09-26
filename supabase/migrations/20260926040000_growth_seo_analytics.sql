-- Growth, SEO, Analytics, Safe Referrals and Experiments
create table meqyro.analytics_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references meqyro.quiz_sessions(id) on delete set null,
  event_name text not null check (event_name ~ '^[a-z0-9_]{3,64}$'),
  quiz_slug text,
  locale text check (locale in ('pt', 'en', 'es', 'fr')),
  market text check (market is null or market in ('BR', 'US', 'EU', 'GB')),
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index analytics_events_name_idx on meqyro.analytics_events (event_name, created_at desc);
create index analytics_events_session_idx on meqyro.analytics_events (session_id) where session_id is not null;

create table meqyro.referrals (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[a-zA-Z0-9_-]{4,32}$'),
  creator_session_id uuid references meqyro.quiz_sessions(id) on delete set null,
  quiz_slug text not null,
  locale text not null check (locale in ('pt', 'en', 'es', 'fr')),
  clicks_count integer not null default 0 check (clicks_count >= 0),
  conversions_count integer not null default 0 check (conversions_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index referrals_code_idx on meqyro.referrals (code);

-- Attribution tracking on sessions and orders
alter table meqyro.quiz_sessions add column if not exists referral_code text;
alter table meqyro.orders add column if not exists referral_code text;

create table meqyro.experiments (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z0-9_]{3,64}$'),
  variants jsonb not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS setup
alter table meqyro.analytics_events enable row level security;
alter table meqyro.referrals enable row level security;
alter table meqyro.experiments enable row level security;

revoke all on meqyro.analytics_events from public, anon, authenticated;
revoke all on meqyro.referrals from public, anon, authenticated;
revoke all on meqyro.experiments from public, anon, authenticated;

grant select, insert, update, delete on meqyro.analytics_events to service_role;
grant select, insert, update, delete on meqyro.referrals to service_role;
grant select, insert, update, delete on meqyro.experiments to service_role;
