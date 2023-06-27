create or replace function cluster._get_cluster_master()
returns  cluster.cluster language plpgsql as $$
declare
  _const map.constant;
  _cluster cluster.cluster;
begin
  _const := map.constant();
  select c.* into _cluster
    from cluster.cluster c
    where c.cluster_type = _const.cluster_tcluster_master
  ;
  return _cluster;
end;
$$;

create or replace function cluster.load_clusters( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  _const map.constant;
begin
  _const := map.constant();
  return query with
    __cluster as (
      select
          c.cluster_uid,
          c.cluster_identifier,
          c.cluster_type,
          c.cluster_path,
          c.cluster_domain,
          case
            when c.cluster_name is null and c.cluster_type = _const.cluster_tcluster_local then 'Local server'
            else c.cluster_name
          end as cluster_name,
          c.cluster_port,
          c.cluster_api,
          c.cluster_version,
          c.cluster_grants,
          c.cluster_configs,
          c.cluster_sequence
        from cluster.cluster c
    ) select to_jsonb( _c )
      from __cluster _c
      order by case
        when _c.cluster_type = _const.cluster_tcluster_local then 1
        when _c.cluster_type = _const.cluster_tcluster_master then 2
        when _c.cluster_type = _const.cluster_tcluster_child then 3
        when _c.cluster_type = _const.cluster_tcluster_remote then 4
      end,
      _c.cluster_name
  ;
end;
$$;

select * from cluster.load_clusters_local_as_remotes( '{"cluster_path":"/dev", "cluster_grants":[]}' );
select * from cluster.accept_revision( '{"cluster_path":"/dev" }' );

drop function if exists cluster.load_clusters_remotes( args jsonb );
create or replace function cluster.load_clusters_local_as_remotes( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    args := {
      cluster_path: PATH,
      cluster_grants:grants
    }
   */
  _cluster cluster.cluster;
  _const map.constant;
begin
  _const := map.constant();
  _cluster := jsonb_populate_record( _cluster, args );



  return query with
    __cluster as (
      select
          c.cluster_identifier,
          c.cluster_name,
          c.cluster_path,
          _const.cluster_tcluster_remote as cluster_type
        from cluster.cluster c
        where c.cluster_type = _const.cluster_tcluster_local
          and cluster.can_send_revision( args )
    ) select to_jsonb( _c )
      from __cluster _c
  ;
end;
$$;

create or replace function cluster.load_clusters_configs_to_child( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    args := {
      cluster_identifier: PATH
      cluster_api: PATH
    }
   */
  _const map.constant;
  _cluster cluster.cluster;
begin
  _const := map.constant();
  _cluster := jsonb_populate_record( _cluster, args );

  if not exists(
    select
      from cluster.cluster c
      where c.cluster_api = _cluster.cluster_api
        and c.cluster_identifier = _cluster.cluster_identifier
        and c.cluster_type = _const.cluster_tcluster_child
  ) then
    return;
  end if;

  return query with
    __cluster as (
      select
          c.cluster_identifier,
          case
            when c.cluster_type = _const.cluster_tcluster_child then _const.cluster_tcluster_local
            when c.cluster_type = _const.cluster_tcluster_local then _const.cluster_tcluster_master
          end as cluster_type,
          case
            when c.cluster_type = _const.cluster_tcluster_child then c.cluster_configs
            else jsonb_build_object()
          end as cluster_configs,
          case
            when c.cluster_type = _const.cluster_tcluster_child then c.cluster_grants
            else array[ ]::text[ ]
          end as cluster_grants,
          c.cluster_path,
          c.cluster_name
        from cluster.cluster c
        where c.cluster_type = _const.cluster_tcluster_local
          or ( c.cluster_identifier = _cluster.cluster_identifier and c.cluster_type = _const.cluster_tcluster_child )
    ) select
        case
          when _c.cluster_type = _const.cluster_tcluster_master and _c.cluster_name is null then to_jsonb( _c ) || jsonb_build_object(
            'cluster_name', 'Main Master (trunc)'
          )
          else to_jsonb( _c )
        end
      from __cluster _c
  ;
end
$$;


create or replace function cluster._cluster_accept_child( args jsonb )
returns boolean
language plpgsql as $$
declare
  _cluster cluster.cluster;
  _const map.constant;
begin
  _cluster := jsonb_populate_record( _cluster, args );
  _const := map.constant();
  return exists(
    select *
      from cluster.cluster c
      where c.cluster_identifier = _cluster.cluster_identifier
        and c.cluster_type = _const.cluster_tcluster_child
        and c.cluster_api = _cluster.cluster_api
  );
end;
$$;


create or replace function cluster.sets_clusters_admin( args jsonb )
returns lib.res
language plpgsql as $$
  declare
    /**
      args := {

      }
     */
    _cluster cluster.cluster;
    _result cluster.cluster;
    _const map.constant;
    _master cluster.cluster;
    _local cluster.cluster;
    _doc jsonb default jsonb_build_object();
  begin
    _const := map.constant();
    _cluster := jsonb_populate_record( _cluster, args );




    -- Quando for o cluster master
    if _cluster.cluster_type = _const.cluster_tcluster_master then
--       raise exception 'Master:%', args;
      _master := cluster._get_cluster_master();
      _master.cluster_domain := _cluster.cluster_domain;
      _master.cluster_api := _cluster.cluster_api;
      _master.cluster_port := _cluster.cluster_port;
      _master.cluster_type := _const.cluster_tcluster_master;
      _master.cluster_name := coalesce( _master.cluster_name, 'Master' );
      select ( "returning" ).* into _result from lib.sets( _master );
      _doc := _doc || jsonb_build_object( 'master', _result );

      _local := cluster._get_cluster_local();
      _local.cluster_name := coalesce( _local.cluster_name, 'Local' );
      _local.cluster_identifier := _cluster.cluster_identifier;
      select ( "returning" ).* into _result from  lib.sets( _local );
      _doc := _doc || jsonb_build_object( 'local', _result );

    elseif _cluster.cluster_type = _const.cluster_tcluster_child then
--       raise exception 'Child:%', args;

      _cluster.cluster_identifier := cluster.__create_identifier();
      _cluster.cluster_api := cluster.__create_api();
      select ( "returning" ).* into _result from lib.sets( _cluster );
      _doc := _doc || jsonb_build_object( 'child', _result );
    end if;

--     raise exception 'Nenhum:%', args;


    return lib.res_true( _doc );
  end;
$$;


create or replace function cluster.sets_cluster_remote( args jsonb )
  returns lib.res
  language plpgsql as $$
declare
  /**
    args := {
      clusters: [{
        cluster_uid
        cluster_identifier
        cluster_receive
        cluster_send
        cluster_path
        cluster_name
        cluster_domain
        cluster_port
      }]
    }
   */
  _const map.constant;
  _data record;
begin
  _const := map.constant();

  with __clusters as (
    select c as _cluster, e.doc as cluster_replace
      from jsonb_array_elements( args->'clusters' ) e( doc )
        inner join jsonb_populate_record( null::cluster.cluster, e.doc ) _clu on true
        left join cluster.cluster c on
          ( _clu.cluster_identifier = c.cluster_identifier and c.cluster_type = _const.cluster_tcluster_remote )
      where _clu.cluster_identifier not in (
        select c.cluster_identifier
          from cluster.cluster c
          where c.cluster_type != _const.cluster_tcluster_remote
      )
  ), __sets as (
    select s."returning" as cluster
      from __clusters _c
        inner join lib.sets( _c._cluster, _c.cluster_replace ) s on true
  ) select array_agg( s.cluster ) as clusters into _data
      from __sets s
  ;

  return lib.res_true(  to_jsonb( _data ) );
end;
$$;

drop function if exists cluster.sets_cluster( args jsonb );
create or replace function cluster.sets_cluster_configs( args jsonb )
  returns lib.res
  language plpgsql as $$
declare
  /**
    args := {
      clusters: [{
        cluster_uid
        cluster_identifier
        cluster_path
        cluster_name
        cluster_domain
        cluster_port
      }]
    }
   */
  _const map.constant;
  _data record;
begin
  _const := map.constant();

  with __clusters as (
    select c as _cluster, e.doc as cluster_replace
      from jsonb_array_elements( args->'clusters' ) e( doc )
        inner join jsonb_populate_record( null::cluster.cluster, e.doc ) _clu on true
        inner join cluster.cluster c on _clu.cluster_identifier = c.cluster_identifier
          or ( _clu.cluster_type = c.cluster_type and _clu.cluster_type in (
            _const.cluster_tcluster_master, _const.cluster_tcluster_local
          ))
  ), __sets as (
    select s."returning" as cluster
      from __clusters _c
        inner join lib.sets( _c._cluster, _c.cluster_replace ) s on true
  ) select array_agg( s.cluster ) as clusters into _data
      from __sets s
  ;

  return lib.res_true(  to_jsonb( _data ) );
end;
$$;

create or replace function cluster.sets_cluster_tree_position( args jsonb )
returns setof cluster.cluster
language plpgsql as $$
declare
  _const map.constant;
  _cluster cluster.cluster;
begin
  _cluster := jsonb_populate_record( cluster._get_cluster_local(), args );
  _const := map.constant();
  return query
    select ( "returning" ).*
      from lib.sets_up( _cluster );
end;
$$;

create or replace function cluster.load_paths( args jsonb default json_build_object())
returns setof text
language sql as $$ select distinct lower( cluster_path ) from cluster.cluster where cluster_path is not null order by lower( cluster_path ) $$;

-- select * from jsonb_each_text( '{"child": true, "sub-folder": true, "accept-child": false, "accept-sub-path": false, "_is_suber_folder": false, "_local.cluster_path": "/", "_cluster.cluster_path": "/simula", "_master.cluster_identifier": null, "_cluster.cluster_identifier": "HXJO-7L9SJ-752"}' );


drop function if exists cluster.can_send_revision( args jsonb );
create or replace function cluster.can_send_revision( args jsonb )
returns boolean
language plpgsql as $$
declare
  /**
    args := {
      cluster_identifier
      cluster_path
      cluster_grants
    }
   */
  _remote cluster.cluster;
  _master cluster.cluster;

  _local cluster.cluster;
  _remote_child cluster.cluster;
  _local_is_master_of_remote boolean;
  _local_is_child_of_remote boolean;
  _local_is_sub_path_of_remote boolean;
  _const map.constant;

begin
  _const := map.constant();
  _remote := jsonb_populate_record( _remote, args );
  _local := cluster._get_cluster_local();
  _master := cluster._get_cluster_master();

  _local.cluster_path := coalesce( _local.cluster_path, '/' );
  _remote.cluster_path := coalesce( _remote.cluster_path, '/' );

--   if _local.cluster_identifier = _remote.cluster_identifier then return; end if;
  if _local.cluster_identifier = _remote.cluster_identifier then return false; end if;

    select * into _remote_child
      from cluster.cluster c
      where c.cluster_identifier = _remote.cluster_identifier
        and c.cluster_type = _const.cluster_tcluster_child
  ;

--   return next jsonb_build_object(
--     '01', _local.cluster_path = _remote.cluster_path,
--     '02', _local_is_master_of_remote,
--     '03', _local_is_sub_path_of_remote and _const.cluster_grant_revision_sub_path = any( _remote.cluster_grants ) ,
--     '04',  _local_is_child_of_remote and _const.cluster_grant_revision_child = any( _local.cluster_grants )
--   );

  _local_is_master_of_remote := _remote_child.cluster_identifier is not null;
  _local_is_sub_path_of_remote := cluster.__is_sub_path( _remote.cluster_path, _local.cluster_path );
  _local_is_child_of_remote := _master.cluster_identifier = _remote.cluster_identifier;

  return (
    coalesce( _local.cluster_path = _remote.cluster_path, false )
      or coalesce( _local_is_master_of_remote, false )
      or coalesce( _local_is_sub_path_of_remote and _const.cluster_grant_revision_sub_path = any( _remote.cluster_grants ), false )
      or coalesce( _local_is_child_of_remote and _const.cluster_grant_revision_child = any( _local.cluster_grants ), false )
  );
end;
$$;


create or replace function cluster.accept_revision( args jsonb )
returns setof jsonb
language plpgsql as $$
declare
  /**
    args := {
      cluster_identifier
      cluster_path
    }
   */
  _master cluster.cluster;
  _local cluster.cluster;
  _remote_child cluster.cluster;
  _remote cluster.cluster;

  _const map.constant;

  _local_is_child_of_remote boolean;
  _local_is_super_path_remote boolean;
  _local_is_master_of_remote boolean;
begin



  _remote := jsonb_populate_record( _remote, args );
  _master := cluster._get_cluster_master();

  _const := map.constant();
  _local := cluster._get_cluster_local();
  _local.cluster_path := coalesce( _local.cluster_path, '/' );
  _remote.cluster_path := coalesce( _remote.cluster_path, '/' );

  if _local.cluster_identifier = _remote.cluster_identifier then return; end if;

  select * into _remote_child
    from cluster.cluster c
    where c.cluster_type = _const.cluster_tcluster_child
      and c.cluster_identifier = _remote.cluster_identifier
  ;


  _local_is_child_of_remote := _master.cluster_identifier = _remote.cluster_identifier;
  _local_is_super_path_remote := cluster.__is_sub_path( _local.cluster_path, _remote.cluster_path );
  _local_is_master_of_remote := _remote_child.cluster_identifier is not null;

  if not (
    coalesce( _local.cluster_path = _remote.cluster_path, false )
    or coalesce( _local_is_child_of_remote, false )
    or coalesce( _local_is_super_path_remote and _const.cluster_grant_revision_sub_path = any( _local.cluster_grants ), false )
    or coalesce( _local_is_master_of_remote and _const.cluster_grant_revision_child = any ( _remote_child.cluster_grants ), false )
  ) then return; end if;

  return query
    select *
      from cluster.status( args );
end;
$$;

drop function cluster.accept_remote_cluster( args jsonb );
create or replace function cluster.accept_remote_cluster( args jsonb )
returns setof boolean
language plpgsql as $$
declare
  _cluster cluster.cluster;
  _local cluster.cluster;
  _is_sub_path boolean;
  _const map.constant;

  _can_receiver_sub_path_revision boolean;
begin
  _cluster := jsonb_populate_record( _cluster, args );

  _const := map.constant();
  _local := cluster._get_cluster_local();
  _is_sub_path := cluster.__is_sub_path( _local.cluster_path, _cluster.cluster_path );
  _local.cluster_path := coalesce( _local.cluster_path, '/' );
  _cluster.cluster_path := coalesce( _cluster.cluster_path, '' );
  _can_receiver_sub_path_revision := _const.cluster_grant_revision_sub_path = any( _local.cluster_grants );

  if not (
    _cluster.cluster_path = _local.cluster_path
      or ( _is_sub_path and _can_receiver_sub_path_revision )
  ) then return; end if;

  return query select true;
end
$$;



create or replace function cluster.__is_sub_path( base text, child_path text )
returns boolean
language plpgsql as $$
declare
  _left text;
  _right text;
  _right_char char;
  _left_char char;
begin
  if child_path is null or base is null then return false; end if;
  if substr( base, length( base ) ) = '/' then base := substr( base, 1, length( base )-1 ); end if;
  if substr( child_path, length( child_path ) ) = '/' then child_path := substr( child_path, 1, length( child_path )-1 ); end if;

  if length( base ) >= length( child_path ) then return false; end if;

  _left := substr( child_path, 1, length(  base ) );
  _right := substr( child_path, length( base ) +1, length( child_path ) );
  _right_char := (regexp_split_to_array( _right, '' ) )[1];
  _left_char := (regexp_split_to_array( _left, '' ) )[1];


  return _left is not  null
    and _right is not null
    and _right_char is not null
    and _left = base
    and _right_char = '/'
  ;
end
$$;

select 'connected on', inet_client_addr(), inet_server_port(), "current_user"(), current_database();
