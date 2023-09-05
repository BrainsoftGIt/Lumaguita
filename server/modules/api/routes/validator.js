"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkLicenseValida = void 0;
const moment_1 = __importDefault(require("moment"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const project_1 = require("../../../global/project");
const args_1 = require("../../../global/args");
const licenseFile = "License.txt";
const { generateEncryptionKey } = require("../../../lib/crypto/cryptoFile");
const encryptor = require('simple-encryptor')(generateEncryptionKey());
function getClusterServer() {
    return require("../../../service/cluster.service").clusterServer;
}
let checker = {
    get isRoot() {
        return getClusterServer().isRoot();
    },
    get license() {
        var _a, _b;
        return (_b = (_a = getClusterServer()) === null || _a === void 0 ? void 0 : _a.localCluster) === null || _b === void 0 ? void 0 : _b.cluster_license;
    },
    get hasClusterServer() {
        return !!getClusterServer();
    },
    get hasLicense() {
        return !!this.license;
    }, get isValidLicense() {
        const currentDate = (0, moment_1.default)().format("YYYY-MM-DD");
        const license = (0, moment_1.default)(this.license).format("YYYY-MM-DD");
        return (0, moment_1.default)(currentDate).isSameOrBefore((0, moment_1.default)(license).format("YYYY-MM-DD"));
    },
    get isValidClock() {
        // Pela primeira vez
        if (!fs_1.default.existsSync(path_1.default.join(project_1.folders.files, 'license', licenseFile))) {
            fs_1.default.mkdirSync(path_1.default.join(project_1.folders.files, 'license'), { recursive: true });
            saveDateTimeLicense({ data: new Date().getTime() });
        }
        let data = fs_1.default.readFileSync(path_1.default.join(project_1.folders.files, 'license', licenseFile), 'utf8');
        const lastCheckTime = encryptor.decrypt(data);
        let _isValidClock = (new Date().getTime()) >= lastCheckTime;
        if (_isValidClock)
            saveDateTimeLicense({ data: new Date().getTime() });
        return _isValidClock;
    }
};
let checkHasLicense = (req, res, next) => {
    if (args_1.args.appMode === "dev")
        return next();
    let _next = () => {
        if (!checker.hasClusterServer) {
            return setTimeout(_next, 1000 * 5);
        }
        if (checker.isRoot) {
            next();
        }
        else if (checker.hasLicense) {
            next();
        }
        else {
            res.status(403);
            res.setHeader("Content-Type", "text/html");
            res.redirect("/license.html");
        }
    };
    _next();
};
function checkLicenseValida(req, res, next) {
    if (args_1.args.appMode === "dev")
        return next();
    checkHasLicense(req, res, () => {
        if (checker.isRoot) {
            return next();
        }
        else if (!checker.isValidClock) {
            res.status(403);
            res.setHeader("Content-Type", "text/html");
            return res.redirect("/changeDate.html");
        }
        else if (!checker.isValidLicense) {
            res.status(403);
            res.setHeader("Content-Type", "text/html");
            return res.redirect("/renovar.html");
        }
        else {
            next();
        }
    });
}
exports.checkLicenseValida = checkLicenseValida;
function saveDateTimeLicense({ data }) {
    fs_1.default.writeFileSync(path_1.default.join(project_1.folders.files, "license", licenseFile), encryptor.encrypt(data));
}
//# sourceMappingURL=validator.js.map