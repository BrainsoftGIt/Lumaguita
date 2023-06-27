"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkedSpawn = void 0;
const child_process_1 = require("child_process");
function linkedSpawn(command, spawnArgs, opts) {
    let _callbacks = [];
    let linkSpawn = (callback) => {
        _callbacks.push(callback);
        return { linkSpawn };
    };
    const _process = (command, args, procOpt) => {
        if (!args)
            args = [];
        if (!procOpt)
            procOpt = {};
        if (opts.pipeConsole)
            console.log(command, args.join(" "));
        const child = (0, child_process_1.spawn)(command, args, opts);
        let outs = "";
        let errs = "";
        let error;
        child.stdout.on("data", chunk => {
            outs += chunk;
            if (opts.pipeConsole)
                console.log(chunk + "");
        });
        child.stderr.on("data", chunk => {
            errs += chunk;
            if (opts.pipeConsole)
                console.error(chunk + "");
        });
        child.on("error", err => {
            console.error(err);
            error = err;
        });
        child.on("exit", (code, signal) => {
            let _continue = _callbacks.shift();
            if (_continue) {
                const nChild = _continue(code, signal, error, errs, outs, procOpt);
                if (!nChild)
                    return;
                if (!nChild.length)
                    return;
                let _command, _args, _opts, _useOpts, _mode;
                if (Array.isArray(nChild)) {
                    [_command, _args, _opts, _mode] = nChild;
                }
                else if (typeof nChild === "string") {
                    _command = nChild;
                    _opts = opts;
                }
                if (!(_command === null || _command === void 0 ? void 0 : _command.length))
                    return;
                if (!!_mode && _mode === "use" && _opts)
                    _useOpts = _opts;
                else if (!!_opts && _mode === "include" && _opts)
                    _useOpts = Object.assign(Object.assign({}, opts), _opts);
                else if (!!_opts && _mode === "include-reverse" && _opts)
                    _useOpts = Object.assign(Object.assign({}, _opts), opts);
                else if (_mode === "no-opts" && _opts)
                    _useOpts = null;
                else
                    _useOpts = opts;
                if (_args && typeof _args === "string")
                    _args = [_args];
                _process(_command, _args, _useOpts);
            }
            linkSpawn = () => {
                throw new Error("Next has end!");
            };
        });
    };
    setTimeout(() => { _process(command, spawnArgs, opts); });
    return { linkSpawn };
}
exports.linkedSpawn = linkedSpawn;
//# sourceMappingURL=linked-spawn.js.map