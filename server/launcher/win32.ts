import {args} from "../global/args";
import {captureEventsExits, showUncaughtError} from "../global/pid";
import {launcherStatus} from "./status";
import {nwAppStatus} from "../../client/app/status";

showUncaughtError();
captureEventsExits();
launcherStatus.launcherName = __filename;
launcherStatus.launcher = "exe.ts";

if( args.appWithNodeWebKit ){
    nwAppStatus.runningIntoNW = true;
}

args.appMode = "public";
args.app = "LUMA";
if( !args.dbMode ) args.dbMode = "app";

require( '../main' );