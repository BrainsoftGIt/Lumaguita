"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigListener = void 0;
const server_1 = require("../server");
const enuns_1 = require("../enuns");
class ConfigListener {
    constructor(context) {
        this._context = context;
        this._context.connector.onConnectionListener((socket, cluster, type) => {
            if (type !== server_1.SocketType.MASTER)
                return;
            socket.on(enuns_1.ClusterEvent.CONFIGS, (clusters) => {
                this._context.service.setsClusterConfigs(clusters).then((value) => {
                    this._context.notifyClusterEventListener(enuns_1.ClusterEvent.CONFIGS);
                    Promise.all([
                        this._context.service.localCluster(),
                        this._context.service.loadMasterCluster()
                    ]).then(value1 => {
                        console.log("Clusters Configs has sets");
                    });
                });
            });
        });
    }
}
exports.ConfigListener = ConfigListener;
//# sourceMappingURL=config.listener.js.map