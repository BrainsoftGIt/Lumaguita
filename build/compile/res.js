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
exports.resDescribe = exports.res = void 0;
const path_1 = __importDefault(require("path"));
const index_1 = require("./index");
const fs_1 = __importDefault(require("fs"));
const Path = __importStar(require("path"));
const raws = [
    /*language=file-reference*/ { base: "/", dist: "/", filter: "package.json" },
    /*language=file-reference*/ { base: "/", dist: "/", filter: "tsconfig.json" },
    /*language=file-reference*/ { base: "/", dist: "/", filter: "VERSION" },
    /*language=file-reference*/ { base: "/etc", dist: "/etc", filter: "anchorio.conf" },
    /*language=file-reference*/ { base: "/bin", dist: "/bin", filter: "**/*.exe" },
    /*language=file-reference*/ { base: "/bin", dist: "/bin", filter: "**/*.vbs" },
    /*language=file-reference*/ { base: "/bin", dist: "/bin", filter: "**/*.bat" },
    /*language=file-reference*/ { base: "/bin", dist: "/bin", filter: "**/*.cmd" },
    /*language=file-reference*/ { base: "/bin", dist: "/bin", filter: "**/*.exe.js" },
    /*language=file-reference*/ { base: "/bin", dist: "/bin", filter: "**/*.exe.js.map" },
    /*language=file-reference*/ { base: "/client/app", dist: "/app", filter: "**/*.js" },
    /*language=file-reference*/ { base: "/client/app", dist: "/app", filter: "**/*.js.map" },
    /*language=file-reference*/ { base: "/client/app", dist: "/app", filter: "**/*.css" },
    /*language=file-reference*/ { base: "/client/app", dist: "/app", filter: "**/*.html" },
    /*language=file-reference*/ { base: "/client", dist: "/client", filter: "**" },
    /*language=file-reference*/ { base: "/build/", dist: "/build/", filter: "status.js" },
    /*language=file-reference*/ { base: "/build/", dist: "/build/", filter: "status.js.map" },
    /*language=file-reference*/ { base: "/build/", dist: "/build/", filter: "index.js" },
    /*language=file-reference*/ { base: "/build/", dist: "/build/", filter: "index.js.map" },
    /*language=file-reference*/ { base: "/build/kconst", dist: "/build/kconst", filter: "**/*.js" },
    /*language=file-reference*/ { base: "/build/db", dist: "/build/db", filter: "**/*.sql" },
    /*language=file-reference*/ { base: "/build/db", dist: "/build/db", filter: "**/*.db" },
    /*language=file-reference*/ { base: "/build/db", dist: "/build/db", filter: "**/*.js" },
    /*language=file-reference*/ { base: "/build/db", dist: "/build/db", filter: "**/*.js.map" },
    // /*language=file-reference*/  { base: "/build/installers",    dist: "/build/installers",  filter: "**" },
    /*language=file-reference*/ { base: "/server", dist: "/server", filter: "**/*.js" },
    /*language=file-reference*/ { base: "/server", dist: "/server", filter: "**/*.js.map" },
    /*language=file-reference*/ { base: "/server", dist: "/server", filter: "**/*.json" },
    /*language=file-reference*/ { base: "/server/lib/json", dist: "/server/lib/json", filter: "**" },
    /*language=file-reference*/ { base: "/server/resources", dist: "/server/resources", filter: "**" },
    /*language=file-reference*/ { base: "/libs", dist: "/libs", filter: "**" },
    /*language=file-reference*/ { base: "/database/patch", dist: "/database/patch", filter: "**/*.js" },
    /*language=file-reference*/ { base: "/database/patch", dist: "/database/patch", filter: "**/*.js.map" },
    /*language=file-reference*/ { base: "/database/patch", dist: "/database/patch", filter: "**/*.json" },
    /*language=file-reference*/ { base: "/database/patch", dist: "/database/patch", filter: "**/*.sql" },
];
//language=file-reference
if (fs_1.default.existsSync(Path.join(__dirname, "../../nw/nw.exe"))) {
    raws.push(
    /*language=file-reference*/ { base: "/nw", dist: "/nw", filter: "**" });
}
const temps = [
    { base: "/", dist: "/", filter: "tsconfig.json" },
    { base: "/build/kconst", dist: "/build/kconst", filter: "**/*.js" },
];
function res() {
    //language=file-reference
    const _package = path_1.default.join(__dirname, '../../package.json');
    const root = path_1.default.dirname(_package);
    const distRoot = path_1.default.join(root, `../maguita_${index_1.compileArgs.platform}`);
    fs_1.default.mkdirSync(distRoot, { recursive: true });
    //language=file-reference
    const entry = path_1.default.join(root, "/bin/maguita.exe.js");
    const output = path_1.default.join(root, "bin/maguita.exe");
    const cwd = path_1.default.join(root, "bin");
    //language=file-reference
    return {
        entry,
        output,
        cwd,
        package: _package,
        root,
        distRoot,
        temps,
        raws
    };
}
exports.res = res;
function resDescribe() {
}
exports.resDescribe = resDescribe;
//# sourceMappingURL=res.js.map