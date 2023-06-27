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
exports.pgctlStatus = void 0;
const pg_ctl_1 = require("../pg-ctl");
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const listen_1 = require("../../utils/process/listen");
function pgctlStatus(dataDir) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const exists = fs_1.default.existsSync(dataDir);
        if (!exists) {
            return resolve(pg_ctl_1.PGClusterStatus.DIR_NOT_EXISTS);
        }
        const pgCtl = (0, child_process_1.spawn)("pg_ctl", [
            "status",
            "-D", dataDir
        ]);
        // code: 4,  message: '', err: 'pg_ctl: directory "C:/var/pgdata" is not a database cluster directory\r\n'
        // code: 4, message: '', err: 'pg_ctl: directory "C:/var/pgdata/Data 993" does not exist\r\n'
        // code: 3, message: 'pg_ctl: no server running\r\n', err: ''
        // code: 0, err: ''
        // message: 'pg_ctl: server is running (PID: 9600)\r\n' +
        //   'C:/Program Files/PostgreSQL/13/bin/postgres.exe "-D" "Data 002"\r\n',
        (0, listen_1.processListen)(pgCtl).then(value => {
            let code = value.code;
            let message = value.stdout;
            if (code === 0)
                return resolve(pg_ctl_1.PGClusterStatus.CLUSTER_RUNNING);
            else if (code === 3)
                return resolve(pg_ctl_1.PGClusterStatus.CLUSTER_STOPPED);
            else if (code === 4) {
                if (message.includes("is not a database cluster directory"))
                    return resolve(pg_ctl_1.PGClusterStatus.DIR_NOT_DATABASE_CLUSTER);
                if (message.includes("does not exist"))
                    return resolve(pg_ctl_1.PGClusterStatus.DIR_NOT_EXISTS);
            }
        }).catch(reason => {
            console.error(reason);
        });
    }));
}
exports.pgctlStatus = pgctlStatus;
//# sourceMappingURL=pgctl-status.js.map