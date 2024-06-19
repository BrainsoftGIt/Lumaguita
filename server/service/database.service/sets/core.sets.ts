import {scriptUtil} from "kitres";
import {pgCore} from "../core";

pgCore.on("error", (error, line) => {
    console.log( `Error ao executar a query Line: ${ scriptUtil.urlOf( line ) }`);
    console.error( error );
})
