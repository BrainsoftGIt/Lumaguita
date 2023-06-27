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
const storage_service_1 = require("../../../../service/storage.service");
const print_route_1 = require("../print.route");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const project_1 = require("../../../../global/project");
storage_service_1.app.post("/api/clinica/consulta/set", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functSetConsulta } = require("../../db/clinic/call-function-consulta");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_branch_uid = req.session.auth_data.auth.branch_uuid;
    console.log(req.body);
    let response = yield functSetConsulta(req.body);
    res.json({ response });
}));
storage_service_1.app.post("/api/clinica/consulta/load", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadConsulta } = require("../../db/clinic/call-function-consulta");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_branch_uid = req.session.auth_data.auth.branch_uuid;
    let response = yield functLoadConsulta(req.body);
    res.json({
        data: response.rows.map(({ data }) => {
            return data;
        })
    });
}));
storage_service_1.app.post("/api/clinica/consulta/load/data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadConsultaData } = require("../../db/clinic/call-function-consulta");
    req.body.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.arg_branch_uid = req.session.auth_data.auth.branch_uuid;
    let response = yield functLoadConsultaData(req.body);
    res.json({
        data: response.rows.map(({ data }) => {
            return data;
        })
    });
}));
function createPDFReceita(req, file, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = JSON.parse(req.params.data);
        let fileData = fs_1.default.readFileSync(path_1.default.join(project_1.folders.temp, data.file));
        let { client, tratamento, utente } = JSON.parse(fileData.toString());
        let { 0: { funct_load_espaco_configuracao: { espaco } } } = yield (0, print_route_1.load_space_configuration)(req, true);
        let user = req.session.auth_data.auth.colaborador_nome + " " + (req.session.auth_data.auth.colaborador_apelido === null ? "" : req.session.auth_data.auth.colaborador_apelido.split(" ").pop());
        fs_1.default.unlinkSync(path_1.default.join(project_1.folders.temp, data.file));
        yield file.create(espaco, res, user, client, utente, tratamento);
    });
}
storage_service_1.app.get("/api/clinica/consulta/export/receita/a4/:data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = require("../functions/clinic/export-receita-A4");
    yield createPDFReceita(req, file, res);
}));
storage_service_1.app.post("/api/clinica/consulta/export/receita/data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let random = (Math.random() + 1).toString(36).substring(7);
    let data = new Date();
    let file = `${random}-${data.getSeconds()}.json`;
    fs_1.default.writeFile(path_1.default.join(project_1.folders.temp, file), JSON.stringify(req.body), function (err) {
        if (err)
            return console.log(err);
        res.json(file);
    });
}));
storage_service_1.app.get("/api/clinica/consulta/export/receita/a5/:data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = require("../functions/clinic/export-receita-A5");
    yield createPDFReceita(req, file, res);
}));
//# sourceMappingURL=consultas.route.js.map