import zipdir from "zip-dir";
import copy, {default as rcp} from "recursive-copy";
import path from "path";
import { Folders } from "../../global/project";
import { args } from "../../global/args";
import {pgServer} from "../../lib/postgres/pg-recoginizer";
import {DEFAULTS} from "../../global/defaults";
import fs from "fs";

export function crashDump():Promise<{
    zipFile:string,
    database:string,
    temp:string,
    logs:string,
    clean()

}>{
    return new Promise( (resolve, reject) => {
        pgServer.recognizePath( DEFAULTS.DB_VERSION, DEFAULTS.DB_VERSION_UP ).then( async value => {
            const { create_dump_sync } = require( "../database.service/dumps" );
            const temp = path.join(Folders.temp, "crash-dumps", String(Math.trunc(Math.random()*9999999)) );

            await rcp( path.join( Folders.logs ), path.join( temp, "dist/logs" ))
                .on(copy.events.COPY_FILE_START, function(copyOperation) {
                    console.info( `[LOG]`, 'Copying file ' + copyOperation.src + '...');
                }).on(copy.events.COPY_FILE_COMPLETE, function(copyOperation) {
                    console.info(`[LOG]`,'Copied to ' + copyOperation.dest);
                }).on(copy.events.ERROR, function(error, copyOperation) {
                    console.error( `[LOG] `+'Unable to copy ' + copyOperation.dest);
                });
            const database = path.join( temp, "dist", `${ args.app }_${ args.dbName }.base.db`);

            let dump = create_dump_sync( database  );
            // console.log( dump.output.toString("utf-8") )
            // console.log( dump.stderr.toString("utf-8") );
            if( dump.error ) console.error( "error", dump.error );

            zipdir( path.join( temp, "dist" ) , { saveTo: path.join( temp, "pack.zip" ) }, function (err, buffer ) {
                if( err ) console.error( err );
            });

            resolve({
                zipFile: path.join( temp, "pack.zip" ),
                clean(){
                     fs.rmSync( temp, { recursive: true } )
                },
                logs: path.join( temp,  "dist/logs" ),
                database: database,
                temp
            })
        });
    })
}




