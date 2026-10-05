DO $migration$ BEGIN
-- Buyer identity is inherited only after validating an existing session token.
alter table meqyro.quiz_sessions add column if not exists buyer_id uuid not null default gen_random_uuid();
create index if not exists quiz_sessions_buyer_idx on meqyro.quiz_sessions(buyer_id);
-- Preserve independent purchases so refunding one does not remove another.
drop index if exists meqyro.result_access_grants_session_product_unique;
create unique index if not exists result_access_grants_free_unique on meqyro.result_access_grants(session_id, product_code, grant_type) where order_id is null;
create table if not exists meqyro.report_deliveries (
  order_id uuid not null references meqyro.orders(id) on delete restrict,
  session_id uuid not null references meqyro.quiz_sessions(id) on delete cascade,
  sent_at timestamptz,
  message_id text,
  last_attempt_at timestamptz,
  primary key(order_id, session_id)
);
alter table meqyro.report_deliveries enable row level security;
revoke all on meqyro.report_deliveries from public, anon, authenticated;
grant select, insert, update, delete on meqyro.report_deliveries to service_role;
insert into meqyro.report_deliveries(order_id,session_id,sent_at,message_id)
select id,session_id,confirmation_email_sent_at,confirmation_email_message_id from meqyro.orders where confirmation_email_sent_at is not null
on conflict do nothing;
create or replace function meqyro.complete_payment(
  p_order_id uuid,
  p_provider_payment_id text,
  p_product_codes text[],
  p_paid_at timestamptz default timezone('utc', now())
)
returns table(already_fulfilled boolean)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_order meqyro.orders%rowtype;
begin
  select * into v_order
  from meqyro.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'order_not_found';
  end if;

  if v_order.status = 'FULFILLED' then
    return query select true;
    return;
  end if;

  if v_order.status not in ('PENDING', 'PROCESSING', 'PAID', 'CANCELLED') then
    raise exception 'invalid_order_state:%', v_order.status;
  end if;

  insert into meqyro.result_access_grants (
    session_id,
    lead_id,
    order_id,
    product_code,
    grant_type
  )
  select
    v_order.session_id,
    v_order.lead_id,
    v_order.id,
    product_code,
    'PREMIUM_REPORT'
  from (select distinct unnest(p_product_codes) as product_code) products
  on conflict (order_id, product_code, grant_type) where order_id is not null do nothing;

  update meqyro.orders
  set status = 'FULFILLED',
      provider_payment_id = coalesce(p_provider_payment_id, provider_payment_id),
      paid_at = coalesce(paid_at, p_paid_at),
      fulfilled_at = coalesce(fulfilled_at, p_paid_at),
      updated_at = timezone('utc', now())
  where id = p_order_id;

  update meqyro.payment_attempts
  set status = 'CONFIRMED',
      updated_at = timezone('utc', now())
  where order_id = p_order_id
    and status <> 'CONFIRMED';

  return query select false;
end;
$$;

revoke all on function meqyro.complete_payment(uuid, text, text[], timestamptz)
  from public, anon, authenticated;
grant execute on function meqyro.complete_payment(uuid, text, text[], timestamptz)
  to service_role;



create or replace function meqyro.pending_report_deliveries(p_limit integer default 5, p_session_id uuid default null)
returns table(session_id uuid, order_id uuid)
language sql security invoker set search_path = '' as $queue$
  select candidate.session_id, candidate.order_id from (
    select distinct on (s.id) s.id as session_id, g.order_id, s.completed_at
    from meqyro.quiz_sessions s
    join meqyro.quiz_versions v on v.id = s.quiz_version_id
    join meqyro.quizzes q on q.id = v.quiz_id
    join meqyro.quiz_sessions purchase on purchase.buyer_id = s.buyer_id
    join meqyro.result_access_grants g on g.session_id = purchase.id and g.product_code = q.product_code
    join meqyro.orders o on o.id = g.order_id and o.status = 'FULFILLED'
    left join meqyro.report_deliveries d on d.order_id = g.order_id and d.session_id = s.id
    where s.status = 'COMPLETED' and exists(select 1 from meqyro.results r where r.session_id = s.id)
      and g.grant_type in ('PREMIUM_REPORT','PREMIUM_BUNDLE') and g.created_at > now() - interval '24 months'
      and d.sent_at is null
      and (p_session_id is not null or d.last_attempt_at is null or d.last_attempt_at < now() - interval '5 minutes')
      and (p_session_id is null or s.id = p_session_id or exists (
        select 1 from meqyro.couple_invites ci where ci.status <> 'EXPIRED' and
          ((ci.initiator_session_id = s.id and ci.partner_session_id = p_session_id) or
           (ci.partner_session_id = s.id and ci.initiator_session_id = p_session_id))))
    order by s.id, g.created_at desc
  ) candidate order by candidate.completed_at asc limit greatest(1, least(p_limit, 50));
$queue$;
revoke all on function meqyro.pending_report_deliveries(integer,uuid) from public, anon, authenticated;
grant execute on function meqyro.pending_report_deliveries(integer,uuid) to service_role;
create unique index if not exists couple_invites_active_initiator_unique on meqyro.couple_invites(initiator_session_id) where status <> 'EXPIRED';
create unique index if not exists couple_invites_active_partner_unique on meqyro.couple_invites(partner_session_id) where partner_session_id is not null and status <> 'EXPIRED';
END $migration$;


