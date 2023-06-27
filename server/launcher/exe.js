#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('source-map-support').install();
const path_1 = __importDefault(require("path"));
//language=file-reference
let win32Launcher = path_1.default.join(__dirname, "../launcher/win32.js");
require(win32Launcher);
//# sourceMappingURL=exe.js.map