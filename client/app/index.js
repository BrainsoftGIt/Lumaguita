"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSplashElement = exports.openMainWindows = exports.appInitialize = void 0;
// @ts-check
const status_1 = require("./status");
const sys_1 = require("../../server/global/sys");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const nw_1 = require("./nw");
const toaster_1 = require("../../server/lib/toaster");
const child_process_1 = require("child_process");
const Path = __importStar(require("path"));
const ctrl_1 = require("../../server/extension/ctrl");
function appInitialize(win) {
    let dirname = path_1.default.dirname(process.execPath);
    if (fs_1.default.existsSync(path_1.default.join(dirname, "nwjc.exe")) || fs_1.default.existsSync(path_1.default.join(dirname, "nwjc"))) {
        (0, toaster_1.appToaster)({
            //language=file-reference
            icon: path_1.default.join(__dirname, "../../server/resources/fav/fav.ico"),
            title: "MAGUITA",
            subtitle: "Modo de execusão",
            message: "DEV MODE",
        });
        try {
            const menu = new nw_1.nw.Menu();
            const item = new nw_1.nw.MenuItem({ label: 'DEV MODE' });
            menu.append(item);
            menu.popup(0, 0); // <---- crash
            global.chrome.developerPrivate.openDevTools({
                renderViewId: -1,
                renderProcessId: -1,
                // @ts-ignore
                extensionId: chrome.runtime.id
            });
        }
        catch (e) {
            console.error(e);
            (0, toaster_1.appToaster)({
                title: "Error",
                // @ts-ignore
                message: e.message,
                // @ts-ignore
                appID: "lumaguita"
            });
        }
    }
    win.on("closed", () => {
        if (nwAppStatus.mainWindows === win)
            nwAppStatus.mainWindows = null;
        if (nwAppStatus.currentWindow === win)
            nwAppStatus.currentWindow = null;
        if (nwAppStatus.status === "init")
            sys_1.sys.exit();
    });
    const { nwAppStatus } = require("./status");
    nwAppStatus.isNwMode = true;
    nwAppStatus.status = "init";
    nwAppStatus.splashWindow = win;
    nwAppStatus.currentWindow = win;
    let count = 0;
    let TIME_MESSAGE = 400;
    let TIME_BLOCK = 250;
    let TIME_ITEM = 100;
    (0, ctrl_1.ctrlConnect)().then(socket => {
        (0, ctrl_1.listenCRTLEvent)(socket, "loading:message", (event, message) => {
            if (nwAppStatus.status !== "init")
                return;
            setTimeout(() => {
                getSplashElement('process').innerHTML = `Inicializando | ${message}`;
                getSplashElement('block').innerHTML = ``;
                getSplashElement('blockItem').innerHTML = ``;
                count -= TIME_MESSAGE;
            }, count += TIME_MESSAGE);
        });
        (0, ctrl_1.listenCRTLEvent)(socket, "loading:message|block", (event, message) => {
            if (nwAppStatus.status !== "init")
                return;
            setTimeout(() => {
                getSplashElement('block').innerHTML = message;
                getSplashElement('blockItem').innerHTML = ``;
                count -= TIME_BLOCK;
            }, count += TIME_BLOCK);
            // count++;
        });
        (0, ctrl_1.listenCRTLEvent)(socket, "loading:message|block-item", (event, message) => {
            if (nwAppStatus.status !== "init")
                return;
            setTimeout(() => {
                getSplashElement('blockItem').innerHTML = message;
                count -= TIME_ITEM;
            }, count += TIME_ITEM);
            // iCountBlockItem++;
        });
        let openApp = () => {
            openApp = () => { };
            sys_1.sys.openApp();
            setTimeout(() => {
                getSplashElement('process').innerHTML = `Pronto`;
                getSplashElement('block').innerHTML = `Estamos começando...!`;
                getSplashElement('blockItem').innerHTML = ``;
                count = 0;
                setTimeout(() => {
                    openMainWindows("/client/app/page/index.html");
                }, 1000);
            }, count += 100);
        };
        (0, ctrl_1.listenCRTLEvent)(socket, "ready", (event, message) => {
            console.log("NW-RECEIVER-READY");
            nwAppStatus.status = "ready";
            openApp();
        });
    });
    //language=file-reference
    let child = (0, child_process_1.spawn)(Path.join(__dirname, "../../bin/maguita.exe"), ["--appWithNodeWebKit"]);
    child.on("close", code => {
        process.exit(code);
    });
    child.stdout.on("data", chunk => {
        console.log(chunk.toString());
    });
}
exports.appInitialize = appInitialize;
function openMainWindows(location) {
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
    setTimeout(() => {
        status_1.nwAppStatus.splashWindow.hide();
    }, 1500);
}
exports.openMainWindows = openMainWindows;
function getSplashElement(id) {
    if (status_1.nwAppStatus.splashWindow === null)
        return null;
    return status_1.nwAppStatus.splashWindow.window.document.getElementById(id);
}
exports.getSplashElement = getSplashElement;
appInitialize(nw_1.nw.Window.get());
//# sourceMappingURL=index.js.map