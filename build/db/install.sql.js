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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserDatabase = void 0;
const escape = __importStar(require("pg-escape"));
function createUserDatabase(args, opts) {
    if (!opts)
        opts = {
            create: true,
            force: false
        };
    let dbUser = escape.ident(args.dbUser);
    let dbUserClone = escape.ident(args.dbUserClone);
    let dbName = escape.ident(args.dbName);
    let lName = escape.literal(args.dbName);
    let _w = escape.literal(args.dbPasswordClone);
    let commands = [];
    if (opts.force) {
        //language=PostgreSQL
        commands.push(`select pg_terminate_backend( pg_stat_activity.pid ) from pg_stat_activity where pg_stat_activity.datname = ${lName} and pid != pg_backend_pid()`, `drop database if exists ${dbName}`, `drop user if exists ${dbUser}`, `drop user if exists ${dbUserClone}`);
    }
    //language=PostgreSQL
    commands.push(`create user ${dbUser} with password ${escape.literal(args.dbPassword)}`, `create user ${dbUserClone} with superuser password ${_w}`, `create database ${dbName} with owner ${dbUser}`, `alter user ${dbUser} set search_path to tweeks, public, opr`, `alter user ${dbUserClone} set search_path to tweeks, public, opr`, `alter user ${dbUser} set timezone to 'Africa/Sao_Tome'`, `alter user ${dbUserClone} set timezone to 'Africa/Sao_Tome'`);
    return commands;
}
exports.createUserDatabase = createUserDatabase;
//# sourceMappingURL=install.sql.js.map