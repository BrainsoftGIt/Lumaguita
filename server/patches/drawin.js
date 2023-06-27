"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patches = void 0;
const os_1 = __importDefault(require("os"));
function patches() {
    if (os_1.default.platform() === "darwin") {
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
exports.patches = patches;
//# sourceMappingURL=drawin.js.map