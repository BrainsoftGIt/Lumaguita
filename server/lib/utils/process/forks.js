"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forkListen = exports.forkEmitter = exports.isMainProcess = exports.isForkedProcess = void 0;
function isForkedProcess() {
    return process.send !== undefined;
}
exports.isForkedProcess = isForkedProcess;
function isMainProcess() {
    return !!process.send;
}
exports.isMainProcess = isMainProcess;
function forkEmitter(event, child, ...args) {
    let pack = JSON.stringify({
        event: event,
        args: [...args]
    });
    if (child)
        child.send(pack);
    else
        process.send(pack);
}
exports.forkEmitter = forkEmitter;
function forkListen(event, child, cb) {
    const listen = message => {
        try {
            let pack = JSON.parse(String(message));
            if (pack["event"] && Array.isArray(pack["args"]) && (pack["event"] === event || event === "*" || pack["event"] === "*")) {
                cb(pack["event"], ...pack["args"]);
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    if (child)
        child.on("message", listen);
    else
        process.on("message", listen);
}
exports.forkListen = forkListen;
//# sourceMappingURL=forks.js.map