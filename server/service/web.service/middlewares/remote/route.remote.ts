// import {app} from "../../index";
// import fs from "fs";
// import fsPath from "path";
// import {constants} from "http2";
// import {aioService,} from "../../../anchorio.service";
// import {args} from "../../../../global/args";
//
// import {folders} from "../../../../global/project";
// import * as Path from "path";
// import {REMOTE_APP_NAME, remoteProxy} from "./proxy.remote";
// import chalk from "chalk";
//
// export type Application = {
//     port:number|string
//     address?:string
// }
//
// export type AgentServer = { name:string, identifier:string, match:RegExp }
//
// app.use( async (req, res, _next) => {
//     let next = ()=>{
//         next = ()=>{}
//         _next();
//     }
//
//     if( !args.webDomain ) return next();
//     const host = req.get('host').split(":")[ 0 ];
//     if( host === args.webDomain ) return next();
//     let parts = host.split( '.' );
//     // let webParts = args.webDomain.split( "." );
//     // if( webParts.length !== parts.length+1 ) return next();
//
//     if( req.method.toUpperCase() === "GET" && fs.existsSync( Path.join( folders.public, req.path ) )) {
//         let filename =  Path.join( folders.public, req.path );
//         let fileState = fs.statSync( filename );
//
//         let html:RegExp = RegExp( `((^)*.html)$`) ;
//         let pages =  fs.readdirSync( Path.join( folders.snapshot, "/client/public" ) )
//             .map( filename => Path.join( folders.snapshot, "/client/public", filename ) )
//             .filter( filename => html.test( Path.join( folders.snapshot, "/client/public", filename ) ) )
//         ;
//
//         let excludes = [
//             fileState.isDirectory(),
//             pages.includes( filename )
//         ]
//
//         if( !excludes.includes( true ) ) return next();
//     }
//
//     let namespace  = parts.shift();
//
//     let remoteGrants = require( "../../../cluster.service" ).clusterServer.localCluster?.cluster_remote;
//     if( parts[ parts.length-1] === "aio" && req.header('x-mgt-remote-request') && remoteGrants) {
//         console.log("[MAGUITA] Remote>", `${chalk.redBright("Remote")} request for host ${host} > ${req.path}`);
//     } else if( parts[ parts.length-1] === "aio" && req.header('x-mgt-remote-request') && !remoteGrants ) {
//         res.status( constants.HTTP_STATUS_FORBIDDEN );
//         //language=file-reference
//         return res.sendFile( fsPath.join( __dirname, "../../../../../client/public/error/remote-blocked.html" ) );
//     } else console.log( "[MAGUITA] Remote>", `${chalk.blueBright("Direct")} Request for host ${ host} > ${ req.path }`)
//
//
//     if( parts.join( "." ) !== args.webDomain ) return next();
//
//     let server = `${namespace}.aio`;
//     let application = `${REMOTE_APP_NAME}.${server}`;
//
//     aioService.api.webTarget( server, application ).then( target => {
//         if( target ){
//             return remoteProxy( target, req, res, next, host, namespace );
//         }
//
//         res.status( constants.HTTP_STATUS_INTERNAL_SERVER_ERROR );
//         //language=file-reference
//         return res.sendFile( fsPath.join( __dirname, "../../../../../client/public/error/remote-proxy.html" ) );
//     })
// });
//
//
//
