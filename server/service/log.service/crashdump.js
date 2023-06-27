"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crashDump = void 0;
const zip_dir_1 = __importDefault(require("zip-dir"));
const recursive_copy_1 = __importDefault(require("recursive-copy"));
const path_1 = __importDefault(require("path"));
const project_1 = require("../../global/project");
const args_1 = require("../../global/args");
const pg_recoginizer_1 = require("../../lib/postgres/pg-recoginizer");
const defaults_1 = require("../../global/defaults");
const fs_1 = __importDefault(require("fs"));
function crashDump() {
    return new Promise((resolve, reject) => {
        pg_recoginizer_1.pgServer.recognizePath(defaults_1.DEFAULTS.DB_VERSION, defaults_1.DEFAULTS.DB_VERSION_UP).then((value) => __awaiter(this, void 0, void 0, function* () {
            const { create_dump_sync } = require("../database.service/dumps");
            const temp = path_1.default.join(project_1.folders.temp, "crash-dumps", String(Math.trunc(Math.random() * 9999999)));
            yield (0, recursive_copy_1.default)(path_1.default.join(project_1.folders.logs), path_1.default.join(temp, "dist/logs"))
                .on(recursive_copy_1.default.events.COPY_FILE_START, function (copyOperation) {
                console.info(`[LOG]`, 'Copying file ' + copyOperation.src + '...');
            }).on(recursive_copy_1.default.events.COPY_FILE_COMPLETE, function (copyOperation) {
                console.info(`[LOG]`, 'Copied to ' + copyOperation.dest);
            }).on(recursive_copy_1.default.events.ERROR, function (error, copyOperation) {
                console.error(`[LOG] ` + 'Unable to copy ' + copyOperation.dest);
            });
            const database = path_1.default.join(temp, "dist", `${args_1.args.app}_${args_1.args.dbName}.base.db`);
            let dump = create_dump_sync(database);
            // console.log( dump.output.toString("utf-8") )
            // console.log( dump.stderr.toString("utf-8") );
            if (dump.error)
                console.error("error", dump.error);
            (0, zip_dir_1.default)(path_1.default.join(temp, "dist"), { saveTo: path_1.default.join(temp, "pack.zip") }, function (err, buffer) {
                if (err)
                    console.error(err);
            });
            resolve({
                zipFile: path_1.default.join(temp, "pack.zip"),
                clean() {
                    fs_1.default.rmSync(temp, { recursive: true });
                },
                logs: path_1.default.join(temp, "dist/logs"),
                database: database,
                temp
            });
        }));
    });
}
exports.crashDump = crashDump;
//# sourceMappingURL=crashdump.js.map