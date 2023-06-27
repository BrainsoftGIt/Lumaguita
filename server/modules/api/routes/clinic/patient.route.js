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
storage_service_1.app.post("/api/clinica/paciente/set", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functSetPatient } = require("../../db/clinic/call-function-patient");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_branch_uid = req.session.auth_data.auth.branch_uuid;
    let response = yield functSetPatient(req.body);
    res.json({ response });
}));
storage_service_1.app.post("/api/clinica/paciente/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadPatient } = require("../../db/clinic/call-function-patient");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_branch_uid = req.session.auth_data.auth.branch_uuid;
    req.body.branch = req.session.auth_data.auth.branch_uuid;
    let response = yield functLoadPatient(req.body);
    res.json({
        data: response.rows.map(({ data }) => {
            return data;
        })
    });
}));
//# sourceMappingURL=patient.route.js.map