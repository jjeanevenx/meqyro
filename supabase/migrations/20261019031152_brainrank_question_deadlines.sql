alter table meqyro.quiz_session_questions
  add column difficulty text,
  add column time_limit_seconds integer check (time_limit_seconds between 1 and 14400),
  add column timing_rules_version text,
  add column question_started_at timestamptz,
  add column question_expires_at timestamptz;
alter table meqyro.answers add column answer_status text not null default 'ANSWERED'
  check (answer_status in ('ANSWERED', 'TIMEOUT'));
-- Replace only the original answer-shape constraint; existing answers remain valid.
alter table meqyro.answers drop constraint answers_check;
alter table meqyro.answers add constraint answers_payload_check check (
  (answer_status = 'TIMEOUT' and option_id is null and numeric_value is null) or
  (answer_status = 'ANSWERED' and (option_id is not null)::integer + (numeric_value is not null)::integer = 1)
);

-- Adopt active legacy attempts without touching historical results or submitted answers.
update meqyro.quiz_session_questions sq set
  difficulty = coalesce(q.scoring_key->>'difficulty', 'UNKNOWN'),
  time_limit_seconds = case q.scoring_key->>'difficulty'
    when 'EASY' then 30 when 'HARD' then 60 when 'VERY_HARD' then 90 else 45 end,
  timing_rules_version = 'brainrank-deadline-1.0'
from meqyro.questions q, meqyro.quiz_sessions s, meqyro.quiz_versions v, meqyro.quizzes quiz
where q.id = sq.question_id and s.id = sq.session_id and v.id = s.quiz_version_id
  and quiz.id = v.quiz_id and quiz.slug = 'brainrank' and s.status in ('CREATED','IN_PROGRESS');

-- Both operations serialize on the session row. The first committed submission wins.
-- Time is measured at DB entry, before lock waits. No device time or duration is trusted.
create function meqyro.brainrank_question_clock(
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
  -- A cue is shown at the start of each block; it must be acknowledged first.
  if not exists (select 1 from meqyro.quiz_session_questions previous
    join meqyro.questions pq on pq.id = previous.question_id
    where previous.session_id = p_session_id and previous.position = q.position - 1
      and pq.scoring_key->>'dimension' <> 'DELAYED_MEMORY') then
    select mq.stable_key into cue from meqyro.quiz_session_questions nextq
      join meqyro.questions mq on mq.id = nextq.question_id
      where nextq.session_id = p_session_id and nextq.position >= q.position
        and mq.scoring_key->>'dimension' = 'DELAYED_MEMORY'
      order by nextq.position limit 1;
    if cue is not null and not (cue = any(coalesce(s.memory_exposures, array[]::text[]))) then
      raise exception 'Memory cue required';
    end if;
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
