"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.statics = exports.acceptors = exports.listen = exports.resolvers = exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const page_resolve_1 = require("zoo.util/lib/page-resolve");
const db_1 = require("../../global/autogen/config/db");
const project_1 = require("../../global/project");
const args_1 = require("../../global/args");
const multerConfig = require("../../lib/multer/config");
console.log("[MAGUITA] WebService>", `building service ${args_1.args.app}`, `${args_1.args.webProtocol}://127.0.0.1:${args_1.args.appPort}`);
exports.app = (0, express_1.default)();
//////////////////// MIDDLEWARES ////////////////////
require("./middlewares/remote/route.remote");
require("../../modules/api/routes/check-static");
const etag_1 = require("./etag");
const version_1 = require("../../version");
console.log({ E_TAG_VERSION: etag_1.E_TAG_VERSION });
//Static declarations
let localStaticResource = express_1.default.static(project_1.folders.public, {
    immutable: false,
    cacheControl: true,
    setHeaders(res) {
        console.log(res.getHeaders());
        res.setHeader("ETag", etag_1.E_TAG_VERSION);
    }
});
let remoteStaticResource = express_1.default.static(project_1.folders.public, {
    cacheControl: true,
    maxAge: 1000 * 60 * 60 * 24 * 30 * 12,
    setHeaders(res) {
        res.setHeader("ETag", etag_1.E_TAG_VERSION);
    }
});
//Body Parser
// require( './middlewares/vhost' );
require('./middlewares/body-parser');
// Cookie Parser
require('./middlewares/cookie');
// Session Express
require('./middlewares/session');
//http://zootakuxy6.luma.brainsoftstp.com/
//http://v207.pirata.luma.brainsoftstp.com/
const BASE_REMOTE = "luma.brainsoftstp.com";
const RESOLVE_REGEXP = new RegExp(`(^[a-zA-Z0-9]+\\.${BASE_REMOTE})$|^v[a-zA-Z0-9]+\\.[a-zA-Z0-9]+\\.${BASE_REMOTE}$`);
let redirect = {};
let versionCode = `v${version_1.VERSION.NUMBER.split(".").join("")}`;
let switchVersion = "/switch-version";
exports.app.use((req, res, next) => {
    if (RESOLVE_REGEXP.test(req.headers.host)) {
        let domainsParts = req.headers.host.split(".");
        // v1.client.luma.brainsoftstp.com
        //    client.luma.brainsoftstp.com
        let [client, eTagVersion] = domainsParts.reverse().filter((value, index) => index > 2);
        if (!eTagVersion || eTagVersion !== versionCode) {
            const existingQueryParams = Object.entries(req.query).map(([key, value]) => `${key}=${value}`).join('&');
            let redirectCode = Math.trunc((Math.random() * (999999999 - 100000000)) + 100000000);
            const redirectUrl = `${req.protocol}://${versionCode}.${client}.${BASE_REMOTE}${switchVersion}?code=${redirectCode}`;
            redirect[redirectCode] = {
                query: existingQueryParams,
                session: req.session,
                path: req.path
            };
            return res.redirect(redirectUrl);
        }
        return remoteStaticResource(req, res, next);
    }
    return localStaticResource(req, res, next);
});
exports.app.use(switchVersion, (req, res, next) => {
    var _a;
    let redirectCode = req.query.code;
    let status = redirect[redirectCode];
    let redirectUrl = `${req.protocol}://${req.headers.host}`;
    if (!status)
        return next();
    delete redirect[redirectCode];
    Object.entries(status.session || {}).forEach(([key, value], index) => {
        req.session[key] = value;
    });
    redirectUrl += `${status.path}`;
    if ((_a = status.query) === null || _a === void 0 ? void 0 : _a.length)
        redirectUrl += `?` + status.query;
    return res.redirect(redirectUrl);
});
//////////////////// GLOBAL CONFs ////////////////////
// app.use("/storage", express.static(folders.files));
exports.app.use(multerConfig());
//View engine setup
exports.app.set('views', [project_1.folders.views, project_1.folders.public]);
exports.app.set('view engine', 'ejs');
//Cors
const cors = require('cors');
exports.app.use(cors());
//On Listener
console.log(`using connection host: ${db_1.db.dbConfig.host}, port: ${db_1.db.dbConfig.port}, user: ${db_1.db.dbConfig.user}, database: ${db_1.db.dbConfig.database}`);
exports.server = require(args_1.args.webProtocol).createServer({}, exports.app);
exports.server.listen(args_1.args.appPort, (...values) => {
    console.log("[MAGUITA] Service>", `Running webserver application ${args_1.args.app} on`, `${args_1.args.webProtocol}://127.0.0.1:${args_1.args.appPort}`, "...values", ...values);
});
console.log("[MAGUITA] WebService>", `building service ${args_1.args.app}`, `${args_1.args.webProtocol}://127.0.0.1:${args_1.args.appPort}`, "ok...");
//Statics files
_a = (0, page_resolve_1.PageResolve)({
    folders: project_1.folders,
    dirSlash: true,
    hiddenIndex: true
}), exports.resolvers = _a.resolvers, exports.listen = _a.listen, exports.acceptors = _a.acceptors;
exports.statics = { resolvers: exports.resolvers, acceptors: exports.acceptors };
exports.app.use("/", exports.listen);
//# sourceMappingURL=index.js.map