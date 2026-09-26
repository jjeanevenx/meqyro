create schema if not exists meqyro;
revoke all on schema meqyro from public, anon, authenticated;

create type meqyro.content_status as enum ('DRAFT', 'REVIEWED', 'APPROVED', 'PUBLISHED', 'ARCHIVED');

create table meqyro.quizzes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  product_code text not null unique,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table meqyro.quiz_versions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references meqyro.quizzes(id) on delete restrict,
  version text not null,
  scoring_version text not null,
  status meqyro.content_status not null default 'DRAFT',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (quiz_id, version)
);

create table meqyro.product_prices (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references meqyro.quizzes(id) on delete restrict,
  market text not null check (market in ('BR', 'US', 'EU', 'GB')),
  currency text not null check (currency in ('BRL', 'USD', 'EUR', 'GBP')),
  amount integer not null check (amount > 0),
  active boolean not null default false,
  created_at timestamptz not null default now(),
  unique (quiz_id, market, currency)
);

alter table meqyro.quizzes enable row level security;
alter table meqyro.quiz_versions enable row level security;
alter table meqyro.product_prices enable row level security;

revoke all on all tables in schema meqyro from public, anon, authenticated;
revoke all on all sequences in schema meqyro from public, anon, authenticated;

alter default privileges in schema meqyro revoke all on tables from public, anon, authenticated;
alter default privileges in schema meqyro revoke all on sequences from public, anon, authenticated;
alter default privileges in schema meqyro revoke execute on functions from public, anon, authenticated;

comment on schema meqyro is 'Private application schema. Access through trusted server routes only.';
