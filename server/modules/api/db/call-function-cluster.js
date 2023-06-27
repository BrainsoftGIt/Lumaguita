"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functLoadClusters = exports.functChangeClusterLicense = exports.functUnlinkAndLiknk = exports.functRegCluster = void 0;
const zoo_pg_1 = require("zoo.pg");
const database_service_1 = require("../../../service/database.service");
const args_1 = require("../../../global/args");
function functRegCluster(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.main( 'cluster.sets_clusters_admin', ${paramn}, ${args_1.args.appMode})`);
}
exports.functRegCluster = functRegCluster;
function functUnlinkAndLiknk(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.main( 'cluster.unlink_cluster', ${zoo_pg_1.Types.jsonb(paramn)}, ${args_1.args.appMode})`);
}
exports.functUnlinkAndLiknk = functUnlinkAndLiknk;
function functChangeClusterLicense(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchLast)(sql `select * from tweeks.main( 'cluster.sets_cluster_license', ${zoo_pg_1.Types.jsonb(paramn)}, ${args_1.args.appMode})`);
}
exports.functChangeClusterLicense = functChangeClusterLicense;
function functLoadClusters(paramn) {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    return (0, zoo_pg_1.catchAll)(sql `select * from tweeks.main( 'cluster.load_clusters', ${paramn}, ${args_1.args.appMode}) data`);
}
exports.functLoadClusters = functLoadClusters;
//# sourceMappingURL=call-function-cluster.js.map