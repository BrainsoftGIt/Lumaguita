import { AppVersion } from "kitres";
import Path from "path";
import {args} from "./global/args";
export const VERSION = new AppVersion({
    project: Path.join( __dirname, /*language=file-reference*/ ".." ),
    readonly: args.appMode !== "dev"
});

declare global {
    let VERSION: AppVersion;
}

// @ts-ignore
global.VERSION = VERSION;


console.log( "VERSION-NUMBER", VERSION.NUMBER )


