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
exports.appVersion = exports.releaseServer = void 0;
const fs_1 = __importDefault(require("fs"));
const Path = __importStar(require("path"));
const axios_1 = __importDefault(require("axios"));
const os_1 = __importDefault(require("os"));
const https = __importStar(require("https"));
exports.releaseServer = "https://release.brainsoftstp.com";
exports.appVersion = {
    currentVersion() {
        //language=file-reference
        let versionFile = Path.join(__dirname, "../../../VERSION");
        if (!fs_1.default.existsSync(versionFile))
            return false;
        let lines = fs_1.default.readFileSync(versionFile).toString("utf-8").trim().split("\n");
        let appName = lines[0].trim().toLowerCase();
        let currentVersion = lines[1].trim();
        let versionCode = currentVersion.split(".").join("");
        let versionNumber = Number(versionCode);
        return { currentVersion, versionCode, versionNumber, appIdentifier: appName };
    }, checkVersionUpdate() {
        let current = this.currentVersion();
        if (!current)
            return Promise.resolve(null);
        let { currentVersion, versionCode, versionNumber, appIdentifier } = current;
        let url = `${exports.releaseServer}/release/${appIdentifier}`;
        return new Promise((resolve, reject) => {
            axios_1.default.get(url, {
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            }).then(value => {
                var _a;
                if (!currentVersion)
                    return Promise.resolve(null);
                if (value.status !== 200)
                    return resolve(null);
                if (!value.data)
                    return resolve(null);
                let data = value.data;
                if (typeof data === "string")
                    try {
                        data = JSON.parse(data);
                    }
                    catch (e) {
                        data = null;
                    }
                if (!data)
                    return resolve(null);
                console.table(data);
                let lasted = data["lasted"];
                if (!lasted)
                    return resolve(null);
                let lastedVersionCode = Number(lasted === null || lasted === void 0 ? void 0 : lasted["versionCode"]);
                if (!Number.isSafeInteger(lastedVersionCode))
                    return resolve(null);
                if (lastedVersionCode <= versionNumber)
                    return resolve(null);
                return resolve(`${exports.releaseServer}/${(_a = lasted === null || lasted === void 0 ? void 0 : lasted["distPath"]) === null || _a === void 0 ? void 0 : _a[os_1.default.platform()]}`);
            }).catch(reason => {
                console.error(url, reason.message);
                resolve(null);
            });
        });
    }
};
//# sourceMappingURL=app.js.map