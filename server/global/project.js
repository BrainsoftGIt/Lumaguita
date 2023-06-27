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
exports.folders = exports.folder = exports.project = void 0;
const os = __importStar(require("os"));
const fs_1 = __importDefault(require("fs"));
const args_1 = require("./args");
const defaults_1 = require("./defaults");
const path = require('path');
//language=file-reference
exports.project = {
    icon: {
        //language=file-reference
        png: path.join(__dirname, '../resources/fav/fav.png'),
        //language=file-reference
        ico: path.join(__dirname, '../resources/fav/fav.ico'),
    }
};
function folder(...pathParts) {
    let _path = path.join(...pathParts);
    if (!fs_1.default.existsSync(_path))
        fs_1.default.mkdirSync(_path, { recursive: true });
    return _path;
}
exports.folder = folder;
exports.folders = {
    get mountPoint() {
        var _a;
        return (`/BrainsoftSTP.com/${defaults_1.DEFAULTS.APP_PACKAGE}/${(_a = args_1.args.appMode) !== null && _a !== void 0 ? _a : "default"}`);
    },
    get root() {
        var _a;
        if (args_1.args.appRoot)
            return path.join(defaults_1.DEFAULTS.APP_HOME, (_a = args_1.args.appMode) !== null && _a !== void 0 ? _a : "default");
        let _home = defaults_1.DEFAULTS.APP_HOME;
        if (os.platform() === "win32" && !!process.env["ProgramData"]) {
            _home = process.env["ProgramData"];
        }
        else if (os.platform() === "win32" && !!process.env["LOCALAPPDATA"]) {
            _home = process.env["LOCALAPPDATA"];
        }
        else if (os.platform() === "win32" && !!process.env["APPDATA"]) {
            _home = process.env["APPDATA"];
        }
        else if (os.platform() === "win32" && !!process.env["USERPROFILE"]) {
            _home = process.env["USERPROFILE"];
        }
        else if (!!os.homedir()) {
            _home = os.homedir();
        }
        else if (!!process.env["HOME"]) {
            _home = process.env["HOME"];
        }
        return folder(_home, this.mountPoint);
    }, get home() {
        let home = path.join(this.root, 'var/home');
        if (!fs_1.default.existsSync(home))
            fs_1.default.mkdirSync(home, { recursive: true });
        return folder(home);
    }, get bin() {
        //language=file-reference
        return path.normalize(path.join(__dirname, "../../bin"));
    }, get pid() {
        return folder(this.volatile, "pid");
    }, get pidDir() {
        return folder(this.pid, `process-${process.pid}`);
    }, get volatile() {
        if (args_1.args.appRoot)
            return path.join(this.root, `var/temp`);
        if (os.platform() === "win32" && process.env["TEMP"])
            return process.env["TEMP"];
        return this.root;
    },
    //language=file-reference
    get snapshot() { return folder(__dirname, '../..'); },
    //language=file-reference
    get client() { return folder(this.snapshot, '/client'); },
    //language=file-reference
    get server() { return folder(this.snapshot, '/server'); },
    //language=file-reference
    get public() { return folder(this.snapshot, '/client/public'); },
    //language=file-reference
    get www() { return folder(this.snapshot, '/client/www'); },
    //language=file-reference
    get views() { return folder(this.snapshot, '/client/views'); },
    //language=file-reference
    get contents() { return folder(this.snapshot, '/client/contents'); },
    //Dynamics resources [resource,temps,volatiles,files,persistent]
    //Destined only for resources available on the current server [LocalServer]
    get cloud() { return folder(path.join(this.home, '/storage/cloud')); },
    //Destined for resource of user sessions
    get sessions() { return folder(path.join(this.home, '/sessions')); },
    //Destined for resources shared between servers
    get share() { return folder(path.join(this.home, '/storage/share')); },
    //Destined for private local resources
    get private() { return folder(path.join(this.home, '/storage/private')); },
    //Destined for temporary and volatile resources
    get temp() { return folder(path.join(this.volatile, this.mountPoint)); },
    //Destined for resource mount point [ChunksResources]
    get mnt() { return folder(path.join(this.home, '/storage/mnt')); },
    //...(avaliando se vai prevalecer)
    get files() { return folder(this.home, '/storage/files'); },
    get logs() { return folder(this.home, '/logs'); },
    //Destined for permanent database resource
    get database() { return folder(this.home, '/database'); },
    //Destined for postgres mount point [PostgresCluster|PG_HOME's]
    get pgHome() { return folder(this.database, '/postgres'); },
    //Destined for postgres mount point [PostgresCluster|PG_HOME's]
    get dumps() { return folder(this.database, '/dumps'); },
};
//# sourceMappingURL=project.js.map