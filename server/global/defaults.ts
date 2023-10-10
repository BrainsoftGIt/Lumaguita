import path from "path";
import * as os from "os";

export const DEFAULTS = new Proxy({
    APP: "MAGUITA",
    APP_PROD: "LUMA",
    APP_TEST: "MAGUITA",

    APP_NAME : "Luma",
    APP_VERSION_CODE: 2,

    APP_PORT: 49278,
    APP_HOME : path.join( __dirname, '../../' ),
    APP_HOME_LOCATION : "system",
    APP_PACKAGE : "com.brainsoftstp.maguita",
    APP_USER: os.userInfo().username,
    APP_LAUNCHER: "index.ts",
    APP_MODE: "dev",
    APP_RUN_LOCATION: "local",
    APP_REVISION_LIMIT: 300,

    DB_VERSION : 13,
    DB_VERSION_UP : true,

    DB_PORT : 5432,
    DB_LOCAL_PORT : 54433,
    DB_HOST : "localhost",
    DB_NAME : "maguita",
    DB_SUPERUSER : "postgres",
    DB_USERNAME : "maguita",
    DB_USERNAME_CLONE : "maguita_clone",
    DB_SERVICE_NAME : "lumaguita-database-service",


    WEB_PROTOCOL: "http",
    WEB_SESSION: "file-session",
    WEB_COOKIE_MAX_AGE:315360000000,
    WEB_DOMAINS_LUMA: "luma.brainsoftstp.com",
    WEB_DOMAINS_MAGUITA: "maguita.test.brainsoftstp.com",

}, {
    set(target, p: PropertyKey, value: any, receiver: any): boolean {
        throw new Error( "DEFAULT FIELD CAN NOT BE CHANGE")
    }
});

