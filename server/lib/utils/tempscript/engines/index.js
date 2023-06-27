"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefinePath = exports.DefineEnv = exports.DefineCommand = void 0;
class DefineCommand {
    constructor(command, ...args) {
        this.command = command;
        this.args = args;
    }
}
exports.DefineCommand = DefineCommand;
class DefineEnv {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
exports.DefineEnv = DefineEnv;
class DefinePath {
    constructor(path, mode) {
        this.path = path;
        this.mode = mode;
    }
}
exports.DefinePath = DefinePath;
//# sourceMappingURL=index.js.map