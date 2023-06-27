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
exports.execBlock = exports.execFileBackground = exports.execFilePain = exports.execFileElevate = exports.createBlock = exports.declareBlock = exports.createTempScript = exports.asMode = exports.declareScript = exports.DEFAULT_SHELL = void 0;
const child_process_1 = require("child_process");
const tmp_1 = __importDefault(require("tmp"));
const fs_1 = __importDefault(require("fs"));
const path = __importStar(require("path"));
const escapes_1 = require("../escapes");
exports.DEFAULT_SHELL = "powershell.exe";
function declareScript(declare, args, opts) {
    args = args || [];
    args.forEach((value, index) => {
        args[index] = (0, escapes_1.escapeSpaceQuotes)(value);
    });
    let argv0 = args.join(" ");
    return `
        @echo off
        rm -r -f ${declare.dirname};
        rem elevate mode rum ${declare.file}
        ${ /*setEnvs( opts )*/""}
        cd /D ${(0, escapes_1.escapeSpaceQuotes)(opts.cwd || process.cwd())}
        call ${(0, escapes_1.escapeSpaceQuotes)(declare.file)} ${argv0}
    `.replace(/ {8}/g, "");
}
exports.declareScript = declareScript;
function setEnvs(opts) {
    if (!opts)
        return "";
    const envs = opts["env"];
    if (!envs)
        return "";
    if (typeof envs !== "object")
        throw new Error("Envs is not object");
    let envsLines = [];
    Object.keys(envs).forEach(key => {
        envsLines.push(`set ${key}=${(0, escapes_1.escapeSpaceQuotes)(envs[key])}`);
    });
    delete opts["env"];
    return envsLines.join("\n");
}
function setVars(opts) {
    if (!opts)
        return "";
    const vars = opts.vars;
    if (!vars)
        return "";
    if (typeof vars !== "object")
        throw new Error("Envs is not object");
    let envsLines = [];
    Object.keys(vars).forEach(key => {
        envsLines.push(`\$\{${key}\}=${(0, escapes_1.escapeSpaceQuotes)(vars[key])}`);
    });
    delete opts.vars;
    return envsLines.join("\n");
}
function asMode(mode) {
    let _mode = {
        mode: [],
        shell: exports.DEFAULT_SHELL
    };
    if (typeof mode === "string")
        _mode.mode.push(mode);
    else if (mode && Array.isArray(mode))
        _mode.mode.push(...mode);
    else if (mode && !Array.isArray(mode))
        Object.assign(_mode, mode);
    return _mode;
}
exports.asMode = asMode;
function createTempScript(file, args, mode, opts) {
    opts = opts || {};
    const _mode = asMode(mode);
    let dir = tmp_1.default.dirSync({ prefix: "rum-mode", postfix: `${_mode.mode.join("_")}` });
    let script = path.join(dir.name, `mode-${_mode.mode.join("_")}.bat`);
    let logfile = path.join(dir.name, `mode-${_mode.mode.join("_")}.bat.log`);
    const dirname = dir.name;
    //language=file-reference
    fs_1.default.writeFileSync(script, declareScript(Object.assign({ file, dirname, script }), args, opts));
    return {
        dirname,
        script,
        logfile,
        clean: () => {
            fs_1.default.rmSync(dir.name, { recursive: true });
        }
    };
}
exports.createTempScript = createTempScript;
function declareBlock(opts, ...block) {
    let lines = [];
    const _asLine = (strs) => {
        if (!strs)
            return null;
        if (strs.find(value => !value))
            return null;
        if (strs.find(value => !["number", "string", "boolean"].includes(typeof value)))
            return null;
        return strs.map((value, index) => index === 0 ? value : (0, escapes_1.escapeSpaceQuotes)(value)).join(" ");
    };
    block.forEach((value, index) => {
        let _line = null;
        if (["number", "string", "boolean"].includes(typeof value))
            _line = value.toString();
        else if (Array.isArray(value))
            _line = _asLine(value);
        if (_line === null)
            throw new Error(`Invalid args in block detected at index: ${index} line: ${index + 1}`);
        if (_line.length > 0)
            lines.push(_line);
    });
    let _line = lines.join("\n").trim();
    if (!_line.length)
        lines.push(exports.DEFAULT_SHELL);
    lines.unshift("@echo off", setEnvs(opts));
    _line = lines.join("\n").trim();
    return _line;
}
exports.declareBlock = declareBlock;
function createBlock(mode, opts, ...block) {
    const temp = tmp_1.default.dirSync({ prefix: "maguita", postfix: `${mode}` });
    let script = path.join(temp.name, `mode-${mode}.bat`);
    let logfile = path.join(temp.name, `mode-${mode}.bat.log`);
    const dirname = temp.name;
    //language=file-reference
    fs_1.default.writeFileSync(script, declareBlock(opts, ...block));
    return {
        dirname,
        script,
        logfile,
        clean: () => {
            fs_1.default.rmSync(dirname, { recursive: true });
        }
    };
}
exports.createBlock = createBlock;
function startProcess(script, opts, mode, tempScript) {
    const _mode = asMode(mode);
    opts = opts || {};
    const args = [];
    args.push('Start-Process');
    args.push('-FilePath');
    args.push((0, escapes_1.escapeSpaceQuotes)(script));
    if (!_mode.mode.includes("noWait"))
        args.push('-Wait');
    if (_mode.mode.includes("elevate"))
        args.push('-Verb runAs');
    if (_mode.mode.includes("background"))
        args.push('-WindowStyle hidden');
    let shell = _mode.shell || exports.DEFAULT_SHELL;
    console.log(shell, args.join(" "));
    console.log(fs_1.default.readFileSync(script).toString("utf-8"));
    if (opts.detached && !opts.shell)
        opts.shell = true;
    const child = (0, child_process_1.spawn)(shell, args, opts);
    let stdout = "";
    let stderr = "";
    let error;
    child.on("error", err => {
        error = err;
    });
    child.stdout.on("data", chunk => stdout += chunk);
    child.stderr.on("data", chunk => stderr += chunk);
    child.on("close", (code, signal) => {
        // tempScript.clean();
    });
    return child;
}
function execFileElevate(file, args, opts) {
    const temp = createTempScript(file, args, "elevate", opts);
    return startProcess(temp.script, opts, "elevate", temp);
}
exports.execFileElevate = execFileElevate;
function execFilePain(file, args, opts, modes) {
    const temp = createTempScript(file, args, modes, opts);
    return startProcess(temp.script, opts, modes, temp);
}
exports.execFilePain = execFilePain;
function execFileBackground(file, args, opts) {
    const temp = createTempScript(file, args, "background", opts);
    return startProcess(temp.script, opts, "background", temp);
}
exports.execFileBackground = execFileBackground;
function execBlock(mode, opts, ...block) {
    const temp = createBlock(mode, opts, ...block);
    return startProcess(temp.script, opts, mode, temp);
}
exports.execBlock = execBlock;
//# sourceMappingURL=win32.js.map