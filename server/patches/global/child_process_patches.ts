import os from "os";
if( os.platform() !== "win32" ){
    const child_process = require("child_process");
    const original:typeof child_process = Object.assign( {...child_process} );
    let func:(keyof typeof  child_process)[] = [ "spawn", "spawnSync", "exec", "execSync" ];

    func.forEach( funcName => {
        child_process[funcName] = ( command, args, opts )=>{
            let optArgs = false;
            if( args && !Array.isArray( args ) ){
                opts = args;
                args = [];
                optArgs = true;
            }
            if( opts && typeof opts === "object" && opts.env ) {
                opts.env = Object.assign( {}, process.env, opts.env );
            }

            if( optArgs ){
                args = opts;
                opts = undefined;
            }

            if( command && args && opts ) return original[funcName]( command, args, opts )
            else if( command && args ) return original[funcName]( command, args )
            else return original[funcName]( command )
        }
    });
}