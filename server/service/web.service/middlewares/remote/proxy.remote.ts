// import {createProxyMiddleware, Options, RequestHandler} from "http-proxy-middleware";
// import {constants} from "http2";
// import fsPath from "path";
// import {NextFunction, Request, Response} from "express";
// import {OnErrorCallback} from "http-proxy-middleware/dist/types";
// import fs from "fs";
// import {aioService} from "../../../anchorio.service";
// import {args} from "../../../../global/args";
// import {WebTarget} from "../../../anchorio.service/api";
//
//
// let proxies:{[ p:string ]:Route} = {};
//
// export const REMOTE_APP_NAME = args.app.toLowerCase();
//
//
// export const onError:  OnErrorCallback =  (  err, req1, res1, target1 )=>{
//     res1.writeHead( 500, {
//         'Content-Type': 'text/html',
//     } );
//     //language=file-reference
//     const stream = fs.readFileSync( fsPath.join( __dirname, "../../../../../client/public/error/remote-proxy.html" ) );
//     res1.end( stream );
//
// }
// interface AgentListener {
//     port:number,
//     status:"running"|"available"
// }
//
// let _listeners:AgentListener[] = [];
//
// function availableListener(): Promise<AgentListener>{
//     return new Promise<AgentListener>(resolve => {
//         let listener = _listeners.find( value => value.status === "available" );
//         if( listener ) return resolve( listener );
//         aioService.api.needPorts().then( port => {
//             console.log(  { port, ports:aioService.api.ports } )
//             aioService.api.ports.forEach( port => {
//                 if( !_listeners.find( _listener => _listener.port === port ) ){
//                     console.log( "new port to listener....", port )
//                     _listeners.push({
//                         port: port,
//                         status: "available"
//                     })
//                 }
//             });
//
//             let listener = _listeners.find( _listener => _listener.status === "available" );
//             console.log( listener, _listeners );
//             if( listener ) return resolve( listener );
//             else return availableListener().then( value => resolve( value ) );
//         });
//     })
// }
//
// type Route = {
//     proxy?:RequestHandler,
//     next?( req:Request, res:Response, next:NextFunction)
//     address?: string,
//     target:string,
//     port:number
//     protocol:"http"|"https"
// };
//
// export function remoteProxy( webTarget:WebTarget, req, res, next, host, namespace ){
//     let use = proxies[ webTarget.address ];
//
//     let _opts:Options = { onError: onError , headers: {
//             host: `${host}.aio:${ req.get('host').split(":")[1]||80 }`,
//             "x-mgt-remote-version": "1.0.2",
//             "x-mgt-remote-request": require("../../../cluster.service").clusterServer.localCluster?.cluster_namespace||"master"
//         }};
//
//     if( !use ){
//         require( "../../../cluster.service" ).clusterServer.service.loadClusterByNamespace( namespace ).then(cluster => {
//             if( !cluster ){
//                 res.status( constants.HTTP_STATUS_FORBIDDEN );
//                 //language=file-reference
//                 return res.sendFile( fsPath.join( __dirname, "../../../../../client/public/error/remote-namespace.html" ) );
//             }
//             console.log( "[MAGUITA] Proxy>", `Create proxy from ${ "http" }:${ host } to ${ webTarget.address }` );
//             use = createRemoteProxy( webTarget, _opts );
//             use.next( req, res, next );
//         });
//     } else use.next( req, res, next );
// }
//
//
//
// function createRemoteProxy( webTarget:WebTarget, opts:Options ):Route{
//     let target = `${webTarget.protocol}://${ webTarget.address }:${ aioService.aioAgentPort }`;
//     let options:Options = { target }
//
//     let use:Route = { target, address: webTarget.address, port: aioService.aioAgentPort, protocol: webTarget.protocol,
//         proxy: createProxyMiddleware( Object.assign( {}, opts, options )),
//         next(req: Request, res: Response, next: NextFunction) {
//         use.proxy( req, res, next )
//     }};
//
//     proxies[ webTarget.address ] = use;
//     return use;
// }
//
//
//
// aioService.onRunning(()=>{
//     aioService.api.getApplication( REMOTE_APP_NAME ).then( application  => {
//         if( !application ) aioService.api.createApplication( REMOTE_APP_NAME, args.appPort, "127.0.0.1" ).then( _app => {
//             if( application )console.log( "[MAGUITA] Proxy> created application maguita on anchorio!" );
//             else  console.log( "[MAGUITA] Proxy> Failed to create application maguita on anchorio!" );
//         })
//         else console.log( `[MAGUITA] Proxy> application maguita already created on anchorio!`)
//     })
// });
//
//
//
//
