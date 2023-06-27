"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const srv_1 = require("../autogen/config/srv");
const defaults_1 = require("../defaults");
const status_1 = require("../../launcher/status");
const { define, hide } = (0, index_1.lineDefiner)(Object.assign({}, srv_1.srv.SERVER.SESSION, { PORT: srv_1.srv.SERVER.PORT }));
//Run args configs
define("app", String, { def: "APP" });
define("appPort", Number, { conf: "PORT", def: "APP_PORT", alias: "p" });
define("appDebug", Boolean, { val: false });
define("appUser", String, { def: "APP_USER", val: "@brainsoft" });
//@ts-ignore
define("appMode", String, { def: "APP_MODE", alias: "m" });
define("appLocation", String, { def: "APP_RUN_LOCATION" });
define("appNoCli", Boolean, { val: false });
define("appSelfMaster", Boolean);
define("appMasterDomain", String);
define("appRevisionsLimit", Number, { def: "APP_REVISION_LIMIT" });
define("appRoot", Boolean, { val: false });
define("appWithNodeWebKit", Boolean, { val: false });
(0, index_1.onPrepareArgs)((args) => {
    status_1.launcherStatus.launcher = status_1.launcherStatus.launcher || "index.ts";
    if (args.appMode === "prod") {
        args.appSelfMaster = true;
        args.appNoCli = true;
        if (!args.app)
            args.app = defaults_1.DEFAULTS.APP_PROD;
        if (!args.webDomain)
            args.webDomain = defaults_1.DEFAULTS.WEB_DOMAINS_LUMA;
    }
    else if (args.appMode === "test") {
        args.appSelfMaster = true;
        args.appNoCli = true;
        if (!args.webDomain)
            args.webDomain = defaults_1.DEFAULTS.WEB_DOMAINS_MAGUITA;
        if (!args.app)
            args.app = defaults_1.DEFAULTS.APP_TEST;
    }
    else if (["public", "exe"].includes(args.appMode)) {
        args.appNoCli = true;
    }
    if (args.webDomain)
        args.webDomain = args.webDomain.toLowerCase();
});
//# sourceMappingURL=app.args.js.map