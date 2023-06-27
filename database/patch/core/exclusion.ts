import os from "os";
import {args} from "../../../server/global/args";
import {currentCluster} from "../../../server/service/cluster.service/pg-cluster-service";

type IgnoreMode = string | "dev"| "prod"| "public" | "test" | "dba";

type Exclusion = {
    user?:string[]|string
    mode?:(IgnoreMode[])|IgnoreMode
    cluster?:(IgnoreMode[])|IgnoreMode
    clusterPatch?:string[]|string,
};

export const currentUser = os.userInfo().username;

export function exclusion( exclusion:Exclusion ):(()=>Promise<boolean> ){
    return ()=>{


        return new Promise<boolean>( resolve => {
            if( exclusion.mode && exclusion.mode.includes( args.appMode ) ) return resolve( true );
            if( exclusion.user && exclusion.user.includes( currentUser ) ) return resolve( true );
            if( exclusion.cluster ) {
                currentCluster().then( value => {
                    if( exclusion.cluster.includes( value.cluster_identifier ) ) return resolve( true )
                })
            }
            if( exclusion.clusterPatch ) {
                currentCluster().then( value => {
                    if( exclusion.clusterPatch.includes( value.cluster_path ) ) return resolve( true )
                })
            }

            resolve( false );
        });
    }
}