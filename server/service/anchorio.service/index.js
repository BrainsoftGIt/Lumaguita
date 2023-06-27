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
exports.aioService = exports.AIOStatus = void 0;
const args_1 = require("../../global/args");
const detect_port_1 = __importDefault(require("detect-port"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const Path = __importStar(require("path"));
const ini_1 = __importDefault(require("ini"));
const chalk_1 = __importDefault(require("chalk"));
const futil = __importStar(require("zoo.util/lib/file-util"));
const api_1 = require("./api");
var AIOStatus;
(function (AIOStatus) {
    AIOStatus["UNK"] = "AIOStatus.UNK";
    AIOStatus["RUNNING"] = "AIOStatus.RUNNING";
    AIOStatus["STOPPED"] = "AIOStatus.STOPPED";
})(AIOStatus = exports.AIOStatus || (exports.AIOStatus = {}));
exports.aioService = new (class AnchorioService {
    constructor() {
        this._status = AIOStatus.UNK;
        this._onResponse = [];
        let loadConfigs = this.loadConfigs();
        console.log("[MAGUITA] AIO.service> Load configs...", loadConfigs);
        if (loadConfigs === "ok") {
            this.checkAIORunning(2, 1000).then(running => {
                if (!running) {
                    this.start().then(_status => {
                        this._status = _status;
                        this._onResponse.forEach(next => next());
                    });
                }
                else {
                    this._status = AIOStatus.RUNNING;
                    this._onResponse.forEach(next => next());
                }
            });
        }
        else {
            this._status = AIOStatus.STOPPED;
            this._onResponse.forEach(next => next());
        }
    }
    loadConfigs() {
        this.aio = args_1.args.aio;
        this.aioEnvFile = args_1.args.aioConfigFile;
        if (!this.aio)
            return "false: !this.aio";
        if (!fs_1.default.existsSync(this.aio))
            return "false: !fs.existsSync( this.aio )";
        // if( !this.aioEnvFile && appAioConfig && fs.existsSync( appAioConfig )) this.aioEnvFile = appAioConfig;
        if (!this.aioEnvFile && fs_1.default.existsSync(Path.join(this.aio, "/etc/anchorio.conf")))
            this.aioEnvFile = Path.join(this.aio, "/etc/anchorio.conf");
        if (!this.aioEnvFile || !fs_1.default.existsSync(this.aioEnvFile))
            return "false: !fs.existsSync( this.aioConfigFile )";
        this.aioConfig = ini_1.default.parse(fs_1.default.readFileSync(this.aioEnvFile).toString("utf8"));
        console.log("[MAGUITA] Anchorio>", `EnvFile of anchorio ${new futil.Path({ path: this.aioEnvFile }).url.href}`);
        this.aioAgentAPI = +this.aioConfig.agent["agent-api"];
        if (!Number.isSafeInteger(this.aioAgentAPI))
            this.aioAgentAPI = null;
        this.aioAgentPort = +this.aioConfig.agent["agent-port"];
        if (!Number.isSafeInteger(this.aioAgentPort))
            this.aioAgentPort = null;
        this.api = new api_1.AioAPI({ agentAPI: this.aioAgentAPI });
        return "ok";
    }
    checkAIORunning(retry, timeout) {
        console.log(`[MAGUITA] checking anchorio is runing...`);
        if (!timeout)
            timeout = 1000;
        if (retry === undefined || retry === null)
            retry = 0;
        return new Promise((resolve, reject) => {
            const port = this.aioAgentAPI;
            if (!port)
                return resolve(false);
            (0, detect_port_1.default)(port).then(_port => {
                if (port !== _port) {
                    console.log(`[MAGUITA] checking anchorio is runing... OK!`);
                    return resolve(true);
                }
                else if (retry - 1 > 0) {
                    console.log(`[MAGUITA] checking anchorio is runing... RETRY!`);
                    setTimeout(() => this.checkAIORunning(retry - 1, timeout).then(running => resolve(running))
                        .catch(reason => resolve(false)), timeout);
                }
                else {
                    console.log(`[MAGUITA] checking anchorio is runing... STOPPED!`);
                    return resolve(false);
                }
            });
        });
    }
    onRunning(callback) {
        this.status.then(_status => {
            if (_status === AIOStatus.RUNNING)
                callback();
            else
                setTimeout(() => this.onRunning(callback), 1000);
        });
    }
    tokenList() {
        return this.tokenResolver("--list");
    }
    tokenGenerate(identifier) {
        return this.tokenResolver("--identifier", identifier, "--generate");
    }
    tokenOf(identifier) {
        return this.tokenResolver("--identifier", identifier);
    }
    tokenResolver(...params) {
        return new Promise(resolve => {
            let raw = "";
            let process = this.forkIO("token", "-format", "json", ...params);
            process.stdout.on("data", chunk => {
                raw += chunk.toString();
                console.log(chunk.toString());
            });
            process.on("close", code => {
                if (code !== 0)
                    return resolve(null);
                let list = null;
                try {
                    list = JSON.parse(raw);
                }
                catch (ex) { }
                return resolve(list);
            });
        });
    }
    fork(...params) {
        return (0, child_process_1.fork)(Path.join(this.aio, "aio/index.js"), params, {
            cwd: Path.join(args_1.args.aio)
        });
    }
    forkIO(...params) {
        return (0, child_process_1.fork)(Path.join(this.aio, "aio/index.js"), params, {
            cwd: Path.join(args_1.args.aio),
            stdio: "pipe"
        });
    }
    start() {
        console.log(`[MAGUITA] starting anchorio agent ...`);
        return new Promise((_resolve, reject) => {
            let resolve = (_status, message) => {
                if (_status !== AIOStatus.RUNNING) {
                    console.log(`[MAGUITA] starting anchorio agent... FAILED!`, message);
                    setTimeout(() => {
                        this.start().then();
                    }, 1000 * 60 * 5);
                }
                else {
                    console.log(`[MAGUITA] starting anchorio agent... STARTED!`);
                }
                _resolve(_status);
            };
            if (this._status === AIOStatus.RUNNING)
                return resolve(AIOStatus.RUNNING);
            let srv = require("../cluster.service").clusterServer;
            Promise.all([
                srv.service.localCluster(),
                srv.service.masterCluster()
            ]).then(value => {
                let [local, master] = value;
                let namespace = local.cluster_namespace;
                let host = master.cluster_domain;
                let urlParts = /^(?:\w+\:\/\/)?([^\/]+)([^\?]*)\??(.*)$/.exec(host);
                host = urlParts[1];
                if (!namespace)
                    return resolve(AIOStatus.STOPPED, "Namespace not defined");
                if (!host)
                    return resolve(AIOStatus.STOPPED, "Host not defined");
                let identifier = `${namespace}.aio`;
                let forkProcess = () => {
                    let pro = this.fork("agent", "--envFile", `${this.aioEnvFile}`, "--noDNS", "--identifier", identifier, "--server-host", host, "--app-label", `anchorio-agent:${args_1.args.app}`);
                    console.log("[MAGUITA] Anchorio>", `Start anchorio agent with PID ${chalk_1.default.blueBright(String(pro.pid))}`);
                    pro.on("exit", code => {
                        this.status.then(_status => {
                            if (_status === AIOStatus.RUNNING)
                                forkProcess();
                        });
                    });
                    return pro;
                };
                let _process = forkProcess();
                this.checkAIORunning(10, 1500).then(started => {
                    if (started) {
                        this._status = AIOStatus.RUNNING;
                        this._process = _process;
                        return resolve(AIOStatus.RUNNING);
                    }
                    else {
                        this._status = AIOStatus.STOPPED;
                        return resolve(AIOStatus.STOPPED, "Not check server");
                    }
                });
            });
        });
    }
    get status() {
        return new Promise((resolve, reject) => {
            if (this._status !== AIOStatus.UNK)
                return resolve(this._status);
            else
                this._onResponse.push(() => resolve(this._status));
        });
    }
})();
//# sourceMappingURL=index.js.map