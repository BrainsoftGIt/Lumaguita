"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = void 0;
exports.listen = {
    value: Math.trunc(Math.random() * 888888),
    handlers: [],
    notify(...data) {
        exports.listen.handlers.forEach(value => value(...data));
    }
};
//# sourceMappingURL=listen.js.map