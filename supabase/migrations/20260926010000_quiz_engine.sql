create type meqyro.question_kind as enum ('SINGLE_CHOICE', 'VISUAL_CHOICE', 'LIKERT', 'SCENARIO');
create type meqyro.quiz_session_status as enum ('CREATED', 'IN_PROGRESS', 'COMPLETED', 'EXPIRED');

create table meqyro.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_version_id uuid not null references meqyro.quiz_versions(id) on delete restrict,
  stable_key text not null check (stable_key ~ '^[A-Z0-9_]+$'),
  position integer not null check (position > 0),
  kind meqyro.question_kind not null,
  scoring_key jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  unique (quiz_version_id, stable_key),
  unique (quiz_version_id, position)
);

create table meqyro.question_translations (
  question_id uuid not null references meqyro.questions(id) on delete cascade,
  locale text not null check (locale in ('pt', 'en', 'es', 'fr')),
  prompt text not null check (length(trim(prompt)) > 0),
  accessibility_text text,
  primary key (question_id, locale)
);

create table meqyro.options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references meqyro.questions(id) on delete cascade,
  stable_key text not null check (stable_key ~ '^[A-Z0-9_]+$'),
  position integer not null check (position > 0),
  scoring_value jsonb not null default '{}'::jsonb,
  unique (question_id, stable_key),
  unique (question_id, position)
);

create table meqyro.option_translations (
  option_id uuid not null references meqyro.options(id) on delete cascade,
  locale text not null check (locale in ('pt', 'en', 'es', 'fr')),
  label text not null check (length(trim(label)) > 0),
  image_alt text,
  primary key (option_id, locale)
);

create table meqyro.quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  quiz_version_id uuid not null references meqyro.quiz_versions(id) on delete restrict,
  quiz_version text not null,
  scoring_version text not null,
  locale text not null check (locale in ('pt', 'en', 'es', 'fr')),
  market text not null check (market in ('BR', 'US', 'EU', 'GB')),
  status meqyro.quiz_session_status not null default 'CREATED',
  access_token_hash text not null check (access_token_hash ~ '^[a-f0-9]{64}$'),
  current_position integer not null default 1 check (current_position > 0),
  expires_at timestamptz not null,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint completed_session_has_timestamp check (
    (status = 'COMPLETED' and completed_at is not null) or
    (status <> 'COMPLETED' and completed_at is null)
  )
);

create index quiz_sessions_expiry_idx on meqyro.quiz_sessions (expires_at)
  where status in ('CREATED', 'IN_PROGRESS');

create table meqyro.answers (
  session_id uuid not null references meqyro.quiz_sessions(id) on delete cascade,
  question_id uuid not null references meqyro.questions(id) on delete restrict,
  option_id uuid references meqyro.options(id) on delete restrict,
  numeric_value smallint,
  duration_ms integer check (duration_ms is null or duration_ms >= 0),
  answered_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (session_id, question_id),
  check ((option_id is not null)::integer + (numeric_value is not null)::integer = 1)
);

create table meqyro.results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references meqyro.quiz_sessions(id) on delete restrict,
  quiz_version text not null,
  scoring_version text not null,
  score jsonb not null,
  input_snapshot jsonb not null,
  created_at timestamptz not null default now()
);

create or replace function meqyro.prevent_completed_session_answer_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (
    select 1 from meqyro.quiz_sessions
    where id = coalesce(new.session_id, old.session_id)
      and status in ('COMPLETED', 'EXPIRED')
  ) then
    raise exception 'answers are immutable after session completion or expiry';
  end if;
  return coalesce(new, old);
end;
$$;

create trigger answers_are_immutable_for_terminal_sessions
before insert or update or delete on meqyro.answers
for each row execute function meqyro.prevent_completed_session_answer_change();

alter table meqyro.questions enable row level security;
alter table meqyro.question_translations enable row level security;
alter table meqyro.options enable row level security;
alter table meqyro.option_translations enable row level security;
alter table meqyro.quiz_sessions enable row level security;
alter table meqyro.answers enable row level security;
alter table meqyro.results enable row level security;

revoke all on all tables in schema meqyro from public, anon, authenticated;
revoke all on all sequences in schema meqyro from public, anon, authenticated;
revoke execute on function meqyro.prevent_completed_session_answer_change() from public, anon, authenticated;

comment on column meqyro.quiz_sessions.access_token_hash is 'SHA-256 hash; the opaque credential exists only in an HttpOnly cookie.';
comment on column meqyro.questions.scoring_key is 'Server-only versioned scoring configuration; never returned by public quiz content endpoints.';
