"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULTS = void 0;
const path_1 = __importDefault(require("path"));
const os = __importStar(require("os"));
exports.DEFAULTS = new Proxy({
    APP: "MAGUITA",
    APP_PROD: "LUMA",
    APP_TEST: "MAGUITA",
    APP_NAME: "Luma",
    APP_VERSION_CODE: 2,
    APP_PORT: 49278,
    APP_HOME: path_1.default.join(__dirname, '../../'),
    APP_HOME_LOCATION: "system",
    APP_PACKAGE: "com.brainsoftstp.maguita",
    APP_USER: os.userInfo().username,
    APP_LAUNCHER: "index.ts",
    APP_MODE: "dev",
    APP_RUN_LOCATION: "local",
    APP_REVISION_LIMIT: 300,
    DB_VERSION: 13,
    DB_VERSION_UP: true,
    DB_PORT: 5432,
    DB_LOCAL_PORT: 54433,
    DB_HOST: "localhost",
    DB_NAME: "maguita",
    DB_SUPERUSER: "postgres",
    DB_USERNAME: "maguita",
    DB_USERNAME_CLONE: "maguita_clone",
    WEB_PROTOCOL: "http",
    WEB_SESSION: "file-session",
    WEB_COOKIE_MAX_AGE: 315360000000,
    WEB_DOMAINS_LUMA: "luma.brainsoftstp.com",
    WEB_DOMAINS_MAGUITA: "maguita.test.brainsoftstp.com",
}, {
    set(target, p, value, receiver) {
        throw new Error("DEFAULT FIELD CAN NOT BE CHANGE");
    }
});
//# sourceMappingURL=defaults.js.map