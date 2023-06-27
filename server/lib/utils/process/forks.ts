import {ChildProcess} from "child_process";

export function isForkedProcess(){
    return process.send !== undefined;
}
export function isMainProcess(){
    return !!process.send;
}

export function forkEmitter ( event:string, child?:ChildProcess, ...args:any[]){
    let pack = JSON.stringify({
        event: event,
        args:[ ...args ]
    });

    if( child ) child.send( pack );
    else process.send( pack );
}

export type ForkListenerCallback = ( event:string, ...args:any[] )=>void;
export function forkListen(event:string, child?:ChildProcess, cb?:ForkListenerCallback ){
   const listen = message => {
        try {
            let pack = JSON.parse( String(message) );
            if( pack[ "event" ]  && Array.isArray( pack["args"] ) &&(pack[ "event"] === event || event === "*" || pack["event"] === "*" )){
                cb( pack["event"], ...pack["args"])
            }
        } catch (e){ console.error( e )}
    };

   if( child ) child.on("message", listen );
   else process.on( "message", listen );
}