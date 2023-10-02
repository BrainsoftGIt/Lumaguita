import {ClusterContext, ClusterLevelType, ConnectionCreate, SocketType} from "../server";
import {Cluster} from "../types";
import {ClusterConfigsLoader} from "../loaders/configs";
import {MasterConnect} from "./master-connect";
import {ChildAcceptor} from "./child-acceptor";
import {PropagationListener} from "../listeners/propagation.listener";
import {ClusterEvent, ClusterType} from "../enuns";
import chalk from "chalk";
import {serverNotify} from "../../../snotify";

export class Connector {

    private _cluster_key:string
    private readonly _connectionCreate:ConnectionCreate[] = [];
    private readonly _propagation:PropagationListener;

    private readonly _context:ClusterContext;
    private readonly _masterGetAway:MasterConnect;
    private readonly _childAcceptor:ChildAcceptor;

    constructor( context: ClusterContext ) {

        this._context = context;
        this._masterGetAway = new MasterConnect( this );
        this._propagation = new PropagationListener( context );

        this._childAcceptor = new ChildAcceptor( this,  async ( socket, cluster) => {
            socket.on( "disconnect", ( )=>{


                const max = 9999999999;
                const min = 1000000000;
                const code = (Math.trunc( Math.random() * ( max-min ) ) +min );

                context.navigator.detachJump( cluster );
                const prop = context.navigator.propagateConnections( null, context.originOf( cluster ), "leave", "child", code, socket );

            });

            socket.join( cluster.cluster_identifier );
            this.propagation.onChildPropagation( socket, cluster );

            const max = 9999999999;
            const min = 1000000000;
            const code = (Math.trunc( Math.random() * ( max-min ) ) +min );
            context.navigator.attachJump( this._context.originOf( cluster ), "child", cluster.cluster_name, socket );
            const  prop = this._context.navigator.propagateConnections( null, this._context.originOf( cluster ), "join", "child", code, socket );
            // this._context.navigator.startReady( prop );
            this._connectionCreate.forEach( value => {
                value( socket, cluster, SocketType.CHILD );
            });
        });
    }

    get localCluster(){
        return this.context.service.currentLocalCluster;
    } get masterCluster(){
        return this.context.service.currentMasterCluster;
    } get privateKey(){
        return this._cluster_key;
    } get masterGetAway() {
        return this._masterGetAway;
    } get online():boolean {
        return !!this.localCluster?.cluster_identifier
            && this.localCluster?.cluster_uid
            && this.context.certificate.isVerified
    } get context() {
        return this._context;
    } get childAcceptor(){
        return this._childAcceptor;
    } get propagation() {
        return this._propagation;
    }


    async start(  ){
        this.start = async () =>{
            console.log( "Start Rejected");
        };

        let _clusterLevelType = await this.context.certificate.certificate();
        if ( _clusterLevelType === ClusterLevelType.ROOT ){
            const local = await this.context.service.localCluster();
            await this.context.service.setsClusterConfigs([ {
                cluster_identifier: local.cluster_identifier,
                cluster_type: ClusterType.LOCAL,
                cluster_name: "ROOT",
                cluster_path: "/"
            }])
        }
        const loader = new ClusterConfigsLoader( this._context );

        if( _clusterLevelType === ClusterLevelType.TRUNC ){
            this.masterConnect = async ()=>{
                serverNotify.log(  `master connection start...` );
                const change = await loader.loadChange();
                if( !change ) return;
                this._cluster_key = await this.context.service.privateKey();
                if( change.changeConnect && this?._masterGetAway?.connection?.connected ) {
                    console.log( "MASTER CONNECTION RESTART:DISCONNECT" )
                    this._masterGetAway?.connection.disconnect();
                }

                if( change.connect ){
                    serverNotify.log( "Create master socket connection...")
                    const socket = this._masterGetAway.createMasterConnection( change.master );
                    this._propagation.onMasterPropagation( socket, change.master );

                    socket.on( ClusterEvent.CONFIGS, (cluster:Cluster[ ] ) => {
                        socket.emit( ClusterEvent.CONFIGS_SETS, "OK, lets go" )
                    });

                    socket.on( "disconnect", reason => {
                        console.log( "==================== DISCONNECT MASTER ====================" )
                        this._context.navigator.detachJump( change.master );
                    })
                    socket.on( "auth", () => {
                        console.log( "==================== AUTH MASTER ====================");
                        let jumpCluster = this._context.originOf( this.context.service.currentMasterCluster );
                        this._context.navigator.attachJump(  jumpCluster, "master", change.master.cluster_name, socket );

                    });
                    socket.on( "connect", () => {
                        console.log( "==================== CONNECT MASTER ====================")
                    })
                    this._masterGetAway.notifyConnectionAttach();

                    this._connectionCreate.forEach( value => {
                        value( socket, change.master, SocketType.MASTER );
                    })
                }
            }
        }

        await this.masterConnect();

        await ({
            [ ClusterLevelType.ROOT ] : ()=>{
                this.context.describe();
            }, [ ClusterLevelType.TRUNC ] : () =>{
                this.context.describe();
            }
        })[ _clusterLevelType ]();

    }

    of( identifier ){
        const self = this;
        const emission = {
            emit( event:string, ...args:any[] ){
                if( self.masterCluster && self.masterCluster.cluster_identifier === identifier )
                    self.masterGetAway?.connection.emit( event, ...args );
                else self._context.of().to( identifier ).emit( event, ...args )
                return emission;
            }
        }
        return emission;
    }

    masterConnect(){ console.log( "[MAGUITA] Cluster>", chalk.yellowBright( "Running on root mode. Rejected master connection!") ) }

    onConnectionListener( listener:ConnectionCreate ){
        this._connectionCreate.push( listener );
    }

}