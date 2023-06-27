import {lineArgs} from "../global/args";
import {DEFAULTS} from "../global/defaults";
import chalk from "chalk";
import {serverNotify} from "../snotify";

export function startApplicationDatabase(){
    serverNotify.loadingBlockItem(  "Ligando ao banco de dados local..." );
    return new Promise( (resolve, reject) => {
        setTimeout(()=>{
            autoInstallDatabaseServer().then( value => {
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
            });
        }, 1)
    })
}

export function autoInstallDatabaseServer(){
    return new Promise( (resolve, reject) => {
        //Detect database server!
        recognizeDatabasePath().then( detected =>  {
            if( detected.detection ) return resolve( true );
            const { appPatches } = require( "../patches" )
            appPatches.installDatabaseServer().then( installed => {
                if( installed ) recognizeDatabasePath().then( retryDetected => {
                    if( retryDetected.detection ){
                        serverNotify.loadingBlockItem( "Servidor de banco de dados instalado... [OK!]" );
                        return resolve( true );
                    }
                    serverNotify.loadingBlockItem( "Cannot detect installed database server!" );
                    return reject( new Error( "Cannot detect installed database server!") );
                }); else{
                    serverNotify.loadingBlockItem( "Cannot install database server!" );
                    return reject( new Error( "Cannot install database server!" ));
                }
            });
        });
    })
}

export function recognizeDatabasePath( count? ){
    let again = '';
    count = count || 0;
    if( count > 0 )  again = '[RETRY] '
    serverNotify.loadingBlockItem( `${ again }recognize database tools cli...` );
    const { pgServer } = require( "../lib/postgres/pg-recoginizer" );
    return pgServer.recognizePath( DEFAULTS.DB_VERSION, DEFAULTS.DB_VERSION_UP ).then(detection => {
        if( detection.after && detection.after.isValid && detection.after.isSupported ){
            serverNotify.loadingBlockItem( chalk.greenBright(`${ again }recognize database tools cli... [ok]` ) );
        } else {
            detection.after = null;
            serverNotify.loadingBlockItem( chalk.redBright `${again}recognize database tools cli... [failed]`);
        }
        return Promise.resolve( {
            detection: detection.after,
            count: count
        });
    })
}

export function stopDatabaseApplication(){
    console.log( "Stop database application..." );
    return recognizeDatabasePath().then( value => {
        const { pgCtl } = require("../service/pgcluster.service" );
        return pgCtl.stop();
    });
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