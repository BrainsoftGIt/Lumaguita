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
exports.markAs = exports.toolsName = exports.registerTools = exports.tools = void 0;
const ioline_service_1 = require("../ioline.service");
const ioc = __importStar(require("socket.io-client"));
const args_1 = require("../../global/args");
exports.tools = {
    namespace: 'tools',
    get server() {
        return require("../socket.service").io.of(this.namespace);
    }, get connection() {
        if (!this._client) {
            const url = `${args_1.args.webProtocol}://127.0.0.1:${args_1.args.appPort}/${this.namespace}`;
            this._client = ioc.io(url, { path: "/MGT" });
            console.log("client", url);
            this._client.on("connect", () => {
                console.log("Tools connected to server");
            });
            this._client.on("connect_error", err => {
                console.error("connect_error", err);
            });
        }
        return this._client;
    }
};
let toolsMode = [];
let serversPrepare = [];
let toolsPrepare = [];
function registerTools(name, listeners) {
    if (listeners.onServer) {
        serversPrepare.push(() => {
            exports.tools.server.use((socket, next) => {
                if (socket.handshake.address !== "::ffff:127.0.0.1") {
                    next(new Error("Reject remote tools connect"));
                    return;
                }
                socket.on(toolsName(name), (...args) => {
                    listeners.onServer(toolsName(name), socket, ...args);
                });
                next();
            });
        });
    }
    if (listeners.line || listeners.onTools) {
        toolsPrepare.push(() => {
            console.log("Apply tool", name);
            if (listeners.line)
                (0, ioline_service_1.registerLine)(name, (...ioLine) => {
                    listeners.line(toolsName(name), ...ioLine);
                });
            if (listeners.onTools)
                exports.tools.connection.on(toolsName(name), (...params) => {
                    listeners.onTools(toolsName(name), ...params);
                });
        });
    }
    processMarks();
}
exports.registerTools = registerTools;
function toolsName(s) { return `tools://${s}`; }
exports.toolsName = toolsName;
function processMarks() {
    // if( !toolsMode.length ) return;
    if (toolsMode.includes("server"))
        serversPrepare.splice(0, serversPrepare.length).forEach(value => {
            value();
        });
    if (toolsMode.includes("tools"))
        toolsPrepare.splice(0, toolsPrepare.length).forEach(value => {
            value();
        });
}
let markAs = (mode) => {
    // if( toolsMode.includes( mode ) ) return;
    // console.log( "MARKS TOOL MODE", mode );
    // toolsMode.push( mode );
    // processMarks()
};
exports.markAs = markAs;
//# sourceMappingURL=index.js.map