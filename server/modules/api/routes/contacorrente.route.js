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
storage_service_1.app.post("/api/cliente/admin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functRegCliente } = require("../db/call-function-pos");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = yield functRegCliente(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json(Object.assign({ result: response.row.main.result, data: response.row.main.message }, response.row.main));
    if (response.row.main.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "CREATE:CLIENT",
            extras: null,
            message: "Novo cliente registado."
        });
    }
}));
storage_service_1.app.post("/api/clientes/admin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadClients } = require("../db/call-function-contacorrrente");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = yield functLoadClients(req.body);
    res.json({ customers: response.rows });
}));
storage_service_1.app.get("/api/cambios", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadCambio } = require("../db/call-function-contacorrrente");
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = yield functLoadCambio(req.body);
    res.json({ cambio_ativos: response.rows });
}));
storage_service_1.app.post("/api/launchs/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadLaunchs } = require("../db/call-function-contacorrrente");
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = yield functLoadLaunchs(req.body);
    res.json({ launchs: response.rows });
}));
storage_service_1.app.post("/api/deposito", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functRegistarDeposito } = require("../db/call-function-contacorrrente");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = yield functRegistarDeposito(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.main.result, data: (response.row.main.result ? response.row : response.row.main.message) });
    if (response.row.main.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "PAYMENT:DEBIT",
            extras: null,
            message: "Pagamento de fatura na conta corrente."
        });
    }
}));
storage_service_1.app.post("/api/lancamento", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functRegistarLancamento } = require("../db/call-function-contacorrrente");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = yield functRegistarLancamento(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.main.result, data: (response.row.main.result ? response.row : response.row.main.message) });
    if (response.row.main.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "LAUNCH",
            extras: null,
            message: "Launch done."
        });
    }
}));
//registo de colaborador branch= colaborador_colaborador_id, nome, email, acessos
//registo de espaco branch = vender obrigatorio em baixo de pano, colaborador_id, espaco default, nome, codigo
//# sourceMappingURL=contacorrente.route.js.map