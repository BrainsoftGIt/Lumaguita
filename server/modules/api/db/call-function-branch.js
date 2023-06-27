"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functLoadAllMenus = exports.functLoadPaths = exports.functLoadBranch = exports.functSetBranch = void 0;
const zoo_pg_1 = require("zoo.pg");
const database_service_1 = require("../../../service/database.service");
const args_1 = require("../../../global/args");
function functSetBranch(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.main( 'tweeks.funct_sets_branch', ${paramn}, ${args_1.args.appMode})`);
}
exports.functSetBranch = functSetBranch;
function functLoadBranch(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'tweeks.funct_load_branch', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.functLoadBranch = functLoadBranch;
function functLoadPaths(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'cluster.load_paths', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.functLoadPaths = functLoadPaths;
function functLoadAllMenus(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'auth.funct_load_menu', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.functLoadAllMenus = functLoadAllMenus;
//# sourceMappingURL=call-function-branch.js.map