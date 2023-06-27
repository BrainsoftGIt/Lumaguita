import {args} from "../global/args";
import {captureEventsExits, showUncaughtError} from "../global/pid";
import {launcherStatus} from "./status";

showUncaughtError();
captureEventsExits();
launcherStatus.launcherName = __filename;
launcherStatus.launcher = "nw.ts";
args.appMode = "public";
args.appWithNodeWebKit = true;
if( !args.dbMode ) args.dbMode = "app";
require( '../main' );