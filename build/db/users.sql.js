"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersSql = void 0;
const pg_escape_1 = __importDefault(require("pg-escape"));
function usersSql(args, opts) {
    let _default = pg_escape_1.default.literal(args.dbUser);
    let _clone = pg_escape_1.default.literal(args.dbUserClone);
    //language=PostgreSQL
    return [
        `truncate cluster.users`,
        `insert into cluster.users( user_default, user_replication ) values ( ${_default}::text::regrole, ${_clone}::text::regrole)`,
    ];
}
exports.usersSql = usersSql;
//# sourceMappingURL=users.sql.js.map