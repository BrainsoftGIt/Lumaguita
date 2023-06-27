alter table cluster.collector add if not exists collector_remoteold jsonb default null;
alter table cluster.collector add if not exists collector_originold jsonb default null;