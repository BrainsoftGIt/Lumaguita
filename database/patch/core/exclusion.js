"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exclusion = exports.currentUser = void 0;
const os_1 = __importDefault(require("os"));
const args_1 = require("../../../server/global/args");
const pg_cluster_service_1 = require("../../../server/service/cluster.service/pg-cluster-service");
exports.currentUser = os_1.default.userInfo().username;
function exclusion(exclusion) {
    return () => {
        return new Promise(resolve => {
            if (exclusion.mode && exclusion.mode.includes(args_1.args.appMode))
                return resolve(true);
            if (exclusion.user && exclusion.user.includes(exports.currentUser))
                return resolve(true);
            if (exclusion.cluster) {
                (0, pg_cluster_service_1.currentCluster)().then(value => {
                    if (exclusion.cluster.includes(value.cluster_identifier))
                        return resolve(true);
                });
            }
            if (exclusion.clusterPatch) {
                (0, pg_cluster_service_1.currentCluster)().then(value => {
                    if (exclusion.clusterPatch.includes(value.cluster_path))
                        return resolve(true);
                });
            }
            resolve(false);
        });
    };
}
exports.exclusion = exclusion;
//# sourceMappingURL=exclusion.js.map