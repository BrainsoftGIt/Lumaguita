drop function if exists pull(args jsonb);
create or replace function cluster.pull(args jsonb) returns setof jsonb
  language plpgsql
as
$$
declare
    /**
      PROPOSE: Descaregar para o cluster local todas as modificações vinda dos outros cluster
      args := {
        server:ClusterSource,
        objects:( ObjectRevision[] )| DynamicReducer|any,
        ignores:cluster.ignore[]
        result:ClusterResult[]
        total:number
        limit:number,
        revCode:number,
        rejected:number,
      }
    */
    _limit int default args->>'limit';
    _server cluster.cluster;
    _cluster cluster.cluster;
    _local cluster.cluster;
    _data record;
    _i record;
    _obj jsonb default args->'objects';
    _objests cluster.object[] default array[]::cluster.object[];
    _next cluster.object;
  begin
    _server := jsonb_populate_record( _server, args->'server');
    _cluster := cluster._get_cluster( _server.cluster_identifier );
    _local := cluster._get_cluster_local(  );

    with __object as (
      select o.*
        from jsonb_array_elements( _obj ) e( document )
          inner join jsonb_populate_record( null::cluster.object, e.document ) o on true
    ) select max( _o.object_seq ) as _cluster_sequence
      into _data
        from __object _o
    ;

    set session_replication_role to replica;

    for _i in
      with __map as (
        select
            obj as _object,
            col as _collector,
            ( e.document->>'_origin_identifier' ) as _origin_identifier,
            e.document->>'_regclass' as _classname,
            e.document->'_change' as _change,
            e.document->>'_result' as _result,
            ( e.document->>'_regclass' )::regclass as _regclass,
            col.collector_uid as current_collector_uid,
            col.collector_transuid as current_transuid
          from jsonb_array_elements( args->'objects' ) e ( document )
            inner join jsonb_populate_record( null::cluster.object, e.document ) as obj on true
            inner join jsonb_populate_record( null::cluster.collector, e.document ) as col on true
      ), __objects as (
        select
            v.*,
            co.cluster_uid as _origin,
            _cluster.cluster_uid as _receiver,
            ( v._object ).object_ref,
            ( v._object ).object_date,
            ( v._object ).object_uid,
            ( v._collector ).collector_uid,
            ( v._collector ).collector_transuid
          from __map v
            inner join cluster.cluster co on co.cluster_identifier =  v._origin_identifier

      ), __current as (
        select
            _up.object_ref,
            _up._classname,
            e._current,
            max( ob.object_date ) as date
          from __objects _up
            left join cluster.__get( _up._regclass,  _up.object_ref ) e( _current ) on true
            left join cluster.object ob on ob.object_share_regclass = _up._classname
              and ob.object_ref = _up.object_ref
          group by
            _up.object_ref,
            _up._classname,
            e._current

      ), __new as (
        select
            _ob.*,
            _cur.*,
            _created_object.object_uid is not null as _exists_object,
            _create_collector.collector_uid is not null _exists_collector,
            _cur._current is null as _exists_ref,
            (
                _cur._current is not null -- Desatualiazado: Quando já existir previamente a instancia do objecto na tabela
                and _cur.date is not null -- Desatualiazado: & Quando ja existir pelo menus algum objecto para essa referencia
                and _cur.date > _ob.object_date -- Desatualizado: & Quando a data a instancia atual for superior a data do objecto recebido

--               not all: _cur._current is null -- Quando ainda não existir a instancia do dado na tabela
--               or  _cur.date is null -- Ainda não existir nenhuma revisão para a referencia do objecto
--               or _cur.date < _ob.object_date -- Data da ultima revisão registrada for inferior a data da reisão recebida
            ) as _outdate
          from __objects _ob
            inner join __current _cur on _ob.object_ref = _cur.object_ref and _ob._classname = _cur._classname

            -- object_uid, object_share_regclass, object_cluster_origin
            left join cluster.object _created_object on
              ( _ob ).object_uid = _created_object.object_uid
              and ( _ob ).collector_transuid = _created_object.object_transuid
              and _cur._classname = _created_object.object_share_regclass
              and ( _ob )._origin = _created_object.object_cluster_origin

            -- collector_uid, collector_transuid, collector_share_regclass, collector_cluster_origin
            left join cluster.collector _create_collector on
              ( _ob ).collector_uid = _create_collector.collector_uid
              and ( _ob ).collector_transuid = _create_collector.collector_transuid
              and _cur._classname  = _create_collector.collector_share_regclass
              and ( _ob )._origin = _create_collector.collector_cluster_origin
        ) select  *
      from __new
    loop
      _next := cluster.__pull( to_jsonb( _i ) );
      if _next.object_uid is not null then
        _objests := _objests || _next;
      end if;

    end loop;
    set session_replication_role to default;

    return query
      with __object as (
        select (o::cluster.object).*
          from unnest( _objests ) o
      ), __collector as (
        select
            _o.*,
            c.*,
            _o.object_share_regclass as _regclass,
            cc.cluster_identifier as _origin_identifier
          from __object _o
          inner join cluster.collector c on _o.object_collector_uid = c.collector_uid
            and _o.object_transuid = c.collector_transuid
            and _o.object_cluster_origin = c.collector_cluster_origin
          inner join cluster.cluster cc on _o.object_cluster_origin = cc.cluster_uid
      )select to_jsonb( _c )
        from __collector _c
    ;

    -- Atualizar a versão do cluster
    with
    __result as (
      select
          pc.cluster_identifier,
          coalesce( pc.cluster_version, 0 ) as cluster_version,
          coalesce( pc.cluster_sequence, 0 ) as cluster_sequence
        from jsonb_array_elements( args->'result') e( doc )
          inner join jsonb_populate_record( null::cluster.cluster, e.doc ) pc on true
    ), __clusters as (
      select
          c.cluster_identifier,
          c.cluster_sequence,
          max( o.object_origincver ) as object_origincver,
          max( o.object_seq ) as object_seq
        from cluster.object o
          inner join cluster.cluster c on c.cluster_uid = o.object_cluster_origin
        where o.object_cluster_origin != _local.cluster_uid
        group by c.cluster_uid

    ), __status as (
      select
          _r.cluster_identifier,
          case
            when _c.cluster_identifier = _server.cluster_identifier then _r.cluster_version
            when _c.object_origincver >= _r.cluster_version then _c.object_origincver
            else _r.cluster_version
          end as cluster_version,
          case
            when _c.cluster_identifier = _server.cluster_identifier then _r.cluster_sequence
            when _c.cluster_sequence >= _r.cluster_sequence then _c.cluster_sequence
            else _r.cluster_sequence
          end as cluster_sequence
        from __clusters _c
          inner join __result _r on _c.cluster_identifier = _r.cluster_identifier

    ) update cluster.cluster c
        set
          cluster_version = _s.cluster_version,
          cluster_sequence = _s.cluster_sequence,
          cluster_verbose = case
            when _s.cluster_identifier = _cluster.cluster_identifier
              and _limit is not null
              and _limit > jsonb_array_length( _obj ) then false
            else c.cluster_verbose
          end
        from __status _s
        where c.cluster_identifier = _s.cluster_identifier
    ;

    with __ignore as (
      select _pi.*
        from jsonb_array_elements( args->'ignores' ) e( doc )
          inner join jsonb_populate_record( null::cluster.ignore, e.doc ) _pi on true
    ) insert into cluster.ignore
        select _ignor.*
        from __ignore _ignor
    ;

    return query
      with __clusters as (
        select
            c.cluster_identifier,
            c.cluster_name,
            c.cluster_path,
            c.cluster_version,
            c.cluster_sequence
          from cluster.cluster c
      ) select jsonb_agg( _c )
        from __clusters _c;
  end;
$$;

drop function if exists cluster.__pull( _collector cluster.collector, _object cluster.object, jsonb, _regclass regclass, _origin uuid, _receiver uuid);
drop function if exists cluster.__pull(_collector cluster.collector, _object cluster.object, old jsonb, _regclass regclass, _origin uuid, _receiver uuid, _exist_object boolean, _exist_collector boolean, _exist_ref boolean);
drop function if exists cluster.__pull(_collector cluster.collector, _object cluster.object, current jsonb, _regclass regclass, _origin uuid, _receiver uuid, _exist_object boolean, _exist_collector boolean, _exist_ref boolean);
drop function if exists cluster.__pull(_collector cluster.collector, _object cluster.object, current jsonb, _regclass regclass, _origin uuid, _receiver uuid, _exist_object boolean, _exist_collector boolean, _exist_ref boolean);

drop function if exists cluster.__pull( jsonb );

select * from cluster.break;
select * from auth.colaborador;

create or replace function cluster.__pull( args jsonb ) returns cluster.object
  language plpgsql
as
$$
declare
  /**
    args := {
      _classname: CLASS.NAME

      _current: JSONB
      _change: JSONB
      _outdate: BOOLEAN

      _origin: UID
      _receiver: UID

      _result: BOOLEAN
      _exist_object BOOLEAN
      _exist_collector BOOLEAN

      _object: CLUSTER.OBJECT
      _collector: CLUSTER.COLLECTOR
    }
   */
  _ref jsonb;
  _object cluster.object;
  _collector cluster.collector;

  _regclass regclass default (args->>'_classname')::text::regclass;
  _current jsonb default args->'_current';
  _change jsonb default args->'_change';
  _use_change jsonb;


  _origin uuid default args->>'_origin';
  _receiver uuid default args->>'_receiver';

  _outdate boolean not null default args->>'_outdate';
  _result boolean not null default args->>'_result';
  _exist_collector boolean default args->>'_exist_collector';
  _exist_object boolean default args->>'_exist_object';
  _metadata jsonb;


  _res cluster.object;
begin

  _object := jsonb_populate_record( _object, args->'_object' );
  _collector := jsonb_populate_record( _collector, args->'_collector' );
  _use_change := _change;

  if _current is not null and jsonb_typeof( _current ) != 'object' then
    _current := null;
  end if;

  _ref := coalesce( _object.object_ref, _collector.collector_ref, lib.sets_ref( _regclass, _collector.collector_metadata ) );
  _object.object_ref := _ref;
  _collector.collector_ref := _ref;

  if _ref is null then
    raise exception 'pull reference is null';
  end if;

  if _change is null or  jsonb_typeof( _change ) != 'object' or not exists(
    select * from jsonb_each( _change )
  ) then
    _use_change := _collector.collector_metadata;
  end if;

  if _current is null  then
    _metadata := _collector.collector_metadata;
  else
    _metadata := _current || _use_change;
  end if;

  if _regclass = 'cluster.resource'::regclass then
    _object.object_status := 2;
  else
    _object.object_status := 1;
  end if;

  _collector.collector_cluster_origin = _origin;
  _collector.collector_old = _current;
  _collector.collector_share_regclass = cluster.__format( _regclass );
  _collector.collector_ref = _object.object_ref;
  _collector.collector_metaapply = _metadata;
  _collector.collector_changevalue = _change;
  _collector.collector_usechage = _use_change;

  begin
    if not _outdate and _result and ( _current is null or _current != _metadata ) then
      perform lib.sets_doc(
        _regclass, _metadata,
        ref := _ref
      );
    end if;

    if not coalesce( _exist_collector, false ) then
      insert into cluster.collector (
        collector_transuid,
        collector_uid,
        collector_share_regclass,
        collector_cluster_origin,
        collector_sequence,
        collector_order,
        collector_minseq,
        collector_maxseq,
        collector_ref,
        collector_metadata,
        collector_date,
        collector_version,
        collector_operation,
        collector_old,
        collector_remoteold,
        collector_originold,
        collector_changes,
        collector_metaapply,
        collector_changevalue,
        collector_usechage
      ) values (
         _collector.collector_transuid,
         _collector.collector_uid,
         _collector.collector_share_regclass,
         _collector.collector_cluster_origin,
         _collector.collector_sequence,
         _collector.collector_order,
         _collector.collector_minseq,
         _collector.collector_maxseq,
         _collector.collector_ref,
         _collector.collector_metadata,
         _collector.collector_date,
         _collector.collector_version,
         _collector.collector_operation,
         _collector.collector_old,
         _collector.collector_old,
         _collector.collector_originold,
         _collector.collector_changes,
         _collector.collector_metaapply,
         _collector.collector_changevalue,
         _collector.collector_usechage
       );
    end if;

    if not coalesce( _exist_object, false ) then
      insert into cluster.object(
        object_transuid,
        object_uid,
        object_share_regclass,
        object_cluster_origin,
        object_cluster_receiver,
        object_collector_uid,
        object_ref,
        object_seq,
        object_sseq,
        object_originver,
        object_originsver,
        object_origincver,
        object_originsseq,
        object_originrev,
        object_date,
        object_instant,
        object_receiver,
        object_status,
        object_outdate
      ) values (
         _collector.collector_transuid,
         _object.object_uid,
         cluster.__format( _regclass ),
         _origin,
         _receiver,
         _collector.collector_uid,
         _object.object_ref,
         default,
         default,
         _object.object_originver,
         _object.object_originsver,
         _object.object_origincver,
         _object.object_originsseq,
         _object.object_originrev,
         _object.object_date,
         _object.object_instant,
         now(),
         _object.object_status,
         _outdate
       ) returning * into _res;
    else
      select * into _res
        from cluster.object ob
        where true
          and ob.object_uid = _object.object_uid
          and ob.object_collector_uid = _collector.collector_uid
          and ob.object_transuid = _collector.collector_transuid
          and ob.object_ref = _object.object_ref
          and ob.object_share_regclass = cluster.__format( _regclass )
      ;
    end if;

    if _outdate then return null;
    else return _res;
    end if;

  exception when others then
    <<_ex>>
    declare
      s text; m text; d text; h text; c text;
    begin
      get stacked diagnostics
        s = returned_sqlstate,
        m = message_text,
        d = pg_exception_detail,
        h = pg_exception_hint,
        c = pg_exception_context;

      insert into cluster.break(
        break_collector,
        break_object,
        break_old,
        break_regclass,
        break_origin,
        break_receiver,
        break_sqlstate,
        break_message,
        break_detail,
        break_hint,
        break_context,
        break_ref,
        break_current,
        break_change,
        break_metadata,
        break_document
      ) values (
        to_jsonb( _collector),
        to_jsonb( _object ),
        _current,
        cluster.__format( _regclass ),
        _origin,
        _receiver,
        _ex.s,
        _ex.m,
        _ex.d,
        _ex.h,
        _ex.c,
        _object.object_ref,
        _current,
        _change,
        _metadata,
        _collector.collector_metadata
      );
      return null;
    end;
  end;
end
$$;

