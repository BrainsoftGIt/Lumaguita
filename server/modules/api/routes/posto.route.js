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
Object.defineProperty(exports, "__esModule", { value: true });
const storage_service_1 = require("../../../service/storage.service");
const cluster_service_1 = require("../../../service/cluster.service");
storage_service_1.app.post("/api/post/key", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functGenerateKey } = require("../db/call-function-posto");
    const { factory } = require("../../../service/database.service");
    const { Templates } = require("zoo.pg");
    let _data = [];
    let response = null;
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    const cluster_status = yield cluster_service_1.clusterServer.status();
    if (req.session.post_key === undefined) {
        response = yield functGenerateKey();
        let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
        if (before.cluster_version < after.cluster_version) {
            cluster_service_1.clusterServer.notifyLocalChange({ event: "kEY:POST", extras: null, message: "Chave de posto gerada." });
        }
        req.session.post_key = response.rows[0].funct_generate_chave.chave_temporarai;
        req.session.save(() => {
            res.json({ key: response.rows[0].funct_generate_chave.chave_temporarai,
                statusCluster: cluster_service_1.clusterServer.online,
                cluster_status: cluster_status });
        });
    }
    else {
        req.body.arg_chave_temporaria = req.session.post_key;
        const { sql } = factory.create(Templates.PARAMETERIZED);
        sql `
        select * from tweeks.funct_load_chave(${req.body}) as row
       `.stream((data) => {
            _data.push(data);
        }).catch(err => {
        }).finally(function () {
            return __awaiter(this, void 0, void 0, function* () {
                let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
                if (before.cluster_version < after.cluster_version) {
                    cluster_service_1.clusterServer.notifyLocalChange({ event: "kEY:POST", extras: null, message: "Chave de posto gerada." });
                }
                if (_data[0].row.chave_definitiva !== null)
                    res.json({ key: _data[0].row.posto_designacao, statusCluster: cluster_service_1.clusterServer.online, cluster_status: cluster_status });
                else
                    res.json({ key: _data[0].row.chave_temporarai, statusCluster: cluster_service_1.clusterServer.online, cluster_status: cluster_status });
            });
        });
    }
}));
storage_service_1.app.post("/api/remove/post/session", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.user_pos = undefined;
    res.json({ result: true });
}));
storage_service_1.app.post("/api/chave/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functloadKey } = require("../db/call-function-posto");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = yield functloadKey(req.body);
    res.json({ keys: response.rows });
}));
storage_service_1.app.post("/api/posto/data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.post_key !== undefined) {
        const { functLoadPostoEspaco } = require("../db/call-function-posto");
        const response = yield functLoadPostoEspaco({ arg_chave_temporaria: req.session.post_key });
        req.session.posto = undefined;
        if (response.rows[0].data.chave_definitiva) {
            req.session.posto = response.rows[0].data;
            req.session.posto.spaces = response.rows.filter(value => { var _a; return (_a = value === null || value === void 0 ? void 0 : value.data) === null || _a === void 0 ? void 0 : _a.espaco_id; });
        }
        setTimeout(() => {
            req.session.save(() => {
                res.json({ post: response.rows[0].data, modeView: (req.session.dark_mode === undefined ? false : req.session.dark_mode),
                    hasSession: (req.session.user_pos !== undefined),
                    pos_user_session_uuid: (req.session.user_pos !== undefined ? req.session.user_pos.auth.colaborador_id : ""),
                    pos_user_name: (req.session.user_pos !== undefined ? req.session.user_pos.auth.colaborador_nome : "") });
            });
        }, 1000);
    }
    else {
        res.json({ not_registrated: true });
    }
}));
storage_service_1.app.post("/api/verify/user/space", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { validate_user_space, getDefaultSpace } = require("./functions/userDefaultSpace");
    if (req.session.user_pos !== undefined) {
        let response = yield validate_user_space(req.session.user_pos.espaco_trabalha, req.session.posto.spaces);
        if (response.result) {
            const userSpaces = response.spaces;
            response = yield getDefaultSpace(req, req.session.user_pos.auth.colaborador_id, userSpaces);
            res.json({ result: true, space_id: response, user_spaces: userSpaces });
        }
        else
            res.json({ result: false, message: response.message });
    }
    else
        res.json({ result: false, message: "Sessão de colaborador não foi encontrada!" });
}));
storage_service_1.app.post("/api/posto/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functloadPosto } = require("../db/call-function-posto");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = yield functloadPosto(req.body);
    req.body.arg_aloca_espaco = req.session.auth_data.auth.armazem_atual;
    const postosEspaco = yield functloadPosto(req.body);
    res.json({ postos: response.rows, postosEspaco: postosEspaco.rows });
}));
storage_service_1.app.post("/api/posto", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functRegPosto } = require("../db/call-function-posto");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = yield functRegPosto(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, message: response.row.message.text });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "ADD:POST",
            extras: null,
            message: "Posto " + req.body.arg_posto_designacao + " foi registado."
        });
    }
}));
storage_service_1.app.post("/api/posto/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functChangeStatusPosto } = require("../db/call-function-posto");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = yield functChangeStatusPosto(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, message: response.row.message.text });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({ event: "CHANGE_STATUS:POST", extras: null, message: "Estado de posto foi alterado." });
    }
}));
storage_service_1.app.post("/api/posto/associar", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functAssociarPosto } = require("../db/call-function-posto");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    const response = yield functAssociarPosto(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, message: response.row.message.text });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "ASSOCIATE:POST",
            extras: null,
            message: "Posto foi associado."
        });
    }
}));
storage_service_1.app.post("/api/posto/caixa/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadCaixa } = require("../db/call-function-posto");
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    req.body.arg_posto_id = req.session.posto.posto_id;
    const response = yield functLoadCaixa(req.body);
    res.json({ caixas: response.rows });
}));
storage_service_1.app.post("/api/post/box/open", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functAbrirCaixa } = require("../db/call-function-posto");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    req.body.arg_posto_id = req.session.posto.posto_id;
    const response = yield functAbrirCaixa(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.main.result, data: response.row.main.message });
    if (response.row.main.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "OPEN:BOX",
            extras: null,
            message: "Caixa foi aberta."
        });
    }
}));
storage_service_1.app.post("/api/post/box/close", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functFecharCaixa } = require("../db/call-function-posto");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    const response = yield functFecharCaixa(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.main.result, data: response.row.main.message });
    if (response.row.main.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "CLOSE:BOX",
            extras: null,
            message: "Caixa foi fechada."
        });
    }
}));
storage_service_1.app.post("/api/post/sales", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadSales } = require("../db/call-function-posto");
    req.body.arg_posto_id = req.session.posto.posto_id;
    const response = yield functLoadSales(req.body);
    res.json({ vendas: response.rows });
}));
//# sourceMappingURL=posto.route.js.map