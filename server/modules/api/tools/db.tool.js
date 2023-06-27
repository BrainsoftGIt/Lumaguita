"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_service_1 = require("../../../service/tools.service");
const project_1 = require("../../../global/project");
const win32_1 = require("../../../lib/utils/process/win32");
(0, tools_service_1.registerTools)("terminal", {
    line: (command, line, args1) => {
        (0, win32_1.execBlock)([], { cwd: project_1.folders.snapshot, vars: {} }, "");
    }
});
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
//# sourceMappingURL=db.tool.js.map