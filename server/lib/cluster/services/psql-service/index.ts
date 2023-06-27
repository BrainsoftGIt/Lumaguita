import {
    ArgsLoadRemoteCluster,
    Cluster,
    ClusterPosition,
    ClusterPullResult,
    ClusterService,
    ClusterSource, RevisionRequest, ObjectRevision, RevisionResult
} from "../../types";
import { PostgresFactory } from "zoo.pg";
import { PGClusterSource } from "./data-source";
import {ResourceArgs, ResourceObject, ResourceSets} from "../../resource";

export class PostgresClusterService implements ClusterService{
    private readonly replicate:PGClusterSource;
    private readonly source:PGClusterSource;
    private _cluster_key:string;
    private _localCluster:Cluster;
    private _masterCluster:Cluster;

    constructor ( factory:PostgresFactory, source:PostgresFactory ) {
        this.replicate = new PGClusterSource( factory )
        this.source = new PGClusterSource( source )
    }

    switchRemoteConnection( active:boolean ): Promise<{ result:boolean, old:boolean }> {
        return this.replicate.switch_remote_connection( active ).then( value => {
            let _result = { result:value.row?.result && value.row?.data?.cluster_remote, old: value.row?.result && value.row?.data?.cluster_remote_old };
            this.loadLocalCluster().then()
            return Promise.resolve( _result );
        }).catch( reason => Promise.resolve({ result:false, old:false } ) );
    }

    get currentLocalCluster():Cluster{
        return this._localCluster;
    }

    get currentMasterCluster():Cluster{
        return this._masterCluster;
    }

    async privateKey():Promise<string>{
        if( !this._cluster_key ) await this.loadLocalCluster();
        return Promise.resolve( this._cluster_key );

    } async identifier(){
        if(!this._localCluster ) await this.loadLocalCluster();
        return Promise.resolve( this._localCluster.cluster_identifier );

    } async setsResourceDownloaded( source:ResourceObject ){
        return this.replicate.sets_resources_downloaded( source ).then( value => {
            console.log( "RESOURCE MARKED AS DOWNLOADED" );
        });
    } async loadResourcePendent( source:ClusterSource ):Promise<(ResourceSets&ResourceObject)[]>{
        return this.replicate.load_resource_pendent( source );
    } async localCluster():Promise<Cluster>{
        if( !this._localCluster ) await this.loadLocalCluster();
        return Promise.resolve( this._localCluster );

    } async masterCluster():Promise<Cluster>{
        if(!this._localCluster ) await this.loadMasterCluster();
        return Promise.resolve( this._masterCluster );

    } async createResource(args:ResourceArgs):Promise<ResourceSets[]>{
        return Promise.resolve( this.source.create_resource( args ) );
    } async path():Promise<String>{
        if(!this._localCluster ) await this.loadLocalCluster();
        return Promise.resolve( this._localCluster.cluster_path );

    } canAcceptClusterWithMachine(cluster: ClusterSource&{ cluster_machineid:string }): Promise<{ result:boolean, data:Cluster, message:string }> {
        return this.replicate.sets_cluster_machine_id( cluster ).then( value => {
            return Promise.resolve(  value.row );
        })

    } loadCluster( source: ClusterSource ): Promise<Cluster> {
        return this.replicate._get_cluster( source ).then(value => {
            return Promise.resolve( value.row );
        })

    } loadLocalCluster(){
        return this.replicate._get_cluster_local( ).then( value =>{
            this._cluster_key = value.row.cluster_key;
            this._localCluster = value.row;
            delete this._localCluster[ "cluster_key" ];
            return Promise.resolve( this._localCluster );
        });

    } loadMasterCluster(){
        return this.replicate._get_cluster_master().then( value => {
            this._masterCluster = value.row;
            return Promise.resolve( value.row )
        })

    } async acceptChild( child){
        return this.replicate._cluster_accept_child( child ).then( value => {
            return Promise.resolve( value?.row?.result )
        } )

    } async status( ): Promise<Cluster[]> {
        return this.replicate.status().then( value => Promise.resolve( value?.row?.status ) );

    } async acceptRevision(cluster: ClusterSource ): Promise<Cluster[]> {
        return this.replicate.accept_revision( cluster ).then( value =>{
            return Promise.resolve( value?.row?.status );
        }).catch( reason => {
            return Promise.resolve( reason );
        })
    } async canSendRevision(cluster: ClusterSource&{ cluster_grants:string[]} ): Promise<boolean> {
        return this.replicate.can_send_revision( cluster ).then( value =>{
            return Promise.resolve( !!value?.row?.can_send );
        }).catch( reason => {
            return Promise.resolve( reason );
        })
    } async acceptRemoteCluster(cluster: ClusterSource): Promise<Cluster[]> {
        return this.replicate.accept_remote_cluster( cluster ).then( value =>{
            return Promise.resolve( value?.row?.status );
        } );

    } pushTo( status:RevisionRequest ) {
        return this.replicate.cluster_push( status ).then(objets => {
            if( objets.length === 0 ) return ;

            return Promise.resolve( objets );
        });

    } pullFrom( revisions):Promise<RevisionResult> {
        return this.replicate.clusterPullFrom( revisions ).then( revisionObjects => Promise.resolve( revisionObjects))

    } marksClusterPosition( position: ClusterPosition): Promise<Cluster> {
        return this.replicate.sets_cluster_tree_position( position );

    } updateStatusOf(result: ClusterPullResult): Promise<void> {
        return Promise.resolve(undefined);

    } loadLocalAsRemoteClusters(source:ArgsLoadRemoteCluster ): Promise<Cluster[] > {
        return this.replicate.load_clusters_local_as_remotes( source ).then(value => {
            return Promise.resolve( value );
        } )

    } loadClusterByNamespace( namespace:string ): Promise<Cluster > {
        return this.replicate.load_cluster_by_namespace( namespace ).then(value => {
            return Promise.resolve( value );
        } )

    } setsClusterConfigs( args): Promise<any > {
        return this.replicate.sets_cluster_configs( args ).then(value => {
            return Promise.resolve( value );
        })

    } setsClusterRemote( args): Promise<any > {
        return this.replicate.sets_cluster_remote( args ).then(value => {
            return Promise.resolve( value );
        })

    } loadClusterConfigToChild(args): Promise<any > {
        return this.replicate.load_clusters_configs_to_child( args ).then(value => {
            return Promise.resolve( value );
        })
    }
}