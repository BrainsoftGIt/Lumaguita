import {ClusterEvent} from "./enuns";
import {
    Cluster,
    ClusterEventCallback,
    ClusterService,
    ClusterSource,
    Metadata
} from "./types";

import {Namespace, Server} from "socket.io";
import * as client from "socket.io-client";
import * as server from "socket.io";
import {NavigatorAgent} from "./agents/NavigatorAgent";
import {RevisionAgent} from "./agents/RevisionAgent";
import {ConfigListener} from "./listeners/config.listener";
import {Connector} from "./connectors/connector";
import {ClusterCertificate} from "./agents/clusterCertificate";
import {Resource} from "./resource";
import {Jump} from "./listeners/route.listener";

export enum ClusterLevelType {
    UNKNOWN = "ClusterTreeLevel.UNKNOWN",
    ROOT = "@ROOT",
    TRUNC = "@TRUNC"
}


export type ClusterConfigs = {
    namespace:string,
    namespaceChecker:string,
    path:string,
    resource_404:string,
    masterDomain:boolean,
    resource:string
    resourceMountPoint:string
    debug?:boolean,
    revisionsLimit?:number|100
};


export enum SocketType {
    CHILD = "child",
    MASTER = "MASTER"
}
export type ConnectionCreate = (socket:client.Socket|server.Socket|any, cluster:Cluster, type:SocketType )=>void;

export class ClusterContext {

    private readonly _io:Server;
    private readonly _certificate:ClusterCertificate;
    private readonly _service:ClusterService;
    private readonly _route:NavigatorAgent;
    private readonly _configs:ClusterConfigs;
    private readonly _configsSets:ConfigListener
    private readonly _revision:RevisionAgent
    private readonly _connector:Connector;
    private readonly _res:Resource;


    // public onReceiverRevision:( EVENT_NAME:EventName, callback: (navigation, push, result ) => any)=>void;

    get onReceiverRevision(){
        return this.revision.onceReceiverRevision;
    }


    private _onceClusterEventListener:ClusterEventCallback[][] = new Proxy(  [], {
        get(target: any[], p: PropertyKey, receiver: any): any {
            let value = target[ p ];
            if( !value ) target[ p ] = value = [ ];
            return value;
        }
    });

    private _onClusterEventListener:ClusterEventCallback[][] = new Proxy(  [], {
        get(target: any[], p: PropertyKey, receiver: any): any {
            let value = target[ p ];
            if( !value ) target[ p ] = value = [ ];
            return value;
        }
    });

    constructor( service:ClusterService, io:Server, configs:ClusterConfigs) {
        this._service = service;
        this._configs = JSON.parse( JSON.stringify( configs ));
        this._configs.revisionsLimit = this._configs.revisionsLimit || 100;
        this._io = io;

        //Load Primary Agents
        this._certificate = new ClusterCertificate( this );
        this._connector = new Connector( this );
        this._route = new NavigatorAgent( this );
        this._configsSets = new ConfigListener( this );
        this._revision = new RevisionAgent( this );
        this._res = new Resource( this );
    }


    get localCluster() { return this._connector.localCluster; }
    get masterCluster() { return this._connector.localCluster; }

    get revisionsLimit(){ return this._configs.revisionsLimit }

    get service() { return this._service; }
    get privateKey() { return this._connector.privateKey; }
    get navigator() { return this._route; }
    get configsSets() { return this._configsSets; }
    get connector(){ return this._connector }
    get revision() { return this._revision }
    get certificate() { return this._certificate }
    get configs() { return this._configs }
    get res() { return this._res }

    get debug(){ return !!this._configs.debug }

    get online():boolean { return this._connector.online; }

    toSource( jump:Jump ){
        return this.navigator.route.toSource( jump );
    }

    of(): Namespace { return this._io.of( this._configs.namespace ) }

    create = async () =>{

        this.create = async () =>{
            if( this.certificate.levelType === ClusterLevelType.UNKNOWN ){
                throw new Error( "Cluster is creating..." );
            } else throw new Error( "Cluster is created" );
        }
        console.log( `[CLUSTER] LEVEL ${ this.certificate.levelType } NAMESPACE: ${ this._configs.namespace }`)
        this.of().use( this._connector.childAcceptor.acceptor() );
        await this._connector.start();
    }


    connect (){
        console.log( "CONNECTING TO MASTER..." );
        return this._connector.masterConnect();

    } notifyChangeConfigs() {
        return this.connect()


    } notifyRemoteChange( cluster:ClusterSource, metadata:Metadata ){
        //TODO notify remote change


    } onClusterEventListener(EVENT_NAME:(ClusterEvent|ClusterEvent[]), callback:ClusterEventCallback ) {
        if(typeof EVENT_NAME === "string" ) EVENT_NAME = [ EVENT_NAME ];
        EVENT_NAME.forEach( (value, index) => {
            this._onClusterEventListener[ value ].push( callback );
        })
    } onceClusterEventListener(EVENT_NAME:(ClusterEvent|ClusterEvent[]), callback:ClusterEventCallback ) {
        if(typeof EVENT_NAME === "string" ) EVENT_NAME = [ EVENT_NAME ];
        EVENT_NAME.forEach( (value, index) => {
            this._onceClusterEventListener[ value ].push( callback );
        })

    }  notifyClusterEventListener( EVENT:ClusterEvent, ...args ){

        this._onceClusterEventListener[ EVENT ].splice(0).forEach( (revisionCallback, index) => {
            revisionCallback( ...args );
        });

        this._onClusterEventListener[ EVENT ].forEach( (revisionCallback, index) => {
            revisionCallback( ...args );
        });

    }   origin():ClusterSource {
        return this.originOf( this.localCluster )

    } originOf( cluster:Cluster ):ClusterSource {
        if( !cluster ) return null;
        return {
            cluster_identifier: cluster.cluster_identifier,
            cluster_path: cluster.cluster_path,
            cluster_name: cluster.cluster_name,
        }
    }


    get id() { return this.origin()?.cluster_identifier }
    get path() { return this.origin().cluster_path }

    //Revisions works
    notifyLocalChange( metadata:Metadata, ...args ) {
        this.revision.notifyAllClient( metadata, ...args );
    }

    requireRevision( remoteCluster:ClusterSource ){
        this.service.acceptRevision( remoteCluster ).then( value => {

        })
        this.navigator.start( ClusterEvent.REVISION_REQUEST, remoteCluster, )
    }

    async describe(){
        let privateKey = await this.service.privateKey();
        let localCluster = await this.service.loadLocalCluster();
        let masterCluster = await this.service.loadMasterCluster();
        let type = this.certificate.levelType;
        let path = type === ClusterLevelType.ROOT? "/"
            : localCluster.cluster_path;

        console.log( "[MAGUITA] Cluster>", "Status" );
        console.table([{
            id: localCluster.cluster_identifier,
            path: path,
            type: this.certificate.levelType,
            master: `${masterCluster.cluster_domain}:${masterCluster.cluster_port}`,
            status: await this.status(),
            online: this.online,
            license: localCluster.cluster_license,
            code: localCluster.cluster_code,
            namespace: localCluster.cluster_namespace
        }])
    }

    isRoot():boolean{
        return this.certificate.isRoot;
    }

    async status():Promise<"CONFIGURED"|"REGISTERED"|"NOT-CONFIGURED"> {
        let privateKey = await this.service.privateKey();
        let localCluster = await this.service.loadLocalCluster();
        let masterCluster = await this.service.loadMasterCluster();
        let _has_sets_configs = !!masterCluster.cluster_api
            && !!masterCluster.cluster_port
            && !!masterCluster.cluster_domain
            // && !!localCluster.cluster_path
        ;
        let configured = _has_sets_configs || this.certificate.isRoot;
        let _status:"CONFIGURED"|"REGISTERED"|"NOT-CONFIGURED"
            = (configured && !!privateKey || this.certificate.isRoot )? "REGISTERED"
            :( configured )? "CONFIGURED"
            : "NOT-CONFIGURED"
        ;
        return Promise.resolve( _status );
    }
}