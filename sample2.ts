import Path from "path";
import {execSync, spawnSync} from "child_process";

let pg14  = "C:\\Program Files\\PostgreSQL\\14\\bin";
process.env["PATH"] = [
    ... process.env["PATH"].split( Path.delimiter ),
    pg14,
].join( Path.delimiter );

let where = spawnSync( "where", [ "psql" ] );
console.log( where.stdout.toString() );

let version  = spawnSync( "psql", [ "--version"] );
console.log( version.stdout.toString() );

