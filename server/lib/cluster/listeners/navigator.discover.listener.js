"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigatorDiscoverListener = void 0;
const enuns_1 = require("../enuns");
const colors_1 = require("../colors");
class NavigatorDiscoverListener {
    constructor(navigator) {
        this._navigator = navigator;
        this._navigator.context.connector.onConnectionListener((socket, cluster, type) => {
            this.discover(socket, cluster, type);
        });
    }
    discover(socket, source, type) {
        socket.on(enuns_1.ClusterEvent.PING, (route, code) => {
            console.log(`RECEIVER ${colors_1.colors.event("PING")} FORM ${colors_1.colors.identifier(route.origin.cluster_identifier)} WITH CODE ${colors_1.colors.name(code)}`);
            route.event = enuns_1.ClusterEvent.PONG;
            this._navigator.reverse(route, code);
        });
        socket.on(enuns_1.ClusterEvent.PONG, (route, code) => {
            console.log(`RECEIVER ${colors_1.colors.event(enuns_1.ClusterEvent.PONG)} RESPONSE FORM ${colors_1.colors.identifier(route.origin.cluster_identifier)} WITH CODE ${code}`);
        });
        socket.on(enuns_1.ClusterEvent.BROADCAST, (route, code) => {
            console.log(`CAPTURED ${colors_1.colors.event(enuns_1.ClusterEvent.BROADCAST)} FORM ${colors_1.colors.identifier(route.origin.cluster_identifier)} WITH CODE ${code}`);
        });
        socket.on(enuns_1.ClusterEvent.MESSAGE, (route, code, message) => {
            console.table([{ code, message }]);
        });
        socket.on(enuns_1.ClusterEvent.SERVER_CONNECT_ACCEPT, (route, response) => {
            this._navigator.notifyAcceptedByServer(route.origin, response);
        });
        socket.on(enuns_1.ClusterEvent.SERVER_CONNECT_REJECT, (route, response) => {
            this._navigator.notifyRejectedByServer(route.origin);
        });
        socket.on(enuns_1.ClusterEvent.SERVER_CONNECT, (route, reqRemote) => {
            let accept = reqRemote.cluster_identifier !== this._navigator.context.id;
            const find = this._navigator.route.jumps.find(exist => exist.id === reqRemote.cluster_identifier);
            if (find && !find.source)
                find.source = [];
            this._navigator.context.service.canSendRevision(reqRemote).then(can_send => {
                if (accept && can_send) {
                    if (find)
                        find.source.push("CLIENT");
                    this._navigator.context.service.loadLocalAsRemoteClusters(reqRemote).then(clusters => {
                        this._navigator.route.start(enuns_1.ClusterEvent.SERVER_CONNECT_ACCEPT, route.origin, {
                            accept: can_send && accept,
                            remotes: clusters
                        });
                    }).catch(value => console.error(value));
                }
                else if (find) {
                    find.source.push("REJECT:AS-SERVER");
                    this._navigator.route.start(enuns_1.ClusterEvent.SERVER_CONNECT_REJECT, route.origin);
                }
                console.log(`NEW CLUSTER RECEIVER:${colors_1.colors.action(accept, "CONNECTED", "REJECTED")} ${reqRemote.cluster_identifier} ON ${colors_1.colors.identifier(this._navigator.context.id)} ROUTE ${colors_1.colors.route(route.route.reverse().join("/"))} `);
            }).catch(reason => console.error(reason));
        });
    }
}
exports.NavigatorDiscoverListener = NavigatorDiscoverListener;
//# sourceMappingURL=navigator.discover.listener.js.map