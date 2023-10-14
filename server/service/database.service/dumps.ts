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
            serverNotify.log( `[maguita] copy dump database backup from = "${new URL(`file://${ lastFile }`).href}"`);
            dumps.forEach( (next, index) => {
                    // setTimeout(()=>{
                    let dumpFile = instant.format( next.format ).toLowerCase();
                    let copyFile = path.join( folders.dumps, dumpFile );
                    files.push( copyFile );
                    console.log( `[maguita] copy dump database backup into = "${new URL(`file://${ copyFile }`).href}"` );
                    if( !fs.existsSync( Path.dirname( copyFile ) ) ) {
                        fs.mkdirSync( Path.dirname( copyFile ), { recursive: true });
                    }
                    fs.writeFileSync( copyFile, content );
                });

                let dumpBase = Path.join( folders.pgHome, "base.db" );
                console.log( `[maguita] copy dump base database backup into = "${new URL(`file://${ dumpBase }`).href}"` );
                fs.writeFileSync( dumpBase, content );
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


