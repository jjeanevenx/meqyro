-- ==============================================================================
-- Migration: Persist Selected Questions per Quiz Session Attempt
-- Schema: meqyro
-- Description: Stores dynamically assembled question sets per session/attempt,
--              guaranteeing immutable question orders, no duplicates, and persistence across refreshes.
-- ==============================================================================

create table if not exists meqyro.quiz_session_questions (
  session_id uuid not null references meqyro.quiz_sessions(id) on delete cascade,
  question_id uuid not null references meqyro.questions(id) on delete restrict,
  position integer not null check (position > 0),
  created_at timestamptz not null default now(),
  primary key (session_id, question_id),
  unique (session_id, position)
);

create index if not exists quiz_session_questions_session_idx
  on meqyro.quiz_session_questions (session_id, position);

alter table meqyro.quiz_session_questions enable row level security;

revoke all on meqyro.quiz_session_questions from public, anon, authenticated;
grant select, insert, update, delete on meqyro.quiz_session_questions to service_role;

comment on table meqyro.quiz_session_questions is
  'Immutable set of questions selected for a specific quiz session attempt.';
