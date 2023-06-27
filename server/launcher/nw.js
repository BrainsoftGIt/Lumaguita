"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const args_1 = require("../global/args");
const pid_1 = require("../global/pid");
const status_1 = require("./status");
(0, pid_1.showUncaughtError)();
(0, pid_1.captureEventsExits)();
status_1.launcherStatus.launcherName = __filename;
status_1.launcherStatus.launcher = "nw.ts";
args_1.args.appMode = "public";
args_1.args.appWithNodeWebKit = true;
if (!args_1.args.dbMode)
    args_1.args.dbMode = "app";
require('../main');
//# sourceMappingURL=nw.js.map