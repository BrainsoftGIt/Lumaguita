import { pgServer} from "../../lib/postgres/pg-recoginizer";

require("source-map-support").install();

import {pg_dump, pg_dump_sync, PostgresDumpArgs} from "../../lib/postgres/tools/pg_dump";
import {args} from "../../global/args";
import path from "path";
import {folders} from "../../global/project";
import moment from "moment";
import {cronManager, CronService, interval, intervalNames} from "../cron.service";
import fs from "fs";
import {PostgresOptions} from "../../lib/postgres/tools";
import {DEFAULTS} from "../../global/defaults";
import {serverNotify} from "../../snotify";
import Path from "path";
import chalk from "chalk";
import {PostgresContextSteep, SQL, sql} from "kitres";
import {dbRes, pgCore} from "./core";
import {MaguitaTableOf} from "../../../database/cataloger/lumaguita";
import os from "os";
import {VERSION} from "../../version";
import archiver from "archiver";

const acceptsInterval:(typeof interval[ number ])[] = [ "week-day", "week" ];

type Options  = {
    prefix?:string,
    suffix?:string
}
export function dumpNow( instant?: moment.Moment, opts?:Options ):Promise<string[]>{
    return new Promise( (resolve) => {
        if( !instant ) instant = moment( new Date() );
        let prefix = "", suffix = "";
        if( opts?.prefix ) prefix = `-${opts.prefix}`;
        if( opts?.suffix ) suffix = `-${opts.suffix}`;

        let dumps  =intervalNames( instant,  { prefix: `${args.dbName}${prefix}${suffix}.`, suffix: ".base.db" })
            .filter( value => acceptsInterval.includes( value.intervalName ) );


        let lastFile =path.join( folders.dumps, `last-${Math.random()}.base.db` );

        const out = create_dump( lastFile );
        let data = "";
        let err = "";
        out.stdout.on( "data", chunk => data+=chunk.toString()  )
        out.stderr.on( "data", chunk => err+=chunk.toString  );
        process.stdin.pipe( out.stdin );

        let files:string[] = [];

        out.on("exit", ( code, signal) => {
            let result:string;
            if( code === 0 ) result = chalk.greenBright.bold( "success" );
            else result = chalk.greenBright.bold( "failed" )
            serverNotify.log( `database dumps end with result = "${result}"`);
                if( code !== 0 ){
                    // serverNotify.log( `database dumps end with stdout = "${data}"`);
                    // serverNotify.log( `database dumps end with stderr = "${err}"`);
                    return resolve( null );
                }
                let content = fs.readFileSync( lastFile );
            serverNotify.log( `copy dump database backup from = "${new URL(`file://${ lastFile }`).href}"`);
            dumps.forEach( (next, index) => {
                    // setTimeout(()=>{
                    let dumpFile = instant.format( next.format ).toLowerCase();
                    let copyFile = path.join( folders.dumps, dumpFile );
                    files.push( copyFile );
                serverNotify.log( `copy dump database backup into = "${new URL(`file://${ copyFile }`).href}"` );
                    if( !fs.existsSync( Path.dirname( copyFile ) ) ) {
                        fs.mkdirSync( Path.dirname( copyFile ), { recursive: true });
                    }
                    fs.writeFileSync( copyFile, content );
                });

                serverNotify.log( `copy dump base database backup into = "${new URL(`file://${ folders.base_dump }`).href}"` );
                fs.writeFileSync( folders.base_dump, content );
                fs.unlinkSync( lastFile );
            resolve( files );
        });
    });
}

function dargs( filename:string ):[PostgresDumpArgs, PostgresOptions ]{
    return [
        {
            dbname: args.dbName,
            username: args.dbUser,
            "if-exists": true,
            "no-owner": true,
            file: path.join( filename ),
            host: args.dbHost,
            port: args.dbPort,
            clean: true,
            verbose: true,
        }, { env:{ PGPASSWORD: args.dbPassword },
            detached: true,
            shell: true
        }
    ]
}

export function create_dump( fileName:string ){
    serverNotify.log( `create backup file = "${ new URL( `file://${fileName}` ).href}"` );
    if( !fs.existsSync( path.dirname( fileName ) ) ) fs.mkdirSync( path.dirname( fileName ) );
    return pg_dump( ...dargs( fileName ) )
}

export function create_dump_sync(filename:string ){
    return pg_dump_sync( ...dargs( filename ));
}


export function autoDumpService( opts?:Options ){
    return pgServer.recognizePath( DEFAULTS.DB_VERSION, DEFAULTS.DB_VERSION_UP ).then( result => {
        let detect = result.after;
        let _status:{ detect?: boolean } = {};
        _status.detect = ( detect && detect.isValid && detect.isSupported );
        let _service: CronService;

        if( cronManager.existsService( "auto:dump" ) ) _service =  cronManager.getService( "auto:dump");
        else _service = cronManager.register( "auto:dump", { minute: 30, hour: { in:{ start: 7, end: 19 }, repeat: 4 } }, instant => {
            if( !_status.detect ){
                return pgServer.detect( DEFAULTS.DB_VERSION, DEFAULTS.DB_VERSION_UP ).then( detect => {
                    _status.detect = ( detect && detect.isValid && detect.isSupported );
                });
            }
            console.log( "==================== AUTO DUMP SERVICE ====================" );
            dumpNow( instant, opts ).then();
        });

        if( _status.detect ) return dumpNow( moment( new Date() ) ).then( value => {
            return Promise.resolve( _service );
        }); else return Promise.resolve( _service );

    });
}

export function preventiveBackup():Promise<string[]>{
    return new Promise( resolve => {
        serverNotify.log(`gerando dumps preventivos...` );
        dumpNow(null, { suffix: "before-upgrade" }).then( value => {
            serverNotify.log(`gerando dumps preventivos... ok!` );
            resolve( value );
        }).catch( reason => {
            console.error( "preventiveBackup:catch", reason );
            serverNotify.loading( "FAILED!" );
            serverNotify.loadingBlock( "Database upgrade patches... [FAILED|preventiveBackup]" );
            serverNotify.loadingBlockItem( "Falha ao aplicar atualização criticas de banco de dados. [FAILED|preventiveBackup]" );
            resolve( null );
        })
    })
}


export type BackupSave = {
    error?:Error
    accept?:boolean,
    backup?: string,
    message?:string
}

export type AppendBackup = {
    folder:string,dest:string
};

export type SaveBackupOptions = {
    dumps?:string[],
    cluster?:boolean,
    clusterSafe?:boolean,
    appends?:AppendBackup[]
}
export function saveBackup( opts:SaveBackupOptions ):Promise<BackupSave>{
    let dumps = opts?.dumps || [];
    let appends = opts?.appends || [];
    let withCluster = opts?.cluster;
    let withClusterSafe = opts?.clusterSafe;

    return new Promise( (resolve ) => {
        pgCore.query( sql`select * from cluster._get_cluster_local( false, 0 )`,(error, result?) =>{
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

            let dump = dumps.shift();
            zip.pipe( output );
            zip.file( dumps.shift(), { name:"dumps.sql" } );
            serverNotify.log( `add dump file to backup ${ new URL(`file://${dump}`).href }` );

            appends.forEach( value => {
                if( value.folder && value.dest ){
                    zip.directory( value.folder, value.dest );
                    serverNotify.log( `add folder backup ${ new URL(`file://${value.folder}`).href }` );
                }
            })

            let go = ()=>{
                zip.finalize().then( value => {
                    serverNotify.log(`create backup into ${ new URL(`file://${ backupFileName }`).href } ...OK!`);
                    resolve({
                        accept: true,
                        backup: backupFileName
                    } )
                }).catch( reason => {
                    console.error( reason.message );
                    resolve( { error: reason })
                });
            }

            let backupCluster = ()=>{
                let  { pgContext } = require("./setup" );
                if( pgContext.workFlow.steepsPass.includes( PostgresContextSteep.CTL_INIT ) ){
                    go();
                    return;
                }

                if( !withClusterSafe ) {
                    go();
                    return;
                }
                serverNotify.log( `add base dir  to backup ${ new URL(`file://${Path.join(folders.pgHome, "base")}`).href }` );
                zip.directory( Path.join(folders.pgHome, "base" ), "cluster" );
                pgContext.elevator.connected( ( error ) => {
                    if( error ){
                        console.log( error );
                        return go();
                    }

                    serverNotify.log( "stopping database service for safe backup..." );
                    pgContext.elevator.child.once( "stopService", (service, stopService) => {
                        serverNotify.log( "stopping database service for safe backup... finished!" );
                        let _resolve = resolve;
                        resolve =( ...args)=>{
                            serverNotify.log( "starting database service for continue..." );

                            pgContext.elevator.child.once("startService", (service1, startService) => {
                                serverNotify.log( "starting database service for continue... finished!" );
                                if( startService.result ){
                                    _resolve( ...args );
                                } else {
                                    _resolve({
                                        error: null,
                                        message: "Falha a iniciar o serviço do banco de dados",
                                        accept: false
                                    })
                                }
                            });
                            pgContext.elevator.send( "startService" );
                        }
                        go();
                    })
                    pgContext.elevator.send("stopService" );
                });
            }

            output.on("error", err => {
                serverNotify.log( `Erro ao criar o backups: ${ err.message }`);
                console.error( err );
                resolve({ error: err })
            });

            serverNotify.log(`create backup into ${ new URL(`file://${ backupFileName }`).href } ...`);
            zip.on( "error", error1 => {
                serverNotify.log( `Erro ao criar o backups: ${ error1.message }`);
                console.error( error1 );
                resolve({ error: error1 } );
            });

            if( args.dbMode === "app" && withCluster ){
                backupCluster();
            } else go();
        })
    })
}