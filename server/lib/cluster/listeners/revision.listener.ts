import { RevisionAgent } from "../agents/RevisionAgent";
import { ClusterEvent } from "../enuns";
import {Cluster, identifierOf, Metadata, RevisionRequest, RevisionResponse} from "../types";
import { colors } from "../colors";
import {Jump, RouterNav} from "./route.listener";

export class RevisionListener {
    private readonly _revision:RevisionAgent;

    constructor( revision: RevisionAgent) {
        this._revision = revision;
        this._revision.context.connector.onConnectionListener( (socket, cluster, event) => {
            this.listenRevision( socket, cluster );
        });

        //ON DISCOVER NEW SERVER REQUIRE REVISIONS
        this._revision.context.navigator.onDiscoverListener( (jumpServer, accept) => {
            if( !accept ) return;
            let source = this._revision.context.navigator.route.toSource( jumpServer );
            this._revision.requestRevision( source, null, null); //ON DISCOVER NEW SERVER
        });
    }

    private _declare( socket, cluster:Cluster, revision: RevisionAgent ){
        return function (EVENT:ClusterEvent, callback:ListenerEvent ) {
            socket.on( EVENT, (  route:RouterNav, ...args )=>{
                callback( route, ...args );
                revision.context.notifyClusterEventListener( EVENT, ...args );
            });
        }
    }

    listenRevision( socket, cluster:Cluster ){
        const eventListener = this._declare( socket, cluster, this._revision );

        eventListener( ClusterEvent.REVISION, (route, metadata:Metadata, ...args ) => {
            this._revision.requestRevision( route.origin, metadata, ...args );
        });

        eventListener( ClusterEvent.REVISION_REQUEST, (route, req:RevisionRequest )=>{
            this._revision.sendRevision( route.origin, req ).then();
        });

        eventListener( ClusterEvent.REVISION_SEND, (route, res:RevisionResponse, req:RevisionRequest )=>{
            this._revision.applyReceiveRevision( route, res, req );
        });

        eventListener( ClusterEvent.REVISION_RECEIVED, (route, result, revisionCode )=>{
            console.log( `REVISION CODE ${ colors.event( revisionCode ) } FROM CLUSTER ${ identifierOf( route.origin )} ${ result.length } RECORDS FROM` );
        });
    }
}

type ListenerEvent = ( route:RouterNav, ...args ) => void;
