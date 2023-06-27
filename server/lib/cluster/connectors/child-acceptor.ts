import {ChildListener, Cluster} from "../types";
import {ClusterEvent, ClusterMessage} from "../enuns";
import {colors} from "../colors";
import {Socket} from "socket.io";
import {Connector} from "./connector";


export class ChildAcceptor {
    _connector:Connector;
    _onAcceptSocket:( socket:Socket, cluster:Cluster ) => void;

    constructor( connectionController, onAcceptSocket:(socket:Socket, cluster:Cluster )=>void  ) {
        this._connector = connectionController;
        this._onAcceptSocket = onAcceptSocket;
    }

    acceptor ():ChildListener {
        //Cluster master listen children's connections

        return async ( socket, next ):Promise<any> => {

            let childConfigs : Cluster|any = socket.handshake.auth?.cluster;
            let masterConfigs:Cluster = socket.handshake.auth?.master;


            let childInstance:Cluster

            let rejection:{
                message: ClusterMessage.REJECTED_CLUSTER_CONNECTION
                    |ClusterMessage.REJECTED_MASTER_STARTING,
                name:"ClusterConnectionError",
                data:(({accept:boolean, text:string})|any)
            } = { message: ClusterMessage.REJECTED_CLUSTER_CONNECTION,
                name: "ClusterConnectionError",
                data:{ accept:false }
            };

            let contextID:string = await this._connector.context.service.identifier();

            const requestStatus = () => {
                console.log( "========================== REQUEST ========================" );
                let keys = Object.keys( childConfigs );
                let maxKey = keys.reduce((previousValue, currentValue) => {
                    return previousValue.length > currentValue.length? previousValue
                        : currentValue
                });
                keys.forEach( key => {
                    let value = childConfigs[ key ];
                    if( value === null || value === undefined ) return;
                    console.log( key.padEnd( maxKey.length +3 ), value ) ;
                });
            }

            const canContinue = ( __accept ) => {

                console.log( `NEW CLUSTER ${ colors.identifier( childConfigs?.cluster_identifier ) } REQUEST ON ${ colors.identifier( contextID )} ${colors.action( __accept, "ACCEPTED", "REJECTED" )}` );
                if( !__accept ) next( rejection );
                else next();
            }

            requestStatus();

            if( !this._connector.online ){
                rejection.message = ClusterMessage.REJECTED_MASTER_STARTING;
                rejection.data.text =  "Server is starting, please wait a moment and try latter!";
                rejection.data.wait = true;
                rejection.data.estimatedStartTime = 1000;
                canContinue( false );
                return;
            }

            if( !childConfigs["cluster_machineid" ] ) {
                rejection.data.text = "REQUIRE MACHINE ID";
                canContinue( false );
                return;
            }

            let acceptResult = (await this._connector.context.service?.acceptChild( childConfigs ) );
            if( !acceptResult ){
                rejection.data.text = `Rejected cluster connection! RESULT: ${ acceptResult }`;
                canContinue( false );
                return;
            }

            let result = await this._connector.context.service.canAcceptClusterWithMachine( childConfigs );
            if( !result.result ) {
                rejection.data.text = result.message;
                canContinue( false );
                return;
            }

            childInstance = result.data;

            const path:any = { };

            let heheheBowy:any = socket;
            path.base = heheheBowy.server.opts.path;
            path.url =  socket.handshake.url;
            path.full = path.url.split( "?" )[ 0 ]
                .split( "/" ).filter( (value, index) => value.length > 0 || index === 0 )
                .join( "/" );
            path.name  = path.full.substr( path.base.length, path.full.length - path.base.length );



            let childDiff = [ "cluster_name", "cluster_path", "cluster_grants", "cluster_key", "cluster_license", "cluster_licenselife", "cluster_tperiod_id" ] .find( key => {
                if( !childConfigs[ key ] ) return true;
                return childConfigs[ key ] != childInstance[ key ];
            });


            let localDif = [ "cluster_identifier", "cluster_name", "cluster_path" ] .find( key => {
                if( !masterConfigs[ key ] ) return true;
                return masterConfigs[ key ] != this._connector.context.localCluster[ key ];
            });

            if ( localDif === "cluster_name" && ! this._connector.context.localCluster.cluster_name ) localDif = null;
            if ( localDif === "cluster_path" && ! this._connector.context.localCluster.cluster_path ) localDif = null;


            // ============================ LETS GO ============================================
            canContinue( true );

            const eventDefault = async () =>{
                const  sessionKey = Math.random() * 99999999;
                socket.data = {
                    path,
                    sessionKey,
                    cluster: childInstance,
                };

                //Emit auth result success
                socket.emit( "auth", {
                    accept: true,
                    message: "Welcome!",
                    master: {
                        type: this._connector.context.certificate.levelType,
                        identifier: await this._connector.context.service.identifier(),
                        path: await this._connector.context.service.path()
                    }, session: {
                        path,
                        sessionKey,
                    }
                });
                this._onAcceptSocket( socket, childInstance );
            }

            if( childDiff || localDif ){
                this._connector.context.service.loadClusterConfigToChild( childInstance ).then(configsClusters => {
                    socket.emit( ClusterEvent.CONFIGS, configsClusters  );
                });

                socket.once( ClusterEvent.CONFIGS_SETS, args => {
                    eventDefault();
                });

            } else  await eventDefault();

        }
    }
}



