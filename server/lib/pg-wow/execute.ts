// import {Pool, Query} from "pg";
// import cli from "nexe/lib/steps/cli";
// import {validate} from "node-cron";
//
// interface NoticeWow{
//
// }
//
// export interface ExecuteOptions {
//     notice:boolean,
//
// }
//
// interface RowWow {
//     id:number
// }
//
// interface ResultWow {
// }
//
// export class Stream{
//     on( event:"notice", listener:(notice:NoticeWow)=>void)
//     on( event:"row", listener:(row:RowWow)=>void)
//     on( event:"result", listener:(result:ResultWow)=>void)
//     on( event:"end", listener:()=>void);
//     on( event:"end"|"row"|"result", listener){
//     }
// }
//
// export class ExecuteStream implements Stream{
//     listeners:{[p:string]:any[]} = new Proxy({}, {
//         get(target: {}, p: string | symbol, receiver: any): any {
//             if( !target[p] ) target[ p ] = [];
//             return target[p];
//         }
//     })
//
//     on( event:"notice"|"row"|"result"|"end", listener ){
//         this.listeners[event].push( listener );
//     }
// }
//
//
// export type OnRowWow = ( error:Error, row:any, final:boolean )=> void
// export type OnNoticeWow = ( notice:OnNoticeWow )=> void
//
//
// export type ExecuteStreamListener = ( stream:Stream )=> void;
// export class ExecuteWow{
//     public static stream( pool:Pool, str:string, values:any, onStream:ExecuteStreamListener ){
//         pool.connect( (err, client) => {
//             if( err ) return;
//             let query = new Query(str, values );
//             let stream:ExecuteStreamListener = {
//             }
//             client.on( "notice", notice => {});
//             query.on("row", (row, result) => {});
//             query.on("error", err1 => {});
//             query.on( "end", result => {});
//         });
//     }
// }
//
// ExecuteWow.stream( null, "sdss", ( event, name )=>{
//     if( event === "row" ) name.id
// })
//
// export function executeStreamWow(pool:Pool, str:string, args:any[], opts:ExecuteOptions){
//
//
//     pool.connect( (err, client, done) => {
//         client.on("error", notice => {
//             console.log( "error", notice );
//         });
//         client.on("notice", notice => {
//             console.log( "notice", notice );
//         });
//         client.on("notification", notice => {
//             console.log( "notification", notice );
//         });
//
//
//         let query = new Query(str, args );
//         client.query( query )
//
//
//
//         client.query( str, args, (err1, result) => {
//
//         })
//     });
// }
