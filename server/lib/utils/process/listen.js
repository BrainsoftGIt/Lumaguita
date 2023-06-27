"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processListen = void 0;
const child_process_1 = require("child_process");
function processListen(child, listeners) {
    if (!listeners)
        listeners = {};
    return new Promise((resolve, reject) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        if (child instanceof child_process_1.ChildProcess) {
            console.log(child.spawnfile, ((_a = child.spawnargs) !== null && _a !== void 0 ? _a : []).join(" "));
            let stdout = "";
            let stderr = "";
            let _error;
            let messages = [];
            let outputs = [];
            (_c = (_b = child === null || child === void 0 ? void 0 : child.stdout) === null || _b === void 0 ? void 0 : _b.on) === null || _c === void 0 ? void 0 : _c.call(_b, "data", chunk => {
                if (listeners === null || listeners === void 0 ? void 0 : listeners.console)
                    console.log(chunk.toString());
                if (listeners === null || listeners === void 0 ? void 0 : listeners.stdout)
                    listeners.stdout(chunk);
                stdout += chunk;
                outputs.push(chunk.toString());
            });
            (_e = (_d = child === null || child === void 0 ? void 0 : child.stderr) === null || _d === void 0 ? void 0 : _d.on) === null || _e === void 0 ? void 0 : _e.call(_d, "data", chunk => {
                if (listeners === null || listeners === void 0 ? void 0 : listeners.console)
                    console.error(chunk.toString());
                if (listeners === null || listeners === void 0 ? void 0 : listeners.stderr)
                    listeners.stderr(chunk);
                outputs.push(chunk.toString());
                stderr += chunk;
            });
            child.on("error", err => {
                _error = err;
            });
            child.on("message", message => {
                messages.push(message);
            });
            const end = (code) => {
                return {
                    code: code,
                    stderr: stderr.length > 0 ? stderr : null,
                    stdout: stdout.length > 0 ? stderr : null,
                    messages: messages,
                    error: _error,
                    result: !_error,
                    output: outputs
                };
            };
            child.on("exit", (code, signal) => {
                if (listeners.exit)
                    listeners === null || listeners === void 0 ? void 0 : listeners.exit(code, signal);
            });
            child.on("disconnect", () => {
                if (listeners === null || listeners === void 0 ? void 0 : listeners.disconnect)
                    listeners.disconnect();
            });
            child.on("close", (code, signal) => {
                if (listeners === null || listeners === void 0 ? void 0 : listeners.close)
                    listeners.close(code, signal);
                resolve(end(code));
            });
            child.on("error", err => {
                _error = err;
                console.error(err);
            });
        }
        else {
            console.log("Listen ChildResult PID: ", child.pid);
            if (child.stdout)
                (_f = listeners === null || listeners === void 0 ? void 0 : listeners.stderr) === null || _f === void 0 ? void 0 : _f.call(listeners, child.stdout);
            if (child.stderr)
                (_g = listeners === null || listeners === void 0 ? void 0 : listeners.stdout) === null || _g === void 0 ? void 0 : _g.call(listeners, child.stderr);
            if (child.error)
                (_h = listeners === null || listeners === void 0 ? void 0 : listeners.error) === null || _h === void 0 ? void 0 : _h.call(listeners, child.error);
            if (child.output)
                (_j = listeners === null || listeners === void 0 ? void 0 : listeners.output) === null || _j === void 0 ? void 0 : _j.call(listeners, child.output);
            (_k = listeners === null || listeners === void 0 ? void 0 : listeners.exit) === null || _k === void 0 ? void 0 : _k.call(listeners, child.status, child.signal);
            (_l = listeners === null || listeners === void 0 ? void 0 : listeners.close) === null || _l === void 0 ? void 0 : _l.call(listeners, child.status, child.signal);
            resolve({
                code: child.status,
                stderr: (_o = (_m = child.stderr) === null || _m === void 0 ? void 0 : _m.toString) === null || _o === void 0 ? void 0 : _o.call(_m),
                stdout: (_q = (_p = child.stdout) === null || _p === void 0 ? void 0 : _p.toString) === null || _q === void 0 ? void 0 : _q.call(_p),
                error: child.error,
                messages: [],
                result: !child.error,
                output: child.output.map(value => { var _a; return (_a = value === null || value === void 0 ? void 0 : value.toString) === null || _a === void 0 ? void 0 : _a.call(value); })
            });
        }
    });
}
exports.processListen = processListen;
//# sourceMappingURL=listen.js.map