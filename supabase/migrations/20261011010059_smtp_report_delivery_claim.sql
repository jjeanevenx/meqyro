do $migration$
begin
-- SMTP has no provider idempotency key. Reserve each report atomically before sending.
alter table meqyro.report_deliveries add column if not exists delivery_claimed_at timestamptz;

create or replace function meqyro.claim_report_delivery(p_order_id uuid, p_session_id uuid)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare v_claimed boolean;
begin
  insert into meqyro.report_deliveries(order_id, session_id, delivery_claimed_at, last_attempt_at)
  values(p_order_id, p_session_id, now(), now())
  on conflict(order_id, session_id) do update
    set delivery_claimed_at = now(), last_attempt_at = now()
    where meqyro.report_deliveries.sent_at is null
      and (meqyro.report_deliveries.delivery_claimed_at is null
        or meqyro.report_deliveries.delivery_claimed_at < now() - interval '5 minutes')
  returning true into v_claimed;
  return coalesce(v_claimed, false);
end;
$$;
revoke all on function meqyro.claim_report_delivery(uuid,uuid) from public,anon,authenticated;
grant execute on function meqyro.claim_report_delivery(uuid,uuid) to service_role;

end;
$migration$;
