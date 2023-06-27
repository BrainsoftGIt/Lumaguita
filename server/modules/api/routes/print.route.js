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
exports.load_space_configuration = void 0;
const web_service_1 = require("../../../service/web.service");
const call_function_pos_1 = require("../db/call-function-pos");
function load_space_configuration(req, admin) {
    return __awaiter(this, void 0, void 0, function* () {
        const { functLoadDadosEmpresa } = require("../db/call-function-settings");
        req.body.arg_espaco_auth = admin ? req.session.auth_data.auth.armazem_atual : req.session.user_pos.auth.armazem_atual;
        return (yield functLoadDadosEmpresa(req.body)).rows;
    });
}
exports.load_space_configuration = load_space_configuration;
function get_printer_name(printers, operation_code) {
    let printer_operation = printers.find(pri => pri.operacao.codigo === operation_code);
    return printer_operation ? (printer_operation.impressoras.nome || printer_operation.impressoras.ip) : null;
}
web_service_1.app.post("/api/space/config/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ config: yield load_space_configuration(req, req.body.admin) });
}));
web_service_1.app.get("/api/print/proforma/:dados", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadProformas } = require("../db/call-function-conta");
    const file = require("./functions/export-proforma");
    req.body.arg_posto_id = req.session.posto_admin;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    let dados = JSON.parse(req.params.dados);
    let proformas = yield functLoadProformas(req.body);
    let user = req.session.auth_data.auth.colaborador_nome + " " + (req.session.auth_data.auth.colaborador_apelido === null ? "" : req.session.auth_data.auth.colaborador_apelido.split(" ").pop());
    const dadosConta = yield (0, call_function_pos_1.functLoadContaData)({ arg_conta_id: dados.conta_id, with_client: true, arg_espaco_auth: req.session.auth_data.auth.armazem_atual,
        arg_colaborador_id: req.session.auth_data.auth.colaborador_id });
    let proformaCliente = proformas.rows.filter(prof => prof.data.conta_id === dados.conta_id);
    let instituition = yield load_space_configuration(req, true);
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    if (proformaCliente.length > 0) {
        proformaCliente[0].data.cliente_email = dadosConta.rows[0].main.cliente_mail;
        proformaCliente[0].data.cliente_contacto = dadosConta.rows[0].main.cliente_contactos[0];
        yield file.create(instituition, proformaCliente[0].data, dadosConta.rows[0], res, user, dados.date, null);
    }
}));
web_service_1.app.get("/api/print/fatura/recibo/:dados", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let dados = JSON.parse(req.params.dados);
    const dadosConta = yield (0, call_function_pos_1.functLoadContaData)({ arg_conta_id: dados.conta_id, with_client: true, arg_espaco_auth: req.session.user_pos.auth.armazem_atual,
        arg_colaborador_id: req.session.user_pos.auth.colaborador_id });
    const file = require("./functions/export-faturarecibo");
    let instituition = yield load_space_configuration(req, false);
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    let user = req.session.user_pos.auth.colaborador_nome + " " + (req.session.user_pos.auth.colaborador_apelido === null ? "" : req.session.user_pos.auth.colaborador_apelido.split(" ").pop());
    yield file.create(instituition, dadosConta.rows, res, user, dados.date, dadosConta.rows[0].main.conta_serie.serie_numatorizacao);
}));
web_service_1.app.post("/api/print/fatura/recibo/talao", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dadosConta = yield (0, call_function_pos_1.functLoadContaData)({ arg_conta_id: req.body.conta_id, with_client: true, arg_espaco_auth: req.session.user_pos.auth.armazem_atual,
        arg_colaborador_id: req.session.user_pos.auth.colaborador_id });
    const fatura_recibo_talao = require("./functions/export-faturarecibo-talao");
    let instituition = yield load_space_configuration(req, false);
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    let user = req.session.user_pos.auth.colaborador_nome + " " + (req.session.user_pos.auth.colaborador_apelido === null ? "" : req.session.user_pos.auth.colaborador_apelido.split(" ").pop());
    const printer_name = get_printer_name(instituition.espaco_configuracao.configuracao_impressoras, "fatura_recibo");
    yield fatura_recibo_talao.create(instituition, dadosConta.rows, res, user, req.body.date, printer_name, dadosConta.rows[0].main.conta_serie.serie_numatorizacao);
}));
web_service_1.app.get("/api/print/transference/:dados", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let dados = JSON.parse(req.params.dados);
    const file = require("./functions/export-trasferencia");
    let instituition = yield load_space_configuration(req, true);
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    let user = req.session.auth_data.auth.colaborador_nome + " " + (req.session.auth_data.auth.colaborador_apelido === null ? "" : req.session.auth_data.auth.colaborador_apelido.split(" ").pop());
    yield file.create(instituition, req.session.transference_data.arg_transferencias, {
        armazem_origem: req.session.transference_data.arg_espaco_origem_nome,
        armazem_destino: req.session.transference_data.arg_espaco_destino_nome,
        armazem_origem_codigo: req.session.transference_data.arg_espaco_origem_codigo,
        armazem_destino_codigo: req.session.transference_data.arg_espaco_destino_codigo
    }, res, user, dados.date);
}));
web_service_1.app.get("/api/print/guia_entrada/:dados", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let dados = JSON.parse(req.params.dados);
    const file = require("./functions/export-guia");
    const { funct_load_guia_data } = require("../db/call-function-article");
    let instituition = yield load_space_configuration(req, true);
    const response = yield funct_load_guia_data({ arg_colaborador_id: req.session.auth_data.auth.colaborador_id,
        arg_espaco_id: req.session.auth_data.auth.armazem_atual, guia_uid: dados.guia_uuid });
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    const custoguia = response.rows.filter(ent => { var _a; return ((_a = ent.data.data) === null || _a === void 0 ? void 0 : _a.custoguia_uid) !== undefined; });
    const fornecedor = response.rows.filter(ent => { var _a; return ((_a = ent.data.data) === null || _a === void 0 ? void 0 : _a.fornecedor_id) !== undefined; });
    const artigos = response.rows.filter(ent => { var _a; return ((_a = ent.data.data) === null || _a === void 0 ? void 0 : _a.entrada_id) !== undefined; });
    const guia = response.rows[0].data.data;
    let user = req.session.auth_data.auth.colaborador_nome + " " + (req.session.auth_data.auth.colaborador_apelido === null ? "" : req.session.auth_data.auth.colaborador_apelido.split(" ").pop());
    yield file.create(instituition, fornecedor[0].data.data, guia, artigos, res, user, custoguia);
}));
web_service_1.app.get("/api/print/guia_saida/:dados", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let dados = JSON.parse(req.params.dados);
    const file = require("./functions/export-guia-saida");
    const { funct_load_guia_data } = require("../db/call-function-article");
    let instituition = yield load_space_configuration(req, true);
    const response = yield funct_load_guia_data({ arg_colaborador_id: req.session.auth_data.auth.colaborador_id,
        arg_espaco_auth: req.session.auth_data.auth.armazem_atual, guia_uid: dados.guia_uuid, arg_conta_id: dados.conta_id });
    const dadosConta = yield (0, call_function_pos_1.functLoadContaData)({ arg_conta_id: dados.conta_id, with_client: true, arg_espaco_auth: req.session.auth_data.auth.armazem_atual,
        arg_colaborador_id: req.session.auth_data.auth.colaborador_id });
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    const guia = response.rows[0].data.data;
    let user = req.session.auth_data.auth.colaborador_nome + " " + (req.session.auth_data.auth.colaborador_apelido === null ? "" : req.session.auth_data.auth.colaborador_apelido.split(" ").pop());
    yield file.create(instituition, dadosConta.rows[0], res, user, dadosConta.rows[0].main.conta_serie.serie_numatorizacao, guia);
}));
web_service_1.app.get("/api/print/fatura/:dados", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let conta = JSON.parse(req.params.dados);
    const file = require("./functions/export-fatura");
    const fatura_talao = require("./functions/export-fatura-talao");
    let instituition = yield load_space_configuration(req, conta.admin);
    let dadosConta;
    let user;
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    if (conta.admin) {
        dadosConta = yield (0, call_function_pos_1.functLoadContaData)({ arg_conta_id: conta.conta_id,
            with_client: true, arg_espaco_auth: req.session.auth_data.auth.armazem_atual, arg_colaborador_id: req.session.auth_data.auth.colaborador_id });
        user = req.session.auth_data.auth.colaborador_nome + " " + (req.session.auth_data.auth.colaborador_apelido === null ? "" : req.session.auth_data.auth.colaborador_apelido.split(" ").pop());
    }
    else {
        dadosConta = yield (0, call_function_pos_1.functLoadContaData)({ arg_conta_id: conta.conta_id,
            with_client: true, arg_espaco_auth: req.session.user_pos.auth.armazem_atual, arg_colaborador_id: req.session.user_pos.auth.colaborador_id });
        user = req.session.user_pos.auth.colaborador_nome + " " + (req.session.user_pos.auth.colaborador_apelido === null ? "" : req.session.user_pos.auth.colaborador_apelido.split(" ").pop());
    }
    if (conta.type === "pdf")
        yield file.create(instituition, dadosConta.rows[0], res, user, conta.date, dadosConta.rows[0].main.conta_serie.serie_numatorizacao);
    else {
        const printer_name = get_printer_name(instituition.espaco_configuracao.configuracao_impressoras, "fatura");
        yield fatura_talao.create(instituition, dadosConta.rows[0], res, user, conta.date, printer_name, dadosConta.rows[0].main.conta_serie.serie_numatorizacao);
    }
}));
web_service_1.app.post("/api/print/fatura/talao", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fatura_talao = require("./functions/export-fatura-talao");
    let instituition = yield load_space_configuration(req, false);
    let dadosConta;
    let user;
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    dadosConta = yield (0, call_function_pos_1.functLoadContaData)({ arg_conta_id: req.body.conta_id,
        with_client: true, arg_espaco_auth: req.session.user_pos.auth.armazem_atual, arg_colaborador_id: req.session.user_pos.auth.colaborador_id });
    user = req.session.user_pos.auth.colaborador_nome + " " + (req.session.user_pos.auth.colaborador_apelido === null ? "" : req.session.user_pos.auth.colaborador_apelido.split(" ").pop());
    const printer_name = get_printer_name(instituition.espaco_configuracao.configuracao_impressoras, "fatura");
    yield fatura_talao.create(instituition, dadosConta.rows[0], res, user, req.body.date, printer_name, dadosConta.rows[0].main.conta_serie.serie_numatorizacao);
}));
web_service_1.app.get("/api/print/recibo/:dados", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const file = require("./functions/export-recibo");
    const { functLoadDepositoData } = require("../db/call-function-contacorrrente");
    const { functLoadSeries } = require("../db/call-function-efatura");
    let dados = JSON.parse(req.params.dados);
    let response = yield functLoadDepositoData({ deposito_id: dados.deposito });
    let instituition = yield load_space_configuration(req, dados.admin);
    let serie = yield functLoadSeries({ arg_espaco_auth: req.session.auth_data.auth.armazem_atual });
    const tipo_fatura_recibo = 3;
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    let user = req.session.auth_data.auth.colaborador_nome + " " + (req.session.auth_data.auth.colaborador_apelido === null ? "" : req.session.auth_data.auth.colaborador_apelido.split(" ").pop());
    serie = serie.rows.find(value => value.data.serie_tserie_id === tipo_fatura_recibo);
    yield file.create(instituition, response.rows, dados.client, res, user, dados.date, (((_a = serie === null || serie === void 0 ? void 0 : serie.data) === null || _a === void 0 ? void 0 : _a.serie_numatorizacao) || null), (((_b = serie === null || serie === void 0 ? void 0 : serie.data) === null || _b === void 0 ? void 0 : _b.serie_numero) || null));
}));
web_service_1.app.get("/api/print/conta/:dados", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let dados = JSON.parse(req.params.dados);
    const conta_pdf = require("./functions/export-conta");
    req.body.arg_posto_id = req.session.posto.posto_id;
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    const dadosConta = yield (0, call_function_pos_1.functLoadContaData)({ arg_conta_id: dados.conta_id, with_client: true, arg_espaco_auth: req.session.user_pos.auth.armazem_atual,
        arg_colaborador_id: req.session.user_pos.auth.colaborador_id });
    let user = req.session.user_pos.auth.colaborador_nome + " " + (req.session.user_pos.auth.colaborador_apelido === null ? "" : req.session.user_pos.auth.colaborador_apelido.split(" ").pop());
    let instituition = yield load_space_configuration(req, dados.admin);
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    yield conta_pdf.create(instituition, dadosConta.rows[0], res, user, dados.date, null);
}));
web_service_1.app.post("/api/print/conta/talao", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = require("./functions/export-conta-talao");
    req.body.arg_posto_id = req.session.posto.posto_id;
    req.body.arg_colaborador_id = req.session.user_pos.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.user_pos.auth.armazem_atual;
    const dadosConta = yield (0, call_function_pos_1.functLoadContaData)({ arg_conta_id: req.body.conta_id, with_client: true, arg_espaco_auth: req.session.user_pos.auth.armazem_atual,
        arg_colaborador_id: req.session.user_pos.auth.colaborador_id });
    let user = req.session.user_pos.auth.colaborador_nome + " " + (req.session.user_pos.auth.colaborador_apelido === null ? "" : req.session.user_pos.auth.colaborador_apelido.split(" ").pop());
    let instituition = yield load_space_configuration(req, false);
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    const printer_name = get_printer_name(instituition.espaco_configuracao.configuracao_impressoras, "conta");
    yield file.create(instituition, dadosConta.rows[0], res, user, req.body.date, printer_name);
}));
web_service_1.app.post("/api/print/fecho/caixa/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = require("./functions/export-fechocaixa-talao");
    let instituition = yield load_space_configuration(req, false);
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    let user = req.session.user_pos.auth.colaborador_nome + " " + (req.session.user_pos.auth.colaborador_apelido === null ? "" : req.session.user_pos.auth.colaborador_apelido.split(" ").pop());
    const printer_name = get_printer_name(instituition.espaco_configuracao.configuracao_impressoras, "caixa");
    yield file.create(instituition, req.body, res, user, printer_name);
}));
web_service_1.app.post("/api/print/kitchen", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f;
    const { printNetwork } = require("./functions/kitchenArticlesNetwork");
    const { create } = require("./functions/kitchenArticlesTalao");
    let instituition = yield load_space_configuration(req, false);
    instituition = instituition[0].funct_load_espaco_configuracao.espaco;
    if (!((_d = (_c = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _c === void 0 ? void 0 : _c.impressoras_cozinha) === null || _d === void 0 ? void 0 : _d.ip)) {
        yield create(instituition, req.body.articles, res, req.body.date, req.body.table, req.body.obs);
    }
    else if ((_f = (_e = instituition === null || instituition === void 0 ? void 0 : instituition.espaco_configuracao) === null || _e === void 0 ? void 0 : _e.impressoras_cozinha) === null || _f === void 0 ? void 0 : _f.ip) {
        yield printNetwork({ articles: req.body.articles, table: req.body.table,
            idPrinter: instituition.espaco_configuracao.impressoras_cozinha.ip });
    }
}));
//# sourceMappingURL=print.route.js.map