"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updater_1 = require("../../../core/updater");
(0, updater_1.block)(module, { identifier: "maguita_revision_v2_admins-source", flags: ["@unique"],
    // language=PostgreSQL
}).sql `
  create table cluster.source(
    source_uid uuid,
    source_cluster_uid uuid,
    source_branch_uid uuid,
    source_name character varying,
    source_in boolean,
    source_out boolean,
    source_status int2 not null default 1,
    constraint pk_source_id primary key ( source_uid ),
    constraint uk_source_cluster_branch unique ( source_cluster_uid, source_branch_uid ),
    constraint fk_source_to_branch foreign key ( source_branch_uid ) references cluster.branch,
    constraint fk_spurce_to_cluster foreign key ( source_cluster_uid ) references cluster.cluster
  )
`;
(0, updater_1.block)(module, { identifier: "maguita_revision_v2_admins-functions", flags: [],
    // language=PostgreSQL
}).sql `
  create or replace function cluster.sets_cluster_local_private_key( args jsonb ) 
  returns lib.res language plpgsql as $$
  declare
    _local cluster.cluster;
  begin
    _local := cluster._get_cluster_local();
    _local.cluster_private := args->>'cluster_private';
    select (up."returning").* into _local
      from lib.sets_up( _local ) up
    ;
    return lib.res_true( jsonb_build_object(
      'cluster', _local
    ));
  end;
  $$;

  create or replace function cluster.load_local_branch() 
  returns setof jsonb
  language plpgsql as $$
    declare
      _local cluster.cluster;
      _const map.constant;
    begin
      _local := cluster._get_cluster_local();
      _const := map.constant();
      
      return query 
        with __branch as (
          select b.*
            from cluster.source s
              inner join cluster.branch b on s.source_branch_uid = b.branch_uid
            where s.source_cluster_uid = _local.cluster_uid
              and s.source_status = 1
        ) select to_jsonb( b )
            from __branch b
      ;
    end;
  $$;

  create or replace function cluster.sets_sources_list( args jsonb ) 
  returns setof jsonb
  language plpgsql as $$
    declare
      /**
        args := {
          sources:cluster.cluster&cluster.branch & cluster.source
        }
       */
      _record record;
      _cluster cluster.cluster;
      _branch cluster.branch;
      _source cluster.source;
      _const map.constant;
    begin
      _const := map.constant();
      
      for _record in
        with __sources as (
            select 
                e.doc,
                jsonb_populate_record( null::cluster.cluster, e.doc ) as cluster,   
                jsonb_populate_record( null::cluster.branch, e.doc ) as branch,   
                jsonb_populate_record( null::cluster.source, e.doc ) as source   
              from jsonb_array_elements( args->'sources' ) e( doc )
        ) select
              *,
             (s.cluster).*,
             (s.branch).*,
             (s.source).*
           from __sources s
      loop
        
        _cluster := _record.cluster;
        _cluster.cluster_type = _const.cluster_tcluster_remote;
        _cluster.cluster_uid := (cluster._get_cluster( _record.cluster_identifier )).cluster_uid;
        
        select ( "returning" ).* into _cluster
          from lib.sets( _cluster )
        ;
        
        select ( "returning" ).* into _branch
          from lib.sets( _record.branch )
        ;
        
        _source := _record.source;
        _source.source_cluster_uid := _cluster.cluster_uid;
        _source.source_branch_uid := _branch.branch_uid;
        
        select ( "returning" ).* into _source
          from lib.sets( _source );
        return next to_jsonb( _source )|| to_jsonb( _branch ) || to_jsonb( _cluster );
      end loop;
    end;
  $$;
`;
(0, updater_1.block)(module, { identifier: "maguita_revision_v2_move-branch-to-cluster", flags: ["@unique"],
    // language=PostgreSQL
}).sql `
  alter table tweeks.branch set schema cluster;
  create view tweeks.branch as select * from cluster.branch;
`;
(0, updater_1.block)(module, { identifier: "maguita_revision_v2_load-configs", flags: [],
    // language=PostgreSQL
}).sql `
create or replace function cluster.funct_load_configs()
  returns jsonb language plpgsql as $$
  declare
    _local cluster.cluster;
    _master cluster.cluster;
    _branch record;
    _source record;
  begin
    _local := cluster._get_cluster_local();
    _master := cluster._get_cluster_master();
    
    select 
        array_agg( b.branch_uid ) as branch_uid,
        array_agg( b ) as branch
        into _branch
      from cluster.branch b
        inner join source s2 on b.branch_uid = s2.source_branch_uid
      where s2.source_cluster_uid = _local.cluster_uid
    ;
    
    select 
        array_agg( s.source_uid ) as source_uid,
        array_agg( s ) as source
        into _source
      from cluster.source s
        inner join cluster c on s.source_cluster_uid = c.cluster_uid
      where s.source_branch_uid = any ( _branch.branch_uid )
    ;
    
    return jsonb_build_object(
      'local', _local,
      'master', _master,
      'branch', _branch.branch, 
      'branch_uid', _branch.branch_uid, 
      'sources', _source.source,
      'sources_uid', _source.source_uid
    );
  end;
  $$
`;
(0, updater_1.block)(module, { identifier: "maguita_revision_v2_auth", flags: ["@unique"],
    // language=PostgreSQL
}).sql `
  drop table if exists cluster.auth;
  create table if not exists cluster.auth(
    auth_uid uuid default gen_random_uuid(),
    auth_seq serial8 not null,
    auth_key character varying default lib.dset_random_text( 128 ),
    auth_cluster_uid uuid,
    auth_date timestamptz not null default now(),
    auth_status int2 not null default 1,
    auth_close timestamptz default null,
    constraint cluster_auth_uid primary key( auth_uid ),
    constraint fk_auth_to_cluster foreign key ( auth_cluster_uid ) references cluster.cluster
  );
`;
(0, updater_1.block)(module, { identifier: "maguita_revision_v2_auth_domain", flags: ["@unique"],
    // language=PostgreSQL
}).sql `
  select map.constant( 'cluster_auth_status_active', 'int2', 1 );
  select map.constant( 'cluster_auth_status_close', 'int2', 0 );
`;
(0, updater_1.block)(module, { identifier: "maguita_revision_v2_auth", flags: [],
    // language=PostgreSQL
}).sql `
  create or replace function cluster.unlink_cluster(args jsonb)
    returns TABLE(result boolean, message text, data jsonb, error jsonb)
    language plpgsql
  as
  $$
  declare
    _cluster cluster.cluster;
    _const map.constant;
  begin
    _const := map.constant();
    _cluster := jsonb_populate_record( _cluster, args );

    update cluster.cluster
    set cluster_machineid = null,
        cluster_private = null,
        cluster_api = cluster.__create_api()
    where cluster_uid = _cluster.cluster_uid
      and cluster_type = _const.cluster_tcluster_child
    returning * into _cluster;

    if _cluster.cluster_uid is null then
      unlink_cluster.result := false;
      unlink_cluster.message := 'Cluster not found!';
    else
      unlink_cluster.result := true;
    end if;

    return next;
  end;
  $$;
`;
(0, updater_1.block)(module, { identifier: "maguita_revision_v2_auth", flags: [],
    // language=PostgreSQL
}).sql `
  create or replace function cluster.auth( args jsonb )
  returns lib.res
  language plpgsql as $$
  declare
    /*
        export interface AuthRequest {
            cluster_api:string,
            cluster_private:string,
            cluster_machineid:string,
            cluster_identifier:string
        }
        export interface AuthResponse {
            cluster_private?:string,
            auth_uid?:string,
            auth_key?:string,
            sources?:(DataSource&DataCluster&DataBranch)[]
        }
*/
    _args cluster.cluster;
    _cluster cluster.cluster;
    _const map.constant;
    _auth cluster.auth;
    _data record;
  begin
    _const := map.constant();
    _args := jsonb_populate_record( _args, args );
    _cluster := cluster._get_cluster( _args.cluster_identifier );
    if _cluster.cluster_uid is null then
      return lib.res_false( 'Cluster not found' );
    end if;
    
    if _args.cluster_machineid is null then
      return lib.res_false( 'Missing machine id' ); 
    end if;
    
    if _args.cluster_api is null then
      return lib.res_false( 'Required missing API key' ); 
    end if;
    
    if _args.cluster_api != _cluster.cluster_api then
      return lib.res_false( 'Invalid API key' );
    end if;
    
    if _cluster.cluster_machineid is not null and _args.cluster_machineid is null then
      return lib.res_false( 'Invalid machine id, reference another cluster, detach before!' );
    end if;
    
    if (_cluster.cluster_machineid is not null or _cluster.cluster_private is not null ) and _args.cluster_private is null then
      return lib.res_false( 'Required missing private key!' );
    end if;
    
    if _args.cluster_private is not null and _cluster.cluster_private is not null and _cluster.cluster_private != _args.cluster_private then
      return lib.res_false( 'Invalid private key!' );
    end if;
    
    if _cluster.cluster_machineid is null or _cluster.cluster_private  is null then
      update cluster.cluster
        set cluster_machineid = _args.cluster_machineid,
            cluster_private = lib.dset_random_text( 64 )
        where cluster_uid = _cluster.cluster_uid
        returning * into _cluster
      ;
    else
      _cluster.cluster_private := null;
    end if;
    
    update cluster.auth
      set auth_status = _const.cluster_auth_status_close,
          auth_close = now()
      where auth_cluster_uid = _cluster.cluster_uid
        and auth_status = _const.cluster_auth_status_active
    ;
    
    _auth.auth_cluster_uid := _cluster.cluster_uid;
    select ( "returning" ).* into _auth
      from lib.sets_in( _auth );
    
    select array_agg( b.branch_uid ) as branch_uid into _data
      from cluster.branch b
        inner join source s on b.branch_uid = s.source_branch_uid
      where s.source_cluster_uid = _cluster.cluster_uid
    ;
    
    return lib.res_true( jsonb_build_object(
      'cluster_private', _cluster.cluster_private,
      'auth_uid', _auth.auth_uid,
      'auth_key', _auth.auth_key,
      'sources', array(
        select to_jsonb( c) || to_jsonb( s ) || to_jsonb( b )
          from cluster.cluster c
            inner join cluster.source s on c.cluster_uid = s.source_cluster_uid
            inner join cluster.branch b on s.source_branch_uid = b.branch_uid
          where b.branch_uid = any( _data.branch_uid )
    )), 'Auth OK!');
  end;
$$
`;
//# sourceMappingURL=0006-revision-v2-admins.sql.js.map