import {lineArgs} from "../global/args";
import {serverNotify} from "../snotify";
import {pgCtl} from "../service/pgcluster.service";
import {ListenerEvent} from "../lib/postgres/pg-ctl";
import Path from "path";
import fs from "fs";
import {folders} from "../global/project";
import JSON5 from "json5";
import { lookupPostgresRegister, PgInstallation } from "kitres";
import {spawnSync} from "child_process";

export type DatabaseConfigs = {
    /**C:\ProgramData\BrainsoftSTP.com\com.brainsoftstp.maguita\public\var\home\database\postgres\base*/
    dataDirname: string,
    versionName: 'pg_ctl (PostgreSQL) 14.9',
    versionDetection: {
        isValid: true,
        version: '14.9',
        versionNumber: 14.9,
        majorVersion: 14,
        minorVersion: 9,
        describe: 'pg_ctl (PostgreSQL) 14.9',
        name: 'PostgreSQL',
        cli: 'pg_ctl',
        versionName: 'pg_ctl (PostgreSQL) 14.9',
    },
}

export function startApplicationDatabase(){
    serverNotify.loadingBlockItem(  "Ligando ao banco de dados local..." );
    return new Promise( (resolve, reject) => {
        getInstallation( installation => {
            if( installation ){
                console.log( installation)
                let path = process.env["Path"].split( Path.delimiter );
                path.unshift( Path.join( installation.installation, "bin") );
                process.env["Path"] = path.join( Path.delimiter );
            }

            let result = spawnSync("pg_ctl", [ "--version"]);

            console.log( "result.stdout.toString()", result.stdout.toString(), installation.installation )
            console.log( "result.stderr.toString()", result.stderr.toString() )

            setTimeout(()=>{
                const { pgCtl } = require("../service/pgcluster.service" );
                pgCtl.debug = (details, message, ... extras ) => {
                    serverNotify.loadingBlockItem( message, null, ...extras );
                };
                const { ListenerEvent } = require("../lib/postgres/pg-ctl" );
                pgCtl.instance.on( ListenerEvent.READY, (EVENT, any) => {
                    serverNotify.loadingBlockItem(  "Ligando ao banco de dados local... [OK]" );

                    resolve({
                        status: EVENT,
                        any: any
                    })
                })
            }, 1)
        })
    })
}

export function getInstallation( response:( installation:PgInstallation, error?:Error )=>void){
    let currentVersion = ()=>{
        if( !fs.existsSync( Path.join( folders.pgHome, "current.json5")) ) return { message: "Missing current.json5"};
        let content = fs.readFileSync( Path.join(folders.pgHome, "current.json5") ).toString().trim();
        let parse:DatabaseConfigs = JSON5.parse( content );
        console.log( parse )
        if( !fs.existsSync( Path.join( parse.dataDirname, "PG_VERSION" ) ) ) return { message: "Missing current.json5 -> PG_VERSION"}
        content = fs.readFileSync( Path.join( parse.dataDirname, "PG_VERSION" ) ).toString().trim();
        let version = Number( content );

        if( Number.isNaN( version) || !Number.isFinite( version ) || !Number.isSafeInteger( version ) ) return { message: "Invalid Version Number"};
        return {version};
    }
    let {version, message } = currentVersion();
    console.log( { currentVersion: version, message })



    lookupPostgresRegister(( result)=>{
        let bestVersion = result.installations.find( next=>{
            if( version ) return next.versionNumber === version;
            return next.versionNumber === result.maxVersion;
        });
        response( bestVersion)
    });

}

export function stopDatabaseApplication(){
    console.log( "Stop database application..." );
    const { pgCtl } = require("../service/pgcluster.service" );
    return pgCtl.stop();
}

lineArgs.defineCommand( { name: "database",  callback: ( receiver )=>{
    let next = receiver.params.shift();
    if( next === "start" ){
        startApplicationDatabase().then( value => {
            process.exit( 0 );
        });
    } else if( next === "stop" ){
        stopDatabaseApplication().then( value => process.exit( 0 ) );
    }
}});