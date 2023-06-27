"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoDumpService = exports.create_dump_sync = exports.create_dump = exports.dumpNow = void 0;
const pg_recoginizer_1 = require("../../lib/postgres/pg-recoginizer");
require("source-map-support").install();
const pg_dump_1 = require("../../lib/postgres/tools/pg_dump");
const args_1 = require("../../global/args");
const path_1 = __importDefault(require("path"));
const project_1 = require("../../global/project");
const moment_1 = __importDefault(require("moment"));
const cron_service_1 = require("../cron.service");
const fs_1 = __importDefault(require("fs"));
const defaults_1 = require("../../global/defaults");
const acceptsInterval = ["week-day", "week"];
function dumpNow(instant, opts) {
    return new Promise((resolve, reject) => {
        if (!instant)
            instant = (0, moment_1.default)(new Date());
        let prefix = "", suffix = "";
        if (opts === null || opts === void 0 ? void 0 : opts.prefix)
            prefix = `-${opts.prefix}`;
        if (opts === null || opts === void 0 ? void 0 : opts.suffix)
            suffix = `-${opts.suffix}`;
        let dumps = (0, cron_service_1.intervalNames)(instant, { prefix: `${args_1.args.dbName}${prefix}${suffix}.`, suffix: ".base.db" })
            .filter(value => acceptsInterval.includes(value.intervalName));
        console.log("[MAGUITA] Dump> start at ", instant);
        const next = () => {
            let _next = dumps.shift();
            if (!_next) {
                console.log("[MAGUITA] Dump> auto start database dumps... ", instant.toString(), "end!");
                return resolve(true);
            }
            let dumpFile = instant.format(_next.format).toLowerCase();
            console.log(`[MAGUITA] Dump> ${_next.intervalName} ->> `, dumpFile, "next!");
            const out = create_dump(path_1.default.join(project_1.folders.dumps, dumpFile));
            out.stdout.on("data", chunk => { });
            out.stderr.on("data", chunk => { });
            process.stdin.pipe(out.stdin);
            out.on("close", (code, signal) => {
                next();
            });
        };
        next();
    });
}
exports.dumpNow = dumpNow;
function dargs(filename) {
    return [
        {
            dbname: args_1.args.dbName,
            username: args_1.args.dbUser,
            "if-exists": true,
            "no-owner": true,
            file: path_1.default.join(filename),
            host: args_1.args.dbHost,
            port: args_1.args.dbPort,
            clean: true,
            verbose: true,
        }, { env: { PGPASSWORD: args_1.args.dbPassword },
            detached: true,
            shell: true
        }
    ];
}
function create_dump(fileName) {
    if (!fs_1.default.existsSync(path_1.default.dirname(fileName)))
        fs_1.default.mkdirSync(path_1.default.dirname(fileName));
    return (0, pg_dump_1.pg_dump)(...dargs(fileName));
}
exports.create_dump = create_dump;
function create_dump_sync(filename) {
    console.log({ filename });
    return (0, pg_dump_1.pg_dump_sync)(...dargs(filename));
}
exports.create_dump_sync = create_dump_sync;
function autoDumpService(opts) {
    return pg_recoginizer_1.pgServer.recognizePath(defaults_1.DEFAULTS.DB_VERSION, defaults_1.DEFAULTS.DB_VERSION_UP).then(result => {
        let detect = result.after;
        let _status = {};
        _status.detect = (detect && detect.isValid && detect.isSupported);
        let _service;
        if (cron_service_1.cronManager.existsService("auto:dump"))
            _service = cron_service_1.cronManager.getService("auto:dump");
        else
            _service = cron_service_1.cronManager.register("auto:dump", { minute: 30, hour: { in: { start: 7, end: 19 }, repeat: 4 } }, instant => {
                if (!_status.detect) {
                    return pg_recoginizer_1.pgServer.detect(defaults_1.DEFAULTS.DB_VERSION, defaults_1.DEFAULTS.DB_VERSION_UP).then(detect => {
                        _status.detect = (detect && detect.isValid && detect.isSupported);
                    });
                }
                console.log("==================== AUTO DUMP SERVICE ====================");
                dumpNow(instant, opts).then();
            });
        if (_status.detect)
            return dumpNow((0, moment_1.default)(new Date())).then(value => {
                return Promise.resolve(_service);
            });
        else
            return Promise.resolve(_service);
    });
}
exports.autoDumpService = autoDumpService;
//# sourceMappingURL=dumps.js.map