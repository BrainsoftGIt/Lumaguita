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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresCluster = exports.DEBUG_LOG = exports.DEBUG_INFO = exports.DEBUG_WARN = exports.DEBUG_ERROR = exports.commandExists = exports.ListenerEvent = exports.PGClusterStatus = exports.PGStatus = exports.DefaultsNotices = exports.DEFINES = void 0;
const pgctl_status_1 = require("./tools/pgctl-status");
require('source-map-support').install();
const fs_1 = __importDefault(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const readline = __importStar(require("readline"));
const listen_1 = require("../utils/process/listen");
const psql_1 = require("./tools/psql");
const chalk_1 = __importDefault(require("chalk"));
const pg_recoginizer_1 = require("./pg-recoginizer");
const version_1 = require("./tools/version");
const os_1 = __importDefault(require("os"));
const promise_1 = require("../utils/promise");
let SILENT_COMMAND = os_1.default.platform() === "win32" ? "silent.exe" : "silent";
const VALUES = {
    get BREAK_LINE() { return '\n'; },
    TABS(number) {
        if (!number)
            number = 1;
        return '\t';
    },
    PG_PASSWORD_ENV: "PGPASSWORD",
    PG_AUTH_CONFIGS: "pg_hba.conf",
    PG_CONFIG: "postgresql.conf",
    get DEFAULT_PG_CONFIG() { return `defaults.${this.PG_CONFIG}`; },
    get PG_TEMP_PG_CONFIGS() { return `temp.${this.PG_CONFIG}`; },
    get DEFAULT_AUTH_CONFIG() { return `defaults.${this.PG_AUTH_CONFIGS}`; },
    get PG_TEMP_AUTH_CONFIGS() { return `temp.${this.PG_AUTH_CONFIGS}`; }
};
exports.DEFINES = new Proxy(VALUES, {
    set(target, p, value, receiver) {
        throw new Error("PROTECTED VARS READY ONLY!");
    }
});
var DefaultsNotices;
(function (DefaultsNotices) {
    DefaultsNotices["NOTICE_PASSWORDS_SETS"] = "DefaultsNotices.NOTICE_PASSWORDS_SETS";
})(DefaultsNotices = exports.DefaultsNotices || (exports.DefaultsNotices = {}));
// export enum PGCtlStartResult {
//     OK = "PGCtlStartResult.OK",
//     ALREADY_STARTED = "PGCtlStartResult.ALREADY_STARTED",
//     NEED_CONFIGURATION = "PGCtlStartResult.NEED_CONFIGURATION",
//     NEED_SERVER_INSTALL = "PGCtlStartResult.NEED_SERVER_INSTALL",
//     REJECTED="PGCtlStartResult.REJECTED"
// }
var PGStatus;
(function (PGStatus) {
    PGStatus["OK"] = "PGStatus.OK";
    PGStatus["FAILED"] = "PGStatus.FAILED";
    PGStatus["REJECTED"] = "PGStatus.REJECTED";
    PGStatus["ERROR"] = "PGStatus.ERROR";
    PGStatus["TEST_FAILED"] = "PGStatus.TEST_FAILED";
    PGStatus["TEST_SUCCESS"] = "PGStatus.TEST_SUCCESS";
    PGStatus["TEST_ERROR"] = "PGStatus.TEST_SUCCESS";
    /** FATAL:  the database system is starting up */
    PGStatus["TEST_WAIT"] = "PGStatus.TEST_WAIT";
    PGStatus["START_SUCCESS"] = "PGStatus.START_SUCCESS";
    PGStatus["START_SUCCESS_ANOTHER"] = "PGStatus.START_SUCCESS_ANOTHER";
    PGStatus["START_RETRY_EXCEEDED"] = "PGStatus.START_RETRY_EXCEDED";
    PGStatus["START_REJECTED"] = "PGStatus.START_REJECTED";
    PGStatus["START_NEED_CONFIGURATION"] = "PGStatus.START_NEED_CONFIGURATION";
    PGStatus["START_NEED_INSTALLATION"] = "PGStatus.START_NEED_INSTALLATION";
    PGStatus["CONFIG_ERROR"] = "PGStatus.CONFIGS_ERROR";
})(PGStatus = exports.PGStatus || (exports.PGStatus = {}));
var PGClusterStatus;
(function (PGClusterStatus) {
    PGClusterStatus["DIR_NOT_EXISTS"] = "PGClusterStatus.DIR_NOT_EXISTS";
    PGClusterStatus["DIR_NOT_DATABASE_CLUSTER"] = "PGClusterStatus.DIR_NOT_PG_CLUSTER";
    PGClusterStatus["CLUSTER_STOPPED"] = "PGClusterStatus.CLUSTER_STOPPED";
    PGClusterStatus["CLUSTER_RUNNING"] = "PGClusterStatus.CLUSTER_RUNNING";
})(PGClusterStatus = exports.PGClusterStatus || (exports.PGClusterStatus = {}));
var ListenerEvent;
(function (ListenerEvent) {
    ListenerEvent["INIT_DB"] = "ListenerEvent.INIT_DB";
    ListenerEvent["START"] = "ListenerEvent.START";
    ListenerEvent["READY"] = "ListenerEvent.READY";
})(ListenerEvent = exports.ListenerEvent || (exports.ListenerEvent = {}));
function commandExists(command) {
    const isWin = require('os').platform().indexOf('win') > -1;
    const where = isWin ? 'where' : 'whereis';
    const spawnSync = require('child_process').spawnSync;
    const out = spawnSync(where, [command], { encoding: 'utf8' });
    return out.status === 0;
}
exports.commandExists = commandExists;
exports.DEBUG_ERROR = { level: "error", levelCode: 0 };
exports.DEBUG_WARN = { level: "warn", levelCode: 1 };
exports.DEBUG_INFO = { level: "info", levelCode: 2 };
exports.DEBUG_LOG = { level: "log", levelCode: 3 };
class PostgresCluster {
    constructor(PG_VERSION, upVersion, root, dirname, args, callbacks) {
        var _a, _b;
        this._countStarts = 0;
        this._authMethods = [];
        this._listener = new Proxy({}, {
            get(target, p) {
                if (!target[p])
                    target[p] = [];
                return target[p];
            }
        });
        this.root = root;
        this.PG_VERSION = PG_VERSION;
        this.upVersion = upVersion;
        this.dirname = dirname;
        this.debug = (details, message, ...extras) => {
            if (typeof callbacks.debug === "function") {
                try {
                    callbacks.debug(details, message, ...extras);
                }
                catch (e) { }
            }
        };
        if (!((_b = (_a = args.configs) === null || _a === void 0 ? void 0 : _a.port) === null || _b === void 0 ? void 0 : _b.number)) {
            this.debug(exports.DEBUG_ERROR, "Missing arg port");
            throw new Error("Missing arg port");
        }
        if (!args.superuser) {
            this.debug(exports.DEBUG_ERROR, "Missing supper user name");
            throw new Error("Missing supper user name");
        }
        if (!args.database) {
            this.debug(exports.DEBUG_ERROR, "Missing default database name");
            throw new Error("Missing default database name");
        }
        this._configs = args;
        const _ready = () => {
            this.prepare().then(() => {
                if (callbacks === null || callbacks === void 0 ? void 0 : callbacks.ready)
                    callbacks === null || callbacks === void 0 ? void 0 : callbacks.ready(this, () => {
                        this.debug(exports.DEBUG_INFO, "CALLBACK READY");
                        this._listener[ListenerEvent.READY].forEach(ready => {
                            this.debug(exports.DEBUG_INFO, "CALL READY NEXT");
                            ready(ListenerEvent.READY);
                        });
                    });
            });
        };
        const _reject = () => {
            let message = "PG_CTL canceled - NO DATABASE INSTALLER CALLBACK DETECTED. PLEASE SET A INSTALLER CALLBACK";
            let error = new Error(message);
            this.debug(exports.DEBUG_WARN, message, error);
            this.testConnection = () => { throw error; };
            this.__start = () => { throw error; };
            this.start = () => { throw error; };
            this.stop = () => { throw error; };
            this.stop = () => { throw error; };
            this.reload = () => { throw error; };
            this.initDatabaseCluster = () => { throw error; };
            this.restart = () => { throw error; };
        };
        pg_recoginizer_1.pgServer.detect(PG_VERSION, upVersion).then(databaseServer => {
            if (!databaseServer || !databaseServer.isValid || !databaseServer.isSupported) {
                return _reject();
            }
            else
                return _ready();
        });
    }
    get pid() {
        return this._startPidNumber;
    }
    get configs() {
        return this._configs;
    }
    prepare() {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            if (fs_1.default.existsSync(this.configFile)) {
                this.loadStatus();
            }
            else {
                let portRandom = !Object.keys((_b = (_a = this._configs) === null || _a === void 0 ? void 0 : _a.configs) === null || _b === void 0 ? void 0 : _b.port).includes("random") || this._configs.configs.port.random;
                let port = ((_e = (_d = (_c = this._configs) === null || _c === void 0 ? void 0 : _c.configs) === null || _d === void 0 ? void 0 : _d.port) === null || _e === void 0 ? void 0 : _e.number) || 5432;
                if (portRandom)
                    this._port = port;
                else
                    this._port = port;
            }
        });
    }
    get dataDir() { return this.dirStatus().dataDir; }
    get version() {
        return (0, version_1.postgresToolVersion)("pg_ctl");
    }
    get isServiceOwner() { return !!this._startPidNumber; }
    get configFile() {
        fs_1.default.mkdirSync(this.root, { recursive: true });
        return path.join(this.root, `${this.dirname}.pgctl.config.json`);
    }
    get pwfile() {
        if (!fs_1.default.existsSync(path.join(this.root, 'pwfile.secret'))) {
            fs_1.default.writeFileSync(path.join(this.root, "pwfile.secret"), String(this.configs.superuserPassword));
        }
        return path.join(this.root, "pwfile.secret");
    }
    get port() { return this._port; }
    status() {
        return (0, pgctl_status_1.pgctlStatus)(this.dataDir);
    }
    get isConfigured() {
        return this._countStarts || 0 > 0;
    }
    on(EVENT, callback) {
        this._listener[EVENT].push(callback);
    }
    initDatabaseCluster(whenExists) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            this.debug(exports.DEBUG_INFO, "create cluster database dir...");
            let clusterDir = yield this.createDir(whenExists);
            if (clusterDir.empty) {
                this.debug(exports.DEBUG_INFO, "working on initdb...");
                let initdb = (0, child_process_1.spawn)("initdb", [
                    "-A", "md5",
                    `--pwfile=${this.pwfile}`,
                    "--no-locale",
                    "--username", this._configs.superuser,
                    "-D", clusterDir.dataDir,
                ]);
                (0, listen_1.processListen)(initdb, { console: true })
                    .then((result) => __awaiter(this, void 0, void 0, function* () {
                    let status = yield (0, pgctl_status_1.pgctlStatus)(clusterDir.dataDir);
                    if (result.code === 0) {
                        this._countStarts = 0;
                        this.code = clusterDir.code;
                        this.applyConfigs().then(() => __awaiter(this, void 0, void 0, function* () {
                            this.saveStatus();
                            let i = 0;
                            for (const callback of this._listener[ListenerEvent.INIT_DB]) {
                                this.debug(exports.DEBUG_INFO, "NEXT INIT DB CALLBACK", i++);
                                yield callback(ListenerEvent.INIT_DB);
                            }
                            this.notifyStartListener([PGStatus.START_SUCCESS, PGStatus.OK, PGStatus.TEST_SUCCESS]).then(value => {
                                resolve({
                                    result: true,
                                    message: result.stdout,
                                    dataDir: clusterDir.dataDir,
                                    code: clusterDir.code,
                                    status
                                });
                            }).catch(reason => {
                                resolve({
                                    result: true,
                                    message: result.stdout,
                                    dataDir: clusterDir.dataDir,
                                    code: clusterDir.code,
                                    status
                                });
                            });
                        })).catch(reason => {
                            console.error(reason);
                        });
                    }
                    else {
                        resolve({
                            result: false,
                            message: result.stdout,
                            dataDir: clusterDir.dataDir,
                            code: clusterDir.code,
                            status
                        });
                    }
                })).catch(reason => {
                    console.error(reason);
                });
            }
            else {
                resolve({
                    result: clusterDir.status === PGClusterStatus.CLUSTER_RUNNING
                        || clusterDir.status === PGClusterStatus.CLUSTER_STOPPED,
                    code: clusterDir.code,
                    message: "",
                    dataDir: clusterDir.dataDir,
                    status: clusterDir.status
                });
            }
        }));
    }
    applyConfigs() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                this.debug(exports.DEBUG_INFO, "applying cluster configs...");
                return this.configsClusters().then(value => {
                    this.debug(exports.DEBUG_INFO, "applying cluster configs... [OK]");
                    return this.__start("APPLY CONFIGS").then(startResult => {
                        if (startResult.includes(PGStatus.TEST_SUCCESS)) {
                            this.applyAuthMethodConfig().then(value1 => {
                                resolve(startResult);
                            }).catch(reason => resolve([PGStatus.ERROR, PGStatus.CONFIG_ERROR]));
                        }
                        else
                            resolve(startResult);
                    }).catch(reason => {
                        console.error(reason);
                        resolve([PGStatus.ERROR]);
                    }).finally(() => {
                    });
                });
            });
        });
    }
    applyAuthMethodConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultAuthConf = path.join(this.dataDir, exports.DEFINES.DEFAULT_AUTH_CONFIG);
            const authConf = path.join(this.dataDir, exports.DEFINES.PG_AUTH_CONFIGS);
            if (!fs_1.default.existsSync(defaultAuthConf))
                fs_1.default.renameSync(authConf, defaultAuthConf);
            if (this._authMethods.length == 0) {
                fs_1.default.copyFileSync(defaultAuthConf, authConf);
                return Promise.resolve(false);
            }
            return new Promise((resolve, reject) => {
                const out = fs_1.default.createWriteStream(authConf, "utf-8");
                const rl = readline.createInterface({
                    input: fs_1.default.createReadStream(defaultAuthConf, "utf-8"),
                    crlfDelay: Infinity
                });
                rl.on("line", line => {
                    if (line.trim().charAt(0) !== "#")
                        line = "#" + line;
                    line = line + exports.DEFINES.BREAK_LINE;
                    out.write(line);
                });
                rl.on("close", () => {
                    if (!this._authMethods.find(value => {
                        return value.USER === this._configs.superuser
                            && value.METHOD === "trust"
                            && value.TYPE === "local"
                            && value.DATABASE === "all";
                    })) {
                        this._authMethods.unshift({
                            METHOD: "md5",
                            DATABASE: "all",
                            TYPE: "local",
                            USER: this._configs.superuser
                        });
                        this._authMethods.unshift({
                            METHOD: "md5",
                            DATABASE: "all",
                            TYPE: "host",
                            ADDRESS: "127.0.0.1/32",
                            USER: this._configs.superuser
                        });
                        this._authMethods.unshift({
                            METHOD: "md5",
                            DATABASE: "all",
                            TYPE: "host",
                            ADDRESS: "localhost",
                            USER: this._configs.superuser
                        });
                    }
                    const maxLengths = { METHOD: 0, DATABASE: 0, TYPE: 0, ADDRESS: 0, USER: 0 };
                    const keys = ["TYPE", "DATABASE", "USER", "ADDRESS", "METHOD"];
                    const methods = JSON.parse(JSON.stringify(this._authMethods));
                    methods.forEach(method => {
                        if (method.ADDRESS === "*")
                            method.ADDRESS = "0.0.0.0/0";
                        method.TYPE = method.TYPE || "local";
                        method.DATABASE = method.DATABASE || "all";
                        method.USER = method.USER || "all";
                        method.ADDRESS = method.ADDRESS || "";
                        method.METHOD = method.METHOD || "peer";
                        keys.forEach(key => {
                            if (method[key].length > maxLengths[key])
                                maxLengths[key] = method[key].length;
                        });
                    });
                    methods.forEach(method => {
                        keys.forEach(key => { method[key] = `${method[key]}`.padEnd(maxLengths[key], " "); });
                    });
                    methods.forEach(method => {
                        //template
                        //TYPE  DATABASE        USER            ADDRESS                 METHOD
                        let _t = exports.DEFINES.TABS(1);
                        let auth = `${method.TYPE} ${_t} ${method.DATABASE} ${_t} ${method.USER} ${_t} ${method.ADDRESS} ${_t} ${method.METHOD}`;
                        auth = auth + exports.DEFINES.BREAK_LINE;
                        out.write(auth);
                    });
                    out.close();
                    this.reload().then(value => {
                        resolve(true);
                    });
                });
            });
        });
    }
    pushAuth(...methods) {
        let newMethod = false;
        methods.forEach(method => {
            if (Array.isArray(method.DATABASE))
                method.DATABASE = method.DATABASE.join(",");
            if (Array.isArray(method.USER))
                method.USER = method.USER.join(",");
            let find = this._authMethods.find(value => {
                return value.TYPE === method.TYPE
                    && value.DATABASE === method.DATABASE
                    && value.USER === method.USER
                    && value.METHOD === method.METHOD
                    && value.ADDRESS === method.ADDRESS;
            });
            if (find)
                return;
            newMethod = true;
            this._authMethods.push(Object.assign(Object.assign({}, method), { DATABASE: method.DATABASE, USER: method.USER }));
        });
        this.saveStatus();
        return newMethod;
    }
    reload() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.status().then(value => {
                if (value === PGClusterStatus.CLUSTER_RUNNING) {
                    const child = (0, child_process_1.spawn)("pg_ctl", [
                        "-D", this.dataDir,
                        "reload"
                    ]);
                    (0, listen_1.processListen)(child, {}).then(value1 => {
                        console.log("RELOAD - RESULT", value1);
                        // process.exit( 0 );
                    });
                }
                else
                    return Promise.resolve(value);
            });
        });
    }
    configsClusters() {
        return __awaiter(this, void 0, void 0, function* () {
            const defCfg = path.join(this.dataDir, exports.DEFINES.DEFAULT_PG_CONFIG);
            const cfg = path.join(this.dataDir, exports.DEFINES.PG_CONFIG);
            fs_1.default.renameSync(cfg, defCfg);
            const rl = readline.createInterface({
                input: fs_1.default.createReadStream(defCfg, "latin1"),
                crlfDelay: Infinity
            });
            const out = fs_1.default.createWriteStream(cfg, "latin1");
            let configs = {
                port: { value: this._port, type: "simple" },
                listen_addresses: { value: this._configs.configs.listen, type: "string" }
            };
            // const wr = fs.createWriteStream( path.join( this.dataDir, PG_CONFIG ), "latin1" )
            rl.on("line", (line) => {
                const parts = line.split("=");
                if (Object.keys(configs).includes(parts[0].trim())) {
                    line = "#" + line;
                }
                line = line + exports.DEFINES.BREAK_LINE;
                out.write(line);
            });
            return new Promise((resolve, reject) => {
                rl.on("close", () => {
                    Object.keys(configs).forEach(key => {
                        let config = configs[key];
                        let line = ({
                            ['simple']: () => `${key} = ${config.value}`,
                            ['string']: () => `${key} = '${config.value}'`
                        })[config.type]();
                        if (line) {
                            line = line + exports.DEFINES.BREAK_LINE;
                            out.write(line);
                        }
                    });
                    resolve(configs);
                });
            });
        });
    }
    saveStatus() {
        fs_1.default.writeFileSync(this.configFile, JSON.stringify({
            code: this.code,
            root: this.root,
            dataDir: this.dataDir,
            dirname: this.dirname,
            port: this._port,
            countStarts: this._countStarts,
            methods: this._authMethods
        }));
    }
    loadStatus() {
        let configs = require(this.configFile);
        if (!configs)
            return;
        this.code = configs.code;
        this._port = Number(configs.port);
        this._countStarts = Number(configs.countStarts);
        this._authMethods = configs.methods;
    }
    notifyStartListener(startStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!startStatus.includes(PGStatus.START_SUCCESS_ANOTHER)) {
                this._countStarts++;
                this.saveStatus();
            }
            for (const callback of this._listener[ListenerEvent.START]) {
                yield callback(ListenerEvent.START, { countStarts: this._countStarts });
            }
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                this.__start("PUBLIC START").then(value => {
                    if (value.includes(PGStatus.OK))
                        this.notifyStartListener(value).then(() => {
                            resolve(value);
                        });
                    else
                        resolve(value);
                });
            });
        });
    }
    __start(req) {
        return __awaiter(this, void 0, void 0, function* () {
            this.debug(exports.DEBUG_INFO, `START CLUSTER FOR ${req}`, req);
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const status = yield this.status();
                const dirStatus = this.dirStatus();
                this.debug(exports.DEBUG_INFO, `DATABASE DATA DIR:  `, this.dataDir);
                if (!pg_recoginizer_1.pgServer.isRecognized(this.PG_VERSION, this.upVersion)) {
                    return resolve([PGStatus.START_NEED_INSTALLATION]);
                }
                else if (status === PGClusterStatus.DIR_NOT_EXISTS)
                    return resolve([PGStatus.START_NEED_CONFIGURATION]);
                else if (status === PGClusterStatus.DIR_NOT_DATABASE_CLUSTER)
                    return resolve([PGStatus.START_NEED_CONFIGURATION]);
                else if (status === PGClusterStatus.CLUSTER_STOPPED) {
                    const start = (0, child_process_1.spawn)(SILENT_COMMAND, ["pg_ctl",
                        "-D", dirStatus.dataDir,
                        "-l", path.join(dirStatus.dataDir, "logfile.log"),
                        "start"
                    ]);
                    this._startPidNumber = start.pid;
                    let error;
                    start.on("error", (reasson) => {
                        error = reasson;
                    });
                    start.stdout.on("data", chunk => this.debug(exports.DEBUG_LOG, chunk.toString()));
                    start.stderr.on("data", chunk => this.debug(exports.DEBUG_LOG, chunk.toString()));
                    start.on("exit", (code, m) => {
                        if (code === 0) {
                            this.debug(exports.DEBUG_INFO, chalk_1.default.greenBright("[PG-CTP:START|OK] database cluster started with current process!"));
                            let __test = (retry) => {
                                retry = (retry || 0) + 1;
                                if (retry > 1)
                                    this.debug(exports.DEBUG_WARN, "RETRY TEST SUPER USER CONNECTION " + retry + " TIME");
                                this.testConnection("START-CLUSTER-PROCESS:OWNER").then(testResult => {
                                    if (testResult.includes(PGStatus.TEST_SUCCESS))
                                        resolve([...testResult, PGStatus.OK, PGStatus.TEST_SUCCESS]);
                                    else if (testResult.includes(PGStatus.TEST_WAIT)) {
                                        setTimeout(() => {
                                            __test(retry);
                                        }, 1500);
                                    }
                                    else
                                        (0, promise_1.promiseResolveAny)(this.stop()).then(value => {
                                            resolve([PGStatus.CONFIG_ERROR]);
                                        });
                                });
                            };
                            __test();
                        }
                        else if (error)
                            return reject(error);
                        else {
                            let message = "Algo deu mal ao iniciar o banco de dados";
                            let error = new Error(message);
                            this.debug(exports.DEBUG_ERROR, message, error);
                            reject(error);
                        }
                    });
                }
                else if (status === PGClusterStatus.CLUSTER_RUNNING) {
                    this.debug(exports.DEBUG_WARN, chalk_1.default.yellowBright("[PG-CTP:START|SKIP] database cluster is already started by other external process!"));
                    this.testConnection("START-CLUSTER-OTHER:GUEST").then(testResult => {
                        if (testResult.includes(PGStatus.TEST_SUCCESS))
                            resolve([...testResult, PGStatus.OK, PGStatus.START_SUCCESS_ANOTHER, PGStatus.START_SUCCESS]);
                    });
                }
                else {
                    this.debug(exports.DEBUG_ERROR, chalk_1.default.redBright("[PG-CTP:START|SKIP] NOT DETERMINED START!"));
                    resolve([PGStatus.START_REJECTED]);
                }
            }));
        });
    }
    testConnection(debug) {
        return __awaiter(this, void 0, void 0, function* () {
            this.debug(exports.DEBUG_INFO, `TESTING SUPERUSER ${this.configs.superuser} CONNECTION WITH ${debug}...`, debug);
            //EXIT 0 | error: '', message: *any
            let connect = (0, psql_1.psql)({
                dbname: "postgres",
                command: "select now();",
                username: this.configs.superuser,
                host: "127.0.0.1",
                "tuples-only": true,
                port: this._port
            }, { env: { PGPASSWORD: this.configs.superuserPassword } });
            const promise = new Promise((resolve, reject) => {
                (0, listen_1.processListen)(connect, {}).then(result => {
                    if (result.code === 0) {
                        this.debug(exports.DEBUG_INFO, `TESTING SUPERUSER ${this.configs.superuser} CONNECTION WITH ${debug}... [SUCCESS]`, debug);
                        return resolve([PGStatus.OK, PGStatus.TEST_SUCCESS]);
                    }
                    else if (result.code === 2 && result.stderr.includes("starting up")) {
                        return resolve([PGStatus.TEST_WAIT]);
                    }
                    this.debug(exports.DEBUG_INFO, `TESTING SUPERUSER ${this.configs.superuser} CONNECTION WITH ${debug}... [FAILED]`, debug, result);
                    this.debug(exports.DEBUG_ERROR, "value.outError", result.stderr);
                    return resolve([PGStatus.FAILED, PGStatus.TEST_FAILED]);
                }).catch(reason => {
                    this.debug(exports.DEBUG_INFO, `TESTING SUPERUSER ${this.configs.superuser} CONNECTION WITH ${debug}... [ERROR]`, debug);
                    this.debug(exports.DEBUG_ERROR, reason);
                    return resolve([PGStatus.FAILED, PGStatus.TEST_ERROR, PGStatus.TEST_FAILED]);
                });
            });
            promise.catch(reason => {
                this.debug(exports.DEBUG_ERROR, reason);
                return Promise.resolve(false);
            });
            return promise;
        });
    }
    static stopDatabaseClusterSync(dataDirname) {
        return (0, child_process_1.spawnSync)("pg_ctl", ["-D", dataDirname, "stop"]);
    }
    static stopDatabaseListen(dataDirname) {
        return (0, listen_1.processListen)(this.stopDatabaseCluster(dataDirname));
    }
    static stopDatabaseCluster(dataDirname) {
        return (0, child_process_1.spawn)("pg_ctl", [
            "-D", dataDirname,
            "stop"
        ]);
    }
    stop() {
        return PostgresCluster.stopDatabaseListen(this.dataDir);
    }
    restart() {
        return this.status().then(status => {
            if (status === PGClusterStatus.CLUSTER_RUNNING) {
                return this.stop().then(stop => {
                    return this.__start("RESTART:WHEN RUNNING");
                });
            }
            else
                return this.__start("RESTART:WHEN STOPPED");
        });
    }
    dirStatus(args) {
        if (!args)
            args = {
                dirname: this.dirname,
                root: this.root,
                code: this.code
            };
        if (!args.dirname || !args.root)
            return;
        let code = args.code;
        let name = (code) ? `${args.dirname}-${code}` : args.dirname;
        let dataDir = path.join(this.root, name);
        let exists = fs_1.default.existsSync(dataDir);
        let empty;
        if (exists)
            empty = fs_1.default.readdirSync(dataDir).length === 0;
        else
            empty = true;
        return { dirname: args.dirname, name, exists, empty, root: args.root,
            dataDir,
        };
    }
    createDir(whenExists) {
        return __awaiter(this, void 0, void 0, function* () {
            let min = 1000000;
            let max = 9999999;
            let status;
            let dirStatus;
            let code = this.code;
            const checkDir = () => __awaiter(this, void 0, void 0, function* () {
                dirStatus = this.dirStatus({
                    code: code,
                    dirname: this.dirname,
                    root: this.root
                });
                status = yield (0, pgctl_status_1.pgctlStatus)(dirStatus.dataDir);
                const test = yield this.testConnection("CREATE-DIR");
                if (dirStatus.exists && whenExists === "RANDOM")
                    return true;
                else if (dirStatus.exists && !dirStatus.empty && whenExists === "RANDOM-IF-NOT-EMPTY")
                    return true;
                else if (dirStatus.exists && !dirStatus.empty && whenExists === "RANDOM-IF-NOT-CLUSTER" && status === "PGClusterStatus.DIR_NOT_PG_CLUSTER")
                    return true;
                else if (dirStatus.exists && !dirStatus.empty && whenExists === "RANDOM-IF-CLUSTER-RUNNING" && status === "PGClusterStatus.CLUSTER_RUNNING")
                    return true;
                else if (dirStatus.exists && !dirStatus.empty && whenExists === "RANDOM-IF-CLUSTER-CANNOT-CONNECT" && status === "PGClusterStatus.CLUSTER_RUNNING" && !test)
                    return true;
                return false;
            });
            while (yield checkDir()) {
                code = `${Math.trunc(Math.random() * (max - min) + min)}`;
            }
            return Object.assign(Object.assign({}, dirStatus), { code,
                status });
        });
    }
}
exports.PostgresCluster = PostgresCluster;
//# sourceMappingURL=pg-ctl.js.map