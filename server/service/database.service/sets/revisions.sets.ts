import {scriptUtil} from "kitres";
import {serverNotify} from "../../../snotify";
import chalk from "chalk";
import {eventsListener} from "../../notify.service/notify";
import {args} from "../../../global/args";
import {preventiveBackup, saveBackup} from "../dumps";
import {pgRevision} from "../core";



pgRevision.on("log", (level, message) => {
    // console.log( message );
});

pgRevision.on("collectError", error =>{
    console.error( error );
});

pgRevision.on( "register", block => {
    // console.log( block )
    let filename = scriptUtil.typescriptOf( block.filename ) || block.filename;
    let lineNumber = block.line?.line as any;
    if( lineNumber ) lineNumber = `:${ lineNumber }`;
    serverNotify.log( `collecting database patch ${ new URL(`file:\\\\${ filename }${lineNumber}`).href } identifier = "${ block.identifier }"` );
});

pgRevision.on( "applierNotice", notice => {
    let filename = scriptUtil.typescriptOf( notice.filename )||notice.filename;
    let lineNumber = notice.line?.line as any;
    if( lineNumber ) lineNumber = `:${ lineNumber }`;
    else lineNumber = ':1';
    let status = chalk.blueBright.bold( notice.status );
    if( notice.status === "ERROR" ) status = chalk.redBright.bold( notice.status );
    if( notice.status === "FINALIZED" ) status = chalk.green.bold( notice.status );
    serverNotify.log( `apply database path ${ new URL( `file:\\\\${ filename }${ lineNumber }` ).href } identifier = "${ notice.identifier }" ${ status }`);
});

pgRevision.on( "revision", (error, blocks) => {
    if( error ) return;
    if( !blocks.length ) return;

    eventsListener.notifySafe("revision", blocks );
    if( args.appMode === "dev" ){
        const {dbCataloger} = require("./calatoger");
        dbCataloger.generateCatalog().then( value => {
            if( value?.error ) {
                console.error( value.error );
                return;
            }
            serverNotify.log( "Database cataloged successfully!")
        });
    }
});

pgRevision.on("news", blocks => {
    return new Promise( (resolve) => {
        preventiveBackup().then( dumps => {
            if( !dumps ) return  resolve({ accept: false, message: "Falha ao criar dumps preventivo!" } );
            saveBackup( {
                dumps: dumps,
                clusterSafe: false,
                cluster: true
            } ).then( value1 => {
                resolve( value1 )
            }).catch( reason => resolve({ error: reason } ))
        }).catch( reason => resolve({ error: reason } ));
    });
});