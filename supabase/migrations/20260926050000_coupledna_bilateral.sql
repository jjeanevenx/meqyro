-- CoupleDNA Bilateral Tables and Catalog Expansion for 7 Quizzes

create table meqyro.couple_invites (
  id uuid primary key default gen_random_uuid(),
  invite_code text not null unique check (invite_code ~ '^[A-Z0-9_-]{6,32}$'),
  initiator_session_id uuid not null references meqyro.quiz_sessions(id) on delete cascade,
  partner_session_id uuid references meqyro.quiz_sessions(id) on delete set null,
  status text not null default 'PENDING' check (status in ('PENDING', 'ACCEPTED', 'COMPLETED', 'EXPIRED')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index couple_invites_code_idx on meqyro.couple_invites (invite_code);
create index couple_invites_initiator_idx on meqyro.couple_invites (initiator_session_id);

create table meqyro.couple_consents (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid not null references meqyro.couple_invites(id) on delete cascade,
  session_id uuid not null references meqyro.quiz_sessions(id) on delete cascade,
  can_share_comparison boolean not null default true,
  consented_at timestamptz not null default now(),
  unique (invite_id, session_id)
);

create index couple_consents_invite_idx on meqyro.couple_consents (invite_id);

-- RLS setup
alter table meqyro.couple_invites enable row level security;
alter table meqyro.couple_consents enable row level security;

revoke all on meqyro.couple_invites from public, anon, authenticated;
revoke all on meqyro.couple_consents from public, anon, authenticated;

grant select, insert, update, delete on meqyro.couple_invites to service_role;
grant select, insert, update, delete on meqyro.couple_consents to service_role;

-- Catalog Expansion: CareerFit, MoneyDNA, FocusStyle, DecisionDNA, CoupleDNA
insert into meqyro.quizzes (slug, product_code, active)
values
  ('careerfit', 'CAREERFIT', true),
  ('moneydna', 'MONEYDNA', true),
  ('focusstyle', 'FOCUSSTYLE', true),
  ('decisiondna', 'DECISIONDNA', true),
  ('coupledna', 'COUPLEDNA', true)
on conflict (slug) do update set active = true;

-- Quiz Versions
insert into meqyro.quiz_versions (quiz_id, version, scoring_version, status, published_at)
select id, 'v1.0.0', 'v1', 'PUBLISHED', now()
from meqyro.quizzes
where slug in ('careerfit', 'moneydna', 'focusstyle', 'decisiondna', 'coupledna')
on conflict (quiz_id, version) do update set status = 'PUBLISHED';

-- Regional Prices for the 5 Quizzes
insert into meqyro.product_prices (quiz_id, market, currency, amount, active)
select q.id, m.market, m.currency, m.amount, true
from meqyro.quizzes q
cross join (
  values
    ('BR', 'BRL', 1490),
    ('US', 'USD', 399),
    ('EU', 'EUR', 399),
    ('GB', 'GBP', 349)
) as m(market, currency, amount)
where q.slug in ('careerfit', 'moneydna', 'focusstyle', 'decisiondna', 'coupledna')
on conflict (quiz_id, market, currency) do update set amount = excluded.amount, active = true;
