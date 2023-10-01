#!/usr/bin/env node
console.log("NODE VERSION:", process.version )
require( 'source-map-support' ).install();
require('./global/pid').showUncaughtError();

import * as path from "path";
import {FileUtil} from "zoo.util/lib/file-util";
import {launcherStatus} from "./launcher/status";
import {serverNotify} from "./snotify";
import {folders} from "./global/project";
import {args, lineArgs} from "./global/args";

serverNotify.loading( "A configurar ambiente", { notifier: false } );
serverNotify.loadingBlock( "Aplicando ajustes" );

serverNotify.loadingBlockItem( "Ajustando cwd..." );
if( !launcherStatus.launcherName ) launcherStatus.launcherName = require.main.filename;
if( !launcherStatus.launcher ) launcherStatus.launcher = path.basename( require.main.filename );
console.log( "[MAGUITA]", "CWD     :", process.cwd() );

//language=file-reference
if( process.cwd() !== path.join( __dirname, ".." ) ) process.chdir( path.join( __dirname, ".." ) );
console.log( "[MAGUITA]", "CWD      :", process.cwd() );
console.log( "[MAGUITA]", "DIR      :", __dirname );
console.log( "[MAGUITA]", "FILE     :", __filename );
console.log( "[MAGUITA]", "LAUNCHER :", launcherStatus.launcherName );
console.log( "[MAGUITA]", "APP MODE :", args.appMode  );
console.log( "[MAGUITA]", "FOLDER   :", folders.home )


serverNotify.loadingBlockItem( "Ajustando paths..." );
let _path = (process.env[ "PATH" ] || process.env["PATH"]).split( path.delimiter  );
_path = _path.filter( value => value.length
    && value !== folders.bin
);
_path.unshift( folders.bin );
process.env[ "PATH" ] = _path.join( path.delimiter );

//Apply os correction
serverNotify.loadingBlockItem( "Aplicando patches...", { notifier:false});
require( "./patches" ).patchesInstall();

if( args.dbMode === "app" ){
    args.dbPort = args.dbPortDatabaseApp;
}

//language=file-reference
FileUtil.scanFiles( path.join( __dirname, 'extension' ), /.*.extension.js$/, extension => {
    require( extension.path );
});

lineArgs.execute();

