"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const web_service_1 = require("../../../service/web.service");
const cluster_service_1 = require("../../../service/cluster.service");
const path = __importStar(require("path"));
web_service_1.app.post("/api/branch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functSetBranch } = require("../db/call-function-branch");
    req.body.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.branch_user.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.branch_workspace.arg_colaborador_id = req.session.auth_data.auth.colaborador_id;
    req.body.branch_user.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.branch_workspace.arg_espaco_auth = req.session.auth_data.auth.armazem_atual;
    req.body.arg_espaco_id = req.session.auth_data.auth.armazem_atual;
    const response = yield functSetBranch(req.body);
    cluster_service_1.clusterServer.notifyLocalChange({
        event: "NEW-BRANCH-SETS",
        message: "OLA MUNDO",
        extras: { branch: "LAlALALA" }
    });
    res.json({ result: response.row.main.result, data: response.row.main.message });
}));
web_service_1.app.get("/api/branch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadBranch } = require("../db/call-function-branch");
    const response = yield functLoadBranch(null);
    res.json({ branchs: response.rows });
}));
web_service_1.app.get("/api/path/clusters", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadPaths } = require("../db/call-function-branch");
    const response = yield functLoadPaths(null);
    res.json({ paths: response.rows });
}));
web_service_1.app.get("/api/all/menus", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { functLoadAllMenus } = require("../db/call-function-branch");
    const response = yield functLoadAllMenus(null);
    res.json({ menus: response.rows });
}));
web_service_1.app.post("/api/send/crashdump", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { crashDump } = require("../../../service/log.service/crashdump");
    crashDump().then((value) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(value);
        const { mailSender } = require("../../../service/mail/index");
        const { K } = require("../../../service/mail/K");
        let remetente = "";
        let filename = value.zipFile.split("/");
        const mails = yield mailSender.sendMail({
            from: `"${remetente}" <${K.MAIL.email}>`,
            to: `"${K.MAIL.name}" <${K.MAIL.email_receiver}>`,
            subject: "Luma - crush dump",
            html: `Segue em anexo, o ficheiro com os erros no software Luma.`,
            attachments: [
                {
                    filename: filename[filename.length - 1],
                    path: path.join(__dirname, value.zipFile)
                }
            ]
        });
        console.log(mails);
    }));
}));
//# sourceMappingURL=branch.route.js.map