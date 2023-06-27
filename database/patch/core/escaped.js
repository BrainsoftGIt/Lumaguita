"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapedParameter = exports.EscapedParameter = void 0;
const types_1 = require("zoo.pg/lib/types");
class EscapedParameter extends types_1.PreparedParameter {
    constructor(escaped, noEscaped) {
        super({
            type: "",
            value: null,
            literal: escaped,
            pre: "",
            post: "",
            simple: noEscaped || escaped,
            name: escaped
        });
        this.name = escaped;
    }
}
exports.EscapedParameter = EscapedParameter;
function escapedParameter(value) {
    let mutable = new EscapedParameter(value);
    return (new Proxy(mutable, {
        set(target, p, value, receiver) {
            return true;
        }
    }));
}
exports.escapedParameter = escapedParameter;
//# sourceMappingURL=escaped.js.map