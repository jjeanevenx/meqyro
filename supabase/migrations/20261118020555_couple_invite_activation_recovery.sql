-- A committed payment can be replayed until all invite dependencies are persisted.
-- Existing slots deliberately remain NULL so they can be repaired idempotently.
alter table meqyro.couple_invite_slots
  add column activation_completed_at timestamptz;

create index couple_invite_slots_activation_recovery_idx
  on meqyro.couple_invite_slots (created_at, id)
  where activation_completed_at is null
    and order_id is not null
    and status in ('PENDING_PAYMENT', 'ACTIVE', 'REDEEMED', 'QUIZ_STARTED', 'COMPLETED');

comment on column meqyro.couple_invite_slots.activation_completed_at is
  'Set only after paid activation, grants, invite and initial host consent are persisted; replay never renews consent or expiry.';
