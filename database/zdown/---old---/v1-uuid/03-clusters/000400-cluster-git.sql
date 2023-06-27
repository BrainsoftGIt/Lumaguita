create or replace function cluster._get_cluster( character varying )
returns cluster.cluster
language sql as $$ select * from cluster.cluster where cluster_identifier = $1 $$;

create or replace function cluster.status( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    PROPOSE: Devolver o atual estado do cluster cluster local, isso é até onde o atual custer conhecer os outros

    args:={}

    return ({
      cluster:[{
        cluster_identifier: CID,
        cluster_version: VN
        cluster_sequence
      }],
      versions:[{
        cluster_identifier: CID,
        share_regclass: SRC,
        version_number: VN,
      }],
      creq:?{
        cluster_version: VN
        cluster_sequence,
        versions: [{
          share_regclass: SRC,
          version_number: VN,
        }]
      }
    })
 */
--   _cluster_identifier character varying default args->>'cluster_identifier';
--   _cluster cluster.cluster;
  _local cluster.cluster;
begin

--   _cluster := cluster._get_cluster( _cluster_identifier );
  _local := cluster._get_cluster_local(  );

  return query with
     __clusters as (
      select
--           c.cluster_uid = _cluster.cluster_uid as _is_cluster_to,
          c.cluster_identifier,
          c.cluster_name,
          c.cluster_path,
          c.cluster_version,
          c.cluster_sequence
        from cluster.cluster c
        group by
--           _cluster.cluster_uid,
          c.cluster_uid
    ), __status as (
      select
          array_agg( c ) as clusters
--           _local.cluster_identifier as cluster_to
--           jsonb_build_object(
--             'status_of',   _cluster.cluster_identifier,
--             'status_in', _local.cluster_identifier
--           ) status,
--           _cv.cluster_version,
--           _cv.cluster_sequence
      from __clusters c
--         inner join __clusters _cv on _cv.cluster_identifier = _cluster.cluster_identifier
--       group by
--         _local.cluster_identifier,
--         _cv.cluster_identifier,
--         _cv.cluster_version,
--         _cv.cluster_sequence
    )
    select to_jsonb( _s )
        from __status _s
  ;
end;
$$;

create or replace function cluster.push( args jsonb )
returns setof jsonb
language plpgsql
as $$
declare
  /**
    PROPOSE: Devolver as modificações que o cluster cliente tem em falta
      Push funciona relativamente ao cluster cliente
    args := {
      cluster_to: CID -- request cluster
      limit:row limit
      clusters :[  -- all cluster include request
          cluster_identifier: CID -- request cluster
          cluster_sequence:   CID -- request cluster
          cluster_version:    CID -- request cluster
      ]
    }
   */
  _local_cluster cluster.cluster;
  _cluster_to character varying default args->>'cluster_to';
  _cluster cluster.cluster;
--   _sequence int8 not null default coalesce( ( args->>'cluster_sequence')::int8, 0 );
  _limit int8 default args->>'limit';
begin

  _local_cluster := cluster._get_cluster_local();
  _cluster := cluster._get_cluster( _cluster_to );

  return query
    with  __clusters_statuas as (
      select
          ( e.doc->>'cluster_identifier' ) as cluster_identifier,
          ( e.doc->>'cluster_identifier' ) = _cluster_to as _is_cluster_to,
          ( e.doc->>'cluster_version' )::int8 as cluster_version,
          ( e.doc->>'cluster_sequence' )::int8 as cluster_sequence
        from jsonb_array_elements( args-> 'clusters' ) e( doc )

    ), __clusters as (
      select _cs.*,
             c.cluster_uid
        from __clusters_statuas _cs
          inner join cluster.cluster c on _cs.cluster_identifier = c.cluster_identifier


    ), __object as (
      select
          o.*,
          rank() over ( partition by o.object_ref order by o.object_seq desc ) as rank,
          min( o.object_seq ) over ( partition by o.object_ref ) as minseq
        from  cluster.object o
          left join __clusters _co on o.object_cluster_origin = _co.cluster_uid
--         where o.object_seq > _sequence
        where o.object_seq > _co.cluster_sequence
          and o.object_cluster_origin != _cluster.cluster_uid
          and o.object_cluster_receiver != _cluster.cluster_uid
          and o.object_originver > _co.cluster_version
    ), __collector as (
      select
        _o.object_uid             ,
        _o.object_originver       ,
        _o.object_originsver      ,
        _o.object_origincver      ,
        _o.object_originsseq      ,
        _o.object_originrev       ,
        _o.object_date            ,
        _o.object_instant         ,
        _o.object_ref             ,
        _o.object_seq             ,

--         _o.object_cluster_origin  ,
--         _o.object_cluster_receiver,
--         _o.object_sseq            ,
--         _o.object_receiver        ,

        col.collector_transuid    ,
        col.collector_uid         ,
        col.collector_sequence    ,
        col.collector_order       ,
        col.collector_minseq      ,
        col.collector_maxseq      ,
        col.collector_metadata    ,
        col.collector_date        ,
        col.collector_version     ,
        col.collector_operation   ,
        col.collector_old         ,

        c.cluster_identifier      as _origin_identifier,
        _o.object_share_regclass  as _regclass
      from __object _o
          inner join cluster.collector col on _o.object_collector_uid = col.collector_uid
          inner join cluster.cluster c on c.cluster_uid = _o.object_cluster_origin
        where _o.rank = 1
      order by _o.minseq
      limit _limit
    ) select to_jsonb( _c )
      from __collector _c;
end;
$$;


drop function cluster.pull( args jsonb );
create or replace function cluster.pull( args jsonb )
  returns setof jsonb
  language plpgsql as $$
  declare
    /**
      PROPOSE: Descaregar para o cluster local todas as modificações vinda dos outros cluster
      args := {
        cluster_from: IDENTIFIER,
        objects: *[]
      }
    */
    _cluster_from character varying default args->>'cluster_from';
    _cluster cluster.cluster;
    _local cluster.cluster;
    _data record;
  begin

    _cluster := cluster._get_cluster( _cluster_from );
    _local := cluster._get_cluster_local(  );



    with __object as (
      select o.*
        from jsonb_array_elements( args->'objects' ) e( document )
          inner join jsonb_populate_record( null::cluster.object, e.document ) o on true
    ) select max( _o.object_seq ) as _cluster_sequence
      into _data
        from __object _o
    ;

    set session_replication_role to replica;
    return query
      with __update as (
        select
            ( e.document->>'_origin_identifier' ) as _origin_identifier,
            ( e.document->>'_regclass' )::regclass as _regclass,
            (jsonb_populate_record( null::cluster.collector, e.document )) as collector,
            (jsonb_populate_record( null::cluster.object, e.document )) as object
          from jsonb_array_elements( args->'objects' ) e ( document )
      ), __new as (
        select _up.*, e.*, corigin.cluster_uid as _origin
          from __update _up
            inner join cluster.cluster corigin on corigin.cluster_identifier = _up._origin_identifier
            left join cluster.object ob on ( _up.object ).object_ref = ob.object_ref
              and (_up.object).object_share_regclass = ob.object_share_regclass
              and (_up.object).object_date > ob.object_date
            left join cluster.__get( ( _up._regclass ), ( _up.object ).object_ref ) e( old ) on true
            left join cluster.collector exist on (_up.collector ).collector_uid = exist.collector_uid
              and ( _up.collector ).collector_transuid = exist.collector_transuid
              and corigin.cluster_uid = exist.collector_cluster_origin

          where ob.object_uid is null
            and exist.collector_uid is null
            and _cluster.cluster_uid is not null
      ) select to_jsonb( o )
          from __new _n
            inner join  cluster.__pull( _n.collector, _n.object, _n.old, _n._regclass, _n._origin, _cluster.cluster_uid ) o on true
--             inner join cluster.collector c on o.object_collector_uid = o.object_collector_uid
--               and o.object_transuid = c.collector_transuid
--               and o.object_share_regclass = c.collector_share_regclass
    ;
    set session_replication_role to default;

    -- Atualizar a versão do cluster
    with __clusters as (
      select
          o.object_cluster_origin,
          max( o.object_originver ) as max_version
        from cluster.object o
        where o.object_cluster_origin != _local.cluster_uid
        group by o.object_cluster_origin
    ) update cluster.cluster c
        set cluster_version = _c.max_version,
            cluster_sequence = case
              when c.cluster_identifier = _cluster_from then _data._cluster_sequence
              else c.cluster_sequence
            end
      from __clusters _c
      where c.cluster_uid = _c.object_cluster_origin
        and c.cluster_version < _c.max_version
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


create or replace function cluster.__get( regclass, jsonb )
returns setof jsonb
language plpgsql as $$
declare

begin
  --language=PostgreSQL
  return query execute replace( $sql$
    select to_jsonb( _t )
      from __tablename _t
      where lib.sets_ref( _t ) = $1
  $sql$, '__tablename', $1::text ) using $2;
end;
$$;

create or replace function cluster.__pull( _collector cluster.collector, _object cluster.object, old jsonb, _regclass regclass, _origin uuid, _receiver uuid )
returns cluster.object
language plpgsql as $$
declare
  _result cluster.object;
begin

  perform lib.sets_doc(
    _regclass,
    _collector.collector_metadata,
    ref := _object.object_ref
  );

  raise notice 'ENTROU COM %', _collector.collector_uid;

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
    collector_old
  ) values (
    _collector.collector_transuid,
    _collector.collector_uid,
    cluster.__format( _regclass ),
    _origin,
    _collector.collector_sequence,
    _collector.collector_order,
    _collector.collector_minseq,
    _collector.collector_maxseq,
    _object.object_ref,
    _collector.collector_metadata,
    _collector.collector_date,
    _collector.collector_version,
    _collector.collector_operation,
    old
  );

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
    object_receiver
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
    now()
  ) returning * into _result;
  return _result;
end;
$$;