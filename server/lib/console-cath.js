"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.capture = void 0;
const moment_1 = __importDefault(require("moment"));
const _defaultConsole = console;
exports.capture = (new class ConsoleManage {
    constructor() {
        this._terminal = true;
        this._logCatch = [];
        this._replay = [];
        const self = this;
        let prints = {};
        const _term = new Proxy(console, {
            get(target, p, receiver) {
                if (self.terminal)
                    return target[p];
                else
                    return () => { };
            }
        });
        console = new Proxy(console, {
            get(target, p, receiver) {
                let level = p;
                if (typeof _term[level] !== "function")
                    return _term[level];
                let skips = ["Console"];
                if (skips.includes(level))
                    return _term[level];
                if (!prints[level])
                    prints[level] = (...args) => {
                        _term[level](...args);
                        skips = ["clear"];
                        if (skips.includes(level))
                            return;
                        self.notifyLogs(level, ...args);
                    };
                return prints[level];
            }
        });
    }
    get terminal() { return this._terminal; }
    ;
    set terminal(value) { this._terminal = value; }
    get defaults() { return _defaultConsole; }
    register(logCatch) {
        this.__register(logCatch, this._logCatch);
    }
    replay(replay) {
        this.__register(replay, this._replay);
    }
    __register(logCatch, registry) {
        let _logCatch;
        if (!logCatch)
            throw new Error("Console log catch node defined!");
        if (typeof logCatch === "function")
            _logCatch = logCatch;
        else if (typeof logCatch === "object")
            _logCatch = opts => logCatch;
        else
            throw new Error(`Invalid log catch typeof: ${typeof logCatch} not function or console.Console instance!`);
        registry.push(_logCatch);
    }
    notifyLogs(level, ...args) {
        const instant = new Date();
        const moment = (0, moment_1.default)(instant);
        let opts = {
            level,
            instant,
            moment
        };
        function asConsole(_console) {
            if (!_console)
                return [];
            if (!Array.isArray(_console))
                return [_console];
            else
                return _console;
        }
        //Replay to another console
        this._replay.forEach((next) => {
            asConsole(next(opts)).forEach(iConsole => {
                iConsole[level](...args);
            });
        });
        //Registry logs
        this._logCatch.forEach((next) => {
            asConsole(next(opts)).forEach(iConsole => {
                iConsole.log(`[${String(level)}:${moment.toISOString()}]`);
                iConsole[level](...args);
            });
        });
    }
});
//# sourceMappingURL=console-cath.js.map