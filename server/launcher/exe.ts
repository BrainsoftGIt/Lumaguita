#!/usr/bin/env node
require( 'source-map-support' ).install();
import path from "path";

//language=file-reference
let win32Launcher = path.join( __dirname, "../launcher/win32.js" );

require( win32Launcher );
