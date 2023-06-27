#!/usr/bin/env node
import {args} from "../global/args";
import {launcherStatus} from "./status";

require( 'source-map-support' ).install();
launcherStatus.launcherName = __filename;
launcherStatus.launcher = "index.ts"

if( !args.dbMode ) args.dbMode = "system";

export * from "../main"


