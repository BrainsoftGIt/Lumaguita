"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifierOf = void 0;
const colors_1 = require("./colors");
function identifierOf(source) {
    var _a, _b;
    if (!source.cluster_identifier && !source.cluster_name)
        return "";
    return colors_1.colors.identifier(`${(_a = source.cluster_identifier) !== null && _a !== void 0 ? _a : ""}@${(_b = source.cluster_name) !== null && _b !== void 0 ? _b : ""}`);
}
exports.identifierOf = identifierOf;
//# sourceMappingURL=types.js.map