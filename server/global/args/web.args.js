"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const srv_1 = require("../autogen/config/srv");
const index_1 = require("./index");
const { define, hide } = (0, index_1.lineDefiner)(Object.assign({}, srv_1.srv.SERVER.SESSION, { PORT: srv_1.srv.SERVER.PORT }));
//Express args configs
define("webProtocol", String, { def: "WEB_PROTOCOL" });
define("webSession", String, { def: "WEB_SESSION" });
define("webWithCache", Boolean, { val: false });
define("webMaxCookieAge", Number, { conf: "COOKIE_MAX_AGE", def: "WEB_COOKIE_MAX_AGE" });
let webDomain = process.env["MAGUITA_WEB_DOMAIN"];
define("webDomain", String, { val: webDomain });
//# sourceMappingURL=web.args.js.map