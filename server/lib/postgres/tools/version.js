"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresToolVersion = void 0;
const os_1 = __importDefault(require("os"));
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
function postgresToolVersion(toolName, envPath) {
    let exe = "";
    if (os_1.default.platform() === "win32") {
        exe = ".exe";
    }
    const opts = {};
    if (envPath && os_1.default.platform() === "win32") {
        const _path = process.env["Path"].split(";");
        _path.unshift(envPath);
        opts.env = Object.assign({
            "Path": _path.join(path_1.default.delimiter)
        });
    }
    const spawnResult = (0, child_process_1.spawnSync)(toolName + exe, ["--version"], opts);
    if (spawnResult.status !== 0)
        return null;
    const result = spawnResult.stdout.toString("utf-8").trim();
    let [cli, name, version] = result.split(" ");
    if (cli && cli.trim().length === 0)
        cli = null;
    if (version)
        version = version.trim();
    if (version && version.trim().length === 0)
        version = null;
    if (name) {
        let _name = name.split("PostgreSQL");
        if (_name.length !== 2 || _name[0] !== '(' || _name[1] !== ')')
            name = null;
        else
            name = "PostgreSQL";
    }
    if (name && name.trim().length === 0)
        name = null;
    const detection = {
        get isValid() {
            return !!this.cli
                && !!this.versionNumber
                && !!this.name
                && !!this.majorVersion
                && !!this.version
                && !!this.describe
                && this.cli === toolName.toLowerCase();
        }
    };
    detection.version = version;
    detection.versionNumber = Number(version);
    detection.majorVersion = Math.trunc(detection.versionNumber);
    detection.minorVersion = Number((detection.version || "").split(".")[1]);
    detection.describe = result;
    detection.name = name;
    detection.cli = cli;
    if (Number.isNaN(detection.minorVersion))
        detection.minorVersion = null;
    if (Number.isNaN(detection.majorVersion))
        detection.majorVersion = null;
    if (Number.isNaN(detection.versionNumber))
        detection.versionNumber = null;
    if (detection.isValid && !detection.minorVersion)
        detection.minorVersion = 0;
    detection.versionName = result;
    return detection;
}
exports.postgresToolVersion = postgresToolVersion;
//# sourceMappingURL=version.js.map