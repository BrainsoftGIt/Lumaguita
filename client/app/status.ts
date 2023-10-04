import {ctrlBroadcast} from "../../server/extension/ctrl";

type NwAppStatus = {
    isNwMode:boolean,
    runningIntoNW:boolean,
    status:"init"|"ready",
    currentWindow?:any,
    splashWindow?:any,
    mainWindows?:any,
    notify( event:string, ...args)
    on( event:string, cb:( ...args)=>void )
    once( event:string, cb:( ...args)=>void )
}


const _once:{[p:string]:(( ...any )=>void)[]} = new Proxy( {}, {
    get(target: {}, p: PropertyKey, receiver: any): any {
        if( !target[ p ] ) target[ p ] = [];
        return target[p];
    }
});
const _on:{[p:string]:(( ...any )=>void)[]} = new Proxy( {}, {
    get(target: {}, p: PropertyKey, receiver: any): any {
        if( !target[ p ] ) target[ p ] = [];
        return target[p];
    }
});

export enum ListenEvent {
    ANY= "*"
}



export const nwAppStatus:NwAppStatus = {
    isNwMode: false,
    runningIntoNW: false,
    status: "init",
    notify(event: ListenEvent|string, ...args) {
        // _on[ event ].forEach( cb => cb( ...a rgs ) );
        // _once[ event ].splice(0, _once[ event ].length ).forEach( cb => cb( ...args ) );
        // _on[ ListenEvent.ANY ].forEach( cb => cb( ...args ) );
        // _once[ ListenEvent.ANY ].splice(0, _once[ event ].length ).forEach( cb => cb( ...args ) );
        ctrlBroadcast( event, ...args );
    },
    on(event: ListenEvent|string, cb: (...args) => void) {
        _on[ event].push( cb );
    },
    once(event: ListenEvent|string, cb: (...args) => void) {
        _once[ event].push( cb );
    }
};