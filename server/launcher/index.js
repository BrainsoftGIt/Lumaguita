#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const args_1 = require("../global/args");
const status_1 = require("./status");
require('source-map-support').install();
status_1.launcherStatus.launcherName = __filename;
status_1.launcherStatus.launcher = "index.ts";
if (!args_1.args.dbMode)
    args_1.args.dbMode = "system";
__exportStar(require("../main"), exports);
//# sourceMappingURL=index.js.map