"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hideArgs = exports.args = exports.describeArgs = exports.lineDefiner = exports.lineHidden = exports.lineArgs = exports.onPrepareArgs = void 0;
const arguments_1 = require("zoo.util/lib/arguments");
const file_util_1 = require("zoo.util/lib/file-util");
const defaults_1 = require("../defaults");
const preparatory = [];
function onPrepareArgs(fn) {
    preparatory.push(fn);
}
exports.onPrepareArgs = onPrepareArgs;
exports.lineArgs = new arguments_1.Arguments(true);
exports.lineHidden = new arguments_1.Arguments(true);
function lineDefiner(configs) {
    const resolve = (line, name, type, args) => {
        if (!args)
            args = {};
        line.define({ name, type, value: process.env[name] || (configs === null || configs === void 0 ? void 0 : configs[args === null || args === void 0 ? void 0 : args.conf]) || defaults_1.DEFAULTS[args === null || args === void 0 ? void 0 : args.def] || (args === null || args === void 0 ? void 0 : args.val), alias: args === null || args === void 0 ? void 0 : args.alias });
    };
    let __args;
    return {
        define(name, type, args) {
            resolve(exports.lineArgs, name, type, args);
        }, hide(name, type, args) {
            if (!args)
                args = {};
            resolve(exports.lineArgs, name, type, args);
            resolve(exports.lineHidden, name, type, args);
        }
    };
}
exports.lineDefiner = lineDefiner;
function describeArgs() {
    const __hides = Object.keys(exports.hideArgs);
    let __describe = [];
    Object.keys(exports.args).forEach(name => {
        if (__hides.includes(name))
            return;
        __describe.push({
            name: name,
            value: exports.args[name],
            type: typeof exports.args[name]
        });
    });
    console.table(__describe);
}
exports.describeArgs = describeArgs;
file_util_1.FileUtil.loadAllFiles(__dirname, /.*args.js$/, deps => {
    console.log("[maguita] Definer>", deps.path);
    require(deps.path);
}, { recursive: true });
exports.args = exports.lineArgs.values;
exports.hideArgs = exports.lineHidden.values;
preparatory.forEach(prepare => {
    prepare(exports.args);
});
//# sourceMappingURL=index.js.map