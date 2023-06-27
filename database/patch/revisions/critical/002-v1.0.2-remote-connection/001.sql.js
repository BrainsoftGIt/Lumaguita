"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.after = exports.before = exports.name = void 0;
const updater_1 = require("../../../core/updater");
exports.name = "simple-path";
exports.before = [];
exports.after = [];
let blockInstance = (0, updater_1.block)(module, { identifier: "cluster-remote-grants", flags: ["@unique"],
    // language=PostgreSQL
}).sql `
  alter table cluster.cluster add cluster_namespace character varying default null;
  alter table cluster.cluster add constraint uk_cluster_namespace unique ( cluster_namespace );
`;
(0, updater_1.block)(module, { identifier: "cluster.remote-change-001", flags: ["@unique"],
    // language=PostgreSQL
}).sql `
  alter table cluster.cluster add cluster_remote boolean not null default false;
`;
(0, updater_1.block)(module, { identifier: "remote-functions", flags: [],
    // language=PostgreSQL
}).sql `
  create or replace function cluster.load_cluster_by_namespace( namespace character varying)
  returns setof jsonb language sql as $$
    select to_jsonb( c ) from cluster.cluster c where cluster_namespace = namespace;
  $$;

create or replace function cluster.load_clusters_configs_to_child(args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
declare
  /**
    args := {
      cluster_identifier: PATH
      cluster_api: PATH
      cluster_key
    }
   */
  _const map.constant;
  _cluster cluster.cluster;
begin
  _const := map.constant();
  _cluster := jsonb_populate_record( _cluster, args );

  if not exists(
      select *
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
           when c.cluster_type = _const.cluster_tcluster_child then c.cluster_key
           end as cluster_key,

         case
           when c.cluster_type = _const.cluster_tcluster_child then c.cluster_configs
           else jsonb_build_object()
           end as cluster_configs,

         case
           when c.cluster_type = _const.cluster_tcluster_child then c.cluster_grants
           else array[ ]::text[ ]
           end as cluster_grants,

         coalesce( c.cluster_path, '/' ) as cluster_path,

         case
           when c.cluster_type = _const.cluster_tcluster_child then c.cluster_license
           end as cluster_license,
         case
           when c.cluster_type = _const.cluster_tcluster_child then c.cluster_code
           end as cluster_code,

        case
           when c.cluster_type = _const.cluster_tcluster_child then c.cluster_licenselife
           end as cluster_licenselife,

        case
           when c.cluster_type = _const.cluster_tcluster_child then c.cluster_tperiod_id
           end as cluster_tperiod_id,

        case
           when c.cluster_type = _const.cluster_tcluster_child then c.cluster_namespace
           end as cluster_namespace,
       
         c.cluster_name
       
       
       from cluster.cluster c
       where c.cluster_type = _const.cluster_tcluster_local
          or ( c.cluster_identifier = _cluster.cluster_identifier and c.cluster_type = _const.cluster_tcluster_child )
     ) select
     case
       when _c.cluster_type = _const.cluster_tcluster_master and _c.cluster_name is null then to_jsonb( _c )
        - 'cluster_key'
        || jsonb_build_object( 'cluster_name', 'Main Master (trunc)' )
       else to_jsonb( _c )
       end
   from __cluster _c
  ;
end
$$;

create or replace function load_clusters(args jsonb) returns SETOF jsonb
  language plpgsql
as
$$
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
          c.cluster_code,
          c.cluster_path,
          c.cluster_domain,
          c.cluster_licenselife,
          c.cluster_license,
          case
            when c.cluster_name is null and c.cluster_type = _const.cluster_tcluster_local then 'Local server'
            else c.cluster_name
          end as cluster_name,
          c.cluster_port,
          c.cluster_api,
          c.cluster_version,
          c.cluster_grants,
          c.cluster_configs,
          c.cluster_sequence,
          c.cluster_namespace,
          tp.*
        from cluster.cluster c
          left join cluster.tperiod tp on c.cluster_tperiod_id = tp.tperiod_id
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

create or replace function cluster.define_namespace( args jsonb )
returns lib.res
language plpgsql as $$
declare
  /**
    args := {
      cluster_uid: UID
      cluster_namespace: NAMESPACE
    }
   */
  _cluster cluster.cluster;
  _chars character varying[] = regexp_split_to_array( lower( 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-0123456789_'), '' );
  _check record;
begin
  _cluster := jsonb_populate_record( _cluster, args );
  _cluster.cluster_namespace := lower( _cluster.cluster_namespace );
  
  select 
      string_agg( format( '%I posição %s', c.character, c.ordinality ), ', ' ) characters,
      count( * ) as count
      into _check
    from  unnest( regexp_split_to_array( _cluster.cluster_namespace, '' ) ) with ordinality c( character )
    where not c = any( _chars);
  
  if _check.count > 0 then 
    return lib.res_false( format( 'Namespace está invalido! caracteres: %s', _check.characters ) );
  end if;
  
  _cluster.cluster_namespace := lib.str_normalize( _cluster.cluster_namespace );
  if _cluster.cluster_namespace is null then
    return lib.res_false( 'Namespace está invalido ou não definido!' );
  end if;
  
  select ("returning").* into _cluster
    from lib.sets_up( _cluster, ref := lib.sets_ref(_cluster));
  
  return lib.result_true( jsonb_build_object(
    'cluster', _cluster
  ));
end;
$$;

drop function if exists cluster.switch_remote_connection();
drop function if exists cluster.switch_remote_connection( args jsonb );
create or replace function cluster.switch_remote_connection( args jsonb )
returns lib.res
language plpgsql
as $$
declare
  _local cluster.cluster;
  _result cluster.cluster;
begin
  _local := cluster._get_cluster_local();
  _result := jsonb_populate_record( _result, args );
  if _local.cluster_namespace is null then
    return lib.res_true( jsonb_build_object( 'cluster_remote', false, 'cluster_remote_old', false ));
  end if;
  
  update cluster.cluster
    set cluster_remote = _result.cluster_remote 
    where cluster_uid = _local.cluster_uid
    returning * into _result;
  
  return lib.res_true( jsonb_build_object(
    'cluster_remote', _result.cluster_remote,
    'cluster_remote_old', _local.cluster_remote
    
  ));
end;
$$;
`;
//# sourceMappingURL=001.sql.js.map