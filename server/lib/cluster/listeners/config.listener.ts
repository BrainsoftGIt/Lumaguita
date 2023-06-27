import {ClusterContext, SocketType} from "../server";
import {ClusterEvent} from "../enuns";
import {Cluster} from "../types";

export class ConfigListener {
    private _context:ClusterContext;

    constructor( context: ClusterContext ) {

        this._context = context;
        this._context.connector.onConnectionListener( (socket, cluster, type) => {
            if( type !== SocketType.MASTER ) return;
            socket.on( ClusterEvent.CONFIGS, (clusters:Cluster[] )=>{
                this._context.service.setsClusterConfigs( clusters ).then( ( value ) => {
                    this._context.notifyClusterEventListener( ClusterEvent.CONFIGS );
                    Promise.all([
                        this._context.service.localCluster(),
                        this._context.service.loadMasterCluster()
                    ]).then( value1 => {
                        console.log( "Clusters Configs has sets" );
                    })
                });
            });
        });
    }
}