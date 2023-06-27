import {ClusterContext, ClusterLevelType} from "../server";
import * as client from "socket.io-client";

export class ClusterCertificate {

    private readonly _context:ClusterContext;
    private _type:ClusterLevelType = ClusterLevelType.UNKNOWN ;


    constructor(context: ClusterContext) {
        this._context = context;
    }

    get levelType():ClusterLevelType{
        return this._type;
    }

    get isVerified(){ return this._type !== ClusterLevelType.UNKNOWN; }
    get isTrunc(){ return this._type === ClusterLevelType.TRUNC; }
    get isRoot(){ return this._type === ClusterLevelType.ROOT; }
    get isUnknown(){ return this._type === ClusterLevelType.UNKNOWN; }

    async certificate():Promise<ClusterLevelType>{

        this.certificate = ()=>{ return Promise.resolve( null ) };
        if( this._type !== ClusterLevelType.UNKNOWN ) return Promise.resolve( this._type );
        let max = 9999999999;
        let min = 1000000000;

        let domainCode = `DOMAIN-CODE:${ Math.trunc( Math.random() * ( max-min ) + min )  }`;
        const _childRejection =  ( socket, next ) => {
            if ( this._type === ClusterLevelType.UNKNOWN ){
                socket.on( "cluster-verification", args => {
                    socket.emit( "cluster-verification", domainCode )
                });
                next();
            } else next( new Error( `this domain is verified as ${ this._type }`) )
        }

        // this._context.ofRejection().use( _childRejection );



        this._type = await ( new Promise<ClusterLevelType>( (resolve, reject) => {
            if( this._context.configs.masterDomain ) resolve( ClusterLevelType.ROOT );
            else resolve( ClusterLevelType.TRUNC );

            // const connect = client.io( `${ this._context.configs.masterDomain }${ this._context.configs.namespaceChecker}`, {
            //     path: this._context.configs.path
            // }).on( "cluster-verification", args => {
            //     resolve( args && args === domainCode? ClusterLevelType.ROOT: ClusterLevelType.TRUNC );
            //     connect.disconnect();
            // }).on( "connect_error", ()=>{
            //     connect.disconnect();
            //     resolve( ClusterLevelType.TRUNC );
            // }).emit( "cluster-verification" );
        }));

        this.certificate = ( ) =>{ return Promise.resolve( this._type );}

        return Promise.resolve(  this._type );
    }
}