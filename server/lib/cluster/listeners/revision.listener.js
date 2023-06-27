"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevisionListener = void 0;
const enuns_1 = require("../enuns");
const types_1 = require("../types");
const colors_1 = require("../colors");
class RevisionListener {
    constructor(revision) {
        this._revision = revision;
        this._revision.context.connector.onConnectionListener((socket, cluster, event) => {
            this.listenRevision(socket, cluster);
        });
        //ON DISCOVER NEW SERVER REQUIRE REVISIONS
        this._revision.context.navigator.onDiscoverListener((jumpServer, accept) => {
            if (!accept)
                return;
            let source = this._revision.context.navigator.route.toSource(jumpServer);
            this._revision.requestRevision(source, null, null); //ON DISCOVER NEW SERVER
        });
    }
    _declare(socket, cluster, revision) {
        return function (EVENT, callback) {
            socket.on(EVENT, (route, ...args) => {
                callback(route, ...args);
                revision.context.notifyClusterEventListener(EVENT, ...args);
            });
        };
    }
    listenRevision(socket, cluster) {
        const eventListener = this._declare(socket, cluster, this._revision);
        eventListener(enuns_1.ClusterEvent.REVISION, (route, metadata, ...args) => {
            this._revision.requestRevision(route.origin, metadata, ...args);
        });
        eventListener(enuns_1.ClusterEvent.REVISION_REQUEST, (route, req) => {
            this._revision.sendRevision(route.origin, req).then();
        });
        eventListener(enuns_1.ClusterEvent.REVISION_SEND, (route, res, req) => {
            this._revision.applyReceiveRevision(route, res, req);
        });
        eventListener(enuns_1.ClusterEvent.REVISION_RECEIVED, (route, result, revisionCode) => {
            console.log(`REVISION CODE ${colors_1.colors.event(revisionCode)} FROM CLUSTER ${(0, types_1.identifierOf)(route.origin)} ${result.length} RECORDS FROM`);
        });
    }
}
exports.RevisionListener = RevisionListener;
//# sourceMappingURL=revision.listener.js.map