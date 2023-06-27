import * as client from "socket.io-client";
import {Socket} from "socket.io-client";
import {ClusterMessage} from "../enuns";
import {Cluster} from "../types";
import {ClusterContext, ConnectionCreate, SocketType} from "../server";
import {ExtendedError} from "socket.io/dist/namespace";
import {Connector} from "./connector";
import {machineIdSync} from "node-machine-id";

export class MasterConnect {
    
    private readonly _connector:Connector;
    private readonly _onConnectListener:ConnectionCreate[];
    private readonly _onRejection:ConnectionCreate[];
    private _connection:Socket;

    constructor( connectionController: Connector) {
        this._connector = connectionController;
        this._onConnectListener = [];
        this._onRejection = [];
    }

    get connection(){ return this._connection; }

    onConnectionAttach( callback:ConnectionCreate){
        this._onConnectListener.push( callback );
    } onRejectionAttach( callback:ConnectionCreate){
        this._onRejection.push( callback );
    }

    createMasterConnection( master:Cluster ):Socket{
        const _context:ClusterContext = this._connector.context;
        
        const url = `${ master.cluster_domain }:${ master.cluster_port }/cluster`;
        let path:any = ( _context.localCluster.cluster_path || '-').split("/" );
        path.push( _context.localCluster.cluster_identifier  );
        path = path.filter( value => value.length >0).join( "/" );
        path =  `/MGT/server/${ path }`;

        let machineId = `${machineIdSync(true )}:${machineIdSync()}`;

        const socket:client.Socket = client.io( url,  {
            path: path,
            auth: {
                master: {
                    cluster_identifier: master.cluster_identifier,
                    cluster_path: master.cluster_path,
                    cluster_name: master.cluster_name,
                },
                cluster:  Object.assign({}, _context.localCluster, {
                    cluster_api: master.cluster_api,
                    cluster_key: _context.privateKey,
                    cluster_machineid:  machineId
                })
            }
        });

        this.notifyConnectionAttach = () =>{
            this.notifyConnectionAttach = () =>{}
            this._onConnectListener.forEach( value => {
                value( socket, master, SocketType.MASTER);
            });
        }
        this._connection = socket;
        this._primaryListener( socket, master );

        return socket;
    }

    private _primaryListener( socket:Socket, master ){
        socket.on( "connect_error", (error:ExtendedError ) =>{
            if( error.message === ClusterMessage.REJECTED_CLUSTER_CONNECTION ){
                if( socket.id === this._connection.id ){
                    this._connection.disconnect();
                }
                if( JSON.stringify( master ) === JSON.stringify( this._connector.masterCluster ) ){
                    socket.disconnect();
                }
                this._onRejection.forEach( value => {
                   value( socket, master, SocketType.MASTER );
                });
                console.log( "REJECTION ERROR",  ClusterMessage.REJECTED_CLUSTER_CONNECTION  )
                console.log( "REJECTION ERROR",  error  )
            } else if( error.message === ClusterMessage.REJECTED_MASTER_STARTING ){
                console.log( "REJECTION ERROR",  ClusterMessage.REJECTED_MASTER_STARTING  )
                setTimeout( ()=>{
                    socket.disconnect();
                    socket.open();
                }, error.data.estimatedStartTime );
            }
        });

    }

    notifyConnectionAttach(){ }
}



