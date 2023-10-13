import os from "os";
import fs from "fs";
import path from "path";
import {FileUtil} from "zoo.util/lib/file-util";

export const appPatches:{
    installDatabaseServer?:()=>Promise<boolean>
} = {
    installDatabaseServer(){
        return Promise.reject( new Error("Database path installer is not implemented for current os: "+os.platform() ) )
    }
}

export const supportedOs:NodeJS.Platform[] = [ "win32", "linux", "darwin" ];

export function patchesInstall(){
    //Apply global paths
    /*language=file-reference*/
    FileUtil.scanFiles( path.join( __dirname, "global" ), /.*.js$/, _patches => {
        require( _patches.path );
    }, { recursive: true });

    if( supportedOs.includes( os.platform() ) ){
        if( fs.existsSync( path.join( __dirname, os.platform() ) ) ) {
            FileUtil.scanFiles( path.join( __dirname, os.platform() ), /.*.js$/, _patches => {
                require( _patches.path );
            }, { recursive: true })
        }
    }
}