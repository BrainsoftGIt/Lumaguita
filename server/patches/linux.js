"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patches = void 0;
const os_1 = __importDefault(require("os"));
function patches() {
    if (os_1.default.platform() === "linux") {
    }
}
exports.patches = patches;
//# sourceMappingURL=linux.js.map