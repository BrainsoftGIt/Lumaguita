import {registerTools, tools, toolsName} from "../../../service/tools.service";
import {pgCtl} from "../../../service/pgcluster.service";
import {args} from "../../../global/args";
import * as path from "path";
import {folders} from "../../../global/project";
import {mkdirSync} from "fs";
import {execBlock} from "../../../lib/utils/process/win32";

registerTools( "terminal",  {
    line: (command, line, args1) => {
        execBlock( [], { cwd:folders.snapshot, vars:{} }, "" )
    }
})
// registerTools( "psql",  {
//     line: (command, line, args1) => {
//         tools.connection.emit( toolsName( "psql" ))
//     }, onServer(socket) {
//         pgCtl.instance.psqlTool( {
//             env: { PGPASSWORD:  args.dbPassword },
//             host: args.dbHost,
//             port: args.dbPort,
//             database: args.dbName,
//             username: args.dbUser,
//         })
//     }, onTools( opts) {
//     }
// })

// registerTools( "dump",  {
//     line: (toolName, command, line, args1 ) => {
//         console.log( "dump start", toolName)
//         tools.connection.emit( toolName )
//     }, onServer(toolName, socket, ...params ) {
//         console.log( "dump process")
//         let dumpFolder = path.join( folders.pgHome, "dumps" );
//         let dumpFile = path.join( dumpFolder, `${args.dbName}.database.sql`);
//         mkdirSync( dumpFolder, { recursive: true } )
//         pgCtl.instance.dumpTool( {
//             env: { PGPASSWORD:  args.dbPassword },
//             host: args.dbHost,
//             port: args.dbPort,
//             database: args.dbName,
//             username: args.dbUser,
//             cOv: true,
//             ifExists: true
//         }, dumpFile ).then( value => {
//             socket.emit( toolName, dumpFile )
//         });
//     }, onTools(toolName,  opts) {
//         console.log( "dump finished!" )
//     }
// })

