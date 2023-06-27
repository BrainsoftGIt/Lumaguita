"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openAppShell = void 0;
const defaults_1 = require("../../global/defaults");
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const args_1 = require("../../global/args");
function openAppShell() {
    const { pgServer } = require("../lib/postgres/pg-recoginizer");
    pgServer.recognizePath(defaults_1.DEFAULTS.DB_VERSION, defaults_1.DEFAULTS.DB_VERSION_UP).then(value => {
        let _path = process.env["Path"].split(path_1.default.delimiter);
        //language=file-reference
        _path.unshift(path_1.default.join(__dirname, "../../bin"));
        const usePath = _path.join(path_1.default.delimiter);
        (0, child_process_1.spawn)("mg-ps.exe", [], {
            //language=file-reference
            cwd: path_1.default.join(__dirname, ".."),
            shell: true,
            detached: true,
            env: {
                "PGHOST": args_1.args.dbHost,
                "PGPASSWORD": args_1.args.dbPassword,
                "PGUSER": args_1.args.dbUser,
                "PGPORT": String(args_1.args.dbPort),
                "PGDATABASE": args_1.args.dbName,
                "Path": usePath
            }
        }).on("close", code => {
            process.exit(0);
        });
    });
}
exports.openAppShell = openAppShell;
//# sourceMappingURL=terminal.js.map