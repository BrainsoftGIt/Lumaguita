import { ClusterContext } from "../server";
import { Cluster, ClusterPropagation } from "../types";
import { ClusterEvent } from "../enuns";
import * as server from "socket.io";

export class PropagationListener{
    private _context:ClusterContext;
    constructor( context:ClusterContext ) {
        this._context = context;
    }

    onMasterPropagation( socket, master:Cluster ){
        socket.on( ClusterEvent.JUMP_PROPAGATION, (propagation:ClusterPropagation )=>{
            if( propagation.origin.cluster_identifier === this._context.id ) return;
            this._context.navigator.registerPropagation( master, propagation );
        });
    }

    onChildPropagation( socket:server.Socket, cluster:Cluster ){
        socket.on( ClusterEvent.JUMP_PROPAGATION, (propagation:ClusterPropagation ) =>{
            if( propagation.origin.cluster_identifier === this._context.id ) return;
            this._context.navigator.registerPropagation( cluster, propagation );
            this._context.navigator.propagateConnections( propagation, null,  null, null, null, socket );
        });

    }

}
