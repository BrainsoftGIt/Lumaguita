"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appToaster = void 0;
const node_notifier_1 = __importDefault(require("node-notifier"));
const status_1 = require("../launcher/status");
function appToaster(notification, callback) {
    var _a, _b;
    if (status_1.launcherStatus.launcher !== "root.ts") {
        node_notifier_1.default.notify(notification, callback);
        return { appToaster };
    }
    else if (typeof notification === "string") {
        console.log(notification);
        return { appToaster };
    }
    else if (notification && typeof notification === "object") {
        console.log(`================================ ${(_a = notification.title) !== null && _a !== void 0 ? _a : ''} ================================`);
        if (notification.subtitle)
            console.log(`:::::::::: ${notification.subtitle} `);
        if (notification.message)
            console.log(notification.message);
        console.log(`================================ ${(_b = notification.title) !== null && _b !== void 0 ? _b : ''} ================================`);
    }
}
exports.appToaster = appToaster;
//# sourceMappingURL=toaster.js.map