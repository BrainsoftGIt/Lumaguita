"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.psql_sync = exports.psql = void 0;
const index_1 = require("./index");
function psql(args, opts, pgexeOpts) {
    return (0, index_1.postgresqlExecute)("psql", args, opts, pgexeOpts);
}
exports.psql = psql;
function psql_sync(args, opts, pgexeOpts) {
    return (0, index_1.postgresqlExecuteSync)("psql", args, opts, pgexeOpts);
}
exports.psql_sync = psql_sync;
//# sourceMappingURL=psql.js.map