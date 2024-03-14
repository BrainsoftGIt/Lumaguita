import {fork} from "child_process";
import Path from "path";
import {hideBin} from "yargs/helpers";
import yargs from "yargs";
import {manifest} from "../../server/context";

const argv = yargs( hideBin(process.argv))
    .option("isolated", {
        type: "boolean",
    }).parse();



let flocotoRoot = Path.join( __dirname, /*language=file-reference*/ "../../../flocoto" );
let flocotoMainFile = Path.join( flocotoRoot, "server/launcher/index.js" );
const isolated = argv["isolated"];

let args = [];
if( isolated ) args.push( "--flocoto", manifest.name );
fork( flocotoMainFile, args, {
    cwd: flocotoRoot
});


