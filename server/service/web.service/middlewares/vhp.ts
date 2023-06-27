import * as client from "socket.io-client";
import {Socket} from "socket.io-client";
import path from "path";
import fs from "fs";

export function determineBestPackageJson( opts?:{reverse?:boolean} ){
    let paths = require.main.paths;
    if( opts?.reverse ) paths = paths.reverse();

    return paths.map(
        (value, index) => {
            let parts = value.split( path.sep );
            parts.pop();
            let dir = parts.join( path.sep );
            let nodePackage =  path.join( dir, "package.json" );
            let packageExists = fs.existsSync( nodePackage );
            let data;
            if( packageExists ) data = JSON.parse(fs.readFileSync( nodePackage ).toString("utf-8") );
            return {
                name: data?.name,
                dir: dir,
                nodePackage,
                packageExists,
                data
            };
        }
    ).find( value => value.packageExists )
}

export type DomainEntry = {
    name?:string,
    owner?:string,
    port?:number,
    hosts?:string[]|string,
    address?:"localhost"|"127.0.0.1"|string,
    protocol?:string|"http"|"https",
    opts?
}

export type ProxyAgentOpts = {
    url?:string,
    protocol?:string|"http"|"https",
    host?:string|"127.0.0.1"|"localhost"
    port?:number|3380
    path?:string|"/",
    auth?:{
        applicationId?:string
    }


}

export function proxyAgent(opts?:ProxyAgentOpts ){
    if( !opts ) opts = {};

    if( !opts.url ){
        opts.url = `${ opts.protocol||"http" }://${ opts.host||"127.0.0.1" }:${ opts.port|| 3380 }/proxy`
    }


    opts.path = opts.path || "/";
    opts.auth = opts.auth || {};
    opts.auth.applicationId = opts.auth.applicationId || determineBestPackageJson()?.name;

    console.log( "ProxyAgentConnect", opts.url, opts );

    const connection = client.io(  opts.url,  {
        path: opts.path,
        auth: opts.auth,
    });

    connection.on( "connect_error", err => {
        console.error( err );
    })

    return {
        connection,
        linkPort( port:number, entry:DomainEntry, action?:"replace"|"increment"|"delete", timeout?:number ){
            return emit( connection, "link", timeout , Object.assign({}, entry, { port:port }), action )
        }
    }
}


function emit( conn:Socket, event, timeout?, ...args ){
    return new Promise( (resolve, reject) => {
        let code = `link:${Math.random()}`;
        let time;

        if ( timeout ) time = setTimeout(args => {
            reject( new Error( "Time Out" ) );
            resolve = ()=>{};
            reject = ()=>{}
        }, timeout );

        conn.once( code, response => {
            resolve( response );
            if( timeout ) clearTimeout( time );
            resolve = ()=>{};
            reject = ()=>{}
        })

        conn.emit( "link",  code, ...args );
    });
}