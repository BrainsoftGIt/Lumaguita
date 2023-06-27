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
const storage_service_1 = require("../../../service/storage.service");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cluster_service_1 = require("../../../service/cluster.service");
storage_service_1.app.post("/api/armazem", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functRegArmazem } = require("../db/call-function-settings");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_branch_uid = req.session.auth_data.auth.branch_uuid;
    const response = yield functRegArmazem(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, message: response.row.message.text });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        if (req.body.arg_espaco_posto_admin !== null)
            req.session.posto_admin = req.body.arg_espaco_posto_admin;
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "ADD:SPACE",
            extras: null,
            message: "Armazém " + req.body.arg_espaco_nome + " foi registado."
        });
    }
}));
storage_service_1.app.post("/api/armazem/edit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functUpdateArmazem } = require("../db/call-function-settings");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = yield functUpdateArmazem(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, message: response.row.message.text });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        if (req.body.arg_espaco_posto_admin !== null)
            req.session.posto_admin = req.body.arg_espaco_posto_admin;
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "UPDATE:SPACE",
            extras: null,
            message: "Armazém " + req.body.arg_espaco_nome + " foi editado."
        });
    }
}));
storage_service_1.app.post("/api/cambio", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functRegCambio } = require("../db/call-function-settings");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    let cambios = [];
    cambios.push({
        arg_colaborador_id: req.session.auth_data.auth.colaborador_id,
        arg_currency_id: req.body.euro_currency,
        arg_espaco_auth: req.session.auth_data.auth.armazem_atual,
        arg_cambio_taxa: req.body.euro,
        arg_cambio_data: req.body.data,
        arg_branch_uid: req.session.auth_data.auth.branch_uuid
    });
    cambios.push({
        arg_colaborador_id: req.session.auth_data.auth.colaborador_id,
        arg_currency_id: req.body.usd_currency,
        arg_espaco_auth: req.session.auth_data.auth.armazem_atual,
        arg_cambio_taxa: req.body.usd,
        arg_cambio_data: req.body.data,
        arg_branch_uid: req.session.auth_data.auth.branch_uuid
    });
    cambios.push({
        arg_colaborador_id: req.session.auth_data.auth.colaborador_id,
        arg_currency_id: req.body.xaf_currency,
        arg_espaco_auth: req.session.auth_data.auth.armazem_atual,
        arg_cambio_taxa: req.body.xaf,
        arg_cambio_data: req.body.data,
        arg_branch_uid: req.session.auth_data.auth.branch_uuid
    });
    let response = null;
    for (const cam of cambios) {
        response = yield functRegCambio(cam);
    }
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, message: response.row.message.text });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "COIN",
            extras: null,
            message: "Taxa de câmbio de moedas definido."
        });
    }
}));
storage_service_1.app.post("/api/cambio/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadCambio } = require("../db/call-function-settings");
    const fs = require("fs");
    //language=file-reference
    const currency = JSON.parse(fs.readFileSync(path_1.default.join(__dirname, "../../../lib/json/currency.json")));
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = yield functLoadCambio(req.body);
    res.json({ cab: response.rows, currency: currency });
}));
storage_service_1.app.post("/api/armazem/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadArmazens } = require("../db/call-function-settings");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = yield functLoadArmazens(req.body);
    res.json({ armazens: response.rows });
}));
storage_service_1.app.post("/api/space/migrate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functMigrarEspaco } = require("../db/call-function-settings");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    const response = yield functMigrarEspaco(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.main.result, data: response.row.main.message });
    if (response.row.main.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({ event: "SPACE:MIGRATE", extras: null, message: "Espaço migrado" });
    }
}));
storage_service_1.app.post("/api/empresa/load/data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadDadosEmpresa } = require("../db/call-function-settings");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = yield functLoadDadosEmpresa(req.body);
    res.json({ empresa: response.rows });
}));
storage_service_1.app.post("/api/empresa/change", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functAtualizarDadosEmpresa } = require("../db/call-function-settings");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    let data = JSON.parse(req.body.data);
    data.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    data.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    data.arg_espaco_configuracao = null;
    if (req.file) {
        cluster_service_1.clusterServer.res.create({ resource_subpath: "cloud/data/files", resource_name: req.file.originalname,
            resource_metadata: { _branch_uid: req.session.auth_data.auth.branch_uuid }
        }).then((value) => __awaiter(void 0, void 0, void 0, function* () {
            data.dados_empresa.logo_nome = req.file.originalname;
            data.dados_empresa.logo_referencia = value.resource_url;
            data.arg_espaco_configuracao = data.dados_empresa;
            const response = yield functAtualizarDadosEmpresa(data);
            let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
            res.json({ result: response.row.result, message: response.row.message.text });
            if (response.row.result && before.cluster_version < after.cluster_version) {
                cluster_service_1.clusterServer.notifyLocalChange({
                    event: "UDPATE_COMPANY",
                    extras: null,
                    message: "Dados da instituição atualizados."
                });
                fs_1.default.rename(req.file.path, value.resolve, function (err) {
                    if (err)
                        console.error(err);
                    else
                        cluster_service_1.clusterServer.notifyLocalChange({ event: "NEW RESOURCE FILES" });
                });
            }
        }));
    }
    else {
        data.arg_espaco_configuracao = data.dados_empresa;
        const response = yield functAtualizarDadosEmpresa(data);
        let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
        res.json({ result: response.row.result, message: response.row.message.text });
        if (response.row.result && before.cluster_version < after.cluster_version) {
            cluster_service_1.clusterServer.notifyLocalChange({
                event: "UDPATE_COMPANY",
                extras: null,
                message: "Dados da instituição atualizados."
            });
        }
    }
}));
storage_service_1.app.post("/api/empresa/impressora", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functAtualizarDadosEmpresa } = require("../db/call-function-settings");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_configuracao = req.body.configPrinter;
    const response = yield functAtualizarDadosEmpresa(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, message: response.row.message.text });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "UDPATE_COMPANY:PRINTERS",
            extras: null,
            message: "Impressoras definidas."
        });
    }
}));
storage_service_1.app.post("/api/empresa/cabecalho", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functAtualizarDadosEmpresa } = require("../db/call-function-settings");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    let data = JSON.parse(req.body.data);
    data.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    data.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    data.arg_espaco_configuracao = null;
    if (req.file) {
        cluster_service_1.clusterServer.res.create({ resource_subpath: "cloud/data/files", resource_name: req.file.originalname,
            resource_metadata: { _branch_uid: req.session.auth_data.auth.branch_uuid }
        }).then((value) => __awaiter(void 0, void 0, void 0, function* () {
            data.dados_empresa.cabecalho_nome = req.file.originalname;
            data.dados_empresa.cabecalho_referencia = value.resource_url;
            data.arg_espaco_configuracao = data.dados_empresa;
            const response = yield functAtualizarDadosEmpresa(data);
            let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
            res.json({ result: response.row.result, message: response.row.message.text });
            if (response.row.result && before.cluster_version < after.cluster_version) {
                cluster_service_1.clusterServer.notifyLocalChange({
                    event: "UDPATE_COMPANY",
                    extras: null,
                    message: "Cabeçalho da instituição atualizado."
                });
                fs_1.default.rename(req.file.path, value.resolve, function (err) {
                    if (err)
                        console.error(err);
                    else
                        cluster_service_1.clusterServer.notifyLocalChange({ event: "NEW RESOURCE FILES" });
                });
            }
        }));
    }
    else
        res.json({ result: false });
}));
storage_service_1.app.get("/api/clusters/branch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadClustersBranch } = require("../db/call-function-settings");
    const response = yield functLoadClustersBranch({ arg_branch_uid: req.session.auth_data.auth.branch_uuid });
    res.json({ clusters: response.rows });
}));
storage_service_1.app.post("/api/spaces/migrate/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadSpaceMigrate } = require("../db/call-function-settings");
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_id = req.session.auth_data.auth.armazem_atual;
    const response = yield functLoadSpaceMigrate(req.body);
    res.json({ spaces: response.rows });
}));
//# sourceMappingURL=settings.route.js.map