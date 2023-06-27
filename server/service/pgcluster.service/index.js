"use strict";
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
exports.pgCtl = void 0;
const project_1 = require("../../global/project");
const args_1 = require("../../global/args");
const install_1 = require("../../../build/db/install");
const pg_ctl_1 = require("../../lib/postgres/pg-ctl");
const defaults_1 = require("../../global/defaults");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const json5_1 = __importDefault(require("json5"));
const array_1 = require("../../lib/utils/array");
const toaster_1 = require("../../lib/toaster");
exports.pgCtl = new (class Service {
    get dataDirname() {
        let currentDirname = this._currentDataDirname;
        if (!currentDirname && fs_1.default.existsSync(path_1.default.join(project_1.folders.pgHome, "current.json5"))) {
            let current = json5_1.default.parse(fs_1.default.readFileSync(path_1.default.join(project_1.folders.pgHome, "current.json5")).toString("utf-8"));
            currentDirname = current === null || current === void 0 ? void 0 : current.dataDirname;
        }
        if (!currentDirname && fs_1.default.existsSync(path_1.default.join(project_1.folders.pgHome, "base"))) {
            currentDirname = path_1.default.join(project_1.folders.pgHome, "base");
        }
        return currentDirname;
    }
    start() {
        const selfPgCtl = this;
        console.log("check database server app support status... ");
        if (!this.__instance)
            this.__instance = new pg_ctl_1.PostgresCluster(defaults_1.DEFAULTS.DB_VERSION, defaults_1.DEFAULTS.DB_VERSION_UP, project_1.folders.pgHome, "base", {
                superuserPassword: args_1.args.dbPasswordSuperUser,
                detached: true,
                configs: {
                    listen: "*",
                    port: { number: args_1.args.dbPortDatabaseApp }
                }, superuser: args_1.args.dbSupperUser,
                database: "postgres"
            }, {
                debug: this.debug,
                ready(instance, ready) {
                    selfPgCtl._currentDataDirname = instance.dataDir;
                    //Save current data dirname
                    let version = instance.version;
                    let currentConfigs = {
                        dataDirname: instance.dataDir,
                        versionName: version.versionName,
                        versionDetection: version
                    };
                    fs_1.default.writeFileSync(path_1.default.join(project_1.folders.pgHome, "current.json5"), json5_1.default.stringify(currentConfigs, null, 2));
                    console.log("check database server app support status... [ok]");
                    instance.on(pg_ctl_1.ListenerEvent.INIT_DB, (EVENT) => __awaiter(this, void 0, void 0, function* () {
                        let __notifyApplicationReady = ready;
                        console.log("ListenerEvent.INIT_DB callback called");
                        console.log("compile database structure...");
                        return (0, install_1.compileDatabase)(args_1.args).then(value => {
                            console.log("compile database structure... [OK]");
                            __notifyApplicationReady();
                        });
                    }));
                    instance.on(pg_ctl_1.ListenerEvent.START, EVENT => {
                        console.log("STARTING...[OK]");
                        args_1.args.dbPort = instance.port;
                        ready();
                    });
                    console.log("start app database cluster ...");
                    instance.start().then(value => {
                        if ((0, array_1.includeAll)([pg_ctl_1.PGStatus.TEST_SUCCESS, pg_ctl_1.PGStatus.START_SUCCESS], ...value))
                            console.log("start app database cluster... [SUCCESS]");
                        else
                            console.log("start app database cluster... [FAILED]");
                        console.log(`[database] start result ${value.join("|")}`);
                        if (value.includes(pg_ctl_1.PGStatus.START_NEED_CONFIGURATION)) {
                            instance.pushAuth({
                                TYPE: "host",
                                ADDRESS: "*",
                                METHOD: "md5",
                                DATABASE: "sameuser",
                                USER: "all"
                            });
                            instance.pushAuth({
                                TYPE: "host",
                                ADDRESS: "*",
                                METHOD: "md5",
                                DATABASE: args_1.args.dbName,
                                USER: args_1.args.dbUser
                            });
                            instance.pushAuth({
                                TYPE: "host",
                                ADDRESS: "*",
                                METHOD: "md5",
                                DATABASE: args_1.args.dbName,
                                USER: args_1.args.dbUserClone
                            });
                            console.log("initializing cluster app database server ...");
                            instance.initDatabaseCluster("RANDOM-IF-CLUSTER-CANNOT-CONNECT")
                                .then(initdbResult => {
                                console.log(`initializing cluster app database server ... [${initdbResult.result ? "INITIALIZED" : "FAILED"}]`);
                            }).catch(reason => {
                                console.error(reason);
                            });
                        }
                    }).catch(reason => {
                        (0, toaster_1.appToaster)({
                            icon: project_1.project.icon.png,
                            title: "MAGUITA",
                            subtitle: "SERVIÇE FAILED!",
                            message: "Falha ao iniciar o serviço de banco de dados...! Proucupe pelo suporte caso o problema persistir!\n",
                        }, (err, response, metadata) => {
                            // process.exit( -1 );
                        });
                        console.error(reason);
                    });
                }
            });
        return this.__instance;
    }
    get instance() {
        return this.start();
    }
    get hasInstance() { return !!this.__instance; }
    get isServiceOwner() {
        if (!this.hasInstance)
            return false;
        else
            return this.instance.isServiceOwner;
    }
});
//# sourceMappingURL=index.js.map