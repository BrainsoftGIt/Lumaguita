import {srv} from "../autogen/config/srv";
import {lineDefiner, lineArgs} from "./index";

declare module "./index" {
    export interface LogArgs {
        logLevel?:string,
        logSnapshot?:boolean
    }

    interface Args extends LogArgs{}


}

const { define, hide } = lineDefiner( Object.assign({}, srv.SERVER.SESSION, { PORT: srv.SERVER.PORT } ) );

//Express args configs
define( "logLevel", String, { } );
define( "logSnapshot", Boolean, { val: false } );
