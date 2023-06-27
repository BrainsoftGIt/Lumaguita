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
exports.clusterServer = void 0;
const socket_service_1 = require("../socket.service");
const cluster_1 = require("../../lib/cluster");
const ioline_service_1 = require("../ioline.service");
const enuns_1 = require("../../lib/cluster/enuns");
const colors_1 = require("../../lib/cluster/colors");
const path = __importStar(require("path"));
const web_service_1 = require("../web.service");
const fs = __importStar(require("fs"));
const project_1 = require("../../global/project");
const args_1 = require("../../global/args");
const pg_cluster_service_1 = require("./pg-cluster-service");
const { srv } = require("../../global/autogen/config/srv");
// const masterDomain = args.appSelfMaster? `http://127.0.0.1:${ args.appPort }`
//     : args.appMasterDomain? args.appMasterDomain
//     : `http://${ args.webDomain }:80`;
exports.clusterServer = new cluster_1.ClusterContext(pg_cluster_service_1.pgClusterService, socket_service_1.io, {
    namespace: "/cluster",
    namespaceChecker: "/cluster/checker",
    masterDomain: args_1.args.appSelfMaster,
    resource: project_1.folders.share,
    revisionsLimit: 1000,
    //language=file-reference
    resource_404: path.join(__dirname, "../../resources/000-404.png"),
    resourceMountPoint: project_1.folders.mnt,
    path: "/MGT"
});
web_service_1.app.use("/storage", exports.clusterServer.res.listen());
(() => __awaiter(void 0, void 0, void 0, function* () { yield exports.clusterServer.create(); }))();
(0, ioline_service_1.registerLine)("cluster:/?", () => exports.clusterServer.navigator.describe("all"));
(0, ioline_service_1.registerLine)("cluster:/", () => exports.clusterServer.navigator.describe("all"));
(0, ioline_service_1.registerLine)("cluster:/clients", () => exports.clusterServer.navigator.describe("client"));
(0, ioline_service_1.registerLine)("cluster:/servers", () => exports.clusterServer.navigator.describe("server"));
(0, ioline_service_1.registerLine)("cluster:/configs", () => {
    const _local = exports.clusterServer.localCluster;
    const _master = exports.clusterServer.masterCluster;
    console.table([
        { type: "Master", id: _master.cluster_identifier, name: _master.cluster_name, path: _master.cluster_path, grants: _master.cluster_grants },
        { type: "Local", id: _local.cluster_identifier, name: _local.cluster_name, path: _local.cluster_path, grants: _local.cluster_grants },
    ]);
});
const table = (title, data) => {
    console.log(colors_1.colors.title(title));
    console.table(data);
};
const generate = () => {
    const min = 1000;
    const max = 9999;
    return Math.trunc((Math.random() * (max - min)) + min);
};
(0, ioline_service_1.registerLine)("cluster:/broadcast", (line) => {
    exports.clusterServer.navigator.route.jumps.forEach((receiver) => {
        let code = generate();
        exports.clusterServer.navigator.start(enuns_1.ClusterEvent.BROADCAST, {
            cluster_identifier: receiver.id,
            cluster_name: receiver.name
        }, code);
        console.log(`EMIT BROADCAST TO ${colors_1.colors.identifier(receiver.id)} WITH CODE ${code}`);
    });
});
const findCandidate = (idx) => {
    return exports.clusterServer.navigator.route.jumps.find((value, index) => {
        return idx && (idx === value.id || index === Number(idx));
    });
};
(0, ioline_service_1.registerLine)("cluster:/ping", (command, line, ...args) => {
    const code = generate();
    const receiver = findCandidate(args.shift());
    if (!receiver) {
        console.log("NO PING CANDIDATE DISCOVER");
        return;
    }
    exports.clusterServer.navigator.start(enuns_1.ClusterEvent.PING, {
        cluster_identifier: receiver.id,
        cluster_name: receiver.name
    }, code);
    console.log(`EMIT PING TO ${colors_1.colors.identifier(receiver.id)} WITH CODE ${code}`);
});
(0, ioline_service_1.registerLine)("cluster:/message", (command, line, ...args) => {
    const code = generate();
    const receiver = findCandidate(args.shift());
    if (!receiver) {
        console.log("NO MESSAGE CANDIDATE DISCOVER");
        return;
    }
    let message = args.join(" ");
    exports.clusterServer.navigator.start(enuns_1.ClusterEvent.MESSAGE, {
        cluster_identifier: receiver.id,
        cluster_name: receiver.name
    }, code, message);
    console.log(`EMIT MESSAGE TO ${colors_1.colors.identifier(receiver.id)} WITH CODE ${code}`);
});
(0, ioline_service_1.registerLine)("cluster:/routes", () => exports.clusterServer.navigator.route.describe());
(0, ioline_service_1.registerLine)("cluster:/direct", () => table(`DIRECT JUMP OF ${exports.clusterServer.id}`, exports.clusterServer.navigator.route.jumps.filter(value => value.linkType === "DIRECT")));
(0, ioline_service_1.registerLine)("cluster:/remote", () => table(`REMOTES JUMP OF ${exports.clusterServer.id}`, exports.clusterServer.navigator.route.jumps.filter(value => value.linkType === "REMOTE")));
(0, ioline_service_1.registerLine)("cluster:/test-file", (command, line, ...args) => {
    let _file = args.join(" ");
    _file = _file.trim();
    let basename = path.basename(_file);
    let fileData = fs.readFileSync(_file);
    exports.clusterServer.res.create({
        resource_subpath: "simple-test/image",
        resource_name: `tatakae-${basename}`,
        resource_metadata: {
            _branch_uid: "e99f4d1d-53e8-4652-83b1-c754b75406cf"
        },
    }).then(value => {
        fs.writeFileSync(value.resolve, fileData);
        exports.clusterServer.notifyLocalChange({ event: "NEW RESOURCE FILES" });
        // console.log( `EMIT AVAILABLE RESOURCE ${colors.identifier( receiver.id )} WITH CODE ${ code }`);
    });
});
//# sourceMappingURL=index.js.map