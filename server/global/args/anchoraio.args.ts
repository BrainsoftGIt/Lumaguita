import {srv} from "../autogen/config/srv";
import {lineDefiner, lineArgs} from "./index";
import * as Path from "path";
import {folders} from "../project";
import fs from "fs";

declare module "./index" {
    export interface AIOArgs {
        aio?:string,
        aioConfigFile?:string,
    }

    interface Args extends AIOArgs{}
}

const { define, hide } = lineDefiner( Object.assign({}, srv.SERVER.SESSION, { PORT: srv.SERVER.PORT } ) );

let aio;
if( process.env["AIO"] && fs.existsSync( process.env["AIO"] ) ) aio = process.env["AIO"];
else if( fs.existsSync( Path.join( folders.snapshot, "../anchorio" ) )) aio = Path.join( folders.snapshot, "../anchorio" );
else if( fs.existsSync( Path.join( folders.snapshot, "../aio" ) )) aio = Path.join( folders.snapshot, "../aio" );

define( "aio", String, { val: aio } );
define( "aioConfigFile", String, { } );