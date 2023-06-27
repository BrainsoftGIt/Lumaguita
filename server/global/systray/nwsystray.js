"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNWSystray = void 0;
const nw_1 = require("../../../client/app/nw");
const menu_1 = require("./menu");
const engine_1 = require("./engine");
function createNWSystray() {
    let mn = new nw_1.nw.Menu();
    const genericTray = {
        close() {
            return Promise.resolve(this.systray.remove());
        }
    };
    let menuItemList = (0, engine_1.menuRender)(genericTray, next => {
        console.log(next);
        let options = {
            icon: next.icon,
            click: next.click,
            tooltip: next.tooltip,
            enabled: next.enabled,
            type: next.type,
            key: next.key,
            label: next.title,
            checked: next.checked,
            modifiers: next.combination
        };
        if (next["itemList"]) {
            options.submenu = new nw_1.nw.Menu();
            next.itemList.forEach(value => {
                // @ts-ignore
                options.submenu.append(value);
            });
        }
        return new nw_1.nw.MenuItem(options);
    });
    console.log("MenuItemList", menuItemList);
    menuItemList.forEach(value => {
        // @ts-ignore
        mn.append(value);
    });
    // Create a tray icon
    genericTray.systray = new nw_1.nw.Tray({
        title: menu_1.trayMenuConfigs.title,
        icon: [...menu_1.trayMenuConfigs.favFolder.split("/"), "fav.png"].join("/"),
        tooltip: menu_1.trayMenuConfigs.tooltip,
        alticon: menu_1.trayMenuConfigs.title,
        menu: mn
    });
    return genericTray;
}
exports.createNWSystray = createNWSystray;
//# sourceMappingURL=nwsystray.js.map