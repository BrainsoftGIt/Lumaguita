import {Cluster, ClusterPropagation, ClusterSource} from "../types";
import {ClusterEvent} from "../enuns";
import {colors} from "../colors";
import {ClusterContext} from "../server";
import chalk from "chalk";
import {Jump, RouteListener, RouterNav} from "../listeners/route.listener";
import {NavigatorDiscoverListener} from "../listeners/navigator.discover.listener";

export type ClusterRoute = ClusterSource & {
    route: string
}

export type PropagationDiscover = ClusterSource &{
    propagationCode:number,
    linked:boolean
}

export type DiscoverServerListener = ( jumpServer:Jump, type:"server", accept:boolean )=> void;
export type UndeterminedDirectionListener = ( directionID, route:RouterNav, undeterminedCounts, ...data) =>void

export class NavigatorAgent {

    private readonly _context:ClusterContext;
    private readonly _route:RouteListener;
    private readonly _navigatorListener:NavigatorDiscoverListener;
    private readonly _discoverListener:DiscoverServerListener[]=[];
    private readonly _undeterminedDirectionListener:UndeterminedDirectionListener[] = [];
    private readonly _undeterminedDirectionsCounts:{[p:string]:number} = new Proxy({}, {
        get(target: {}, p: PropertyKey, receiver: any): any {
            if( !target[p] ) target[p] = 0;
            return target[p];
        }
    })

    constructor(server: ClusterContext) {
        this._context = server;
        this._route = new RouteListener( this );
        this._navigatorListener = new NavigatorDiscoverListener( this );
    }

    get context(){ return this._context }

    attachJump( cluster:ClusterSource, type:"child"|"master"|"remote", name:string, socket ){
        let jump:Jump = {
            id: cluster.cluster_identifier,
            path: cluster.cluster_path,
            name:name,
            linkId: this._context.id,
            type:type,
            linkType: "DIRECT",
            get connection(){ return socket.connected? "ON": "OFF" }
        };
        this.route.registerJump( jump );
        this.connectWithServer();

    } detachJump(cluster:Cluster ){
        this._route.unregisterJump( cluster );

    }

    get route(){ return this._route; }


    notifyOnUndeterminedDirection( route:RouterNav, ...data ){
        this._undeterminedDirectionListener.forEach( callback => {
            callback( route.destine.cluster_identifier, route, this._undeterminedDirectionsCounts[ route.destine.cluster_identifier ], ...data )
        })
        this._undeterminedDirectionsCounts[ route.destine.cluster_identifier ]++;
    }


    emitToAllServer(EVENT:ClusterEvent, ...data ){
        this.route.servers().forEach( value => {
            const source = this.route.toSource( value );
            this.start( EVENT, source, ...data );
        })
    } emitToAllClient(EVENT:ClusterEvent, ...data ){
        this.route.clients().forEach( value => {
            const source = this.route.toSource(value);
            this.start( EVENT, source, ...data );
        })

    } start(EVENT:ClusterEvent, destine:ClusterSource, ...data ){
        return this._route.start( EVENT, destine, ...data );

    } describe( name:"client"|"server"|"all" ){

        if( name === "all" ) name = null;

        if( !name || name === "server" ){
            console.log( chalk.blueBright.underline( "SERVER REVISION" ), colors.identifier( this._context.id ) );
            console.table( this.route.servers().map( value => {
                return {
                    id: value.id,
                    name: value.name,
                    source: value.source,
                    path: value.path,
                    type: value.type
                };
            }));
        }

        if( !name || name === "client" ){
            console.log( chalk.blueBright.underline( "CLIENTS REVISION" ), colors.identifier( this._context.id ) );
            console.table( this.route.clients().map( value => {
                return {
                    id: value.id,
                    name: value.name,
                    source: value.source,
                    path: value.path,
                    type: value.type
                };
            }) );
        }
    } registerPropagation( source:ClusterSource, propagation:ClusterPropagation ){
        this._route.rememberJumpForm( source, propagation );
        this.connectWithServer();

    } propagateConnections( propagation:ClusterPropagation, clusterAgent:ClusterSource, type:"join"|"leave", catchType:"master"|"child", propagationCode, socket ){
        //Notificar aos cluster afilhados em outro ramo sobre o modificação local
        if( !propagation ){
            propagation = {
                route: [ ],
                code:propagationCode,
                catchType: catchType,
                origin: this._context.origin(),
                preview: null,
                jumps: null,
                clusterAgent,
                actionType: type
            }
        }

        this._context.navigator.route.jumps.filter(
            value => value.linkType === "DIRECT"
                && propagation?.preview?.cluster_identifier !== value.id
        ).forEach( jump =>  this.propagateTo( jump.id, propagation ) );
        return propagation;


    } propagateTo( jump, propagation:ClusterPropagation ){
        const replicate:ClusterPropagation = JSON.parse( JSON.stringify( propagation ) );
        const allJumps = [ ...this.route.jumps ];

        let propagateJumps = allJumps.filter( map =>{
            if( map.id === jump ) return false;
            return map.linkId !== jump;
        });

        replicate.jumps = [ ...propagateJumps ];
        replicate.route.push( this._context.id );
        replicate.preview = this._context.origin();
        this._context.connector.of( jump ).emit( ClusterEvent.JUMP_PROPAGATION, replicate );

    } notifyRejectedByServer( source:ClusterSource ){
        const find = this.route.jumps.find( value => value.id === source.cluster_identifier );
        if( !find ) return;
        find.source.push( "REJECT:AS-CLIENT" );
        this._discoverListener.forEach( value => {
            value( find, "server", false );
        });

    } notifyAcceptedByServer(source:ClusterSource, response:{ accept:boolean, remotes:Cluster[]} ){
        if ( response && response?.accept && response?.remotes?.length > 0 ){
            const find = this.route.jumps.find( value => value.id === source.cluster_identifier );
            if( find ) find.source.push( "CONNECTED:AS-CLIENT" );
            this._context.service.setsClusterRemote( response.remotes ).then( value => {
                console.log( "REMOTES CLUSTER IS SETS..." );
            }).catch( reason => console.error( reason ) );
            this._discoverListener.forEach( value => {
                value( find, "server", true );
            });
        }
    } connectWithServer() {
        this.route.jumps.filter( value => !value.source ).forEach( jump => {
            jump.source = [ ];
            const source = this._route.toSource( jump );
            this._context.service.acceptRevision( source ).then( result => {
                const accept = !!result;
                console.log( `NEW CLUSTER DISCOVER:${ colors.action( accept, "ACCEPTED REV", "REJECTED REV" )} ${ source.cluster_identifier } ON ${ colors.identifier( this._context.id ) }`)
                if( accept ){
                    jump.source.push( "SERVER" );
                    this.start( ClusterEvent.SERVER_CONNECT, source, Object.assign(
                        {}, this._context.origin(), { cluster_grants: this._context.localCluster.cluster_grants }
                    ));
                } else  {
                    jump.source.push(  "REJECT:AS-SERVER" );
                }
            });
        });

    } reverse( route:RouterNav, ...data ){
        this.start( route.event, route.origin, ...data );
    }

    onDiscoverListener( callback:DiscoverServerListener ){
        this._discoverListener.push( callback );
    }

    onUndeterminedDirection( callback:UndeterminedDirectionListener ){
        this._undeterminedDirectionListener.push( callback );
    }


}