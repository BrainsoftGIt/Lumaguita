import fs from "fs"
import * as Path from "path";
//language=file-reference
export const VERSION = fs.readFileSync( Path.join( __dirname, "../../VERSION")).toString("utf-8")
    .trim()
    .split("\n")
    .map( value => value.trim() )
    .filter( value => value.length )
    [ 0 ]
;
