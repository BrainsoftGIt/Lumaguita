import {hideBin} from "yargs/helpers";
import yargs from "yargs";
import { flocoto } from "kitres";
import Path from "path";

const argv = yargs( hideBin(process.argv))
    .option("isolated", {
        type: "boolean",
    }).parse();

let isolated = argv["isolated"];
flocoto.launcher( Path.join( __dirname, /*language=file-reference*/ "../../"), {
    isolated: isolated
});


