"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.excludeAny = exports.excludeAll = exports.includeAny = exports.includeAll = void 0;
function includeAll(array, ...checks) {
    return !checks.find(value => !array.includes(value));
}
exports.includeAll = includeAll;
function includeAny(array, ...checks) {
    return !!checks.find(value => array.includes(value));
}
exports.includeAny = includeAny;
function excludeAll(array, ...checks) {
    return !checks.find(value => array.includes(value));
}
exports.excludeAll = excludeAll;
function excludeAny(array, ...checks) {
    return !!checks.find(value => !array.includes(value));
}
exports.excludeAny = excludeAny;
//# sourceMappingURL=array.js.map