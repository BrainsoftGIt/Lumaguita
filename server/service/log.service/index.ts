import {folder, folders} from "../../global/project";
import path from "path";
import fs, {WriteStream} from "fs";
import JSON5 from "json5";
import promises from "node:fs/promises";
import {capture, LogLevel} from "../../lib/console-cath";
import { interval, intervalNames} from "../cron.service";

export type LogServiceStatus = {
    [p in keyof typeof console]?: LogServiceEntry
};

//hdhhdhd texte - dev
export type StreamOptions = {
    flags?: string | undefined;
    encoding?: BufferEncoding | undefined;
    fd?: number | promises.FileHandle | undefined;
    mode?: number | undefined;
    autoClose?: boolean | undefined;
    /**
     * @default false
     */
    emitClose?: boolean | undefined;
    start?: number | undefined;
    highWaterMark?: number | undefined;
}

export type FilenameOpts = {
    prefix?:string,
    suffix?:string
};

export type LogServiceEntry = { [ p in typeof interval[number]]?:number };

export function startLogService(){

    const streams = {
        "snapshot": fs.createWriteStream( path.join( folders.logs, "snapshot.log" ) ),
        "LOGFILE": fs.createWriteStream( path.join( folders.logs, "logfile.log" ) )
    }
    let streamsMap:{[p:string]:WriteStream} = {};

    fs.writeFileSync(path.join( folders.logs, "snapshot.log" ), "" );



    let doc;
    if( fs.existsSync( path.join( folders.logs, "status.jsons5" ) ) )
        doc = fs.readFileSync( path.join( folders.logs, "status.json5" )).toString( "utf-8" );

    const status:LogServiceStatus =  doc? JSON5.parse( doc ): new Proxy({}, {
        get(root: {}, level: PropertyKey, receiver: any): any {
            if( !root[level] ) root[level] = new Proxy({}, {
                get(entry: {}, field: PropertyKey, receiver: any): any {
                    if( !entry[field] ) entry[ field ] = -1;
                    return entry[ field ];
                }
            })
            return root[level];
        }
    });

    function saveStatus(){
        fs.writeFileSync( path.join( folders.logs, "status.json5"), JSON5.stringify( status, null, 2 ) );
    }

    capture.register( new console.Console( streams.LOGFILE ) );
    capture.replay( new console.Console( streams.snapshot ) );
    let levelCatch:LogLevel[] = [ "error", "warn", "log", "debug" ];

    capture.register( opts => {

        let streams:fs.WriteStream[] = [];

        if( levelCatch.includes( opts.level ) ){
            let levelFolder = folder( folders.logs, String( opts.level ) );

            intervalNames( opts.moment, { prefix:"LOGFILE.", suffix: ".log" } ).forEach( next => {
                let streamOptions:StreamOptions =  { encoding: "utf-8" };
                let filename = opts.moment.format( next.format ).toLowerCase();
                let hasDiff = next.value !== status[ next.field ];
                if( hasDiff ) streamOptions.flags = "a";
                if( hasDiff && streamsMap[ filename ] ){
                    streamsMap[ filename ].close();
                    streamsMap[ filename ] = null;
                }

                if( !streamsMap[ filename ] ) streamsMap[ filename ] = fs.createWriteStream( path.join( levelFolder, filename ), streamOptions )
                streams.push( streamsMap[ filename ] );
            })
            interval.forEach(field => {

                let value;
                // @ts-ignore
                if( typeof opts.moment[ field ] === "function" ) value = opts.moment[ field ]();
                status[ opts.level ][ field ] = value;
            })
        }

        saveStatus();
        return streams.map( stream => new console.Console( stream ));
    });
}