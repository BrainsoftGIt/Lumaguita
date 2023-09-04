// import {args} from "../../global/args";
// import detectPort from "detect-port";
// import fs from "fs";
// import {ChildProcess, fork, spawn} from "child_process";
// import * as Path from "path";
// import ini from "ini";
// import chalk from "chalk";
// import * as futil from "zoo.util/lib/file-util";
// import {AioAPI} from "./api";
//
// export enum AIOStatus {
//     UNK="AIOStatus.UNK",
//     RUNNING="AIOStatus.RUNNING",
//     STOPPED="AIOStatus.STOPPED"
// }
//
// export type OnRunning = ()=>void
//
//
// type AIOConfig = {
//     server?: {
//         "server-port"?: number
//         "anchor-port": number
//         "max-slots": number
//         "min-slots": number
//     }, agent?: {
//         identifier:string
//         name:string
//         "server-host": string
//         "agent-port": number
//         "agent-api": number
//         "server-port": number
//         "anchor-port": number
//         "max-slots": number
//         "min-slots": number
//     }
// }
//
// export interface Token {
//     identifier:string,
//     token:string,
//     date:string,
//     status:"active"|"disable",
//     mail:string
// }
//
// export const aioService = new ( class AnchorioService {
//     private _status:AIOStatus = AIOStatus.UNK;
//     private _onResponse:(()=>void)[] = [];
//     private _process:ChildProcess;
//     aio:string
//     aioConfig:AIOConfig
//     aioEnvFile:string
//     aioAgentPort:number
//     aioAgentAPI:number;
//     api:AioAPI;
//
//     constructor() {
//         let loadConfigs = this.loadConfigs();
//         console.log( "[MAGUITA] AIO.service> Load configs...",  loadConfigs );
//         if( loadConfigs === "ok" ) {
//             this.checkAIORunning( 2, 1000 ).then( running => {
//                 if( !running ){
//                     this.start().then( _status => {
//                         this._status = _status;
//                         this._onResponse.forEach( next => next() );
//                     })
//                 } else {
//                     this._status = AIOStatus.RUNNING;
//                     this._onResponse.forEach( next => next() );
//                 }
//             })
//         } else {
//             this._status = AIOStatus.STOPPED;
//             this._onResponse.forEach( next => next( ) );
//         }
//
//     }
//
//     private loadConfigs():string|"ok"{
//         this.aio = args.aio;
//         this.aioEnvFile = args.aioConfigFile;
//         if( !this.aio ) return "false: !this.aio";
//         if( !fs.existsSync( this.aio ) ) return "false: !fs.existsSync( this.aio )";
//
//         // if( !this.aioEnvFile && appAioConfig && fs.existsSync( appAioConfig )) this.aioEnvFile = appAioConfig;
//         if( !this.aioEnvFile && fs.existsSync( Path.join( this.aio, "/etc/anchorio.conf" ) ) ) this.aioEnvFile = Path.join( this.aio, "/etc/anchorio.conf" );
//         if ( !this.aioEnvFile || !fs.existsSync( this.aioEnvFile ) ) return "false: !fs.existsSync( this.aioConfigFile )";
//
//         this.aioConfig =  ini.parse( fs.readFileSync( this.aioEnvFile ).toString( "utf8" ) );
//         console.log( "[MAGUITA] Anchorio>", `EnvFile of anchorio ${ new futil.Path({path:this.aioEnvFile}).url.href }` );
//
//         this.aioAgentAPI = +this.aioConfig.agent["agent-api"];
//         if( !Number.isSafeInteger( this.aioAgentAPI ) ) this.aioAgentAPI = null;
//         this.aioAgentPort = +this.aioConfig.agent["agent-port"];
//         if( !Number.isSafeInteger( this.aioAgentPort ) ) this.aioAgentPort = null;
//
//         this.api = new AioAPI( { agentAPI: this.aioAgentAPI })
//
//         return "ok";
//     }
//
//     private checkAIORunning( retry?:number, timeout?:number ):Promise<boolean>{
//         console.log( `[MAGUITA] checking anchorio is runing...`)
//         if( !timeout ) timeout = 1000;
//         if( retry === undefined || retry === null ) retry = 0;
//
//         return new Promise( (resolve, reject) => {
//             const port = this.aioAgentAPI;
//             if( !port ) return resolve( false );
//             detectPort( port ).then( _port => {
//                 if( port !== _port ) {
//                     console.log( `[MAGUITA] checking anchorio is runing... OK!`)
//                     return resolve( true );
//
//                 } else if( retry-1 > 0 ) {
//                     console.log( `[MAGUITA] checking anchorio is runing... RETRY!`);
//                     setTimeout( ()=> this.checkAIORunning( retry-1, timeout ).then( running => resolve( running ) )
//                         .catch( reason => resolve( false )), timeout );
//
//                 } else {
//                     console.log( `[MAGUITA] checking anchorio is runing... STOPPED!`)
//                     return resolve( false );
//                 }
//             })
//         })
//     }
//
//     onRunning( callback:OnRunning){
//         this.status.then( _status => {
//             if( _status === AIOStatus.RUNNING ) callback();
//             else setTimeout( ()=> this.onRunning( callback ), 1000 )
//         });
//     }
//
//     public tokenList( ): Promise<Token[]>{
//         return this.tokenResolver(  "--list" );
//     }
//
//     public tokenGenerate( identifier): Promise<Token>{
//         return this.tokenResolver(  "--identifier", identifier, "--generate" );
//     }
//
//
//     public tokenOf( identifier:string ): Promise<Token>{
//         return this.tokenResolver(  "--identifier", identifier );
//     }
//
//     private tokenResolver<T>( ...params):Promise<T>{
//         return new Promise( resolve => {
//             let raw = "";
//             let process = this.forkIO( "token", "-format", "json",  ...params);
//
//             process.stdout.on( "data", chunk => {
//                 raw += chunk.toString();
//                 console.log( chunk.toString() );
//             });
//
//             process.on( "close", code => {
//                 if( code !== 0 ) return resolve( null );
//                 let list = null;
//                 try { list = JSON.parse( raw ) } catch ( ex ) {}
//                 return resolve( list );
//             });
//         });
//     }
//
//     private fork( ...params:string[] ){
//         return fork( Path.join( this.aio, "aio/index.js" ), params, {
//             cwd: Path.join( args.aio )
//         });
//     }
//
//     private forkIO( ...params:string[] ){
//         return fork( Path.join( this.aio, "aio/index.js" ), params, {
//             cwd: Path.join( args.aio ),
//             stdio: "pipe"
//         });
//     }
//
//     private start():Promise<AIOStatus>{
//         console.log( `[MAGUITA] starting anchorio agent ...` );
//
//         return new Promise<AIOStatus>((_resolve, reject) => {
//             let resolve = (_status:AIOStatus, message?:string )=>{
//                 if( _status !== AIOStatus.RUNNING ) {
//                     console.log( `[MAGUITA] starting anchorio agent... FAILED!`, message );
//                     setTimeout( ()=>{
//                         this.start().then();
//                     }, 1000 * 60 * 5 )
//                 } else {
//                     console.log( `[MAGUITA] starting anchorio agent... STARTED!` );
//                 }
//                 _resolve( _status );
//             }
//             if( this._status === AIOStatus.RUNNING ) return resolve( AIOStatus.RUNNING );
//
//             let srv = require( "../cluster.service" ).clusterServer;
//             Promise.all( [
//                 srv.service.localCluster(),
//                 srv.service.masterCluster()
//             ]).then( value => {
//                 let [ local, master ] = value;
//                 let namespace = local.cluster_namespace;
//                 let host = master.cluster_domain;
//                 let urlParts = /^(?:\w+\:\/\/)?([^\/]+)([^\?]*)\??(.*)$/.exec(host);
//
//                 host = urlParts[1];
//
//                 if( !namespace ) return  resolve( AIOStatus.STOPPED, "Namespace not defined");
//                 if( !host ) return resolve( AIOStatus.STOPPED, "Host not defined" );
//
//                 let identifier = `${namespace}.aio`;
//                 let forkProcess = ( )=>{
//                     let pro =   this.fork(  "agent",
//                         "--envFile", `${ this.aioEnvFile }`,
//                         "--noDNS",
//                         "--identifier", identifier,
//                         "--server-host", host,
//                         "--app-label", `anchorio-agent:${args.app}`
//                     );
//                     console.log( "[MAGUITA] Anchorio>", `Start anchorio agent with PID ${ chalk.blueBright( String( pro.pid ) ) }`);
//                     pro.on("exit", code => {
//                         this.status.then( _status => {
//                             if ( _status === AIOStatus.RUNNING ) forkProcess();
//                         })
//                     });
//                     return pro;
//                 }
//                 let _process = forkProcess();
//
//                 this.checkAIORunning( 10, 1500 ).then( started => {
//                     if( started ){
//                         this._status = AIOStatus.RUNNING;
//                         this._process = _process;
//                         return resolve( AIOStatus.RUNNING );
//
//                     } else  {
//                         this._status = AIOStatus.STOPPED;
//                         return resolve( AIOStatus.STOPPED, "Not check server" )
//                     }
//                 })
//
//             });
//         })
//     }
//
//     get status():Promise<AIOStatus>{
//         return new Promise<AIOStatus>( (resolve, reject) => {
//             if( this._status !== AIOStatus.UNK ) return resolve( this._status );
//             else this._onResponse.push(()=> resolve( this._status ) );
//         })
//     }
// })();