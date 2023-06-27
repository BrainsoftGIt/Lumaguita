"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionsType = void 0;
const index_1 = require("../index");
const project_1 = require("../../../global/project");
const srv_1 = require("../../../global/autogen/config/srv");
const database_service_1 = require("../../database.service");
const args_1 = require("../../../global/args");
function postgresSession(sessionConfig) {
    let { name, secret, resave, saveUninitialized, storeConfig, cookie } = (sessionConfig || {});
    const session = require('express-session');
    if (!name)
        name = "connect.sid";
    name = `${name}:${args_1.args.appPort}`;
    const pgSession = require('connect-pg-simple')(session);
    index_1.app.use(session({
        name,
        secret,
        resave,
        saveUninitialized,
        cookie,
        store: new pgSession(storeConfig),
    }));
}
exports.sessionsType = {
    ["pg-session"]: () => {
        console.log("session://pg-session");
        postgresSession({
            secret: srv_1.srv.SERVER.SESSION.SECRETE,
            resave: true,
            saveUninitialized: true,
            storeConfig: {
                pool: database_service_1.factory.createPool(),
                tableName: "session",
                schemaName: "auth"
            },
            cookie: { maxAge: args_1.args.webMaxCookieAge }
        });
    },
    ["file-session"]: () => {
        console.log("session://file-session");
        const session = require('express-session');
        const FileStore = require('session-file-store')(session);
        index_1.app.use(session({
            store: new FileStore({ path: project_1.folders.sessions }),
            secret: srv_1.srv.SERVER.SESSION.SECRETE,
            resave: true,
            saveUninitialized: true,
            cookie: { maxAge: args_1.args.webMaxCookieAge },
        }));
    }
};
let useSession = exports.sessionsType[args_1.args.webSession];
if (!useSession)
    useSession = exports.sessionsType["file-session"];
useSession();
index_1.app.use((req, res, next) => {
    //If not has session
    if (req.session && Object.keys(req.session).length <= 1) {
        req.session.save(() => next());
    }
    else
        next();
});
//# sourceMappingURL=session.js.map