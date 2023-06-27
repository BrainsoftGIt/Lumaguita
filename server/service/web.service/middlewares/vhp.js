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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyAgent = exports.determineBestPackageJson = void 0;
const client = __importStar(require("socket.io-client"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function determineBestPackageJson(opts) {
    let paths = require.main.paths;
    if (opts === null || opts === void 0 ? void 0 : opts.reverse)
        paths = paths.reverse();
    return paths.map((value, index) => {
        let parts = value.split(path_1.default.sep);
        parts.pop();
        let dir = parts.join(path_1.default.sep);
        let nodePackage = path_1.default.join(dir, "package.json");
        let packageExists = fs_1.default.existsSync(nodePackage);
        let data;
        if (packageExists)
            data = JSON.parse(fs_1.default.readFileSync(nodePackage).toString("utf-8"));
        return {
            name: data === null || data === void 0 ? void 0 : data.name,
            dir: dir,
            nodePackage,
            packageExists,
            data
        };
    }).find(value => value.packageExists);
}
exports.determineBestPackageJson = determineBestPackageJson;
function proxyAgent(opts) {
    var _a;
    if (!opts)
        opts = {};
    if (!opts.url) {
        opts.url = `${opts.protocol || "http"}://${opts.host || "127.0.0.1"}:${opts.port || 3380}/proxy`;
    }
    opts.path = opts.path || "/";
    opts.auth = opts.auth || {};
    opts.auth.applicationId = opts.auth.applicationId || ((_a = determineBestPackageJson()) === null || _a === void 0 ? void 0 : _a.name);
    console.log("ProxyAgentConnect", opts.url, opts);
    const connection = client.io(opts.url, {
        path: opts.path,
        auth: opts.auth,
    });
    connection.on("connect_error", err => {
        console.error(err);
    });
    return {
        connection,
        linkPort(port, entry, action, timeout) {
            return emit(connection, "link", timeout, Object.assign({}, entry, { port: port }), action);
        }
    };
}
exports.proxyAgent = proxyAgent;
function emit(conn, event, timeout, ...args) {
    return new Promise((resolve, reject) => {
        let code = `link:${Math.random()}`;
        let time;
        if (timeout)
            time = setTimeout(args => {
                reject(new Error("Time Out"));
                resolve = () => { };
                reject = () => { };
            }, timeout);
        conn.once(code, response => {
            resolve(response);
            if (timeout)
                clearTimeout(time);
            resolve = () => { };
            reject = () => { };
        });
        conn.emit("link", code, ...args);
    });
}
//# sourceMappingURL=vhp.js.map