"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pg_dump_sync = exports.pg_dump = void 0;
const index_1 = require("./index");
function pg_dump(args, opts, pgexeOpts) {
    return (0, index_1.postgresqlExecute)("pg_dump", args, opts, pgexeOpts);
}
exports.pg_dump = pg_dump;
function pg_dump_sync(args, opts, pgexeOpts) {
    return (0, index_1.postgresqlExecuteSync)("pg_dump", args, opts, pgexeOpts);
}
exports.pg_dump_sync = pg_dump_sync;
//# sourceMappingURL=pg_dump.js.map