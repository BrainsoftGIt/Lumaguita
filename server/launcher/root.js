#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const status_1 = require("./status");
status_1.launcherStatus.launcherName = __filename;
status_1.launcherStatus.launcher = "root.ts";
const pid_1 = require("../global/pid");
require('source-map-support').install();
const args_1 = require("../global/args");
(0, pid_1.showUncaughtError)();
(0, pid_1.captureEventsExits)();
status_1.launcherStatus.launcher = "root.ts";
args_1.args.appSelfMaster = true;
if (!args_1.args.dbMode)
    args_1.args.dbMode = "system";
setTimeout(() => {
    require('../main');
}, 2 * 1000);
//# sourceMappingURL=root.js.map