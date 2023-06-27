import {args, lineArgs} from "../global/args";
import {detectServer, ServerCtl} from "./ctrl";

function serverShutdown(){
    console.log("serverShutdown...")
    detectServer().then( value => {
        if( value ) value.write( ServerCtl.SHUTDOWN );
    })
}
function serverExit(){
    console.log("serverExit...")
    detectServer().then( value => {
        if( value ) value.write( ServerCtl.EXIT );
    })
}

lineArgs.defineCommand( { name: ["exit"],  callback: serverExit });
lineArgs.defineCommand( { name: ["shutdown"],  callback: serverShutdown });