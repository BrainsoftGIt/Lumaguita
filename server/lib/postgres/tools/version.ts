import os from "os";
import {spawnSync, SpawnSyncOptions} from "child_process";
import path from "path";

export type PGCli = "postgres"|"psql"|"initdb"|"pg_ctl"|"pg_dump"|"clusterdb"|"createdb"|"createuser";


export type CLIDetection = {
    versionName?:string,
    cli?:string,
    describe?:string,
    name?:string,
    version?:string,
    versionNumber?:number,
    majorVersion?:number,
    minorVersion?:number,
    requestCli?:string,
    readonly isValid:boolean
}
export function  postgresToolVersion( toolName:PGCli, envPath?:string ):CLIDetection {
    let exe = "";

    if( os.platform() === "win32" ){
        exe = ".exe";
    }

    const opts:SpawnSyncOptions = {};
    if( envPath && os.platform() === "win32" ){
        const _path = process.env["Path"].split( ";" );
        _path.unshift( envPath );
        opts.env = Object.assign({
            "Path": _path.join( path.delimiter )
        })
    }

    const spawnResult = spawnSync(toolName+exe, [ "--version" ], opts );
    if( spawnResult.status !== 0 ) return null;
    const result = spawnResult.stdout.toString("utf-8").trim()
    let [ cli, name, version ] = result.split( " ");
    if( cli && cli.trim().length === 0 ) cli = null;

    if( version ) version = version.trim();
    if( version && version.trim().length === 0 ) version = null;

    if( name ){
        let _name = name.split("PostgreSQL" );
        if ( _name.length !== 2 || _name[ 0 ] !== '(' || _name[1] !== ')' ) name = null;
        else name = "PostgreSQL";
    }
    if( name && name.trim().length === 0 ) name = null;

    const detection:CLIDetection = {
        get isValid(){
            return !!this.cli
                && !!this.versionNumber
                && !!this.name
                && !!this.majorVersion
                && !!this.version
                && !!this.describe
                && this.cli === toolName.toLowerCase()
        }
    };
    detection.version = version;
    detection.versionNumber = Number( version );
    detection.majorVersion = Math.trunc( detection.versionNumber );
    detection.minorVersion = Number( (detection.version||"").split(".")[1]);
    detection.describe = result;
    detection.name = name;
    detection.cli = cli;
    if( Number.isNaN( detection.minorVersion ) ) detection.minorVersion = null;
    if( Number.isNaN( detection.majorVersion ) ) detection.majorVersion = null;
    if( Number.isNaN( detection.versionNumber ) ) detection.versionNumber = null;
    if( detection.isValid && !detection.minorVersion )
        detection.minorVersion = 0;
    detection.versionName = result;
    return  detection;

}