"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopDatabaseApplication = exports.getInstallation = exports.startApplicationDatabase = void 0;
const args_1 = require("../global/args");
const snotify_1 = require("../snotify");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const project_1 = require("../global/project");
const json5_1 = __importDefault(require("json5"));
const kitres_1 = require("kitres");
const child_process_1 = require("child_process");
function startApplicationDatabase() {
    snotify_1.serverNotify.loadingBlockItem("Ligando ao banco de dados local...");
    return new Promise((resolve, reject) => {
        getInstallation(installation => {
            if (installation) {
                let path = process.env["Path"].split(path_1.default.delimiter);
                path.unshift(path_1.default.join(installation.installation, "bin"));
                process.env["Path"] = path.join(path_1.default.delimiter);
            }
            let result = (0, child_process_1.spawnSync)("pg_ctl", ["--version"]);
            console.log("result.stdout.toString()", result.stdout.toString(), installation.installation);
            console.log("result.stderr.toString()", result.stderr.toString());
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
    });
}
exports.startApplicationDatabase = startApplicationDatabase;
function getInstallation(response) {
    let currentVersion = () => {
        if (!fs_1.default.existsSync(path_1.default.join(project_1.folders.pgHome, "current.json5")))
            return { message: "Missing current.json5" };
        let content = fs_1.default.readFileSync(path_1.default.join(project_1.folders.pgHome, "current.json5")).toString().trim();
        let parse = json5_1.default.parse(content);
        if (!fs_1.default.existsSync(path_1.default.join(parse.dataDirname, "PG_VERSION")))
            return { message: "Missing current.json5 -> PG_VERSION" };
        content = fs_1.default.readFileSync(path_1.default.join(parse.dataDirname, "PG_VERSION")).toString().trim();
        let version = Number(content);
        if (Number.isNaN(version) || !Number.isFinite(version) || !Number.isSafeInteger(version))
            return { message: "Invalid Version Number" };
        return { version };
    };
    let { version, message } = currentVersion();
    if (version) {
        snotify_1.serverNotify.log(`Found current cluster running with version = "${version}"`);
    }
    (0, kitres_1.lookupPostgresRegister)((result) => {
        let bestVersion = result.installations.find(next => {
            if (version)
                return next.versionNumber === version;
            return next.versionNumber === result.maxVersion;
        });
        response(bestVersion);
    });
}
exports.getInstallation = getInstallation;
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