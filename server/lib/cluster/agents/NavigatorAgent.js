"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigatorAgent = void 0;
const enuns_1 = require("../enuns");
const colors_1 = require("../colors");
const chalk_1 = __importDefault(require("chalk"));
const route_listener_1 = require("../listeners/route.listener");
const navigator_discover_listener_1 = require("../listeners/navigator.discover.listener");
class NavigatorAgent {
    constructor(server) {
        this._discoverListener = [];
        this._undeterminedDirectionListener = [];
        this._undeterminedDirectionsCounts = new Proxy({}, {
            get(target, p, receiver) {
                if (!target[p])
                    target[p] = 0;
                return target[p];
            }
        });
        this._context = server;
        this._route = new route_listener_1.RouteListener(this);
        this._navigatorListener = new navigator_discover_listener_1.NavigatorDiscoverListener(this);
    }
    get context() { return this._context; }
    attachJump(cluster, type, name, socket) {
        let jump = {
            id: cluster.cluster_identifier,
            path: cluster.cluster_path,
            name: name,
            linkId: this._context.id,
            type: type,
            linkType: "DIRECT",
            get connection() { return socket.connected ? "ON" : "OFF"; }
        };
        this.route.registerJump(jump);
        this.connectWithServer();
    }
    detachJump(cluster) {
        this._route.unregisterJump(cluster);
    }
    get route() { return this._route; }
    notifyOnUndeterminedDirection(route, ...data) {
        this._undeterminedDirectionListener.forEach(callback => {
            callback(route.destine.cluster_identifier, route, this._undeterminedDirectionsCounts[route.destine.cluster_identifier], ...data);
        });
        this._undeterminedDirectionsCounts[route.destine.cluster_identifier]++;
    }
    emitToAllServer(EVENT, ...data) {
        this.route.servers().forEach(value => {
            const source = this.route.toSource(value);
            this.start(EVENT, source, ...data);
        });
    }
    emitToAllClient(EVENT, ...data) {
        this.route.clients().forEach(value => {
            const source = this.route.toSource(value);
            this.start(EVENT, source, ...data);
        });
    }
    start(EVENT, destine, ...data) {
        return this._route.start(EVENT, destine, ...data);
    }
    describe(name) {
        if (name === "all")
            name = null;
        if (!name || name === "server") {
            console.log(chalk_1.default.blueBright.underline("SERVER REVISION"), colors_1.colors.identifier(this._context.id));
            console.table(this.route.servers().map(value => {
                return {
                    id: value.id,
                    name: value.name,
                    source: value.source,
                    path: value.path,
                    type: value.type
                };
            }));
        }
        if (!name || name === "client") {
            console.log(chalk_1.default.blueBright.underline("CLIENTS REVISION"), colors_1.colors.identifier(this._context.id));
            console.table(this.route.clients().map(value => {
                return {
                    id: value.id,
                    name: value.name,
                    source: value.source,
                    path: value.path,
                    type: value.type
                };
            }));
        }
    }
    registerPropagation(source, propagation) {
        this._route.rememberJumpForm(source, propagation);
        this.connectWithServer();
    }
    propagateConnections(propagation, clusterAgent, type, catchType, propagationCode, socket) {
        //Notificar aos cluster afilhados em outro ramo sobre o modificação local
        if (!propagation) {
            propagation = {
                route: [],
                code: propagationCode,
                catchType: catchType,
                origin: this._context.origin(),
                preview: null,
                jumps: null,
                clusterAgent,
                actionType: type
            };
        }
        this._context.navigator.route.jumps.filter(value => {
            var _a;
            return value.linkType === "DIRECT"
                && ((_a = propagation === null || propagation === void 0 ? void 0 : propagation.preview) === null || _a === void 0 ? void 0 : _a.cluster_identifier) !== value.id;
        }).forEach(jump => this.propagateTo(jump.id, propagation));
        return propagation;
    }
    propagateTo(jump, propagation) {
        const replicate = JSON.parse(JSON.stringify(propagation));
        const allJumps = [...this.route.jumps];
        let propagateJumps = allJumps.filter(map => {
            if (map.id === jump)
                return false;
            return map.linkId !== jump;
        });
        replicate.jumps = [...propagateJumps];
        replicate.route.push(this._context.id);
        replicate.preview = this._context.origin();
        this._context.connector.of(jump).emit(enuns_1.ClusterEvent.JUMP_PROPAGATION, replicate);
    }
    notifyRejectedByServer(source) {
        const find = this.route.jumps.find(value => value.id === source.cluster_identifier);
        if (!find)
            return;
        find.source.push("REJECT:AS-CLIENT");
        this._discoverListener.forEach(value => {
            value(find, "server", false);
        });
    }
    notifyAcceptedByServer(source, response) {
        var _a;
        if (response && (response === null || response === void 0 ? void 0 : response.accept) && ((_a = response === null || response === void 0 ? void 0 : response.remotes) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            const find = this.route.jumps.find(value => value.id === source.cluster_identifier);
            if (find)
                find.source.push("CONNECTED:AS-CLIENT");
            this._context.service.setsClusterRemote(response.remotes).then(value => {
                console.log("REMOTES CLUSTER IS SETS...");
            }).catch(reason => console.error(reason));
            this._discoverListener.forEach(value => {
                value(find, "server", true);
            });
        }
    }
    connectWithServer() {
        this.route.jumps.filter(value => !value.source).forEach(jump => {
            jump.source = [];
            const source = this._route.toSource(jump);
            this._context.service.acceptRevision(source).then(result => {
                const accept = !!result;
                console.log(`NEW CLUSTER DISCOVER:${colors_1.colors.action(accept, "ACCEPTED REV", "REJECTED REV")} ${source.cluster_identifier} ON ${colors_1.colors.identifier(this._context.id)}`);
                if (accept) {
                    jump.source.push("SERVER");
                    this.start(enuns_1.ClusterEvent.SERVER_CONNECT, source, Object.assign({}, this._context.origin(), { cluster_grants: this._context.localCluster.cluster_grants }));
                }
                else {
                    jump.source.push("REJECT:AS-SERVER");
                }
            });
        });
    }
    reverse(route, ...data) {
        this.start(route.event, route.origin, ...data);
    }
    onDiscoverListener(callback) {
        this._discoverListener.push(callback);
    }
    onUndeterminedDirection(callback) {
        this._undeterminedDirectionListener.push(callback);
    }
}
exports.NavigatorAgent = NavigatorAgent;
//# sourceMappingURL=NavigatorAgent.js.map