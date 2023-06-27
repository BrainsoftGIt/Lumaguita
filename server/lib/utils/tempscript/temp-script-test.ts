require("source-map-support").install();
import {TempScript} from "./index";
import {win32TempScriptEngine} from "./engines/win32.engine";

const tempScript = new TempScript(win32TempScriptEngine);
tempScript.command( "explorer" )
    .env( "PGPASSWORD", "1234")
    .path( "c:/ssd/fd" )
console.log( tempScript.script.raw );