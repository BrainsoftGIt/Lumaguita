import fs from "fs";

require('source-map-support').install()
import {applyPatches, PatchConfigs, SQLBlock} from "./core/updater";
import {FileUtil} from "zoo.util/lib/file-util";
import * as Path from "path";
import chalk from "chalk";

let configs:PatchConfigs = {
    schema: "patch",
    onBlockSuccess:( block:SQLBlock, success:any )=>{
        console.log( "[MAGUITA] Database patch>", block.ref, chalk.greenBright( 'OK!' )  );
        return Promise.resolve();
    }, onBlockFailed(block: SQLBlock, success: any): Promise<void | true> {
        console.log( "[MAGUITA] Database patch>", block.ref, chalk.redBright( 'FAILED!' )  );

        return Promise.resolve();
    }
}

export function applyDatabasePatches(){

    FileUtil.scanFiles( Path.join(__dirname,/*language=file-reference*/ "revisions"), /(^)*.sql.js$/, ( path)=>{
        let url = path.url;
        let _ts = Path.join( Path.dirname( path.path ), Path.basename( path.path, Path.extname( path.path ) ) ) + ".ts";
        if( fs.existsSync( _ts ) ) url = new URL( `file:${_ts}` );

        console.log( "[MAGUITA] Database patch>", url.href, "found!" );
    }, { recursive: true }).forEach(path => require( path.path))
    return applyPatches( configs );
}