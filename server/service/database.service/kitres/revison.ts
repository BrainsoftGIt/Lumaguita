import {PgCoreError, Result, RevisionCore, RevisionsChecks, scriptUtil} from "kitres";
import {pgCore} from "./index";
import {folders} from "../../../global/project";
import {VERSION} from "../../../version";
import chalk from "chalk";
import {args} from "../../../global/args";
import {eventsListener} from "../../notify.service/notify";
import Path from "path";
import fs from "fs";
import {dbRes} from "./res";
import {MaguitaTableOf} from "../../../../database/cataloger/lumaguita";
import moment from "moment";
import archiver from "archiver";
import {dumpNow} from "../dumps";
import {serverNotify} from "../../../snotify";
import os from "os";


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
    serverNotify.log( `collecting database path ${ new URL(`file:\\\\${ filename }${lineNumber}`).href } identifier = "${ block.identifier }"` );
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

function preventiveBackup():Promise<boolean>{
    return new Promise( resolve => {
        serverNotify.log(`gerando dumps preventivos...` );
        dumpNow(null, { suffix: "before-upgrade" }).then( value => {
            serverNotify.log(`gerando dumps preventivos... ok!` );
            resolve( true );
        }).catch( reason => {
            serverNotify.loading( "FAILED!" );
            serverNotify.loadingBlock( "Database upgrade patches... [FAILED]" );
            serverNotify.loadingBlockItem( "Falha ao aplicar atualização criticas de banco de dados." );
            resolve( false );
        })
    })
}

function saveBackup():Promise<RevisionsChecks>{
    return new Promise( (resolve ) => {
        dbRes.call.cluster._get_cluster_local<MaguitaTableOf<"cluster", "cluster">,any>({
            try: 0,
            increment: false
        }, {
            onResult(error: PgCoreError, result?): any {
                if( error ) return resolve({ error: error } );
                let localCluster = result.rows[0];
                if( !localCluster ) return resolve({ accept: false, message: "Não pode carregar o cluster local" } );
                let username = localCluster.cluster_name||os.userInfo().username;
                let time = moment().format("yyyyMMDD-HHmmss");

                let backupName = `backup-lumaguita-${VERSION.TAG}-${ username }-${ time }-upgrade.zip`;
                let backupFileName = Path.join( folders.backups, backupName);

                let output = fs.createWriteStream( backupFileName  );
                let zip = archiver('zip', {
                    zlib:{ level: 9 },
                    comment: `Lumaguita backup for ${ username } at ${ new Date().toISOString() }`
                });

                zip.pipe( output );
                zip.directory( folders.dumps, "dumps" );
                zip.directory( folders.pgHome, "cluster" );

                output.on("error", err => {
                    serverNotify.log( `Erro ao criar o backups: ${ err.message }`);
                    resolve({ error: err })
                });

                serverNotify.log(`create backup into ${ new URL(`file://${ backupFileName }`).href } ...`);
                zip.on( "error", error1 => {
                    serverNotify.log( `Erro ao criar o backups: ${ error1.message }`);
                    resolve({ error: error1 } );
                });

                zip.finalize().then( value => {
                    serverNotify.log(`create backup into ${ new URL(`file://${ backupFileName }`).href } ...OK!`)
                    resolve({ accept: true } )
                }).catch( reason => {
                    console.error( reason.message );
                    resolve( { error: reason })
                });
            }
        }).body()
    })
}

pgRevision.on("news", blocks => {
    return new Promise( (resolve) => {
        preventiveBackup().then( value => {
            if( !value ) resolve({ accept: false, message: "Falha ao criar dumps preventivo!" } );
            saveBackup().then( value1 => {
                resolve( value1 )
            }).catch( reason => resolve({ error: reason } ))
        }).catch( reason => resolve({ error: reason } ));
    });
});


