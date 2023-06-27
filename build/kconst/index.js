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
exports.K = exports.kconst = exports.targets = void 0;
require('source-map-support').install();
const arguments_1 = require("zoo.util/lib/arguments");
const os = __importStar(require("os"));
const kconst_1 = require("kconst");
const path_1 = __importDefault(require("path"));
const args = new arguments_1.Arguments(true);
args.argument = { name: "user", alias: "u", value: os.userInfo().username, type: String };
args.argument = { name: "mode", alias: "m" };
const { user, mode } = args.values;
exports.targets = {};
exports.kconst = new kconst_1.KConst({
    root: __dirname,
    user: user,
    mode: mode,
    name: "K",
    targets: "targets",
    triggers: "triggers",
    exports: "exports",
    events: "events",
    priorityOrder: [kconst_1.SelectorItem.DEFAULT, kconst_1.SelectorItem.USER, kconst_1.SelectorItem.MODE, kconst_1.SelectorItem.MODE_USER]
});
exports.K = exports.kconst.K;
exports.kconst.collectCallbacks();
const _targets = exports.targets;
const _kconst = exports.kconst;
let _use_targets = {};
exports.kconst.target(target => {
    //language=file-reference
    _use_targets.info = target.nodeJs({ className: "INFO", typescript: true, dir: path_1.default.join(__dirname, "autogen"), });
});
exports.kconst.declares((exports, override, SELF_NAME, props) => {
    props.override(() => {
        _kconst.K["_KCONST_BUILD_USER_USING775533"] = user;
        exports(_use_targets.info);
        _kconst.K["_KCONST_BUILD_MODE_USING775533"] = mode;
        exports(_use_targets.info);
    });
});
exports.kconst.startDeclarations();
exports.kconst.publish();
console.log("user:", user);
console.log("mode:", mode);
//# sourceMappingURL=index.js.map