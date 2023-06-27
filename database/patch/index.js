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
exports.applyDatabasePatches = void 0;
const fs_1 = __importDefault(require("fs"));
require('source-map-support').install();
const updater_1 = require("./core/updater");
const file_util_1 = require("zoo.util/lib/file-util");
const Path = __importStar(require("path"));
const chalk_1 = __importDefault(require("chalk"));
let configs = {
    schema: "patch",
    onBlockSuccess: (block, success) => {
        console.log("[MAGUITA] Database patch>", block.ref, chalk_1.default.greenBright('OK!'));
        return Promise.resolve();
    }, onBlockFailed(block, success) {
        console.log("[MAGUITA] Database patch>", block.ref, chalk_1.default.redBright('FAILED!'));
        return Promise.resolve();
    }
};
function applyDatabasePatches() {
    file_util_1.FileUtil.scanFiles(Path.join(__dirname, /*language=file-reference*/ "revisions"), /(^)*.sql.js$/, (path) => {
        let url = path.url;
        let _ts = Path.join(Path.dirname(path.path), Path.basename(path.path, Path.extname(path.path))) + ".ts";
        if (fs_1.default.existsSync(_ts))
            url = new URL(`file:${_ts}`);
        console.log("[MAGUITA] Database patch>", url.href, "found!");
    }, { recursive: true }).forEach(path => require(path.path));
    return (0, updater_1.applyPatches)(configs);
}
exports.applyDatabasePatches = applyDatabasePatches;
//# sourceMappingURL=index.js.map