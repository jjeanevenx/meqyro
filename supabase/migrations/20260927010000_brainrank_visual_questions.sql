-- Structured, renderer-agnostic visual data for BrainRank questions.
alter table meqyro.options
  add column if not exists metadata jsonb not null default '{}'::jsonb;

comment on column meqyro.options.metadata is
  'Public presentation metadata such as structured visual primitives; never stores scoring data.';
