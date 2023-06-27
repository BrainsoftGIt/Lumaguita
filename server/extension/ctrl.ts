import path from "path";
import net, {Socket} from "net";

import {sys} from "../global/sys";

import os from "os";
import {args} from "../global/args";

import {onExitSignal} from "../global/pid";
import fs from "fs";



let ctrlPath;

if( os.platform() === "win32" ) ctrlPath = path.join('\\\\?\\pipe', process.cwd(), 'maguita', args.appMode );
else ctrlPath = path.join( process.cwd(), `${args.appMode}.sock` );

export enum ServerCtl {
    OPEN = "\\!open",
    EXIT = "\\!exit",
    SHUTDOWN = "\\!shutdown"
}

let connections:net.Socket[] = [];
function eject( socket:Socket ){
    let next;
    socket[ "connected" ] = true;
    socket.on( "close", ()=> {
        socket[ "connected" ] = false;
        eject( socket )
    });
    while ( next && next !== -1 ){
        next = connections.findIndex( value => value[ "id" ]=== socket[ "id" ]);
        connections.splice( next, 1 );
    }
}

let ctrl:{connections:net.Socket[], server?:net.Server } = {
    connections:[],
}

function inject( socket:Socket, next ){
    socket[ "id" ] = `socket:local//${next}/${Math.trunc(Math.random() * 9999999999999999999999 )}`;
    connections.push( socket );
    eject( socket );
    broadcasts.forEach( text =>  ___broadcasts( socket, text ) );
}

export function getCtrlServer(){
    return ctrl.server;
}

export function shutdownCtrlServer(){
    return new Promise( (resolve, reject) => {
        ctrl.server.close( err => ()=>{
            resolve( err )
        });
    })
}

export function createCTRL( ){
    if( ctrl.server ) return ctrl.server;
    let next = 1;
    let server = net.createServer();

    server.on( "connection", socket => {
            inject( socket, next++ );
            socket.on( "data", ( buf )=>{
                let data = buf.toString();
                if( data === ServerCtl.EXIT ) sys.exit();
                else if( data === ServerCtl.SHUTDOWN ) sys.shutdown()
                else if( data === ServerCtl.OPEN ) sys.openApp()
            });
        });

    server.on( "error", err => {
        if( err["code"] === "EADDRINUSE" ){
            let clientSocket = new net.Socket();
            clientSocket.on('error', function(e) { // handle error trying to talk to server
                if (e["code"] == 'ECONNREFUSED') {  // No other server listening
                    fs.unlinkSync( ctrlPath );
                    server.listen( ctrlPath, function() { //'listening' listener
                        console.log( "[MAGUITA]", `Server recovered!`);
                    });
                }
            });
        }
    })

    server.listen(  ctrlPath );
    ctrl.server = server;
    onExitSignal( shutdownCtrlServer )
    return server;
}

export type ListenConnectionCallback = ( socket:Socket, event:string, ...data )=>void;
export function listenConnection( socket:Socket, cb:ListenConnectionCallback){
    socket.on( "data", data => {
        let lines = data.toString().split("\n" ).map( ( next )=> next.trim() )
            .filter( value => value && value.length );
        lines.forEach( ( line)=>{
            try {
                let parse = JSON.parse( line.toString() );
                let { event, args } = parse;
                if( !event ) return;
                if( !args ) return;
                if( !Array.isArray( event ) ) event = [ event ];
                if( !event.includes( "*" )) event.push( "*" );
                event.forEach( ( next )=>{
                    cb( socket, next, ...args );
                });
            } catch ( e ) {
                console.error( e );
            }
        });
    })
}

type EventListener=(event:string, ...args:any[] )=>void;
export function listenCRTLEvent( socket:Socket, event:string|string[], listener:EventListener){
    listenConnection( socket, ( socket, next, ...data )=>{
        if( event === next ) return listener( event, ...data );
    });
}

let broadcasts:string[] = [];

export function ctrlBroadcast(event:string, ...data:any ){

    let text:string = JSON.stringify( {
        event,
        args: data
    });
    broadcasts.push( text );
    console.log( `BroadCsat|${text}`)
    connections.forEach( socket => ___broadcasts( socket, text ) );
}

function ___broadcasts ( socket:net.Socket, text:string){
        console.log( `BroadCsatNext|${text}`)
        if( !socket[ "connected" ] ) return;
        socket.write( text+"\n" );
}

export function detectServer():Promise<Socket>{
    return new Promise( resolve =>  {
        let connection:Socket = net.connect( {
            timeout: 1000*3,
            path: ctrlPath
        } );
        connection.on( "error", err =>{
            console.log( "Detect server... [FAILED]")
            resolve( null )
        });
        connection.on( "connect", () => {
            console.log( "Detect server... [ok]")
            resolve(connection)
        });
    });
}

export type CTRLConnectOpts = {
    retry?:number,
    timeout?:number,
    connectTimeout?:number
};
export function ctrlConnect( opts?:CTRLConnectOpts):Promise<Socket>{
    if( !opts ) opts = {};
    let next = true;
    return new Promise( (resolve, reject) =>  {
        if( opts.timeout ){
            next = false;
            setTimeout( ()=>{
                reject( new Error( "Cannot connect ctrl server!"))
            }, opts.timeout );
        }

        let connect = ()=>{
            let connection =  net.connect({
                timeout: opts.connectTimeout || 1000,
                path: ctrlPath
            });
            connection.on( "error", err => {
                if( next ) connect();
            });
            connection.on( "connect", () => {
                console.log( connection );
                resolve( connection );
            })
            return connection;
        };
        connect();
    });
}

