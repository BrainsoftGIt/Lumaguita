"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropagationListener = void 0;
const enuns_1 = require("../enuns");
class PropagationListener {
    constructor(context) {
        this._context = context;
    }
    onMasterPropagation(socket, master) {
        socket.on(enuns_1.ClusterEvent.JUMP_PROPAGATION, (propagation) => {
            if (propagation.origin.cluster_identifier === this._context.id)
                return;
            this._context.navigator.registerPropagation(master, propagation);
        });
    }
    onChildPropagation(socket, cluster) {
        socket.on(enuns_1.ClusterEvent.JUMP_PROPAGATION, (propagation) => {
            if (propagation.origin.cluster_identifier === this._context.id)
                return;
            this._context.navigator.registerPropagation(cluster, propagation);
            this._context.navigator.propagateConnections(propagation, null, null, null, null, socket);
        });
    }
}
exports.PropagationListener = PropagationListener;
//# sourceMappingURL=propagation.listener.js.map