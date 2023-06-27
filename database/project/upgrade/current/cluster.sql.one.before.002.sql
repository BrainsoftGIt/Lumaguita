alter table cluster.collector add if not exists collector_changes character varying [] not null default array[]::text[];
alter table cluster.collector add if not exists collector_metaapply jsonb default null;
alter table cluster.collector add if not exists collector_changevalue jsonb default null;
alter table cluster.collector add if not exists collector_usechage jsonb default null;