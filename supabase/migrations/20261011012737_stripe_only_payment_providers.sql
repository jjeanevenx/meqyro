-- Stripe is the only provider. Reject legacy providers rather than rewriting payment history.
do $migration$
begin
  if not exists (select 1 from pg_constraint where conrelid = 'meqyro.orders'::regclass and conname = 'orders_stripe_only') then
    alter table meqyro.orders add constraint orders_stripe_only check (payment_provider = 'stripe');
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'meqyro.payment_attempts'::regclass and conname = 'payment_attempts_stripe_only') then
    alter table meqyro.payment_attempts add constraint payment_attempts_stripe_only check (provider = 'stripe');
  end if;
  if not exists (select 1 from pg_constraint where conrelid = 'meqyro.payment_events'::regclass and conname = 'payment_events_stripe_only') then
    alter table meqyro.payment_events add constraint payment_events_stripe_only check (provider = 'stripe');
  end if;
end;
$migration$;
