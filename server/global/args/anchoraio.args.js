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
const srv_1 = require("../autogen/config/srv");
const index_1 = require("./index");
const Path = __importStar(require("path"));
const project_1 = require("../project");
const fs_1 = __importDefault(require("fs"));
const { define, hide } = (0, index_1.lineDefiner)(Object.assign({}, srv_1.srv.SERVER.SESSION, { PORT: srv_1.srv.SERVER.PORT }));
let aio;
if (process.env["AIO"] && fs_1.default.existsSync(process.env["AIO"]))
    aio = process.env["AIO"];
else if (fs_1.default.existsSync(Path.join(project_1.folders.snapshot, "../anchorio")))
    aio = Path.join(project_1.folders.snapshot, "../anchorio");
else if (fs_1.default.existsSync(Path.join(project_1.folders.snapshot, "../aio")))
    aio = Path.join(project_1.folders.snapshot, "../aio");
define("aio", String, { val: aio });
define("aioConfigFile", String, {});
//# sourceMappingURL=anchoraio.args.js.map