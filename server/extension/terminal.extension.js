"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const args_1 = require("../global/args");
const terminal_1 = require("./ext/terminal");
args_1.lineArgs.defineCommand({ name: ["shell"], callback: terminal_1.openAppShell });
args_1.lineArgs.defineCommand({ name: ["terminal"], callback: terminal_1.openAppShell });
//# sourceMappingURL=terminal.extension.js.map