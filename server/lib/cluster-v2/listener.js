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
exports.Listener = void 0;
const Path = __importStar(require("path"));
class Listener {
    constructor(context, app, base) {
        this.context = context;
        this.app = app;
        this.base = Path.join(base || "/", "revision-v2");
        this.startListen();
    }
    startListen() {
        this.app.use(`${this.base}/:event/*`, (req, res, next) => {
            let event = req.params.event;
            let fullPath = req.baseUrl + req.path;
            let eventPath = Path.join(this.base, event);
            let relative = Path.relative(eventPath, fullPath);
            let path = {
                base: this.base,
                full: fullPath,
                relative: relative,
                event: eventPath
            };
        });
    }
}
exports.Listener = Listener;
//# sourceMappingURL=listener.js.map