-- Server-only transaction: either revocation, refund record and status all commit, or none do.
create or replace function meqyro.refund_payment(
  p_order_id uuid, p_reason text, p_provider_refund_id text default null
)
returns void language plpgsql security invoker set search_path = '' as $$
declare v_order meqyro.orders%rowtype;
begin
  select * into v_order from meqyro.orders where id = p_order_id for update;
  if not found then raise exception 'order_not_found'; end if;
  if v_order.status = 'REFUNDED' then return; end if;
  if v_order.status not in ('PAID', 'FULFILLED') then
    raise exception 'invalid_order_state:%', v_order.status;
  end if;
  delete from meqyro.result_access_grants
    where order_id = p_order_id and grant_type in ('PREMIUM_REPORT', 'PREMIUM_BUNDLE');
  insert into meqyro.refunds(order_id, amount, reason, provider_refund_id, status)
    values (p_order_id, v_order.amount, p_reason, p_provider_refund_id, 'PROCESSED');
  update meqyro.orders set status = 'REFUNDED', updated_at = timezone('utc', now())
    where id = p_order_id;
end;
$$;
revoke all on function meqyro.refund_payment(uuid, text, text) from public, anon, authenticated;
grant execute on function meqyro.refund_payment(uuid, text, text) to service_role;

-- Payment analytics commit with the order, including concurrent webhook retries.
create or replace function meqyro.record_payment_funnel()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if (new.status = 'FULFILLED' and old.status <> 'FULFILLED')
     or (new.status = 'FAILED' and old.status <> 'FAILED') then
    insert into meqyro.analytics_events(session_id, event_name, quiz_slug, locale, market, properties)
    select new.session_id,
      case when new.status = 'FULFILLED' then 'payment_completed' else 'payment_failed' end,
      q.slug, s.locale, new.market,
      jsonb_build_object('order_id', new.id, 'amount', new.amount, 'currency', new.currency,
        'payment_provider', new.payment_provider, 'product_code', new.product_code)
    from meqyro.quiz_sessions s
    join meqyro.quiz_versions v on v.id = s.quiz_version_id
    join meqyro.quizzes q on q.id = v.quiz_id
    where s.id = new.session_id;
  end if;
  return new;
end;
$$;
revoke all on function meqyro.record_payment_funnel() from public, anon, authenticated;
grant execute on function meqyro.record_payment_funnel() to service_role;
create trigger orders_payment_funnel after update of status on meqyro.orders
  for each row execute function meqyro.record_payment_funnel();

-- Aggregate in Postgres, without the REST row limit or the recent-orders UI limit.
create or replace function meqyro.commercial_metrics()
returns jsonb language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object(
    'totalOrders', (select count(*) from meqyro.orders),
    'paidOrdersCount', (select count(*) from meqyro.orders where status in ('PAID','FULFILLED')),
    'revenueByCurrency', coalesce((select jsonb_object_agg(currency, revenue) from (
      select currency, sum(amount) as revenue from meqyro.orders
      where status in ('PAID','FULFILLED') group by currency
    ) totals), '{}'::jsonb),
    'byQuiz', coalesce((select jsonb_agg(jsonb_build_object(
      'quizSlug', q.slug,
      'started', (select count(*) from meqyro.quiz_sessions s join meqyro.quiz_versions v on v.id = s.quiz_version_id where v.quiz_id = q.id),
      'completed', (select count(*) from meqyro.quiz_sessions s join meqyro.quiz_versions v on v.id = s.quiz_version_id where v.quiz_id = q.id and s.status = 'COMPLETED'),
      'events', coalesce((select jsonb_object_agg(event_name, views) from (
        select event_name, count(*) as views from meqyro.analytics_events where quiz_slug = q.slug group by event_name
      ) events), '{}'::jsonb),
      'purchases', (select count(*) from meqyro.orders o where o.product_code = q.product_code and o.status in ('PAID','FULFILLED')),
      'revenueByCurrency', coalesce((select jsonb_object_agg(currency, revenue) from (
        select currency, sum(amount) as revenue from meqyro.orders o where o.product_code = q.product_code
        and o.status in ('PAID','FULFILLED') group by currency
      ) revenue), '{}'::jsonb)
    )) from meqyro.quizzes q where q.slug in ('brainrank','moneydna','coupledna')), '[]'::jsonb)
  );
$$;
revoke all on function meqyro.commercial_metrics() from public, anon, authenticated;
grant execute on function meqyro.commercial_metrics() to service_role;

-- Atomic fixed window shared by all application instances. Keys are salted HMACs.
create or replace function meqyro.consume_rate_limit(p_key text, p_window_ms integer)
returns table(count integer, expires_at timestamptz)
language sql volatile security invoker set search_path = '' as $$
  insert into meqyro.rate_limits as limits(key, count, expires_at)
  values (p_key, 1, now() + greatest(1, p_window_ms) * interval '1 millisecond')
  on conflict (key) do update set
    count = case when limits.expires_at <= now() then 1 else limits.count + 1 end,
    expires_at = case when limits.expires_at <= now()
      then now() + greatest(1, p_window_ms) * interval '1 millisecond' else limits.expires_at end
  returning limits.count, limits.expires_at;
$$;
revoke all on function meqyro.consume_rate_limit(text, integer) from public, anon, authenticated;
grant execute on function meqyro.consume_rate_limit(text, integer) to service_role;
