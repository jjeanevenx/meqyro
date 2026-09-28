-- ==============================================================================
-- Migration: Question Bank Support & Key Formatting
-- Schema: meqyro
-- Description: Adds active flag to questions for question bank support and
--              allows hyphens in stable_key identifiers (e.g. BR-NUM-001).
-- ==============================================================================

-- 1. Add active status flag to questions table
alter table meqyro.questions
  add column if not exists active boolean not null default true;

-- Index for performant querying of active questions per quiz version
create index if not exists questions_active_idx on meqyro.questions (quiz_version_id, active, position);

-- 2. Update stable_key check constraints to support hyphens in codes (e.g., BR-NUM-001)
alter table meqyro.questions drop constraint if exists questions_stable_key_check;
alter table meqyro.questions add constraint questions_stable_key_check check (stable_key ~ '^[A-Z0-9_-]+$');

alter table meqyro.options drop constraint if exists options_stable_key_check;
alter table meqyro.options add constraint options_stable_key_check check (stable_key ~ '^[A-Z0-9_-]+$');
