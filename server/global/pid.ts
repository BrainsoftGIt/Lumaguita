
// process.stdin.resume();//so the program will not close instantly

import {sys} from "./sys";
import {args} from "./args";

const exitCallbackList:ExitSignalCallback[] = [];
let status = {
    captureCtrlC: false,
    captureKill: false,
    captureExits: false
}

function exitHandler( options, exitCode) {
    if ( options.cleanup ) exitCallbackList.forEach( callback => {
        callback( exitCode )
    })

    if (exitCode || exitCode === 0) console.log( exitCode );
    sys.exit();
}

export function captureEventsExits(){
    captureExits();
    captureKill()
}

export function captureAllExits(){
    captureExits();
    captureCtrlC();
    captureKill()
}

export function captureExits() {
    if( status.captureExits ) return;
    //do something when app is closing
    process.on('exit', exitHandler.bind(null,{cleanup:true}));
    status.captureExits = true;
}

export function captureCtrlC (){
    if( status.captureCtrlC ) return;
    //catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, { exit:true }));
    status.captureCtrlC = true;
}

export function captureKill() {
    if( status.captureKill ) return;
    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', exitHandler.bind(null, { exit:true }));
    process.on('SIGUSR2', exitHandler.bind(null, { exit:true }));
    status.captureKill = true;
}

export function showUncaughtError(){
    if( args.appMode === "dev" ) return;

    process.on('unhandledRejection', (reason, p) => {
        console.log( "[[================ [Unhandled Rejection at Promise] ================" );
        console.error( reason?.toString?.() );
        p.catch( reason1 => {
            console.error( reason1?.toString?.() );
        })
        console.log( "================ Unhandled Rejection at Promise ================]]" );
    });
    process.on('uncaughtException', err => {
        console.log( "[[================ [Uncaught Exception Thrown] ================" );
        console.error( err?.toString?.() );
        console.log( "================ Uncaught Exception thrown ================]]" );
    });

    process.on('uncaughtExceptionMonitor', err => {
        console.log( "[[================ [Uncaught Exception Exception Monitor] ================" );
        console.error( err?.toString?.() );
        console.log( "================ Uncaught Exception Exception Monitor ================]]" );
    });

    process.on('rejectionHandled', err => {
        console.log( "[[================ [Rejection Handled] ================" );
        console.error( err?.toString?.() );
        console.log( "================ Rejection Handled ================]]" );
    });
}

export type ExitSignalCallback = ( exitCode:number )=> void;

export function onExitSignal( ... exitCallback:ExitSignalCallback[] ){
    exitCallbackList.push( ...exitCallback );
}