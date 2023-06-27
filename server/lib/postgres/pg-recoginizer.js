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
exports.pgServer = void 0;
const version_1 = require("./tools/version");
require('source-map-support').install();
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const child_process_1 = require("child_process");
const CLI = [
    'postgres',
    'psql',
    'initdb',
    'pg_ctl',
    'pg_dump',
    'clusterdb',
    'createdb',
    'createuser',
];
exports.pgServer = new class PGDetector {
    recognizePath(VERSION, verup = true) {
        return exports.pgServer.detect(VERSION, verup).then(_detect => {
            var _a, _b;
            if (_detect && _detect.isSupported && !_detect.inPath) {
                return (_b = (_a = ({
                    win32() {
                        let _path = process.env["Path"].split(path.delimiter);
                        _path = _path.filter(value => value.length && value !== _detect.base);
                        _path.unshift(path.normalize(_detect.base));
                        process.env["Path"] = _path.join(path.delimiter);
                        const apply = exports.pgServer.recognize(VERSION, verup);
                        return Promise.resolve({
                            before: _detect,
                            after: apply
                        });
                    }
                }))[os.platform()]) === null || _b === void 0 ? void 0 : _b.call(_a);
            }
            return Promise.resolve({
                before: _detect,
                after: _detect
            });
        });
    }
    isRecognized(VERSION, canUp = true) {
        const _detect = this.recognize(VERSION, canUp);
        return this.isSupported(_detect);
    }
    isSupported(_detect) {
        return _detect
            && _detect.isValid
            && _detect.isSupported;
    }
    detectAll(VERSION, up = true, cli, stopOnDetectSupported) {
        var _a;
        let _detections = [];
        let _detect = this.recognize(VERSION, up, cli);
        if (_detect)
            _detections.push(_detect);
        if (_detect && _detect.isSupported && stopOnDetectSupported)
            return Promise.resolve(_detections);
        let _os = (_a = ({
            win32: this.__win32
        })) === null || _a === void 0 ? void 0 : _a[os.platform()];
        if (_os) {
            return _os(this, VERSION, up, _detections, stopOnDetectSupported);
        }
        else {
            return Promise.resolve(_detections);
        }
    }
    __win32(self, VERSION, up, _detections, stopOnDetectSupported, cli) {
        return require('./pg-register').scanPostgresRegisters().then(registers => {
            if (!registers.length)
                return Promise.resolve(_detections);
            return new Promise(resolve => {
                registers = registers.filter(value => value.type === "Installations");
                for (let i = 0; i < registers.length; i++) {
                    let __path = path.join(registers[i].base, "bin");
                    const _detect = self.recognize(VERSION, up, cli, __path);
                    if (_detect) {
                        _detections.push(_detect);
                    }
                    if (_detect && _detect.isSupported && stopOnDetectSupported)
                        return resolve(_detections);
                }
                return resolve(_detections);
            });
        });
    }
    detect(VERSION, up = true, cli) {
        return this.detectAll(VERSION, up, cli, true).then(value => {
            return Promise.resolve(value.find(detected => detected && detected.isValid && detected.isSupported));
        });
    }
    recognize(VERSION, up = true, cli, envPath) {
        if (!cli || !cli.length)
            cli = CLI;
        let exe = "";
        let _where = "whereis";
        if (os.platform() === "win32") {
            exe = ".exe";
            _where = "where";
        }
        const detected = {};
        if (!VERSION)
            VERSION = 0;
        VERSION = Math.trunc(VERSION);
        let useCli = CLI.filter(value => cli.includes(value));
        const opts = {};
        if (envPath && os.platform() === "win32") {
            const _path = process.env["Path"].split(path.delimiter);
            _path.unshift(envPath);
            opts.env = Object.assign({
                "Path": _path.join(path.delimiter)
            });
        }
        let firstCommand;
        let lastCommand;
        useCli.forEach(request => {
            lastCommand = request;
            if (!firstCommand)
                firstCommand = request;
            detected[request] = (0, version_1.postgresToolVersion)(request, envPath);
        });
        let isValid = true;
        let _break = () => {
            isValid = false;
            return true;
        };
        let preview;
        useCli.some(req => {
            let next = detected[req];
            if (!next)
                return _break();
            if (!next.isValid)
                return _break();
            if (preview && preview.name !== next.name)
                return _break();
            if (preview && preview.version !== next.version)
                return _break();
            if (preview && preview.versionNumber !== next.versionNumber)
                return _break();
            if (preview && preview.majorVersion !== next.majorVersion)
                return _break();
            if (preview && preview.minorVersion !== next.minorVersion)
                return _break();
            preview = next;
        });
        if (!isValid)
            return null;
        const result = (0, child_process_1.spawnSync)(_where, [firstCommand + exe], opts);
        const base = path.dirname(path.join(result.stdout.toString("utf-8").trim()));
        const MAJOR_VERSION = detected[firstCommand].majorVersion;
        let camSupport = isValid
            && (MAJOR_VERSION === VERSION || (MAJOR_VERSION > VERSION && up));
        const isSame = isValid && VERSION === MAJOR_VERSION;
        let code = 0;
        if (isValid)
            code++;
        if (camSupport)
            code++;
        if (isSame)
            code++;
        const bestCode = 3;
        return {
            get isValid() { return isValid; },
            get isSupported() { return camSupport; },
            get isSame() { return isSame; },
            get code() { return code; },
            get bestCode() { return bestCode; },
            get inPath() { return !envPath; },
            get base() { return base; },
            get detections() { return Object.assign({}, detected); },
        };
    }
};
//# sourceMappingURL=pg-recoginizer.js.map