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
const cluster_service_1 = require("../../../service/cluster.service");
const path_1 = __importDefault(require("path"));
storage_service_1.app.post("/api/tax", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functRegistarImposto } = require("../db/call-function-settings");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    const response = yield functRegistarImposto(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.main.result, data: response.row.main.message });
    if (response.row.main.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "TAX",
            extras: null,
            message: null
        });
    }
}));
storage_service_1.app.get("/api/impostos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadImpostos } = require("../db/call-function-settings");
    const response = yield functLoadImpostos({ arg_espaco_auth: req.session.auth_data.auth.armazem_atual, arg_colaborador_id: req.session.auth_data.auth.colaborador_id });
    const fs = require("fs");
    //language=file-reference
    let taplicar = JSON.parse(fs.readFileSync(path_1.default.join(__dirname, "../../../lib/json/taplicar.json")));
    res.json({ impostos: response.rows, taplicar_data: taplicar });
}));
storage_service_1.app.post("/api/imposto/artigo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functGetArticleTax } = require("../db/call-function-settings");
    req.body.arg_espaco_auth = req.body.is_admin ? req.session.auth_data.auth.armazem_atual : req.session.user_pos.auth.armazem_atual;
    req.body.arg_colaborador_id = req.body.is_admin ? req.session.auth_data.auth.colaborador_id : req.session.user_pos.auth.colaborador_id;
    const response = yield functGetArticleTax(req.body);
    res.json({ tax: response.rows });
}));
//# sourceMappingURL=imposto.route.js.map