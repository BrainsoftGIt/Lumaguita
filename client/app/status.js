"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nwAppStatus = exports.ListenEvent = void 0;
const ctrl_1 = require("../../server/extension/ctrl");
const _once = new Proxy({}, {
    get(target, p, receiver) {
        if (!target[p])
            target[p] = [];
        return target[p];
    }
});
const _on = new Proxy({}, {
    get(target, p, receiver) {
        if (!target[p])
            target[p] = [];
        return target[p];
    }
});
var ListenEvent;
(function (ListenEvent) {
    ListenEvent["ANY"] = "*";
})(ListenEvent = exports.ListenEvent || (exports.ListenEvent = {}));
exports.nwAppStatus = {
    isNwMode: false,
    runningIntoNW: false,
    status: "init",
    notify(event, ...args) {
        console.log(event, ...args);
        // _on[ event ].forEach( cb => cb( ...a rgs ) );
        // _once[ event ].splice(0, _once[ event ].length ).forEach( cb => cb( ...args ) );
        // _on[ ListenEvent.ANY ].forEach( cb => cb( ...args ) );
        // _once[ ListenEvent.ANY ].splice(0, _once[ event ].length ).forEach( cb => cb( ...args ) );
        (0, ctrl_1.ctrlBroadcast)(event, ...args);
    },
    on(event, cb) {
        _on[event].push(cb);
    },
    once(event, cb) {
        _once[event].push(cb);
    }
};
//# sourceMappingURL=status.js.map