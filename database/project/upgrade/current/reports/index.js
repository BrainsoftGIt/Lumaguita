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
exports.scripts = void 0;
//language=file-reference
const Path = __importStar(require("path"));
const file_util_1 = require("zoo.util/lib/file-util");
const fs_1 = __importDefault(require("fs"));
const args_1 = require("../../../../../server/global/args");
exports.scripts = [
    "./engines/_base.engine.sql",
    "./engines/prepare.engine.sql",
    "./engines/report.engine.sql",
    "./engines/x3.engine.sql",
].map(value => Path.join(__dirname, value));
//language=file-reference
file_util_1.FileUtil.scanFiles(Path.join(__dirname, "templates"), /(^)*.sql$/, path => {
    exports.scripts.push(path.path);
}, { recursive: true });
//language=file-reference
file_util_1.FileUtil.scanFiles(Path.join(__dirname, "sources"), /(^)*.sql$/, path => {
    exports.scripts.push(path.path);
}, { recursive: true });
let stream = fs_1.default.createWriteStream(Path.join(__dirname, "index.bat"));
stream.write(`SET PGHOST=${args_1.args.dbHost || "127.0.0.1"}\r\n`);
stream.write(`SET PGPORT=${args_1.args.dbPort || 5432}\r\n`);
stream.write(`SET PGUSER=${args_1.args.dbUser || "postgres"}\r\n`);
stream.write(`SET PGPASSWORD=${args_1.args.dbPassword}\r\n`);
stream.write(`SET PGDATABASE=${args_1.args.dbName || "postgres"}\r\n`);
stream.write(`\r\n`);
exports.scripts.forEach(value => {
    stream.write(`psql -f "${value}" \n`);
});
stream.end();
//# sourceMappingURL=index.js.map