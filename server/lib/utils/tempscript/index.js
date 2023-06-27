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
exports.TempScript = void 0;
const fs_1 = __importDefault(require("fs"));
const tmp_1 = __importDefault(require("tmp"));
const Path = __importStar(require("path"));
class TempScript {
    constructor(engine) {
        this.definitions = [];
        this.autoUnlink = true;
        this.engine = engine;
    }
    command(command, ...args) {
        this.definitions.push(this.engine.command.instance(command, ...args));
        return this;
    }
    env(key, value) {
        this.definitions.push(this.engine.env.instance(key, value));
        return this;
    }
    path(path, mode) {
        this.definitions.push(this.engine.path.instance(path, mode));
        return this;
    }
    get script() {
        let filename = "";
        const tempFile = tmp_1.default.fileSync({
            prefix: "temp-script",
            postfix: `script${this.engine.extension}`
        });
        filename = tempFile.name;
        let lines = this.definitions.map(value => value.define);
        if (this.autoUnlink) {
            lines.push(this.engine.unlinkFile(filename));
        }
        const raw = lines.join("\r\n");
        fs_1.default.mkdirSync(Path.dirname(filename), { recursive: true });
        fs_1.default.writeFileSync(filename, raw);
        const remove = () => {
            fs_1.default.unlinkSync(filename);
        };
        return {
            filename,
            raw,
            remove
        };
    }
}
exports.TempScript = TempScript;
//# sourceMappingURL=index.js.map