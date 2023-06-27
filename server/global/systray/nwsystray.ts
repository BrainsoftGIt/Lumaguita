import {MenuItem, nw, Tray} from "../../../client/app/nw";
import {trayMenuConfigs} from "./menu";
import {GenericTray, menuRender} from "./engine";
import {MenuItemConfig} from "nw.gui";

export function createNWSystray():GenericTray<Tray, MenuItem>{
    let mn = new nw.Menu();
    const genericTray:GenericTray<Tray, MenuItem> = {
        close(): Promise<any> {
            return Promise.resolve(this.systray.remove());
        }
    }

    let menuItemList = menuRender<Tray, MenuItem>( genericTray, next => {
        console.log( next );
        let options:MenuItemConfig = {
            icon: next.icon,
            click: next.click,
            tooltip: next.tooltip,
            enabled: next.enabled,
            type: next.type,
            key: next.key,
            label: next.title,
            checked: next.checked,
            modifiers: next.combination
        }
        if( next["itemList"] ){
            options.submenu = new nw.Menu();
            next.itemList.forEach( value => {
                // @ts-ignore
                options.submenu.append( value );
            });
        }
        return new nw.MenuItem(options);
    });
    console.log( "MenuItemList", menuItemList );

    menuItemList.forEach( value => {
        // @ts-ignore
        mn.append( value );
    });


    // Create a tray icon
    genericTray.systray = new nw.Tray({
        title: trayMenuConfigs.title,
        icon: [...trayMenuConfigs.favFolder.split( "/" ), "fav.png" ].join("/"),
        tooltip: trayMenuConfigs.tooltip,
        alticon: trayMenuConfigs.title,
        menu: mn
    });

    return genericTray;
}