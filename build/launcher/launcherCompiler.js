"use strict";
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
exports.compileLauncher = exports.checkCscInPath = void 0;
const fs = require("fs-extra");
const path = require("path");
const spawn = require("cross-spawn");
const Path = require("path");
const COMPILER = "msbuild.exe";
const checkCscInPath = (exit) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for compiler in %PATH%
    const promises = process.env.path.split(";").map((p) => fs.pathExists(path.resolve(p, COMPILER)));
    const results = yield Promise.all(promises);
    const compilerFound = yield results.find((result) => !!result);
    if (exit && !compilerFound) {
        console.error(`You need "${COMPILER}" in your %PATH% in order to compile the launcher executable.`);
        process.exit(1);
    }
    else {
        return compilerFound;
    }
});
exports.checkCscInPath = checkCscInPath;
const compileLauncher = (csproj, ...params) => __awaiter(void 0, void 0, void 0, function* () {
    //language=file-reference
    const args = [Path.join(__dirname, csproj)];
    const spawnResult = spawn.sync(COMPILER, args, { stdio: "inherit" });
    if (spawnResult.status !== 0) {
        return Promise.reject({ command: `${COMPILER} ${args.join(" ")}` });
    }
});
exports.compileLauncher = compileLauncher;
//# sourceMappingURL=launcherCompiler.js.map