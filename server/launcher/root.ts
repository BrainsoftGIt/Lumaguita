#!/usr/bin/env node
import {launcherStatus} from "./status";

launcherStatus.launcherName = __filename;
launcherStatus.launcher = "root.ts"

import { captureEventsExits, showUncaughtError } from "../global/pid";

require( 'source-map-support' ).install();
import {args} from "../global/args";

showUncaughtError();
captureEventsExits();

launcherStatus.launcher = "root.ts";
args.appSelfMaster = true;
if( !args.dbMode ) args.dbMode = "system";


setTimeout(()=>{
    require( '../main' );
}, 2*1000 )
