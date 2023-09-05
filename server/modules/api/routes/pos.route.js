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
const path_1 = __importDefault(require("path"));
const cluster_service_1 = require("../../../service/cluster.service");
storage_service_1.app.post("/api/pos/categorias", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadPosClasse } = require("../db/call-function-pos");
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    const response = yield functLoadPosClasse(req.body);
    const sexo_colaborador = req.session.user_pos.auth.tsexo_id || 1;
    const user = (sexo_colaborador === 1 ? "Operador: " : "Operadora: ") + (req.session.user_pos.auth.colaborador_nome.split(" ").shift()) + " " +
        (req.session.user_pos.auth.colaborador_apelido === null ? "" : req.session.user_pos.auth.colaborador_apelido.split(" ").pop());
    res.json({ classes: response.rows, acessos: req.session.user_pos.auth.acesso, user: user });
}));
storage_service_1.app.post("/api/artigos/categoria", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadArtigosCategoria } = require("../db/call-function-pos");
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    const response = yield functLoadArtigosCategoria(req.body);
    res.json({ artigos: response.rows });
}));
storage_service_1.app.post("/api/items/artigo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadItemsArtigo } = require("../db/call-function-pos");
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    const response = yield functLoadItemsArtigo(req.body);
    res.json({ items: response.rows });
}));
storage_service_1.app.post("/api/pos/conta", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functRegConta } = require("../db/call-function-pos");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.body.admin === undefined ? req.session.user_pos.auth.colaborador_id : req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.body.admin === undefined ? req.session.user_pos.auth.armazem_atual : req.session.auth_data.auth.armazem_atual;
    req.body.conta_posto_id = req.body.admin === undefined ? req.session.posto.posto_id : req.session.posto_admin;
    console.log(JSON.stringify(req.body, null, 2));
    const response = yield functRegConta(req.body);
    console.log(response);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.result, data: response.row });
    if (response.row.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({ event: "CREATE/UPDATE:ACCOUNT", extras: null,
            message: (req.body.conta_id ? "Conta " + response.row.data.conta_numero + " foi atualizada."
                : "Conta " + response.row.data.conta_numero + " foi criada.")
        });
    }
}));
storage_service_1.app.post("/api/pos/account/data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadContaData } = require("../db/call-function-pos");
    req.body.arg_colaborador_id = req.body.admin === undefined ? req.session.user_pos.auth.colaborador_id : req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.body.admin === undefined ? req.session.user_pos.auth.armazem_atual : req.session.auth_data.auth.armazem_atual;
    const response = yield functLoadContaData(req.body);
    res.json({ accountData: response.rows });
}));
storage_service_1.app.post("/api/cliente", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functRegCliente } = require("../db/call-function-pos");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    const response = yield functRegCliente(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.main.result, data: response.row.main.message });
    if (response.row.main.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({ event: "CREATE:CLIENT", extras: null, message: "Novo cliente registado." });
    }
}));
storage_service_1.app.post("/api/cliente/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadClients } = require("../db/call-function-pos");
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    req.body.arg_posto_id = req.session.posto.posto_id;
    const response = yield functLoadClients(req.body);
    res.json({ clients: response.rows });
}));
storage_service_1.app.post("/api/pos/conta/anular", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functAnularConta } = require("../db/call-function-pos");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_espaco_auth = req.body.place === undefined ? req.session.user_pos.auth.armazem_atual : req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.body.place === undefined ? req.session.user_pos.auth.colaborador_id : req.session.auth_data.auth.colaborador_id;
    const response = yield functAnularConta(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.main.result, data: response.row.main.message });
    if (response.row.main.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({ event: "CANCEL:ACCOUNT", extras: null, message: "Conta " + req.body.conta_numero + " foi anulada." });
    }
}));
storage_service_1.app.post("/api/pos/pay", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functRegistarPagamento } = require("../db/call-function-pos");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    const fs = require("fs");
    //language=file-reference
    let currency = JSON.parse(fs.readFileSync(path_1.default.join(__dirname, "../../../lib/json/currency.json")));
    if (req.body.coin !== null) {
        currency = currency.find(cu => cu.currency_code === req.body.coin);
        req.body.deposito.deposito_currency_id = currency.currency_id;
        req.body.deposito.deposito_posto_id = req.body.admin === undefined ? req.session.posto.posto_id : req.session.posto_admin;
        req.body.deposito.deposito_docref = req.body.documento_referencia;
        req.body.deposito.deposito_cliente_id = req.body.deposito.deposito_cliente_id === null ? "00000000-0000-0000-0000-000000000001" : req.body.deposito.deposito_cliente_id;
    }
    req.body.conta_cliente_id = req.body.conta_cliente_id === null ? "00000000-0000-0000-0000-000000000001" : req.body.conta_cliente_id;
    req.body.arg_espaco_auth = req.body.admin === undefined ? req.session.user_pos.auth.armazem_atual : req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.body.admin === undefined ? req.session.user_pos.auth.colaborador_id : req.session.auth_data.auth.colaborador_id;
    req.body.conta_posto_fecho = req.body.admin === undefined ? req.session.posto.posto_id : req.session.posto_admin;
    const response = yield functRegistarPagamento(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.main.result, data: (response.row.main.result ? response.row.main.data.guia.guia_uid : response.row.main.message) });
    if (response.row.main.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({ event: "PAYMENT:ACCOUNT", extras: null,
            message: (req.body.coin !== null ? "Payment done" : "Foi enviado para conta corrente")
        });
    }
}));
storage_service_1.app.post("/api/pos/artigo/composto/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadArtigoComposto } = require("../db/call-function-pos");
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    const response = yield functLoadArtigoComposto(req.body);
    res.json({ artigos: response.rows });
}));
storage_service_1.app.post("/api/pos/artigo/retalho", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functRegRetalho } = require("../db/call-function-pos");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    const response = yield functRegRetalho(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.main.result, data: response.row.main.message });
    if (response.row.main.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({ event: "ARTICLE:RETAIL", extras: null, message: "Foi efetuado o retalho de artigo." });
    }
}));
storage_service_1.app.post("/api/pos/conta/proforma", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functChangeContaProforma } = require("../db/call-function-pos");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.body.admin === undefined ? req.session.user_pos.auth.colaborador_id : req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.body.admin === undefined ? req.session.user_pos.auth.armazem_atual : req.session.auth_data.auth.armazem_atual;
    const response = yield functChangeContaProforma(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.main.result, data: response.row.main.message });
    if (response.row.main.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({ event: "PROFORMA:ACCOUNT", extras: null, message: "Proforma criada." });
    }
}));
storage_service_1.app.post("/api/search/articles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functSearchArtigoPOS } = require("../db/call-function-pos");
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    console.log(req.body);
    const response = yield functSearchArtigoPOS(req.body);
    console.log(response);
    res.json({ artigos: response.rows });
}));
storage_service_1.app.post("/api/change/sale/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functChangeVendaPreparado } = require("../db/call-function-pos");
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    const response = yield functChangeVendaPreparado(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.main.result, data: response.row.main.message });
    if (response.row.main.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({ event: "SALE:STATUS", extras: null, message: "Estado de preparação atualizado." });
    }
}));
//# sourceMappingURL=pos.route.js.map