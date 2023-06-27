
// process.stdin.resume();//so the program will not close instantly

import {sys} from "./sys";

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
    process.on('unhandledRejection', (reason, p) => {
        console.log( "[[================ Unhandled Rejection at Promise ================" );
        console.error( reason, p );
        console.log( "================ Unhandled Rejection at Promise ================]]" );

    });
    process.on('uncaughtException', err => {
        console.log( "[[================ Uncaught Exception thrown ================" );
        console.error( err );
        console.log( "================ Uncaught Exception thrown ================]]" );
    });
}

export type ExitSignalCallback = ( exitCode:number )=> void;

export function onExitSignal( ... exitCallback:ExitSignalCallback[] ){
    exitCallbackList.push( ...exitCallback );
}