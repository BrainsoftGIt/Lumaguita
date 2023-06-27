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
exports.clean = exports.compileArgs = void 0;
const nexe_1 = require("./nexe");
require('source-map-support').install();
const arguments_1 = require("zoo.util/lib/arguments");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const linked_spawn_1 = require("../../server/lib/utils/process/linked-spawn");
const recursive_copy_1 = __importDefault(require("recursive-copy"));
const child_process_1 = require("child_process");
const res_1 = require("./res");
const listen_1 = require("../../server/lib/utils/process/listen");
const promise_1 = require("../../server/lib/utils/promise");
const toaster_1 = require("../../server/lib/toaster");
const Path = __importStar(require("path"));
const installer_iss_js_1 = require("./installer.iss.js");
const line = new arguments_1.Arguments(true);
//Run args configs
line.define({ name: "full", type: Boolean, alias: "A" });
line.define({ name: "fast", type: Boolean, alias: "f" });
line.define({ name: "clean", type: Boolean, alias: "c" });
line.define({ name: "platform", type: String, alias: "p", value: os.platform() });
exports.compileArgs = line.values;
const tsc = (cwd) => {
    var _a, _b, _c, _d;
    console.log("[TSC] start...", cwd);
    const _tsc = (0, child_process_1.spawnSync)("tsc", { cwd: cwd, shell: "cmd" });
    if (_tsc.error)
        console.log(_tsc.error);
    if ((_b = (_a = _tsc.stdout) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a, "utf-8"))
        console.log(_tsc.stdout.toString("utf-8"));
    if ((_d = (_c = _tsc.stderr) === null || _c === void 0 ? void 0 : _c.toString) === null || _d === void 0 ? void 0 : _d.call(_c, "utf-8"))
        console.log(_tsc.stderr.toString("utf-8"));
    console.log("[TSC] start... [END]");
};
function clean(args) {
    const _res = (0, res_1.res)();
    if (args.clean && args.full) {
        fs.rmSync(_res.distRoot, { recursive: true });
    }
    else {
        fs.readdirSync(_res.distRoot).forEach(fileName => {
            try {
                if (fileName === "node_modules")
                    return;
                let state = fs.statSync(path.join(_res.distRoot, fileName));
                if (state.isDirectory())
                    fs.rmSync(path.join(_res.distRoot, fileName), { recursive: true });
                else if (state.isFile())
                    fs.unlinkSync(path.join(_res.distRoot, fileName));
                console.log("[clean:file] ", fileName, "...[OK]");
            }
            catch (ex) {
                console.error(ex);
                (0, toaster_1.appToaster)({
                    title: "Error",
                    message: ex["message"]
                });
                throw ex;
            }
        });
    }
}
exports.clean = clean;
function raw() {
    return __awaiter(this, void 0, void 0, function* () {
        const _res = (0, res_1.res)();
        let filters = [..._res.raws, ..._res.temps];
        for (let i = 0; i < filters.length; i++) {
            let next = filters[i];
            // let dist = path.join( );
            yield (0, recursive_copy_1.default)(path.join(_res.root, next.base), path.join(_res.distRoot, next.dist), {
                filter: next.filter,
                overwrite: true,
                junk: true,
                dot: true,
            }).on(recursive_copy_1.default.events.COPY_FILE_START, function (copyOperation) {
                console.info(`[${next.base}]`, 'Copying file ' + copyOperation.src + '...');
            }).on(recursive_copy_1.default.events.COPY_FILE_COMPLETE, function (copyOperation) {
                console.info(`[${next.base}]`, 'Copied to ' + copyOperation.dest);
            }).on(recursive_copy_1.default.events.ERROR, function (error, copyOperation) {
                console.error(`[${next.base}] ` + 'Unable to copy ' + copyOperation.dest);
            });
        }
    });
}
function installDependency() {
    const _res = (0, res_1.res)();
    let npm = "npm";
    if (os.platform() === "win32") {
        npm = "npm.cmd";
    }
    let nexttable = [
        () => {
            console.log("building kconst configs... DEV");
            return (0, listen_1.processListen)((0, child_process_1.fork)(path.join(_res.root, "build/kconst"), ["--mode", "dev"], {
                cwd: _res.root,
                stdio: "inherit"
            }), {
                stdout(chunk) { console.log(`[install:build] ${chunk.toString()}`); },
                stderr(chunk) { console.log(`[install:build] ${chunk.toString()}`); },
            });
        },
        () => (0, listen_1.processListen)((0, child_process_1.spawn)(npm, ["install", "--only", "production"], {
            cwd: _res.distRoot,
            stdio: "inherit"
        }), {
            stdout(chunk) { console.log(`[dependency:install|prod] ${chunk.toString()}`); },
            stderr(chunk) { console.log(`[dependency:install|prod] ${chunk.toString()}`); }
        }),
        () => (0, listen_1.processListen)((0, child_process_1.spawn)(npm, ["audit", "fix", "--force"], {
            cwd: _res.distRoot,
            stdio: "inherit"
        }), {
            stdout(chunk) { console.log(`[dependency:install|fix-prod] ${chunk.toString()}`); },
            stderr(chunk) { console.log(`[dependency:install|fix-prod] ${chunk.toString()}`); }
        }),
        () => (0, listen_1.processListen)((0, child_process_1.spawn)(npm, ["install", "kconst", "terminal-kit", "--dev"], {
            cwd: _res.distRoot,
            stdio: "inherit"
        }), {
            stdout(chunk) { console.log(`[dependency:install|dev] ${chunk.toString()}`); },
            stderr(chunk) { console.log(`[dependency:install|dev] ${chunk.toString()}`); }
        }),
        () => {
            return new Promise((resolve, reject) => {
                console.log("building kconst configs...");
                require(path.join(_res.distRoot, "build/kconst"));
                //.kconstBulder( path.join( _res.distRoot, "build/kconst" ), "public", "public" );
                fs.rmSync(path.join(_res.distRoot, "build/kconst"), { recursive: true });
                resolve(true);
                // let child = fork( path.join( _res.distRoot, "build/kconst" ), [ "--mode", "public" ], {
                //     cwd: _res.distRoot,
                //     stdio:"inherit"
                // }).on( "exit", code1 => {
                //     if( code1 === 0 ) console.log("building kconst configs...  [OK]" );
                //     else console.log("building kconst configs...  [FAILED]" );
                //
                //     let result = spawnSync( npm, [ "uninstall", "kconst", "terminal-kit" ], { cwd: _res.distRoot });
                //     console.log( result.stdout.toString( "utf-8" ) );
                //     console.log( result.stderr.toString( "utf-8" ) );
                //
                //
                // });
                // return processListen( child, {
                //     stdout( chunk ) { console.log( `[install:build] ${ chunk.toString() }` ) },
                //     stderr( chunk ) { console.log( `[install:build] ${ chunk.toString() }` ) }
                // });
            });
        }
    ];
    let next = () => {
        if (!nexttable.length)
            return;
        let _next = nexttable.shift();
        if (!_next)
            return next();
        console.log(`[dependency:next]`);
        let process = _next();
        (0, promise_1.promiseResolve)(process).then(value => {
            console.log(`[dependency:next|resolved]`);
            next();
        });
    };
    next();
}
function release(args) {
    //language=file-reference
    fs.writeFileSync(Path.join(__dirname, "../../build/compile/installer.iss"), installer_iss_js_1.installerDirective);
    (0, linked_spawn_1.linkedSpawn)("iscc", [
        //language=file-reference
        path.join(__dirname, "./installer.iss")
    ], { pipeConsole: true });
}
function patches(args) {
    (0, linked_spawn_1.linkedSpawn)("iscc", [
        //language=file-reference
        path.join(__dirname, "./patches.iss")
    ], { pipeConsole: true });
}
function deps(args) {
    (0, linked_spawn_1.linkedSpawn)("iscc", [
        //language=file-reference
        path.join(__dirname, "./deps.iss")
    ], { pipeConsole: true });
}
function build(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const _res = (0, res_1.res)();
        console.log("ROOT", _res.root);
        console.log("DIST", _res.distRoot);
        require("../clean").cleanJs(path.join(__dirname, "../../"));
        //language=file-reference
        tsc(path.join(__dirname, "../.."));
        clean(args);
        fs.mkdirSync(_res.distRoot, { recursive: true });
        if (!args.fast)
            yield raw();
        if (args.fast)
            return;
        if (!args.fast)
            installDependency();
    });
}
line.defineCommand({ name: "destroy", callback: receiver => {
        exports.compileArgs.clean = true;
        exports.compileArgs.full = true;
        clean(exports.compileArgs);
    } });
line.defineCommand({ name: "nexe", callback: receiver => {
        tsc(path.join(__dirname, "../.."));
        (0, nexe_1.nexeStart)().then(value => {
            console.log(value);
            console.log("NEXE: compiled");
        });
    } });
line.defineCommand({ name: "start", callback: receiver => {
        build(receiver.options).then();
    } });
line.defineCommand({ name: "release", callback: receiver => {
        release(receiver.options);
    } });
line.defineCommand({ name: "release:patches", callback: receiver => {
        patches(receiver.options);
    } });
line.defineCommand({ name: "release:deps", callback: receiver => {
        deps(receiver.options);
    } });
line.execute();
//# sourceMappingURL=index.js.map