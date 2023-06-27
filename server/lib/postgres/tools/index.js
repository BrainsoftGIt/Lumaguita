"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresqlExecute = exports.postgresqlExecuteSync = exports.postgresqlPrepare = exports.postgresArgsPrepare = exports.postgresOptsPrepare = void 0;
const child_process_1 = require("child_process");
function postgresOptsPrepare(opts) {
    if (!opts)
        opts = {};
    const __opts = {};
    if ((opts === null || opts === void 0 ? void 0 : opts.env) && typeof opts.env === "object" && Object.keys(opts.env).length > 0)
        __opts["env"] = opts.env;
    return __opts;
}
exports.postgresOptsPrepare = postgresOptsPrepare;
const typePrefix = {
    alias: "-",
    name: "--"
};
function postgresArgsPrepare(args, argsConfigs, ..._args) {
    if (!args)
        args = {};
    if (!argsConfigs)
        argsConfigs = {};
    Object.keys(args).forEach(key => {
        var _a;
        let name;
        let type = (_a = argsConfigs[key]) === null || _a === void 0 ? void 0 : _a.prefix;
        if (!type && key && key.length === 1)
            type = 'alias';
        else if (!type && key && key.length > 1)
            type = 'name';
        else if (!type || !key)
            throw new Error(`Invalid key options key-name ${key}, type: ${type}`);
        name = `${typePrefix[type]}${key}`;
        let value = args[key];
        if (value === undefined)
            throw new Error(`Invalid arguments ${key} is undefined!`);
        if (value === null)
            throw new Error(`Invalid arguments ${key} is null!`);
        if (typeof value === "string")
            _args.push(name, value);
        else if (typeof value === "number")
            _args.push(name, String(value));
        else if (typeof value === "boolean")
            _args.push(name);
        else if (typeof value === "object" && Array.isArray(value)) {
            value.forEach((next) => {
                if (next === undefined || next === null)
                    throw new Error(`Invalid arguments ${key} is undefined!`);
                if (typeof next === "string")
                    _args.push(name, next);
                if (typeof next === "number")
                    _args.push(name, String(next));
                else if (typeof value === "boolean")
                    _args.push(name);
                else
                    throw new Error(`invalid value for multiple ${key}: ${typeof next} ${next} `);
            });
        }
        else
            throw new Error(`invalid value for ${key}: ${typeof value} ${value} `);
    });
    return _args;
}
exports.postgresArgsPrepare = postgresArgsPrepare;
function postgresqlPrepare(args, opts, argsConfigs) {
    const _opts = postgresOptsPrepare(opts);
    const _args = postgresArgsPrepare(args, argsConfigs);
    return { opts: _opts, args: _args };
}
exports.postgresqlPrepare = postgresqlPrepare;
function postgresqlExecuteSync(command, args, opts, pgexeOpts) {
    if (!pgexeOpts)
        pgexeOpts = {};
    const prepare = postgresqlPrepare(args, opts, pgexeOpts.args);
    if (pgexeOpts.debug)
        console.log(command, prepare.args.join(" "));
    return (0, child_process_1.spawnSync)(command, prepare.args, prepare.opts);
}
exports.postgresqlExecuteSync = postgresqlExecuteSync;
function postgresqlExecute(command, args, opts, pgexeOpts) {
    if (!pgexeOpts)
        pgexeOpts = {};
    const prepare = postgresqlPrepare(args, opts, pgexeOpts.args);
    if (pgexeOpts.debug)
        console.log(command, prepare.args.join(" "));
    return (0, child_process_1.spawn)(command, prepare.args, prepare.opts);
}
exports.postgresqlExecute = postgresqlExecute;
//# sourceMappingURL=index.js.map