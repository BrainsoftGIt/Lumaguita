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
//Static declarations
exports.app.use(express_1.default.static(project_1.folders.public));
//Body Parser
require('./middlewares/vhost');
require('./middlewares/body-parser');
// Cookie Parser
require('./middlewares/cookie');
// Session Express
require('./middlewares/session');
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
// app.use( "/cluster/resource/:cluster", ( req, res)=>{
//     res.send( {
//         url:req.url,
//         path: req.path,
//         baseUrl: req.baseUrl,
//     } );
// })
//# sourceMappingURL=index.js.map