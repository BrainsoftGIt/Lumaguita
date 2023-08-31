// import axios from "axios";
// import {aioService} from "./index";
// import {AgentServer, Application} from "../web.service/middlewares/remote/route.remote";
//
// interface DnsAnswer {
//     name: string;
//     type: number;
//     class: number;
//     ttl: number;
//     address?: string;
//     domain?: string;
// }
//
// export interface APIOptions { agentAPI:number }
//
// export type WebTarget = {
//     address:string,
//     protocol:"http"|"https"
// }
//
// export class AioAPI {
//     agents:[] = []
//     resolvers:[] = []
//     applications:[] = []
//     url:string
//     agentAPI:number
//     options:APIOptions;
//     webProtocol:"http"|"https";
//
//     constructor( opts:APIOptions ) {
//         this.options = opts;
//         this.agentAPI = opts?.agentAPI;
//         if( this.agentAPI ) this.url = `http://127.0.0.1:${ this.agentAPI }`;
//         this.webProtocol = "http";
//     }
//
//     getAgent( identifier:string ):Promise<AgentServer>{
//         return new Promise( (resolve ) => {
//             if( !this.agentAPI ) return resolve( null );
//             if( !this.url ) return resolve( null );
//
//             let _parts = identifier.split(".");
//             if( _parts[_parts.length-1] !== "aio" ) _parts.push( "aio" );
//             if( _parts.length <2 ) return null;
//             identifier = _parts.join( "." );
//             let _agent = this.agents[ identifier ];
//             if( _agent ) return resolve( _agent );
//             axios.get( `${this.url}/api/agent/${ identifier }`).then( value => {
//                 if( value.status !== 200 ) return resolve( null );
//                 if( !value.data.success ) return resolve( null );
//                 _agent = value.data.data;
//                 this.agents[ identifier ] = _agent;
//                 return resolve( _agent );
//             }).catch( reason => {
//                 console.log( "[MAGUITA] ANCHORIO API>", `Error to get agent ${ identifier } ${ reason["message"] } `)
//
//                 resolve(null) })
//         })
//     }
//
//     getDomain( server:string ):Promise<DnsAnswer>{
//         return new Promise( (resolve ) => {
//             if( !this.agentAPI ) return resolve( null );
//             if( !this.url ) return resolve( null );
//
//             let _server = this.agents[ server ];
//             if( _server ) return resolve( _server );
//             axios.get( `${this.url}/api/domain/${ server }`).then( value => {
//                 if( value.status !== 200 ) return resolve( null );
//                 if( !value.data.success ) return resolve( null );
//                 let answer = value.data.data;
//                 if( !Array.isArray( answer )|| !answer.length ) return resolve( null );
//                 _server = answer [ 0 ];
//                 this.agents[ server ] = _server;
//                 return resolve( _server );
//             }).catch( reason => {
//                 console.log( "[MAGUITA] ANCHORIO API>", `Error to get domain ${ server } ${ reason["message"] } `)
//
//                 resolve(null)
//             })
//         })
//     }
//
//     getApplication( application:string ):Promise<Application>{
//         return new Promise( (resolve ) => {
//             if( !this.agentAPI ) return resolve( null );
//             if( !this.url ) return resolve( null );
//
//             let _app = this.applications[ application];
//             if( _app ) return resolve( _app );
//
//             axios.get( `${this.url}/api/app/${ application }`).then( value => {
//                 if( value.status !== 200 ) return resolve( null );
//                 if( !value.data.success ) return resolve( null );
//                 _app = value.data.data;
//                 this.agents[ application ] = _app;
//                 return resolve( _app );
//             }).catch( reason => {
//                 console.log( "[MAGUITA] ANCHORIO API>", `Error to get application ${ application } ${ reason["message"] } `)
//                 resolve(null);
//             })
//         })
//     }
//
//     ports:number[] = [];
//
//     needPorts( ){
//         let _api = "/api/ports";
//         return new Promise( (resolve ) => {
//             if( !this.agentAPI ) return resolve( null );
//             if( !this.url ) return resolve( null );
//
//             axios.get( `${this.url}${ _api }`, {
//                 data: { ports: this.ports }
//             }).then( value => {
//                 if( value.status !== 200 ) return resolve( null );
//                 if( !value.data.success ) return resolve( null );
//                 let _port = value.data.data.port;
//                 this.ports = value.data.data.ports;
//                 return resolve( _port );
//             }).catch( reason => {
//                 console.log( "[MAGUITA] ANCHORIO API>", `Error to get ports  ${ reason["message"] } `)
//                 resolve(null) })
//         })
//
//     }
//
//     createApplication( application:string, port:number, host?:string){
//         return new Promise( (resolve ) => {
//             if( !this.agentAPI ) return resolve( null );
//             if( !this.url ) return resolve( null );
//
//             let _app = this.applications[ application];
//             if( _app ) return resolve( _app );
//             axios.post( `${this.url}/api/app/${application}`, { port: port, host:host } , {
//                 headers: { "content-type": "application/json" }
//             }).then( value => {
//                 if( value.status !== 200 ) return resolve( null );
//                 if( !value.data.success ) return resolve( null );
//                 _app = value.data.data;
//                 this.agents[ application ] = _app;
//                 return resolve( _app );
//             }).catch( reason => {
//                 console.log( "[MAGUITA] ANCHORIO API>", `Error to create application ${ application } ${ reason["message"] } `)
//                 resolve(null)
//             });
//         })
//     }
//
//     webTarget( server, application ):Promise<WebTarget>{
//         return new Promise( (resolve, reject) => {
//             Promise.all([
//                 aioService?.api?.getAgent?.( server ),
//                 aioService?.api?.getDomain?.( application )
//             ]).then( response => {
//                 let [ _agent, _domain ] = response;
//                 if( !_agent || !_domain ) return resolve( null );
//                 // let target = `${this.webProtocol}://${ _domain.address }:${ aioService.aioAgentPort }`;
//
//                 return resolve({ address: _domain.address, protocol: this.webProtocol } );
//             }).catch( reason => {
//                 console.log( reason );
//                 resolve( null );
//             })
//         })
//
//     }
// }