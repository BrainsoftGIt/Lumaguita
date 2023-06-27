"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.systrayStart = void 0;
const status_1 = require("../../launcher/status");
const os_1 = __importDefault(require("os"));
const wintry_1 = require("./wintry");
const nwsystray_1 = require("./nwsystray");
function systrayStart() {
    if (status_1.launcherStatus.launcher === "root.ts")
        return;
    if (status_1.launcherStatus.launcher === "nw.ts") {
        (0, nwsystray_1.createNWSystray)();
        return;
    }
    if (os_1.default.platform() === "win32") {
        (0, wintry_1.createWinSysTray)();
        return;
    }
    else if (os_1.default.platform() === "linux") {
    }
    else if (os_1.default.platform() === "darwin") {
    }
}
exports.systrayStart = systrayStart;
//# sourceMappingURL=index.js.map