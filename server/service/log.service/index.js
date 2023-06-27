"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startLogService = void 0;
const project_1 = require("../../global/project");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const json5_1 = __importDefault(require("json5"));
const console_cath_1 = require("../../lib/console-cath");
const cron_service_1 = require("../cron.service");
function startLogService() {
    const streams = {
        "snapshot": fs_1.default.createWriteStream(path_1.default.join(project_1.folders.logs, "snapshot.log")),
        "LOGFILE": fs_1.default.createWriteStream(path_1.default.join(project_1.folders.logs, "logfile.log"))
    };
    let streamsMap = {};
    fs_1.default.writeFileSync(path_1.default.join(project_1.folders.logs, "snapshot.log"), "");
    let doc;
    if (fs_1.default.existsSync(path_1.default.join(project_1.folders.logs, "status.jsons5")))
        doc = fs_1.default.readFileSync(path_1.default.join(project_1.folders.logs, "status.json5")).toString("utf-8");
    const status = doc ? json5_1.default.parse(doc) : new Proxy({}, {
        get(root, level, receiver) {
            if (!root[level])
                root[level] = new Proxy({}, {
                    get(entry, field, receiver) {
                        if (!entry[field])
                            entry[field] = -1;
                        return entry[field];
                    }
                });
            return root[level];
        }
    });
    function saveStatus() {
        fs_1.default.writeFileSync(path_1.default.join(project_1.folders.logs, "status.json5"), json5_1.default.stringify(status, null, 2));
    }
    console_cath_1.capture.register(new console.Console(streams.LOGFILE));
    console_cath_1.capture.replay(new console.Console(streams.snapshot));
    let levelCatch = ["error", "warn", "log", "debug"];
    console_cath_1.capture.register(opts => {
        let streams = [];
        if (levelCatch.includes(opts.level)) {
            let levelFolder = (0, project_1.folder)(project_1.folders.logs, String(opts.level));
            (0, cron_service_1.intervalNames)(opts.moment, { prefix: "LOGFILE.", suffix: ".log" }).forEach(next => {
                let streamOptions = { encoding: "utf-8" };
                let filename = opts.moment.format(next.format).toLowerCase();
                let hasDiff = next.value !== status[next.field];
                if (hasDiff)
                    streamOptions.flags = "a";
                if (hasDiff && streamsMap[filename]) {
                    streamsMap[filename].close();
                    streamsMap[filename] = null;
                }
                if (!streamsMap[filename])
                    streamsMap[filename] = fs_1.default.createWriteStream(path_1.default.join(levelFolder, filename), streamOptions);
                streams.push(streamsMap[filename]);
            });
            cron_service_1.interval.forEach(field => {
                let value;
                // @ts-ignore
                if (typeof opts.moment[field] === "function")
                    value = opts.moment[field]();
                status[opts.level][field] = value;
            });
        }
        saveStatus();
        return streams.map(stream => new console.Console(stream));
    });
}
exports.startLogService = startLogService;
//# sourceMappingURL=index.js.map