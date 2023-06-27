alter table cluster.break add if not exists break_document jsonb;
alter table cluster.break add if not exists break_metadata jsonb;
alter table cluster.break add if not exists break_change jsonb;
alter table cluster.break add if not exists break_current jsonb;