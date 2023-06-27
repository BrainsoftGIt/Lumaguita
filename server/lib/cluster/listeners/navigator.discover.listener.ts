import { ClusterEvent } from "../enuns";
import { RouterNav } from "./route.listener";
import { ClusterSource } from "../types";
import { colors } from "../colors";
import { NavigatorAgent } from "../agents/NavigatorAgent";
import {SocketType} from "../server";

export class NavigatorDiscoverListener {

    private readonly _navigator:NavigatorAgent;

    constructor( navigator:NavigatorAgent ) {
        this._navigator = navigator;
        this._navigator.context.connector.onConnectionListener((socket, cluster, type) => {
            this.discover( socket, cluster, type );
        });
    } discover( socket, source:ClusterSource, type:SocketType ) {
        socket.on( ClusterEvent.PING, (route:RouterNav, code )=>{
            console.log( `RECEIVER ${ colors.event( "PING" )} FORM ${ colors.identifier( route.origin.cluster_identifier ) } WITH CODE ${ colors.name( code ) }`);
            route.event = ClusterEvent.PONG;
            this._navigator.reverse( route, code );
        });

        socket.on( ClusterEvent.PONG , (route:RouterNav, code )=>{
            console.log( `RECEIVER ${ colors.event( ClusterEvent.PONG )} RESPONSE FORM ${ colors.identifier( route.origin.cluster_identifier ) } WITH CODE ${ code }`);
        });

        socket.on( ClusterEvent.BROADCAST, (route:RouterNav, code )=>{
            console.log( `CAPTURED ${ colors.event( ClusterEvent.BROADCAST )} FORM ${ colors.identifier( route.origin.cluster_identifier ) } WITH CODE ${ code }`);
        });

        socket.on( ClusterEvent.MESSAGE, (route:RouterNav, code, message )=>{
            console.table( [  { code, message } ])
        });

       socket.on( ClusterEvent.SERVER_CONNECT_ACCEPT, (route:RouterNav, response )=>{
           this._navigator.notifyAcceptedByServer( route.origin, response )
        });

       socket.on( ClusterEvent.SERVER_CONNECT_REJECT, (route:RouterNav, response )=>{
            this._navigator.notifyRejectedByServer( route.origin )
       });

       socket.on( ClusterEvent.SERVER_CONNECT, (route:RouterNav, reqRemote:ClusterSource & { cluster_grants:string[] } )=>{
            let accept = reqRemote.cluster_identifier !== this._navigator.context.id;
            const find = this._navigator.route.jumps.find( exist => exist.id === reqRemote.cluster_identifier );
            if( find && !find.source ) find.source = [];
            this._navigator.context.service.canSendRevision( reqRemote ).then( can_send => {
                if( accept && can_send ){
                    if( find ) find.source.push( "CLIENT" );


                    this._navigator.context.service.loadLocalAsRemoteClusters( reqRemote ).then(clusters => {
                        this._navigator.route.start( ClusterEvent.SERVER_CONNECT_ACCEPT, route.origin, {
                            accept: can_send && accept,
                            remotes: clusters
                        });
                    }).catch( value => console.error( value ))
                } else if( find ) {
                    find.source.push( "REJECT:AS-SERVER" )
                    this._navigator.route.start( ClusterEvent.SERVER_CONNECT_REJECT, route.origin );
                }

                console.log( `NEW CLUSTER RECEIVER:${ colors.action( accept, "CONNECTED", "REJECTED" )} ${ reqRemote.cluster_identifier } ON ${ colors.identifier( this._navigator.context.id ) } ROUTE ${ colors.route( route.route.reverse().join( "/" ) )} `)

            }).catch( reason => console.error( reason ) );
        });

    }
}