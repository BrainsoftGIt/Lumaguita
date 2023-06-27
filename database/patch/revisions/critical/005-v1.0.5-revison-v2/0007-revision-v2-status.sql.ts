import {block} from "../../../core/updater";

block(module, { identifier: "v2-status" }).sql`
    create function cluster.status(args jsonb) returns SETOF jsonb
      language plpgsql
    as
    $$
    declare
      /**
        PROPOSE: Devolver o atual estado do cluster cluster local, isso é até onde o atual custer conhecer os outros
    
        args:={
            cluster_identifier:strint
        }
    
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
      _cluster_identifier character varying default args->>'cluster_identifier';
      _cluster cluster.cluster;
      _local cluster.cluster;
      _data record;
    begin
    
      _cluster := cluster._get_cluster( _cluster_identifier );
      _local := cluster._get_cluster_local(  );
      
      select array_agg( s.source_branch_uid ) as _branch_uid  into _data
        from cluster.source s
        where s.source_cluster_uid = _cluster.cluster_uid
      ;
    
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
                inner join cluster.source s  on c.cluster_uid = source.source_cluster_uid
                  and ( s.source_branch_uid = any( _data._branch_uid ) or c.cluster_uid = _local.cluster_uid )
              group by c.cluster_uid
          ) select to_jsonb( array_agg( c ) )
          from __clusters c
      ;
    end;
    $$;
`