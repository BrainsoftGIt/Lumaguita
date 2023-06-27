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
const storage_service_1 = require("../../../../service/storage.service");
storage_service_1.app.post("/api/clinica/fixacao/set", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functSetItens } = require("../../db/clinic/call-function-fixacao");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_branch_uid = req.session.auth_data.auth.branch_uuid;
    let response = yield functSetItens(req.body);
    res.json(response);
}));
storage_service_1.app.post("/api/clinica/fixacao/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadItens } = require("../../db/clinic/call-function-fixacao");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_branch_uid = req.session.auth_data.auth.branch_uuid;
    let response = yield functLoadItens(req.body);
    res.json({
        data: response.rows.map(({ data }) => {
            return data;
        })
    });
}));
storage_service_1.app.post("/api/clinica/fixacao/loads", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadItens } = require("../../db/clinic/call-function-fixacao");
    let datas = {};
    for (const load of req.body.lods) {
        load.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
        load.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
        load.arg_branch_uid = req.session.auth_data.auth.branch_uuid;
        let response = yield functLoadItens(load);
        datas[load.parmName] = response.rows.map(({ data }) => {
            return data;
        });
    }
    res.json(datas);
}));
//# sourceMappingURL=fixacao.route.js.map