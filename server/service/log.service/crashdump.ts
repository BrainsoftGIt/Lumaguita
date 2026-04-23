import zipdir from "zip-dir";
import copy, {default as rcp} from "recursive-copy";
import path from "path";
import { folders } from "../../global/project";
import fs from "fs";

export function crashDump():Promise<{
    zipFile:string,
    temp:string,
    logs:string,
    clean()

}>{
    return new Promise( (resolve, reject) => {
        const temp = path.join(folders.temp, "crash-dumps", String(Math.trunc(Math.random()*9999999)) );

        rcp( path.join( folders.logs ), path.join( temp, "dist/logs" ))
            .on(copy.events.COPY_FILE_START, function(copyOperation) {
                console.info( `[LOG]`, 'Copying file ' + copyOperation.src + '...');
            }).on(copy.events.COPY_FILE_COMPLETE, function(copyOperation) {
                console.info(`[LOG]`,'Copied to ' + copyOperation.dest);
            }).on(copy.events.ERROR, function(error, copyOperation) {
                console.error( `[LOG] `+'Unable to copy ' + copyOperation.dest);
            }).then(() => {
                zipdir( path.join( temp, "dist" ) , { saveTo: path.join( temp, "pack.zip" ) }, function (err, buffer ) {
                    if( err ) console.error( err );
                });

                resolve({
                    zipFile: path.join( temp, "pack.zip" ),
                    clean(){
                         fs.rmSync( temp, { recursive: true } )
                    },
                    logs: path.join( temp,  "dist/logs" ),
                    temp
                })
            }).catch( reject );
    })
}



