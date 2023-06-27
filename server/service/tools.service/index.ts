import {registerLine} from "../ioline.service";
import * as ioc from "socket.io-client";
import * as ios from "socket.io";
import {args} from "../../global/args";

export const tools:{_client?:ioc.Socket, namespace:string, server:ios.Namespace, connection:ioc.Socket } = {
    namespace: 'tools',
    get server() {
        return require("../socket.service").io.of( this.namespace );
    }, get connection(){
        if( !this._client ){
            const url = `${args.webProtocol}://127.0.0.1:${args.appPort}/${ this.namespace }`;
            this._client  = ioc.io( url, { path: "/MGT"});
            console.log( "client", url );
            this._client.on( "connect", () => {
                console.log( "Tools connected to server" )
            })
            this._client.on( "connect_error", err => {
                console.error( "connect_error", err );
            });
        }
        return this._client;
    }
}

let toolsMode:("server"|"tools")[] = [];
let serversPrepare:(()=>void)[] = [];
let toolsPrepare:(()=>void)[] = [];

export function registerTools( name:string, listeners:{
    line( toolName:string,command:string, line:string, ...args:any[] ),
    onServer?(toolName:string, socket:ios.Socket, ...params),
    onTools?(toolName:string, ...params ) }){

    if( listeners.onServer ){

        serversPrepare.push( () => {
            tools.server.use(  (socket, next ) => {
                if( socket.handshake.address !== "::ffff:127.0.0.1" ){
                    next( new Error( "Reject remote tools connect" ) )
                    return;
                }
                socket.on( toolsName( name ), ( ...args )=>{
                    listeners.onServer( toolsName( name ), socket, ...args );
                });
                next();
            });
        });
    }

    if( listeners.line || listeners.onTools ){
        toolsPrepare.push( () => {
            console.log( "Apply tool", name );
            if( listeners.line ) registerLine( name, (...ioLine) => {
                listeners.line(toolsName( name), ...ioLine )
            } );
            if( listeners.onTools ) tools.connection.on( toolsName( name ), (...params) => {
                listeners.onTools( toolsName( name), ...params )
            });
        });
    }

    processMarks();
}

export function toolsName( s:string){ return `tools://${s}` }



function processMarks ( ){
    // if( !toolsMode.length ) return;

    if( toolsMode.includes( "server" ) ) serversPrepare.splice( 0, serversPrepare.length ).forEach( value => {
       value();
    });

    if( toolsMode.includes( "tools" ) ) toolsPrepare.splice( 0, toolsPrepare.length ).forEach( value => {
        value();
    })
}


export let markAs = ( mode:"server"|"tools" ) =>{
    // if( toolsMode.includes( mode ) ) return;
    // console.log( "MARKS TOOL MODE", mode );
    // toolsMode.push( mode );
    // processMarks()
}



