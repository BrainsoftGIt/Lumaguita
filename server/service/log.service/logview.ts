
import path from "path";
import fs from "fs";
import {folders} from "../../global/project";
import {registerLine} from "../ioline.service";
import * as readline from "readline";
import {sys} from "../../global/sys";
import {exec, spawn} from "child_process";
import { LogArgs } from "../../global/args";
import * as child_process from "child_process";
import {execFilePain} from "../../lib/utils/process/win32";

const logReadyStatus = {
    nextLine: 0,
    lines: [],
    ref: "snapshot.log",
    notifyLineEnd:false,

    next(){
        return this.lines[ this.nextLine++ ];
    }, reload(){
        let _logpath = path.join( folders.logs, this.ref );
        if( !fs.existsSync( _logpath  ) ) return [];
        let raw = fs.readFileSync( _logpath ).toString( "utf-8" );
        this.lines =  raw.split("\n" );
    }
}

function readNextLine(){
    if( logReadyStatus.nextLine  === logReadyStatus.lines.length ) logReadyStatus.reload();
    else if( logReadyStatus.nextLine > logReadyStatus.lines.length ) {
        logReadyStatus.reload();
        logReadyStatus.nextLine = 0;
        console.clear();
    }
    if( logReadyStatus.nextLine  >= logReadyStatus.lines.length ){
        console.clear();
        logReadyStatus.lines.forEach( (value, index) => {
            if( index >= logReadyStatus.nextLine ) return;
            console.log( value );
        });
        console.log( `[ENDOF: ${ logReadyStatus.ref }]` );
        return;
    }
    console.clear();
    logReadyStatus.lines.forEach( (value, index) => {
        if( index >= logReadyStatus.nextLine ) return;
        console.log( value );
    });
    console.log( logReadyStatus.next() );
}

function navigateToLine( args:string[]){
    let lineNumber = Number( args[0] );
    if( !Number.isSafeInteger( lineNumber ) ) return;
    logReadyStatus.nextLine = lineNumber;
    readNextLine();
}

export function logView(){
    registerLine( { name: "", describe: "Enter to read log next line" }, (command, line, args1) => {
        readNextLine();
    });

    registerLine( { name: "log://navigate", describe: "Navigate to especifiquis line" }, (command, line, args) => {
        navigateToLine( args );
    });
}


export function launch( opts?:LogArgs ){
    let launcher = sys.launcher();
    if( !opts ) opts = {};
    let _argv:string[] = [];

    Object.keys( opts ).forEach( key => {
        let value = opts[ key ];
        if( value === null || value === undefined ) return;
        if( typeof value === "boolean" && value ) _argv.push( `--${key}` );
        else if( typeof value === "string" ) _argv.push( `--${key}`, String( value) )
        else if( typeof value === "number" ) _argv.push( `--${key}`, String( value) )
    });

    console.log( launcher.executable, ...launcher.executableArgv, "logs", ..._argv )
    let child = execFilePain(launcher.executable, [
        ...launcher.executableArgv,
        "logs",
        ..._argv
    ], { detached: true }, "noWait" );
    child.unref();

    // capture.register( new Console())

    child.on( "close", (code, signal) => console.log("logs:logSnapshot|close", opts.logSnapshot, {code, signal}))
    child.on( "exit", (code, signal) => console.log("logs:logSnapshot|exit", opts.logSnapshot, {code, signal}));

    child.stdout.on( "data", chunk => console.log( chunk.toString()) );
    child.stderr.on( "data", chunk => console.log( chunk.toString()) );
}

export function snapshotView(){
    const status = {
        nextLine:0,
        pid:fs.readFileSync( path.join( folders.home, "current.pid" ) ).toString("utf8" )
    }

    const restart = ( currentPid )=>{
        status.nextLine = 0;
        status.pid = currentPid;
        console.clear();
    }

    const reader = ()=>{
        let text = fs.readFileSync( path.join( folders.logs, "snapshot.log" )).toString("utf-8").split("\n" )
            .filter( (value, index) => index >= status.nextLine );
        text.forEach( line => {
            console.log( line );
            status.nextLine++;
        });
    }

    fs.watchFile( path.join( folders.logs, "snapshot.log" ), (curr, prev) => {
        let nextPid = fs.readFileSync( path.join( folders.home, "current.pid" ) ).toString("utf8" );
        if( nextPid !== status.pid ) restart( nextPid );
        reader();
    })

    fs.watchFile( path.join( folders.home, "current.pid" ), (curr, prev) => {
        let nextPid = fs.readFileSync( path.join( folders.home, "current.pid" ) ).toString("utf8" );
        console.log( "change pid from ", status.pid, {nextPid} );
        if( nextPid !== status.pid ) restart( nextPid );
        reader();
    });

    reader();
}
