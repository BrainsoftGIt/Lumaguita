"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const tsc = (cwd) => {
    var _a, _b, _c, _d;
    console.log("[TSC] start...", cwd);
    const _tsc = (0, child_process_1.spawnSync)("tsc", { cwd: cwd, shell: "cmd" });
    if (_tsc.error)
        console.log(_tsc.error);
    if ((_b = (_a = _tsc.stdout) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a, "utf-8"))
        console.log(_tsc.stdout.toString("utf-8"));
    if ((_d = (_c = _tsc.stderr) === null || _c === void 0 ? void 0 : _c.toString) === null || _d === void 0 ? void 0 : _d.call(_c, "utf-8"))
        console.log(_tsc.stderr.toString("utf-8"));
    console.log("[TSC] start... [END]");
};
tsc("C:\\var\\workspace\\maguita\\maguita-cluster");
//# sourceMappingURL=sample2.js.map