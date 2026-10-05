-- Payment readiness hardening.
-- Keeps payment truth and premium access server-side and makes fulfillment atomic.

alter table meqyro.orders
  add column if not exists product_code text,
  add column if not exists provider_checkout_id text,
  add column if not exists provider_payment_id text,
  add column if not exists expires_at timestamptz,
  add column if not exists confirmation_email_sent_at timestamptz,
  add column if not exists confirmation_email_message_id text;

update meqyro.orders o
set product_code = oi.product_code
from meqyro.order_items oi
where oi.order_id = o.id
  and o.product_code is null;

create unique index if not exists orders_active_purchase_unique
  on meqyro.orders(session_id, product_code)
  where product_code is not null
    and status in ('CREATED', 'PROCESSING', 'PENDING', 'PAID', 'FULFILLED');

create unique index if not exists orders_provider_checkout_unique
  on meqyro.orders(payment_provider, provider_checkout_id)
  where provider_checkout_id is not null;

create unique index if not exists orders_provider_payment_unique
  on meqyro.orders(payment_provider, provider_payment_id)
  where provider_payment_id is not null;

create unique index if not exists payment_attempts_provider_attempt_unique
  on meqyro.payment_attempts(provider, provider_attempt_id)
  where provider_attempt_id is not null;

alter table meqyro.result_access_grants
  add column if not exists order_id uuid references meqyro.orders(id) on delete restrict;

create unique index if not exists result_access_grants_session_product_unique
  on meqyro.result_access_grants(session_id, product_code, grant_type);

create unique index if not exists result_access_grants_order_product_unique
  on meqyro.result_access_grants(order_id, product_code, grant_type)
  where order_id is not null;

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
  on conflict (session_id, product_code, grant_type) do nothing;

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
