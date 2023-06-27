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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresClusterService = void 0;
const data_source_1 = require("./data-source");
class PostgresClusterService {
    constructor(factory, source) {
        this.replicate = new data_source_1.PGClusterSource(factory);
        this.source = new data_source_1.PGClusterSource(source);
    }
    switchRemoteConnection(active) {
        return this.replicate.switch_remote_connection(active).then(value => {
            var _a, _b, _c, _d, _e, _f;
            let _result = { result: ((_a = value.row) === null || _a === void 0 ? void 0 : _a.result) && ((_c = (_b = value.row) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.cluster_remote), old: ((_d = value.row) === null || _d === void 0 ? void 0 : _d.result) && ((_f = (_e = value.row) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.cluster_remote_old) };
            this.loadLocalCluster().then();
            return Promise.resolve(_result);
        }).catch(reason => Promise.resolve({ result: false, old: false }));
    }
    get currentLocalCluster() {
        return this._localCluster;
    }
    get currentMasterCluster() {
        return this._masterCluster;
    }
    privateKey() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._cluster_key)
                yield this.loadLocalCluster();
            return Promise.resolve(this._cluster_key);
        });
    }
    identifier() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._localCluster)
                yield this.loadLocalCluster();
            return Promise.resolve(this._localCluster.cluster_identifier);
        });
    }
    setsResourceDownloaded(source) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.replicate.sets_resources_downloaded(source).then(value => {
                console.log("RESOURCE MARKED AS DOWNLOADED");
            });
        });
    }
    loadResourcePendent(source) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.replicate.load_resource_pendent(source);
        });
    }
    localCluster() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._localCluster)
                yield this.loadLocalCluster();
            return Promise.resolve(this._localCluster);
        });
    }
    masterCluster() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._localCluster)
                yield this.loadMasterCluster();
            return Promise.resolve(this._masterCluster);
        });
    }
    createResource(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(this.source.create_resource(args));
        });
    }
    path() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._localCluster)
                yield this.loadLocalCluster();
            return Promise.resolve(this._localCluster.cluster_path);
        });
    }
    canAcceptClusterWithMachine(cluster) {
        return this.replicate.sets_cluster_machine_id(cluster).then(value => {
            return Promise.resolve(value.row);
        });
    }
    loadCluster(source) {
        return this.replicate._get_cluster(source).then(value => {
            return Promise.resolve(value.row);
        });
    }
    loadLocalCluster() {
        return this.replicate._get_cluster_local().then(value => {
            this._cluster_key = value.row.cluster_key;
            this._localCluster = value.row;
            delete this._localCluster["cluster_key"];
            return Promise.resolve(this._localCluster);
        });
    }
    loadMasterCluster() {
        return this.replicate._get_cluster_master().then(value => {
            this._masterCluster = value.row;
            return Promise.resolve(value.row);
        });
    }
    acceptChild(child) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.replicate._cluster_accept_child(child).then(value => {
                var _a;
                return Promise.resolve((_a = value === null || value === void 0 ? void 0 : value.row) === null || _a === void 0 ? void 0 : _a.result);
            });
        });
    }
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.replicate.status().then(value => { var _a; return Promise.resolve((_a = value === null || value === void 0 ? void 0 : value.row) === null || _a === void 0 ? void 0 : _a.status); });
        });
    }
    acceptRevision(cluster) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.replicate.accept_revision(cluster).then(value => {
                var _a;
                return Promise.resolve((_a = value === null || value === void 0 ? void 0 : value.row) === null || _a === void 0 ? void 0 : _a.status);
            }).catch(reason => {
                return Promise.resolve(reason);
            });
        });
    }
    canSendRevision(cluster) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.replicate.can_send_revision(cluster).then(value => {
                var _a;
                return Promise.resolve(!!((_a = value === null || value === void 0 ? void 0 : value.row) === null || _a === void 0 ? void 0 : _a.can_send));
            }).catch(reason => {
                return Promise.resolve(reason);
            });
        });
    }
    acceptRemoteCluster(cluster) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.replicate.accept_remote_cluster(cluster).then(value => {
                var _a;
                return Promise.resolve((_a = value === null || value === void 0 ? void 0 : value.row) === null || _a === void 0 ? void 0 : _a.status);
            });
        });
    }
    pushTo(status) {
        return this.replicate.cluster_push(status).then(objets => {
            if (objets.length === 0)
                return;
            return Promise.resolve(objets);
        });
    }
    pullFrom(revisions) {
        return this.replicate.clusterPullFrom(revisions).then(revisionObjects => Promise.resolve(revisionObjects));
    }
    marksClusterPosition(position) {
        return this.replicate.sets_cluster_tree_position(position);
    }
    updateStatusOf(result) {
        return Promise.resolve(undefined);
    }
    loadLocalAsRemoteClusters(source) {
        return this.replicate.load_clusters_local_as_remotes(source).then(value => {
            return Promise.resolve(value);
        });
    }
    loadClusterByNamespace(namespace) {
        return this.replicate.load_cluster_by_namespace(namespace).then(value => {
            return Promise.resolve(value);
        });
    }
    setsClusterConfigs(args) {
        return this.replicate.sets_cluster_configs(args).then(value => {
            return Promise.resolve(value);
        });
    }
    setsClusterRemote(args) {
        return this.replicate.sets_cluster_remote(args).then(value => {
            return Promise.resolve(value);
        });
    }
    loadClusterConfigToChild(args) {
        return this.replicate.load_clusters_configs_to_child(args).then(value => {
            return Promise.resolve(value);
        });
    }
}
exports.PostgresClusterService = PostgresClusterService;
//# sourceMappingURL=index.js.map