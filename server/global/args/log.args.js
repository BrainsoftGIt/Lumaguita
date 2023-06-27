"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const srv_1 = require("../autogen/config/srv");
const index_1 = require("./index");
const { define, hide } = (0, index_1.lineDefiner)(Object.assign({}, srv_1.srv.SERVER.SESSION, { PORT: srv_1.srv.SERVER.PORT }));
//Express args configs
define("logLevel", String, {});
define("logSnapshot", Boolean, { val: false });
//# sourceMappingURL=log.args.js.map