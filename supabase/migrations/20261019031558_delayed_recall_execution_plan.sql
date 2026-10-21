-- Execution plan v2: no historical answer, question key or result changes.
create or replace function meqyro.brainrank_question_clock(
  p_session_id uuid, p_question_id uuid, p_submit boolean default false,
  p_option_id uuid default null, p_timeout boolean default false
) returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  s meqyro.quiz_sessions%rowtype;
  q meqyro.quiz_session_questions%rowtype;
  a meqyro.answers%rowtype;
  received_at timestamptz := clock_timestamp();
  elapsed integer;
  expired boolean;
  next_position integer;
  cue text;
begin
  select * into strict s from meqyro.quiz_sessions where id = p_session_id for update;
  if s.status not in ('CREATED','IN_PROGRESS') or s.expires_at <= received_at then
    raise exception 'Inactive session';
  end if;
  select * into strict q from meqyro.quiz_session_questions
    where session_id = p_session_id and question_id = p_question_id;
  if q.time_limit_seconds is null then raise exception 'Untimed question'; end if;
  select * into a from meqyro.answers where session_id = p_session_id and question_id = p_question_id;
  if found then
    return jsonb_build_object('answerStatus', a.answer_status, 'currentPosition', s.current_position,
      'questionStartedAt', q.question_started_at, 'questionExpiresAt', q.question_expires_at,
      'timeLimitSeconds', q.time_limit_seconds, 'serverNow', clock_timestamp(), 'answered', true);
  end if;
  if q.position <> s.current_position then raise exception 'Unexpected question'; end if;
  -- Derive cue positions from the immutable assigned order. Preserve legacy block plans.
  select mq.stable_key into cue
  from meqyro.quiz_session_questions nextq
  join meqyro.questions mq on mq.id = nextq.question_id
  where nextq.session_id = p_session_id and mq.scoring_key->>'dimension' = 'DELAYED_MEMORY'
    and (case
      when exists (select 1 from meqyro.quiz_session_questions middleq join meqyro.questions middledef on middledef.id = middleq.question_id
        where middleq.session_id = p_session_id and middledef.stable_key = 'MEMORY_02'
          and middleq.position = least((select max(position) from meqyro.quiz_session_questions where session_id = p_session_id) - 5,
            (select max(position) from meqyro.quiz_session_questions where session_id = p_session_id) / 2 + 6))
      then case mq.stable_key when 'MEMORY_01' then 1 when 'MEMORY_02' then nextq.position - 5 else nextq.position - 4 end
      else coalesce((select max(prev.position) + 1 from meqyro.quiz_session_questions prev
        join meqyro.questions prevdef on prevdef.id = prev.question_id
        where prev.session_id = p_session_id and prev.position < nextq.position
          and prevdef.scoring_key->>'dimension' = 'DELAYED_MEMORY'), 1)
    end) = q.position;
  if cue is not null and not (cue = any(coalesce(s.memory_exposures, array[]::text[]))) then
    raise exception 'Memory cue required';
  end if;
  if q.question_started_at is null then
    if p_submit then raise exception 'Question not started'; end if;
    q.question_started_at := clock_timestamp();
    q.question_expires_at := q.question_started_at + make_interval(secs => q.time_limit_seconds);
    update meqyro.quiz_session_questions set question_started_at = q.question_started_at,
      question_expires_at = q.question_expires_at where session_id = p_session_id and question_id = p_question_id;
  end if;
  if p_submit then
    expired := received_at >= q.question_expires_at;
    if p_timeout and not expired then raise exception 'Deadline not reached'; end if;
    if not expired and not exists (select 1 from meqyro.options where id = p_option_id and question_id = p_question_id) then
      raise exception 'Invalid option';
    end if;
    elapsed := case when expired then q.time_limit_seconds * 1000 else
      greatest(0, floor(extract(epoch from (received_at - q.question_started_at)) * 1000)::integer) end;
    insert into meqyro.answers(session_id, question_id, option_id, duration_ms, answer_status, answered_at)
      values(p_session_id, p_question_id, case when expired then null else p_option_id end,
        elapsed, case when expired then 'TIMEOUT' else 'ANSWERED' end, received_at);
    select least(q.position + 1, max(position)) into next_position
      from meqyro.quiz_session_questions where session_id = p_session_id;
    update meqyro.quiz_sessions set current_position = next_position, updated_at = clock_timestamp()
      where id = p_session_id;
    return jsonb_build_object('answerStatus', case when expired then 'TIMEOUT' else 'ANSWERED' end,
      'currentPosition', next_position, 'answered', true);
  end if;
  return jsonb_build_object('questionStartedAt', q.question_started_at,
    'questionExpiresAt', q.question_expires_at, 'timeLimitSeconds', q.time_limit_seconds,
    'serverNow', clock_timestamp(), 'answered', false);
end;
$$;
revoke all on function meqyro.brainrank_question_clock(uuid,uuid,boolean,uuid,boolean) from public, anon, authenticated;
grant execute on function meqyro.brainrank_question_clock(uuid,uuid,boolean,uuid,boolean) to service_role;
