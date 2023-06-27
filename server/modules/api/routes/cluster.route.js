"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_service_1 = require("../../../service/web.service");
const cluster_service_1 = require("../../../service/cluster.service");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const enuns_1 = require("../../../lib/cluster/enuns");
const project_1 = require("../../../global/project");
const database_service_1 = require("../../../service/database.service");
const zoo_pg_1 = require("zoo.pg");
web_service_1.app.post("/api/clusters/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadClusters } = require("../db/call-function-cluster");
    const response = yield functLoadClusters(null);
    res.json({ clusters: response.rows });
}));
web_service_1.app.post("/api/cluster", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functRegCluster } = require("../db/call-function-cluster");
    const response = yield functRegCluster(req.body);
    res.json({ result: response.row.main.result, data: response.row.main.message });
    if (response.row.main.result) {
        if (parseInt(req.body.cluster_type) === 4) {
            let object = { cluster_name: response.row.main.data.child.cluster_name, cluster_identifier: response.row.main.data.child.cluster_identifier,
                cluster_path: response.row.main.data.child.cluster_path };
            cluster_service_1.clusterServer.notifyRemoteChange(object, {
                event: "CLUSTER:REG",
                extras: null,
                message: "Registo de cluster"
            });
        }
        else if (parseInt(req.body.cluster_type) === 2) {
            cluster_service_1.clusterServer.notifyChangeConfigs();
        }
    }
}));
web_service_1.app.post("/api/cluster/change/license", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functChangeClusterLicense } = require("../db/call-function-cluster");
    const response = yield functChangeClusterLicense(req.body);
    res.json({ result: response.row.main.result, data: response.row.main.message });
}));
web_service_1.app.post("/api/cluster/reload", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functUnlinkAndLiknk } = require("../db/call-function-cluster");
    const response = yield functUnlinkAndLiknk(req.body);
    res.json({ result: response.row.main.result, data: response.row.main.message });
}));
web_service_1.app.get("/api/cluster/validation/period", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sql } = database_service_1.factory.create(zoo_pg_1.Templates.PARAMETERIZED);
    let _data = [];
    sql `
        select * from cluster.tperiod order by tperiod_id;
       `.stream((data) => {
        _data.push(data);
    }).catch(err => {
    }).finally(function () {
        return __awaiter(this, void 0, void 0, function* () {
            res.json({ periods: _data });
        });
    });
}));
web_service_1.app.get("/api/cluster/license/:cluster_uuid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadClusters } = require("../db/call-function-cluster");
    const response = yield functLoadClusters(null);
    const { generateEncryptionKey } = require("../../../lib/crypto/cryptoFile");
    let encryptor = require('simple-encryptor')(generateEncryptionKey());
    fs_1.default.mkdirSync(path_1.default.join(project_1.folders.temp, 'multer'), { recursive: true });
    let clusterRemoto = response.rows.find(value => value.data.cluster_uid === req.params.cluster_uuid);
    if (clusterRemoto) {
        let licenseIdentifier = "Luma_" + clusterRemoto.data.cluster_name + "_" + clusterRemoto.data.cluster_identifier + ".lic";
        let dados_registo = {
            cluster_identifier: clusterRemoto.data.cluster_identifier,
            cluster_code: clusterRemoto.data.cluster_code,
            cluster_api: clusterRemoto.data.cluster_api,
            cluster_domain: req.protocol + "://" + req.hostname,
            cluster_port: 80,
            cluster_type: 2,
            cluster_license: clusterRemoto.data.cluster_license,
            cluster_licenselife: clusterRemoto.data.cluster_licenselife,
            cluster_tperiod_id: clusterRemoto.data.tperiod_id
        };
        fs_1.default.writeFile(path_1.default.join(project_1.folders.temp, 'multer/' + licenseIdentifier), encryptor.encrypt(dados_registo), (err) => {
            if (err)
                return console.log(err);
            else
                res.download(path_1.default.join(project_1.folders.temp, 'multer') + "/" + licenseIdentifier, licenseIdentifier);
        });
    }
}));
web_service_1.app.post("/set/load/license", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { generateEncryptionKey } = require("../../../lib/crypto/cryptoFile");
    const { functRegCluster } = require("../db/call-function-cluster");
    let encryptor = require('simple-encryptor')(generateEncryptionKey());
    if (req.file) {
        const readable = fs_1.default.createReadStream(req.file.path);
        let cluster_data = "";
        readable.on('readable', (chunk) => {
            let buf = readable.read();
            if (buf != null) {
                cluster_data += buf.toString();
            }
        }).on('close', function () {
            return __awaiter(this, void 0, void 0, function* () {
                fs_1.default.unlinkSync(req.file.path);
                cluster_data = encryptor.decrypt(cluster_data);
                if (!hasLicenseKeyData(cluster_data)) {
                    console.log("[maguita]", `Ficheiro de licença inválido! not hasLicenseKeyData`);
                    res.json({ result: false, data: "Ficheiro de licença inválido!" });
                }
                else {
                    const response = yield functRegCluster({
                        cluster_grants: [], cluster_identifier: cluster_data["cluster_identifier"],
                        cluster_type: cluster_data["cluster_type"],
                        cluster_api: cluster_data["cluster_api"],
                        cluster_port: cluster_data["cluster_port"],
                        cluster_domain: cluster_data["cluster_domain"],
                        cluster_license: cluster_data["cluster_license"],
                        cluster_licenselife: cluster_data["cluster_licenselife"],
                        cluster_tperiod_id: cluster_data["cluster_tperiod_id"],
                        cluster_code: cluster_data["cluster_code"]
                    });
                    if (response.row.main.result) {
                        cluster_service_1.clusterServer.notifyChangeConfigs();
                        cluster_service_1.clusterServer.onceClusterEventListener(enuns_1.ClusterEvent.CONFIGS, EVENT => {
                            res.json({ result: response.row.main.result, data: response.row.main.message });
                        });
                    }
                    else
                        res.json({ result: response.row.main.result, data: response.row.main.message });
                }
            });
        }).on('end', function () {
            readable.destroy();
        });
    }
    else {
        console.log("[maguita]", `Ficheiro de licença inválido! not has req.file`);
        res.json({ result: false, data: "Ficheiro de licença inválido!" });
    }
}));
function hasLicenseKeyData(cluster) {
    return (cluster === null || cluster === void 0 ? void 0 : cluster.cluster_identifier) &&
        (cluster === null || cluster === void 0 ? void 0 : cluster.cluster_type) &&
        (cluster === null || cluster === void 0 ? void 0 : cluster.cluster_api) &&
        (cluster === null || cluster === void 0 ? void 0 : cluster.cluster_port) &&
        (cluster === null || cluster === void 0 ? void 0 : cluster.cluster_license) &&
        (cluster === null || cluster === void 0 ? void 0 : cluster.cluster_licenselife) &&
        (cluster === null || cluster === void 0 ? void 0 : cluster.cluster_code) &&
        (cluster === null || cluster === void 0 ? void 0 : cluster.cluster_tperiod_id);
}
//# sourceMappingURL=cluster.route.js.map