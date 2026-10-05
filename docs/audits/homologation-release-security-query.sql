select
  not exists (
    select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'meqyro' and c.relkind = 'r' and not c.relrowsecurity
  ) as all_application_tables_have_rls,
  not has_table_privilege('anon', 'meqyro.report_deliveries', 'SELECT') as anonymous_delivery_read_denied,
  not has_table_privilege('authenticated', 'meqyro.report_deliveries', 'SELECT') as authenticated_delivery_read_denied,
  not has_function_privilege('anon', 'meqyro.pending_report_deliveries(integer,uuid)', 'EXECUTE') as anonymous_queue_execution_denied,
  has_function_privilege('service_role', 'meqyro.pending_report_deliveries(integer,uuid)', 'EXECUTE') as service_queue_execution_allowed,
  to_regnamespace('meqyro_release_rehearsal') is null as isolated_rehearsal_rolled_back;
