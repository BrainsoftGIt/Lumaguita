"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSystray = exports.createWinSysTray = exports.getSystrayIcon = void 0;
const systray2_1 = __importDefault(require("systray2"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const menu_1 = require("./menu");
const engine_1 = require("./engine");
const chalk_1 = __importDefault(require("chalk"));
function getSystrayIcon() {
    //language=file-reference
    let root = "../../..";
    let icon = path_1.default.join(__dirname, root, menu_1.trayMenuConfigs.favFolder, os_1.default.platform() === "win32" ? "fav.ico" : "fav.png");
    if (!fs_1.default.existsSync(icon))
        return false;
    return icon;
}
exports.getSystrayIcon = getSystrayIcon;
function createWinSysTray() {
    let icon = getSystrayIcon();
    if (!icon)
        return null;
    let genericTray = {
        systray: null,
        close() {
            return this.systray.kill(false);
        }
    };
    let items = (0, engine_1.menuRender)(genericTray, menu => {
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
    const trayConfigs = {
        menu: {
            // you should use .png icon on macOS/Linux, and .ico format on Windows
            icon: icon,
            // a template icon is a transparency mask that will appear to be dark in light mode and light in dark mode
            isTemplateIcon: os_1.default.platform() === 'darwin',
            title: menu_1.trayMenuConfigs.title,
            tooltip: menu_1.trayMenuConfigs.tooltip,
            items: items
        },
        debug: false,
        copyDir: false // copy go tray binary to an outside directory, useful for packing tool like pkg.
    };
    const create = (retry) => {
        setTimeout(() => {
            genericTray.systray = new systray2_1.default(trayConfigs);
            genericTray.systray.onClick(action => {
                console.log("[maguita] Systray>", "click menu sys tray", action.item.title);
                if (typeof action.item["click"] === "function") {
                    action.item["click"](action);
                }
            });
            console.log("[maguita] Systray>", 'Starting windows-systray2...');
            genericTray.systray.ready().then(() => {
                genericTray.ready = true;
                console.log("[maguita] Systray>", `Starting windows-systray2... ${chalk_1.default.greenBright("OK!")}`);
            }).catch(err => {
                console.log("[maguita] Systray>", `Starting windows-systray2... ${chalk_1.default.redBright("ERROR!")}`);
                console.error(err);
            });
        }, 1500);
        retry = (retry || 0) + 1;
        if (retry > 0)
            console.log("[maguita] Systray>", "Retry start windows systray again " + retry + " time ");
        setTimeout(() => {
            console.log("[maguita] Systray>", "NEXT TIMEOUT SYSTRAY READY", genericTray.ready);
            if (!genericTray.ready) {
                console.log("[maguita] Systray>", "STOP WIN-SYSTRAY...");
                genericTray.systray.kill(false);
                create(retry);
            }
        }, 5000);
    };
    create();
    return genericTray;
}
exports.createWinSysTray = createWinSysTray;
exports.createSystray = createWinSysTray;
//# sourceMappingURL=wintry.js.map