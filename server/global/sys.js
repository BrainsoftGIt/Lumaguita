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
exports.sys = void 0;
const args_1 = require("./args");
const open_1 = __importDefault(require("open"));
const path = __importStar(require("path"));
const win32_1 = require("../lib/utils/process/win32");
const pg_ctl_1 = require("../lib/postgres/pg-ctl");
const listen_1 = require("../lib/utils/process/listen");
const status_1 = require("../launcher/status");
// import {nwAppStatus} from "../../client/app/status";
const { spawn } = require('child_process');
exports.sys = new (class Sys {
    openApp(opts) {
        if (!opts)
            opts = {};
        let location = opts.browser;
        let address = opts.address || "127.0.0.1";
        let url = `http://${address}:${args_1.args.appPort}`;
        if (location)
            url = `${url}/${location}`;
        console.log("opening...app", url);
        (0, open_1.default)(url, {}).catch(reason => { console.error(reason); });
    }
    openUrl(url) {
        (0, open_1.default)(url, {})
            .then(value => {
            console.log(`[URL:opened] ${url}`);
        })
            .catch(reason => {
            console.log(`[URL:failed] https://www.brainsoftstp.com/luma`);
            console.error(reason);
        });
    }
    install(module) {
        this.run("install", "linked", {}, ...["--module", module]);
    }
    play(mode) {
        let args = process.argv.filter(((value, index) => index >= 2));
        this.run("play", mode, {}, ...args);
    }
    run(command, mode, opts, ...argv) {
        if (!mode)
            mode = "linked";
        let callback = Number(process.env["MAGUITA_APP_CALLBACK"]);
        if (!callback || !Number.isSafeInteger(callback) || Number.isNaN(callback))
            callback = 0;
        if (callback > 3)
            return;
        opts = opts || {};
        opts.env = Object.assign(opts.env || {}, {
            ["MAGUITA_APP_CALLBACK"]: callback + 1
        });
        if (mode === "silent") {
            let launcher = this.launcher();
            let useArgs = [];
            useArgs.push(...launcher.executableArgv);
            useArgs.push(command);
            useArgs.push(...argv);
            opts.detached = true;
            opts.windowsHide = true;
            const child = (0, win32_1.execFilePain)(process.argv[0], useArgs, Object.assign({}, opts), ["background", "noWait"]);
            console.log("Execuntando em modo silencioso...");
            child.on("close", (code, signal) => {
                console.log("Execusão em modo silencioso... [ATIVO]", { code, signal });
            });
        }
        else {
            const sp = spawn(process.argv[0], [
                process.argv[1],
                command,
                ...argv,
            ], Object.assign({}, opts));
            if (mode === "linked") {
                sp.stdout.pipe(process.stdout);
                sp.stderr.pipe(process.stderr);
                // sp.stdin.pipe( process.stdin );
            }
            else {
                sp.unref();
            }
        }
    }
    shutdown(...beforeWorks) {
        this.exit(() => {
            const { pgCtl } = require("../service/pgcluster.service");
            let stop = pg_ctl_1.PostgresCluster.stopDatabaseCluster(pgCtl.dataDirname);
            return (0, listen_1.processListen)(stop, { console: true });
        }, ...beforeWorks);
    }
    launcher() {
        let executable = process.argv[0];
        let main = process.argv[1];
        let execName = path.basename(process.argv[0]);
        let argv = process.argv.filter((value, index) => index > 1);
        let executableArgv = [];
        if (["node", "node.exe", "node.cmd", "node.bat"].includes(execName)) {
            executableArgv.unshift(main);
        }
        return { executable, executableArgv, main, argv };
    }
    exit(...beforeWorks) {
        console.log("[EXIT] Iniciando o processo de termino correto...");
        let next = () => {
            let _next = beforeWorks.shift();
            if (!_next) {
                console.log("[EXIT] Iniciando o processo de termino correto... [OK]");
                console.log("[EXIT] good bay!");
                setTimeout(args1 => process.exit(0), 1500);
            }
            else {
                if (typeof _next !== "function")
                    next();
                _next().then(value => {
                    next();
                }).catch(reason => {
                    console.error(reason);
                    next();
                });
            }
        };
        next();
    }
    restart(...beforeWorks) {
        this.exit(...beforeWorks, () => {
            return new Promise(resolve => {
                let _useArgs = process.argv.filter(((value, index) => index >= 2));
                if (["node", "node.exe"].includes(path.basename(process.argv[0])))
                    _useArgs.unshift(process.argv[1]);
                const _childProcess = (0, win32_1.execFilePain)(process.argv[0], _useArgs, {
                    detached: true
                }, ["noWait", status_1.launcherStatus.launcher === "exe.ts" ? "background" : "noWait"]);
                _childProcess.unref();
                _childProcess.on("close", code => {
                    resolve(true);
                });
            });
        });
    }
});
//# sourceMappingURL=sys.js.map