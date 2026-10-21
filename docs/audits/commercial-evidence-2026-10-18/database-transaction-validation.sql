-- Homologation only. Creates isolated test records and rolls back every change.
begin;
do $test$
declare v_session uuid; v_order uuid; v_version uuid; v_quiz uuid; v_count integer;
begin
 select v.id,q.id into v_version,v_quiz from meqyro.quiz_versions v join meqyro.quizzes q on q.id=v.quiz_id where q.slug='moneydna' limit 1;
 insert into meqyro.quiz_sessions(quiz_version_id,quiz_version,scoring_version,locale,market,status,access_token_hash,expires_at,completed_at)
 values(v_version,'v1.0.0','v1','en','US','COMPLETED',repeat('a',64),now()+interval '1 day',now()) returning id into v_session;
 insert into meqyro.orders(session_id,order_number,status,product_code,amount,currency,market,payment_provider,customer_email)
 values(v_session,'ROLLBACK-HML-'||gen_random_uuid(),'PENDING','MONEYDNA',299,'USD','US','stripe','rollback-test@example.invalid') returning id into v_order;
 perform meqyro.complete_payment(v_order,'pi_test_rollback',array['MONEYDNA'],now());
 perform meqyro.complete_payment(v_order,'pi_test_rollback',array['MONEYDNA'],now());
 select count(*) into v_count from meqyro.analytics_events where properties->>'order_id'=v_order::text and event_name='payment_completed';
 if v_count<>1 then raise exception 'duplicate conversion:%',v_count; end if;
 if not exists(select 1 from meqyro.result_access_grants where order_id=v_order) then raise exception 'missing paid grant'; end if;
 perform meqyro.refund_payment(v_order,'Rollback-only homologation test','refund_test_rollback');
 perform meqyro.refund_payment(v_order,'Rollback-only duplicate','refund_test_rollback');
 if exists(select 1 from meqyro.result_access_grants where order_id=v_order) then raise exception 'grant not revoked'; end if;
 select count(*) into v_count from meqyro.refunds where order_id=v_order;
 if v_count<>1 then raise exception 'duplicate refund:%',v_count; end if;
 if not exists(select 1 from meqyro.orders where id=v_order and status='REFUNDED') then raise exception 'refund status incorrect'; end if;
end;
$test$;
select 'PASS: payment/grant/conversion/refund/idempotency in rolled-back transaction' as validation;
select * from meqyro.consume_rate_limit(repeat('b',64),60000);
select * from meqyro.consume_rate_limit(repeat('b',64),60000);
select jsonb_typeof(meqyro.commercial_metrics()->'byQuiz') as metrics_by_quiz_type;
rollback;
