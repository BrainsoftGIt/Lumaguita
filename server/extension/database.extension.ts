import {lineArgs} from "../global/args";
import {serverNotify} from "../snotify";
import {pgCtl} from "../service/pgcluster.service";
import {ListenerEvent} from "../lib/postgres/pg-ctl";

export function startApplicationDatabase(){
    serverNotify.loadingBlockItem(  "Ligando ao banco de dados local..." );
    return new Promise( (resolve, reject) => {
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