"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const args_1 = require("../global/args");
const pid_1 = require("../global/pid");
const status_1 = require("./status");
const status_2 = require("../../client/app/status");
(0, pid_1.showUncaughtError)();
(0, pid_1.captureEventsExits)();
status_1.launcherStatus.launcherName = __filename;
status_1.launcherStatus.launcher = "exe.ts";
if (args_1.args.appWithNodeWebKit) {
    status_2.nwAppStatus.runningIntoNW = true;
}
args_1.args.appMode = "public";
args_1.args.app = "LUMA";
if (!args_1.args.dbMode)
    args_1.args.dbMode = "app";
require('../main');
//# sourceMappingURL=win32.js.map