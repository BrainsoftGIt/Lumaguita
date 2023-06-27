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
exports.ChildAcceptor = void 0;
const enuns_1 = require("../enuns");
const colors_1 = require("../colors");
class ChildAcceptor {
    constructor(connectionController, onAcceptSocket) {
        this._connector = connectionController;
        this._onAcceptSocket = onAcceptSocket;
    }
    acceptor() {
        //Cluster master listen children's connections
        return (socket, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            let childConfigs = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.cluster;
            let masterConfigs = (_b = socket.handshake.auth) === null || _b === void 0 ? void 0 : _b.master;
            let childInstance;
            let rejection = { message: enuns_1.ClusterMessage.REJECTED_CLUSTER_CONNECTION,
                name: "ClusterConnectionError",
                data: { accept: false }
            };
            let contextID = yield this._connector.context.service.identifier();
            const requestStatus = () => {
                console.log("========================== REQUEST ========================");
                let keys = Object.keys(childConfigs);
                let maxKey = keys.reduce((previousValue, currentValue) => {
                    return previousValue.length > currentValue.length ? previousValue
                        : currentValue;
                });
                keys.forEach(key => {
                    let value = childConfigs[key];
                    if (value === null || value === undefined)
                        return;
                    console.log(key.padEnd(maxKey.length + 3), value);
                });
            };
            const canContinue = (__accept) => {
                console.log(`NEW CLUSTER ${colors_1.colors.identifier(childConfigs === null || childConfigs === void 0 ? void 0 : childConfigs.cluster_identifier)} REQUEST ON ${colors_1.colors.identifier(contextID)} ${colors_1.colors.action(__accept, "ACCEPTED", "REJECTED")}`);
                if (!__accept)
                    next(rejection);
                else
                    next();
            };
            requestStatus();
            if (!this._connector.online) {
                rejection.message = enuns_1.ClusterMessage.REJECTED_MASTER_STARTING;
                rejection.data.text = "Server is starting, please wait a moment and try latter!";
                rejection.data.wait = true;
                rejection.data.estimatedStartTime = 1000;
                canContinue(false);
                return;
            }
            if (!childConfigs["cluster_machineid"]) {
                rejection.data.text = "REQUIRE MACHINE ID";
                canContinue(false);
                return;
            }
            let acceptResult = (yield ((_c = this._connector.context.service) === null || _c === void 0 ? void 0 : _c.acceptChild(childConfigs)));
            if (!acceptResult) {
                rejection.data.text = `Rejected cluster connection! RESULT: ${acceptResult}`;
                canContinue(false);
                return;
            }
            let result = yield this._connector.context.service.canAcceptClusterWithMachine(childConfigs);
            if (!result.result) {
                rejection.data.text = result.message;
                canContinue(false);
                return;
            }
            childInstance = result.data;
            const path = {};
            let heheheBowy = socket;
            path.base = heheheBowy.server.opts.path;
            path.url = socket.handshake.url;
            path.full = path.url.split("?")[0]
                .split("/").filter((value, index) => value.length > 0 || index === 0)
                .join("/");
            path.name = path.full.substr(path.base.length, path.full.length - path.base.length);
            let childDiff = ["cluster_name", "cluster_path", "cluster_grants", "cluster_key", "cluster_license", "cluster_licenselife", "cluster_tperiod_id"].find(key => {
                if (!childConfigs[key])
                    return true;
                return childConfigs[key] != childInstance[key];
            });
            let localDif = ["cluster_identifier", "cluster_name", "cluster_path"].find(key => {
                if (!masterConfigs[key])
                    return true;
                return masterConfigs[key] != this._connector.context.localCluster[key];
            });
            if (localDif === "cluster_name" && !this._connector.context.localCluster.cluster_name)
                localDif = null;
            if (localDif === "cluster_path" && !this._connector.context.localCluster.cluster_path)
                localDif = null;
            // ============================ LETS GO ============================================
            canContinue(true);
            const eventDefault = () => __awaiter(this, void 0, void 0, function* () {
                const sessionKey = Math.random() * 99999999;
                socket.data = {
                    path,
                    sessionKey,
                    cluster: childInstance,
                };
                //Emit auth result success
                socket.emit("auth", {
                    accept: true,
                    message: "Welcome!",
                    master: {
                        type: this._connector.context.certificate.levelType,
                        identifier: yield this._connector.context.service.identifier(),
                        path: yield this._connector.context.service.path()
                    }, session: {
                        path,
                        sessionKey,
                    }
                });
                this._onAcceptSocket(socket, childInstance);
            });
            if (childDiff || localDif) {
                this._connector.context.service.loadClusterConfigToChild(childInstance).then(configsClusters => {
                    socket.emit(enuns_1.ClusterEvent.CONFIGS, configsClusters);
                });
                socket.once(enuns_1.ClusterEvent.CONFIGS_SETS, args => {
                    eventDefault();
                });
            }
            else
                yield eventDefault();
        });
    }
}
exports.ChildAcceptor = ChildAcceptor;
//# sourceMappingURL=child-acceptor.js.map