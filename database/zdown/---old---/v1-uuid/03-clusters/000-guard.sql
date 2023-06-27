drop event trigger if exists cluster_regclass_guard;
create or replace function cluster.__tg_share_guard_upgrade()
  RETURNS event_trigger
  LANGUAGE plpgsql
AS $$
declare
  _regclass regclass;
  _share cluster.share;
  _record record;
begin
  for _record  IN
    select *
      from pg_event_trigger_ddl_commands()
      where tg_tag in ( 'ALTER TABLE', 'CREATE TABLE' )
  loop
    _regclass := _record.object_identity;
    select * into _share
      from cluster.share s
      where s.share_regclass::regclass = _regclass;

    if _share.share_regclass::regclass is not null then
      update cluster.share
        set share_pks = default
        where share_regclass = _regclass;
      end if;
  end loop;
end;
$$;

create event trigger cluster_regclass_guard on ddl_command_end
execute procedure cluster.__tg_share_guard_upgrade();

alter event trigger cluster_regclass_guard disable;