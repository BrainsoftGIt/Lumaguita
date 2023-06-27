import {Catch, CatchAll, catchFirst} from "zoo.pg/lib/result";
import {catchAll, Templates, Types} from "zoo.pg";
import {
    ArgsLoadRemoteCluster,
    Cluster,
    ObjectRevision,
    ClusterPosition,
    ClusterSource, RevisionRequest, OBJREV, RevisionResult, ClusterResult
} from "../../types";
import {ResourceArgs, ResourceObject, ResourceSets} from "../../resource";

function resolveRow( promise:Promise<any> ): Promise<Catch>{
    return new Promise( ( (resolve ) => {
        promise.then( value => {
            resolve( value );
        }).catch( reason => {
            console.log( reason );
            resolve( null );
        })
    }))
}

function resolveAll( promise:Promise<any>): Promise<CatchAll>{
    return promise.then( value => {
        return Promise.resolve( value );
    }).catch( reason => {
        console.error( reason );
        return Promise.resolve();
    })
}

export class PGClusterSource {
    factory:any;

    constructor( factoryCluster ) {
        this.factory = factoryCluster;
    }

    _get_cluster_local(){
        return resolveRow(catchFirst(
            this.factory.create( Templates.PARAMETERIZED ).sql`
              select * from cluster._get_cluster_local()
        `));



    } load_resource_pendent ( source:ClusterSource ):Promise<(ResourceSets&ResourceObject)[]>{
        return new Promise( resolve => {
            const rows = [];
            this.factory.create( Templates.PARAMETERIZED ).sql`
            select * from cluster.load_resources_pendents( ${ Types.jsonb( source ) } ) data;
        `.stream( row => {
                rows.push( row[ "data" ] );
            }).finally( () => {
                resolve( rows );
            })
        })

    } sets_resources_downloaded ( resObj:ResourceObject ){
        return resolveRow(catchFirst(
            this.factory.create( Templates.PARAMETERIZED ).sql`
              select * from cluster.sets_resources_downloaded( ${ Types.jsonb( resObj )})
        `));

    } switch_remote_connection ( active:boolean ){
        return resolveRow(catchFirst(
            this.factory.create( Templates.PARAMETERIZED ).sql`
              select * from cluster.switch_remote_connection( ${ Types.jsonb({
                cluster_remote: active
              })})
        `));

    } sets_cluster_machine_id ( machineConfigs:ClusterSource&{ cluster_machineid:string } ){
        return resolveRow(catchFirst(
            this.factory.create( Templates.PARAMETERIZED ).sql`
              select * from cluster.sets_cluster_machine_id( ${ Types.jsonb( machineConfigs )})
        `));

    } _get_cluster (source:ClusterSource ){
        return resolveRow(catchFirst(
            this.factory.create( Templates.PARAMETERIZED ).sql`
          select * from cluster._get_cluster( ${ Types.varchar( source.cluster_identifier ) } )
        `))
    };

    _get_cluster_master (){
        return resolveRow(
            catchFirst( this.factory.create( Templates.PARAMETERIZED ).sql`
              select * from cluster._get_cluster_master()
        `))
    };

    _cluster_accept_child ( arg:Cluster){
        return resolveRow( catchFirst( this.factory.create( Templates.PARAMETERIZED ).sql`
          select * from cluster._cluster_accept_child( ${ Types.jsonb( arg ) } ) result
        `))
    };

    sets_cluster_configs (clustersList:Cluster[] ) {
        return resolveRow( catchFirst( this.factory.create( Templates.PARAMETERIZED ).sql`
          select * from cluster.sets_cluster_configs( ${ Types.jsonb( { "clusters": clustersList } ) } ) status
        `))
    };

    create_resource ( arg:ResourceArgs ):Promise<ResourceSets[]> {
        return resolveAll( catchAll( this.factory.create( Templates.PARAMETERIZED ).sql`
          select * from cluster.create_resource( ${ Types.jsonb( arg ) } )
        `)).then( value => Promise.resolve( value.rows ) )
            .catch( reason => {
                console.error( reason );
                return Promise.reject( null );
            })
    };

    sets_cluster_remote (clustersList:Cluster[] ) {
        return resolveRow( catchFirst( this.factory.create( Templates.PARAMETERIZED ).sql`
          select * from cluster.sets_cluster_remote( ${ Types.jsonb( { "clusters": clustersList } ) } ) status
        `))
    };
    sets_cluster_tree_position ( clusterPosition:ClusterPosition ):Promise<Cluster> {
        return resolveRow(
            catchFirst( this.factory.create( Templates.PARAMETERIZED ).sql`
              select * from cluster.sets_cluster_tree_position( ${ Types.jsonb( clusterPosition ) })
              `)
        ).then( value => Promise.resolve( value.row ) );
    };

    status  ( ) {
        return resolveRow( catchFirst( this.factory.create( Templates.PARAMETERIZED ).sql`
          select * from cluster.status( ${ Types.jsonb({} ) } ) status
        `))
    } accept_revision  ( arg:ClusterSource) {
        return resolveRow( catchFirst( this.factory.create( Templates.PARAMETERIZED ).sql`
          select * from cluster.accept_revision( ${ Types.jsonb( arg ) } ) status
        `))

   } can_send_revision  ( arg:ClusterSource&{ cluster_grants:string[] }) {
        return resolveRow( catchFirst( this.factory.create( Templates.PARAMETERIZED ).sql`
          select * from cluster.can_send_revision( ${ Types.jsonb( arg ) } ) can_send
        `))


    } accept_remote_cluster  ( arg:ClusterSource) {
        return resolveRow( catchFirst( this.factory.create( Templates.PARAMETERIZED ).sql`
          select * from cluster.accept_remote_cluster( ${ Types.jsonb( arg ) } ) status
        `))
    };

    cluster_push (args:RevisionRequest ):Promise<ObjectRevision[]> {
        return new Promise( resolve => {
            const rows = [];
            this.factory.create( Templates.PARAMETERIZED ).sql`
            select * from cluster.push( ${ Types.jsonb( args ) } ) data;
        `.stream( row => {
                rows.push( row[ "data" ] );
            }).finally( () => {
                resolve( rows );
            })
        })
    };

    load_clusters_configs_to_child (clusterChild:Cluster ):Promise<any[]> {
        return new Promise( resolve => {
            const rows = [];
            this.factory.create( Templates.PARAMETERIZED ).sql`
            select * from cluster.load_clusters_configs_to_child( ${ Types.jsonb( clusterChild ) } ) data;
        `.stream( row => {
                rows.push( row[ "data" ] );
            }).finally( () => {
                resolve( rows );
            });
        });
    };

    clusterPullFrom  ( args ):Promise<RevisionResult> {
        return new Promise( resolve => {
            const rows = [];
            this.factory.create( Templates.PARAMETERIZED ).sql`
              select * from cluster.pull( ${ Types.jsonb( args ) } ) data;
            `.stream( row => {
                rows.push( row[ "data" ] );
            }).finally( () => {
                const status: ClusterResult[] = rows.pop();
                const revisions:ObjectRevision[] = rows;
                const res:RevisionResult = {
                    status,
                    revisions
                }
                resolve( res );
            })
        })
    };

    load_clusters_local_as_remotes  (source:ArgsLoadRemoteCluster ):Promise<Cluster[]> {
        return new Promise( resolve => {
            const rows = [];
            this.factory.create( Templates.PARAMETERIZED ).sql`
              select * from cluster.load_clusters_local_as_remotes( ${ Types.jsonb( source ) } ) data;
            `.stream( row => {
                rows.push( row[ "data" ] );
            }).finally( () => {
                resolve( rows );
            })
        })
    }

    load_cluster_by_namespace  ( namespace:string ):Promise<Cluster> {
        return new Promise( resolve => {
            const rows = [];
            this.factory.create( Templates.PARAMETERIZED ).sql`
              select * from cluster.load_cluster_by_namespace( ${ Types.varchar( namespace ) } ) data;
            `.stream( row => {
                resolve( row )
            }).finally( () => {
                resolve( null );
            })
        })
    }
}