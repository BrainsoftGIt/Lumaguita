import {dbRes} from "../service/database.service/kitres/res";
import {PgCoreError, Result} from "kitres";
import {MaguitaTableOf} from "../../database/cataloger/lumaguita";
import fs from "fs";
import Path from "path";
import ini from "ini";
import {serverNotify} from "../snotify";

export type Namespace = {
    env?:any,
    directory?:string,
    clusterName?:string
}

export const namespace:Namespace = {};

export function loadNamespaceConfigs( listen:( error: Error, nsp?:Namespace )=> void ){
    let cluster = dbRes.call.cluster._get_cluster_local({
        increment:false,
        try:0
    }, {
        onResult(error: PgCoreError, result?: Result<MaguitaTableOf<"cluster", "cluster">, any>): any {
            if( error ) return listen( error );
            let cluster = result.rows[0];
            if( !cluster ) return listen( null);
            let directory = Path.join( __dirname, cluster.cluster_namespace ||"/" );
            if( !fs.existsSync( directory ) ) return listen( null ) ;
            let env;

            if( fs.existsSync( Path.join( directory, ".env" ) ) ){
                let content = fs.readFileSync( Path.join( __dirname, cluster.cluster_namespace ||"/", ".env" ) ).toString();
                env = ini.parse( content );
            }

            namespace.env = env;
            namespace.clusterName = cluster.cluster_name;

            fs.readdirSync( directory ).forEach( value => {
                let filename = Path.join( directory, value );
                if(  !/.*.int.js$/.test( filename ) ) return;
                if( !fs.statSync( filename ).isFile() ) return;
                serverNotify.log( `init namespace dependency: ${ new URL( `file://${filename}`) } ...`)
                let __ini = require( filename );
                serverNotify.log( `init namespace dependency: ${ new URL( `file://${filename}`) } ...OK`);
            });

            listen( null, namespace );
        }
    }).body()
}



