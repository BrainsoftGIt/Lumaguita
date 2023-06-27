//language=file-reference
import * as Path from "path";
import {FileUtil} from "zoo.util/lib/file-util";
import fs from "fs";
import {args} from "../../../../../server/global/args";

export const scripts = [
    "./engines/_base.engine.sql",
    "./engines/prepare.engine.sql",
    "./engines/report.engine.sql",
    "./engines/x3.engine.sql",
].map(value => Path.join( __dirname, value ) ) ;

//language=file-reference
FileUtil.scanFiles( Path.join( __dirname, "templates" ), /(^)*.sql$/, path => {
    scripts.push( path.path );
}, { recursive: true } );

//language=file-reference
FileUtil.scanFiles( Path.join( __dirname, "sources" ), /(^)*.sql$/, path => {
    scripts.push( path.path );
}, { recursive: true } );


let stream = fs.createWriteStream( Path.join( __dirname, "index.bat" ) );

stream.write( `SET PGHOST=${ args.dbHost || "127.0.0.1" }\r\n` );
stream.write( `SET PGPORT=${ args.dbPort || 5432 }\r\n` );
stream.write( `SET PGUSER=${ args.dbUser || "postgres" }\r\n` );
stream.write( `SET PGPASSWORD=${ args.dbPassword  }\r\n` );
stream.write( `SET PGDATABASE=${ args.dbName || "postgres" }\r\n` );
stream.write( `\r\n` );

scripts.forEach( value => {
    stream.write( `psql -f "${ value }" \n` );
});
stream.end();