"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterEvent = exports.ClusterTreePosition = exports.ClusterType = exports.ClusterMessage = void 0;
var ClusterMessage;
(function (ClusterMessage) {
    ClusterMessage["REJECTED_CLUSTER_CONNECTION"] = "ClusterMessage.REJECTED_CLUSTER_CONNECTION";
    ClusterMessage["REJECTED_MASTER_STARTING"] = "ClusterMessage.REJECTED_MASTER_STARTING...";
})(ClusterMessage = exports.ClusterMessage || (exports.ClusterMessage = {}));
var ClusterType;
(function (ClusterType) {
    ClusterType[ClusterType["LOCAL"] = 1] = "LOCAL";
    ClusterType[ClusterType["MASTER"] = 2] = "MASTER";
    ClusterType[ClusterType["REMOTE"] = 3] = "REMOTE";
    ClusterType[ClusterType["CHILD"] = 4] = "CHILD";
})(ClusterType = exports.ClusterType || (exports.ClusterType = {}));
var ClusterTreePosition;
(function (ClusterTreePosition) {
    ClusterTreePosition[ClusterTreePosition["TRUNC"] = 1] = "TRUNC";
    ClusterTreePosition[ClusterTreePosition["BRANCH"] = 2] = "BRANCH";
})(ClusterTreePosition = exports.ClusterTreePosition || (exports.ClusterTreePosition = {}));
var ClusterEvent;
(function (ClusterEvent) {
    //JUMPS EVENTS
    ClusterEvent["JUMP"] = "@JUMP";
    ClusterEvent["JUMP_PROPAGATION"] = "ClusterEvent.JUMP_PROPAGATION";
    //ANALISE EVENTS
    ClusterEvent["PING"] = "@PING";
    ClusterEvent["PONG"] = "@PONG";
    ClusterEvent["MESSAGE"] = "@MESSAGE";
    ClusterEvent["BROADCAST"] = "@BROADCAST";
    //DISCOVER SERVER EVENTS
    ClusterEvent["SERVER_CONNECT"] = "ClusterEvent.SERVER_CONNECT";
    ClusterEvent["SERVER_CONNECT_ACCEPT"] = "ClusterEvent.SERVER_CONNECT_ACCEPT";
    ClusterEvent["SERVER_CONNECT_REJECT"] = "ClusterEvent.SERVER_CONNECT_REJECT";
    //CONFIGS
    ClusterEvent["CONFIGS"] = "ClusterEvent.CONFIGS";
    ClusterEvent["CONFIGS_SETS"] = "ClusterEvent.CONFIGS_SETS";
    //REVISIONS EVENS
    ClusterEvent["REVISION"] = "ClusterEvent.REVISION";
    ClusterEvent["REVISION_REQUEST"] = "ClusterEvent.REVISION_REQUEST";
    ClusterEvent["REVISION_SEND"] = "ClusterEvent.REVISION_SEND";
    ClusterEvent["REVISION_RECEIVED"] = "ClusterEvent.REVISION_RECEIVED";
    ClusterEvent["RESOURCE_REQ"] = "ClusterEvent.RESOURCE_REQ";
    ClusterEvent["RESOURCE_HEAD"] = "ClusterEvent.RESOURCE_HEAD";
    ClusterEvent["RESOURCE_404"] = "ClusterEvent.RESOURCE_404";
    ClusterEvent["RESOURCE_CHUNK"] = "ClusterEvent.RESOURCE_CHUNK";
    ClusterEvent["RESOURCE_AVAILABLE"] = "ClusterEvent.RESOURCE_AVAILABLE";
})(ClusterEvent = exports.ClusterEvent || (exports.ClusterEvent = {}));
//# sourceMappingURL=enuns.js.map