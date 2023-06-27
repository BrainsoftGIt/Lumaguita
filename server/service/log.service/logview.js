"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapshotView = exports.launch = exports.logView = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const project_1 = require("../../global/project");
const ioline_service_1 = require("../ioline.service");
const sys_1 = require("../../global/sys");
const win32_1 = require("../../lib/utils/process/win32");
const logReadyStatus = {
    nextLine: 0,
    lines: [],
    ref: "snapshot.log",
    notifyLineEnd: false,
    next() {
        return this.lines[this.nextLine++];
    }, reload() {
        let _logpath = path_1.default.join(project_1.folders.logs, this.ref);
        if (!fs_1.default.existsSync(_logpath))
            return [];
        let raw = fs_1.default.readFileSync(_logpath).toString("utf-8");
        this.lines = raw.split("\n");
    }
};
function readNextLine() {
    if (logReadyStatus.nextLine === logReadyStatus.lines.length)
        logReadyStatus.reload();
    else if (logReadyStatus.nextLine > logReadyStatus.lines.length) {
        logReadyStatus.reload();
        logReadyStatus.nextLine = 0;
        console.clear();
    }
    if (logReadyStatus.nextLine >= logReadyStatus.lines.length) {
        console.clear();
        logReadyStatus.lines.forEach((value, index) => {
            if (index >= logReadyStatus.nextLine)
                return;
            console.log(value);
        });
        console.log(`[ENDOF: ${logReadyStatus.ref}]`);
        return;
    }
    console.clear();
    logReadyStatus.lines.forEach((value, index) => {
        if (index >= logReadyStatus.nextLine)
            return;
        console.log(value);
    });
    console.log(logReadyStatus.next());
}
function navigateToLine(args) {
    let lineNumber = Number(args[0]);
    if (!Number.isSafeInteger(lineNumber))
        return;
    logReadyStatus.nextLine = lineNumber;
    readNextLine();
}
function logView() {
    (0, ioline_service_1.registerLine)({ name: "", describe: "Enter to read log next line" }, (command, line, args1) => {
        readNextLine();
    });
    (0, ioline_service_1.registerLine)({ name: "log://navigate", describe: "Navigate to especifiquis line" }, (command, line, args) => {
        navigateToLine(args);
    });
}
exports.logView = logView;
function launch(opts) {
    let launcher = sys_1.sys.launcher();
    if (!opts)
        opts = {};
    let _argv = [];
    Object.keys(opts).forEach(key => {
        let value = opts[key];
        if (value === null || value === undefined)
            return;
        if (typeof value === "boolean" && value)
            _argv.push(`--${key}`);
        else if (typeof value === "string")
            _argv.push(`--${key}`, String(value));
        else if (typeof value === "number")
            _argv.push(`--${key}`, String(value));
    });
    console.log(launcher.executable, ...launcher.executableArgv, "logs", ..._argv);
    let child = (0, win32_1.execFilePain)(launcher.executable, [
        ...launcher.executableArgv,
        "logs",
        ..._argv
    ], { detached: true }, "noWait");
    child.unref();
    // capture.register( new Console())
    child.on("close", (code, signal) => console.log("logs:logSnapshot|close", opts.logSnapshot, { code, signal }));
    child.on("exit", (code, signal) => console.log("logs:logSnapshot|exit", opts.logSnapshot, { code, signal }));
    child.stdout.on("data", chunk => console.log(chunk.toString()));
    child.stderr.on("data", chunk => console.log(chunk.toString()));
}
exports.launch = launch;
function snapshotView() {
    const status = {
        nextLine: 0,
        pid: fs_1.default.readFileSync(path_1.default.join(project_1.folders.home, "current.pid")).toString("utf8")
    };
    const restart = (currentPid) => {
        status.nextLine = 0;
        status.pid = currentPid;
        console.clear();
    };
    const reader = () => {
        let text = fs_1.default.readFileSync(path_1.default.join(project_1.folders.logs, "snapshot.log")).toString("utf-8").split("\n")
            .filter((value, index) => index >= status.nextLine);
        text.forEach(line => {
            console.log(line);
            status.nextLine++;
        });
    };
    fs_1.default.watchFile(path_1.default.join(project_1.folders.logs, "snapshot.log"), (curr, prev) => {
        let nextPid = fs_1.default.readFileSync(path_1.default.join(project_1.folders.home, "current.pid")).toString("utf8");
        if (nextPid !== status.pid)
            restart(nextPid);
        reader();
    });
    fs_1.default.watchFile(path_1.default.join(project_1.folders.home, "current.pid"), (curr, prev) => {
        let nextPid = fs_1.default.readFileSync(path_1.default.join(project_1.folders.home, "current.pid")).toString("utf8");
        console.log("change pid from ", status.pid, { nextPid });
        if (nextPid !== status.pid)
            restart(nextPid);
        reader();
    });
    reader();
}
exports.snapshotView = snapshotView;
//# sourceMappingURL=logview.js.map