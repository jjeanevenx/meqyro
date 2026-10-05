DO $migration$ BEGIN
create or replace function meqyro.pending_report_deliveries(p_limit integer default 5, p_session_id uuid default null)
returns table(session_id uuid, order_id uuid)
language sql security invoker set search_path = '' as $queue$
  select candidate.session_id, candidate.order_id from (
    select distinct on (s.id) s.id as session_id, g.order_id, s.completed_at, d.sent_at, d.last_attempt_at
    from meqyro.quiz_sessions s
    join meqyro.quiz_versions v on v.id = s.quiz_version_id
    join meqyro.quizzes q on q.id = v.quiz_id
    join meqyro.quiz_sessions purchase on purchase.buyer_id = s.buyer_id
    join meqyro.result_access_grants g on g.session_id = purchase.id and g.product_code = q.product_code
    join meqyro.orders o on o.id = g.order_id and o.status = 'FULFILLED'
    left join meqyro.report_deliveries d on d.order_id = g.order_id and d.session_id = s.id
    where s.status = 'COMPLETED' and exists(select 1 from meqyro.results r where r.session_id = s.id)
      and g.grant_type in ('PREMIUM_REPORT','PREMIUM_BUNDLE') and g.created_at > now() - interval '24 months'


      and (p_session_id is null or s.id = p_session_id or exists (
        select 1 from meqyro.couple_invites ci where ci.status <> 'EXPIRED' and
          ((ci.initiator_session_id = s.id and ci.partner_session_id = p_session_id) or
           (ci.partner_session_id = s.id and ci.initiator_session_id = p_session_id))))
    order by s.id, g.created_at desc
  ) candidate where candidate.sent_at is null and (p_session_id is not null or candidate.last_attempt_at is null or candidate.last_attempt_at < now() - interval '5 minutes') order by candidate.completed_at asc limit greatest(1, least(p_limit, 50));
$queue$;
revoke all on function meqyro.pending_report_deliveries(integer,uuid) from public, anon, authenticated;
grant execute on function meqyro.pending_report_deliveries(integer,uuid) to service_role;

END $migration$;
