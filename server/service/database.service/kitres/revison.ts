import {RevisionCore, scriptUtil} from "kitres";
import {pgCore} from "./index";
import {folders} from "../../../global/project";
import {VERSION} from "../../../version";
import chalk from "chalk";
import {args} from "../../../global/args";
import {eventsListener} from "../../notify.service/notify";
import Path from "path";


let resolvedRevisions = folders.databaseRevisionResolved;
let history = true;

if( args.appMode === "dev" ){
    resolvedRevisions = Path.join( folders.databaseRevision, "resolved" );
    history = false;
}
export const pgRevision = new RevisionCore( pgCore, {
    schema: "kitres",
    dirname: folders.databaseRevision,
    DATA_VERSION: VERSION.TAG,
    resolvedDirectory: resolvedRevisions,
    history: history
});

pgRevision.on("collectError", error =>{
    console.error( error );
});

pgRevision.on( "register", block => {
    // console.log( block )
    let filename = scriptUtil.typescriptOf( block.filename ) || block.filename;
    let lineNumber = block.line?.line as any;
    if( lineNumber ) lineNumber = `:${ lineNumber }`;
    console.log( `MAGUITA> collecting database path ${ new URL(`file:\\\\${ filename }${lineNumber}`).href } identifier = "${ block.identifier }"` );
});

pgRevision.on( "applierNotice", notice => {
    let filename = scriptUtil.typescriptOf( notice.filename )||notice.filename;
    let lineNumber = notice.line?.line as any;
    if( lineNumber ) lineNumber = `:${ lineNumber }`;
    else lineNumber = ':1';
    let status = chalk.blueBright.bold( notice.status );
    if( notice.status === "ERROR" ) status = chalk.redBright.bold( notice.status );
    if( notice.status === "FINALIZED" ) status = chalk.green.bold( notice.status );
    console.log( `MAGUITA> apply database path ${ new URL( `file:\\\\${ filename }${ lineNumber }` ).href } identifier = "${ notice.identifier }" ${ status }`);
});

pgRevision.on( "revision", (error, blocks) => {
    if( !blocks.length ) return;
    if( error ) return;

    eventsListener.notifySafe("revision", blocks );
    if( args.appMode === "dev" ){
        const {dbCataloger} = require("./calatoger");
        dbCataloger.generateCatalog().then( value => {
            if( value?.error ) {
                console.error( value.error );
                return;
            }
            console.log( "Database cataloged successfully!")
        });
    }
});


