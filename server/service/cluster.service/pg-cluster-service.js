"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentCluster = exports.pgClusterService = void 0;
const psql_service_1 = require("../../lib/cluster/services/psql-service");
const database_service_1 = require("../database.service");
exports.pgClusterService = new psql_service_1.PostgresClusterService(database_service_1.replicateFactory, database_service_1.factory);
function currentCluster() {
    return exports.pgClusterService.localCluster();
}
exports.currentCluster = currentCluster;
//# sourceMappingURL=pg-cluster-service.js.map