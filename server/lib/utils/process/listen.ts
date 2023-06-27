
import {ChildProcess, fork, SpawnSyncReturns} from "child_process";

export type ProcessResult = {
    result:boolean,
    code: number,
    stdout: string,
    error: Error,
    messages: string[],
    output: string[],
    stderr: string
};

export type ProcessListener ={
    console?:boolean
    message?( any ):void,
    exit?(code: number | null, signal: NodeJS.Signals | null):void,
    error?( any ):void,
    output?( buffs: Buffer[] ):void,
    disconnect?( ):void,
    stdout?( chunk ):void,
    stderr?( chunk ):void,
    close?( code: number | null, signal: NodeJS.Signals | null ):void
};

export function processListen( child:( ChildProcess|SpawnSyncReturns<Buffer>), listeners?:ProcessListener ):Promise<ProcessResult>{
    if (!listeners ) listeners = {};
    return new Promise( (resolve, reject) => {
        if( child instanceof ChildProcess){
            console.log( child.spawnfile, (child.spawnargs??[]).join(" ") )
            let stdout = "";
            let stderr = "";
            let _error:Error;
            let messages = [];
            let outputs:string[] = [];

            child?.stdout?.on?.( "data", chunk => {
                if( listeners?.console ) console.log( chunk.toString() );
                if( listeners?.stdout ) listeners.stdout( chunk );
                stdout+= chunk;
                outputs.push( chunk.toString() );
            });

            child?.stderr?.on?.( "data", chunk => {
                if( listeners?.console ) console.error( chunk.toString() );
                if( listeners?.stderr ) listeners.stderr( chunk );
                outputs.push( chunk.toString() );
                stderr+= chunk
            });

            child.on( "error", err => {
                _error = err;
            })

            child.on( "message", message => {
                messages.push( message );
            })

            const end = ( code ):ProcessResult => {
                return {
                    code: code,
                    stderr: stderr.length > 0? stderr: null,
                    stdout: stdout.length > 0? stderr: null,
                    messages: messages,
                    error: _error,
                    result: !_error,
                    output: outputs
                }
            }

            child.on( "exit", (code, signal ) => {
                if( listeners.exit) listeners?.exit( code, signal );
            });

            child.on( "disconnect", () => {
                if( listeners?.disconnect) listeners.disconnect();
            })

            child.on("close", (code, signal) => {
                if( listeners?.close ) listeners.close( code, signal);
                resolve( end( code ) )
            })

            child.on( "error", err => {
                _error = err;
                console.error( err );
            });
        } else {
            console.log( "Listen ChildResult PID: ", child.pid );
            if( child.stdout ) listeners?.stderr?.( child.stdout );
            if( child.stderr ) listeners?.stdout?.( child.stderr );
            if( child.error ) listeners?.error?.( child.error );
            if( child.output ) listeners?.output?.( child.output );
            listeners?.exit?.( child.status, child.signal );
            listeners?.close?.( child.status, child.signal );
            resolve( {
                code: child.status,
                stderr: child.stderr?.toString?.(),
                stdout: child.stdout?.toString?.(),
                error: child.error,
                messages: [],
                result: !child.error,
                output: child.output.map( value => value?.toString?.() )
            })
        }
    });
}


