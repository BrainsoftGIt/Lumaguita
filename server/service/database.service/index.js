"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replicateFactory = exports.factoryClinic = exports.factory = exports.debugResponse = exports.DBK = exports.Templates = exports.Result = exports.Types = exports.PostgresFactory = void 0;
const zoo_pg_1 = require("zoo.pg");
var zoo_pg_2 = require("zoo.pg");
Object.defineProperty(exports, "PostgresFactory", { enumerable: true, get: function () { return zoo_pg_2.PostgresFactory; } });
Object.defineProperty(exports, "Types", { enumerable: true, get: function () { return zoo_pg_2.Types; } });
Object.defineProperty(exports, "Result", { enumerable: true, get: function () { return zoo_pg_2.Result; } });
Object.defineProperty(exports, "Templates", { enumerable: true, get: function () { return zoo_pg_2.Templates; } });
var DBK_1 = require("../../global/autogen/DBK");
Object.defineProperty(exports, "DBK", { enumerable: true, get: function () { return DBK_1.DBK; } });
const args_1 = require("../../global/args");
const proxyFinder = () => {
    return new Proxy({}, {
        get(target, p, receiver) {
            if (target[p] === undefined)
                target[p] = proxyFinder();
            return target[p];
        }
    });
};
function debugResponse(response) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    if ((_b = (_a = response === null || response === void 0 ? void 0 : response.row) === null || _a === void 0 ? void 0 : _a.main) === null || _b === void 0 ? void 0 : _b.error)
        console.error(response, (_d = (_c = response === null || response === void 0 ? void 0 : response.row) === null || _c === void 0 ? void 0 : _c.main) === null || _d === void 0 ? void 0 : _d.error);
    if ((_e = response === null || response === void 0 ? void 0 : response.error) === null || _e === void 0 ? void 0 : _e.context)
        console.error(response);
    else if ((_g = (_f = response === null || response === void 0 ? void 0 : response.row) === null || _f === void 0 ? void 0 : _f.error) === null || _g === void 0 ? void 0 : _g.context)
        console.error(response, (_j = (_h = response === null || response === void 0 ? void 0 : response.row) === null || _h === void 0 ? void 0 : _h.error) === null || _j === void 0 ? void 0 : _j.context);
    else if ((_o = (_m = (_k = response === null || response === void 0 ? void 0 : response.rows) === null || _k === void 0 ? void 0 : _k[((_l = response === null || response === void 0 ? void 0 : response.rows) === null || _l === void 0 ? void 0 : _l.length) - 1]) === null || _m === void 0 ? void 0 : _m.error) === null || _o === void 0 ? void 0 : _o.context)
        console.error(response);
    else if ((_r = (_q = (_p = response === null || response === void 0 ? void 0 : response.rows) === null || _p === void 0 ? void 0 : _p[0]) === null || _q === void 0 ? void 0 : _q.error) === null || _r === void 0 ? void 0 : _r.context)
        console.error(response);
    else if ((_s = response === null || response === void 0 ? void 0 : response.message) === null || _s === void 0 ? void 0 : _s.context)
        console.error(response);
}
exports.debugResponse = debugResponse;
exports.factory = new zoo_pg_1.PostgresFactory({
    host: args_1.args.dbHost,
    port: args_1.args.dbPort,
    database: args_1.args.dbName,
    user: args_1.args.dbUser,
    password: args_1.args.dbPassword,
});
exports.factoryClinic = new zoo_pg_1.PostgresFactory({
    host: args_1.args.dbHostClinic,
    port: args_1.args.dbPort,
    database: args_1.args.dbNameClinic,
    user: args_1.args.dbUserClinic,
    password: args_1.args.dbPasswordClinic,
});
exports.replicateFactory = new zoo_pg_1.PostgresFactory({
    host: args_1.args.dbHost,
    port: args_1.args.dbPort,
    database: args_1.args.dbName,
    user: args_1.args.dbUserClone,
    password: args_1.args.dbPasswordClone,
});
//# sourceMappingURL=index.js.map