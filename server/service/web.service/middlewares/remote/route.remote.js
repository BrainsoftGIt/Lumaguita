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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const http2_1 = require("http2");
const anchorio_service_1 = require("../../../anchorio.service");
const args_1 = require("../../../../global/args");
const project_1 = require("../../../../global/project");
const Path = __importStar(require("path"));
const proxy_remote_1 = require("./proxy.remote");
const chalk_1 = __importDefault(require("chalk"));
index_1.app.use((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let next = () => {
        next = () => { };
        _next();
    };
    if (!args_1.args.webDomain)
        return next();
    const host = req.get('host').split(":")[0];
    if (host === args_1.args.webDomain)
        return next();
    let parts = host.split('.');
    // let webParts = args.webDomain.split( "." );
    // if( webParts.length !== parts.length+1 ) return next();
    if (req.method.toUpperCase() === "GET" && fs_1.default.existsSync(Path.join(project_1.folders.public, req.path))) {
        let filename = Path.join(project_1.folders.public, req.path);
        let fileState = fs_1.default.statSync(filename);
        let html = RegExp(`((^)*.html)$`);
        let pages = fs_1.default.readdirSync(Path.join(project_1.folders.snapshot, "/client/public"))
            .map(filename => Path.join(project_1.folders.snapshot, "/client/public", filename))
            .filter(filename => html.test(Path.join(project_1.folders.snapshot, "/client/public", filename)));
        let excludes = [
            fileState.isDirectory(),
            pages.includes(filename)
        ];
        if (!excludes.includes(true))
            return next();
    }
    let namespace = parts.shift();
    let remoteGrants = (_a = require("../../../cluster.service").clusterServer.localCluster) === null || _a === void 0 ? void 0 : _a.cluster_remote;
    if (parts[parts.length - 1] === "aio" && req.header('x-mgt-remote-request') && remoteGrants) {
        console.log("[MAGUITA] Remote>", `${chalk_1.default.redBright("Remote")} request for host ${host} > ${req.path}`);
    }
    else if (parts[parts.length - 1] === "aio" && req.header('x-mgt-remote-request') && !remoteGrants) {
        res.status(http2_1.constants.HTTP_STATUS_FORBIDDEN);
        //language=file-reference
        return res.sendFile(path_1.default.join(__dirname, "../../../../../client/public/error/remote-blocked.html"));
    }
    else
        console.log("[MAGUITA] Remote>", `${chalk_1.default.blueBright("Direct")} Request for host ${host} > ${req.path}`);
    if (parts.join(".") !== args_1.args.webDomain)
        return next();
    let server = `${namespace}.aio`;
    let application = `${proxy_remote_1.REMOTE_APP_NAME}.${server}`;
    anchorio_service_1.aioService.api.webTarget(server, application).then(target => {
        if (target) {
            return (0, proxy_remote_1.remoteProxy)(target, req, res, next, host, namespace);
        }
        res.status(http2_1.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
        //language=file-reference
        return res.sendFile(path_1.default.join(__dirname, "../../../../../client/public/error/remote-proxy.html"));
    });
}));
//# sourceMappingURL=route.remote.js.map