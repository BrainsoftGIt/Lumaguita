import SysTray, {Conf, MenuItem} from "systray2";
import fs from "fs";
import path from "path";
import os from "os";
import { trayMenuConfigs } from "./menu";
import {GenericTray, menuRender} from "./engine";
import chalk from "chalk";



export function getSystrayIcon(){
    //language=file-reference
    let root = "../../..";
    let icon = path.join( __dirname, root, trayMenuConfigs.favFolder, os.platform() === "win32"? "fav.ico": "fav.png" ) ;
    if( !fs.existsSync( icon ) ) return false;
    return icon;
}

export function createWinSysTray():GenericTray< SysTray, MenuItem >{
    let icon = getSystrayIcon();
    if( !icon ) return null;

    let genericTray:GenericTray<SysTray, MenuItem> = {
        systray:null,
        close(): Promise<any> {
            return  this.systray.kill( false );
        }
    }

    let items = menuRender<SysTray, MenuItem>( genericTray, menu => {
        return {
            items: menu.itemList,
            title: menu.title,
            tooltip: menu.tooltip,
            enabled: menu.enabled,
            icon: menu.icon,
            isTemplateIcon: menu.isTemplateIcon,
            checked: menu.checked,
            hidden: menu.hidden,
        };
    });

    const trayConfigs:Conf ={
        menu: {
            // you should use .png icon on macOS/Linux, and .ico format on Windows
            icon: icon,
            // a template icon is a transparency mask that will appear to be dark in light mode and light in dark mode
            isTemplateIcon: os.platform() === 'darwin',
            title: trayMenuConfigs.title,
            tooltip: trayMenuConfigs.tooltip,
            items: items
        },
        debug: false,
        copyDir: false // copy go tray binary to an outside directory, useful for packing tool like pkg.
    }

    const create = (retry?:number)=>{
        setTimeout(()=>{
            genericTray.systray = new SysTray( trayConfigs );
            genericTray.systray.onClick( action => {
                console.log( "[maguita] Systray>", "click menu sys tray", action.item.title );
                if (typeof  action.item["click"] === "function" ) {
                    action.item["click"]( action )
                }
            })
            console.log("[maguita] Systray>", 'Starting windows-systray2...')
            genericTray.systray.ready().then(() => {
                genericTray.ready = true;
                console.log("[maguita] Systray>", `Starting windows-systray2... ${ chalk.greenBright( "OK!" ) }`)
            }).catch(err => {
                console.log("[maguita] Systray>", `Starting windows-systray2... ${ chalk.redBright("ERROR!")}`)
                console.error( err );
            });
        }, 1500 );

        retry = (retry || 0)+1;
        if( retry > 0 ) console.log( "[maguita] Systray>", "Retry start windows systray again "+ retry+ " time " );
        setTimeout(()=>{
            console.log( "[maguita] Systray>", "NEXT TIMEOUT SYSTRAY READY", genericTray.ready )
            if( !genericTray.ready ){
                console.log( "[maguita] Systray>","STOP WIN-SYSTRAY...")

                genericTray.systray.kill(false )
                create( retry );
            }
        }, 5000 );
    };
    create();
    return  genericTray;
}

export const createSystray = createWinSysTray;

