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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connector = void 0;
const server_1 = require("../server");
const configs_1 = require("../loaders/configs");
const master_connect_1 = require("./master-connect");
const child_acceptor_1 = require("./child-acceptor");
const propagation_listener_1 = require("../listeners/propagation.listener");
const enuns_1 = require("../enuns");
const chalk_1 = __importDefault(require("chalk"));
class Connector {
    constructor(context) {
        this._connectionCreate = [];
        this._context = context;
        this._masterGetAway = new master_connect_1.MasterConnect(this);
        this._propagation = new propagation_listener_1.PropagationListener(context);
        this._childAcceptor = new child_acceptor_1.ChildAcceptor(this, (socket, cluster) => __awaiter(this, void 0, void 0, function* () {
            socket.on("disconnect", () => {
                const max = 9999999999;
                const min = 1000000000;
                const code = (Math.trunc(Math.random() * (max - min)) + min);
                context.navigator.detachJump(cluster);
                const prop = context.navigator.propagateConnections(null, context.originOf(cluster), "leave", "child", code, socket);
            });
            socket.join(cluster.cluster_identifier);
            this.propagation.onChildPropagation(socket, cluster);
            const max = 9999999999;
            const min = 1000000000;
            const code = (Math.trunc(Math.random() * (max - min)) + min);
            context.navigator.attachJump(this._context.originOf(cluster), "child", cluster.cluster_name, socket);
            const prop = this._context.navigator.propagateConnections(null, this._context.originOf(cluster), "join", "child", code, socket);
            // this._context.navigator.startReady( prop );
            this._connectionCreate.forEach(value => {
                value(socket, cluster, server_1.SocketType.CHILD);
            });
        }));
    }
    get localCluster() {
        return this.context.service.currentLocalCluster;
    }
    get masterCluster() {
        return this.context.service.currentMasterCluster;
    }
    get privateKey() {
        return this._cluster_key;
    }
    get masterGetAway() {
        return this._masterGetAway;
    }
    get online() {
        var _a, _b;
        return !!((_a = this.localCluster) === null || _a === void 0 ? void 0 : _a.cluster_identifier)
            && ((_b = this.localCluster) === null || _b === void 0 ? void 0 : _b.cluster_uid)
            && this.context.certificate.isVerified;
    }
    get context() {
        return this._context;
    }
    get childAcceptor() {
        return this._childAcceptor;
    }
    get propagation() {
        return this._propagation;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.start = () => __awaiter(this, void 0, void 0, function* () {
                console.log("Start Rejected");
            });
            let _clusterLevelType = yield this.context.certificate.certificate();
            if (_clusterLevelType === server_1.ClusterLevelType.ROOT) {
                const local = yield this.context.service.localCluster();
                yield this.context.service.setsClusterConfigs([{
                        cluster_identifier: local.cluster_identifier,
                        cluster_type: enuns_1.ClusterType.LOCAL,
                        cluster_name: "ROOT",
                        cluster_path: "/"
                    }]);
            }
            const loader = new configs_1.ClusterConfigsLoader(this._context);
            if (_clusterLevelType === server_1.ClusterLevelType.TRUNC) {
                this.masterConnect = () => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c;
                    console.log("[MAGUITA]", `Master connection start...`);
                    const change = yield loader.loadChange();
                    if (!change)
                        return;
                    this._cluster_key = yield this.context.service.privateKey();
                    if (change.changeConnect && ((_b = (_a = this === null || this === void 0 ? void 0 : this._masterGetAway) === null || _a === void 0 ? void 0 : _a.connection) === null || _b === void 0 ? void 0 : _b.connected)) {
                        console.log("[MAGUITA]", "MASTER CONNECTION RESTART:DISCONNECT");
                        (_c = this._masterGetAway) === null || _c === void 0 ? void 0 : _c.connection.disconnect();
                    }
                    if (change.connect) {
                        console.log("[MAGUITA]", "Create master socket connection...");
                        const socket = this._masterGetAway.createMasterConnection(change.master);
                        this._propagation.onMasterPropagation(socket, change.master);
                        socket.on(enuns_1.ClusterEvent.CONFIGS, (cluster) => {
                            socket.emit(enuns_1.ClusterEvent.CONFIGS_SETS, "OK, lets go");
                        });
                        socket.on("disconnect", reason => {
                            console.log("==================== DISCONNECT MASTER ====================");
                            this._context.navigator.detachJump(change.master);
                        });
                        socket.on("auth", () => {
                            console.log("==================== AUTH MASTER ====================");
                            let jumpCluster = this._context.originOf(this.context.service.currentMasterCluster);
                            this._context.navigator.attachJump(jumpCluster, "master", change.master.cluster_name, socket);
                        });
                        socket.on("connect", () => {
                            console.log("==================== CONNECT MASTER ====================");
                        });
                        this._masterGetAway.notifyConnectionAttach();
                        this._connectionCreate.forEach(value => {
                            value(socket, change.master, server_1.SocketType.MASTER);
                        });
                    }
                });
            }
            yield this.masterConnect();
            yield ({
                [server_1.ClusterLevelType.ROOT]: () => {
                    this.context.describe();
                }, [server_1.ClusterLevelType.TRUNC]: () => {
                    this.context.describe();
                }
            })[_clusterLevelType]();
        });
    }
    of(identifier) {
        const self = this;
        const emission = {
            emit(event, ...args) {
                var _a;
                if (self.masterCluster && self.masterCluster.cluster_identifier === identifier)
                    (_a = self.masterGetAway) === null || _a === void 0 ? void 0 : _a.connection.emit(event, ...args);
                else
                    self._context.of().to(identifier).emit(event, ...args);
                return emission;
            }
        };
        return emission;
    }
    masterConnect() { console.log("[MAGUITA] Cluster>", chalk_1.default.yellowBright("Running on root mode. Rejected master connection!")); }
    onConnectionListener(listener) {
        this._connectionCreate.push(listener);
    }
}
exports.Connector = Connector;
//# sourceMappingURL=connector.js.map