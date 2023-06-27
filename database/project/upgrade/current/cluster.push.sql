create or replace function cluster.status( args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
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
--   _local cluster.cluster;
begin

  --   _cluster := cluster._get_cluster( _cluster_identifier );
--   _local := cluster._get_cluster_local(  );

  return query with
  __clusters as (
     select
       c.cluster_identifier,
       c.cluster_name,
       c.cluster_path,
       c.cluster_version,
       c.cluster_sequence,
       c.cluster_verbose
     from cluster.cluster c
       group by c.cluster_uid
  ) select to_jsonb( array_agg( c ) )
  from __clusters c
  ;
end;
$$;
drop function if exists cluster.reduce(jsonb, keys text[]);
create or replace function cluster.change( jsonb, variadic keys text[] ) returns jsonb
  immutable
  strict
  language sql
as
$$
  with __values as (
    select *
      from jsonb_each( $1 ) e
      where e.key = any ( keys )
  ) select jsonb_object_agg( e.key, e.value )
  from __values e
$$;

create or replace function cluster.reduce( variadic jsonb[] )
returns jsonb
strict
immutable
language sql as $$
  select jsonb_object_agg( it.key, it.value order by e.index, it.index )
    from unnest( $1 ) with ordinality e( document, index )
      inner join jsonb_each( e.document ) with ordinality it( key, value, index ) on e.document ? it.key
$$;

drop function if exists tweeks.push(args jsonb);
drop function if exists cluster.push(args jsonb);


create or replace function cluster.push( args jsonb ) returns SETOF jsonb
  language plpgsql
as
$$
declare
  /**
    PROPOSE: Devolver as modificações que o cluster cliente tem em falta
      Push funciona relativamente ao cluster cliente
    args := {
      request:*CLUSTER{
        cluster_identifier
        cluster_path,
        cluster_grants
      }
      limit:row limit
      clusters :[  -- all cluster include request
          cluster_identifier: CID -- request cluster
          cluster_sequence:   CSE
          cluster_version:    CVE
          cluster_verbose:    CVB
      ]
    }
   */
  _local cluster.cluster;
  _master cluster.cluster;
  _child cluster.cluster;
  _request cluster.cluster;
  _const map.constant;
  _limit int8 default args->>'limit';
  _cluster cluster.cluster;
begin
  _const := map.constant();
  _local := cluster._get_cluster_local();
  _master := cluster._get_cluster_master();
  _request := jsonb_populate_record( _request, args->'request' );
  _child := cluster._get_cluster_child( _request.cluster_identifier );
  select * into _cluster
    from cluster.cluster c
    where c.cluster_identifier = _request.cluster_identifier
  ;

  if _cluster.cluster_identifier is null then return; end if;
  if _cluster.cluster_type = _const.cluster_tcluster_child then
    _request := _cluster;
  else
    _request.cluster_uid = _cluster.cluster_uid;
  end if;

  return query
    with  __clusters_statuas as (
      select
          ( e.doc->>'cluster_identifier' ) as cluster_identifier,
          ( e.doc->>'cluster_identifier' ) = _request.cluster_identifier as _is_cluster_to,
          ( e.doc->>'cluster_version' )::int8 as cluster_version,
          ( e.doc->>'cluster_sequence' )::int8 as cluster_sequence,
          ( e.doc->>'cluster_verbose' )::boolean as cluster_verbose
        from jsonb_array_elements( args-> 'clusters' ) e( doc )

    ), __clusters as (
      select _cs.*,
             c.cluster_uid
        from __clusters_statuas _cs
          inner join cluster.cluster c on _cs.cluster_identifier = c.cluster_identifier

    ), __objects as (
      select
          o.*,
          o as _obj,
          array_agg( cluster.change( col.collector_metadata, variadic col.collector_changes )
            order by oi.object_seq
          ) as _change
        from  cluster.object o
          left join __clusters _co on o.object_cluster_origin = _co.cluster_uid
          left join cluster.object oi on o.object_seq > _co.cluster_sequence
            and o.object_ref = oi.object_ref
            and o.object_share_regclass = oi.object_share_regclass
            and oi.object_seq <= o.object_seq
          left join cluster.collector col on oi.object_collector_uid = col.collector_uid
            and oi.object_transuid = col.collector_transuid
            and oi.object_share_regclass = col.collector_share_regclass
            and oi.object_ref = col.collector_ref

        where o.object_seq > _co.cluster_sequence
          and ( o.object_cluster_origin != _request.cluster_uid or _co.cluster_verbose )
          and ( o.object_cluster_receiver != _request.cluster_uid or _co.cluster_verbose )
          and o.object_originver > _co.cluster_version
        group by o.object_uid,
          o.object_share_regclass,
          o.object_cluster_origin

    ), __ranks as (
      select
          o.*,
          rank() over ( partition by o.object_ref order by o.object_seq desc ) as rank,
          min( o.object_seq ) over ( partition by o.object_ref ) as minseq
        from  __objects o
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

        col.collector_metadata    ,
        col.collector_changes     ,
        col.collector_transuid    ,
        col.collector_uid         ,
        col.collector_sequence    ,
        col.collector_order       ,
        col.collector_minseq      ,
        col.collector_maxseq      ,
        col.collector_date        ,
        col.collector_version     ,
        col.collector_operation   ,
        col.collector_old         ,
        col.collector_originold   ,

        _origin.cluster_identifier as _origin_identifier,
        _o.object_share_regclass   as _regclass,
        _o.rank = 1 as _result,
        coalesce( cluster.reduce( variadic _o._change ), col.collector_metadata ) as _change
      from __ranks _o
          inner join cluster.collector col on _o.object_collector_uid = col.collector_uid
            and _o.object_transuid = col.collector_transuid
            and _o.object_share_regclass = col.collector_share_regclass
            and _o.object_ref = col.collector_ref
          inner join cluster.cluster _origin on _origin.cluster_uid = _o.object_cluster_origin
        where true
         and cluster.can_send_object( _o._obj, col, _origin, _request, _local, _master, _child, _const )
      order by _o.object_seq
      limit _limit
    ) select to_jsonb( _c )
      from __collector _c;
end;
$$;
