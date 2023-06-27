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
Object.defineProperty(exports, "__esModule", { value: true });
exports.win32TempScriptEngine = exports.Win32DefinePath = exports.Win32DefineEnv = exports.Win32DefineCommand = void 0;
const index_1 = require("./index");
const escapes_1 = require("../../escapes");
const Path = __importStar(require("path"));
class Win32DefineCommand extends index_1.DefineCommand {
    constructor(command, ...args) { super(command, ...args); }
    get define() {
        let define = "";
        define += `${this.command}`;
        if (this.args.length)
            define += ` ${this.args.map(value => (0, escapes_1.escapeSpaceQuotes)(value)).join(" ")}`;
        return define;
    }
}
exports.Win32DefineCommand = Win32DefineCommand;
class Win32DefineEnv extends index_1.DefineEnv {
    constructor(key, value) { super(key, value); }
    get define() {
        return `set ${this.key}=${(0, escapes_1.escapeSpaceQuotes)(this.value)}`;
    }
}
exports.Win32DefineEnv = Win32DefineEnv;
class Win32DefinePath extends index_1.DefinePath {
    constructor(path, mode) { super(path, mode); }
    get define() {
        let define = "";
        if (this.mode === "before")
            define += `set PATH=${(0, escapes_1.escapeSpaceQuotes)(this.path)}${Path.delimiter}%PATH%`;
        else
            define += `set PATH="%PATH%${Path.delimiter}${(0, escapes_1.escapeSpaceQuotes)(this.path)}"`;
        return define;
    }
}
exports.Win32DefinePath = Win32DefinePath;
// const envEngine: = { class: Win32DefineEnv, instance:(key, value) => new Win32DefineEnv( key, value ) };
exports.win32TempScriptEngine = {
    command: { instance(command, ...args) { return new Win32DefineCommand(command, ...args); } },
    env: { instance(key, value) { return new Win32DefineEnv(key, value); } },
    path: { instance(key, value) { return new Win32DefinePath(key, value); } },
    extension: ".cmd",
    unlinkFile(path) {
        return `rm ${path}`;
    }
};
//# sourceMappingURL=win32.engine.js.map