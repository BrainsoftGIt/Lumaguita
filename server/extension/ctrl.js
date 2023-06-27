"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ctrlConnect = exports.detectServer = exports.ctrlBroadcast = exports.listenCRTLEvent = exports.listenConnection = exports.createCTRL = exports.shutdownCtrlServer = exports.getCtrlServer = exports.ServerCtl = void 0;
const path_1 = __importDefault(require("path"));
const net_1 = __importDefault(require("net"));
const sys_1 = require("../global/sys");
const os_1 = __importDefault(require("os"));
const args_1 = require("../global/args");
const pid_1 = require("../global/pid");
const fs_1 = __importDefault(require("fs"));
let ctrlPath;
if (os_1.default.platform() === "win32")
    ctrlPath = path_1.default.join('\\\\?\\pipe', process.cwd(), 'maguita', args_1.args.appMode);
else
    ctrlPath = path_1.default.join(process.cwd(), `${args_1.args.appMode}.sock`);
var ServerCtl;
(function (ServerCtl) {
    ServerCtl["OPEN"] = "\\!open";
    ServerCtl["EXIT"] = "\\!exit";
    ServerCtl["SHUTDOWN"] = "\\!shutdown";
})(ServerCtl = exports.ServerCtl || (exports.ServerCtl = {}));
let connections = [];
function eject(socket) {
    let next;
    socket["connected"] = true;
    socket.on("close", () => {
        socket["connected"] = false;
        eject(socket);
    });
    while (next && next !== -1) {
        next = connections.findIndex(value => value["id"] === socket["id"]);
        connections.splice(next, 1);
    }
}
let ctrl = {
    connections: [],
};
function inject(socket, next) {
    socket["id"] = `socket:local//${next}/${Math.trunc(Math.random() * 9999999999999999999999)}`;
    connections.push(socket);
    eject(socket);
    broadcasts.forEach(text => ___broadcasts(socket, text));
}
function getCtrlServer() {
    return ctrl.server;
}
exports.getCtrlServer = getCtrlServer;
function shutdownCtrlServer() {
    return new Promise((resolve, reject) => {
        ctrl.server.close(err => () => {
            resolve(err);
        });
    });
}
exports.shutdownCtrlServer = shutdownCtrlServer;
function createCTRL() {
    if (ctrl.server)
        return ctrl.server;
    let next = 1;
    let server = net_1.default.createServer();
    server.on("connection", socket => {
        inject(socket, next++);
        socket.on("data", (buf) => {
            let data = buf.toString();
            if (data === ServerCtl.EXIT)
                sys_1.sys.exit();
            else if (data === ServerCtl.SHUTDOWN)
                sys_1.sys.shutdown();
            else if (data === ServerCtl.OPEN)
                sys_1.sys.openApp();
        });
    });
    server.on("error", err => {
        if (err["code"] === "EADDRINUSE") {
            let clientSocket = new net_1.default.Socket();
            clientSocket.on('error', function (e) {
                if (e["code"] == 'ECONNREFUSED') { // No other server listening
                    fs_1.default.unlinkSync(ctrlPath);
                    server.listen(ctrlPath, function () {
                        console.log("[MAGUITA]", `Server recovered!`);
                    });
                }
            });
        }
    });
    server.listen(ctrlPath);
    ctrl.server = server;
    (0, pid_1.onExitSignal)(shutdownCtrlServer);
    return server;
}
exports.createCTRL = createCTRL;
function listenConnection(socket, cb) {
    socket.on("data", data => {
        let lines = data.toString().split("\n").map((next) => next.trim())
            .filter(value => value && value.length);
        lines.forEach((line) => {
            try {
                let parse = JSON.parse(line.toString());
                let { event, args } = parse;
                if (!event)
                    return;
                if (!args)
                    return;
                if (!Array.isArray(event))
                    event = [event];
                if (!event.includes("*"))
                    event.push("*");
                event.forEach((next) => {
                    cb(socket, next, ...args);
                });
            }
            catch (e) {
                console.error(e);
            }
        });
    });
}
exports.listenConnection = listenConnection;
function listenCRTLEvent(socket, event, listener) {
    listenConnection(socket, (socket, next, ...data) => {
        if (event === next)
            return listener(event, ...data);
    });
}
exports.listenCRTLEvent = listenCRTLEvent;
let broadcasts = [];
function ctrlBroadcast(event, ...data) {
    let text = JSON.stringify({
        event,
        args: data
    });
    broadcasts.push(text);
    console.log(`BroadCsat|${text}`);
    connections.forEach(socket => ___broadcasts(socket, text));
}
exports.ctrlBroadcast = ctrlBroadcast;
function ___broadcasts(socket, text) {
    console.log(`BroadCsatNext|${text}`);
    if (!socket["connected"])
        return;
    socket.write(text + "\n");
}
function detectServer() {
    return new Promise(resolve => {
        let connection = net_1.default.connect({
            timeout: 1000 * 3,
            path: ctrlPath
        });
        connection.on("error", err => {
            console.log("Detect server... [FAILED]");
            resolve(null);
        });
        connection.on("connect", () => {
            console.log("Detect server... [ok]");
            resolve(connection);
        });
    });
}
exports.detectServer = detectServer;
function ctrlConnect(opts) {
    if (!opts)
        opts = {};
    let next = true;
    return new Promise((resolve, reject) => {
        if (opts.timeout) {
            next = false;
            setTimeout(() => {
                reject(new Error("Cannot connect ctrl server!"));
            }, opts.timeout);
        }
        let connect = () => {
            let connection = net_1.default.connect({
                timeout: opts.connectTimeout || 1000,
                path: ctrlPath
            });
            connection.on("error", err => {
                if (next)
                    connect();
            });
            connection.on("connect", () => {
                console.log(connection);
                resolve(connection);
            });
            return connection;
        };
        connect();
    });
}
exports.ctrlConnect = ctrlConnect;
//# sourceMappingURL=ctrl.js.map