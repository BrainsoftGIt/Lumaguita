"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopDatabaseApplication = exports.startApplicationDatabase = void 0;
const args_1 = require("../global/args");
const snotify_1 = require("../snotify");
function startApplicationDatabase() {
    snotify_1.serverNotify.loadingBlockItem("Ligando ao banco de dados local...");
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const { pgCtl } = require("../service/pgcluster.service");
            pgCtl.debug = (details, message, ...extras) => {
                snotify_1.serverNotify.loadingBlockItem(message, null, ...extras);
            };
            const { ListenerEvent } = require("../lib/postgres/pg-ctl");
            pgCtl.instance.on(ListenerEvent.READY, (EVENT, any) => {
                snotify_1.serverNotify.loadingBlockItem("Ligando ao banco de dados local... [OK]");
                resolve({
                    status: EVENT,
                    any: any
                });
            });
        }, 1);
    });
}
exports.startApplicationDatabase = startApplicationDatabase;
function stopDatabaseApplication() {
    console.log("Stop database application...");
    const { pgCtl } = require("../service/pgcluster.service");
    return pgCtl.stop();
}
exports.stopDatabaseApplication = stopDatabaseApplication;
args_1.lineArgs.defineCommand({ name: "database", callback: (receiver) => {
        let next = receiver.params.shift();
        if (next === "start") {
            startApplicationDatabase().then(value => {
                process.exit(0);
            });
        }
        else if (next === "stop") {
            stopDatabaseApplication().then(value => process.exit(0));
        }
    } });
//# sourceMappingURL=database.extension.js.map