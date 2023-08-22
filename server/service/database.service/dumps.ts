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

const acceptsInterval:(typeof interval[ number ])[] = [ "week-day", "week" ];

type Options  = {
    prefix?:string,
    suffix?:string
}
export function dumpNow( instant?: moment.Moment, opts?:Options ){
    return new Promise( (resolve, reject) => {
        if( !instant ) instant = moment( new Date() );
        let prefix = "", suffix = "";
        if( opts?.prefix ) prefix = `-${opts.prefix}`;
        if( opts?.suffix ) suffix = `-${opts.suffix}`;

        let dumps  =intervalNames( instant,  { prefix: `${args.dbName}${prefix}${suffix}.`, suffix: ".base.db" })
            .filter( value => acceptsInterval.includes( value.intervalName ) );


        let lastFile =path.join( folders.dumps, `last-${Math.random()}.base.db` );

        const out = create_dump( lastFile );
        out.stdout.on( "data", chunk => {}  )
        out.stderr.on( "data", chunk => {}  );
        process.stdin.pipe( out.stdin );

        out.on("close", (code, signal) => {
            dumps.forEach( next => {
                let dumpFile = instant.format( next.format ).toLowerCase();
                let copyFile = path.join( folders.dumps, dumpFile );
                console.log( "CREATE DUMP ", copyFile, " USING ", lastFile );
                fs.cpSync( lastFile, copyFile );
            });
            console.log( "DROP DUMP FILE ", lastFile )
            fs.unlinkSync( lastFile );
            resolve( true );
        });
    });
}

function dargs( filename ):[PostgresDumpArgs, PostgresOptions ]{
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
    if( !fs.existsSync( path.dirname( fileName ) ) ) fs.mkdirSync( path.dirname( fileName ) );
    return pg_dump( ...dargs( fileName ) )
}

export function create_dump_sync(filename:string ){
    console.log( { filename })
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


