

import * as server from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ExtendedError } from "socket.io/dist/namespace";
import * as client from "socket.io-client";
import {ClusterEvent, ClusterType} from "./enuns";
import {Jump} from "./listeners/route.listener";
import {ResourceArgs, ResourceObject, ResourceSets} from "./resource";
import {colors} from "./colors";
import * as cluster from "cluster";

export type ClusterNode = {
    type: "master" | "child",
    link?:client.Socket|server.Socket|any,
    cluster:Cluster,
    id:string,
    name:string
}

export type ClusterGrants={ cluster_grants?:string[] };


export type ClusterLicense = {
    cluster_license?:string
    cluster_licenselife?:number
    cluster_tperiod_id?:number
}

export type Cluster = {
    cluster_identifier:string
    cluster_type: ClusterType,
    cluster_name: string,
    cluster_path: string,
    cluster_machineid?: string,
    cluster_configs?: any
    cluster_tree?:number
    cluster_api?: string;
    cluster_uid?:string,
    cluster_port?: string
    cluster_domain?: string,
    cluster_version?: number
    cluster_sequence?: number,
    cluster_verbose?: boolean
    cluster_code?: string
    cluster_namespace?: string
    cluster_remote?: string

} & ClusterGrants & ClusterLicense

export type RevisionCallback = (metadata:Metadata, revisions:ObjectRevision[], req:RevisionRequest, res:RevisionResponse, result:RevisionResult )=>any
export type ClusterEventCallback = (EVENT:ClusterEvent, ...args )=>any

export type EventName = string|string[];
export type ArgsLoadRemoteCluster = ClusterSource & ClusterGrants;


export type ChildListener = (socket:server.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, next:(err?:ExtendedError )=>void ) => void;


export type ClusterPosition = { cluster_tree }

export type ClusterService = {

    acceptChild?:( child:Cluster )=> Promise< boolean >,
    localCluster():Promise<Cluster>,
    loadResourcePendent( source:ClusterSource ):Promise<(ResourceSets&ResourceObject)[]>
    masterCluster():Promise<Cluster>,
    loadLocalCluster():Promise<Cluster>,
    loadMasterCluster():Promise<Cluster>,
    identifier():Promise<string>,
    setsResourceDownloaded( source:ResourceObject ):Promise<any>,
    privateKey():Promise<string>;
    switchRemoteConnection( active:boolean ):Promise<{ result:boolean, old:boolean }>;
    path():Promise<String>,

    currentLocalCluster: Cluster;
    currentMasterCluster: Cluster;

    createResource( args:ResourceArgs ):Promise<ResourceSets[]>

    canAcceptClusterWithMachine(cluster:Cluster & { cluster_machineid:string }):Promise<{ result:boolean, data:Cluster, message:string }>

    status():Promise<Cluster[]>,
    acceptRevision(cluster:ClusterSource ):Promise<Cluster[]>,
    canSendRevision( source:ClusterSource & { cluster_grants:string[] } ):Promise<boolean>
    acceptRemoteCluster(cluster:ClusterSource ):Promise<Cluster[]|null>,
    pushTo( req:RevisionRequest ):Promise<ObjectRevision[]>,
    pullFrom( revisions: RevisionResponse ):Promise<RevisionResult>
    updateStatusOf( result:ClusterPullResult ):Promise<void>,
    loadLocalAsRemoteClusters(source:ArgsLoadRemoteCluster  ):Promise<Cluster[] >,
    loadClusterByNamespace( namespace:string  ):Promise<Cluster>,
    setsClusterRemote( list:Cluster[] ):Promise<any>
    setsClusterConfigs( list:Cluster[] ):Promise<any>
    loadClusterConfigToChild(list:Cluster ):Promise<Cluster[]>,
    loadCluster( source:ClusterSource ):Promise<Cluster>
    marksClusterPosition( position: ClusterPosition  ):Promise<Cluster>
}

// export type  RevisionStatus = {
//     clusters:({ cluster_identifier: string, cluster_version:number, cluster_sequence:number })[]
// }



export type ClusterSource = {
    cluster_identifier:string,
    cluster_path?:string,
    cluster_name:string
}

export function identifierOf( source:ClusterSource ){
    if( !source.cluster_identifier && !source.cluster_name ) return "";
    return colors.identifier( `${source.cluster_identifier??""}@${source.cluster_name??""}` );
}


export type ClusterPropagation = {
    code:number,
    origin:ClusterSource,
    clusterAgent:ClusterSource,
    catchType: "master"|"child",
    actionType:"join" | "leave",
    preview:ClusterSource,
    route:string[],
    jumps:Jump[ ]
}

export type Metadata = {
    cluster_identifier?:string,
    event:EventName,
    extras?:any,
    message?:string
};

// export type ClusterNavigation = {
//     route:string[],
//     nav:string[],
//     routeStatus:"unknown" | "know"
//     direction?: "checkStart"|"checkEnd";
//     directionName?: "origin"|"destine";
//     checkStart:ClusterSource,
//     checkEnd?:ClusterSource,
//     metadata:Metadata,
//
// }




export type ClusterPullResult ={
    applied: number,
    clustersStatus: Cluster[]
};

export type OBJREV = {
    object_uid:string
    object_originver:number
    object_originsver:number
    object_origincver:number
    object_originsseq:number
    object_originrev:number
    object_date:Date
    object_instant:Date
    object_ref:any
    object_seq:number
    _origin_identifier:string
    _regclass:string
}

export type COLREV = {
    collector_transuid:string
    collector_uid:string
    collector_sequence:number
    collector_order:number
    collector_minseq:number
    collector_maxseq:number
    collector_metadata:any
    collector_date:Date
    collector_version:boolean
    collector_operation:"I"|"U"
    collector_old:any
}

export type ObjectRevision = OBJREV & COLREV;


export type RevisionRequest = {
    request:ClusterSource&{
        cluster_grants:string[]
    },
    repeat:number,
    metadata:Metadata,
    args:any[],
    clusters:Cluster[],
    limit:number,

}

export type ClusterResult = {
    cluster_identifier:string,
    cluster_version: number,
    cluster_sequence:number
}
export type ObjectIgnores = {
    origin:string,
    object:string,
    collector:string,
    transaction:string
}

export type Resume = {
    class:string,
    total: number,
    ignores: number
};

export type RevisionResponse ={
    server:ClusterSource,
    objects:( ObjectRevision[] ),
    ignores:ObjectIgnores[]
    result:ClusterResult[],
    resume:Resume[]
    total:number
    limit:number,
    revCode:number,
    rejected:number,
}

export type RevisionResult = {revisions: ObjectRevision[], status: ClusterResult[]};



