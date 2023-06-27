create schema cluster;

drop function  cluster.__format( regclass );
create or replace function cluster.__format( regclass )
returns character varying
stable
strict
language sql as $$
  select format( '%I.%I', schemaname, tablename )
    from pg_tables
    where format( '%s.%s', schemaname, tablename )::regclass = $1
$$;




create or replace function cluster.__tg_share_check()
returns trigger
language plpgsql as $$
declare
begin
  if( to_regclass( new.share_regclass ) is null ) then
    raise exception '% is not a table', new.share_regclass;
  end if;
  new.share_regclass := cluster.__format( new.share_regclass );
  new.share_pks := lib.sets_pks_array( new.share_regclass );
  return new;
end;
$$;

drop trigger if exists _share_check on cluster.share;
drop trigger if exists tg_share_check on cluster.share;
create trigger tg_share_check
  before insert or update on cluster.share
  for each row
  execute procedure cluster.__tg_share_check();



create or replace function cluster.__transaction_uid()
returns uuid
strict
immutable
language sql as 'select gen_random_uuid();';

create or replace function cluster.__user_map()
returns cluster.users
stable
language sql as $$
  select * from cluster.users limit 1;
$$;


create or replace function cluster.__is_replication()
returns boolean
stable
language plpgsql as $$
declare
  _users cluster.users;
begin
  _users := cluster.__user_map();
  return _users.user_replication is not null
    and _users.user_replication = "current_user"()::regrole;
end;
$$;

create or replace function cluster.__user_default()
returns regrole
stable
language sql as 'select user_default from cluster.users limit 1';

create or replace function cluster.__user_replication()
returns regrole
stable
language sql as 'select user_replication from cluster.users limit 1';


create or replace function cluster.__pks( regclass )
returns name[]
language sql
strict
immutable

as $$
  select array(
    select pk.name
      from lib.sets_pks( $1 ) pk( name )
  );
$$;
--
drop function cluster._get_version_local( regclass, increment boolean );
create or replace function cluster._get_version_local( regclass, increment boolean default false )
returns cluster.version
strict
language plpgsql as $$
declare
  _version cluster.version;
  _cluster cluster.cluster;
begin
  _cluster := cluster._get_cluster_local();

  if coalesce( increment, false ) then
    update cluster.version
      set version_number = version_number +1
      where version_share_regclass::regclass = $1
        and version_cluster_id = _cluster.cluster_uid
      returning * into _version
    ;
  else
    select * into _version
      from cluster.version
      where version_cluster_id = _cluster.cluster_uid
        and version_share_regclass::regclass = $1;
  end if;

  if _version.version_uid is null then
    _version.version_number := lib."when"( coalesce( increment, false ), 1, 0 );
    _version.version_cluster_id := _cluster.cluster_uid;
    _version.version_share_regclass := cluster.__format( $1 );
    select ( "returning" ).* into _version from lib.sets_in( _version );
  end if;

  return _version;
end;
$$;

create or replace function cluster.__create_api()
returns character varying
language plpgsql as $$
  declare
    _leter character varying default 'ABCDEFGHIJKLMNOQRSTUVWXYZ';
  begin
    return format( '%s', lib.dset_random_text( _leter || '0123456789', 128 ) );
  end;
$$;

create or replace function cluster.__create_identifier()
returns character varying
language plpgsql as $$
  declare
    _leter character varying default 'ABCDEFGHIJKLMNOQRSTUVWXYZ';
  begin
    return format(
    '%s-%s-%s',
    lib.dset_random_text( _leter, 4 ),
    lib.dset_random_text( _leter||'0123456789', 5 ),
    lib.dset_random_text( '0123456789', 3 )
  );
  end;
$$;

select * from cluster.cluster;

alter function cluster._get_version_local(regclass, increment boolean) owner to maguita;

drop function cluster._get_cluster_local( increment boolean );

select cluster_version from cluster._get_cluster_local( true );

create or replace function cluster._get_cluster_local( increment boolean default false, try int default 0 )
returns cluster.cluster
language plpgsql as $$
declare
  _cluster cluster.cluster;
  -- local origin
  _origin uuid default '00000000-0000-0000-0000-000000000000'::uuid;
  _const map.constant;
begin
  _const := map.constant();

  if coalesce( increment, false ) then
    update cluster.cluster
      set cluster_version = cluster_version +1
      where cluster_uid = _origin
      returning * into _cluster;
  else
    select * into _cluster
      from cluster.cluster c
      where c.cluster_type = _const.cluster_tcluster_local;
  end if;

  if _cluster.cluster_uid is null then
    insert into cluster.cluster(
      cluster_uid,
      cluster_identifier,
      cluster_type,
      cluster_version
    ) values (
      _origin,
      cluster.__create_identifier(),
      _const.cluster_tcluster_local,
      lib."when"( coalesce( increment, false), 1, 0 )
    ) returning * into _cluster;
  end if;

  return _cluster;
exception when others then
  <<_ex>>
  declare
    e text; m text; d text; h text; c text;
  begin
    get stacked diagnostics e=returned_sqlstate, m=message_text, d=pg_exception_detail, h=pg_exception_hint, c=pg_exception_context;
    if try < 10 then
      perform pg_sleep( try );
      return cluster._get_cluster_local( increment, try+1 );
    else raise exception '%', m;
    end if;
  end;
end;
$$;

create or replace function cluster.__tg_share_map()
returns trigger
language plpgsql as $$
declare
  PROCEDURE_COMMIT regprocedure default 'cluster.__tg_version_commit()'::regprocedure;
  PROCEDURE_ADD_INSERT regprocedure default 'cluster.__tg_version_add_when_insert()'::regprocedure;
  PROCEDURE_ADD_UPDATE regprocedure default 'cluster.__tg_version_add_when_update()'::regprocedure;

  _new cluster.share;
  _old cluster.share;
  _share record;
  _data record;
  _base_name character varying;
  _trigger_name name;
  _statement text;
  _tg record;
begin
  if tg_op in ( 'INSERT', 'UPDATE' ) then
    _new := new;
    select
        c.relname as table_name,
        c.relnamespace::regnamespace::text as table_scheme,
        _new.*
        into _share
      from pg_class c
      where c.oid::regclass = _new.share_regclass::regclass;
  end if;


  if tg_op in ( 'UPDATE', 'DELETE' ) then
    _old := old;
  end if;

  if tg_when = 'BEFORE' then
    if _old.share_regclass is not null and _old.share_triggers is not null and array_length( _old.share_triggers, 1 ) > 0 then
      for _data in
        select *  from unnest( _old.share_triggers ) u( trigger_name )
      loop
        execute format( 'drop trigger %I on %s', _data.trigger_name, _old.share_regclass );
      end loop;
    end if;
  end if;

  if tg_when = 'BEFORE' and _new.share_regclass is not null then
    select array_agg( tgname ) as triggers into _data
      from pg_trigger tg
      where tg.tgrelid::regclass = _new.share_regclass::regclass
    ;

    _new.share_triggers := array[]::name[];
    for _tg in
      with __when ( _tg_op, _for, _procedure ) as (
        select 'insert', 'each row', PROCEDURE_ADD_INSERT where _new.share_insert
        union all select 'insert', 'each statement', PROCEDURE_COMMIT where _new.share_insert
        union all select 'update', 'each row', PROCEDURE_ADD_UPDATE where _new.share_update
        union all select 'update', 'each statement', PROCEDURE_COMMIT where _new.share_update
      ) select *
      from __when w
    loop

      if _tg._for  = 'each row' then
        _base_name := format( 'cluster_version_add_change_after_%s_on_%s_%s', _tg._tg_op, _share.table_scheme, _share.table_name );
      else
        _base_name := format( 'cluster_version_commit_change_%s_on_%s_%s', _tg._tg_op, _share.table_scheme, _share.table_name );
      end if;

      _trigger_name := format( '%s_%s', _base_name, ( random() * (999999 - 100000 )+100000)::int );
      while _trigger_name = any( _data.triggers ) loop
        _trigger_name := format( '%s_%s', _base_name, ( random() * (999999 - 100000 )+100000)::int );
      end loop;

      --language=PostgreSQL
      _statement := $sql$
        create trigger _tg_name
          after delete
          on _table_name
          for statement
          when ( not cluster.__is_replication() )
          execute procedure _use_procedure
        ;
      $sql$;

      _statement := replace( _statement, '_tg_name', '%I' );
      _statement := replace( _statement, 'delete', '%s' );
      _statement := replace( _statement, '_table_name', '%s' );
      _statement := replace( _statement, 'statement', '%s' );
      _statement := replace( _statement, '_use_procedure', '%s' );
      _statement := format( _statement, _trigger_name, _tg._tg_op, _new.share_regclass::text, _tg._for, _tg._procedure );

      execute _statement;
      _new.share_triggers := _new.share_triggers || _trigger_name;
      _data.triggers := _data.triggers || _trigger_name;
    end loop;
  end if;

  if tg_when = 'BEFORE' and tg_op in (  'INSERT', 'UPDATE' ) then
    return _new;
  elseif tg_when = 'BEFORE' and tg_op in( 'DELETE' ) then
    return _old;
  end if;

  return null;
end;
$$;

create or replace function cluster.__tg_share_truncate()
returns trigger
language plpgsql as $$
declare
  _add_insert regprocedure default 'cluster.__tg_version_add_when_insert()'::regprocedure;
  _add_update regprocedure default 'cluster.__tg_version_add_when_update()'::regprocedure;
  _commit regprocedure default 'cluster.__tg_version_commit()'::regprocedure;
  _data record;
begin
  for _data in
    select
      tg.tgrelid::regclass::text as share_regclass,
      tg.tgname as trigger_name,
      tg.*
    from pg_trigger tg
    where tg.tgfoid in( _add_insert, _add_update, _commit )
  loop
    begin
      execute format( 'drop trigger %I on %s', _data.trigger_name, _data.share_regclass );
    exception when others then null;
    end;
  end loop;
  return null;
end;
$$;

drop trigger if exists tg_share_truncate on cluster.share;
create trigger  tg_share_truncate
  after truncate
  on cluster.share
  for each statement
  execute procedure cluster.__tg_share_truncate();

drop trigger if exists cluster_share_map on cluster.share;
create trigger cluster_share_map
  before insert or update or delete
  on cluster.share
  for each row
  execute procedure cluster.__tg_share_map()
;
