-- Migration: CoupleDNA Multi-Invite
-- Decisions: D-001 (couple_invite_slots), D-003 (COUPLEDNA_INVITE product),
--            D-005 (pricing), D-006 (expiry), D-007 (host_name_for_guest)
-- Refs: P0-DB-01 through P0-DB-06, P0-FEAT-07

-- ============================================================
-- Part 1: couple_invite_slots table
-- D-001, D-007: One row per individual invite slot purchased by a host.
-- ============================================================

create table meqyro.couple_invite_slots (
  id                          uuid          primary key default gen_random_uuid(),
  host_session_id             uuid          not null references meqyro.quiz_sessions(id) on delete cascade,
  order_id                    uuid          references meqyro.orders(id) on delete restrict,
  invite_code                 text          unique,
  guest_session_id            uuid          references meqyro.quiz_sessions(id) on delete set null,
  host_name_for_guest         text,
  slot_number                 integer       not null,
  status                      text          not null default 'PENDING_PAYMENT'
                                check (status in (
                                  'PENDING_PAYMENT',
                                  'ACTIVE',
                                  'REDEEMED',
                                  'QUIZ_STARTED',
                                  'COMPLETED',
                                  'EXPIRED',
                                  'CANCELLED',
                                  'REVOKED'
                                )),
  price_amount                integer       not null check (price_amount > 0),
  price_currency              text          not null check (price_currency in ('BRL', 'USD', 'EUR', 'GBP')),
  stripe_checkout_session_id  text,
  pending_expires_at          timestamptz,
  activated_at                timestamptz,
  expires_at                  timestamptz,
  redeemed_at                 timestamptz,
  completed_at                timestamptz,
  created_at                  timestamptz   not null default now(),
  updated_at                  timestamptz   not null default now()
);

create index couple_invite_slots_host_idx
  on meqyro.couple_invite_slots (host_session_id);

create index couple_invite_slots_guest_idx
  on meqyro.couple_invite_slots (guest_session_id)
  where guest_session_id is not null;

create index couple_invite_slots_code_idx
  on meqyro.couple_invite_slots (invite_code)
  where invite_code is not null;

create index couple_invite_slots_order_idx
  on meqyro.couple_invite_slots (order_id)
  where order_id is not null;

create index couple_invite_slots_stripe_idx
  on meqyro.couple_invite_slots (stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;

create unique index couple_invite_slots_host_slot_unique
  on meqyro.couple_invite_slots (host_session_id, slot_number);

-- ============================================================
-- Part 2: updated_at trigger for couple_invite_slots
-- ============================================================

create or replace function meqyro.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := timezone('utc', now());
  return new;
end;
$$;

revoke all on function meqyro.set_updated_at() from public, anon, authenticated;
grant execute on function meqyro.set_updated_at() to service_role;

create trigger couple_invite_slots_updated_at
  before update on meqyro.couple_invite_slots
  for each row
  execute function meqyro.set_updated_at();

-- ============================================================
-- Part 3: RLS for couple_invite_slots
-- P0-DB-06: service_role bypasses RLS but still needs explicit grants.
-- ============================================================

alter table meqyro.couple_invite_slots enable row level security;
revoke all on meqyro.couple_invite_slots from public, anon, authenticated;
grant select, insert, update, delete on meqyro.couple_invite_slots to service_role;

-- ============================================================
-- Part 4: Add couple_invite_slot_id to orders
-- D-001: Circular FK is safe — both sides are nullable.
--   orders.couple_invite_slot_id -> couple_invite_slots.id (nullable)
--   couple_invite_slots.order_id -> orders.id              (nullable)
-- P0-DB-02: Link each order to its invite slot.
-- ============================================================

alter table meqyro.orders
  add column couple_invite_slot_id uuid references meqyro.couple_invite_slots(id) on delete restrict;

create index orders_invite_slot_idx
  on meqyro.orders (couple_invite_slot_id)
  where couple_invite_slot_id is not null;

-- Prevent duplicate active orders for the same slot.
-- Does NOT replace orders_active_purchase_unique (guards traditional products).
create unique index orders_invite_slot_active_unique
  on meqyro.orders (couple_invite_slot_id)
  where couple_invite_slot_id is not null
    and status in ('CREATED', 'PROCESSING', 'PENDING', 'PAID', 'FULFILLED');

-- ============================================================
-- Part 4b: Patch orders_active_purchase_unique to allow multiple COUPLEDNA_INVITE rows
-- The existing index ON (session_id, product_code) would block a second
-- COUPLEDNA_INVITE order for the same session. We recreate it excluding
-- COUPLEDNA_INVITE (which is guarded instead by orders_invite_slot_active_unique).
-- ============================================================

drop index if exists meqyro.orders_active_purchase_unique;

create unique index orders_active_purchase_unique
  on meqyro.orders (session_id, product_code)
  where product_code is not null
    and product_code <> 'COUPLEDNA_INVITE'
    and status in ('CREATED', 'PROCESSING', 'PENDING', 'PAID', 'FULFILLED');

-- ============================================================
-- Part 5: Drop couple_invites_active_initiator_unique
-- D-001, P0-DB-03: Remove constraint that prevented >1 active invite per
-- initiator_session_id. couple_invite_slots now owns capacity enforcement.
-- couple_invites_active_partner_unique is preserved (still valid).
-- ============================================================

drop index if exists meqyro.couple_invites_active_initiator_unique;

-- ============================================================
-- Part 6: Add invite_slot_id to couple_consents
-- P0-DB-04: Link consent records to their specific slot
-- (nullable — legacy consents remain valid).
-- ============================================================

alter table meqyro.couple_consents
  add column invite_slot_id uuid references meqyro.couple_invite_slots(id) on delete set null;

create index couple_consents_slot_idx
  on meqyro.couple_consents (invite_slot_id)
  where invite_slot_id is not null;

-- ============================================================
-- Part 7: Quiz entry and product prices for COUPLEDNA_INVITE
-- D-001, D-003, D-005, P0-FEAT-07:
-- Register COUPLEDNA_INVITE as a quiz/product in the catalog.
-- Prices are identical to COUPLEDNA base price (P).
-- Additional invite price P/3 is calculated at runtime, not stored here.
-- ============================================================

insert into meqyro.quizzes (slug, product_code, active)
values ('coupledna-invite', 'COUPLEDNA_INVITE', true)
on conflict (slug) do update set product_code = excluded.product_code, active = true;

insert into meqyro.quiz_versions (quiz_id, version, scoring_version, status, published_at)
select id, 'v1.0.0', 'v1', 'PUBLISHED', now()
from meqyro.quizzes
where slug = 'coupledna-invite'
on conflict (quiz_id, version) do update set status = 'PUBLISHED';

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
where q.slug = 'coupledna-invite'
on conflict (quiz_id, market, currency) do nothing;
