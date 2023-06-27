"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const args_1 = require("../global/args");
function logPlay(receiver) {
    const { logView, snapshotView } = require("../service/log.service/logview");
    console.log("[RUM IN LOGS MODE]");
    if (receiver.options.logSnapshot) {
        return snapshotView();
    }
    logView();
}
args_1.lineArgs.defineCommand({ name: ["log"], callback: logPlay });
args_1.lineArgs.defineCommand({ name: ["logs"], callback: logPlay });
//# sourceMappingURL=logs.extension.js.map