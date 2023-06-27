import {launcherStatus} from "../../launcher/status";
import os from "os";
import {createWinSysTray} from "./wintry";
import {createNWSystray} from "./nwsystray";

export function systrayStart (){
    if( launcherStatus.launcher === "root.ts" ) return;
    if( launcherStatus.launcher === "nw.ts" ){
        createNWSystray();
        return;
    }

    if(  os.platform() === "win32"  ){
        createWinSysTray();
        return;
    } else if( os.platform() === "linux" ){

    } else if( os.platform() === "darwin" ){

    }
}