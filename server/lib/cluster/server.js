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
exports.ClusterContext = exports.SocketType = exports.ClusterLevelType = void 0;
const enuns_1 = require("./enuns");
const NavigatorAgent_1 = require("./agents/NavigatorAgent");
const RevisionAgent_1 = require("./agents/RevisionAgent");
const config_listener_1 = require("./listeners/config.listener");
const connector_1 = require("./connectors/connector");
const clusterCertificate_1 = require("./agents/clusterCertificate");
const resource_1 = require("./resource");
var ClusterLevelType;
(function (ClusterLevelType) {
    ClusterLevelType["UNKNOWN"] = "ClusterTreeLevel.UNKNOWN";
    ClusterLevelType["ROOT"] = "@ROOT";
    ClusterLevelType["TRUNC"] = "@TRUNC";
})(ClusterLevelType = exports.ClusterLevelType || (exports.ClusterLevelType = {}));
var SocketType;
(function (SocketType) {
    SocketType["CHILD"] = "child";
    SocketType["MASTER"] = "MASTER";
})(SocketType = exports.SocketType || (exports.SocketType = {}));
class ClusterContext {
    // public onReceiverRevision:( EVENT_NAME:EventName, callback: (navigation, push, result ) => any)=>void;
    get onReceiverRevision() {
        return this.revision.onceReceiverRevision;
    }
    constructor(service, io, configs) {
        this._onceClusterEventListener = new Proxy([], {
            get(target, p, receiver) {
                let value = target[p];
                if (!value)
                    target[p] = value = [];
                return value;
            }
        });
        this._onClusterEventListener = new Proxy([], {
            get(target, p, receiver) {
                let value = target[p];
                if (!value)
                    target[p] = value = [];
                return value;
            }
        });
        this.create = () => __awaiter(this, void 0, void 0, function* () {
            this.create = () => __awaiter(this, void 0, void 0, function* () {
                if (this.certificate.levelType === ClusterLevelType.UNKNOWN) {
                    throw new Error("Cluster is creating...");
                }
                else
                    throw new Error("Cluster is created");
            });
            console.log(`[CLUSTER] LEVEL ${this.certificate.levelType} NAMESPACE: ${this._configs.namespace}`);
            this.of().use(this._connector.childAcceptor.acceptor());
            yield this._connector.start();
        });
        this._service = service;
        this._configs = JSON.parse(JSON.stringify(configs));
        this._configs.revisionsLimit = this._configs.revisionsLimit || 100;
        this._io = io;
        //Load Primary Agents
        this._certificate = new clusterCertificate_1.ClusterCertificate(this);
        this._connector = new connector_1.Connector(this);
        this._route = new NavigatorAgent_1.NavigatorAgent(this);
        this._configsSets = new config_listener_1.ConfigListener(this);
        this._revision = new RevisionAgent_1.RevisionAgent(this);
        this._res = new resource_1.Resource(this);
    }
    get localCluster() { return this._connector.localCluster; }
    get masterCluster() { return this._connector.localCluster; }
    get revisionsLimit() { return this._configs.revisionsLimit; }
    get service() { return this._service; }
    get privateKey() { return this._connector.privateKey; }
    get navigator() { return this._route; }
    get configsSets() { return this._configsSets; }
    get connector() { return this._connector; }
    get revision() { return this._revision; }
    get certificate() { return this._certificate; }
    get configs() { return this._configs; }
    get res() { return this._res; }
    get debug() { return !!this._configs.debug; }
    get online() { return this._connector.online; }
    toSource(jump) {
        return this.navigator.route.toSource(jump);
    }
    of() { return this._io.of(this._configs.namespace); }
    connect() {
        console.log("CONNECTING TO MASTER...");
        return this._connector.masterConnect();
    }
    notifyChangeConfigs() {
        return this.connect();
    }
    notifyRemoteChange(cluster, metadata) {
        //TODO notify remote change
    }
    onClusterEventListener(EVENT_NAME, callback) {
        if (typeof EVENT_NAME === "string")
            EVENT_NAME = [EVENT_NAME];
        EVENT_NAME.forEach((value, index) => {
            this._onClusterEventListener[value].push(callback);
        });
    }
    onceClusterEventListener(EVENT_NAME, callback) {
        if (typeof EVENT_NAME === "string")
            EVENT_NAME = [EVENT_NAME];
        EVENT_NAME.forEach((value, index) => {
            this._onceClusterEventListener[value].push(callback);
        });
    }
    notifyClusterEventListener(EVENT, ...args) {
        this._onceClusterEventListener[EVENT].splice(0).forEach((revisionCallback, index) => {
            revisionCallback(...args);
        });
        this._onClusterEventListener[EVENT].forEach((revisionCallback, index) => {
            revisionCallback(...args);
        });
    }
    origin() {
        return this.originOf(this.localCluster);
    }
    originOf(cluster) {
        if (!cluster)
            return null;
        return {
            cluster_identifier: cluster.cluster_identifier,
            cluster_path: cluster.cluster_path,
            cluster_name: cluster.cluster_name,
        };
    }
    get id() { var _a; return (_a = this.origin()) === null || _a === void 0 ? void 0 : _a.cluster_identifier; }
    get path() { return this.origin().cluster_path; }
    //Revisions works
    notifyLocalChange(metadata, ...args) {
        this.revision.notifyAllClient(metadata, ...args);
    }
    requireRevision(remoteCluster) {
        this.service.acceptRevision(remoteCluster).then(value => {
        });
        this.navigator.start(enuns_1.ClusterEvent.REVISION_REQUEST, remoteCluster);
    }
    describe() {
        return __awaiter(this, void 0, void 0, function* () {
            let privateKey = yield this.service.privateKey();
            let localCluster = yield this.service.loadLocalCluster();
            let masterCluster = yield this.service.loadMasterCluster();
            let type = this.certificate.levelType;
            let path = type === ClusterLevelType.ROOT ? "/"
                : localCluster.cluster_path;
            console.log("[MAGUITA] Cluster>", "Status");
            console.table([{
                    id: localCluster.cluster_identifier,
                    path: path,
                    type: this.certificate.levelType,
                    master: `${masterCluster.cluster_domain}:${masterCluster.cluster_port}`,
                    status: yield this.status(),
                    online: this.online,
                    license: localCluster.cluster_license,
                    code: localCluster.cluster_code,
                    namespace: localCluster.cluster_namespace
                }]);
        });
    }
    isRoot() {
        return this.certificate.isRoot;
    }
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            let privateKey = yield this.service.privateKey();
            let localCluster = yield this.service.loadLocalCluster();
            let masterCluster = yield this.service.loadMasterCluster();
            let _has_sets_configs = !!masterCluster.cluster_api
                && !!masterCluster.cluster_port
                && !!masterCluster.cluster_domain;
            let configured = _has_sets_configs || this.certificate.isRoot;
            let _status = (configured && !!privateKey || this.certificate.isRoot) ? "REGISTERED"
                : (configured) ? "CONFIGURED"
                    : "NOT-CONFIGURED";
            return Promise.resolve(_status);
        });
    }
}
exports.ClusterContext = ClusterContext;
//# sourceMappingURL=server.js.map