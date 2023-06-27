"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remoteProxy = exports.onError = exports.REMOTE_APP_NAME = void 0;
const http_proxy_middleware_1 = require("http-proxy-middleware");
const http2_1 = require("http2");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const anchorio_service_1 = require("../../../anchorio.service");
const args_1 = require("../../../../global/args");
let proxies = {};
exports.REMOTE_APP_NAME = args_1.args.app.toLowerCase();
const onError = (err, req1, res1, target1) => {
    res1.writeHead(500, {
        'Content-Type': 'text/html',
    });
    //language=file-reference
    const stream = fs_1.default.readFileSync(path_1.default.join(__dirname, "../../../../../client/public/error/remote-proxy.html"));
    res1.end(stream);
};
exports.onError = onError;
let _listeners = [];
function availableListener() {
    return new Promise(resolve => {
        let listener = _listeners.find(value => value.status === "available");
        if (listener)
            return resolve(listener);
        anchorio_service_1.aioService.api.needPorts().then(port => {
            console.log({ port, ports: anchorio_service_1.aioService.api.ports });
            anchorio_service_1.aioService.api.ports.forEach(port => {
                if (!_listeners.find(_listener => _listener.port === port)) {
                    console.log("new port to listener....", port);
                    _listeners.push({
                        port: port,
                        status: "available"
                    });
                }
            });
            let listener = _listeners.find(_listener => _listener.status === "available");
            console.log(listener, _listeners);
            if (listener)
                return resolve(listener);
            else
                return availableListener().then(value => resolve(value));
        });
    });
}
function remoteProxy(webTarget, req, res, next, host, namespace) {
    var _a;
    let use = proxies[webTarget.address];
    let _opts = { onError: exports.onError, headers: {
            host: `${host}.aio:${req.get('host').split(":")[1] || 80}`,
            "x-mgt-remote-version": "1.0.2",
            "x-mgt-remote-request": ((_a = require("../../../cluster.service").clusterServer.localCluster) === null || _a === void 0 ? void 0 : _a.cluster_namespace) || "master"
        } };
    if (!use) {
        require("../../../cluster.service").clusterServer.service.loadClusterByNamespace(namespace).then(cluster => {
            if (!cluster) {
                res.status(http2_1.constants.HTTP_STATUS_FORBIDDEN);
                //language=file-reference
                return res.sendFile(path_1.default.join(__dirname, "../../../../../client/public/error/remote-namespace.html"));
            }
            console.log("[MAGUITA] Proxy>", `Create proxy from ${"http"}:${host} to ${webTarget.address}`);
            use = createRemoteProxy(webTarget, _opts);
            use.next(req, res, next);
        });
    }
    else
        use.next(req, res, next);
}
exports.remoteProxy = remoteProxy;
function createRemoteProxy(webTarget, opts) {
    let target = `${webTarget.protocol}://${webTarget.address}:${anchorio_service_1.aioService.aioAgentPort}`;
    let options = { target };
    let use = { target, address: webTarget.address, port: anchorio_service_1.aioService.aioAgentPort, protocol: webTarget.protocol,
        proxy: (0, http_proxy_middleware_1.createProxyMiddleware)(Object.assign({}, opts, options)),
        next(req, res, next) {
            use.proxy(req, res, next);
        } };
    proxies[webTarget.address] = use;
    return use;
}
anchorio_service_1.aioService.onRunning(() => {
    anchorio_service_1.aioService.api.getApplication(exports.REMOTE_APP_NAME).then(application => {
        if (!application)
            anchorio_service_1.aioService.api.createApplication(exports.REMOTE_APP_NAME, args_1.args.appPort, "127.0.0.1").then(_app => {
                if (application)
                    console.log("[MAGUITA] Proxy> created application maguita on anchorio!");
                else
                    console.log("[MAGUITA] Proxy> Failed to create application maguita on anchorio!");
            });
        else
            console.log(`[MAGUITA] Proxy> application maguita already created on anchorio!`);
    });
});
//# sourceMappingURL=proxy.remote.js.map