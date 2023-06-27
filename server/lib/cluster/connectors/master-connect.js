"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterConnect = void 0;
const client = __importStar(require("socket.io-client"));
const enuns_1 = require("../enuns");
const server_1 = require("../server");
const node_machine_id_1 = require("node-machine-id");
class MasterConnect {
    constructor(connectionController) {
        this._connector = connectionController;
        this._onConnectListener = [];
        this._onRejection = [];
    }
    get connection() { return this._connection; }
    onConnectionAttach(callback) {
        this._onConnectListener.push(callback);
    }
    onRejectionAttach(callback) {
        this._onRejection.push(callback);
    }
    createMasterConnection(master) {
        const _context = this._connector.context;
        const url = `${master.cluster_domain}:${master.cluster_port}/cluster`;
        let path = (_context.localCluster.cluster_path || '-').split("/");
        path.push(_context.localCluster.cluster_identifier);
        path = path.filter(value => value.length > 0).join("/");
        path = `/MGT/server/${path}`;
        let machineId = `${(0, node_machine_id_1.machineIdSync)(true)}:${(0, node_machine_id_1.machineIdSync)()}`;
        const socket = client.io(url, {
            path: path,
            auth: {
                master: {
                    cluster_identifier: master.cluster_identifier,
                    cluster_path: master.cluster_path,
                    cluster_name: master.cluster_name,
                },
                cluster: Object.assign({}, _context.localCluster, {
                    cluster_api: master.cluster_api,
                    cluster_key: _context.privateKey,
                    cluster_machineid: machineId
                })
            }
        });
        this.notifyConnectionAttach = () => {
            this.notifyConnectionAttach = () => { };
            this._onConnectListener.forEach(value => {
                value(socket, master, server_1.SocketType.MASTER);
            });
        };
        this._connection = socket;
        this._primaryListener(socket, master);
        return socket;
    }
    _primaryListener(socket, master) {
        socket.on("connect_error", (error) => {
            if (error.message === enuns_1.ClusterMessage.REJECTED_CLUSTER_CONNECTION) {
                if (socket.id === this._connection.id) {
                    this._connection.disconnect();
                }
                if (JSON.stringify(master) === JSON.stringify(this._connector.masterCluster)) {
                    socket.disconnect();
                }
                this._onRejection.forEach(value => {
                    value(socket, master, server_1.SocketType.MASTER);
                });
                console.log("REJECTION ERROR", enuns_1.ClusterMessage.REJECTED_CLUSTER_CONNECTION);
                console.log("REJECTION ERROR", error);
            }
            else if (error.message === enuns_1.ClusterMessage.REJECTED_MASTER_STARTING) {
                console.log("REJECTION ERROR", enuns_1.ClusterMessage.REJECTED_MASTER_STARTING);
                setTimeout(() => {
                    socket.disconnect();
                    socket.open();
                }, error.data.estimatedStartTime);
            }
        });
    }
    notifyConnectionAttach() { }
}
exports.MasterConnect = MasterConnect;
//# sourceMappingURL=master-connect.js.map