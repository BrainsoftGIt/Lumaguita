// @ts-check
import {nwAppStatus} from "./status";
import {sys} from "../../server/global/sys";
import path from "path";
import fs from "fs";
import {nw, Window} from "./nw";
import {appToaster} from "../../server/lib/toaster";
import {spawn} from "child_process";
import * as Path from "path";
import {ctrlConnect, listenCRTLEvent} from "../../server/extension/ctrl";


export function appInitialize( win:Window ){
    let dirname = path.dirname( process.execPath );
    if( fs.existsSync( path.join( dirname, "nwjc.exe" )) || fs.existsSync( path.join( dirname, "nwjc" ) )){
        appToaster( {
            //language=file-reference
            icon: path.join( __dirname, "../../server/resources/fav/fav.ico" ),
            title: "MAGUITA",
            subtitle: "Modo de execusão",
            message: "DEV MODE",
        } );
        try{
            const menu = new nw.Menu();
            const item = new nw.MenuItem({ label: 'DEV MODE' });
            menu.append( item );
            menu.popup(0, 0); // <---- crash

            global.chrome.developerPrivate.openDevTools({
                renderViewId: -1,
                renderProcessId: -1,
                // @ts-ignore
                extensionId: chrome.runtime.id
            })
        } catch (e) {
            console.error( e );
            appToaster( {
                title: "Error",
                // @ts-ignore
                message: e.message,
                // @ts-ignore
                appID: "lumaguita"
            })}
    }

    win.on( "closed", ()=>{
        if( nwAppStatus.mainWindows === win ) nwAppStatus.mainWindows = null;
        if( nwAppStatus.currentWindow === win ) nwAppStatus.currentWindow = null;
        if(nwAppStatus.status === "init" ) sys.exit();
    })
    const {nwAppStatus} = require( "./status" );
    nwAppStatus.isNwMode = true;
    nwAppStatus.status = "init";

    nwAppStatus.splashWindow = win;
    nwAppStatus.currentWindow = win;
    let count = 0;

    let TIME_MESSAGE = 400;
    let TIME_BLOCK = 250;
    let TIME_ITEM = 100;

    ctrlConnect().then( socket => {
        listenCRTLEvent( socket, "loading:message", ( event, message ) => {
            if( nwAppStatus.status !== "init" ) return;
            setTimeout(()=>{
                getSplashElement( 'process' ).innerHTML = `Inicializando | ${ message }`;
                getSplashElement( 'block' ).innerHTML = ``;
                getSplashElement( 'blockItem' ).innerHTML = ``;
                count-=TIME_MESSAGE
            }, count+=TIME_MESSAGE );
        });

        listenCRTLEvent( socket, "loading:message|block", ( event, message ) => {
            if( nwAppStatus.status !== "init" ) return;
            setTimeout(()=>{
                getSplashElement( 'block' ).innerHTML = message;
                getSplashElement( 'blockItem' ).innerHTML = ``;
                count-=TIME_BLOCK;
            }, count+=TIME_BLOCK );
            // count++;
        });

        listenCRTLEvent( socket, "loading:message|block-item", ( event, message ) => {
            if( nwAppStatus.status !== "init" ) return;
            setTimeout(()=>{
                getSplashElement( 'blockItem' ).innerHTML = message;
                count-=TIME_ITEM;
            }, count+=TIME_ITEM );
            // iCountBlockItem++;
        });
        let openApp = ()=>{
            openApp = ()=>{}
            sys.openApp()
            setTimeout(()=>{
                getSplashElement( 'process' ).innerHTML = `Pronto`;
                getSplashElement( 'block' ).innerHTML = `Estamos começando...!`;
                getSplashElement( 'blockItem' ).innerHTML = ``;

                count=0;
                setTimeout( ()=>{
                    openMainWindows("/client/app/page/index.html")
                },1000)
            }, count+=100);
        }

        listenCRTLEvent( socket, "ready", ( event, message ) => {
            console.log( "NW-RECEIVER-READY" );
            nwAppStatus.status = "ready";
            openApp();
        })
    });

    //language=file-reference
    let child = spawn( Path.join( __dirname, "../../bin/maguita.exe" ), [ "--appWithNodeWebKit" ] );
    child.on("close", code => {
        process.exit( code );
    });

    child.stdout.on("data", chunk => {
        console.log( chunk.toString())
    });
}


export function openMainWindows( location:string ){
    // if( !nwAppStatus.mainWindows || nwAppStatus.mainWindows.isClosed  ){
    //     nw.Window.open( location,{
    //         position:"center",
    //         "width": 750,
    //         "height": 500,
    //         // @ts-ignore
    //     }, (win: Window, opts )=>{
    //
    //         nwAppStatus.mainWindows = win;
    //         nwAppStatus.currentWindow = win;
    //
    //         win.close = win.hide;
    //
    //         win.on( "closed", ()=>{
    //             if( nwAppStatus.mainWindows === win ) nwAppStatus.mainWindows = null;
    //             if( nwAppStatus.currentWindow === win ) nwAppStatus.currentWindow = null;
    //         })
    //         setTimeout(()=>{
    //             win.maximize();
    //         }, 250)
    //     });
    // } else {
    //     nwAppStatus.currentWindow = nwAppStatus.mainWindows;
    //     nwAppStatus.currentWindow.window.location.href = location;
    //     nwAppStatus.currentWindow.show();
    // }

    setTimeout(()=>{
        nwAppStatus.splashWindow.hide();
    }, 1500);

}

export function getSplashElement(id:"block"|"blockItem"|"process" ){
    if( nwAppStatus.splashWindow === null ) return null;
    return nwAppStatus.splashWindow.window.document.getElementById( id );
}
appInitialize( nw.Window.get() );
