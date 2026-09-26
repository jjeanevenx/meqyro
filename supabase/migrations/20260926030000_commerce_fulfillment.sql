-- Migration: Commerce & Fulfillment (Phase 4)
-- All tables are kept inside the private 'meqyro' schema with RLS enabled.

create table if not exists meqyro.orders (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references meqyro.quiz_sessions(id) on delete cascade,
  lead_id uuid references meqyro.leads(id) on delete set null,
  order_number text not null unique,
  status text not null default 'CREATED', -- 'CREATED', 'PENDING', 'PAID', 'FULFILLED', 'FAILED', 'EXPIRED', 'REFUNDED'
  amount integer not null, -- Minor units (e.g. 1290 for R$ 12,90)
  currency text not null, -- 'BRL', 'USD', 'EUR', 'GBP'
  market text not null, -- 'BR', 'US', 'EU', 'GB'
  payment_provider text not null, -- 'infinitepay', 'stripe'
  customer_email text not null,
  paid_at timestamptz,
  fulfilled_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists orders_session_id_idx on meqyro.orders(session_id);
create index if not exists orders_lead_id_idx on meqyro.orders(lead_id);
create index if not exists orders_status_idx on meqyro.orders(status);
create index if not exists orders_number_idx on meqyro.orders(order_number);

create table if not exists meqyro.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references meqyro.orders(id) on delete cascade,
  product_code text not null, -- 'BRAINRANK', 'PERSONALITY_MAP', etc.
  quiz_id uuid references meqyro.quizzes(id) on delete restrict,
  amount integer not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists order_items_order_id_idx on meqyro.order_items(order_id);

create table if not exists meqyro.payment_attempts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references meqyro.orders(id) on delete cascade,
  provider text not null, -- 'infinitepay', 'stripe'
  provider_attempt_id text,
  status text not null default 'CREATED', -- 'CREATED', 'REDIRECTED', 'CONFIRMED', 'FAILED', 'EXPIRED'
  checkout_url text,
  raw_response jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists payment_attempts_order_id_idx on meqyro.payment_attempts(order_id);
create index if not exists payment_attempts_provider_idx on meqyro.payment_attempts(provider, provider_attempt_id);

create table if not exists meqyro.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null, -- 'infinitepay', 'stripe'
  provider_event_id text not null,
  event_type text not null,
  order_id uuid references meqyro.orders(id) on delete set null,
  status text not null default 'RECEIVED', -- 'RECEIVED', 'VERIFIED', 'PROCESSED', 'REJECTED'
  payload jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  constraint payment_events_provider_event_unique unique (provider, provider_event_id)
);

create index if not exists payment_events_order_id_idx on meqyro.payment_events(order_id);
create index if not exists payment_events_status_idx on meqyro.payment_events(status);

create table if not exists meqyro.refunds (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references meqyro.orders(id) on delete restrict,
  amount integer not null,
  reason text not null,
  provider_refund_id text,
  status text not null default 'PROCESSED',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists refunds_order_id_idx on meqyro.refunds(order_id);

-- Enable RLS on all Phase 4 commerce tables
alter table meqyro.orders enable row level security;
alter table meqyro.order_items enable row level security;
alter table meqyro.payment_attempts enable row level security;
alter table meqyro.payment_events enable row level security;
alter table meqyro.refunds enable row level security;

-- Enforce strict boundaries: zero grants for public, anon, authenticated
revoke all on all tables in schema meqyro from public, anon, authenticated;
revoke all on all sequences in schema meqyro from public, anon, authenticated;

grant select, insert, update, delete on all tables in schema meqyro to service_role;
grant usage on schema meqyro to service_role;
