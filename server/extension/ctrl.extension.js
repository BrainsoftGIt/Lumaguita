"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const args_1 = require("../global/args");
const ctrl_1 = require("./ctrl");
function serverShutdown() {
    console.log("serverShutdown...");
    (0, ctrl_1.detectServer)().then(value => {
        if (value)
            value.write(ctrl_1.ServerCtl.SHUTDOWN);
    });
}
function serverExit() {
    console.log("serverExit...");
    (0, ctrl_1.detectServer)().then(value => {
        if (value)
            value.write(ctrl_1.ServerCtl.EXIT);
    });
}
args_1.lineArgs.defineCommand({ name: ["exit"], callback: serverExit });
args_1.lineArgs.defineCommand({ name: ["shutdown"], callback: serverShutdown });
//# sourceMappingURL=ctrl.extension.js.map