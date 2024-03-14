import {srv} from "../autogen/config/srv";
import {lineDefiner, lineArgs} from "./index";
import * as Path from "path";
import {Folders} from "../project";
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
else if( fs.existsSync( Path.join( Folders.snapshot, "../anchorio" ) )) aio = Path.join( Folders.snapshot, "../anchorio" );
else if( fs.existsSync( Path.join( Folders.snapshot, "../aio" ) )) aio = Path.join( Folders.snapshot, "../aio" );

define( "aio", String, { val: aio } );
define( "aioConfigFile", String, { } );