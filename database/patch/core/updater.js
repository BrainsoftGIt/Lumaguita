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
exports.applyPatches = exports.block = exports.BK = exports.status = void 0;
const database_service_1 = require("../../../server/service/database.service");
const zoo_pg_1 = require("zoo.pg");
const promise_1 = require("../../../server/lib/utils/promise");
const pg_escape_1 = __importDefault(require("pg-escape"));
const escaped_1 = require("./escaped");
const chalk_1 = __importDefault(require("chalk"));
const Path = __importStar(require("path"));
const project_1 = require("../../../server/global/project");
const moment_1 = __importDefault(require("moment"));
exports.status = {
    blocks: []
};
exports.BK = {};
function templateOrder(str, values) {
    let result = [];
    str.forEach((next, index) => {
        result.push({ type: "t", raw: next });
        if (index < values.length)
            result.push({ type: "v", raw: values[index] });
    });
    return result;
}
function templateFormat(any) {
    if (typeof any === "string")
        return any;
    return any;
}
function templateMount(str, values, opts) {
    if (!opts)
        opts = {};
    let result = templateOrder(str, values);
    let text = result.map((value, index) => {
        if (value.type === "t")
            return value.raw;
        else
            return templateFormat(value.raw);
    }).join("");
    return { text };
}
function checkExclusion(block) {
    var _a;
    if (typeof ((_a = block === null || block === void 0 ? void 0 : block.opts) === null || _a === void 0 ? void 0 : _a.exclude) !== "function")
        return Promise.resolve(false);
    return (0, promise_1.promiseResolve)(block.opts.exclude()).then(value => {
        return Promise.resolve(value.success);
    });
}
function collect(block) {
    block.ref = `ref:${block.file}//${block.identifier}`;
    exports.status.blocks.push(block);
    return block;
}
function order() {
    let result = [];
    let blocks = exports.status.blocks.map(value => value.ref);
    let next = (ref) => {
        if (!ref)
            ref = blocks.shift();
        else {
            let index = blocks.findIndex(value => value === ref);
            if (index !== -1)
                blocks.splice(index, 1);
        }
        let block = exports.status.blocks.find(value => value.ref === ref);
        exports.status.blocks.filter(value => { var _a, _b; return ((_b = (_a = value.opts) === null || _a === void 0 ? void 0 : _a.before) === null || _b === void 0 ? void 0 : _b.ref) === ref && blocks.includes(value.ref); })
            .forEach(before => {
            next(before.ref);
        });
        if (block.opts.after && blocks.includes(block.opts.after.ref)) {
            next(block.opts.after.ref);
        }
        result.push(block);
    };
    while (blocks.length) {
        next();
    }
    return result;
}
function template(_module, opts) {
    let _opts;
    if (typeof opts === "string")
        _opts = { identifier: opts };
    else
        _opts = opts;
    return (str, ...values) => {
        var _a, _b, _c;
        let mnt = templateMount(str, values, _opts.template);
        return collect({
            class: "block",
            name: (_a = _module.exports) === null || _a === void 0 ? void 0 : _a.name,
            after: (_b = _module.exports) === null || _b === void 0 ? void 0 : _b.after,
            before: (_c = _module.exports) === null || _c === void 0 ? void 0 : _c.before,
            file: Path.relative(project_1.folders.snapshot, _module.filename),
            identifier: _opts.identifier,
            template: str,
            values: values,
            raw: mnt.text,
            parameters: mnt.parameters,
            opts: _opts
        });
    };
}
function sqlFiles(_module, opts) {
}
function block(_module, opts) {
    return {
        sql: template(_module, opts),
        sqlFiles: sqlFiles(_module, opts)
    };
}
exports.block = block;
function connection() {
    return { sql: database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED).sql };
}
function applyPatches(configs) {
    exports.status.configs = configs;
    return new Promise((resolve, reject) => {
        let revisions = order();
        exports.status.blocks.length = 0;
        require('./install').installCore(connection()).finally(() => {
            (0, promise_1.promiseResolve)(apply(revisions)).then(value => {
                resolve(value);
            });
        });
    });
}
exports.applyPatches = applyPatches;
function apply(sqlBlocks) {
    let schema = pg_escape_1.default.ident(exports.status.configs.schema);
    let _blockSuccess = exports.status.configs.onBlockSuccess;
    let _blockFailed = exports.status.configs.onBlockFailed;
    return new Promise((resolve, reject) => {
        let next = () => {
            const _next = sqlBlocks.shift();
            if (!_next)
                return resolve(true);
            checkExclusion(_next).then(value => {
                var _a, _b, _c, _d;
                if (value) {
                    console.log("[MAGUITA] Database patch>", _next.ref, chalk_1.default.yellowBright('SKIPPED'));
                    return next();
                }
                let _now = (0, moment_1.default)().toDate();
                let _start = (0, moment_1.default)(((_b = (_a = _next === null || _next === void 0 ? void 0 : _next.opts) === null || _a === void 0 ? void 0 : _a.life) === null || _b === void 0 ? void 0 : _b.start) || _now).toDate();
                let _end = (0, moment_1.default)(((_d = (_c = _next === null || _next === void 0 ? void 0 : _next.opts) === null || _c === void 0 ? void 0 : _c.life) === null || _d === void 0 ? void 0 : _d.end) || _now).toDate();
                if (_start.getTime() > _now.getTime() || _end.getTime() < _now.getTime()) {
                    console.log("[MAGUITA] Database patch>", _next.ref, chalk_1.default.yellowBright('EXPIRED'));
                    return next();
                }
                let args = {
                    file: _next.file,
                    identifier: _next.identifier,
                    raw: _next.raw,
                    flags: _next.opts.flags,
                };
                let apply = () => {
                    (0, promise_1.promiseResolve)((0, zoo_pg_1.catchLast)(connection().sql `select p.*  from ${(0, escaped_1.escapedParameter)(schema)}.revision( ${args} ) p`)).then(value => {
                        if (value.success) {
                            if (typeof _blockSuccess === "function")
                                (0, promise_1.promiseResolve)(_blockSuccess(_next, value.success))
                                    .then(() => { next(); });
                            else
                                next();
                        }
                        else if (_next.opts.ignoreError)
                            next();
                        else if (typeof _blockFailed === "function") {
                            let result = _blockFailed(_next, value.error);
                            (0, promise_1.promiseResolve)(result).then(value1 => {
                                if (!result || !value1.success)
                                    reject(value.error);
                                else
                                    next();
                            });
                        }
                        else
                            reject(value.error);
                    });
                };
                let raw = [_next.raw];
                let s = Object.assign(raw, { raw: raw });
                apply();
            });
        };
        next();
    });
}
//# sourceMappingURL=updater.js.map