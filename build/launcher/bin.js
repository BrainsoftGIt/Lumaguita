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
const Path = __importStar(require("path"));
const fs_1 = __importDefault(require("fs"));
//language=file-reference
let msbuildPath = "C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319";
let paths = process.env["Path"].split(Path.delimiter);
paths.unshift(msbuildPath);
process.env["Path"] = paths.join(Path.delimiter);
require("./launcherCompiler").checkCscInPath(true).then(value => {
    let math = /(^)*.csproj$/;
    fs_1.default.readdirSync(Path.join(__dirname, "csproj")).filter(value1 => math.test(value1))
        .forEach(file => {
        let csproj = `csproj/${file}`;
        require("./launcherCompiler").compileLauncher(csproj).then(value1 => {
            console.log(value1);
        }).catch(reason => {
        });
    });
});
//# sourceMappingURL=bin.js.map