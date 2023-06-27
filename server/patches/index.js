"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchesInstall = exports.supportedOs = exports.appPatches = void 0;
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const file_util_1 = require("zoo.util/lib/file-util");
exports.appPatches = {
    installDatabaseServer() {
        return Promise.reject(new Error("Database path installer is not implemented for current os: " + os_1.default.platform()));
    }
};
exports.supportedOs = ["win32", "linux", "darwin"];
function patchesInstall() {
    //Apply global paths
    file_util_1.FileUtil.scanFiles(path_1.default.join(__dirname, "global"), /.*.js$/, _patches => {
        require(_patches.path);
    }, { recursive: true });
    if (exports.supportedOs.includes(os_1.default.platform())) {
        if (fs_1.default.existsSync(path_1.default.join(__dirname, os_1.default.platform()))) {
            file_util_1.FileUtil.scanFiles(path_1.default.join(__dirname, os_1.default.platform()), /.*.js$/, _patches => {
                require(_patches.path);
            }, { recursive: true });
        }
    }
}
exports.patchesInstall = patchesInstall;
//# sourceMappingURL=index.js.map