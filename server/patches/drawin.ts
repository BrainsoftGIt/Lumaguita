import os from "os";
export function patches(){
    if( os.platform() === "darwin" ){
        // const prepareOption = ( options ) =>{
        //     let opts = null;
        //     if( options[0] && typeof options[0] === "object" && !Array.isArray( options[0]) ) opts = 0;
        //     else if( options[1] && typeof options[1] === "object" && !Array.isArray( options[1] ) ) opts = 1;
        //
        //     if( opts !== null && options[opts].env ) {
        //         let env = options[opts].env;
        //         options[opts].env = Object.assign({}, process.env, env );
        //     }
        //     return options;
        // }
        // const child_process = require("child_process");
        //
        // let patchesFunction:(keyof typeof child_process)[] = [
        //     "fork",
        //     "spawn",
        //     "exec",
        //     "spawnSync",
        //     "execSync"
        // ];
        // patchesFunction.forEach( childName => {
        //     let nodeFunction = child_process[ childName ];
        //     child_process[childName] = ( (command, ...options) => {
        //         options = prepareOption( options );
        //         return nodeFunction( command, ...options );
        //     })
        // })
    }

}