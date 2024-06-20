import {getSys} from "./global/sys";

console.trace("d ds ssfss")

import { nwAppStatus } from "../client/app/status";
import path from "path";
import {appToaster} from "./lib/toaster";

function asOptions( opts ):{notifier?:boolean, nw?:boolean}{
    if( !opts ) opts = {};
    let keys = Object.keys( opts );
    if( !keys.includes( "notifier" )  )opts.notifier = true;
    if( !keys.includes( "nw" )  ) opts.nw = true;
    return opts;
}

export const serverNotify = {
    log( message:string ){
      this.loadingBlockItem( message )
    },
    loading(message:string, opts?:{ notifier?:boolean, nw?:boolean} ){
        opts = asOptions( opts );
        if( nwAppStatus.runningIntoNW ){
            nwAppStatus.notify( "loading:message", message );
        } else if( opts.notifier) {
            appToaster({
                //language=file-reference
                icon: path.join( __dirname, "resources/fav/fav.png" ),
                message: message,
                title: "Luma",
                timeout: 1000,
            });
        }
        console.log( "[maguita]", message );
    }, loadingBlock( message , opts?:{ notifier?:boolean, nw?:boolean} ){
        opts = asOptions( opts );
        if( nwAppStatus.runningIntoNW ){
            nwAppStatus.notify( "loading:message|block", message );
        }
        console.log( "[maguita]", message );
    }, loadingBlockItem( message, opts?:{ notifier?:boolean, nw?:boolean}, ... extras ){
        console.log( "[maguita]", message, ...extras );
        opts = asOptions( opts );
        if( nwAppStatus.runningIntoNW ){
            nwAppStatus.notify( "loading:message|block-item", message);
        }
    }, ready(opts?:{ notifier?:boolean, nw?:boolean}){
        opts = asOptions( opts );
        if( nwAppStatus.runningIntoNW ){
            setTimeout(()=>{
                nwAppStatus.notify( "loading:finally" );
                nwAppStatus.notify( "ready" );
            }, 2000 );
        } else if( opts.notifier ) {
            appToaster({
                //language=file-reference
                icon: path.join( __dirname, 'resources/fav/fav.png' ),
                title: "Luma",
                message: "Luma está a executar no segundo plano",
                // dropdownLabel: "dropdownLabel",
                actions:[ "OK", "Abrir"],
            }, (err, response, metadata) => {
                if( response && response.toLowerCase() === "abrir" ) getSys().openApp( );
            });
        }
        console.log( "[maguita] MSG>", "Application is ready!")
    }
}