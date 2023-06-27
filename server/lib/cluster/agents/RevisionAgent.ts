import sizeof from "sizeof";

import {ClusterContext} from "../server";
import {
    Cluster,
    ClusterResult,
    ClusterSource,
    EventName, identifierOf,
    Metadata,
    ObjectIgnores,
    ObjectRevision, Resume,
    RevisionCallback,
    RevisionRequest,
    RevisionResponse, RevisionResult
} from "../types";
import {ClusterEvent} from "../enuns";
import {RevisionListener} from "../listeners/revision.listener";
import {colors} from "../colors";
import {RouterNav} from "../listeners/route.listener";


export type Preparation = any;
export type Ignore ={
    name:string
    text?:string
}|false|null|void;

export class RevisionAgent {

    private readonly _context:ClusterContext;
    private _onRRListener:RevisionCallback[][] = new Proxy(  [], {
        get(target: any[], p: PropertyKey, receiver: any): any {
            let value = target[ p ];
            if( !value ) target[ p ] = value = [ ];
            return value;
        }
    });

    private _onceRRListener:RevisionCallback[][] = new Proxy(  [], {
        get(target: any[], p: PropertyKey, receiver: any): any {
            let value = target[ p ];
            if( !value ) target[ p ] = value = [ ];
            return value;
        }
    });

    private _revisionIgnore:RevisionIgnore[] = [];



    constructor( server: ClusterContext) {
        this._context = server;
        new RevisionListener( this );
    }

    get context() { return this._context; }

    notifyAllClient( metadata:Metadata, ...args ){
        this.context.navigator.emitToAllClient( ClusterEvent.REVISION, metadata, ...args );
    }

    requestAllServer( metadata:Metadata, ...args ){
        this._context.navigator.route.servers().forEach( value => {
            this.requestRevision( this.context.navigator.route.toSource( value ), metadata, ...args );
        });
    }

    notifyRevision( recClient:ClusterSource, metadata:Metadata, ...args ){
        this._context.navigator.start( ClusterEvent.REVISION, recClient, metadata, ...args );

    } requestRevisionRepeat( revServer:ClusterSource, req:RevisionRequest ){
        this._context.service.acceptRevision( revServer ).then( clusters => {
            console.table( clusters.filter( value => value.cluster_identifier ==revServer.cluster_identifier ))
            if( !clusters || clusters.length < 1 ) return;
            req.clusters = clusters;
            this._context.navigator.start( ClusterEvent.REVISION_REQUEST, revServer, req  )
        })
        console.log( "REPEAT REQUEST REVISION" );

    } requestRevision( revServer:ClusterSource, metadata:Metadata, ...args ){
        this._context.service.acceptRevision( revServer ).then( clusters => {
            if( !clusters || clusters.length < 1 ) return;
            const req:RevisionRequest = {
                clusters: clusters,
                metadata:metadata,
                repeat: 0,
                args: args,
                limit: this.context.revisionsLimit,
                request: { ...this.context.origin(),
                    cluster_grants: this._context.localCluster.cluster_grants
                }
            }
            this._context.navigator.start( ClusterEvent.REVISION_REQUEST, revServer, req  )
            console.log( "SEND CURRENT STATUS" );
        });

    } async sendRevision( revClient:ClusterSource, req:RevisionRequest ){
        let min = 1000000;
        let max = 9999999;
        const revisionConde = Math.trunc( Math.random() * ( max - min ) + min );
        const revisions = await this._context.service.pushTo( req );

        //language=file-reference
        if( !revisions?.length || revisions?.length === 0 ){
            let res:RevisionResponse = {
                objects: [],
                ignores: [],
                resume: [],
                total: 0,
                rejected: 0,
                limit: req.limit,
                server: this.context.origin(),
                revCode: revisionConde,
                result:[]
            }

            this._context.navigator.start( ClusterEvent.REVISION_SEND, req.request, res, req );
            return;
        }

        let regclassInRevision:string[] = [];
        let result:ClusterResult[]=[];
        let _resume_class:Resume[] = [];

        revisions.forEach( object => {
            if( !regclassInRevision.includes( object._regclass ) ) regclassInRevision.push( object._regclass );
            let res = _resume_class.find( value => value.class === object._regclass );
            if( !res ) _resume_class.push( { class: object._regclass, total: 1, ignores: 0 });
            else res.total++;

            let cluster = result.find( cluster => cluster.cluster_identifier = object._origin_identifier );
            if( !cluster ) result.push(cluster = {
                cluster_identifier: object._origin_identifier,
                cluster_version: object.object_origincver,
                cluster_sequence: object.object_seq
            })

            if( cluster && cluster.cluster_sequence < object.object_seq ) cluster.cluster_sequence = object.object_seq
            if( cluster && cluster.cluster_version < object.object_origincver ) cluster.cluster_sequence = object.object_seq
        });

        //Preparar os rejeitadores de revisãos que lidam com essas revisões
        let prepared:{validator:RevisionIgnore, preparation:any}[] = [];

        for (let i = 0; i < this._revisionIgnore.length; i++) {
            let value = this._revisionIgnore[ i ];
            let _prepared;
            if( !value.evaluates || value?.evaluates?.find( next => regclassInRevision.includes( next ))) {
                _prepared = await value.prepare( regclassInRevision, req, this.context.localCluster, this.context.masterCluster, revisions );
                prepared.push({
                    validator: value,
                    preparation: _prepared
                })
            }
        }

        const ignores:ObjectIgnores[] = [];

        let acceptRevision = [];


        for (let i = 0; i < revisions.length; i++) {
            let next = revisions[ i ];
            let rejected:Ignore = false;
            let last;
            for ( let i =0; i< prepared.length; i++ ){
                let pre = prepared[ i ];
                if( !!pre.validator.evaluates && !pre.validator.evaluates.includes( next._regclass ) ) continue;
                rejected = await pre.validator.reject( pre.preparation, next._regclass, next );
                last  = i;
                if( rejected ) break;
            }

            prepared.filter( (value, index) =>
                index > last && rejected
            ).forEach( value => value.validator.onRejected( rejected, value.preparation, next._regclass, next ))

            if( rejected ) {
                ignores.push( {
                    object: next.object_uid,
                    collector: next.collector_uid,
                    transaction: next.collector_transuid,
                    origin: next._origin_identifier,

                });
                let res = _resume_class.find( value => value.class == next._regclass );
                if( res ) res.ignores ++;
            }
            let accept = !rejected;
            if( accept ) acceptRevision.push( next );
        }

        let res:RevisionResponse = {
            objects: acceptRevision,
            ignores: ignores,
            resume: _resume_class,
            total: revisions.length,
            rejected: revisions.length - acceptRevision.length,
            limit: req.limit,
            server: this.context.origin(),
            revCode:revisionConde,
            result
        }

        //REDUCER DATA BEFORE SENT
        let initialSize = sizeof.sizeof( res.objects, true);
        // res.objects = dynamicReducer( res.objects );
        let reducedSize = sizeof.sizeof( res.objects, true);

        this._context.navigator.start( ClusterEvent.REVISION_SEND, req.request, res, req );

        console.log( `${ colors.event( "SEND" )} ${ acceptRevision.length } TO ${ identifierOf( req.request )} NEWS REVISIONS REDUCED WITH INITIAL SIZE: ${ colors.name( initialSize ) } TO REDUCED SIZE: ${ colors.name( reducedSize ) }` );


    } applyReceiveRevision( route:RouterNav, res:RevisionResponse, req:RevisionRequest ){
        let reducedSize = sizeof.sizeof( res.objects , true );
        // res.objects = dynamicExpander<ObjectRevision[]>( res.objects );
        let expandedSize = sizeof.sizeof( res.objects, true );

        if( !res?.total || res.total === 0 ){
            this.notifyRevisionReceived( route, req, res, {
                revisions: res.objects,
                status: res.result
            });
            return;
        }
        console.log( `${ colors.event( "RECEIVER" )} ${ res.objects.length} FROM ${ identifierOf( route.origin ) } NEWS REVISIONS EXPANDED WITH REDUCED SIZE: ${ colors.name( reducedSize ) } TO EXPANDED SIZE: ${ colors.name( expandedSize ) }` );
        this._context.service.pullFrom( res ).then( result => {

            console.log( `${ colors.event( "RECEIVER PULL" )} ${ result.revisions.length } FROM ${ identifierOf( route.origin ) } NEWS REVISIONS EXPANDED WITH REDUCED SIZE: ${ colors.name( reducedSize ) } TO EXPANDED SIZE: ${ colors.name( expandedSize ) }` );
            //Has resource
            result.revisions.filter( value => value._regclass === "cluster.resource" )
                .forEach( (value, index) => {
                    setTimeout(()=> this.context.res.download( route.origin, value, value.collector_metadata )
                        ,1500*index )
                });

            if( res.total === req.limit ) {
                req.repeat = req.repeat +1;
                this.requestRevisionRepeat( res.server, req )
            } else {
                this.context.service.status().then( clustersStatus => {
                    let { objects, ... result } = res;
                    result[ "status" ] = clustersStatus;
                    this._context.navigator.start( ClusterEvent.REVISION_RECEIVED, res.server, result );
                })
            }
            this.notifyRevisionReceived( route, req, res, result );
        }).catch( reason => console.error( reason ))

    }


    registerRevisionIgnore( ignore:RevisionIgnore ){
        this._revisionIgnore.push( ignore );
    }

    //Listeners
    notifyRevisionReceived(route:RouterNav, req:RevisionRequest, res:RevisionResponse, result:RevisionResult ){
        if( !req.metadata ) return;

        let events = ( typeof  req.metadata.event === "string" )? [ req.metadata.event ] : req.metadata.event;

        events.forEach( (eventName, index) => {
            this._onRRListener[ eventName ].forEach( (revisionCallback:RevisionCallback) => {
                revisionCallback( req.metadata, result.revisions, req, res, result );
            });
        });

        events.forEach( (eventName, index) => {
            this._onceRRListener[ eventName ].splice(0).forEach( (revisionCallback:RevisionCallback) => {
                revisionCallback( req.metadata, result.revisions, req, res, result );
            });
        });
    } onReceiverRevision( EVENT_NAME:EventName, callback: (navigation, push, result ) => any) {
        if(typeof EVENT_NAME === "string" ) EVENT_NAME = [ EVENT_NAME ];
        EVENT_NAME.forEach( (value, index) => {
            this._onRRListener[ value ].push( callback );
        })

    }  onceReceiverRevision( EVENT_NAME:EventName, callback: (navigation, push, result ) => any) {
        if(typeof EVENT_NAME === "string" ) EVENT_NAME = [ EVENT_NAME ];
        EVENT_NAME.forEach( (value, index) => {
            this._onceRRListener[ value ].push( callback );
        })

    }
}

export type RevisionIgnore = {
    evaluates:string[]|null
    prepare( rclass:string[], req:RevisionRequest, local:Cluster, master:Cluster, revs:ObjectRevision[]):Promise<Preparation>
    reject( prepared:Preparation, rclass:string, obj:ObjectRevision ):Ignore|false|null|void
    onRejected(rejection:Ignore, prepared:Preparation, rclass:string, obj:ObjectRevision )
}

