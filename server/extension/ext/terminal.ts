import {DEFAULTS} from "../../global/defaults";
import path from "path";
import {spawn} from "child_process";
import {args} from "../../global/args";

export function openAppShell(){
    const { pgServer } = require("../lib/postgres/pg-recoginizer");
    pgServer.recognizePath( DEFAULTS.DB_VERSION, DEFAULTS.DB_VERSION_UP ).then(value => {

        let _path = process.env["Path"].split( path.delimiter );
        //language=file-reference
        _path.unshift( path.join(__dirname, "../../bin" ) );
        const usePath  = _path.join( path.delimiter );
        spawn( "mg-ps.exe", [], {
            //language=file-reference
            cwd: path.join( __dirname, ".."),
            shell: true,
            detached: true,
            env: {
                "PGHOST": args.dbHost,
                "PGPASSWORD": args.dbPassword,
                "PGUSER": args.dbUser,
                "PGPORT": String( args.dbPort ),
                "PGDATABASE": args.dbName,
                "Path": usePath
            }
        }).on( "close", code => {
            process.exit( 0 )
        })
    });
}