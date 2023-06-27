"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
if (os_1.default.platform() !== "win32") {
    const child_process = require("child_process");
    const original = Object.assign(Object.assign({}, child_process));
    let func = ["spawn", "spawnSync", "exec", "execSync"];
    func.forEach(funcName => {
        child_process[funcName] = (command, args, opts) => {
            let optArgs = false;
            if (args && !Array.isArray(args)) {
                opts = args;
                args = [];
                optArgs = true;
            }
            if (opts && typeof opts === "object" && opts.env) {
                opts.env = Object.assign({}, process.env, opts.env);
            }
            if (optArgs) {
                args = opts;
                opts = undefined;
            }
            if (command && args && opts)
                return original[funcName](command, args, opts);
            else if (command && args)
                return original[funcName](command, args);
            else
                return original[funcName](command);
        };
    });
}
//# sourceMappingURL=child_process_patches.js.map