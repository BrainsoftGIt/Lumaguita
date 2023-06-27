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
const call_function_efatura_1 = require("../db/call-function-efatura");
storage_service_1.app.post("/api/efatura", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functRegSerie } = require("../db/call-function-efatura");
    let before = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    const response = yield functRegSerie(req.body);
    let after = yield cluster_service_1.clusterServer.service.loadLocalCluster();
    res.json({ result: response.row.main.result, data: response.row.main.message });
    if (response.row.main.result && before.cluster_version < after.cluster_version) {
        cluster_service_1.clusterServer.notifyLocalChange({
            event: "SERIE:INVOICE",
            extras: null,
            message: (req.body.serie_id === null ? "Série definida com sucesso!" : "Série atualizada com sucesso!")
        });
    }
}));
storage_service_1.app.post("/api/efatura/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.arg_espaco_auth = req.body.place === "admin" ? req.session.auth_data.auth.armazem_atual : req.session.user_pos.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    if (req.body.list_type_series === undefined) {
        const { functLoadSeries } = require("../db/call-function-efatura");
        let response = yield functLoadSeries(req.body);
        res.json({ series: response.rows });
    }
    else {
        let missing_serie = [];
        let response = yield (0, call_function_efatura_1.functLoadSeriesAvailable)(req.body);
        req.body.list_type_series.forEach(tipo => {
            if (response.rows.find(value => parseInt(value.data.tserie_id) === tipo) === undefined) {
                missing_serie.push(tipo);
            }
        });
        res.json({ series: missing_serie });
    }
}));
//# sourceMappingURL=efatura.route.js.map