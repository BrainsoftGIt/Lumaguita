import notifier, {NotificationCallback} from "node-notifier";
import {launcherStatus} from "../launcher/status";
import NotificationCenter from "node-notifier/notifiers/notificationcenter";
import Path from "path";

type AppToaster = { appToaster( notification?:  NotificationCenter.Notification|string, callback?: NotificationCallback ): AppToaster };
export function appToaster( notification?: NotificationCenter.Notification|string, callback?: NotificationCallback ): AppToaster{
    if( launcherStatus.launcher !== "root.ts" ){
        notifier.notify( notification, callback );
        return { appToaster };
    } else if( typeof notification === "string" ){
        console.log( notification );
        return { appToaster }
    } else if( notification && typeof notification === "object" ){
        console.log(`================================ ${ notification.title ?? '' } ================================`);
        if( notification.subtitle ) console.log( `:::::::::: ${ notification.subtitle } `)
        if( notification.message ) console.log( notification.message );
        console.log(`================================ ${ notification.title ?? '' } ================================`);
    }
}

export function toastMessage( message:string){
    //language=file-reference
    const icon = Path.join( __dirname, "../resources/fav/fav.png" );
    appToaster( {
        title: "Luma",
        icon: icon,
        message: message,
    }, (err, response, metadata) => {

    });
}