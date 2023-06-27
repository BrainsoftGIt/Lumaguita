import {spawnSync} from "child_process";
import path from "path";

//language=file-reference
// let dir = path.join( __dirname, "../node_modules/typescript/bin/tsc" )
require("typescript/bin/tsc")
let result = spawnSync("tsc", {
    cwd: path.join( __dirname, ".." )
} );
console.log( result );
