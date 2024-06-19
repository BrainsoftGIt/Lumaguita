import {lineArgs} from "../global/args";
import {serverNotify} from "../snotify";
import {prepareDatabase} from "./_app.extension";

export function stopDatabaseApplication(){
    console.log( "Stop database application..." );
    const { pgCtl } = require("../service/pgcluster.service" );
    return pgCtl.stop();
}

lineArgs.defineCommand( { name: "database",  callback: ( receiver )=>{
    let next = receiver.params.shift();
    if( next === "start" ){
        const { pgContext } =  require("../service/database.service/setup");
        pgContext.setup( (error, result) => {
            if( error || !result.status ){
                return;
            }
            prepareDatabase().then( prepareResult => {
                if( !prepareResult ){
                    return process.exit( 1 );
                }
                serverNotify.loadingBlock( "startApplicationDatabase A iniciar o servidor..." );
                process.exit( 0 )
            })
        });
    } else if( next === "stop" ){
        stopDatabaseApplication().then( value => process.exit( 0 ) );
    }
}});