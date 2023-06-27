
create or replace function cluster.__collect_change( regclass, _change jsonb, _old jsonb default null, _operation char default 'I', _ref jsonb default null )
returns cluster.collector
language plpgsql as $$
declare
  _collector cluster.collector;
  _origin uuid default '00000000-0000-0000-0000-000000000000'::uuid;
begin
  _collector.collector_share_regclass := cluster.__format( $1 );
  _collector.collector_metadata := _change;

  insert into cluster.collector(
    collector_share_regclass,
    collector_metadata,
    collector_cluster_origin,
    collector_old,
    collector_operation,
    collector_ref
  ) values (
    _collector.collector_share_regclass,
    _collector.collector_metadata,
    _origin,
    _old,
    coalesce( _operation, 'I' ),
    _ref
  ) returning * into _collector;

  return _collector;
end;
$$;

create or replace function cluster.__tg_version_add_when_update()
returns trigger
language plpgsql as $$

begin
  perform cluster.__collect_change(
    tg_relid::regclass,
    to_jsonb( new ),
    to_jsonb( old ),
    'U'
  );
  return null;
end;
$$;

create or replace function cluster.__tg_version_add_when_insert()
returns trigger
language plpgsql as $$
begin
  perform cluster.__collect_change(
      tg_relid::regclass,
      to_jsonb( new )
    );
  return null;
end;
$$;

drop function if exists cluster.__create_object_version( regclass );
create or replace function cluster.__create_object_version( regclass )
returns cluster.version
language plpgsql as $$
declare
  declare
  _regclass regclass default cluster.__format( $1 );
  _share record;
  _object cluster.object;
  _cluster cluster.cluster;
  _version cluster.version;
  _data record;
  _discard record;
  _pid int default pg_backend_pid();
  _transuid uuid default cluster.__transaction_uid();
begin
  _cluster := cluster._get_cluster_local( increment := true);
  _version := cluster._get_version_local( _regclass, increment := true );

  select s.* into _share
    from cluster.share s
    where s.share_regclass::regclass = _regclass;

  _object.object_share_regclass := _share.share_regclass;
  _object.object_cluster_origin := _cluster.cluster_uid;
  _object.object_cluster_receiver := _cluster.cluster_uid;

  with __objects as (
    select
      count( o.object_uid )  as _object_localversion,
      count( o.object_uid ) filter ( where o.object_share_regclass::regclass = _regclass and o.object_cluster_origin = _cluster.cluster_uid )  as _object_originsseq,
      count( o.object_uid ) filter ( where o.object_share_regclass::regclass = _regclass  )  as _object_sseq
      from cluster.object o
  ), __collectors as (
    select
      min( c.collector_sequence ) as _collector_minseq,
      max( c.collector_sequence ) as _collector_maxseq
    from cluster.collector c
    where not c.collector_version
      and c.collector_share_regclass::regclass = _regclass
      and c.collector_cluster_origin = _cluster.cluster_uid
      and c.collector_pid = _pid
      and c.collector_ref is null
  ) select * into _data from __collectors, __objects;

  with __apply_collector as  (
      update cluster.collector c
        set
          collector_version = true,
          collector_ref = lib.sets_ref( coalesce( collector_old, collector_metadata ), _share.share_pks ),
          collector_order = c.collector_sequence - _data._collector_minseq +1,
          collector_minseq = _data._collector_minseq,
          collector_maxseq = _data._collector_maxseq
        where not c.collector_version
          and c.collector_share_regclass::regclass = _regclass
          and c.collector_ref is null
          and c.collector_pid = _pid
          and c.collector_cluster_origin = _cluster.cluster_uid
        returning
          c.collector_transuid,
          c.collector_uid,
          c.collector_sequence,
          c.collector_minseq,
          c.collector_maxseq,
          c.collector_share_regclass,
          c.collector_ref,
          c.collector_metadata,
          c.collector_date,
          c.collector_order
      ) ,__creat_object as (
        insert into cluster.object (
          object_ref,
          object_transuid,
          object_share_regclass,
          object_cluster_origin,
          object_cluster_receiver,
          object_originver,
          object_originsver,
          object_origincver,
          object_originsseq,
          object_sseq,
          object_originrev,
          object_collector_uid
        ) select
              _ac.collector_ref,
              _ac.collector_transuid,
              cluster.__format( _regclass ),
              _object.object_cluster_origin,
              _object.object_cluster_receiver,
              _ac.collector_sequence,
              _version.version_number,
              _cluster.cluster_version,
              _data._object_originsseq + _ac.collector_order,
              _data._object_sseq + _ac.collector_order,
              count( col.collector_uid )+1,
              _ac.collector_uid
            from __apply_collector  _ac
              left join cluster.collector col on  _ac.collector_ref = col.collector_ref
                and _ac.collector_uid != col.collector_uid
            group by
              _regclass,
              _object.object_cluster_origin,
              _object.object_cluster_receiver,
              _version.version_number,
              _ac.collector_order,
              _ac.collector_sequence,
              _ac.collector_ref,
              _ac.collector_metadata,
              _ac.collector_uid,
              _ac.collector_transuid
            order by _ac.collector_sequence
           returning *
      )
      select * into _discard
      from __creat_object
  ;
  return _version;
end;
$$;

create or replace function cluster.__tg_version_commit()
returns trigger
language plpgsql as $$
declare
  declare
  _regclass regclass default format( '%s.%s', tg_table_schema, tg_table_name )::regclass;

begin

  if cluster.__is_replication() then
    return null;
  end if;

  perform cluster.__create_object_version( _regclass );
  return null;
end;
$$;





