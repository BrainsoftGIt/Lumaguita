import {spawnSync} from "child_process";

const tsc = ( cwd ) => {
    console.log( "[TSC] start...", cwd)
    const _tsc = spawnSync("tsc", { cwd: cwd , shell: "cmd" });
    if( _tsc.error ) console.log( _tsc.error );
    if( _tsc.stdout?.toString?.( "utf-8" ) ) console.log( _tsc.stdout.toString("utf-8" ));
    if( _tsc.stderr?.toString?.( "utf-8") ) console.log( _tsc.stderr.toString("utf-8" ));
    console.log( "[TSC] start... [END]")
}


tsc( "C:\\var\\workspace\\maguita\\maguita-cluster" )