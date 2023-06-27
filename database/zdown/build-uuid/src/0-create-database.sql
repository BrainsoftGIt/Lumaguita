-- disconnect all database
select
    pg_terminate_backend( pg_stat_activity.pid)
  from pg_stat_activity
  where pg_stat_activity.datname = 'maguita_uuid' -- ← change this to your db
    and pid != pg_backend_pid();

drop database if exists maguita_uuid;
create database maguita_uuid with owner maguita;