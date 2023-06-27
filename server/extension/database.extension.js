"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopDatabaseApplication = exports.recognizeDatabasePath = exports.autoInstallDatabaseServer = exports.startApplicationDatabase = void 0;
const args_1 = require("../global/args");
const defaults_1 = require("../global/defaults");
const chalk_1 = __importDefault(require("chalk"));
const snotify_1 = require("../snotify");
function startApplicationDatabase() {
    snotify_1.serverNotify.loadingBlockItem("Ligando ao banco de dados local...");
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            autoInstallDatabaseServer().then(value => {
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
            });
        }, 1);
    });
}
exports.startApplicationDatabase = startApplicationDatabase;
function autoInstallDatabaseServer() {
    return new Promise((resolve, reject) => {
        //Detect database server!
        recognizeDatabasePath().then(detected => {
            if (detected.detection)
                return resolve(true);
            const { appPatches } = require("../patches");
            appPatches.installDatabaseServer().then(installed => {
                if (installed)
                    recognizeDatabasePath().then(retryDetected => {
                        if (retryDetected.detection) {
                            snotify_1.serverNotify.loadingBlockItem("Servidor de banco de dados instalado... [OK!]");
                            return resolve(true);
                        }
                        snotify_1.serverNotify.loadingBlockItem("Cannot detect installed database server!");
                        return reject(new Error("Cannot detect installed database server!"));
                    });
                else {
                    snotify_1.serverNotify.loadingBlockItem("Cannot install database server!");
                    return reject(new Error("Cannot install database server!"));
                }
            });
        });
    });
}
exports.autoInstallDatabaseServer = autoInstallDatabaseServer;
function recognizeDatabasePath(count) {
    let again = '';
    count = count || 0;
    if (count > 0)
        again = '[RETRY] ';
    snotify_1.serverNotify.loadingBlockItem(`${again}recognize database tools cli...`);
    const { pgServer } = require("../lib/postgres/pg-recoginizer");
    return pgServer.recognizePath(defaults_1.DEFAULTS.DB_VERSION, defaults_1.DEFAULTS.DB_VERSION_UP).then(detection => {
        if (detection.after && detection.after.isValid && detection.after.isSupported) {
            snotify_1.serverNotify.loadingBlockItem(chalk_1.default.greenBright(`${again}recognize database tools cli... [ok]`));
        }
        else {
            detection.after = null;
            snotify_1.serverNotify.loadingBlockItem(chalk_1.default.redBright `${again}recognize database tools cli... [failed]`);
        }
        return Promise.resolve({
            detection: detection.after,
            count: count
        });
    });
}
exports.recognizeDatabasePath = recognizeDatabasePath;
function stopDatabaseApplication() {
    console.log("Stop database application...");
    return recognizeDatabasePath().then(value => {
        const { pgCtl } = require("../service/pgcluster.service");
        return pgCtl.stop();
    });
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